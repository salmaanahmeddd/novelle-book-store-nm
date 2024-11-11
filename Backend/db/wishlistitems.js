const mongoose = require('mongoose');

const wishlistItemSchema = new mongoose.Schema({
    itemId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Book' // Referencing Book model for wishlist items
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' // Referencing User model
    },
    userName: String,
    itemImage: String,
    title: String,
});

module.exports = mongoose.model('WishlistItem', wishlistItemSchema);
