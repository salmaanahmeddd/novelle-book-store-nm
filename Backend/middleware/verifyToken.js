const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(403).json({ error: 'Authorization token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.adminId) {
      req.isAdmin = true; // mark the request as authenticated by an admin
      req.userId = decoded.adminId;
    } else if (decoded.sellerId) {
      req.isSeller = true; // mark the request as authenticated by a seller
      req.userId = decoded.sellerId;
    } else {
      return res.status(401).json({ error: 'Invalid token' });
    }
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = { verifyToken };
