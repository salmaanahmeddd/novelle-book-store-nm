const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../db/customers'); 
const { verifyToken } = require('../middleware/verifyToken');
const { authorizeRole } = require('../middleware/authorizeRole');

const router = express.Router();

// Check authentication status for users
// Check authentication status
router.get('/check-auth', (req, res) => {
  try {
    // Check for the token in Authorization header (preferred) or cookies (fallback)
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1] || req.cookies.authToken;

    console.log('Token received:', token); // Debugging: Ensure token is received

    if (!token) {
      return res.status(401).json({ authenticated: false, error: 'Token not provided' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log('Decoded token info:', decoded); // Debugging: Log decoded token details

    // Check if the token belongs to an admin
    if (!decoded.adminId) {
      return res.status(403).json({ authenticated: false, error: 'Invalid token for admin' });
    }

    res.status(200).json({ authenticated: true });
  } catch (error) {
    console.error('Error verifying token:', error.message);
    res.status(401).json({ authenticated: false, error: 'Invalid or expired token' });
  }
});



router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });

  } catch (error) {
    res.status(500).json({ error: 'Error registering user', details: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'No user found with this email' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: 'user' }, // Include role in the token payload
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.status(200).json({ message: 'Login successful', token, userId: user._id, role:'user'});
  } catch (error) {
    res.status(500).json({ error: 'Error logging in', details: error.message });
  }
});

router.get('/all', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users', details: error.message });
  }
});



router.get('/profile', async (req, res) => {
    const { email } = req.query;
  
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
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

router.get('/user/dashboard', verifyToken, authorizeRole('user'), (req, res) => {
  res.status(200).json({ message: 'Welcome to User Dashboard' });
});


module.exports = router;
