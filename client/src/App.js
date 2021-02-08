import Web3 from 'web3';
import React, { Component } from 'react';
import { VACCINE_ABI, VACCINE_ADRS } from './config';
import Person from './componenets/Person';
import { Divider } from '@material-ui/core';
import { validateID } from './Validators';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: '',
      vaccinatedCount: 0,
      people: [],
      name: '',
      id: '',
      loading: true,
    };
  }

  componentWillMount() {
    this.loadBlockchainData();
  }

  loadBlockchainData = async () => {
    const web3 = new Web3('http://127.0.0.1:7545' || Web3.givenProvider);

    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    const vaccineContract = new web3.eth.Contract(VACCINE_ABI, VACCINE_ADRS);
    this.setState({ vaccineContract });

    const vaccinatedCount = await vaccineContract.methods.vaccinatedCount().call();
    this.setState({ vaccinatedCount });

    const people = [];
    for (let i = 1; i <= vaccinatedCount; i++) {
      const person = await vaccineContract.methods.people(i).call();
      people.push(person);
    }
    this.setState({
      people: people,
      loading: false,
    });
  };

  handleClick = (event) => {
    event.preventDefault();
    const { name, id, vaccineContract, account } = this.state;
    if (!name || !id) {
      return;
    }
    const res = validateID(id);
    if (!res.result) {
      alert(res.cause);
      return;
    }
    vaccineContract.methods
      .createPerson(name, id)
      .send({ from: account, gas: 5500000, gasPrice: '2000000000000' })
      .once('receipt', (receipt) => {
        console.log(`created preson ${name} with id: ${id}`);
      });
  };

  handleChange = (event) => {
    if (event.target.id === 'name') {
      this.setState({ name: event.target.value });
    } else if (event.target.id === 'id') {
      this.setState({ id: event.target.value });
    }
  };

  updatePerson = async (id, location, date) => {
    const { vaccineContract, account } = this.state;
    await vaccineContract.methods
      .updatePerson(id, location, date)
      .send({ from: account, gas: 5500000, gasPrice: '2000000000000' })
      .once('receipt', (receipt) => {
        console.log(`updated person: ${id} with ${location} ${date}`);
      });
  };

  render() {
    return (
      <div className="container">
        <form>
          <div>
            <input type="text" id="name" value={this.state.name} onChange={this.handleChange} />
          </div>
          <div>
            <input type="text" id="id" value={this.state.id} onChange={this.handleChange} />
          </div>
          <button onClick={this.handleClick}>Create person</button>
        </form>
        <div>
          {this.state.people.length > 0 && !this.state.loading ? (
            <div>
              {this.state.people.map((item, index) => {
                return (
                  <div key={index}>
                    <Person
                      id={item.id}
                      name={item.name}
                      personId={item.personId}
                      date={item.vaccineDate}
                      location={item.vaccineLocation}
                      isVaccinated={item.vaccinated}
                      updatePerson={this.updatePerson}
                    />
                    <Divider />
                  </div>
                );
              })}
            </div>
          ) : (
            <label>Loading data...</label>
          )}
        </div>
      </div>
    );
  }
}

export default App;
