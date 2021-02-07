import React, { Component } from 'react';
import { TextField, Button } from '@material-ui/core';
import { Save } from '@material-ui/icons';

class Person extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.name,
      id: props.id,
      date: props.date,
      location: props.location,
      isVaccinated: props.isVaccinated,
    };
  }

  handleChange = (event) => {
    event.preventDefault();
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    if (name === 'date') {
      console.log(value);
    }
    this.setState({
      [name]: value,
    });
  };

  handleClick = (event) => {
    event.preventDefault();
    if (event.type === 'click') {
      console.log(event.target.name);
      if (event.name === 'accept') {
        console.log('clicked accept');
      } else if (event.name === 'cancel') {
        console.log('clicked cancel');
      }
    }
  };

  render() {
    return (
      <div>
        <label>{`${this.state.name} ${this.state.id}`}</label>
        {this.state.isVaccinated ? (
          <div>
            <div>
              <input type="text" value={this.state.location} onChange={this.handleChange} placeholder="Location" name="location" />
            </div>
            <div>
              <TextField
                name="date"
                label="Date"
                type="date"
                defaultValue="2017-05-24"
                onChange={this.handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </div>
            <div>
              <Button variant="contained" startIcon={<Save />} color="primary" onClick={this.handleClick} name="accept">
                Accept
              </Button>
              <Button variant="contained" color="secondary" onClick={this.handleClick} name="cancel">
                Cancel
              </Button>
              <label>This cannot be undone</label>
            </div>
          </div>
        ) : (
          <div>
            <input type="checkbox" onChange={this.handleChange} checked={this.state.isVaccinated} name="isVaccinated" />
          </div>
        )}
      </div>
    );
  }
}

export default Person;
