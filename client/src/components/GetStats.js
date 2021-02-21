import { Button } from '@material-ui/core';
import React, { useState } from 'react';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import AddBoxIcon from '@material-ui/icons/AddBox';
import { Divider } from '@material-ui/core';

function GetStats({ contract, account, isPermitted }) {
  const [show, setShow] = useState(false);
  const [totalRegistered, setTotalRegistered] = useState(0);
  const [totalVaccinated, setTotalVaccinated] = useState(0);
  const [vacAge, setVacAge] = useState(0);
  const [unVacAge, setUnVacAge] = useState(0);

  const totalUnVaccinated = totalRegistered - totalVaccinated;

  const showStats = async () => {
    contract.methods
      .getStats()
      .call({ from: account })
      .then((res) => {
        setTotalRegistered(res.total);
        setTotalVaccinated(res.vaccinatedAmount);
        setUnVacAge(res.totalUnVacAge);
        setVacAge(res.totalVacAge);
        setShow(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleClick = () => {
    !show ? showStats() : setShow(false);
  };

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
            <b>Vaccinated percentage:</b> {(totalVaccinated / totalRegistered) * 100} % <br />
            <Divider />
            <b>Vaccinated average age:</b> {vacAge / totalVaccinated} <br />
            <Divider />
            {totalUnVaccinated > 0 && (
              <div>
                <b>Unvaccinated average age:</b> {unVacAge / totalUnVaccinated}
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
