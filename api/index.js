require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import routes
const authRoutes = require('../routes/auth');
const formRoutes = require('../routes/form');

// Initialize Express app
const app = express();

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://accurate-security.vercel.app',
    'https://accurate-backend-production.up.railway.app'
  ],
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

app.options('*', cors());
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://saksheejambucha:Hariom123@cluster0.cga5z.mongodb.net/AccuteSecurity?retryWrites=true&w=majority' || 'mongodb://localhost:27017/user-form-app')
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/form', formRoutes);

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({ status: 'Backend API is live!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});