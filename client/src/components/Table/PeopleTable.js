import React, { useState } from 'react';
import { Table, TableBody, makeStyles, TableRow, TableCell, TableFooter, TableContainer, TablePagination, TableHead, Paper, withStyles } from '@material-ui/core';
import TablePaginationActions from './TablePaginationActions';
import CustomTable from './MainTableBody';
import AddPerson from '../AddPerson';
import SortableTableHeaders from './MainTableHead';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const TablePaginationStyles = makeStyles(() => ({
  root: {
    color: '#FFFFFF',
  },
  menuItem: {
    color: '#000000',
  },
}));

function PeopleList({ people, contract, account, isPermitted, isOwner, loading, setAddedPerson, setSnackBar }) {
  //Pagination system
  const classes = TablePaginationStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('id');

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div>
      <TableContainer component={Paper} style={{ borderRadius: '20px' }} elevation={0}>
        <Table size="small">
          <SortableTableHeaders order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
          {!loading ? (
            <React.Fragment>
              <TableBody>
                {stableSort(people, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((person) => (
                    <CustomTable key={person.id} row={person} account={account} contract={contract} setSnackBar={setSnackBar} isPermitted={isPermitted} />
                  ))}
              </TableBody>
              <TableFooter>
                <TableRow style={{ background: '#484848' }}>
                  <AddPerson contract={contract} account={account} isPermitted={isPermitted} isOwner={isOwner} setAddedPerson={setAddedPerson} setSnackBar={setSnackBar} />
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
