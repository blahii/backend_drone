const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).send('A token is required for authentication');
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send('Invalid Token');
    }
    req.user = decoded;
    next();
  });
}

function checkRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).send('Access denied');
    }
    next();
  };
}

module.exports = { verifyToken, checkRole };
