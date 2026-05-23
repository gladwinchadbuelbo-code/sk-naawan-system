import { Request, Response, NextFunction } from 'express';

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

  let targetRole: 'chairperson' | 'treasurer' | 'secretary' = 'chairperson';
  if (token) {
    const roleStr = token.toLowerCase();
    if (roleStr.includes('chair')) {
      targetRole = 'chairperson';
    } else if (roleStr.includes('sec')) {
      targetRole = 'secretary';
    } else if (roleStr.includes('treas')) {
      targetRole = 'treasurer';
    }
  }

  req.user = {
    id: targetRole === 'chairperson' ? 1 : targetRole === 'treasurer' ? 2 : 3,
    username: `sk_${targetRole}`,
    role: targetRole,
    fullName: targetRole === 'chairperson' ? 'Juan Dela Cruz' : targetRole === 'treasurer' ? 'Maria Santos' : 'Pedro Reyes'
  };
  next();
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    next();
  };
};

export const authorizeSecretary = authorize('secretary');
export const authorizeTreasurer = authorize('treasurer');
export const authorizeChairperson = authorize('chairperson');
export const authorizeSecretaryOrChairperson = authorize('secretary', 'chairperson');
export const authorizeTreasurerOrChairperson = authorize('treasurer', 'chairperson');
