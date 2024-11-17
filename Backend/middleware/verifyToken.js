const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Extract token from Authorization header
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log('Authorization header:', req.header('Authorization'));
  
  if (!token) {
    console.error('No token provided in Authorization header');
    return res.status(403).json({ error: 'Authorization token required' });
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    // Attach role-specific properties to the request
    if (decoded.adminId) {
      req.isAdmin = true;
      req.userId = decoded.adminId;
      req.role = 'admin';
    } else if (decoded.sellerId) {
      req.isSeller = true;
      req.userId = decoded.sellerId;
      req.role = 'seller';
    } else if (decoded.userId) {
      req.isUser = true;
      req.userId = decoded.userId;
      req.role = 'user';
    } else {
      console.error('Invalid token payload structure');
      return res.status(401).json({ error: 'Invalid token payload' });
    }

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Token verification failed:', error.message);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = { verifyToken };
