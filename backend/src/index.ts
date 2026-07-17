import express from 'express';
import * as dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import orderRoutes from './routes/orders.js'; // 👈 1. Import your orders router
import cors from 'cors';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true 
}));
app.use(express.json());

// Main application API routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/orders', orderRoutes); // 👈 2. Mount the checkout routes here!

// Root health check endpoint
app.get('/', (req, res) => {
  res.send('TSbookstore Backend Server is Operational.');
});

// Start listening for connections
app.listen(PORT, () => {
  console.log(`Server successfully started on http://localhost:${PORT}`);
});