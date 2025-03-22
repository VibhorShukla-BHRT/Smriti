import express from 'express';
import cors from 'cors';
import router from './routes/user';
import dotenv from 'dotenv';
import { connectDB } from './utils/db';
import locrouter from './routes/locroute';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
app.use(cookieParser());
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // For development only. In production, set the allowed origins.
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Change to your frontend URL
    credentials: true,  // ✅ Allow cookies to be sent
  })
);
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/v1', router);
app.use('/api/v1', locrouter);

// Serve a simple landing page
app.get('/', (req, res) => {
  res.send("Socket.IO backend is running.");
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected!');

  // Listen for location updates from the patient client
  socket.on('location-update', (data) => {
    // console.log('Received location update:', data);
    socket.broadcast.emit('location-update', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected!');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
