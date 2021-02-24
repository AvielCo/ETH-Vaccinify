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
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: 'adrs',
        type: 'address',
      },
    ],
    name: 'addPermit',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'string',
        name: '_id',
        type: 'string',
      },
    ],
    name: 'checkIfVaccinated',
    outputs: [
      {
        internalType: 'bool',
        name: 'result',
        type: 'bool',
      },
      {
        internalType: 'string',
        name: 'name',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'location',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'date',
        type: 'uint256',
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
        internalType: 'address',
        name: 'adrs',
        type: 'address',
      },
    ],
    name: 'checkIsOwner',
    outputs: [
      {
        internalType: 'bool',
        name: 'isOwner',
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
    name: 'getIds',
    outputs: [
      {
        internalType: 'string[]',
        name: '',
        type: 'string[]',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'getPeople',
    outputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'id',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'name',
            type: 'string',
          },
          {
            internalType: 'int256',
            name: 'age',
            type: 'int256',
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
        internalType: 'struct Vaccine.Person[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'getPermittedList',
    outputs: [
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'getStats',
    outputs: [
      {
        internalType: 'uint256',
        name: 'total',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'vaccinatedAmount',
        type: 'uint256',
      },
      {
        internalType: 'int256[]',
        name: 'totalVacAge',
        type: 'int256[]',
      },
      {
        internalType: 'int256[]',
        name: 'totalUnVacAge',
        type: 'int256[]',
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
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'onlyPermittedPersonal',
    outputs: [
      {
        internalType: 'bool',
        name: 'isPermitted',
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
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    name: 'people',
    outputs: [
      {
        internalType: 'string',
        name: 'id',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'name',
        type: 'string',
      },
      {
        internalType: 'int256',
        name: 'age',
        type: 'int256',
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
    constant: false,
    inputs: [
      {
        internalType: 'string',
        name: '_id',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_name',
        type: 'string',
      },
      {
        internalType: 'int256',
        name: '_age',
        type: 'int256',
      },
    ],
    name: 'registerPerson',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: 'adrs',
        type: 'address',
      },
    ],
    name: 'removePermit',
    outputs: [
      {
        internalType: 'bool',
        name: 'result',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'string',
        name: '_id',
        type: 'string',
      },
    ],
    name: 'removePerson',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'string',
        name: '_id',
        type: 'string',
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
    name: 'vaccinatePerson',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

export const VACCINE_ADRS = '0x230710701beACb53477A8531e0a6FFC10dcBf75A';
