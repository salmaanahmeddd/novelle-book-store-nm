const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Seller = require('../db/Seller/seller');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
      return res.status(400).json({ error: 'Seller already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newSeller = new Seller({
      name,
      email,
      password: hashedPassword,
    });

    await newSeller.save();
    res.status(201).json({ message: 'Seller registered successfully' });

  } catch (error) {
    res.status(500).json({ error: 'Error registering seller', details: error.message });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const seller = await Seller.findOne({ email });
    if (!seller) {
      return res.status(400).json({ error: 'No seller found with this email' });
    }

    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect password' });
    }

    const token = jwt.sign({ sellerId: seller._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, sellerId: seller._id });

  } catch (error) {
    res.status(500).json({ error: 'Error logging in', details: error.message });
  }
});


router.get('/all', async (req, res) => {
  try {
    const sellers = await Seller.find();
    res.status(200).json(sellers);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching sellers', details: error.message });
  }
});


router.get('/profile', async (req, res) => {
    const { email } = req.query;
  
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
  
    try {
      const seller = await seller.findOne({ email });
      if (!seller) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(seller);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

module.exports = router;
