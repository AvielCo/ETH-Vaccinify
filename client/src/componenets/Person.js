import React, { Component } from 'react';
import { TextField, Button } from '@material-ui/core';
import { Save } from '@material-ui/icons';

class Person extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      name: props.name,
      personId: props.personId,
      date: props.date,
      location: props.location,
      isVaccinated: props.isVaccinated,
      updatePerson: props.updatePerson,
      check: false,
    };
    this.setState({
      check: this.state.isVaccinated,
    });
  }

  handleChange = (event) => {
    event.preventDefault();
    const target = event.target;
    let value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    if (name === 'date') {
      const date = new Date(value);
      value = date.getTime();
    }
    this.setState({
      [name]: value,
    });
  };

  handleClick = (event) => {
    event.preventDefault();
    const target = event.target;
    if (event.type === 'click') {
      switch (target.id) {
        case 'accept':
          const { location, date, id } = this.state;
          if (location && date !== 0) {
            this.state.updatePerson(id, location, date).then(() => {
              this.setState({
                isVaccinated: true,
              });
            });
            return;
          }
          alert('No location or date');
          break;
        case 'cancel':
          this.setState({
            check: false,
          });
          break;
        default:
          break;
      }
    }
  };

  r = () => {
    if (this.state.check && !this.state.isVaccinated) {
      return (
        <div>
          <div>
            <input type="text" value={this.state.location} onChange={this.handleChange} placeholder="Location" name="location" />
          </div>
          <div>
            <TextField
              name="date"
              label="Date"
              type="date"
              defaultValue={new Date()}
              onChange={this.handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
          <div>
            <button onClick={this.handleClick} id="accept">
              Accept
            </button>
            <button onClick={this.handleClick} id="cancel">
              Cancel
            </button>
          </div>
        </div>
      );
    } else if (this.state.isVaccinated) {
      return (
        <div>
          <label>{this.state.location} </label>
          <label>{new Date(this.state.date).toLocaleDateString(['he', 'il', 'he-IL'])}</label>
        </div>
      );
    } else {
      return (
        <div>
          <input type="checkbox" onChange={this.handleChange} checked={this.state.check} name="check" />
        </div>
      );
    }
  };

  render() {
    return (
      <div>
        <label>{`${this.state.name} ${this.state.personId}`}</label>
        <div>{this.r()}</div>
      </div>
    );
  }
}

export default Person;
