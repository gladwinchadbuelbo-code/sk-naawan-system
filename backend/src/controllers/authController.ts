import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { username = 'sk_chair' } = req.body;
    let targetRole: 'chairperson' | 'treasurer' | 'secretary' = 'chairperson';
    const roleStr = username.toLowerCase();
    if (roleStr.includes('chair')) {
      targetRole = 'chairperson';
    } else if (roleStr.includes('sec')) {
      targetRole = 'secretary';
    } else if (roleStr.includes('treas')) {
      targetRole = 'treasurer';
    }

    const user = {
      id: targetRole === 'chairperson' ? 1 : targetRole === 'treasurer' ? 2 : 3,
      username: `sk_${targetRole}`,
      fullName: targetRole === 'chairperson' ? 'Juan Dela Cruz' : targetRole === 'treasurer' ? 'Maria Santos' : 'Pedro Reyes',
      role: targetRole,
      email: `${targetRole}@sknaawan.gov.ph`
    };

    res.json({
      token: `mock_token_${targetRole}`,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const targetRole = req.user?.role || 'chairperson';
    const user = {
      id: req.user?.id || 1,
      username: req.user?.username || `sk_${targetRole}`,
      full_name: req.user?.fullName || (targetRole === 'chairperson' ? 'Juan Dela Cruz' : targetRole === 'treasurer' ? 'Maria Santos' : 'Pedro Reyes'),
      role: targetRole,
      email: `${targetRole}@sknaawan.gov.ph`
    };
    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
