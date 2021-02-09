import Web3 from 'web3';
import React, { Component } from 'react';
import { VACCINE_ABI, VACCINE_ADRS } from './config';

import GetStats from './components/GetStats'
import AddPerson from './components/AddPerson'
import VaccineCheck from './components/VaccineCheck'
import PeopleList from './components/PeopleList'
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

  render() {
    return (
      <div className="container mt-3">
        <div className="row">
          <div className="col-sm">
            <AddPerson contract={this.state.vaccineContract} account={this.state.account}/>
          </div>
          <div className="col-sm">
            <VaccineCheck contract={this.state.vaccineContract}/>
          </div>
        </div>
        <GetStats contract={this.state.vaccineContract}/>
        <div className="mb-1 mt-2" ><label><u><b><i>Registered people: </i></b></u></label></div>
        {!this.state.loading && <PeopleList people={this.state.people} contract={this.state.vaccineContract} account={this.state.account}/>}
        
      </div>
    );
  }
}

export default App;
