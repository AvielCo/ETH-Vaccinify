import React from 'react'
import Person from './Person';
import { Divider } from '@material-ui/core';

function PeopleList({people, contract, account}) {

    return (
        <div>
            <div className="container">
            <div className="row">
                <div className="col-md">
                    <label><b>ID</b></label>
                    <div>
                        {people.map((person, index) => <div key={index}><label>{person.personId}</label></div>)}
                    </div>
                </div>
                <div className="col-md">
                    <label><b>Name</b></label>
                    <div>
                        {people.map((person, index) => <div key={index}><label>{person.name}</label></div>)}
                    </div>
                </div>
                <div className="col-md">
                    <label><b>Age</b></label>
                    <div>
                        {people.map((person, index) => <div key={index}><label>{person.age}</label></div>)}
                    </div>
                </div>
                <div className="col-md">
                    <label><b>Vacc Date</b></label>
                    <div>
                        {people.map((person, index) => <div key={index}>{person.vaccinated ? <label>{new Date(parseInt(person.vaccineDate)).toLocaleDateString(['he', 'il', 'he-IL'])}</label> : <label>Not vac</label>}</div>)}
                    </div>
                </div>
                <div className="col-md">
                    <label><b>Vacc Location</b></label>
                    <div>
                        {people.map((person, index) => <div key={index}><label>{person.vaccineLocation}</label></div>)}
                    </div>
                </div>
                <div className="col-md">
                    <label><b>Update</b></label>
                    <div>
                        {people.map((person, index) => <div key={index}>{person.vaccinated ? <label>V</label> : <input type="checkbox"/>}</div>)}
                    </div>
                </div>
            </div>
            </div>
        </div>
    )
}

/**
 * {people.length > 0 ? (
            <div>
              {people.map((item, index) => {
                return (
                  <div key={index}>
                    <Person
                      id={item.id}
                      name={item.name}
                      personId={item.personId}
                      age={item.age}
                      _date={item.vaccineDate}
                      _location={item.vaccineLocation}
                      _isVaccinated={item.vaccinated}
                      contract={contract}
                      account={account}
                    />
                    <Divider />
                  </div>
                );
              })}
            </div>
          ) : (
            <label>List is empty</label>
          )}
 */

export default PeopleList
