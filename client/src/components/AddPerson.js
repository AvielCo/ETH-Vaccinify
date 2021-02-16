import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@material-ui/core';

function AddPerson({ contract, account, registerPerson, isPermitted, setSnackBar }) {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const addPerson = () => {
    contract.methods
      .createPerson(name, id, parseInt(age))
      .send({ from: account })
      .then((res) => {
        setSnackBar(`Successfully added person ${(name, id)}.\nRefresh the page to see the changes.`, 'success');
      })
      .catch((err) => {
        setSnackBar(err, 'error');
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

  const refresh = () => {
    window.location.reload(false);
  };

  return (
    <div className="table" style={{ background: '#484848', position: 'absolute' }}>
      <Button className="register" onClick={handleDialogState} color="secondary" disabled={!isPermitted}>
        Register
      </Button>
      <Dialog open={dialogOpen} onClose={handleDialogState} aria-labelledby="form-dialog-title">
        <DialogTitle>Register Person</DialogTitle>
        <DialogContent>
          <DialogContentText>Register person you piece of flying shit</DialogContentText>
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
