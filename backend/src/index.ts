import express from 'express'
import cors from 'cors'
import router from './routes/user.js';
import dotenv from 'dotenv';
import session from 'express-session'
import cookieParser from 'cookie-parser'
import { connectDB } from './utils/db';
import http from 'http'
import { Server, Socket } from 'socket.io';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

app.use(session({
  secret: "S&CR&T",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // For HTTPS
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 30,
    // sameSite: 'none'  // Important for cross-origin cookies
  },
}))

app.use(cookieParser())

declare module 'express-session' {
  interface SessionData {
    isLoggedIn: boolean
  }
}

const server = http.createServer(app);
const io = new Server(server, {
  path: '/socket.io/',
  cors: {
    origin: "*", // For development only. In production, set specific allowed origins
    methods: ["GET", "POST"]
  }
});


// Optional: Serve a simple landing page
app.get('/', (req, res) => {
  res.send("Socket.IO backend is running.");
});

// Socket.IO connection handling
io.on('connection', (socket: Socket) => {
  console.log('New client connected:', socket.id);
  
  // Listen for location updates from the client
  socket.on('location-update', (data: LocationData) => {
    console.log('Received location update:', data);
    // Broadcast the update to all other clients
    socket.broadcast.emit('location-update', data);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/v1', router);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});