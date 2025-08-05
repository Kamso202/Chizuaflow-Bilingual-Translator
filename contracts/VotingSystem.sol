// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title VotingSystem
 * @dev A blockchain-based voting system for Nnamdi Azikiwe University
 * @author UNIZIK Student
 */
contract VotingSystem {
    // Events
    event VoterRegistered(address indexed voter);
    event CandidateAdded(string name, uint256 candidateId);
    event VoteCast(address indexed voter, uint256 candidateId);
    event VotingStarted();
    event VotingEnded();
    event ElectionStateChanged(uint256 newState);

    // State variables
    address public owner;
    uint256 public currentElectionState; // 0 = Registering, 1 = Voting, 2 = Ended
    
    struct Candidate {
        string name;
        uint256 voteCount;
        bool exists;
    }
    
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint256 votedFor;
    }
    
    mapping(address => Voter) public voters;
    mapping(uint256 => Candidate) public candidates;
    uint256 public candidateCount;
    uint256 public totalVotes;
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlyRegisteredVoter() {
        require(voters[msg.sender].isRegistered, "Voter not registered");
        _;
    }
    
    modifier onlyDuringRegistration() {
        require(currentElectionState == 0, "Election not in registration phase");
        _;
    }
    
    modifier onlyDuringVoting() {
        require(currentElectionState == 1, "Election not in voting phase");
        _;
    }
    
    modifier onlyAfterVoting() {
        require(currentElectionState == 2, "Election not ended");
        _;
    }
    
    modifier hasNotVoted() {
        require(!voters[msg.sender].hasVoted, "Voter has already voted");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        currentElectionState = 0; // Start in registration phase
        candidateCount = 0;
        totalVotes = 0;
    }
    
    /**
     * @dev Register a voter (only owner can call this)
     * @param _voter Address of the voter to register
     */
    function registerVoter(address _voter) public onlyOwner onlyDuringRegistration {
        require(_voter != address(0), "Invalid voter address");
        require(!voters[_voter].isRegistered, "Voter already registered");
        
        voters[_voter].isRegistered = true;
        voters[_voter].hasVoted = false;
        voters[_voter].votedFor = 0;
        
        emit VoterRegistered(_voter);
    }
    
    /**
     * @dev Add a candidate (only owner can call this)
     * @param _name Name of the candidate
     */
    function addCandidate(string memory _name) public onlyOwner onlyDuringRegistration {
        require(bytes(_name).length > 0, "Candidate name cannot be empty");
        
        candidates[candidateCount] = Candidate({
            name: _name,
            voteCount: 0,
            exists: true
        });
        
        emit CandidateAdded(_name, candidateCount);
        candidateCount++;
    }
    
    /**
     * @dev Start the voting phase (only owner can call this)
     */
    function startVoting() public onlyOwner onlyDuringRegistration {
        require(candidateCount > 0, "No candidates registered");
        currentElectionState = 1;
        emit VotingStarted();
        emit ElectionStateChanged(currentElectionState);
    }
    
    /**
     * @dev End the voting phase (only owner can call this)
     */
    function endVoting() public onlyOwner onlyDuringVoting {
        currentElectionState = 2;
        emit VotingEnded();
        emit ElectionStateChanged(currentElectionState);
    }
    
    /**
     * @dev Cast a vote for a candidate
     * @param _candidateId ID of the candidate to vote for
     */
    function castVote(uint256 _candidateId) public onlyRegisteredVoter onlyDuringVoting hasNotVoted {
        require(_candidateId < candidateCount, "Invalid candidate ID");
        require(candidates[_candidateId].exists, "Candidate does not exist");
        
        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedFor = _candidateId;
        candidates[_candidateId].voteCount++;
        totalVotes++;
        
        emit VoteCast(msg.sender, _candidateId);
    }
    
    /**
     * @dev Get voter status
     * @param _voter Address of the voter
     * @return isRegistered Whether the voter is registered
     * @return hasVoted Whether the voter has voted
     */
    function getVoterStatus(address _voter) public view returns (bool isRegistered, bool hasVoted) {
        return (voters[_voter].isRegistered, voters[_voter].hasVoted);
    }
    
    /**
     * @dev Get candidate information
     * @param _candidateId ID of the candidate
     * @return name Name of the candidate
     * @return voteCount Number of votes received
     */
    function getCandidate(uint256 _candidateId) public view returns (string memory name, uint256 voteCount) {
        require(_candidateId < candidateCount, "Invalid candidate ID");
        return (candidates[_candidateId].name, candidates[_candidateId].voteCount);
    }
    
    /**
     * @dev Get total number of candidates
     * @return count Number of candidates
     */
    function getCandidateCount() public view returns (uint256 count) {
        return candidateCount;
    }
    
    /**
     * @dev Get election results (only after voting has ended)
     * @return names Array of candidate names
     * @return voteCounts Array of vote counts
     */
    function getResults() public view onlyAfterVoting returns (string[] memory names, uint256[] memory voteCounts) {
        names = new string[](candidateCount);
        voteCounts = new uint256[](candidateCount);
        
        for (uint256 i = 0; i < candidateCount; i++) {
            names[i] = candidates[i].name;
            voteCounts[i] = candidates[i].voteCount;
        }
        
        return (names, voteCounts);
    }
    
    /**
     * @dev Get current election state
     * @return state Current election state (0=Registering, 1=Voting, 2=Ended)
     */
    function getCurrentElectionState() public view returns (uint256 state) {
        return currentElectionState;
    }
    
    /**
     * @dev Get total votes cast
     * @return votes Total number of votes cast
     */
    function getTotalVotes() public view returns (uint256 votes) {
        return totalVotes;
    }
    
    /**
     * @dev Check if a voter is eligible to vote
     * @param _voter Address of the voter
     * @return eligible Whether the voter is eligible to vote
     */
    function isEligibleToVote(address _voter) public view returns (bool eligible) {
        return voters[_voter].isRegistered && !voters[_voter].hasVoted && currentElectionState == 1;
    }
}