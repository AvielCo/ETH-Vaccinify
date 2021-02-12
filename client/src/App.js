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
  const [loading, setLoading] = useState(true);
  const [vaccineContract, setVaccineContract] = useState();
  const [totalRegistered, setTotalRegistered] = useState(0);
  const [provideEthAccess, setProvideEthAccess] = useState(false);
  const [isPermitted, setIsPermitted] = useState(false);

  const ethereum = window.ethereum;
  window.addEventListener('load', async () => {
    if (ethereum) {
      window.web3 = new Web3(ethereum);
      try {
        // Request account access if needed
        await ethereum.enable();
        // Acccounts now exposed
        setAccount(ethereum.selectedAddress);
        setProvideEthAccess(true);
        if (vaccineContract) {
          vaccineContract.methods.onlyPermittedPersonal(ethereum.selectedAddress).call((error, res) => {
            if (res) {
              setIsPermitted(true);
            } else {
              setIsPermitted(false);
            }
          });
        }
        ethereum.on('accountsChanged', (accounts) => {
          setAccount(accounts[0]);
          if (vaccineContract) {
            vaccineContract.methods.onlyPermittedPersonal(ethereum.selectedAddress).call((error, res) => {
              if (res) {
                setIsPermitted(true);
              } else {
                setIsPermitted(false);
              }
            });
          }
        });
      } catch (error) {
        alert('Non-Ethereum browser detected. You should consider trying MetaMask!.');
        setProvideEthAccess(false);
      }
    } else if (window.web3) {
      window.web3 = new Web3(Web3.currentProvider);
      setProvideEthAccess(true);
    }
    // Non-dapp browsers...
    else {
      alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
      setProvideEthAccess(false);
    }
  });

  const init = async () => {
    const web3 = new Web3(Web3.currentProvider || 'http://127.0.0.1:7545');

    const _vaccineContract = new web3.eth.Contract(VACCINE_ABI, VACCINE_ADRS);
    setVaccineContract(_vaccineContract);

    const _totalRegistered = await _vaccineContract.methods.totalRegistered().call();
    setTotalRegistered(_totalRegistered);

    for (let i = 1; i <= _totalRegistered; i++) {
      _vaccineContract.methods.people(i).call((error, res) => {
        if (res) {
          people.push(res);
        }
      });
    }

    setPeople(people);
    setLoading(false);
  };

  useEffect(() => init(), []);

  return (
    <div className="mt-5 mr-5 ml-5">
      {provideEthAccess && (
        <div>
          <div className="row">
            <div className="col-sm">
              <VaccineCheck contract={vaccineContract} account={account} />
            </div>
            <div className="col-sm">
              <GetStats contract={vaccineContract} account={account} />
            </div>
          </div>
          <div>
            <AddPerson contract={vaccineContract} account={account} />
          </div>
          <div>
            <PeopleList people={people} contract={vaccineContract} account={account} isPermitted={isPermitted} loading={loading} />
          </div>
          <div>
            <label className="mt-5 mb-1"> © AviVit Technologies Inc. </label>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
