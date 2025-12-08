const { decodeToken } = require('../shared/jwt-utils');
const { findUserById } = require('../modules/auth/models/auth.model');

const authenticate = async (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.'
    });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = decodeToken(token);
    const user = await findUserById(decoded.sub);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid token: user not found' });
    }

    const role = user.role || decoded.role || 'customer';

    req.user = {
      id: user._id.toString(),
      role,
      email: user.email,
      username: user.username
    };
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      error: error.message
    });
  }
};

const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  if (!allowedRoles.length || allowedRoles.includes(req.user.role)) {
    return next();
  }

  return res.status(403).json({ success: false, message: 'Forbidden: insufficient permissions' });
};

const requireOwnershipOrAdmin = (ownerResolver) => (req, res, next) => {
  if (req.user?.role === 'admin') {
    return next();
  }

  if (!req.user?.id) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  const ownerId = typeof ownerResolver === 'function' ? ownerResolver(req) : ownerResolver;

  if (ownerId && req.user.id === ownerId.toString()) {
    return next();
  }

  return res.status(403).json({ success: false, message: 'Forbidden: not the resource owner' });
};

module.exports = {
  authenticate,
  authorize,
  requireOwnershipOrAdmin
};
