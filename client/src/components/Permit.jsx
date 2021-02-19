import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, TextField, Button, Tooltip } from '@material-ui/core';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import AddIcon from '@material-ui/icons/Add';
import Web3 from 'web3';

function Permit({ contract, account, isOwner, dialogOpen, setDialogOpen, setSnackBar }) {
  const [permittedList, setPermittedList] = useState([]);
  const [changedList, setChangedList] = useState(false);
  const [address, setAddress] = useState('');
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (dialogOpen || changedList) {
      contract.methods
        .getPermittedList()
        .call({ from: account })
        .then((res) => {
          setPermittedList(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [dialogOpen, changedList]);

  const addAddressToPermittedList = () => {
    if (!Web3.utils.isAddress(address)) {
      setError(true);
      return;
    }
    setError(false);
    contract.methods
      .addPermit(address)
      .send({ from: account })
      .once('confirmation', (confirmationNumber, receipt) => {
        if (receipt.status) {
          setSnackBar(`Succssesfuly given permissions to address ${address}.`, 'success');
          setChangedList(true);
          setAddressDialogOpen(false);
        } else {
          setSnackBar(`Address ${address} has permissions already.`, 'info');
        }
      });
  };

  const removeAddressFromPermittedList = (adrs) => {
    contract.methods
      .removePermit(adrs)
      .send({ from: account })
      .once('confirmation', (confirmationNumber, receipt) => {
        if (receipt.status) {
          setSnackBar(`Succssesfuly removed permissions from address ${adrs}.`, 'success');
          setChangedList(true);
        }
      });
  };

  return (
    <div className="m-0">
      {isOwner && (
        <div>
          <Dialog
            open={dialogOpen}
            onClose={() => {
              setDialogOpen(false);
            }}
            scroll="paper">
            <div className="row m-0">
              <DialogTitle className="column" style={{ width: '80%' }}>
                <b>Permitted list</b>
              </DialogTitle>
              <Tooltip title="Add address">
                <IconButton className="column" onClick={() => setAddressDialogOpen(true)} style={{ width: '20%' }}>
                  <AddIcon />
                </IconButton>
              </Tooltip>
            </div>
            <DialogContent style={{ padding: 0 }}>
              <DialogContentText>Here you add/remove permitted addresses.</DialogContentText>
              <List>
                {permittedList.map((adrs, index) => {
                  return (
                    <ListItem key={index} style={{ paddingRight: '30px', paddingLeft: '30px' }}>
                      <ListItemText id={index} primary={`${index + 1})${adrs.toLowerCase()}`} />
                      {adrs.toLowerCase() !== account.toLowerCase() && (
                        <ListItemSecondaryAction>
                          <IconButton size="small" onClick={() => removeAddressFromPermittedList(adrs)}>
                            <DeleteForeverIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      )}
                    </ListItem>
                  );
                })}
              </List>
            </DialogContent>
          </Dialog>
          <Dialog open={addressDialogOpen} onClose={() => setAddressDialogOpen(false)}>
            <DialogContent>
              <DialogContentText>Write the address of the account you want to give permission to edit the database.</DialogContentText>
              <TextField autoFocus fullWidth margin="dense" type="text" label="Address" error={error} onChange={(event) => setAddress(event.target.value)} />
              <Button color="primary" onClick={() => addAddressToPermittedList()}>
                Accept
              </Button>
              <Button color="secondary" onClick={() => setAddressDialogOpen(false)}>
                Cancel
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}

export default Permit;
