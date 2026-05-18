import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
    role: 'chairperson' | 'treasurer' | 'secretary';
    fullName: string;
  };
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Access token required' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired token' });
    return;
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        error: 'Access denied',
        message: `This action requires ${roles.join(' or ')} role`
      });
      return;
    }

    next();
  };
};

export const authorizeSecretary = authorize('secretary');
export const authorizeTreasurer = authorize('treasurer');
export const authorizeChairperson = authorize('chairperson');
export const authorizeSecretaryOrChairperson = authorize('secretary', 'chairperson');
export const authorizeTreasurerOrChairperson = authorize('treasurer', 'chairperson');
