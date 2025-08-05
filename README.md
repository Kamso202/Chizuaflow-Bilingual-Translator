# UNIZIK Blockchain-Based Voting System Prototype

A comprehensive blockchain-based voting system prototype for Nnamdi Azikiwe University, demonstrating enhanced transparency, security, and efficiency using Ethereum (Solidity) smart contracts.

## Project Overview

This prototype showcases a complete blockchain voting system with:
- **Smart Contract**: Solidity-based voting logic on Ethereum
- **Backend**: Node.js/Express.js server for mock student verification
- **Frontend**: Modern web interface for voter interaction
- **Blockchain Integration**: MetaMask wallet integration for secure transactions

## Features

- ✅ Student ID verification (mock database)
- ✅ Wallet-based voter registration
- ✅ Secure vote casting with blockchain immutability
- ✅ Real-time election results
- ✅ Admin panel for election management
- ✅ Multi-phase election states (Registration, Voting, Ended)

## Technology Stack

- **Blockchain**: Ethereum (Solidity), Hardhat, Ganache
- **Backend**: Node.js, Express.js, ethers.js
- **Frontend**: HTML5, CSS3, JavaScript, MetaMask
- **Development**: Local Ethereum network (Ganache)

## Project Structure

```
unizik-voting-system/
├── contracts/           # Smart contracts
├── scripts/            # Deployment scripts
├── server/             # Backend API server
├── client/             # Frontend web application
├── hardhat.config.js   # Hardhat configuration
└── README.md          # This file
```

## Quick Start

1. **Prerequisites**
   - Node.js (v16+)
   - MetaMask browser extension
   - Ganache desktop application

2. **Installation**
   ```bash
   npm install
   cd server && npm install
   cd ../client && npm install
   ```

3. **Setup**
   - Start Ganache
   - Deploy smart contract: `npx hardhat run scripts/deploy.js --network localhost`
   - Update contract address and ABI in configuration files
   - Start backend: `cd server && node index.js`
   - Start frontend: `cd client && http-server`

4. **Usage**
   - Open browser to `http://localhost:8080`
   - Connect MetaMask to Ganache network
   - Follow the voting workflow

## Development Status

This is a B.Sc. project prototype focusing on core functionality demonstration rather than full production readiness.

## License

Educational project for Nnamdi Azikiwe University.
