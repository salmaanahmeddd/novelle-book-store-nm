const express = require('express');
const router = express.Router();
const MyOrders = require('../db/myorders'); // Adjust path to MyOrders model if needed

// Place a new order
router.post('/place', async (req, res) => {
    const {
        flatno, pincode, city, state, totalAmount, seller, sellerId, bookTitle, bookAuthor,
        bookGenre, itemImage, description, userId, userName
    } = req.body;

    try {
        const newOrder = new MyOrders({
            flatno,
            pincode,
            city,
            state,
            totalAmount,
            seller,
            sellerId,
            bookTitle,
            bookAuthor,
            bookGenre,
            itemImage,
            description,
            userId,
            userName
        });

        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(400).json({ error: 'Failed to place order', details: error.message });
    }
});

// Get all orders
router.get('/', async (req, res) => {
    try {
        const orders = await MyOrders.find().populate('seller').populate('userId');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve orders', details: error.message });
    }
});

// Get a specific order by ID
router.get('/:id', async (req, res) => {
    try {
        const order = await MyOrders.findById(req.params.id).populate('seller').populate('userId');
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve order', details: error.message });
    }
});

// Delete an order by ID
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
