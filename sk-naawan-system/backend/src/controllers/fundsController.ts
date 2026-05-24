import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getAllFunds = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { archived = 'false', type } = req.query;

    let query = `
      SELECT f.*, u.full_name as created_by_name, e.title as event_title
      FROM funds f
      LEFT JOIN users u ON f.created_by = u.id
      LEFT JOIN events e ON f.event_id = e.id
      WHERE f.archived = $1
    `;

    const params: any[] = [archived === 'true'];

    if (type && (type === 'income' || type === 'expense')) {
      query += ' AND f.type = $2';
      params.push(type);
    }

    query += ' ORDER BY f.date DESC, f.created_at DESC';

    const result = await pool.query(query, params);

    res.json({ funds: result.rows });
  } catch (error) {
    console.error('Get funds error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getFund = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT f.*, u.full_name as created_by_name, e.title as event_title
       FROM funds f
       LEFT JOIN users u ON f.created_by = u.id
       LEFT JOIN events e ON f.event_id = e.id
       WHERE f.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Fund entry not found' });
      return;
    }

    res.json({ fund: result.rows[0] });
  } catch (error) {
    console.error('Get fund error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createFund = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'treasurer') {
      res.status(403).json({ error: 'Only treasurer can manage funds' });
      return;
    }

    const {
      type,
      amount,
      category,
      source,
      description,
      or_number,
      receipt_url,
      date,
      event_id
    } = req.body;

    if (!type || !amount || !category || !date) {
      res.status(400).json({ error: 'Type, amount, category, and date are required' });
      return;
    }

    if (type !== 'income' && type !== 'expense') {
      res.status(400).json({ error: 'Type must be either "income" or "expense"' });
      return;
    }

    const result = await pool.query(
      `INSERT INTO funds (type, amount, category, source, description, or_number, receipt_url, date, event_id, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [type, amount, category, source, description, or_number, receipt_url, date, event_id, req.user!.id]
    );

    await pool.query(
      'INSERT INTO activity_logs (user_id, user_name, action, details) VALUES ($1, $2, $3, $4)',
      [req.user!.id, req.user!.fullName, `Recorded ${type}`, `Amount: ₱${amount}, Category: ${category}`]
    );

    res.status(201).json({ fund: result.rows[0], message: `${type === 'income' ? 'Income' : 'Expense'} recorded successfully` });
  } catch (error) {
    console.error('Create fund error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateFund = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'treasurer') {
      res.status(403).json({ error: 'Only treasurer can manage funds' });
      return;
    }

    const { id } = req.params;
    const {
      type,
      amount,
      category,
      source,
      description,
      or_number,
      receipt_url,
      date,
      event_id
    } = req.body;

    const result = await pool.query(
      `UPDATE funds
       SET type = COALESCE($1, type),
           amount = COALESCE($2, amount),
           category = COALESCE($3, category),
           source = COALESCE($4, source),
           description = COALESCE($5, description),
           or_number = COALESCE($6, or_number),
           receipt_url = COALESCE($7, receipt_url),
           date = COALESCE($8, date),
           event_id = COALESCE($9, event_id)
       WHERE id = $10
       RETURNING *`,
      [type, amount, category, source, description, or_number, receipt_url, date, event_id, id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Fund entry not found' });
      return;
    }

    await pool.query(
      'INSERT INTO activity_logs (user_id, user_name, action, details) VALUES ($1, $2, $3, $4)',
      [req.user!.id, req.user!.fullName, 'Updated fund entry', `Fund ID: ${id}`]
    );

    res.json({ fund: result.rows[0], message: 'Fund entry updated successfully' });
  } catch (error) {
    console.error('Update fund error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const archiveFund = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'treasurer') {
      res.status(403).json({ error: 'Only treasurer can archive funds' });
      return;
    }

    const { id } = req.params;

    const result = await pool.query(
      'UPDATE funds SET archived = true WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Fund entry not found' });
      return;
    }

    await pool.query(
      'INSERT INTO activity_logs (user_id, user_name, action, details) VALUES ($1, $2, $3, $4)',
      [req.user!.id, req.user!.fullName, 'Archived fund entry', `Fund ID: ${id}`]
    );

    res.json({ message: 'Fund entry archived successfully' });
  } catch (error) {
    console.error('Archive fund error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteFund = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'treasurer') {
      res.status(403).json({ error: 'Only treasurer can delete funds' });
      return;
    }

    const { id } = req.params;

    const result = await pool.query('DELETE FROM funds WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Fund entry not found' });
      return;
    }

    await pool.query(
      'INSERT INTO activity_logs (user_id, user_name, action, details) VALUES ($1, $2, $3, $4)',
      [req.user!.id, req.user!.fullName, 'Deleted fund entry', `Fund ID: ${id}`]
    );

    res.json({ message: 'Fund entry deleted successfully' });
  } catch (error) {
    console.error('Delete fund error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getBudgetSummary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await pool.query(`
      SELECT
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as total_income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as total_expenses,
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END), 0) as balance
      FROM funds
      WHERE archived = false
    `);

    res.json({ summary: result.rows[0] });
  } catch (error) {
    console.error('Get budget summary error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
