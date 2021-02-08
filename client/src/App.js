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

  getID = async (id) => {
    const {vaccineContract} = this.state;
    let vaccinated = await vaccineContract.methods
      .checkID(id)
      .call();
    console.log(vaccinated);
  }

  getStats = async () => {
    const {vaccineContract} = this.state;
      let stats = await vaccineContract.methods.getStats().call();
      // (vaccinatedCount, avgVaccinatedAge, avgUnVaccinatedAge, totalRegistered)
      return 
      (<div>
          <div>
            <label>
              Total registered: {stats[3]}
              Vaccinated percentage: {stats[0]/stats[3]}
              Vaccinated average age: {stats[1]}
              Unvaccinated average age: {stats[2]}
            </label>
          </div>
        </div>);
  }

  handleClick = (event) => {
    event.preventDefault();
    if (event.target.id === 'checkID'){
      console.log(this.state.vaccID);
      if (this.state.vaccID){
         this.getID(this.state.vaccID);
      }
      return;
    }
    if (event.target.id == "showStats"){
      this.getStats();
      return;
    }
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
          <div>
            <input type="text" id="name" value={this.state.name} onChange={this.handleChange} />
          </div>
          <div>
            <input type="text" id="id" value={this.state.id} onChange={this.handleChange} />
          </div>
          <div>
            <input type="text" id="age" value={this.state.age} onChange={this.handleChange}/>
          </div>
          <button onClick={this.handleClick}>Register Person</button>
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
        <div>
          <input type="text" id="vaccCheck" value={this.state.vaccID} onChange={this.handleChange}/> 
          <button onClick={this.handleClick} id="checkID">Check vaccine</button>
        </div>
        <div>
          <button onClick={this.handleClick} id="showStats">Show statistics</button>
        </div>
      </div>
    );
  }
}

export default App;
