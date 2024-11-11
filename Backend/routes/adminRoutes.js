const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../db/Admin'); // Ensure correct model path

// POST route for admin signup
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    // Check if the admin already exists
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newAdmin = new Admin({ name, email, password: hashedPassword });
    await newAdmin.save();
    
    // Send a response with the new admin data
    res.status(201).json(newAdmin); 
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST route for admin login with JWT token
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
      // Find admin by email
      const admin = await Admin.findOne({ email });
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }
      
      // Compare password
      const isPasswordCorrect = await bcrypt.compare(password, admin.password);
      if (!isPasswordCorrect) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      
      // Generate JWT token
      const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      // Send response with token
      res.status(200).json({ token, adminId: admin._id, message: 'Login successful' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  


// Route to get all admins (for testing purposes)
router.get('/admins', async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get a specific admin profile by email
router.get('/profile', async (req, res) => {
    const { email } = req.query; // Assuming email is passed as a query parameter
  
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
  


module.exports = router;
