pragma solidity ^0.5.0;

contract Vaccine {
    address[] private permitted = new address[](100);
    string[] ids;
    
    struct Person{
        string name;
        uint age;
        uint256 vaccineDate;
        string vaccineLocation;
        bool vaccinated;
    }

    mapping(string => Person) public people;

    constructor() public {
        permitted = [address(0x603a75B479a4b39F5851b75C77844D0841529FED),
            address(0xf0e8e976Dfc43e3d01aEddc75f155f1Bc83D5fF7), address(0x5B38Da6a701c568545dCfcB03FcB875f56beddC4),
            address(0x1E93aa466Be01642d2Bd89E4198D1cFa2ADd104f)];
    }

    function onlyPermittedPersonal(address sender) public view returns(bool isPersonal){
        for(uint i; i < permitted.length; i++){
            if(sender == permitted[i]){
                return true;
            }
        }
        return false;
    }

    modifier checkPersonalAddress(){
        require(onlyPermittedPersonal(msg.sender), 'You dont have permission!!!');
        _;
    }

    function checkIfIDExists(string memory id) private view returns(bool isExists, uint index) {
        for(uint i = 0; i < ids.length; i++){
            if(keccak256(abi.encodePacked(ids[i])) == keccak256(abi.encodePacked(id))){
                return (true, i);
            }
        }
        return (false, 0);
    }

    function registerPerson(string memory _id, string memory _name, uint _age) public checkPersonalAddress returns(bool) {
        ids.push(_id);
        people[_id] = Person(_name, _age, 0, "", false);
    }
    
    function removePerson(string memory _id) public checkPersonalAddress {
        (bool isExists, uint index) = checkIfIDExists(_id);
        if(!isExists){
            revert("Invalid ID.");
        }
        ids[index] = ids[ids.length - 1];
        ids.pop();
        delete(people[_id]);
    }

    function checkIfVaccinated(string memory _id) public view checkPersonalAddress returns(bool isVaccinated)  {
        (bool isExists, uint index) = checkIfIDExists(_id);
        if(!isExists){
            revert("Invalid ID.");
        }
        return people[_id].vaccinated;
    }
    
    
    function vaccinatePerson(string memory _id, string memory _location, uint256 _date) public checkPersonalAddress{
        if(checkIfVaccinated(_id)){
           revert('Person already vaccinated.'); 
        }
        people[_id].vaccineLocation = _location;
        people[_id].vaccineDate = _date;
        people[_id].vaccinated = true;
    }

    function getStats() public view checkPersonalAddress returns(uint, uint, uint, uint) {
        if(ids.length == 0){
            return (0, 0, 0, 0);
        }
        
        uint vaccinatedCount = 0;
        uint totalUnVaccinatedAge = 0;
        uint totalVaccinatedAge = 0;
        
        for (uint i = 0; i < ids.length; i++){
            Person storage person = people[ids[i]];
            if (person.vaccinated == true) {
                vaccinatedCount++;
                totalVaccinatedAge = totalVaccinatedAge + person.age;
            }
            else{
                totalUnVaccinatedAge = totalUnVaccinatedAge + person.age;
            }
        }
        return (vaccinatedCount, totalVaccinatedAge, totalUnVaccinatedAge, ids.length);
    }
}