import React, { useState } from 'react';
import { Button, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@material-ui/core';
import { Save } from '@material-ui/icons';
import { UserAddOutlined } from '@ant-design/icons';

function AddPerson({ contract, account, setAddedPerson, isPermitted, setSnackBar }) {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const addPerson = () => {
    setSnackBar('Sending request... please wait.', 'info');
    contract.methods
      .registerPerson(id, name, parseInt(age))
      .send({ from: account })
      .then((res) => {
        setAddedPerson(true);
        setSnackBar(`Successfully added person ${(name, id)}.\nRefresh the page to see the changes.`, 'success');
      })
      .catch((err) => {
        setAddedPerson(false);
        setSnackBar('An error has been occured.', 'error');
      });
  };

  const handleChange = (event) => {
    const event_id = event.target.id;
    const value = event.target.value;
    switch (event_id) {
      case 'name':
        setName(value);
        break;
      case 'id':
        setId(value);
        break;
      case 'age':
        setAge(value);
        break;
      default:
        break;
    }
  };

  const handleDialogState = () => {
    setDialogOpen(!dialogOpen);
  };

  return (
    <div className="table-button">
      <IconButton className="register" onClick={handleDialogState} disabled={!isPermitted}>
        <UserAddOutlined />
      </IconButton>
      <Dialog open={dialogOpen} onClose={handleDialogState} aria-labelledby="form-dialog-title">
        <DialogTitle>Register Person</DialogTitle>
        <DialogContent>
          <DialogContentText>Register a new person to the blockchain database.</DialogContentText>
          <TextField autoFocus margin="dense" id="name" label="Name" type="text" fullWidth onChange={handleChange} helperText="over 3 characters" />
          <TextField margin="dense" id="id" label="ID" type="text" className="mr-4" onChange={handleChange} helperText="Israeli identification number" />
          <TextField margin="dense" id="age" label="Age" type="number" onChange={handleChange} helperText="0-120" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogState} color="primary">
            Cancel
          </Button>
          <Button onClick={addPerson} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AddPerson;
