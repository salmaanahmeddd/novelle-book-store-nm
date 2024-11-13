const express = require('express');
const Book = require('../db/book');
const multer = require('multer');
const { cloudinary } = require('../cloudinaryConfig'); // Import Cloudinary configuration
const { verifySellerToken } = require('../middleware/verifySellerToken');
const router = express.Router();

// Use memory storage for multer to store the image buffer in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route to add a new book with Cloudinary image upload
router.post('/add', verifySellerToken, upload.single('itemImage'), async (req, res) => {
    const { title, author, genre, description, price } = req.body;
    const sellerId = req.sellerId;

    try {
        let itemImage = null;

        // If a file is uploaded, upload it to Cloudinary
        if (req.file) {
            // Promise to handle the upload asynchronously
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { resource_type: 'image', folder: 'books' }, // Uploading to 'books' folder
                    (error, result) => {
                        if (error) reject(error); // Handle error
                        else resolve(result); // Return Cloudinary result
                    }
                );
                uploadStream.end(req.file.buffer); // Send file buffer to Cloudinary
            });

            itemImage = result.secure_url; // Get the image URL from Cloudinary
        }

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
        res.status(201).json(newBook); // Respond with the created book
    } catch (err) {
        console.error(err); // Log error for debugging
        res.status(400).json({ error: 'Failed to add book', details: err.message });
    }
});

// Route to get all books or filter by genre/author
router.get('/', async (req, res) => {
    const { genre, author } = req.query;
    const filter = {};
    if (genre) filter.genre = genre;
    if (author) filter.author = author;

    try {
        const books = await Book.find(filter);
        res.status(200).json(books); // Return all books or filtered ones
    } catch (err) {
        res.status(400).json({ error: 'Failed to fetch books', details: err.message });
    }
});

// Route to get a specific book by ID
router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ error: 'Book not found' });
        res.status(200).json(book); // Return the requested book
    } catch (err) {
        res.status(400).json({ error: 'Failed to fetch book', details: err.message });
    }
});

// Route to update a book with new details and optional Cloudinary image upload
router.put('/update/:id', verifySellerToken, upload.single('itemImage'), async (req, res) => {
    const { title, author, genre, description, price } = req.body;
    const updateData = { title, author, genre, description, price };

    try {
        // If a new image is provided, upload it to Cloudinary
        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { resource_type: 'image', folder: 'books' },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                uploadStream.end(req.file.buffer); // Upload image buffer to Cloudinary
            });
            updateData.itemImage = result.secure_url; // Set the new Cloudinary URL
        }

        const updatedBook = await Book.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!updatedBook) return res.status(404).json({ error: 'Book not found' });
        res.status(200).json(updatedBook); // Return the updated book
    } catch (err) {
        res.status(400).json({ error: 'Failed to update book', details: err.message });
    }
});

// Route to delete a book by ID
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
