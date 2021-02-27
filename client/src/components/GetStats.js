import { Button } from '@material-ui/core';
import React, { useState } from 'react';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import AddBoxIcon from '@material-ui/icons/AddBox';
import { Divider } from '@material-ui/core';

// Statistics extraction and calculation
function GetStats({ contract, account, isPermitted }) {
  const [show, setShow] = useState(false);
  const [totalRegistered, setTotalRegistered] = useState(0);
  const [totalVaccinated, setTotalVaccinated] = useState(0);
  const [vacAge, setVacAge] = useState(0);
  const [unVacAge, setUnVacAge] = useState(0);

  const totalUnVaccinated = totalRegistered - totalVaccinated;

  // Statistics representation
  const showStats = async () => {
    contract.methods
      .getStats()
      .call({ from: account })
      .then((res) => {
        setTotalRegistered(res.total);
        setTotalVaccinated(res.vaccinatedAmount);
        let t_vacAge = 0;
        let t_unVacAge = 0;
        res.totalUnVacAge.filter((dob) => dob !== '0').map((dob) => (t_unVacAge += calculateAge(dob)));
        res.totalVacAge.filter((dob) => dob !== '0').map((dob) => (t_vacAge += calculateAge(dob)));
        setUnVacAge(t_unVacAge);
        setVacAge(t_vacAge);
        setShow(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleClick = () => {
    !show ? showStats() : setShow(false);
  };

  // Age calculation
  const calculateAge = (dob) => {
    const diff = new Date(parseInt(new Date() - new Date(parseInt(dob))));
    return diff.getUTCFullYear() - 1970;
  };

  // Layout
  return (
    <div>
      <div>
        <Button startIcon={show ? <IndeterminateCheckBoxIcon /> : <AddBoxIcon />} className="mt-2" onClick={handleClick} id="showStats" disabled={!isPermitted} hidden={!isPermitted}>
          Show statistics
        </Button>
      </div>
      <div>
        {show && totalRegistered > 0 && (
          <div>
            <b>Total registered:</b> {totalRegistered} <br />
            <Divider />
            <b>Vaccinated percentage:</b> {((totalVaccinated / totalRegistered) * 100).toFixed(2)} % <br />
            <Divider />
            {totalVaccinated > 0 && (
              <div>
                <b>Vaccinated average age:</b> {(vacAge / totalVaccinated).toFixed(0)} <br />
                <Divider />
              </div>
            )}
            {totalUnVaccinated > 0 && (
              <div>
                <b>Unvaccinated average age:</b> {(unVacAge / totalUnVaccinated).toFixed(0)}
              </div>
            )}
            <Divider />
          </div>
        )}
      </div>
    </div>
  );
}

export default GetStats;
