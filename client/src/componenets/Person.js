import React, { Component } from 'react';
import { TextField } from '@material-ui/core';

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
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    if (name === 'date') {
      console.log(value);
    }
    this.setState({
      [name]: value,
    });
  }

  render() {
    return (
      <div>
        <label>{`${this.state.name} ${this.state.id}`}</label>
        {this.state.isVaccinated ? (
          <div>
            <div>
              <input
                type="text"
                value={this.state.location}
                onChange={this.handleChange}
                placeholder="Location"
                name="location"
              />
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
          </div>
        ) : (
          <div>
            <input
              type="checkbox"
              onChange={this.handleChange}
              checked={this.state.isVaccinated}
              name="isVaccinated"
            />
          </div>
        )}
        <div>
          <button
            onClick={() => {
              console.log(this.state);
            }}>
            State check
          </button>
        </div>
      </div>
    );
  }
}

export default Person;
