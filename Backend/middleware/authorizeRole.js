const authorizeRole = (role) => (req, res, next) => {
  console.log('Required role:', role, 'User role:', req.role); // Debug log
  if (req.role !== role) {
    console.error(`Access denied. Expected: ${role}, but got: ${req.role}`); // Debug log
    return res.status(403).json({ error: `Access denied. ${role} role required.` });
  }
  next();
};

module.exports = { authorizeRole };
