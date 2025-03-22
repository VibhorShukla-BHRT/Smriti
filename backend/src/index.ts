import express from 'express'
import cors from 'cors'
import router from './routes/user.js';
import dotenv from 'dotenv';
import { connectDB } from './utils/db';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/v1', router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});