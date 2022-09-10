//SPDX-License-Identifier:MIT
pragma solidity >=0.4.11;
contract Election
{
    constructor() public
    {
        addCandidate("Candidate 1");
        addCandidate("Candidate 2");
    }
    struct candidate
    {
        uint id;
        string name;
        uint voteCount;
    }
    mapping (uint => candidate) public candidates;
    mapping(address => bool) public voters;
    uint public candidateCount;
    function addCandidate(string memory _name) private
    {
        candidateCount++;
        candidates[candidateCount] = candidate(candidateCount, _name, 0);
    }
    function vote(uint _candidateID) public
    {
        require(!voters[msg.sender]);
        require(_candidateID>0 && _candidateID<=candidateCount);
        candidates[_candidateID].voteCount++;
        voters[msg.sender] = true;
    }

}