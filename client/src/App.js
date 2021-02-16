import Web3 from 'web3';
import React, { useEffect, useState } from 'react';
import { VACCINE_ABI, VACCINE_ADRS } from './config';
import GetStats from './components/GetStats';
import AddPerson from './components/AddPerson';
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
  const [totalRegistered, setTotalRegistered] = useState(0);
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
              setSnackBar(err, 'error');
            });
        }
        ethereum.on('accountsChanged', (accounts) => {
          setAccount(accounts[0]);
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
                setSnackBar(err, 'error');
              });
          }
        });
      } catch (error) {
        console.log(error);
        setSnackBar('Non-Ethereum browser detected. You should consider trying MetaMask!.', 'warning');
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
      setSnackBar('Non-Ethereum browser detected. You should consider trying MetaMask!.', 'warning');
      setProvideEthAccess(false);
    }
  });

  const init = async () => {
    const web3 = new Web3(window.ethereum);

    const _vaccineContract = new web3.eth.Contract(VACCINE_ABI, VACCINE_ADRS);
    setVaccineContract(_vaccineContract);

    const _totalRegistered = await _vaccineContract.methods.totalRegistered().call();
    setTotalRegistered(_totalRegistered);

    getPeople(_vaccineContract, _totalRegistered);
  };

  const getPeople = (contract, total) => {
    let _people = [];
    console.log(total);
    if (!registeredPerson && loading) {
      const a = async () => {
        for (let i = 1; i <= total; i++) {
          await contract.methods.people(i).call((error, res) => {
            if (res) {
              _people.push(res);
            }
          });
        }
      };
      a().then(() => {
        console.log('inside if!registeredPerson && loading, then: ', _people);
        setPeople(_people);
        setLoading(false);
      });
    } else if (registeredPerson) {
      _people = people;
      console.log('inside else: ', _people);
      contract.methods.people(Number(totalRegistered) + 1).call((error, res) => {
        if (res) {
          _people.push(res);
          console.log('res: ', res);
          console.log('inside else, inside if res: ', _people);
          setPeople(_people);
          setRegisteredPerson(false);
        }
      });
      setTotalRegistered(Number(totalRegistered) + 1);
    }
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
                <VaccineCheck contract={vaccineContract} account={account} isPermitted={isPermitted && provideEthAccess} />
              </div>
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
