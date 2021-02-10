import React, { useState, Component, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, makeStyles, withStyles, Box, Collapse, IconButton, Button, InputBase } from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import SaveIcon from '@material-ui/icons/Save';

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

function Row({ row, account, contract }) {
  const classes = useRowStyle();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date().getTime());
  const [location, setLocation] = useState('');
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
    await contract.methods.updatePerson(row.id, location, date).send({ from: account, gas: 500000, gasPrice: '2000000000000' });
  };

  const refresh = () => {
    window.location.reload(false);
  };

  return (
    <React.Fragment>
      <StyledTableRowOutside className={classes.root}>
        <StyledTableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </StyledTableCell>
        <StyledTableCell component="th" scope="row">
          {row.personId}
        </StyledTableCell>
        <StyledTableCell align="left">{row.name}</StyledTableCell>
        <StyledTableCell align="left">{row.age}</StyledTableCell>
      </StyledTableRowOutside>
      <StyledTableRowOutside>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0, backgroundColor: '#e6ffff' }} colSpan={6}>
          <StyledCollapse in={open} timeout="auto" unmountOnExit>
            <Typography variant="h6" gutterBottom component="div">
              Vaccine Details
            </Typography>
            <Table size="small" aria-label="details">
              <TableHead>
                <StyledTableRowInside>
                  <TableCell>Location</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell></TableCell>
                </StyledTableRowInside>
              </TableHead>
              <TableBody>
                <StyledTableRowInside>
                  <StyledTableCell>
                    <InputBase
                      className="pl-2 pr-2 rounded"
                      onChange={(event) => {
                        const value = event.target.value;
                        setLocation(value);
                      }}
                      value={row.vaccineDetails.location}
                      disabled={row.vaccineDetails.vaccinated ? true : false}
                      style={{ background: '#F0F2EF' }}
                      inputProps={{ 'aria-label': 'naked' }}
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        disableToolbar
                        disabled={row.vaccineDetails.vaccinated ? true : false}
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
                      onClick={() => {
                        updatePerson().then(() => refresh());
                      }}
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

class PeopleList extends Component {
  constructor(props) {
    super(props);
    const { people, contract, account } = props;
    this.state = { people, contract, account };
  }

  render() {
    return (
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <StyledTableRowOutside>
              <StyledTableCell />
              <StyledTableCell>
                <b>ID</b>
              </StyledTableCell>
              <StyledTableCell align="left">
                <b>Name</b>
              </StyledTableCell>
              <StyledTableCell align="left">
                <b>Age</b>
              </StyledTableCell>
            </StyledTableRowOutside>
          </TableHead>
          <TableBody>
            {this.state.people.map((row) => (
              <Row key={row.id} row={row} account={this.state.account} contract={this.state.contract} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}

export default PeopleList;
