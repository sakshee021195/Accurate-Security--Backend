require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('../routes/auth');
const formRoutes = require('../routes/form');

const app = express();

// CORS
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://accurate-security.vercel.app'
  ],
  credentials: true
}));

// JSON middleware
app.use(express.json());

// MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/form', formRoutes);

// Health check
app.get('/', (req, res) => res.json({ status: 'Backend API is live!' }));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
