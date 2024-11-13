const express = require('express');
const router = express.Router();
const MyOrders = require('../db/myorders'); 
const Book = require('../db/book');
const Seller = require('../db/Seller/seller');
const User = require('../db/user');

// Route to place an order
router.post('/place', async (req, res) => {
    const { bookId, userId, address, state, city, pincode } = req.body;

    try {
        // Fetch the book details using the bookId
        const book = await Book.findById(bookId);
        console.log('Fetched book:', book);  // <-- Log book data to verify

        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        // Get the seller based on the bookId (book has a sellerId)
        const seller = await Seller.findById(book.sellerId);  // Ensure you're fetching the seller via book's sellerId
        console.log('Fetched seller:', seller);  // <-- Log seller data to verify

        if (!seller) {
            return res.status(404).json({ error: 'Seller not found' });
        }

        // Set the totalAmount to the book's price
        const totalAmount = book.price;

        // Create a new order with the book's price as the totalAmount
        const newOrder = new MyOrders({
            bookId,
            userId,
            address, // Now using address as a single field
            state,
            city,
            pincode,
            seller: seller._id,
            sellerId: seller._id,  // Assuming sellerId is the same as seller's ObjectId
            totalAmount
        });

        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder); // Return the saved order
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(400).json({ error: 'Failed to place order', details: error.message });
    }
});

// Route to get all orders
router.get('/', async (req, res) => {
    try {
        const orders = await MyOrders.find()
            .populate('bookDetails')  // Populate book details (price, title, author, etc.)
            .populate('sellerDetails')  // Populate seller details
            .populate('userDetails');  // Populate user details (name, etc.)
        
        res.status(200).json(orders);  // Return all the populated order data
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve orders', details: error.message });
    }
});

// Route to get a specific order by ID
router.get('/:id', async (req, res) => {
    try {
        const order = await MyOrders.findById(req.params.id)
            .populate('bookDetails')  // Populate book details
            .populate('sellerDetails')  // Populate seller details
            .populate('userDetails');  // Populate user details
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        res.status(200).json(order);  // Return the specific order with populated data
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve order', details: error.message });
    }
});

// Route to delete an order by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedOrder = await MyOrders.findByIdAndDelete(req.params.id);
        if (!deletedOrder) return res.status(404).json({ message: 'Order not found' });
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete order', details: error.message });
    }
});

module.exports = router;
