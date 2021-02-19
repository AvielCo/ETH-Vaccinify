import React, { useState } from 'react';
import { AppBar, Typography, Toolbar, IconButton, Tooltip } from '@material-ui/core';
import { ArrowDropDown } from '@material-ui/icons';
import Permit from './Permit';
import logo from '../assets/logo.png';
function CustomAppBar({ isOwner, account, contract, setSnackBar }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  return (
    <div style={{ flexGrow: 1 }}>
      <AppBar position="sticky">
        <Toolbar>
          <Tooltip title="Permitted edit">
            <IconButton hidden={!isOwner} onClick={() => setDialogOpen(true)}>
              <ArrowDropDown />
            </IconButton>
          </Tooltip>
          <Permit isOwner={isOwner} dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} account={account} contract={contract} setSnackBar={setSnackBar} />
          <Typography style={{ flexGrow: 1 }} variant="h6">
            <img src={logo} alt="vaccinify-logo" width="85" height="40" />
          </Typography>
          <Typography>{account}</Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default CustomAppBar;
