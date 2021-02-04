pragma solidity >=0.4.22 <0.9.0;

contract Vaccine {
    uint public vaccinatedCount = 0;
    struct Person{
        string name;
        string id;
        uint256 vaccineDate;
        string vaccineLocation;
        bool firstVaccine;
        bool secondVaccine;
    }
}