import Web3 from 'web3';
import React, { useEffect, useState } from 'react';
import { VACCINE_ABI, VACCINE_ADRS } from './config';
import GetStats from './components/GetStats';
import AddPerson from './components/AddPerson';
import VaccineCheck from './components/VaccineCheck';
import PeopleList from './components/PeopleList';
import { validateID } from './Validators';
import './style.css';

function App() {
  const [account, setAccount] = useState('');
  const [people, setPeople] = useState([]);
  const [stnameate, setName] = useState('');
  const [id, setId] = useState('');
  const [age, setAge] = useState('');
  const [loading, setLoading] = useState(true);
  const [vaccID, setVaccID] = useState('');
  const [vaccineContract, setVaccineContract] = useState();
  const [eth, setEth] = useState();
  const [totalRegistered, setTotalRegistered] = useState(0);

  const init = async () => {
    const eth = window.ethereum;

    if (!eth) {
      alert('No ethereum found');
    }

    setEth(eth);

    const web3 = new Web3(Web3.currentProvider || 'http://127.0.0.1:7545');

    const _vaccineContract = new web3.eth.Contract(VACCINE_ABI, VACCINE_ADRS);
    setVaccineContract(_vaccineContract);

    const _totalRegistered = await _vaccineContract.methods.totalRegistered().call();
    setTotalRegistered(_totalRegistered);

    for (let i = 1; i <= _totalRegistered; i++) {
      const person = await _vaccineContract.methods.people(i).call();
      people.push(person);
    }

    setPeople(people);
    setLoading(false);
  };

  useEffect(() => init(), []);

  if (eth) {
    eth.on('accountsChanged', (accounts) => setAccount(accounts[0]));
  }

  return (
    <div className="mt-5 mr-5 ml-5">
      {eth && (
        <div>
          <div className="row">
            <div className="col-sm">
              <VaccineCheck contract={vaccineContract} />
            </div>
            <div className="col-sm">
              <GetStats contract={vaccineContract} />
            </div>
          </div>
          <div>
            <AddPerson contract={vaccineContract} account={account} />
          </div>
          {!loading && (
            <div>
              <PeopleList people={people} contract={vaccineContract} account={account} />
            </div>
          )}
          <div>
            <label className="mt-5 mb-1"> © AviVit Technologies Inc. </label>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
