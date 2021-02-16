/**
 * For new project with new blockchain network:
 *    1. build truffle
 *    2. go to ./build/contracts/Vaccine.json
 *    3. assign VACCINE_ABI to abi
 *    4. assign VACCINE_ADRS to network[5777].address
 */

export const VACCINE_ABI = [
  {
    inputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'string',
        name: '_personId',
        type: 'string',
      },
    ],
    name: 'checkID',
    outputs: [
      {
        internalType: 'bool',
        name: 'isVaccinated',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'string',
        name: '_name',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_personId',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'age',
        type: 'uint256',
      },
    ],
    name: 'createPerson',
    outputs: [
      {
        internalType: 'bool',
        name: 'isNotExists',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [],
    name: 'getStats',
    outputs: [
      {
        internalType: 'uint256',
        name: 'vaccinatedCount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'avgVaccinatedAge',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'avgUnVaccinatedAge',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'totalRegistered',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'onlyPermittedPersonal',
    outputs: [
      {
        internalType: 'bool',
        name: 'isPersonal',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'people',
    outputs: [
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'name',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'personId',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'age',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'vaccineDate',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'vaccineLocation',
        type: 'string',
      },
      {
        internalType: 'bool',
        name: 'vaccinated',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'totalRegistered',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'uint256',
        name: '_id',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: '_location',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: '_date',
        type: 'uint256',
      },
    ],
    name: 'updatePerson',
    outputs: [
      {
        internalType: 'bool',
        name: 'isVaccinated',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

export const VACCINE_ADRS = '0xce3dc7E9011689f908E15d02A805223C68C8ed6B';
