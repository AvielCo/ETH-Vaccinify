pragma solidity ^0.5.0;

contract Vaccine {
    uint public vaccinatedCount = 0;

    struct Person{
        uint id;
        string name;
        string personId;
        uint256 vaccineDate;
        string vaccineLocation;
        bool vaccinated;
    }

    mapping(uint => Person) public people;

    constructor() public {
        createPerson("test", "123456789");
    }

    function createPerson(string memory _name, string memory _personId) public{
        vaccinatedCount++;
        people[vaccinatedCount] = Person(vaccinatedCount, _name, _personId, 0, "", false);
    }

    function updatePerson(uint _id, string memory _location, uint256 _date) public{
        Person storage person = people[_id];
        person.vaccineLocation = _location;
        person.vaccineDate = _date;
        person.vaccinated = true;
    }
}