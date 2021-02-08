import Web3 from 'web3';
import React, { Component } from 'react';
import { VACCINE_ABI, VACCINE_ADRS } from './config';
import Person from './components/Person';
import GetStats from './components/GetStats'
import VaccineCheck from './components/VaccineCheck'
import { Divider } from '@material-ui/core';
import { validateID } from './Validators';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: '',
      totalRegistered: 0,
      people: [],
      name: '',
      id: '',
      age: '',
      loading: true,
      vaccID: ""
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

    const totalRegistered = await vaccineContract.methods.totalRegistered().call();
    this.setState({ totalRegistered });

    const people = [];
    for (let i = 1; i <= totalRegistered; i++) {
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
    const { name, id, vaccineContract, account, age } = this.state;
    if (!name || !id || !age) {
      return;
    }
    const res = validateID(id);
    if (!res.result) {
      alert(res.cause);
      return;
    }
    vaccineContract.methods
      .createPerson(name, id, parseInt(age))
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
    } else if (event.target.id === 'vaccCheck'){
      this.setState({ vaccID: event.target.value});
    } else if (event.target.id === 'age'){
      this.setState({ age: event.target.value});
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
          <div><label><u><b><i>Registration</i></b></u></label></div>
          <div>
            <input className="mb-1 mt-1" type="text" id="name" value={this.state.name} onChange={this.handleChange} placeholder="Name"/>
          </div>
          <div>
            <input className="mb-1 mt-1" type="text" id="id" value={this.state.id} onChange={this.handleChange} placeholder="ID" />
          </div>
          <div>
            <input className="mb-1 mt-1" type="text" id="age" value={this.state.age} onChange={this.handleChange} placeholder="Age"/>
          </div>
          <button className="mb-1 mt-1" onClick={this.handleClick}>Register Person</button>
        </form>
        <GetStats contract={this.state.vaccineContract}/>
        <div className="mb-1 mt-2" ><label><u><b><i>Registered people: </i></b></u></label></div>
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
                      age={item.age}
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
        <VaccineCheck contract={this.state.vaccineContract}/>
      </div>
    );
  }
}

export default App;
