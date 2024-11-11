// Backend/routes/wishlistRoutes.js
const express = require('express');
const WishlistItem = require('../db/wishlistitems');  // Import the WishlistItem model
const router = express.Router();

// POST: Add item to wishlist
router.post('/add', async (req, res) => {
  const { itemId, userId, userName, itemImage, title } = req.body;

  try {
    const newWishlistItem = new WishlistItem({
      itemId,
      userId,
      userName,
      itemImage,
      title
    });

    await newWishlistItem.save();
    res.status(201).json(newWishlistItem);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add item to wishlist', details: err.message });
  }
});

// GET: Get all wishlist items for a user
router.get('/:userId', async (req, res) => {
  try {
    const wishlistItems = await WishlistItem.find({ userId: req.params.userId }).populate('itemId', 'title author genre price'); // Populating book details
    if (!wishlistItems.length) {
      return res.status(404).json({ message: 'No wishlist items found' });
    }
    res.status(200).json(wishlistItems);
  } catch (err) {
    res.status(400).json({ error: 'Failed to fetch wishlist items', details: err.message });
  }
});

// DELETE: Remove an item from the wishlist
router.delete('/remove/:id', async (req, res) => {
  try {
    const removedItem = await WishlistItem.findByIdAndDelete(req.params.id);
    if (!removedItem) {
      return res.status(404).json({ error: 'Wishlist item not found' });
    }
    res.status(200).json({ message: 'Item removed from wishlist successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to remove item from wishlist', details: err.message });
  }
});

module.exports = router;
