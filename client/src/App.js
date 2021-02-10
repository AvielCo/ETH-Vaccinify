import Web3 from 'web3';
import React, { Component } from 'react';
import { VACCINE_ABI, VACCINE_ADRS } from './config';
import GetStats from './components/GetStats';
import AddPerson from './components/AddPerson';
import VaccineCheck from './components/VaccineCheck';
import PeopleList from './components/PeopleList';
import { validateID } from './Validators';
import './style.css';

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
      vaccID: '',
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

  createData = (people) => {
    const peopleObjects = [];
    const millisecondsToDate = (milliseconds) => {
      return new Date(milliseconds).toLocaleDateString(['he', 'il', 'he-IL']);
    };
    people.forEach((person) => {
      peopleObjects.push({
        id: person.id,
        personId: person.personId,
        name: person.name,
        age: person.age,
        vaccineDetails: person.vaccinated
          ? {
              vaccinated: true,
              location: person.vaccineLocation,
              date: millisecondsToDate(person.vaccineDate),
            }
          : {
              vaccinated: false,
            },
      });
    });
    return peopleObjects;
  };

  render() {
    return (
      <div className="mt-5 mr-5 ml-5">
        <div className="row">
          <div className="col-sm">
            <VaccineCheck contract={this.state.vaccineContract} />
          </div>
          <div className="col-sm">
            <GetStats contract={this.state.vaccineContract} />
          </div>
        </div>
        <div>
          <AddPerson contract={this.state.vaccineContract} account={this.state.account} />
        </div>
        {!this.state.loading && (
          <div>
            <PeopleList people={this.createData(this.state.people)} contract={this.state.vaccineContract} account={this.state.account} />
          </div>
        )}
        <div>
          <label className="mt-5 mb-1"> © AviVit Technologies Inc </label>
        </div>
      </div>
    );
  }
}

export default App;
