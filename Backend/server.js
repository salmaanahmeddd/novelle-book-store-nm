// Backend/server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const adminRoutes = require('./routes/adminRoutes');  // Path to admin routes
const bookRoutes = require('./routes/bookRoutes');    // Path to book routes
const orderRoutes = require('./routes/orderRoutes');  // Path to order routes
const userRoutes = require('./routes/userRoutes');    // Path to user routes
const sellerRoutes = require('./routes/sellerRoutes');  // Path to seller routes
const wishlistRoutes = require('./routes/wishlistRoutes');  // Path to wishlist routes

dotenv.config(); // Load environment variables

const app = express();
app.use(cors());

app.use(express.json()); // Parse JSON body
app.use('/uploads', express.static('uploads'));  // Serve static files from uploads

// Use the routes
app.use('/admin', adminRoutes);   // Mount the admin routes at '/admin'
app.use('/books', bookRoutes);    // Mount the book routes at '/books'
app.use('/orders', orderRoutes);  // Mount the order routes at '/orders'
app.use('/users', userRoutes);    // Mount the user routes at '/users'
app.use('/sellers', sellerRoutes);    // Mount the seller routes at '/sellers'
app.use('/wishlist', wishlistRoutes);    // Mount the wishlist routes at '/wishlist'

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Basic route
app.get('/', (req, res) => {
  res.send('Welcome to the Book Store NM API');
});
