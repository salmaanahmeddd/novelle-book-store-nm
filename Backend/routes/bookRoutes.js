// Backend/routes/bookRoutes.js
const express = require('express');
const Book = require('../db/book');  // Import the Book model
const multer = require('multer');  // For handling file uploads
const { verifySellerToken } = require('../middleware/verifySellerToken'); // Middleware for JWT verification
const router = express.Router();

// Set up storage for itemImage uploads using multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // Ensure this folder exists
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// POST: Add a new book (only for authenticated sellers)
router.post('/add', verifySellerToken, upload.single('itemImage'), async (req, res) => {
    const { title, author, genre, description, price } = req.body;
    const itemImage = req.file ? req.file.path : null;
    const sellerId = req.sellerId; // This will be added to the req object from JWT middleware

    try {
        const newBook = new Book({
            title,
            author,
            genre,
            itemImage,
            description,
            price,
            sellerId,
            sellerName: req.sellerName // Ensure seller name is passed from the JWT middleware
        });

        await newBook.save();
        res.status(201).json(newBook);
    } catch (err) {
        res.status(400).json({ error: 'Failed to add book', details: err.message });
    }
});

// GET: Retrieve all books with optional filters (genre, author)
router.get('/', async (req, res) => {
    const { genre, author } = req.query;
    const filter = {};
    if (genre) filter.genre = genre;
    if (author) filter.author = author;

    try {
        const books = await Book.find(filter);
        res.status(200).json(books);
    } catch (err) {
        res.status(400).json({ error: 'Failed to fetch books', details: err.message });
    }
});

// GET: Retrieve a specific book by ID
router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ error: 'Book not found' });
        res.status(200).json(book);
    } catch (err) {
        res.status(400).json({ error: 'Failed to fetch book', details: err.message });
    }
});

// PUT: Update a book by ID (only for authenticated sellers)
router.put('/update/:id', verifySellerToken, upload.single('itemImage'), async (req, res) => {
    const { title, author, genre, description, price } = req.body;
    const updateData = { title, author, genre, description, price };

    if (req.file) {
        updateData.itemImage = req.file.path;
    }

    try {
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!updatedBook) return res.status(404).json({ error: 'Book not found' });
        res.status(200).json(updatedBook);
    } catch (err) {
        res.status(400).json({ error: 'Failed to update book', details: err.message });
    }
});

// DELETE: Delete a book by ID (only for authenticated sellers)
router.delete('/delete/:id', verifySellerToken, async (req, res) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        if (!deletedBook) return res.status(404).json({ error: 'Book not found' });
        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: 'Failed to delete book', details: err.message });
    }
});

module.exports = router;
