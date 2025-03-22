"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server.ts
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
// Serve a simple landing page
app.get('/', (req, res) => {
    res.send("Socket.IO backend is running.");
});
// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    // Listen for location updates from the client
    socket.on('location-update', (data) => {
        console.log('Received location update:', data);
        // Broadcast the update to all other clients
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
