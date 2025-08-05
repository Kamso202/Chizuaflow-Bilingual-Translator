#!/bin/bash

# UNIZIK Blockchain Voting System - Stop Servers Script

echo "🛑 Stopping UNIZIK Voting System servers..."
echo ""

# Stop backend server
if [ -f "backend.pid" ]; then
    BACKEND_PID=$(cat backend.pid)
    if kill -0 $BACKEND_PID 2>/dev/null; then
        kill $BACKEND_PID
        echo "✅ Backend server stopped (PID: $BACKEND_PID)"
    else
        echo "⚠️  Backend server was not running"
    fi
    rm -f backend.pid
else
    echo "⚠️  No backend PID file found"
fi

# Stop frontend server
if [ -f "frontend.pid" ]; then
    FRONTEND_PID=$(cat frontend.pid)
    if kill -0 $FRONTEND_PID 2>/dev/null; then
        kill $FRONTEND_PID
        echo "✅ Frontend server stopped (PID: $FRONTEND_PID)"
    else
        echo "⚠️  Frontend server was not running"
    fi
    rm -f frontend.pid
else
    echo "⚠️  No frontend PID file found"
fi

echo ""
echo "🎉 All servers stopped successfully!"
echo ""
echo "💡 To restart the system, run: ./quick-start.sh"