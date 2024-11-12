const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../db/Admin');

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
  
    res.status(200).json({ token, adminId: admin._id, message: 'Login successful' });
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

module.exports = router;
