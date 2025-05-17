#!/bin/bash

# Start MongoDB (adjust this based on your MongoDB installation)
# For local MongoDB installation
echo "Starting MongoDB service..."
# Uncomment the appropriate line for your system:
# sudo systemctl start mongod  # For Linux with systemd
# brew services start mongodb-community  # For macOS with Homebrew

# Start the backend server
echo "Starting Express.js server..."
npm run dev:server &
SERVER_PID=$!

# Wait for the server to start
echo "Waiting for server to start..."
sleep 5

# Start Next.js frontend
echo "Starting Next.js frontend with internationalization support..."
npm run dev &
FRONTEND_PID=$!

echo "----------------------------------------"
echo "🚀 Hamba Village Union app is running!"
echo "----------------------------------------"
echo "📱 Frontend: http://localhost:3000"
echo "⚙️ Backend API: http://localhost:5000/api"
echo "🌐 Available languages: English (en), Bengali (bn)"
echo "----------------------------------------"
echo "Press Ctrl+C to stop all services"

# Wait for user to press Ctrl+C
wait $FRONTEND_PID
# If we get here, the user has stopped the frontend
kill $SERVER_PID

echo "All services stopped." 