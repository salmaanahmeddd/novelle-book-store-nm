// server.js
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const adminRoutes = require('./routes/adminRoutes');
const bookRoutes = require('./routes/bookRoutes');
const orderRoutes = require('./routes/orderRoutes'); 
const userRoutes = require('./routes/customerRoutes');
const sellerRoutes = require('./routes/sellerRoutes');  
const wishlistRoutes = require('./routes/wishlistRoutes'); 

dotenv.config();

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://novelle.onrender.com',
];

// CORS options
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Check if the origin is in the allowed list
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  credentials: true, // Allow cookies to be sent
};

// Use CORS middleware
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

// Route for static files (remove if no longer needed for uploads)
app.use('/uploads', express.static('uploads'));

// Define routes
app.use('/admin', adminRoutes);
app.use('/books', bookRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);
app.use('/sellers', sellerRoutes);
app.use('/wishlist', wishlistRoutes);

// MongoDB connection with updated options
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Welcome route
app.get('/', (req, res) => {
  res.send('Welcome to the Book Store NM API');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
