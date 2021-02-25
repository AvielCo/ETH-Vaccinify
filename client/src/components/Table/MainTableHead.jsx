import React from 'react';
import { TableHead, TableRow, TableCell, TableSortLabel, withStyles, makeStyles } from '@material-ui/core';
import ArrowDropDownCircleTwoToneIcon from '@material-ui/icons/ArrowDropDownCircleTwoTone';

const headers = [
  { id: 'dummy1', sortable: false, numeric: true, disablePadding: false, label: '' },
  { id: 'id', sortable: true, numeric: false, disablePadding: false, label: 'ID' },
  { id: 'name', sortable: true, numeric: false, disablePadding: false, label: 'Name' },
  { id: 'age', sortable: true, numeric: false, disablePadding: false, label: 'Age' },
  { id: 'dummy2', sortable: false, numeric: true, disablePadding: false, label: '' },
];

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: '#b3e5fc',
    },
  },
}))(TableRow);

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: '#484848',
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 20,
  },
}))(TableCell);

const useStyles = makeStyles((theme) => ({
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

function SortableTableHeaders({ order, orderBy, onRequestSort }) {
  const classes = useStyles();

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <StyledTableRow>
        {headers.map((headCell) => (
          <StyledTableCell key={headCell.id} padding={headCell.disablePadding ? 'none' : 'default'} sortDirection={orderBy === headCell.id ? order : false}>
            {headCell.sortable && (
              <TableSortLabel active={orderBy === headCell.id} direction={orderBy === headCell.id ? order : 'asc'} onClick={createSortHandler(headCell.id)} style={{ color: 'white' }}>
                {headCell.label}
              </TableSortLabel>
            )}
          </StyledTableCell>
        ))}
      </StyledTableRow>
    </TableHead>
  );
}

export default SortableTableHeaders;
