import React, { useState, useEffect } from 'react';
import { Button, TextField } from '@material-ui/core';

function VaccineCheck({ contract, account, isPermitted, setSnackBar }) {
  const [id, setId] = useState('');
  const [details, setDetails] = useState({});
  const [show, setShow] = useState(false);
  const [validID, setValidID] = useState(false);

  const checkID = () => {
    contract.methods
      .checkIfVaccinated(id)
      .call({ from: account })
      .then((res) => {
        setDetails(res);
        setShow(true);
      })
      .catch((err) => {
        setSnackBar(`Person with ID ${id} not found.`, 'info');
      });
  };

  const handleChange = (event) => {
    setId(event.target.value);
    setValidID(event.target.value.length === 9);
  };

  useEffect(() => {
    !validID ? setShow(false) : checkID();
  }, [validID]);

  return (
    <div>
      <TextField className="ml-5" hidden={!isPermitted} variant="standard" type="text" id="vaccCheck" value={id} placeholder="ID" onChange={handleChange} />
      {show && (
        <div>
          <p>
            Person is {details.isVaccinated ? '' : 'not'} vaccinated.
            <br />
            <b>Name: </b> {details.name}
            <br />
            <b>ID: </b> {id}
            <br />
            {details.isVaccinated ? (
              <div>
                <b>Location: </b> {details.location}
                <br />
                <b>Date: </b> {new Date(parseInt(details.date)).toLocaleDateString('he')}
              </div>
            ) : null}
          </p>
        </div>
      )}
    </div>
  );
}

export default VaccineCheck;
