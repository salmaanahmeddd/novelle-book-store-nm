const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Seller = require('../db/Seller/seller');
const { verifyToken } = require('../middleware/verifyToken');
const { authorizeRole } = require('../middleware/authorizeRole');

const router = express.Router();

// Check authentication status for sellers
router.get('/check-auth', (req, res) => {
  const headerToken = req.headers["access-token"];
  const token = req.cookies.authToken || headerToken;
  console.log('Token received for seller:', token); // Debugging: Check token
  
  if (!token) {
    return res.status(401).json({ authenticated: false });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'seller') {
      return res.status(403).json({ authenticated: false, error: 'Access denied. Seller role required.' });
    }
    console.log('Token valid for seller:', decoded); // Debugging: Token details
    res.status(200).json({ authenticated: true });
  } catch (error) {
    console.error('Seller token verification error:', error);
    res.status(401).json({ authenticated: false });
  }
});


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
    // Regular expression for validating email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Fetch seller from the database using email
    const seller = await Seller.findOne({ email });
    if (!seller) {
      return res.status(404).json({ error: 'No seller found with this email' });
    }

    // Verify the password
    const isPasswordCorrect = await bcrypt.compare(password, seller.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Sign a JWT token with seller-specific payload details
    const token = jwt.sign(
      { sellerId: seller._id, role: 'seller' }, // Include sellerId and role in the token payload
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Set the token as an HTTP-only cookie
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    // Respond with success message and details
    res.status(200).json({ message: 'Login successful', token, sellerId: seller._id, role:'seller'});
  } catch (error) {
    // Handle server errors
    res.status(500).json({ error: 'Error logging in', details: error.message });
  }
});

router.get('/seller/dashboard', verifyToken, authorizeRole('seller'), (req, res) => {
  res.status(200).json({ message: 'Welcome to Seller Dashboard' });
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

router.post('/logout', (req, res) => {
  res.clearCookie('authToken', {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    // sameSite: 'strict' // Make sure it matches the settings from when the cookie was set
  });
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
