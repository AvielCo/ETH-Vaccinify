import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Typography, makeStyles, withStyles, Collapse, IconButton, Button, InputBase } from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import SaveIcon from '@material-ui/icons/Save';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

const useRowStyle = makeStyles((theme) => ({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
  margin: {
    margin: theme.spacing(1),
  },
}));

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 20,
  },
}))(TableCell);

const StyledTableRowOutside = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: '#b3e5fc',
    },
  },
}))(TableRow); //FBF9FF

const StyledTableRowInside = withStyles((theme) => ({
  root: {
    backgroundColor: '#e6ffff',
  },
}))(TableRow);

const StyledCollapse = withStyles((theme) => ({
  container: {
    backgroundColor: '#e6ffff',
  },
}))(Collapse);

function CustomTable({ row, account, contract, setSnackBar }) {
  const classes = useRowStyle();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(row.vaccinated ? row.vaccineDate : new Date().getTime());
  const [location, setLocation] = useState(row.vaccinated ? row.vaccineLocation : '');
  const [isGoodDate, setIsGoodDate] = useState(true);

  const handleDateChange = (event) => {
    if (event instanceof Date && !isNaN(event) && event !== null) {
      const t = event.getTime();
      const today = new Date().getTime();
      if (t > today || t < new Date('2020-10-01').getTime()) {
        setIsGoodDate(false);
      } else {
        setIsGoodDate(true);
      }
      setDate(event.getTime());
    } else {
      setDate(event);
      setIsGoodDate(false);
    }
  };

  const updatePerson = async () => {
    await contract.methods
      .updatePerson(row.id, location, date)
      .send({ from: account })
      .then((res) => {
        setSnackBar(`Successfully updated person ${(row.name, row.personId)}.`, 'success');
      })
      .catch((err) => {
        setSnackBar(err, 'error');
      });
  };

  const removePerson = async () => {
    await contract.methods
      .removePerson(row.id)
      .send({ from: account })
      .then((res) => {
        setSnackBar(`Successfully removed person ${(row.name, row.personId)}.`, 'success');
      })
      .catch((err) => {
        setSnackBar(err, 'error');
      });
  };

  const refresh = () => {
    window.location.reload(false);
  };

  const showSnackBar = () => {
    const severity = '';
    const massage = '';
    return (
      <Snackbar autoHideDuration={6000}>
        <MuiAlert elevation={6} variant="filled" severity={severity}>
          {massage}
        </MuiAlert>
      </Snackbar>
    );
  };

  return (
    <React.Fragment>
      <StyledTableRowOutside className={classes.root}>
        <StyledTableCell padding="checkbox">
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </StyledTableCell>
        <StyledTableCell style={{ width: '25%' }} scope="row" component="th" padding="checkbox" align="center">
          {row.personId}
        </StyledTableCell>
        <StyledTableCell style={{ width: '50%' }} padding="checkbox" align="left">
          {row.name}
        </StyledTableCell>
        <StyledTableCell style={{ width: '25%' }} padding="checkbox" align="left">
          {row.age}
        </StyledTableCell>
      </StyledTableRowOutside>
      <StyledTableRowOutside>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0, paddingLeft: 70, backgroundColor: '#e6ffff' }} colSpan={4}>
          <StyledCollapse in={open} timeout="auto" unmountOnExit>
            <Typography variant="h6" gutterBottom component="div">
              Vaccine Details
            </Typography>
            <Table size="small" aria-label="details">
              <TableHead>
                <StyledTableRowInside>
                  <TableCell scope="row">
                    <b>Location</b>
                  </TableCell>
                  <TableCell>
                    <b>Date</b>
                  </TableCell>
                  <TableCell></TableCell>
                </StyledTableRowInside>
              </TableHead>
              <TableBody>
                <StyledTableRowInside>
                  <StyledTableCell scope="row" component="th">
                    <InputBase
                      className="pl-2 pr-2 rounded"
                      onChange={(event) => setLocation(event.target.value)}
                      value={location}
                      disabled={row.vaccinated ? true : false}
                      style={{ background: '#F0F2EF' }}
                      inputProps={{ 'aria-label': 'naked' }}
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        disableToolbar
                        disabled={row.vaccinated ? true : false}
                        variant="inline"
                        format="dd/MM/yyyy"
                        id="date-picker-inline"
                        value={new Date(parseInt(date))}
                        minDate={new Date('2020-10-01')}
                        onChange={handleDateChange}
                        disableFuture={true}
                        autoOk={true}
                      />
                    </MuiPickersUtilsProvider>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Button
                      disabled={!isGoodDate || location.length === 0}
                      disableElevation
                      variant="contained"
                      onClick={() => updatePerson()}
                      color="primary"
                      size="small"
                      className={classes.button}
                      startIcon={<SaveIcon />}>
                      Save
                    </Button>
                  </StyledTableCell>
                </StyledTableRowInside>
              </TableBody>
            </Table>
          </StyledCollapse>
        </TableCell>
      </StyledTableRowOutside>
    </React.Fragment>
  );
}

export default CustomTable;
