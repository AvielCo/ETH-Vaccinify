import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

export default function CustomSnackbar({ severity, message, open, setOpen }) {
  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={(event, reason) => {
          if (reason === 'clickaway') {
            return;
          }
          setOpen(false);
        }}>
        <MuiAlert elevation={6} variant="filled" severity={severity}>
          {message}
        </MuiAlert>
      </Snackbar>
    </div>
  );
}
