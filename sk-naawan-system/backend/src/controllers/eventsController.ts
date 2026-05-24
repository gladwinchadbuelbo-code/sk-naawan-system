import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getAllEvents = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { archived = 'false' } = req.query;

    const result = await pool.query(
      `SELECT e.*, u.full_name as created_by_name
       FROM events e
       LEFT JOIN users u ON e.created_by = u.id
       WHERE e.archived = $1
       ORDER BY e.date DESC`,
      [archived === 'true']
    );

    res.json({ events: result.rows });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT e.*, u.full_name as created_by_name
       FROM events e
       LEFT JOIN users u ON e.created_by = u.id
       WHERE e.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    res.json({ event: result.rows[0] });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'secretary') {
      res.status(403).json({ error: 'Only secretary can create events' });
      return;
    }

    const { title, description, date, time, location, status, budget_proposal_id } = req.body;

    if (!title || !date) {
      res.status(400).json({ error: 'Title and date are required' });
      return;
    }

    const result = await pool.query(
      `INSERT INTO events (title, description, date, time, location, status, budget_proposal_id, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [title, description, date, time, location, status || 'Planning', budget_proposal_id, req.user!.id]
    );

    await pool.query(
      'INSERT INTO activity_logs (user_id, user_name, action, details) VALUES ($1, $2, $3, $4)',
      [req.user!.id, req.user!.fullName, 'Created event', `Event: ${title}`]
    );

    res.status(201).json({ event: result.rows[0], message: 'Event created successfully' });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'secretary') {
      res.status(403).json({ error: 'Only secretary can update events' });
      return;
    }

    const { id } = req.params;
    const { title, description, date, time, location, status, budget_proposal_id } = req.body;

    const result = await pool.query(
      `UPDATE events
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           date = COALESCE($3, date),
           time = COALESCE($4, time),
           location = COALESCE($5, location),
           status = COALESCE($6, status),
           budget_proposal_id = COALESCE($7, budget_proposal_id)
       WHERE id = $8
       RETURNING *`,
      [title, description, date, time, location, status, budget_proposal_id, id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    await pool.query(
      'INSERT INTO activity_logs (user_id, user_name, action, details) VALUES ($1, $2, $3, $4)',
      [req.user!.id, req.user!.fullName, 'Updated event', `Event ID: ${id}`]
    );

    res.json({ event: result.rows[0], message: 'Event updated successfully' });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const archiveEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'secretary') {
      res.status(403).json({ error: 'Only secretary can archive events' });
      return;
    }

    const { id } = req.params;

    const result = await pool.query(
      'UPDATE events SET archived = true WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    await pool.query(
      'INSERT INTO activity_logs (user_id, user_name, action, details) VALUES ($1, $2, $3, $4)',
      [req.user!.id, req.user!.fullName, 'Archived event', `Event ID: ${id}`]
    );

    res.json({ message: 'Event archived successfully' });
  } catch (error) {
    console.error('Archive event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'secretary') {
      res.status(403).json({ error: 'Only secretary can delete events' });
      return;
    }

    const { id } = req.params;

    const result = await pool.query('DELETE FROM events WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    await pool.query(
      'INSERT INTO activity_logs (user_id, user_name, action, details) VALUES ($1, $2, $3, $4)',
      [req.user!.id, req.user!.fullName, 'Deleted event', `Event ID: ${id}`]
    );

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
