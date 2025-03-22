// server.js
import express from 'express'
import http from 'http'
const socketIo = require('socket.io');

// Create the Express app and HTTP server
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // For development only. In production, set the allowed origins.
    methods: ["GET", "POST"]
  }
});

// Optional: Serve a simple landing page
app.get('/', (req, res) => {
  res.send("Socket.IO backend is running.");
});

// Socket.IO connection handling
io.on('connection', (socket: any) => {
  console.log('New client connected:', socket.id);

  // Listen for location updates from the patient client
  socket.on('location-update', (data: any) => {
    console.log('Received location update:', data);
    console.log('Received location update:', data);
    // Broadcast the update to all other clients (for the parent app)
    socket.broadcast.emit('location-update', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});