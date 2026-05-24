import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getAllActivityProposals = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, submittedBy } = req.query;

    let query = `
      SELECT ap.*,
             u1.full_name as submitted_by_name,
             u2.full_name as reviewed_by_name
      FROM activity_proposals ap
      LEFT JOIN users u1 ON ap.submitted_by = u1.id
      LEFT JOIN users u2 ON ap.reviewed_by = u2.id
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramCount = 1;

    if (status) {
      query += ` AND ap.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    if (submittedBy) {
      query += ` AND ap.submitted_by = $${paramCount}`;
      params.push(submittedBy);
      paramCount++;
    }

    query += ' ORDER BY ap.created_at DESC';

    const result = await pool.query(query, params);

    res.json({ proposals: result.rows });
  } catch (error) {
    console.error('Get activity proposals error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getActivityProposal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT ap.*,
              u1.full_name as submitted_by_name,
              u2.full_name as reviewed_by_name
       FROM activity_proposals ap
       LEFT JOIN users u1 ON ap.submitted_by = u1.id
       LEFT JOIN users u2 ON ap.reviewed_by = u2.id
       WHERE ap.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Activity proposal not found' });
      return;
    }

    res.json({ proposal: result.rows[0] });
  } catch (error) {
    console.error('Get activity proposal error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createActivityProposal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'secretary') {
      res.status(403).json({ error: 'Only secretary can create activity proposals' });
      return;
    }

    const {
      project_title,
      project_proponent,
      barangay,
      objectives,
      rationale,
      target_beneficiaries,
      budget_requirement
    } = req.body;

    if (!project_title || !project_proponent || !barangay || !objectives || !rationale || !target_beneficiaries || !budget_requirement) {
      res.status(400).json({ error: 'All fields are required' });
      return;
    }

    const result = await pool.query(
      `INSERT INTO activity_proposals (
        project_title, project_proponent, barangay, objectives, rationale,
        target_beneficiaries, budget_requirement, submitted_by
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [project_title, project_proponent, barangay, objectives, rationale, target_beneficiaries, budget_requirement, req.user!.id]
    );

    const chairpersonResult = await pool.query(
      "SELECT id FROM users WHERE role = 'chairperson' LIMIT 1"
    );

    if (chairpersonResult.rows.length > 0) {
      await pool.query(
        `INSERT INTO notifications (user_id, title, message, type, link)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          chairpersonResult.rows[0].id,
          'New Activity Proposal',
          `${req.user!.fullName} submitted a new activity proposal: ${project_title}`,
          'proposal',
          `/staff/approvals`
        ]
      );
    }

    await pool.query(
      'INSERT INTO activity_logs (user_id, user_name, action, details) VALUES ($1, $2, $3, $4)',
      [req.user!.id, req.user!.fullName, 'Created activity proposal', `Proposal: ${project_title}`]
    );

    res.status(201).json({ proposal: result.rows[0], message: 'Activity proposal submitted successfully' });
  } catch (error) {
    console.error('Create activity proposal error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const reviewActivityProposal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'chairperson') {
      res.status(403).json({ error: 'Only chairperson can review activity proposals' });
      return;
    }

    const { id } = req.params;
    const { status, chairperson_comments } = req.body;

    if (!status || (status !== 'approved' && status !== 'returned')) {
      res.status(400).json({ error: 'Status must be either "approved" or "returned"' });
      return;
    }

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const proposalResult = await client.query(
        'SELECT * FROM activity_proposals WHERE id = $1',
        [id]
      );

      if (proposalResult.rows.length === 0) {
        await client.query('ROLLBACK');
        res.status(404).json({ error: 'Activity proposal not found' });
        return;
      }

      const proposal = proposalResult.rows[0];

      const updateResult = await client.query(
        `UPDATE activity_proposals
         SET status = $1, chairperson_comments = $2, reviewed_by = $3, reviewed_at = CURRENT_TIMESTAMP
         WHERE id = $4
         RETURNING *`,
        [status, chairperson_comments, req.user!.id, id]
      );

      if (status === 'approved') {
        await client.query(
          `INSERT INTO events (title, description, date, status, created_by)
           VALUES ($1, $2, $3, $4, $5)`,
          [proposal.project_title, proposal.objectives, new Date(), 'Planning', proposal.submitted_by]
        );
      }

      await client.query(
        `INSERT INTO notifications (user_id, title, message, type, link)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          proposal.submitted_by,
          `Activity Proposal ${status === 'approved' ? 'Approved' : 'Returned'}`,
          status === 'approved'
            ? `Your activity proposal "${proposal.project_title}" has been approved!`
            : `Your activity proposal "${proposal.project_title}" has been returned with comments.`,
          'proposal',
          '/staff/my-proposals'
        ]
      );

      await client.query(
        'INSERT INTO activity_logs (user_id, user_name, action, details) VALUES ($1, $2, $3, $4)',
        [req.user!.id, req.user!.fullName, `${status === 'approved' ? 'Approved' : 'Returned'} activity proposal`, `Proposal ID: ${id}`]
      );

      await client.query('COMMIT');

      res.json({ proposal: updateResult.rows[0], message: `Activity proposal ${status === 'approved' ? 'approved' : 'returned'} successfully` });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Review activity proposal error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteActivityProposal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const proposalResult = await pool.query('SELECT submitted_by FROM activity_proposals WHERE id = $1', [id]);

    if (proposalResult.rows.length === 0) {
      res.status(404).json({ error: 'Activity proposal not found' });
      return;
    }

    if (req.user?.id !== proposalResult.rows[0].submitted_by && req.user?.role !== 'chairperson') {
      res.status(403).json({ error: 'You can only delete your own proposals' });
      return;
    }

    await pool.query('DELETE FROM activity_proposals WHERE id = $1', [id]);

    await pool.query(
      'INSERT INTO activity_logs (user_id, user_name, action, details) VALUES ($1, $2, $3, $4)',
      [req.user!.id, req.user!.fullName, 'Deleted activity proposal', `Proposal ID: ${id}`]
    );

    res.json({ message: 'Activity proposal deleted successfully' });
  } catch (error) {
    console.error('Delete activity proposal error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
