const mongoose = require('mongoose');

const myOrderSchema = new mongoose.Schema({
    flatno: String,
    pincode: String,
    city: String,
    state: String,
    totalAmount: String,
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller' // Referencing Seller model
    },
    sellerId: String, 
    bookTitle: String,
    bookAuthor: String,
    bookGenre: String,
    itemImage: String,  
    description: String,
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
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
            currentDate.setDate(currentDate.getDate() + 7);  // Delivery 7 days after order date
            return currentDate;
        }
    }
});

module.exports = mongoose.model('MyOrders', myOrderSchema);
