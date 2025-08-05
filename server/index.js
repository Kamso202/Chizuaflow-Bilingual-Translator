const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');
const app = express();
const port = 3001;

// --- Configuration (Update these with your actual values) ---
// Replace with the actual deployed address of your VotingSystem contract on Ganache
const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS"; // <-- REPLACE THIS
// Replace with the ABI array copied from artifacts/contracts/VotingSystem.sol/VotingSystem.json
const CONTRACT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "candidateId",
        "type": "uint256"
      }
    ],
    "name": "CandidateAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newState",
        "type": "uint256"
      }
    ],
    "name": "ElectionStateChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "voter",
        "type": "address"
      }
    ],
    "name": "VoterRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "voter",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "candidateId",
        "type": "uint256"
      }
    ],
    "name": "VoteCast",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [],
    "name": "VotingEnded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [],
    "name": "VotingStarted",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      }
    ],
    "name": "addCandidate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_candidateId",
        "type": "uint256"
      }
    ],
    "name": "castVote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "candidates",
    "outputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "voteCount",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "exists",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "candidateCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "currentElectionState",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "endVoting",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_candidateId",
        "type": "uint256"
      }
    ],
    "name": "getCandidate",
    "outputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "voteCount",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getCandidateCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "count",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getCurrentElectionState",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "state",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getResults",
    "outputs": [
      {
        "internalType": "string[]",
        "name": "names",
        "type": "string[]"
      },
      {
        "internalType": "uint256[]",
        "name": "voteCounts",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalVotes",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "votes",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_voter",
        "type": "address"
      }
    ],
    "name": "getVoterStatus",
    "outputs": [
      {
        "internalType": "bool",
        "name": "isRegistered",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "hasVoted",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_voter",
        "type": "address"
      }
    ],
    "name": "isEligibleToVote",
    "outputs": [
      {
        "internalType": "bool",
        "name": "eligible",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_voter",
        "type": "address"
      }
    ],
    "name": "registerVoter",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "startVoting",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalVotes",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "",
        "name": "",
        "type": "address"
      }
    ],
    "name": "voters",
    "outputs": [
      {
        "internalType": "bool",
        "name": "isRegistered",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "hasVoted",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "votedFor",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]; // <-- REPLACE THIS (paste the actual array here)

// Ganache RPC URL
const GANACHE_RPC_URL = "http://127.0.0.1:7545"; // Default Ganache RPC URL

// --- Mock Data Store (Simulating University Database) ---
// In a real system, this would be a secure database integration.
const mockStudents = [
    { studentId: "UNIZIK/2020/001", name: "John Doe", department: "Computer Science", level: "400" },
    { studentId: "UNIZIK/2020/002", name: "Jane Smith", department: "Computer Science", level: "400" },
    { studentId: "UNIZIK/2020/003", name: "Mike Johnson", department: "Computer Science", level: "400" },
    { studentId: "UNIZIK/2020/004", name: "Sarah Wilson", department: "Computer Science", level: "400" },
    { studentId: "UNIZIK/2020/005", name: "David Brown", department: "Computer Science", level: "400" },
    { studentId: "UNIZIK/2020/006", name: "Emily Davis", department: "Computer Science", level: "400" },
    { studentId: "UNIZIK/2020/007", name: "Robert Miller", department: "Computer Science", level: "400" },
    { studentId: "UNIZIK/2020/008", name: "Lisa Garcia", department: "Computer Science", level: "400" },
    { studentId: "UNIZIK/2020/009", name: "James Rodriguez", department: "Computer Science", level: "400" },
    { studentId: "UNIZIK/2020/010", name: "Maria Martinez", department: "Computer Science", level: "400" }
];

// This will store a mapping of studentId to the ETH address they've linked in the prototype
// This simulates the "registration" of a student ID with a blockchain address for the prototype.
const registeredPrototypeVoters = {}; // { 'UNIZIK/2020/001': '0xabc...', 'UNIZIK/2020/002': '0xdef...' }

// --- Middleware ---
app.use(cors()); // Enable CORS for frontend communication
app.use(express.json()); // To parse JSON request bodies

// --- API Endpoints ---

// Endpoint for mock student ID verification
app.post('/api/verify-student', (req, res) => {
    const { studentId } = req.body;
    const student = mockStudents.find(s => s.studentId === studentId);

    if (student) {
        // Check if this student ID has already been used to "register" a wallet in the prototype
        if (registeredPrototypeVoters[studentId]) {
            return res.status(400).json({ success: false, message: 'Student ID already used for prototype registration.' });
        }
        return res.json({ success: true, message: 'Student ID found. Proceed to connect your wallet.' });
    } else {
        return res.status(404).json({ success: false, message: 'Student ID not found.' });
    }
});

// Endpoint to "register" a mock student ID with a wallet address for the prototype
// This endpoint will also call the smart contract's registerVoter function (as the owner/admin)
app.post('/api/prototype-register-wallet', async (req, res) => {
    const { studentId, walletAddress } = req.body;

    const student = mockStudents.find(s => s.studentId === studentId);

    if (!student) {
        return res.status(400).json({ success: false, message: 'Invalid Student ID.' });
    }
    if (registeredPrototypeVoters[studentId]) {
        return res.status(400).json({ success: false, message: 'Student ID already used for prototype registration.' });
    }

    try {
        // Connect to Ganache using a provider
        const provider = new ethers.JsonRpcProvider(GANACHE_RPC_URL);

        // Get the owner's private key from Ganache (first account's private key)
        // IMPORTANT: In a real app, never hardcode private keys. For prototype, it's acceptable.
        // You'll need to get this from Ganache's accounts tab.
        const ownerPrivateKey = "YOUR_GANACHE_OWNER_PRIVATE_KEY"; // <-- REPLACE THIS with Ganache's first account private key
        const ownerWallet = new ethers.Wallet(ownerPrivateKey, provider);

        // Instantiate the smart contract with the owner's wallet
        const votingSystemContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, ownerWallet);

        // Call the registerVoter function on the smart contract
        const tx = await votingSystemContract.registerVoter(walletAddress);
        await tx.wait(); // Wait for the transaction to be mined

        // Store the association in our mock prototype registry
        registeredPrototypeVoters[studentId] = walletAddress;

        return res.json({ success: true, message: 'Prototype registration successful. Wallet linked and registered on blockchain.' });

    } catch (error) {
        console.error("Error during prototype registration:", error);
        return res.status(500).json({ success: false, message: 'Failed to register wallet on blockchain. ' + error.message });
    }
});

