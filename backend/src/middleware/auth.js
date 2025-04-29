import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Verify JWT in httpOnly cookie and attach `req.user`
 */
export async function protect(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // fetch fresh user (optional) or use decoded payload
    const user = await User.findById(decoded.id).select('-passwordHash');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    req.user = user; // contains .id and .role
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Invalid token' });
  }
}

/**
 * Allow only the specified roles to proceed
 * e.g. authorize('admin'), authorize('seller','admin')
 */
export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient rights' });
    }
    next();
  };
}

// Default export so routes can import `protect` directly
export default protect;
