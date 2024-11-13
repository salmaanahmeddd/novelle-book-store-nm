// middleware/verifyAdminToken.js

const jwt = require('jsonwebtoken');

const verifyAdminToken = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ message: 'Unauthorized access' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Token is invalid or expired' });
    req.adminId = decoded.adminId;
    next();
  });
};

module.exports = verifyAdminToken;
