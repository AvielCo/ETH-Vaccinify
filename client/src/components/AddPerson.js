import React, { useState } from 'react';
import { Button, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, FormControl } from '@material-ui/core';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { UserAddOutlined } from '@ant-design/icons';
import { validateID } from '../Validators';
import { useForm, Controller } from 'react-hook-form';

function AddPerson({ contract, account, setAddedPerson, isPermitted, setSnackBar }) {
  const [age, setAge] = useState(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isValidDate, setIsValidDate] = useState(false);

  const { control, errors, handleSubmit } = useForm();

  const registerPerson = (id, name, age) => {
    setSnackBar('Sending request... please wait.', 'info');
    contract.methods
      .registerPerson(id, name, age)
      .send({ from: account, gas: 3000000, gasPrice: 20000000000 })
      .then((res) => {
        setAddedPerson(true);
        setSnackBar(`Successfully added person ${(name, id)}.\nRefresh the page to see the changes.`, 'success');
      })
      .catch((err) => {
        setAddedPerson(false);
        setSnackBar('An error has been occured.', 'error');
      });
  };

  const handleDateChange = (date) => {
    if (date) {
      const today = new Date().getTime();
      const msDate = date.getTime();
      if (!isNaN(msDate) && msDate > -2204707540000 && msDate <= today) {
        setAge(msDate);
        setIsValidDate(true);
        return;
      }
    }
    setIsValidDate(false);
  };

  const handleDialogState = () => {
    setDialogOpen(!dialogOpen);
  };

  const calculateAge = () => {
    const diff = new Date(parseInt(new Date() - new Date(parseInt(age))));
    return diff.getUTCFullYear() - 1970;
  };

  const onSubmit = (data) => {
    console.log(isValidDate);
    if (!isValidDate) return;
    const birthDate = new Date(age).getTime();
    console.log(data);
    console.log(birthDate);
    registerPerson(data.id, data.fullName, birthDate);
  };

  return (
    <div className="table-button">
      <IconButton className="register" onClick={handleDialogState} disabled={!isPermitted}>
        <UserAddOutlined />
      </IconButton>
      <Dialog open={dialogOpen} onClose={handleDialogState} aria-labelledby="form-dialog-title">
        <DialogTitle>Register Person</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <DialogContentText>Register a new person to the blockchain database.</DialogContentText>
            <div className="row row-cols-auto p-2">
              <FormControl fullWidth>
                <Controller
                  name="fullName"
                  as={<TextField autoFocus error={errors?.fullName} helperText={errors?.fullName ? errors?.fullName?.message : null} margin="dense" id="name" label="Name" />}
                  control={control}
                  defaultValue=""
                  rules={{
                    required: 'Required',
                    minLength: { value: 3, message: 'Name too short' },
                    maxLength: { value: 40, message: 'Name too long' },
                    pattern: { value: /(?=^.{0,40}$)^[a-zA-Z-]+\s[a-zA-Z-]+$/g, message: "Name must consist '<FirstName> <LastName>' " },
                  }}
                />
              </FormControl>
              <FormControl>
                <Controller
                  name="id"
                  as={<TextField margin="dense" id="id" error={errors?.id} helperText={errors?.id ? errors?.id.message : null} label="ID" className="mr-4" />}
                  defaultValue=""
                  control={control}
                  rules={{
                    required: 'Required',
                    minLength: { value: 9, message: 'ID must have 9 digits' },
                    maxLength: { value: 9, message: 'ID must have 9 digits' },
                    // validate: validateID,
                  }}
                />
              </FormControl>

              <div className="row">
                <MuiPickersUtilsProvider className="col" utils={DateFnsUtils}>
                  <KeyboardDatePicker margin="dense" format="dd/MM/yyyy" id="age" name="age" label="Birth date" onChange={handleDateChange} value={age} />
                </MuiPickersUtilsProvider>
                <div className="col pt-4">
                  <label>Age: {calculateAge()}</label>
                </div>
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button type="submit" color="primary">
              Submit
            </Button>
            <Button onClick={handleDialogState} color="secondary">
              Cancel
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

export default AddPerson;
