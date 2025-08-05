// client/script.js
import { ethers } from './node_modules/ethers/dist/ethers.min.js';

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

const BACKEND_URL = "http://localhost:3001"; // URL of your Node.js backend
const GANACHE_RPC_URL = "http://127.0.0.1:7545"; // Ganache RPC URL

// --- Global Variables ---
let provider;
let signer;
let votingSystemContract;
let currentAccount = null;

// --- Utility Functions ---
function displayMessage(message, type) {
    const messageDiv = document.getElementById('message');
    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.className = `message ${type}`;
        messageDiv.style.display = 'block';
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 5000);
        }
    }
}

async function connectWallet() {
    if (window.ethereum) {
        try {
            provider = new ethers.BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []); // Request account access
            signer = await provider.getSigner();
            currentAccount = await signer.getAddress();
            votingSystemContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

            const displayElement = document.getElementById('walletAddressDisplay') || 
                                 document.getElementById('adminWalletAddressDisplay');
            if (displayElement) {
                displayElement.textContent = `Wallet Connected: ${currentAccount.substring(0, 6)}...${currentAccount.substring(currentAccount.length - 4)}`;
            }
            displayMessage("Wallet connected successfully!", "success");
            return true;
        } catch (error) {
            console.error("Error connecting wallet:", error);
            displayMessage(`Failed to connect wallet: ${error.message}`, "error");
            return false;
        }
    } else {
        displayMessage("MetaMask is not installed. Please install it to use this dApp.", "error");
        return false;
    }
}

// --- Page-Specific Logic ---

// Logic for index.html
if (document.getElementById('connectWalletBtn')) {
    document.getElementById('connectWalletBtn').addEventListener('click', connectWallet);
    // Auto-connect on page load if already approved
    window.addEventListener('load', async () => {
        if (window.ethereum && window.ethereum.selectedAddress) {
            await connectWallet();
        }
    });
}

// Logic for register.html
if (document.getElementById('verifyStudentBtn')) {
    document.getElementById('verifyStudentBtn').addEventListener('click', async () => {
        const studentId = document.getElementById('studentIdInput').value;
        if (!studentId) {
            displayMessage("Please enter a Student ID.", "error");
            return;
        }

        try {
            const response = await fetch(`${BACKEND_URL}/api/verify-student`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentId })
            });
            const data = await response.json();

            if (data.success) {
                displayMessage(data.message, "success");
                document.getElementById('registrationSection').style.display = 'block';
                // Ensure wallet is connected before allowing registration
                if (!currentAccount) {
                    await connectWallet();
                }
            } else {
                displayMessage(data.message, "error");
                document.getElementById('registrationSection').style.display = 'none';
            }
        } catch (error) {
            console.error("Error verifying student ID:", error);
            displayMessage(`Error verifying student ID: ${error.message}`, "error");
            document.getElementById('registrationSection').style.display = 'none';
        }
    });

    document.getElementById('registerWalletBtn').addEventListener('click', async () => {
        if (!currentAccount) {
            displayMessage("Please connect your MetaMask wallet first.", "error");
            return;
        }
        const studentId = document.getElementById('studentIdInput').value;

        try {
            displayMessage("Linking wallet and registering on blockchain...", "info");
            const response = await fetch(`${BACKEND_URL}/api/prototype-register-wallet`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentId, walletAddress: currentAccount })
            });
            const data = await response.json();

            if (data.success) {
                displayMessage(data.message, "success");
                document.getElementById('registrationSection').style.display = 'none';
                document.getElementById('registerWalletBtn').style.display = 'none';
            } else {
                displayMessage(data.message, "error");
            }
        } catch (error) {
            console.error("Error linking wallet:", error);
            displayMessage(`Error linking wallet: ${error.message}`, "error");
        }
    });

    // Initial wallet connection check for register page
    window.addEventListener('load', async () => {
        if (window.ethereum && window.ethereum.selectedAddress) {
            await connectWallet();
        }
    });
}

