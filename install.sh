#!/bin/bash

# UNIZIK Blockchain Voting System - Installation Script
# This script automates the installation and setup process

echo "🚀 UNIZIK Blockchain Voting System - Installation Script"
echo "========================================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher first."
    echo "Download from: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install main project dependencies
echo ""
echo "📦 Installing main project dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install main dependencies"
    exit 1
fi

# Install backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
cd server
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi
cd ..

# Install frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
cd client
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi
cd ..

echo ""
echo "✅ All dependencies installed successfully!"
echo ""

# Check if Ganache is running
echo "🔍 Checking if Ganache is running..."
if curl -s http://127.0.0.1:7545 > /dev/null; then
    echo "✅ Ganache is running"
else
    echo "⚠️  Ganache is not running"
    echo "Please start Ganache and ensure it's running on http://127.0.0.1:7545"
fi

echo ""
echo "🎯 Next Steps:"
echo "=============="
echo ""
echo "1. 📋 Start Ganache (if not already running)"
echo "2. 🚀 Deploy the smart contract:"
echo "   npx hardhat run scripts/deploy.js --network localhost"
echo ""
echo "3. ⚙️  Configure the application:"
echo "   - Update CONTRACT_ADDRESS in server/index.js"
echo "   - Update CONTRACT_ADDRESS in client/script.js"
echo "   - Update YOUR_GANACHE_OWNER_PRIVATE_KEY in server/index.js"
echo ""
echo "4. 🔧 Start the backend server:"
echo "   cd server && node index.js"
echo ""
echo "5. 🌐 Start the frontend:"
echo "   cd client && npx http-server -p 8080"
echo ""
echo "6. 🔗 Configure MetaMask:"
echo "   - Add Ganache network (RPC: http://127.0.0.1:7545, Chain ID: 1337)"
echo "   - Import accounts from Ganache"
echo ""
echo "📖 For detailed instructions, see SETUP_GUIDE.md"
echo ""
echo "🎉 Installation completed successfully!"