#!/bin/bash

# UNIZIK Blockchain Voting System - Quick Start Script
# This script helps you get the system running quickly

echo "🚀 UNIZIK Blockchain Voting System - Quick Start"
echo "================================================"
echo ""

# Check if Ganache is running
echo "🔍 Checking Ganache connection..."
if curl -s http://127.0.0.1:7545 > /dev/null; then
    echo "✅ Ganache is running"
else
    echo "❌ Ganache is not running"
    echo "Please start Ganache first, then run this script again."
    echo "Download Ganache from: https://trufflesuite.com/ganache/"
    exit 1
fi

# Check if contract is deployed
echo ""
echo "🔍 Checking if contract is deployed..."
if [ -f "contract-address.txt" ]; then
    CONTRACT_ADDRESS=$(cat contract-address.txt)
    echo "✅ Contract address found: $CONTRACT_ADDRESS"
else
    echo "⚠️  Contract not deployed yet"
    echo "Deploying contract now..."
    
    # Compile and deploy
    npx hardhat compile
    DEPLOY_OUTPUT=$(npx hardhat run scripts/deploy.js --network localhost 2>&1)
    
    # Extract contract address
    CONTRACT_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep "VotingSystem deployed to:" | cut -d' ' -f4)
    
    if [ -n "$CONTRACT_ADDRESS" ]; then
        echo "$CONTRACT_ADDRESS" > contract-address.txt
        echo "✅ Contract deployed successfully: $CONTRACT_ADDRESS"
    else
        echo "❌ Failed to deploy contract"
        echo "Deploy output:"
        echo "$DEPLOY_OUTPUT"
        exit 1
    fi
fi

# Check if backend is running
echo ""
echo "🔍 Checking backend server..."
if curl -s http://localhost:3001 > /dev/null 2>&1; then
    echo "✅ Backend server is running"
else
    echo "⚠️  Backend server is not running"
    echo "Starting backend server..."
    
    # Start backend in background
    cd server
    nohup node index.js > ../backend.log 2>&1 &
    BACKEND_PID=$!
    echo $BACKEND_PID > ../backend.pid
    cd ..
    
    # Wait a moment for server to start
    sleep 3
    
    if curl -s http://localhost:3001 > /dev/null 2>&1; then
        echo "✅ Backend server started successfully"
    else
        echo "❌ Failed to start backend server"
        echo "Check backend.log for details"
        exit 1
    fi
fi

# Check if frontend is running
echo ""
echo "🔍 Checking frontend server..."
if curl -s http://localhost:8080 > /dev/null 2>&1; then
    echo "✅ Frontend server is running"
else
    echo "⚠️  Frontend server is not running"
    echo "Starting frontend server..."
    
    # Start frontend in background
    cd client
    nohup npx http-server -p 8080 > ../frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo $FRONTEND_PID > ../frontend.pid
    cd ..
    
    # Wait a moment for server to start
    sleep 3
    
    if curl -s http://localhost:8080 > /dev/null 2>&1; then
        echo "✅ Frontend server started successfully"
    else
        echo "❌ Failed to start frontend server"
        echo "Check frontend.log for details"
        exit 1
    fi
fi

echo ""
echo "🎉 System is ready!"
echo "=================="
echo ""
echo "🌐 Frontend: http://localhost:8080"
echo "🔧 Backend:  http://localhost:3001"
echo "📋 Contract: $CONTRACT_ADDRESS"
echo ""
echo "📖 Next Steps:"
echo "1. Open http://localhost:8080 in your browser"
echo "2. Configure MetaMask to connect to Ganache"
echo "3. Import accounts from Ganache into MetaMask"
echo "4. Start using the voting system!"
echo ""
echo "📚 For detailed instructions, see SETUP_GUIDE.md"
echo ""
echo "🛑 To stop the servers, run: ./stop-servers.sh"