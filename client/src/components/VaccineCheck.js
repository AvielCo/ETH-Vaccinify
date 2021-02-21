import React, { useState, useEffect } from 'react';
import { TextField, Divider } from '@material-ui/core';

function VaccineCheck({ contract, account, isPermitted, setSnackBar }) {
  const [id, setId] = useState('');
  const [details, setDetails] = useState({});
  const [show, setShow] = useState(false);
  const [validID, setValidID] = useState(false);
  const [personFound, setPersonFound] = useState(false);

  const checkID = () => {
    contract.methods
      .checkIfVaccinated(id)
      .call({ from: account })
      .then((res) => {
        setDetails(res);
        setShow(true);
        setPersonFound(true);
      })
      .catch((err) => {
        setShow(true);
        setPersonFound(false);
      });
  };

  const handleChange = (event) => {
    setId(event.target.value);
    setValidID(event.target.value.length === 9);
  };

  // eslint-disable-next-line
  useEffect(() => (!validID ? setShow(false) : checkID()), [validID]);

  return (
    <div>
      <TextField hidden={!isPermitted} variant="standard" type="text" value={id} placeholder="ID" onChange={handleChange} />
      {/* 
          the conditions in this div below:
          if id is invalid: no border
          else:
            if person not found: border-danger (red border)
            else if person found AND is not vaccinated: border-warning (yellow border)
            else: border-success (green border)
      */}
      <div className={`${validID ? `border border-${!personFound ? 'notfound' : !details.result ? 'notvaccinated' : 'vaccinated'}` : null} p-1 mt-1`}>
        {!personFound && show && (
          <div>
            <b>Person with ID: {id} not found</b>
          </div>
        )}
        {personFound && show && (
          <div>
            Person is {details.result ? '' : <b>not</b>} vaccinated.
            <Divider />
            <b>Name: </b> {details.name}
            <Divider />
            <b>ID: </b> {id}
            {details.result ? (
              <div>
                <Divider />
                <b>Location: </b> {details.location}
                <Divider />
                <b>Date: </b> {new Date(parseInt(details.date)).toLocaleDateString('he')}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

export default VaccineCheck;
