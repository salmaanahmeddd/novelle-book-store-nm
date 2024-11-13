const mongoose = require('mongoose');

// Define MyOrders schema
const myOrderSchema = new mongoose.Schema({
    address: { 
        type: String, 
        required: true 
    },
    state: String,
    city: String,
    pincode: String,
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller' // Reference to Seller
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller' // Reference to Seller
    },
    bookId: {  // Reference to Book model
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
    },
    userName: String,
    bookingDate: {
        type: Date,
        default: Date.now
    },
    deliveryDate: {
        type: Date,
        default: () => {
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + 7);
            return currentDate;
        }
    }
});

// Virtual for total amount (book price)
myOrderSchema.virtual('totalAmount').get(async function() {
    const book = await mongoose.model('Book').findById(this.bookId);
    return book ? book.price : 0;
});

// Virtual for book details
myOrderSchema.virtual('bookDetails', {
    ref: 'Book', // Model to populate
    localField: 'bookId', // Field from the MyOrders schema
    foreignField: '_id', // Field from the Book model
    justOne: true // Return a single document
});

// Virtual for seller details
myOrderSchema.virtual('sellerDetails', {
    ref: 'Seller', // Model to populate
    localField: 'sellerId', // Field from the MyOrders schema
    foreignField: '_id', // Field from the Seller model
    justOne: true // Return a single document
});

// Virtual for user details
myOrderSchema.virtual('userDetails', {
    ref: 'User', // Model to populate
    localField: 'userId', // Field from the MyOrders schema
    foreignField: '_id', // Field from the User model
    justOne: true // Return a single document
});

// Apply virtuals to JSON and object outputs
myOrderSchema.set('toObject', { virtuals: true });
myOrderSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('MyOrders', myOrderSchema);
