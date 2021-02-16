import { Button } from '@material-ui/core';
import React, { useState } from 'react';

function GetStats({ contract, account, isPermitted }) {
  const [stats, setStats] = useState({});
  const [show, setShow] = useState(false);

  const showStats = async () => {
    contract.methods.getStats().call({ from: account }, (error, res) => {
      if (error) {
        alert('You dont have permission!');
      } else if (res !== undefined) {
        setStats(res);
        setShow(true);
      }
    });
  };

  const handleClick = (event) => {
    showStats();
  };
  return (
    <div>
      <div>
        <Button className="mt-2" onClick={handleClick} id="showStats" disabled={!isPermitted}>
          Show statistics
        </Button>
      </div>
      <div>
        {show && (
          <div>
            <div>
              <label>
                <b>Total registered:</b> {stats[3]}
              </label>
            </div>
            <div>
              <label>
                <b>Vaccinated percentage:</b> {(stats[0] / stats[3]) * 100} %
              </label>
            </div>
            <div>
              <label>
                <b>Vaccinated average age:</b> {stats[1]}
              </label>
            </div>
            <div>
              <label>
                <b>Unvaccinated average age:</b> {stats[2]}
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GetStats;
