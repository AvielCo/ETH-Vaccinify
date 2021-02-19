pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2 ;

contract Vaccine {
    address[] private permitted;
    string[] private ids;
    address owner;
    
    struct Person{
        string id;
        string name;
        uint age;
        uint256 vaccineDate;
        string vaccineLocation;
        bool vaccinated;
    }

    mapping(string => Person) public people;

    constructor() public {
        owner = msg.sender;
        permitted.push(owner);
    }
    
    // returns if the address is permitted to edit the blockchain.
    function onlyPermittedPersonal(address sender) public view returns(bool){
        for(uint i; i < permitted.length; i++){
            if(sender == permitted[i]){
                return true;
            }
        }
        return false;
    }

    // calls onlyPermittedPersonal with the transaction sender's address to check if he/she can edit the blockchain.
    modifier checkPersonalAddress(){
        require(onlyPermittedPersonal(msg.sender), 'You dont have permission!');
        _;
    }
    
    
    // returns every id that registered in the blockchain.
    function getIds() public view returns(string[] memory){
        return ids;
    }
    
    // returns every person that registered in the blockchain using the ids array.
    function getPeople() public view returns(Person[] memory){
        Person[] memory _people = new Person[](ids.length);
        for(uint i = 0; i < ids.length; i++){
            _people[i] = people[ids[i]];
        }
        return _people;
    }
    
    // check if sender address is owner (the deployer of this contract).
    modifier isOwner() {
        require(msg.sender == owner, "You are not the owner.");
        _;
    }
    
    
    // adds an address that has a permit to edit the blockchain.
    function addPermit(address adrs) public isOwner{
        for(uint i = 0; i < permitted.length; i++){
            if(adrs == permitted[i]){
                revert("Address is already permitted");
            }
        }
        permitted.push(adrs);
    }
    
    // removes an address that has a permit to edit the blockchain.
    function removePermit(address adrs) public isOwner returns(bool result){
        for(uint i = 0; i < permitted.length; i++){
            if(adrs == permitted[i]){
                permitted[i] = permitted[permitted.length - 1];
                permitted.pop();
                return true;
            }
        }
        return false;
    }
    
    
    function checkIsOwner(address adrs) public view returns(bool) {
       return owner == adrs;
    }
    
    // check if id is exists in ids array.
    function checkIfIDExists(string memory id) private view returns(bool, uint) {
        for(uint i = 0; i < ids.length; i++){
            if(keccak256(abi.encodePacked(ids[i])) == keccak256(abi.encodePacked(id))){
                return (true, i);
            }
        }
        return (false, 0);
    }
    
    
    // register a new person to the blockchain
    function registerPerson(string memory _id, string memory _name, uint _age) public checkPersonalAddress returns(bool) {
        (bool isExists, uint index) = checkIfIDExists(_id);
        require(!isExists, "Person already exists.");
        ids.push(_id);
        people[_id] = Person(_id, _name, _age, 0, "", false);
    }
    
    // removes a person from the blockchain.
    function removePerson(string memory _id) public checkPersonalAddress {
        (bool isExists, uint index) = checkIfIDExists(_id);
        require(isExists, "Invalid ID.");
        ids[index] = ids[ids.length - 1];
        ids.pop();
        delete(people[_id]);
    }

    // check if person is vaccinated (if vaccinated == true or false).
    function checkIfVaccinated(string memory _id) public view checkPersonalAddress returns(bool, string memory, string memory, uint)  {
        (bool isExists, uint index) = checkIfIDExists(_id);
        require(isExists, "Invalid ID.");
        return (people[_id].vaccinated, people[_id].name, people[_id].vaccineLocation, people[_id].vaccineDate) ;
    }
    
    // modify the vaccinate, location and date fields of a person.
    function vaccinatePerson(string memory _id, string memory _location, uint256 _date) public checkPersonalAddress{
        (bool isVaccinated, string memory name,string memory  location, uint date) = checkIfVaccinated(_id);
        require(!isVaccinated, 'Person already vaccinated.');
        people[_id].vaccineLocation = _location;
        people[_id].vaccineDate = _date;
        people[_id].vaccinated = true;
    }

    // get statistics of the blockchain.
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