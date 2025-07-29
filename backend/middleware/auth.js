const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      console.log('Token expired');
      return res.status(401).json({ error: 'Token expired' });
    } else if (err.name === 'JsonWebTokenError') {
      console.log('Invalid token');
      return res.status(403).json({ error: 'Invalid token' });
    } else {
      console.log('Token verification failed:', err);
      return res.status(403).json({ error: 'Token verification failed' });
    }
  }
};

module.exports = authenticateToken;
