const jwt = require('jsonwebtoken');

const verifySellerToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(403).json({ error: 'Authorization token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.sellerId = decoded.sellerId; 
    req.sellerName = decoded.sellerName; 
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = { verifySellerToken };
