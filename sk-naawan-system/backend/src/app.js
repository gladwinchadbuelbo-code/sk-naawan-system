const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Static Folder for Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/proposals', require('./routes/proposal.routes'));
app.use('/api/attendance', require('./routes/attendance.routes'));
app.use('/api/transactions', require('./routes/transaction.routes'));
app.use('/api/announcements', require('./routes/announcement.routes'));
// Supabase Test Route
const supabase = require('./config/supabaseClient');
app.post('/api/saveUser', async (req, res) => {
  try {
    const { name, email } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const { data, error } = await supabase
      .from('users')
      .insert([{ name, email }])
      .select();

    if (error) {
      console.error("Supabase Insert Error:", error);
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ message: 'User saved successfully!', data });
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Base Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to SK Naawan Integrated Management System API' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

module.exports = app;
