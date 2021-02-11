import React from 'react';
import { IconButton } from '@material-ui/core';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';

function TablePaginationActions({ count, page, rowsPerPage, onChangePage }) {
  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };
  return (
    <div style={{ flexShrink: 0, marginLeft: 10 }}>
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0}>
        <FirstPageIcon />
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0}>
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton onClick={handleNextButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1}>
        <KeyboardArrowRight />
      </IconButton>
      <IconButton onClick={handleLastPageButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1}>
        <LastPageIcon />
      </IconButton>
    </div>
  );
}

export default TablePaginationActions;
