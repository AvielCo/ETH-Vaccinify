import { TextField, Button } from '@material-ui/core';
import { Save } from '@material-ui/icons';
import React, { useState } from 'react';

function Person({ id, personId, name, age, _isVaccinated, _date, _location, contract, account }) {
  const [date, setDate] = useState(_date);
  const [location, setLocation] = useState(_location);
  const [isVaccinated, setIsVaccinated] = useState(_isVaccinated);
  const [check, setCheck] = useState(false);

  const updatePerson = async (id, location, date) => {
    contract.methods.updatePerson(id, location, date).send({ from: account, gas: 500000, gasPrice: '2000000000000' }, (error, res) => {
      console.log(error, res);
      if (error) {
        console.log(error);
        alert('You dont have permission');
      } else if (res !== undefined) {
        setIsVaccinated(true);
      }
    });
  };

  const handleChange = (event) => {
    event.preventDefault();
    const target = event.target;
    let value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    if (name === 'date') {
      const date = new Date(value);
      value = date.getTime();
    }
    switch (name) {
      case 'check':
        setCheck(value);
        break;
      case 'location':
        setLocation(value);
        break;
      case 'date':
        setDate(date);
        break;
      default:
        break;
    }
  };

  const handleClick = (event) => {
    event.preventDefault();
    const target = event.target;
    if (event.type === 'click') {
      switch (target.id) {
        case 'accept':
          if (location && date !== 0) {
            updatePerson(id, location, date).then(() => {
              setIsVaccinated(true);
            });
            return;
          }
          alert('No location or date');
          break;
        case 'cancel':
          setCheck(false);
          break;
        default:
          break;
      }
    }
  };

  const renderPersonVaccineDetails = () => {
    if (check && !isVaccinated) {
      return (
        <div>
          <div>
            <input type="text" value={location} onChange={handleChange} placeholder="Location" name="location" />
          </div>
          <div>
            <TextField
              name="date"
              label="Date"
              type="date"
              defaultValue={new Date()}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
          <div>
            <button onClick={handleClick} id="accept">
              Accept
            </button>
            <button onClick={handleClick} id="cancel">
              Cancel
            </button>
          </div>
        </div>
      );
    } else if (isVaccinated) {
      return (
        <div>
          <div>
            <label>
              <b>Location:</b> {location}{' '}
            </label>
          </div>
          <div>
            <label>
              <b>Date:</b> {new Date(parseInt(date)).toLocaleDateString(['he', 'il', 'he-IL'])}
            </label>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <input type="checkbox" onChange={handleChange} checked={check} name="check" />
        </div>
      );
    }
  };

  return (
    <div>
      <div>
        <label>
          <b>Name:</b> {name} <b>ID:</b> {personId} <b>Age:</b> {age}
        </label>
        <div>{renderPersonVaccineDetails()}</div>
      </div>
    </div>
  );
}

export default Person;
