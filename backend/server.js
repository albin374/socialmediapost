const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Connect to MongoDB with error handling
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/socialmedia');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.log('To fix this authentication issue:');
    console.log('1. Check that your MongoDB Atlas username and password are correct');
    console.log('2. Ensure your IP address is whitelisted in MongoDB Atlas');
    console.log('3. Verify that your MongoDB Atlas cluster is active');
    console.log('4. Make sure you have created a database user with proper permissions');
    console.log('');
    console.log('Steps to resolve:');
    console.log('1. Go to MongoDB Atlas (https://cloud.mongodb.com)');
    console.log('2. Log in to your account');
    console.log('3. Select your cluster');
    console.log('4. Go to "Database Access" in the left sidebar');
    console.log('5. Check if your user "myUser" exists and has correct password');
    console.log('6. If needed, create a new database user');
    console.log('7. Go to "Network Access" in the left sidebar');
    console.log('8. Ensure your IP address is whitelisted (or add 0.0.0.0/0 for temporary testing)');
    console.log('');
    console.log('Then update the MONGODB_URI in your .env file with correct credentials');
    console.log('Format: mongodb+srv://username:password@cluster0.p4zyx0x.mongodb.net/socialmedia?retryWrites=true&w=majority');
    console.log('');
    console.log('Alternatively, for local development:');
    console.log('- Install MongoDB locally');
    console.log('- Ensure it\'s running on port 27017');
    console.log('- Uncomment the local MongoDB option in your .env file');
    // Exit process with failure
    process.exit(1);
  }
};

connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// For production, serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Frontend should be accessible at http://localhost:3000`);
  console.log(`API endpoints available at http://localhost:${PORT}/api`);
});