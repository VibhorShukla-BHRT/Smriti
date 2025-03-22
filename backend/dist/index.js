"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_js_1 = __importDefault(require("./routes/user.js"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const db_1 = require("./utils/db");
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, express_session_1.default)({
    secret: "S&CR&T",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 30,
        // sameSite: 'none'  // Important for cross-origin cookies
    },
}));
app.use((0, cookie_parser_1.default)());
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    path: '/socket.io/',
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
// Optional: Serve a simple landing page
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
// Connect to MongoDB
(0, db_1.connectDB)();
// Routes
app.use('/api/v1', user_js_1.default);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
