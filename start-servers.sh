#!/bin/bash

# Define our ports
FRONTEND_PORT=3002
BACKEND_PORT=3001

# Function to kill processes on a port
kill_port() {
    local port=$1
    echo "Checking for processes on port $port..."
    if lsof -ti:$port > /dev/null; then
        echo "Killing processes on port $port"
        lsof -ti:$port | xargs kill -9
    else
        echo "No processes found on port $port"
    fi
}

# Kill any existing processes on our ports
echo "Cleaning up existing processes..."
kill_port $FRONTEND_PORT
kill_port $BACKEND_PORT

# Start backend server
echo "Starting backend server on port $BACKEND_PORT..."
cd backend
npm run dev &
BACKEND_PID=$!

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 5

# Start frontend server
echo "Starting frontend server on port $FRONTEND_PORT..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

# Function to handle script termination
cleanup() {
    echo "Shutting down servers..."
    kill $BACKEND_PID
    kill $FRONTEND_PID
    exit 0
}

# Set up trap to catch termination signal
trap cleanup SIGINT SIGTERM

# Keep script running
echo "Servers are running!"
echo "Frontend: http://localhost:$FRONTEND_PORT"
echo "Backend: http://localhost:$BACKEND_PORT"
echo "Press Ctrl+C to stop all servers"
wait 