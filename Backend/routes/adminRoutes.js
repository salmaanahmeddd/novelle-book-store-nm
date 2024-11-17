const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../db/Admin');
const { verifyToken } = require('../middleware/verifyToken');
const { authorizeRole } = require('../middleware/authorizeRole');

// Check authentication status
router.get('/check-auth', (req, res) => {
  const headerToken = req.headers["access-token"];
  const token = req.cookies.authToken || headerToken;
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
    const adminOBJ = await newAdmin.save();
    
    res.status(201).json({...adminOBJ.toJSON(), token}); 
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
      secure: true, // Set secure to true if in production
      // sameSite: 'Strick', // Helps prevent CSRF
      maxAge:  24 * 60 * 60 * 1000  // 1 hour
    });
  
    res.status(200).json({ message: 'Login successful', token, adminId: admin._id, role:'admin' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/admin/dashboard', verifyToken, authorizeRole('admin'), (req, res) => {
  res.status(200).json({ message: 'Welcome to Admin Dashboard' });
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
  res.clearCookie('authToken', {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    // sameSite: 'strict' // Make sure it matches the settings from when the cookie was set
  });
  res.json({ message: 'Logged out successfully' });
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { bookId, userId, address, state, city, pincode } = req.body;

  try {
      // Find the existing order by ID
      const order = await MyOrders.findById(id);

      if (!order) {
          return res.status(404).json({ error: 'Order not found' });
      }

      // Update the order fields
      if (bookId) {
          const book = await Book.findById(bookId);
          if (!book) {
              return res.status(404).json({ error: 'Book not found' });
          }
          order.bookId = bookId;

          // Update seller details from the new book
          const seller = await Seller.findById(book.sellerId);
          if (!seller) {
              return res.status(404).json({ error: 'Seller not found' });
          }
          order.seller = seller._id;
          order.sellerId = seller._id;
      }

      if (userId) {
          const user = await User.findById(userId);
          if (!user) {
              return res.status(404).json({ error: 'User not found' });
          }
          order.userId = userId;
      }

      if (address) order.address = address;
      if (state) order.state = state;
      if (city) order.city = city;
      if (pincode) order.pincode = pincode;

      // Save the updated order
      const updatedOrder = await order.save();

      res.status(200).json({ message: 'Order updated successfully', order: updatedOrder });
  } catch (error) {
      console.error('Error updating order:', error);
      res.status(500).json({ error: 'Failed to update order', details: error.message });
  }
});

module.exports = router;
