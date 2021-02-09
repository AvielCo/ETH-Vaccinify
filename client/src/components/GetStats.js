import React, { useState } from 'react';

function GetStats({ contract }) {
  const [stats, setStats] = useState({});
  const [show, setShow] = useState(false);

  const showStats = async () => {
    let stats = await contract.methods.getStats().call();
    return stats;
  };

  const handleClick = (event) => {
    showStats().then((res) => {
      setStats(res);
      setShow(true);
    });
  };
  return (
    <div>
      <div>
        <button onClick={handleClick} id="showStats">
          Show statistics
        </button>
      </div>
      <div>
        {show && (
          <div>
            <div>
              <label className="mt-1 mb-1">
                <b>
                  <u>Statistics:</u>
                </b>
              </label>
            </div>
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
