const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../db/Admin');


// router.get('/check-auth', async (req, res) => {
//   const token = req.cookies.authToken;
//   console.log('Token received:', token); 
//   res.status(200).json({message:"working"});
// });

// Check authentication status
router.get('/check-auth', (req, res) => {
  const token = req.cookies.authToken || req.cookies["vercel-feature-flags"];
  console.log('Token received:', token);  // Check the token is received correctly
  if (!token) {
    return res.status(401).json({ authenticated: false });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token valid, decoded info:', decoded);  // Log decoded token info
    res.status(200).json({ authenticated: true });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ authenticated: false });
  }
});


router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newAdmin = new Admin({ name, email, password: hashedPassword });
    await newAdmin.save();
    
    res.status(201).json(newAdmin); 
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
    
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
      
    const isPasswordCorrect = await bcrypt.compare(password, admin.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
      
    const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Set cookie with HttpOnly flag
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set secure to true if in production
      sameSite: 'Strick', // Helps prevent CSRF
      maxAge:  24 * 60 * 60 * 1000  // 1 hour
    });
  
    res.status(200).json({ adminId: admin._id, message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/admins', async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/profile', async (req, res) => {
  const { email } = req.query;
  
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }
  
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('authToken');
  res.json({ message: 'Logged out successfully' });
});


module.exports = router;
