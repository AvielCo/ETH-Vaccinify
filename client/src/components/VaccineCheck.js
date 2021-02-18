import React, { useState, useEffect } from 'react';
import { Button, TextField } from '@material-ui/core';

function VaccineCheck({ contract, account, isPermitted, setSnackBar }) {
  const [id, setId] = useState('');
  const [isVaccinated, setIsVaccinated] = useState(false);
  const [show, setShow] = useState(false);
  const [validID, setValidID] = useState(false);
  const [transactionSuccses, setTransactionSuccses] = useState(false);

  const checkID = () => {
    contract.methods
      .checkIfVaccinated(id)
      .call({ from: account })
      .then((res) => {
        console.log('res', res);
        setIsVaccinated(res);
        setShow(true);
      })
      .catch((err) => {
        console.log(typeof err.message);
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
    <div style={{ background: '#82b3c9' }}>
      <div>
        {show && (
          <div>
            <label>
              Person with ID <b>{id}</b> is {isVaccinated ? '' : 'not'} vaccinated.
            </label>
          </div>
        )}
        <TextField className="ml-5" variant="standard" type="text" id="vaccCheck" value={id} placeholder="ID" onChange={handleChange} />
      </div>
    </div>
  );
}

export default VaccineCheck;
