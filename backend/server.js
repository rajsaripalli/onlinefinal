require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initializeTables } = require('./config/dynamodb');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/auth');
const flightRoutes = require('./routes/flights');
const bookingRoutes = require('./routes/bookings');

app.use('/api/auth', authRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/bookings', bookingRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'youGO API is running' });
});

// Initialize DynamoDB tables
initializeTables().catch(console.error);

const PORT = process.env.PORT || 3000;

app.listen(PORT,'0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});

