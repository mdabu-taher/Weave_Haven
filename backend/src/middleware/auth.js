// backend/src/middleware/auth.js

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * protect:
 * Verify JWT in httpOnly cookie or Authorization header and attach `req.user`
 */
export async function protect(req, res, next) {
  try {
    // 1. Grab token from httpOnly cookie or Authorization header
    let token = null;
    if (req.cookies?.token) {
      token = req.cookies.token;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authenticated (token missing)' });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) {
      return res.status(401).json({ message: 'Invalid token payload' });
    }

    // 3. Fetch user (without sensitive fields)
    const user = await User.findById(decoded.id).select('-passwordHash');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // 4. Attach and continue
    req.user = user;
    next();
  } catch (err) {
    console.error('Auth protect error:', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

/**
 * authorize:
 * Only allow routes for users whose role is in allowedRoles
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

/**
 * isAdmin:
 * Shortcut to protect + authorize('admin')
 */
export const isAdmin = [protect, authorize('admin')];

export default protect;