// Logic for vote.html
if (document.getElementById('candidatesSection')) {
    const loadVotingData = async () => {
        if (!currentAccount) {
            await connectWallet();
            if (!currentAccount) { // If still not connected after attempt
                document.getElementById('notEligible').style.display = 'block';
                document.getElementById('voterStatus').textContent = "Wallet not connected. Please connect your wallet.";
                return;
            }
        }

        try {
            const [registered, voted] = await votingSystemContract.getVoterStatus(currentAccount);
            const electionState = await votingSystemContract.currentElectionState(); // 0=Registering, 1=Voting, 2=Ended

            if (registered && !voted && electionState === 1) { // Registered, hasn't voted, and election is in Voting state
                document.getElementById('voterStatus').textContent = "Status: Registered and Eligible to Vote.";
                document.getElementById('candidatesSection').style.display = 'block';
                document.getElementById('notEligible').style.display = 'none';
                await loadCandidates();
            } else {
                let statusMessage = "Status: ";
                const reasons = [];
                if (!registered) {
                    statusMessage += "Not Registered. ";
                    reasons.push("You are not registered as a voter");
                }
                if (voted) {
                    statusMessage += "Already Voted. ";
                    reasons.push("You have already cast your vote");
                }
                if (electionState === 0) {
                    statusMessage += "Election is in Registration phase. ";
                    reasons.push("Voting has not started yet");
                }
                if (electionState === 2) {
                    statusMessage += "Election has Ended. ";
                    reasons.push("Voting period has ended");
                }
                
                document.getElementById('voterStatus').textContent = statusMessage;
                document.getElementById('notEligible').style.display = 'block';
                document.getElementById('candidatesSection').style.display = 'none';
                
                // Populate reasons
                const reasonsList = document.getElementById('eligibilityReasons');
                if (reasonsList) {
                    reasonsList.innerHTML = reasons.map(reason => `<li>${reason}</li>`).join('');
                }
            }
        } catch (error) {
            console.error("Error loading voter data:", error);
            displayMessage(`Error loading voter status: ${error.message}`, "error");
            document.getElementById('notEligible').style.display = 'block';
        }
    };

    const loadCandidates = async () => {
        const candidateList = document.getElementById('candidateList');
        candidateList.innerHTML = ''; // Clear previous list
        try {
            const count = await votingSystemContract.getCandidateCount();
            if (count === 0) {
                candidateList.innerHTML = '<li style="text-align: center; padding: 20px; color: #666;">No candidates registered yet.</li>';
                return;
            }
            for (let i = 0; i < count; i++) {
                const [name, votes] = await votingSystemContract.getCandidate(i);
                const listItem = document.createElement('li');
                listItem.className = 'candidate-item';
                listItem.innerHTML = `
                    <span><strong>${name}</strong></span>
                    <button data-index="${i}">🗳️ Vote</button>
                `;
                candidateList.appendChild(listItem);
            }

            // Add event listeners to vote buttons
            candidateList.querySelectorAll('button').forEach(button => {
                button.addEventListener('click', async (event) => {
                    const candidateIndex = parseInt(event.target.dataset.index);
                    try {
                        displayMessage("Casting your vote...", "info");
                        const tx = await votingSystemContract.castVote(candidateIndex);
                        await tx.wait();
                        displayMessage("Vote cast successfully! You have voted.", "success");
                        // Reload data to show user has voted
                        loadVotingData();
                    } catch (error) {
                        console.error("Error casting vote:", error);
                        displayMessage(`Error casting vote: ${error.message}`, "error");
                    }
                });
            });

        } catch (error) {
            console.error("Error loading candidates:", error);
            displayMessage(`Error loading candidates: ${error.message}`, "error");
        }
    };

    window.addEventListener('load', loadVotingData);
    // Also reload if account changes in MetaMask
    if (window.ethereum) {
        window.ethereum.on('accountsChanged', (accounts) => {
            currentAccount = accounts[0];
            loadVotingData();
        });
        window.ethereum.on('chainChanged', (chainId) => {
            window.location.reload(); // Reload page on network change
        });
    }
}

// Logic for results.html
if (document.getElementById('resultsList')) {
    const loadResults = async () => {
        if (!provider) {
            provider = new ethers.JsonRpcProvider(GANACHE_RPC_URL); // Use JsonRpcProvider for read-only if no wallet connected
            votingSystemContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
        }

        const resultsList = document.getElementById('resultsList');
        const noResultsMessage = document.getElementById('noResultsMessage');
        
        try {
            const electionState = await votingSystemContract.currentElectionState();
            let stateText = "Unknown";
            if (electionState === 0) stateText = "Registration Phase";
            else if (electionState === 1) stateText = "Voting is Active";
            else if (electionState === 2) stateText = "Election Ended";
            document.getElementById('electionStateDisplay').textContent = `Election State: ${stateText}`;

            const [names, counts] = await votingSystemContract.getResults();
            resultsList.innerHTML = ''; // Clear loading message

            if (names.length === 0) {
                resultsList.style.display = 'none';
                noResultsMessage.style.display = 'block';
                return;
            }

            noResultsMessage.style.display = 'none';
            resultsList.style.display = 'block';

            for (let i = 0; i < names.length; i++) {
                const listItem = document.createElement('li');
                listItem.className = 'result-item';
                listItem.innerHTML = `
                    <span><strong>${names[i]}</strong></span>
                    <span>Votes: ${counts[i].toString()}</span>
                `;
                resultsList.appendChild(listItem);
            }
        } catch (error) {
            console.error("Error loading results:", error);
            if (error.message.includes("Election not ended")) {
                resultsList.innerHTML = '<li style="text-align: center; padding: 20px; color: #666;">Results will be available once voting ends.</li>';
            } else {
                displayMessage(`Error loading results: ${error.message}`, "error");
            }
        }
    };

    // Refresh results button
    if (document.getElementById('refreshResultsBtn')) {
        document.getElementById('refreshResultsBtn').addEventListener('click', loadResults);
    }

    window.addEventListener('load', loadResults);
    // Refresh results periodically
    setInterval(loadResults, 5000); // Refresh every 5 seconds
}

