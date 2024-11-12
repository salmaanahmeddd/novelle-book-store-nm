const mongoose = require('mongoose');

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
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    price: {
        type: String,
        required: true,
    },
    sellerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Seller'
    },
    sellerName: {
        type: String,
        required: true,
    },
    dateAdded: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Book', bookSchema);
