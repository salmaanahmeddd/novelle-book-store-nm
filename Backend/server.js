// Backend/server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const adminRoutes = require('./routes/adminRoutes');
const bookRoutes = require('./routes/bookRoutes');
const orderRoutes = require('./routes/orderRoutes'); 
const userRoutes = require('./routes/userRoutes');
const sellerRoutes = require('./routes/sellerRoutes');  
const wishlistRoutes = require('./routes/wishlistRoutes'); 

dotenv.config();

const app = express();
app.use(cors());

app.use(express.json());
app.use('/uploads', express.static('uploads'));


app.use('/admin', adminRoutes);
app.use('/books', bookRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);
app.use('/sellers', sellerRoutes);
app.use('/wishlist', wishlistRoutes);

mongoose.connect(process.env.MONGO_URI, {})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


app.get('/', (req, res) => {
  res.send('Welcome to the Book Store NM API');
});
