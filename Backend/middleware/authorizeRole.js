const authorizeRole = (role) => {
    return (req, res, next) => {
      if (req.role !== role) {
        return res.status(403).json({ error: `Access denied. Requires ${role} role.` });
      }
      next();
    };
  };
  
  module.exports = { authorizeRole };
  