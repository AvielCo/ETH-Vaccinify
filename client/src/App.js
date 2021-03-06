import Web3 from 'web3';
import React, { useEffect, useState } from 'react';
import { Divider } from '@material-ui/core';
import { VACCINE_ABI, VACCINE_ADRS } from './config';
import GetStats from './components/GetStats';
import PeopleList from './components/Table/PeopleTable';
import CustomSnackbar from './components/CustomSnackbar';
import CustomAppBar from './components/CustomAppBar';
import Credits from './components/Credits';
import VaccineCheck from './components/VaccineCheck';
import './assets/style.css';

function App() {
  const [account, setAccount] = useState('');
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vaccineContract, setVaccineContract] = useState();
  const [provideEthAccess, setProvideEthAccess] = useState(false);
  const [isPermitted, setIsPermitted] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [snackBarSeverity, setSnackBarSeverity] = useState('');
  const [snackBarMessage, setSnackBarMessage] = useState('');
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [addedPerson, setAddedPerson] = useState(false);

  // Permitted user (for data editing) check
  const checkIfPermitted = (contract, address) => {
    contract.methods
      .onlyPermittedPersonal(address)
      .call()
      .then((res) => {
        setIsPermitted(res);
        !res && setSnackBar('You dont have permission to edit.', 'warning');
      })
      .catch((err) => {
        setSnackBar('Metamask is require.', 'error');
      });
  };

  // Smart contract owner check (user that did deploy for the contract)
  const checkIfOwner = (contract, address) => {
    contract.methods
      .checkIsOwner(address)
      .call()
      .then((res) => {
        setIsOwner(res);
      })
      .catch((err) => {
        setSnackBar('Metamask is require.', 'error');
      });
  };

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
          checkIfPermitted(vaccineContract, ethereum.selectedAddress);
          checkIfOwner(vaccineContract, ethereum.selectedAddress);
        }
        ethereum.on('accountsChanged', (accounts) => {
          setAccount(accounts[0]);
          if (vaccineContract) {
            checkIfPermitted(vaccineContract, ethereum.selectedAddress);
            checkIfOwner(vaccineContract, ethereum.selectedAddress);
          }
        });
      } catch (error) {
        setSnackBar('Metamask is require.', 'warning');
        setProvideEthAccess(false);
      }
    } else if (window.web3) {
      window.web3 = new Web3(Web3.currentProvider);
      setProvideEthAccess(true);
      if (vaccineContract) {
        checkIfPermitted(vaccineContract, ethereum.selectedAddress);
        checkIfOwner(vaccineContract, ethereum.selectedAddress);
      }
    } else {
      setSnackBar('Metamask is require.', 'warning');
      setProvideEthAccess(false);
    }
  });

  // System initialization
  const init = async () => {
    const web3 = new Web3(window.ethereum);

    const contract = new web3.eth.Contract(VACCINE_ABI, VACCINE_ADRS);
    setVaccineContract(contract);

    getPeople(contract).then(() => setLoading(false));
  };

  // People table (data) extraction
  const getPeople = async (contract) => {
    let _people = [];
    await contract.methods
      .getPeople()
      .call()
      .then((ppls) => {
        ppls.forEach((ppl) => {
          const { id, name, vaccineDate, vaccineLocation, vaccinated } = ppl;
          const age = parseInt(ppl.age);
          _people.push({
            id,
            name,
            age,
            vaccineDate,
            vaccineLocation,
            vaccinated,
          });
          setPeople(_people);
          setLoading(false);
        });
      })
      .catch((err) => setSnackBar('An error has been occured.', 'error'));
  };

  const setSnackBar = (message, severity) => {
    setSnackBarSeverity(severity);
    setSnackBarMessage(message);
    setSnackBarOpen(true);
  };

  // eslint-disable-next-line
  useEffect(() => init(), []);

  useEffect(() => {
    if (addedPerson && vaccineContract) {
      getPeople(vaccineContract);
      setAddedPerson(false);
    }
    // eslint-disable-next-line
  }, [addedPerson]);

  // Layout
  return (
    <div>
      <CustomAppBar isOwner={isOwner} account={account} contract={vaccineContract} setSnackBar={setSnackBar} />
      <div className="container pt-5">
        <div className="row">
          <div className="col col-md-9">
            <PeopleList
              people={people}
              contract={vaccineContract}
              account={account}
              setAddedPerson={setAddedPerson}
              isPermitted={isPermitted && provideEthAccess}
              isOwner={isOwner}
              loading={loading}
              setSnackBar={setSnackBar}
            />
          </div>
          <div className="col pt-3" hidden={!isPermitted}>
            <VaccineCheck contract={vaccineContract} account={account} isPermitted={isPermitted && provideEthAccess} setSnackBar={setSnackBar} />
            <GetStats contract={vaccineContract} account={account} isPermitted={isPermitted && provideEthAccess} />
          </div>
        </div>
      </div>
      <div className="mt-5">
        <Divider />
        <div>
          <Credits />
        </div>
      </div>
      <CustomSnackbar severity={snackBarSeverity} message={snackBarMessage} open={snackBarOpen} setOpen={setSnackBarOpen} />
    </div>
  );
}

export default App;
