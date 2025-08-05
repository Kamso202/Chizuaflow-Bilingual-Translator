# 🚀 UNIZIK Blockchain Voting System - Complete Setup Guide

This guide will walk you through setting up the complete blockchain-based voting system prototype for Nnamdi Azikiwe University.

## 📋 Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MetaMask** browser extension - [Download here](https://metamask.io/)
- **Ganache** desktop application - [Download here](https://trufflesuite.com/ganache/)

## 🛠️ Installation Steps

### Step 1: Install Dependencies

Open your terminal and run the following commands:

```bash
# Install main project dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..

# Install frontend dependencies
cd client
npm install
cd ..
```

### Step 2: Start Ganache

1. Open the Ganache desktop application
2. Click "Quickstart" to create a new workspace
3. Note the RPC URL (usually `http://127.0.0.1:7545`)
4. Keep Ganache running throughout the development process

### Step 3: Deploy the Smart Contract

```bash
# Compile the smart contract
npx hardhat compile

# Deploy to Ganache
npx hardhat run scripts/deploy.js --network localhost
```

**IMPORTANT**: Copy the deployed contract address from the output. It will look like:
```
VotingSystem deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

### Step 4: Configure the Application

You need to update the contract address and ABI in two files:

#### A. Update Backend Configuration (`server/index.js`)

1. Replace `YOUR_CONTRACT_ADDRESS` with your actual deployed contract address
2. Replace `YOUR_GANACHE_OWNER_PRIVATE_KEY` with the private key of the first account in Ganache

To get the private key:
- Open Ganache
- Click on the key icon next to the first account
- Copy the private key

#### B. Update Frontend Configuration (`client/script.js`)

1. Replace `YOUR_CONTRACT_ADDRESS` with your actual deployed contract address
2. The ABI is already included in the file, but you can update it if needed

### Step 5: Start the Backend Server

```bash
cd server
node index.js
```

You should see:
```
Backend server listening at http://localhost:3001
```

### Step 6: Start the Frontend

Open a new terminal window:

```bash
cd client
npx http-server -p 8080
```

You should see:
```
Starting up http-server, serving ./
Available on:
  http://localhost:8080
```

### Step 7: Configure MetaMask

1. Open MetaMask in your browser
2. Add a new network:
   - Network Name: `Ganache`
   - New RPC URL: `http://127.0.0.1:7545`
   - Chain ID: `1337`
   - Currency Symbol: `ETH`

3. Import accounts from Ganache:
   - In Ganache, click the key icon next to any account
   - Copy the private key
   - In MetaMask, click "Import Account"
   - Paste the private key

## 🎯 Testing the System

### 1. Admin Setup (Use the first Ganache account)

1. Go to `http://localhost:8080/admin.html`
2. Connect MetaMask with the first account (contract owner)
3. Add candidates (e.g., "John Doe", "Jane Smith")
4. Click "Start Voting"

### 2. Voter Registration (Use different accounts)

1. Go to `http://localhost:8080/register.html`
2. Connect MetaMask with a different account
3. Enter a student ID (e.g., `UNIZIK/2020/001`)
4. Click "Verify Student ID"
5. Click "Link Wallet to Student ID"

### 3. Voting

1. Go to `http://localhost:8080/vote.html`
2. Ensure you're connected with a registered voter account
3. Select a candidate and click "Vote"
4. Confirm the transaction in MetaMask

### 4. View Results

1. Go to `http://localhost:8080/results.html`
2. View real-time election results
3. Results update automatically every 5 seconds

## 🔧 Troubleshooting

### Common Issues

1. **"MetaMask is not installed"**
   - Install MetaMask browser extension
   - Refresh the page

2. **"Failed to connect wallet"**
   - Ensure MetaMask is unlocked
   - Check if you're connected to the Ganache network
   - Try refreshing the page

3. **"Contract not found"**
   - Verify the contract address is correct
   - Ensure Ganache is running
   - Check if the contract was deployed successfully

4. **"Backend server not responding"**
   - Ensure the backend is running on port 3001
   - Check if all dependencies are installed
   - Verify the contract address and private key are correct

5. **"Transaction failed"**
   - Ensure you have enough ETH in your account
   - Check if you're connected to the correct network
   - Verify the election state allows the action

### Network Issues

If you're having network connectivity issues:

1. **Check Ganache RPC URL**: Ensure it's `http://127.0.0.1:7545`
2. **Verify MetaMask Network**: Make sure you're connected to Ganache
3. **Check Ports**: Ensure ports 3001 (backend) and 8080 (frontend) are available

## 📁 Project Structure

```
unizik-voting-system/
├── contracts/
│   └── VotingSystem.sol          # Smart contract
├── scripts/
│   └── deploy.js                 # Deployment script
├── server/
│   ├── package.json              # Backend dependencies
│   └── index.js                  # Backend server
├── client/
│   ├── package.json              # Frontend dependencies
│   ├── index.html                # Landing page
│   ├── register.html             # Registration page
│   ├── vote.html                 # Voting page
│   ├── results.html              # Results page
│   ├── admin.html                # Admin panel
│   ├── style.css                 # Styling
│   └── script.js                 # Frontend logic
├── hardhat.config.js             # Hardhat configuration
├── package.json                  # Main dependencies
└── README.md                     # Project overview
```

## 🔒 Security Notes

- **Private Keys**: Never share or commit private keys to version control
- **Production**: This is a prototype. For production use, implement proper security measures
- **Network**: Always use test networks for development and testing

## 🎓 Educational Purpose

This system is designed for educational purposes as a B.Sc. project prototype. It demonstrates:

- Smart contract development with Solidity
- Frontend-backend integration
- Blockchain interaction with MetaMask
- Real-time data updates
- Secure voting mechanisms

## 📞 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Verify all prerequisites are installed
3. Ensure all services are running
4. Check the browser console for error messages

## 🚀 Next Steps

Once the system is running, you can:

1. **Customize the UI**: Modify `client/style.css` for different styling
2. **Add Features**: Extend the smart contract with additional functionality
3. **Improve Security**: Implement additional security measures
4. **Scale Up**: Deploy to a public testnet for wider testing

---

**Good luck with your blockchain voting system project! 🎉**