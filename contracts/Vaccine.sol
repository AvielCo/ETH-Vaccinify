pragma solidity ^0.5.0;

contract Vaccine {
    uint public totalRegistered = 0;

    struct Person{
        uint id;
        string name;
        string personId;
        uint256 age;
        uint256 vaccineDate;
        string vaccineLocation;
        bool vaccinated;
    }

    mapping(uint => Person) public people;

    constructor() public {
        
    }

    function createPerson(string memory _name, string memory _personId, uint age) public{
        totalRegistered++;
        people[totalRegistered] = Person(totalRegistered, _name, _personId, age, 0, "", false);
    }

    function updatePerson(uint _id, string memory _location, uint256 _date) public{
        Person storage person = people[_id];
        person.vaccineLocation = _location;
        person.vaccineDate = _date;
        person.vaccinated = true;
    }

    function checkID(string memory _personId) public view returns(bool) {
        for (uint256 i = 1; i <= totalRegistered; i++){
            Person memory person = people[i];
            if (keccak256(abi.encodePacked(person.personId)) == keccak256(abi.encodePacked(_personId))){
                return person.vaccinated;
            }
        }
    }

    function getStats() public view returns(uint, uint, uint, uint){
        uint256 vaccinatedCount = 0;
        uint totalUnVaccinatedAge = 0;
        uint totalVaccinatedAge = 0;
        uint avgVaccinatedAge = 0;
        uint avgUnVaccinatedAge = 0;
        for (uint256 i = 1; i <= totalRegistered; i++){
            Person memory person = people[i];
            if (person.vaccinated == true) {
                vaccinatedCount++;
                totalVaccinatedAge += person.age;
            }
            else{
                totalUnVaccinatedAge += person.age;
            }
        }
        avgVaccinatedAge = totalVaccinatedAge / vaccinatedCount;
        if(totalRegistered - vaccinatedCount == 0){
            return (vaccinatedCount, avgVaccinatedAge, 0, totalRegistered);
        }
        avgUnVaccinatedAge = totalUnVaccinatedAge / (totalRegistered - vaccinatedCount);
        return (vaccinatedCount, avgVaccinatedAge, avgUnVaccinatedAge, totalRegistered);
    }
}