// --- Admin API (Optional, for demonstration of admin actions) ---
// This endpoint allows the owner to add candidates via the backend
app.post('/api/admin/add-candidate', async (req, res) => {
    const { candidateName } = req.body;
    try {
        const provider = new ethers.JsonRpcProvider(GANACHE_RPC_URL);
        const ownerPrivateKey = "YOUR_GANACHE_OWNER_PRIVATE_KEY"; // <-- REPLACE THIS
        const ownerWallet = new ethers.Wallet(ownerPrivateKey, provider);
        const votingSystemContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, ownerWallet);

        const tx = await votingSystemContract.addCandidate(candidateName);
        await tx.wait();
        res.json({ success: true, message: `Candidate '${candidateName}' added.` });
    } catch (error) {
        console.error("Error adding candidate:", error);
        res.status(500).json({ success: false, message: 'Failed to add candidate. ' + error.message });
    }
});

// Admin API to start voting
app.post('/api/admin/start-voting', async (req, res) => {
    try {
        const provider = new ethers.JsonRpcProvider(GANACHE_RPC_URL);
        const ownerPrivateKey = "YOUR_GANACHE_OWNER_PRIVATE_KEY"; // <-- REPLACE THIS
        const ownerWallet = new ethers.Wallet(ownerPrivateKey, provider);
        const votingSystemContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, ownerWallet);

        const tx = await votingSystemContract.startVoting();
        await tx.wait();
        res.json({ success: true, message: 'Voting started.' });
    } catch (error) {
        console.error("Error starting voting:", error);
        res.status(500).json({ success: false, message: 'Failed to start voting. ' + error.message });
    }
});

// Admin API to end voting
app.post('/api/admin/end-voting', async (req, res) => {
    try {
        const provider = new ethers.JsonRpcProvider(GANACHE_RPC_URL);
        const ownerPrivateKey = "YOUR_GANACHE_OWNER_PRIVATE_KEY"; // <-- REPLACE THIS
        const ownerWallet = new ethers.Wallet(ownerPrivateKey, provider);
        const votingSystemContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, ownerWallet);

        const tx = await votingSystemContract.endVoting();
        await tx.wait();
        res.json({ success: true, message: 'Voting ended.' });
    } catch (error) {
        console.error("Error ending voting:", error);
        res.status(500).json({ success: false, message: 'Failed to end voting. ' + error.message });
    }
});

// --- Start Server ---
app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
    console.log(`\n=== IMPORTANT SETUP REMINDERS ===`);
    console.log(`1. Update CONTRACT_ADDRESS in this file with your deployed contract address`);
    console.log(`2. Update YOUR_GANACHE_OWNER_PRIVATE_KEY with the first account's private key from Ganache`);
    console.log(`3. Ensure Ganache is running on http://127.0.0.1:7545`);
});