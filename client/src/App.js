import Web3 from 'web3';
import React, { useEffect, useState } from 'react';
import { VACCINE_ABI, VACCINE_ADRS } from './config';
import GetStats from './components/GetStats';
import VaccineCheck from './components/VaccineCheck';
import PeopleList from './components/PeopleList';
import { validateID } from './Validators';
import CustomSnackbar from './components/CustomSnackbar';
import './assets/style.css';
import logo from './assets/logo.png';

function App() {
  const [account, setAccount] = useState('');
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vaccineContract, setVaccineContract] = useState();
  const [provideEthAccess, setProvideEthAccess] = useState(false);
  const [isPermitted, setIsPermitted] = useState(false);
  const [registeredPerson, setRegisteredPerson] = useState(false);
  const [snackBarSeverity, setSnackBarSeverity] = useState('');
  const [snackBarMessage, setSnackBarMessage] = useState('');
  const [snackBarOpen, setSnackBarOpen] = useState(false);

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
          console.log(ethereum.selectedAddress);

          vaccineContract.methods
            .onlyPermittedPersonal(ethereum.selectedAddress)
            .call()
            .then((res) => {
              setIsPermitted(res);
              !res && setSnackBar('You dont have permission to edit.', 'warning');
            })
            .catch((err) => {
              setSnackBar('Metamask is require.', 'error');
            });
        }
        ethereum.on('accountsChanged', (accounts) => {
          setAccount(accounts[0]);
          if (vaccineContract) {
            vaccineContract.methods
              .onlyPermittedPersonal(ethereum.selectedAddress)
              .call()
              .then((res) => {
                setIsPermitted(res);
                !res && setSnackBar('You dont have permission to edit.', 'warning');
              })
              .catch((err) => {
                setSnackBar('Metamask is require.', 'error');
              });
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
        vaccineContract.methods
          .onlyPermittedPersonal(ethereum.selectedAddress)
          .call()
          .then((res) => {
            setIsPermitted(true);
          })
          .catch((err) => {
            setIsPermitted(false);
            setSnackBar('You dont have permission to edit.', 'warning');
          });
      }
    }
    // Non-dapp browsers...
    else {
      setSnackBar('Metamask is require.', 'warning');
      setProvideEthAccess(false);
    }
  });

  const init = async () => {
    const web3 = new Web3(window.ethereum);

    const contract = new web3.eth.Contract(VACCINE_ABI, VACCINE_ADRS);
    setVaccineContract(contract);

    getPeople(contract);
  };

  const getPeople = (contract) => {
    let _people = [];
    contract.methods
      .getPeople()
      .call()
      .then((ppls) => {
        ppls.forEach((ppl) => {
          const { id, name, age, vaccineDate, vaccineLocation, vaccinated } = ppl;
          _people.push({
            id,
            name,
            age,
            vaccineDate,
            vaccineLocation,
            vaccinated,
          });
          setLoading(false);
          setPeople(_people);
        });
      })
      .catch((err) => setSnackBar('An error has been occured.', 'error'));
  };

  const setSnackBar = (message, severity) => {
    setSnackBarSeverity(severity);
    setSnackBarMessage(message);
    setSnackBarOpen(true);
  };

  useEffect(() => init(), []);

  return (
    <div>
      <div className="row pt-2 align-col">
        <div className="align-flex">
          <img src={logo} alt="vaccinify-logo" />
        </div>
        <div className="align-flex">
          <div>
            <div className="row align-row">
              <div>
                <GetStats contract={vaccineContract} account={account} isPermitted={isPermitted && provideEthAccess} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-5">
        <PeopleList
          people={people}
          contract={vaccineContract}
          account={account}
          isPermitted={isPermitted && provideEthAccess}
          loading={loading}
          setRegisteredPerson={setRegisteredPerson}
          setSnackBar={setSnackBar}
        />
      </div>
      <div className="align-flex">
        <label className="m-5 credits"> © AviVit Technologies Inc. </label>
      </div>
      <CustomSnackbar severity={snackBarSeverity} message={snackBarMessage} open={snackBarOpen} setOpen={setSnackBarOpen} />
    </div>
  );
}

export default App;
