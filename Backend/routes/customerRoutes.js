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
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password and save the new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    // Generate a token
    const token = jwt.sign(
      { userId: newUser._id, role: 'user' }, // Payload
      process.env.JWT_SECRET,               // Secret key
      { expiresIn: '1h' }                   // Token expiration
    );

    // Return success message along with the token
    res.status(201).json({
      message: 'Signup successful',
      token, // Include the token in the response
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Internal server error' });
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


router.put('/:id', verifyToken, authorizeRole('admin'), async (req, res) => {
  const { id } = req.params;
  const { name, email, currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update name and email
    if (name) user.name = name;
    if (email) user.email = email;

    // Handle password change if applicable
    if (currentPassword && newPassword) {
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    // Save updated user
    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user. Please try again.' });
  }
});

// Delete User
router.delete('/:id', verifyToken, authorizeRole('admin'), async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user. Please try again.' });
  }
});

module.exports = router;
