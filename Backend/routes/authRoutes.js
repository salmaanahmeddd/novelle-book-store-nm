const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../db/Admin');
const User = require('../db/customers');
const Seller = require('../db/Seller/seller');
const verifyRole = require('../middleware/verifyRole');

const router = express.Router();

// Admin check-auth route
router.get('/admin/check-auth', verifyRole(Admin), (req, res) => {
  res.status(200).json({ authenticated: true, role: 'admin', user: req.user });
});

// User check-auth route
router.get('/users/check-auth', verifyRole(User), (req, res) => {
  res.status(200).json({ authenticated: true, role: 'user', user: req.user });
});

// Seller check-auth route
router.get('/sellers/check-auth', verifyRole(Seller), (req, res) => {
  res.status(200).json({ authenticated: true, role: 'seller', user: req.user });
});

module.exports = router;
