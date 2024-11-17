const authorizeRole = (role) => (req, res, next) => {
  if (req.role !== role) {
    return res.status(403).json({ error: `Access denied. ${role} role required.` });
  }
  next();
};

module.exports = { authorizeRole };
