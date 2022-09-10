var Election = artifacts.require("./Election.sol");
contract("Election",function(accounts){
    var electionInstance;
    it("Initializes with 2 candidates",function(){
        return Election.deployed().then(function(instance){
            return instance.candidateCount();
        }).then(function(count){
            assert.equal(count,2);
        });
    });
    it("initializes the candidates with correct values",function(){
        return Election.deployed().then(function(instance){
            electionInstance = instance;
            return electionInstance.candidates(1);
        }).then(function(candidate){
            assert.equal(candidate[0],1,"Contains the correct id");
            assert.equal(candidate[1],"Candidate 1","Contains the correct name");
            assert.equal(candidate[2],0,"Contains the correct number of votes");
            return electionInstance.candidates(2);
        }).then(function(candidate){
            assert.equal(candidate[0],2,"Contains the correct id");
            assert.equal(candidate[1],"Candidate 2","contains the correct name");
            assert.equal(candidate[2],0,"contains the correct number of votes");
        });
    });
    it("allows a voter to cast a vote", function(){
        return Election.deployed().then(function(instance){
            electionInstance = instance;
            candidateID = 1;
            return electionInstance.vote(candidateID,{from:accounts[0]});
        }).then(function(receipt){
            return electionInstance.voters(accounts[0]);
        }).then(function(voted){
            assert(voted,"The voter has already voted");
            return electionInstance.candidates(candidateID);
        }).then(function(candidate){
            var voteCount = candidate[2];
            assert.equal(voteCount,1,"Increment candidate vote count");
        });
    });
    it("throws an exception for invalid candidates", function() {
        return Election.deployed().then(function(instance) {
          electionInstance = instance;
          return electionInstance.vote(99, { from: accounts[1] })
        }).then(assert.fail).catch(function(error) {
          assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
          return electionInstance.candidates(1);
        }).then(function(candidate1) {
          var voteCount = candidate1[2];
          assert.equal(voteCount, 1, "candidate 1 did not receive any votes");
          return electionInstance.candidates(2);
        }).then(function(candidate2) {
          var voteCount = candidate2[2];
          assert.equal(voteCount, 0, "candidate 2 did not receive any votes");
        });
    });
    it("throws an exception for double voting",function(){
        return Election.deployed().then(async function(instance){
            electionInstance = instance;
            candidateID = 2;
            await electionInstance.vote(candidateID,{from:accounts[1]});
            return electionInstance.candidates(candidateID);
        }).then(function(candidate){
            var voteCount = candidate[2];
            assert.equal(voteCount,1,"Accepts first vote");
            return electionInstance.vote(candidateID,{from:accounts[1]});
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert')>=0,"error message must contain revert");
            return electionInstance.candidates(1);
        }).then(function(candidate1){
            var voteCount = candidate1[2];
            assert.equal(voteCount,1,"Candidate did not receive any vote");
            return electionInstance.candidates(2);
        }).then(function(candidate2){
            var voteCount = candidate2[2];
            assert.equal(voteCount,1,"Candidate 2 did not receive any votes");
        });
    });
});