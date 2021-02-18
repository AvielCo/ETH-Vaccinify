import React, { useState } from 'react';
import { Table, TableBody, makeStyles, TableRow, TableCell, TableFooter, TableContainer, TablePagination, TableHead, Paper, withStyles, Typography } from '@material-ui/core';
import TablePaginationActions from './TablePaginationActions';
import CustomTable from './CustomTable';
import AddPerson from './AddPerson';
import VaccineCheck from './VaccineCheck';
const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: '#484848',
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
}))(TableRow);

const TablePaginationStyles = makeStyles(() => ({
  root: {
    color: '#FFFFFF',
  },
  menuItem: {
    color: '#000000',
  },
}));

function PeopleList({ people, contract, account, isPermitted, loading, setRegisteredPerson, setSnackBar }) {
  //Pagination system
  const classes = TablePaginationStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, people.length - page * rowsPerPage);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div>
      <div style={{ margin: '0 auto', maxWidth: '72%' }}>
        <VaccineCheck contract={contract} account={account} isPermitted={isPermitted} setSnackBar={setSnackBar} />
      </div>
      <TableContainer component={Paper} style={{ maxWidth: '70%', margin: '0 auto', borderRadius: '20px' }} elevation={0}>
        <Table size="small">
          <TableHead>
            <StyledTableRowOutside>
              <StyledTableCell />
              <StyledTableCell align="center">
                <h5 className="table-head">ID</h5>
              </StyledTableCell>
              <StyledTableCell align="left">
                <h5 className="table-head">Name</h5>
              </StyledTableCell>
              <StyledTableCell align="left">
                <h5 className="table-head">Age</h5>
              </StyledTableCell>
              <StyledTableCell />
            </StyledTableRowOutside>
          </TableHead>
          {!loading ? (
            <React.Fragment>
              <TableBody>
                {(rowsPerPage > 0 ? people.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : people).map((person) => (
                  <CustomTable key={person.id} row={person} account={account} contract={contract} setSnackBar={setSnackBar} isPermitted={isPermitted} />
                ))}
              </TableBody>
              <TableFooter>
                <TableRow style={{ background: '#484848' }}>
                  <AddPerson contract={contract} account={account} registerPerson={setRegisteredPerson} isPermitted={isPermitted} setSnackBar={setSnackBar} />
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 15, 25, { label: 'All', value: -1 }]}
                    count={people.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                      native: true,
                    }}
                    classes={{
                      root: classes.root,
                      menuItem: classes.menuItem,
                    }}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            </React.Fragment>
          ) : null}
        </Table>
      </TableContainer>
    </div>
  );
}

export default PeopleList;
