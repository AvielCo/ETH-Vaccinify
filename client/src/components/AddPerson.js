import React, { useState } from 'react';

function AddPerson({ contract, account }) {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  const addPerson = () => {
    if (!name || !id || !age) {
      return;
    }
    // const res = validateID(id);
    // if (!res.result) {
    // alert(res.cause);
    //     return;
    // }
    contract.methods
      .createPerson(name, id, parseInt(age))
      .send({ from: account, gas: 500000, gasPrice: '2000000000000' })
      .once('receipt', (receipt) => {
        console.log(`created preson ${name} with id: ${id}`);
      });
  };

  const handleChange = (event) => {
    const event_id = event.target.id;
    const value = event.target.value;
    switch (event_id) {
      case 'name':
        setName(value);
        break;
      case 'id':
        setId(value);
        break;
      case 'age':
        setAge(value);
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <form>
        <div>
          <label>
            <u>
              <b>
                <i>Registration</i>
              </b>
            </u>
          </label>
        </div>
        <div>
          <input className="mb-1 mt-1" type="text" id="name" value={name} onChange={handleChange} placeholder="Name" />
        </div>
        <div>
          <input className="mb-1 mt-1" type="text" id="id" value={id} onChange={handleChange} placeholder="ID" />
        </div>
        <div>
          <input className="mb-1 mt-1" type="text" id="age" value={age} onChange={handleChange} placeholder="Age" />
        </div>
        <button className="mb-1 mt-1" onClick={addPerson}>
          Register Person
        </button>
      </form>
    </div>
  );
}

export default AddPerson;
