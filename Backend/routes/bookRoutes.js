
const express = require('express');
const Book = require('../db/book'); 
const multer = require('multer'); 
const { verifySellerToken } = require('../middleware/verifySellerToken'); 
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });


router.post('/add', verifySellerToken, upload.single('itemImage'), async (req, res) => {
    const { title, author, genre, description, price } = req.body;
    const itemImage = req.file ? req.file.path : null;
    const sellerId = req.sellerId;

    try {
        const newBook = new Book({
            title,
            author,
            genre,
            itemImage,
            description,
            price,
            sellerId,
            sellerName: req.sellerName
        });

        await newBook.save();
        res.status(201).json(newBook);
    } catch (err) {
        res.status(400).json({ error: 'Failed to add book', details: err.message });
    }
});


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


router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ error: 'Book not found' });
        res.status(200).json(book);
    } catch (err) {
        res.status(400).json({ error: 'Failed to fetch book', details: err.message });
    }
});


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
