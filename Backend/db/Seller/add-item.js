// Backend/db/seller/add-item.js
const mongoose = require('mongoose');

// Define the schema for the items (books) added by sellers
const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    genre: {
        type: String,
        required: true,
    },
    itemImage: {
        type: String,
        required: false, // Image is optional initially
    },
    description: {
        type: String,
        required: false, // Description is optional
    },
    price: {
        type: String,
        required: true,  // Price is a required field
    },
    sellerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Seller' // Reference to the Seller model
    },
    sellerName: {
        type: String,
        required: true,  // Seller's name (who is adding the book)
    },
    dateAdded: {
        type: Date,
        default: Date.now  // Timestamp for when the item was added
    }
});

// Export the model for use in other parts of the application
module.exports = mongoose.model('Book', bookSchema);
