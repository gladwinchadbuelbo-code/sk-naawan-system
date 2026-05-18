import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getActivityLogs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId, limit = '50' } = req.query;

    let query = 'SELECT * FROM activity_logs WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    if (userId) {
      query += ` AND user_id = $${paramCount}`;
      params.push(userId);
      paramCount++;
    }

    query += ' ORDER BY created_at DESC';

    if (limit) {
      query += ` LIMIT $${paramCount}`;
      params.push(parseInt(limit as string));
    }

    const result = await pool.query(query, params);

    res.json({ logs: result.rows });
  } catch (error) {
    console.error('Get activity logs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createActivityLog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { action, details } = req.body;

    if (!action) {
      res.status(400).json({ error: 'Action is required' });
      return;
    }

    const result = await pool.query(
      'INSERT INTO activity_logs (user_id, user_name, action, details) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user!.id, req.user!.fullName, action, details]
    );

    res.status(201).json({ log: result.rows[0] });
  } catch (error) {
    console.error('Create activity log error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