// Logic for admin.html
if (document.getElementById('adminFunctions')) {
    const checkAdminStatus = async () => {
        if (!currentAccount) {
            await connectWallet();
            if (!currentAccount) {
                document.getElementById('adminFunctions').style.display = 'none';
                document.getElementById('notAdminMessage').style.display = 'block';
                displayMessage("Please connect your wallet to access admin functions.", "error");
                return;
            }
        }

        try {
            const contractOwner = await votingSystemContract.owner();
            if (currentAccount.toLowerCase() === contractOwner.toLowerCase()) {
                document.getElementById('adminFunctions').style.display = 'block';
                document.getElementById('notAdminMessage').style.display = 'none';
                displayMessage("You are connected as the contract owner.", "success");
                await loadAdminStats();
            } else {
                document.getElementById('adminFunctions').style.display = 'none';
                document.getElementById('notAdminMessage').style.display = 'block';
                displayMessage("You are not the contract owner. Admin functions are disabled.", "error");
            }
        } catch (error) {
            console.error("Error checking admin status:", error);
            displayMessage(`Error checking admin status: ${error.message}`, "error");
        }
    };

    const loadAdminStats = async () => {
        try {
            const electionState = await votingSystemContract.currentElectionState();
            const candidateCount = await votingSystemContract.getCandidateCount();
            const totalVotes = await votingSystemContract.getTotalVotes();

            let stateText = "Unknown";
            if (electionState === 0) stateText = "Registration Phase";
            else if (electionState === 1) stateText = "Voting Active";
            else if (electionState === 2) stateText = "Election Ended";

            document.getElementById('currentState').textContent = stateText;
            document.getElementById('candidateCount').textContent = candidateCount.toString();
            document.getElementById('totalVotes').textContent = totalVotes.toString();
        } catch (error) {
            console.error("Error loading admin stats:", error);
        }
    };

    document.getElementById('addCandidateBtn').addEventListener('click', async () => {
        const candidateName = document.getElementById('candidateNameInput').value;
        if (!candidateName) {
            displayMessage("Please enter a candidate name.", "error");
            return;
        }
        try {
            displayMessage("Adding candidate...", "info");
            // Call backend API for admin actions
            const response = await fetch(`${BACKEND_URL}/api/admin/add-candidate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ candidateName })
            });
            const data = await response.json();
            if (data.success) {
                displayMessage(data.message, "success");
                document.getElementById('candidateNameInput').value = ''; // Clear input
                await loadAdminStats(); // Refresh stats
            } else {
                displayMessage(data.message, "error");
            }
        } catch (error) {
            console.error("Error adding candidate:", error);
            displayMessage(`Error adding candidate: ${error.message}`, "error");
        }
    });

    document.getElementById('startVotingBtn').addEventListener('click', async () => {
        try {
            displayMessage("Starting voting...", "info");
            const response = await fetch(`${BACKEND_URL}/api/admin/start-voting`, { method: 'POST' });
            const data = await response.json();
            if (data.success) {
                displayMessage(data.message, "success");
                await loadAdminStats(); // Refresh stats
            } else {
                displayMessage(data.message, "error");
            }
        } catch (error) {
            console.error("Error starting voting:", error);
            displayMessage(`Error starting voting: ${error.message}`, "error");
        }
    });

    document.getElementById('endVotingBtn').addEventListener('click', async () => {
        try {
            displayMessage("Ending voting...", "info");
            const response = await fetch(`${BACKEND_URL}/api/admin/end-voting`, { method: 'POST' });
            const data = await response.json();
            if (data.success) {
                displayMessage(data.message, "success");
                await loadAdminStats(); // Refresh stats
            } else {
                displayMessage(data.message, "error");
            }
        } catch (error) {
            console.error("Error ending voting:", error);
            displayMessage(`Error ending voting: ${error.message}`, "error");
        }
    });

    window.addEventListener('load', checkAdminStatus);
    if (window.ethereum) {
        window.ethereum.on('accountsChanged', (accounts) => {
            currentAccount = accounts[0];
            checkAdminStatus();
        });
        window.ethereum.on('chainChanged', (chainId) => {
            window.location.reload();
        });
    }
}

// Global MetaMask event listeners
if (window.ethereum) {
    window.ethereum.on('accountsChanged', (accounts) => {
        currentAccount = accounts[0];
        // Refresh current page functionality
        if (document.getElementById('candidatesSection')) {
            // On vote page, reload voting data
            setTimeout(() => {
                if (typeof loadVotingData === 'function') loadVotingData();
            }, 1000);
        }
    });
    
    window.ethereum.on('chainChanged', (chainId) => {
        window.location.reload();
    });
}