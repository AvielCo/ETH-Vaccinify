import React, { useState } from 'react';
import { Button } from '@material-ui/core';
function VaccineCheck({ contract, account, isPermitted }) {
  const [id, setId] = useState('');
  const [isVaccinated, setIsVaccinated] = useState(false);
  const [show, setShow] = useState(false);
  const [transactionSuccses, setTransactionSuccses] = useState(false);

  const handleClick = () => {
    if (id.length <= 0) {
      return;
    }
    contract.methods.checkID(id).call({ from: account }, (error, res) => {
      if (error) {
        alert('You dont have permission!');
      } else if (res !== undefined) {
        setIsVaccinated(res);
        setShow(true);
      }
    });
  };

  const handleChange = (event) => {
    setShow(false);
    setId(event.target.value);
  };

  return (
    <div className="pb-5">
      <div>
        <div>
          <label>
            <b>
              <u>
                <i>Vaccination check</i>
              </u>
            </b>
          </label>
        </div>
        <input type="text" id="vaccCheck" value={id} placeholder="ID" onChange={handleChange} />
        <Button className="ml-2" onClick={handleClick} id="checkID" disabled={!isPermitted}>
          Check vaccine
        </Button>
      </div>
      {show && (
        <div>
          <label>
            Person with ID <b>{id}</b> is {isVaccinated ? '' : 'not'} vaccinated.
          </label>
        </div>
      )}
    </div>
  );
}

export default VaccineCheck;
