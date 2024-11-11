// Backend/middleware/auth.js
const jwt = require('jsonwebtoken');

const verifySellerToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Assuming token is passed in the Authorization header

  if (!token) {
    return res.status(403).json({ error: 'Authorization token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.sellerId = decoded.sellerId;  // Attach sellerId to request object for later use
    req.sellerName = decoded.sellerName;  // Optionally attach sellerName
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = { verifySellerToken };
