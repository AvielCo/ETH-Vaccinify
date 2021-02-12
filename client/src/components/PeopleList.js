import React, { useState } from 'react';
import { Table, TableBody, makeStyles, TableRow, TableCell, TableFooter, TableContainer, TablePagination, TableHead, Paper, withStyles } from '@material-ui/core';
import TablePaginationActions from './TablePaginationActions';
import CustomTable from './CustomTable';
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
    backgroundColor: '#484848',
    color: '#FFFFFF',
  },
  menuItem: {
    backgroundColor: '#484848',
    color: '#000000',
  },
}));

function PeopleList({ people, contract, account, isPermitted, loading }) {
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
    <TableContainer component={Paper}>
      <Table size="small">
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
        {isPermitted && !loading ? (
          <React.Fragment>
            <TableBody>
              {(rowsPerPage > 0 ? people.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : people).map((person) => (
                <CustomTable key={person.id} row={person} account={account} contract={contract} />
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 15, 25, 50, 100, { label: 'All', value: -1 }]}
                  colSpan={3}
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
  );
}

export default PeopleList;
