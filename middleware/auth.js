const jwt = require('jsonwebtoken');

// Token Authorization header (Bearer) ya "token" cookie se nikalta hai
function extractToken(req) {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) return header.slice(7);

  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    for (const part of cookieHeader.split(';')) {
      const [key, ...rest] = part.trim().split('=');
      if (key === 'token') return decodeURIComponent(rest.join('='));
    }
  }
  return null;
}

function verifyToken(req, res, next) {
  const token = extractToken(req);
  if (!token) return res.status(403).json({ message: 'No token provided' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET); // { id, username, role, iat, exp }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

// RBAC: sirf allowed roles ko aage jaane do
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: insufficient role' });
    }
    next();
  };
}

module.exports = { verifyToken, requireRole };
