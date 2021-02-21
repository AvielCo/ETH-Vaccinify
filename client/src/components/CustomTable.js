import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Typography, makeStyles, withStyles, Collapse, IconButton, Button, InputBase } from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import SaveIcon from '@material-ui/icons/Save';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

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

function CustomTable({ row, account, contract, setSnackBar, isPermitted }) {
  const classes = useRowStyle();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(row.vaccinated ? row.vaccineDate : new Date().getTime());
  const [location, setLocation] = useState(row.vaccinated ? row.vaccineLocation : '');
  const [isGoodDate, setIsGoodDate] = useState(true);

  const handleDateChange = (event) => {
    if (!isPermitted) {
      return;
    }
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

  const updatePerson = () => {
    if (!isPermitted) {
      return;
    }
    setSnackBar('Sending request... please wait.', 'info');
    contract.methods
      .vaccinatePerson(row.id, location, date)
      .send({ from: account })
      .then((res) => {
        setSnackBar(`Successfully updated person ${(row.name, row.id)}.`, 'success');
      })
      .catch((err) => {
        setSnackBar('An error has been occured when trying to update person details.', 'error');
      });
  };

  const removePerson = async () => {
    if (!isPermitted) {
      return;
    }

    setSnackBar('Sending request... please wait.', 'info');
    contract.methods
      .removePerson(row.id)
      .send({ from: account })
      .then((res) => {
        setSnackBar(`Successfully removed person ${(row.name, row.id)}.`, 'success');
      })
      .catch((err) => {
        setSnackBar('An error has been occured when trying to remove a person.', 'error');
      });
  };

  return (
    <React.Fragment>
      <StyledTableRowOutside className={classes.root}>
        <StyledTableCell padding="checkbox">
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </StyledTableCell>
        <StyledTableCell style={{ width: '16%' }} scope="row" component="th" padding="checkbox" align="center">
          {row.id}
        </StyledTableCell>
        <StyledTableCell style={{ width: '50%' }} padding="checkbox" align="left">
          {row.name}
        </StyledTableCell>
        <StyledTableCell style={{ width: '16%' }} padding="checkbox" align="left">
          {row.age}
        </StyledTableCell>
        <StyledTableCell style={{ width: '16%' }} padding="checkbox" align="left">
          <IconButton size="small" onClick={() => removePerson()} hidden={!isPermitted}>
            <DeleteForeverIcon />
          </IconButton>
        </StyledTableCell>
      </StyledTableRowOutside>
      <StyledTableRowOutside>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0, paddingLeft: 70, backgroundColor: '#e6ffff' }} colSpan={5}>
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
                  <TableCell />
                  <TableCell />
                </StyledTableRowInside>
              </TableHead>
              <TableBody>
                <StyledTableRowInside>
                  <StyledTableCell scope="row" component="th">
                    <InputBase
                      className="pl-2 pr-2 rounded"
                      onChange={(event) => isPermitted && setLocation(event.target.value)}
                      value={location}
                      disabled={row.vaccinated || !isPermitted ? true : false}
                      style={{ background: '#F0F2EF' }}
                      inputProps={{ 'aria-label': 'naked' }}
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        disableToolbar
                        disabled={row.vaccinated && !isPermitted ? true : false}
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
                      hidden={!isPermitted}
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
