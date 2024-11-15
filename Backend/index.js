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

// Correctly configure CORS to allow credentials and set specific origin
const corsOptions = {
    origin: 'http://localhost:5173', // Or wherever the front end is being served for development
    credentials: true, // To allow cookies to be sent and received
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

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
