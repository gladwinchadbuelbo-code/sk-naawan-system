import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getAllBudgetProposals = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, submittedBy } = req.query;

    let query = `
      SELECT bp.*,
             u1.full_name as submitted_by_name,
             u2.full_name as reviewed_by_name
      FROM budget_proposals bp
      LEFT JOIN users u1 ON bp.submitted_by = u1.id
      LEFT JOIN users u2 ON bp.reviewed_by = u2.id
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramCount = 1;

    if (status) {
      query += ` AND bp.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    if (submittedBy) {
      query += ` AND bp.submitted_by = $${paramCount}`;
      params.push(submittedBy);
      paramCount++;
    }

    query += ' ORDER BY bp.created_at DESC';

    const result = await pool.query(query, params);

    const proposalIds = result.rows.map(p => p.id);

    let items: any[] = [];
    if (proposalIds.length > 0) {
      const itemsResult = await pool.query(
        'SELECT * FROM budget_proposal_items WHERE budget_proposal_id = ANY($1)',
        [proposalIds]
      );
      items = itemsResult.rows;
    }

    const proposalsWithItems = result.rows.map(proposal => ({
      ...proposal,
      items: items.filter(item => item.budget_proposal_id === proposal.id)
    }));

    res.json({ proposals: proposalsWithItems });
  } catch (error) {
    console.error('Get budget proposals error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getBudgetProposal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT bp.*,
              u1.full_name as submitted_by_name,
              u2.full_name as reviewed_by_name
       FROM budget_proposals bp
       LEFT JOIN users u1 ON bp.submitted_by = u1.id
       LEFT JOIN users u2 ON bp.reviewed_by = u2.id
       WHERE bp.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Budget proposal not found' });
      return;
    }

    const itemsResult = await pool.query(
      'SELECT * FROM budget_proposal_items WHERE budget_proposal_id = $1',
      [id]
    );

    res.json({
      proposal: {
        ...result.rows[0],
        items: itemsResult.rows
      }
    });
  } catch (error) {
    console.error('Get budget proposal error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createBudgetProposal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'treasurer') {
      res.status(403).json({ error: 'Only treasurer can create budget proposals' });
      return;
    }

    const { title, description, purpose, items } = req.body;

    if (!title || !items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: 'Title and at least one budget item are required' });
      return;
    }

    const total_amount = items.reduce((sum: number, item: any) => sum + (item.total_cost || 0), 0);

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const proposalResult = await client.query(
        `INSERT INTO budget_proposals (title, description, total_amount, purpose, submitted_by)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [title, description, total_amount, purpose, req.user!.id]
      );

      const proposalId = proposalResult.rows[0].id;

      for (const item of items) {
        await client.query(
          `INSERT INTO budget_proposal_items (budget_proposal_id, item, quantity, unit_cost, total_cost)
           VALUES ($1, $2, $3, $4, $5)`,
          [proposalId, item.item, item.quantity, item.unit_cost, item.total_cost]
        );
      }

      const chairpersonResult = await client.query(
        "SELECT id FROM users WHERE role = 'chairperson' LIMIT 1"
      );

      if (chairpersonResult.rows.length > 0) {
        await client.query(
          `INSERT INTO notifications (user_id, title, message, type, link)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            chairpersonResult.rows[0].id,
            'New Budget Proposal',
            `${req.user!.fullName} submitted a new budget proposal: ${title}`,
            'budget_proposal',
            '/staff/approvals'
          ]
        );
      }

      await client.query(
        'INSERT INTO activity_logs (user_id, user_name, action, details) VALUES ($1, $2, $3, $4)',
        [req.user!.id, req.user!.fullName, 'Created budget proposal', `Proposal: ${title}, Amount: ₱${total_amount}`]
      );

      await client.query('COMMIT');

      res.status(201).json({ proposal: proposalResult.rows[0], message: 'Budget proposal submitted successfully' });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Create budget proposal error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const reviewBudgetProposal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'chairperson') {
      res.status(403).json({ error: 'Only chairperson can review budget proposals' });
      return;
    }

    const { id } = req.params;
    const { status, chairperson_feedback } = req.body;

    if (!status || (status !== 'approved' && status !== 'returned')) {
      res.status(400).json({ error: 'Status must be either "approved" or "returned"' });
      return;
    }

    const proposalResult = await pool.query(
      'SELECT * FROM budget_proposals WHERE id = $1',
      [id]
    );

    if (proposalResult.rows.length === 0) {
      res.status(404).json({ error: 'Budget proposal not found' });
      return;
    }

    const proposal = proposalResult.rows[0];

    const updateResult = await pool.query(
      `UPDATE budget_proposals
       SET status = $1, chairperson_feedback = $2, reviewed_by = $3, reviewed_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING *`,
      [status, chairperson_feedback, req.user!.id, id]
    );

    await pool.query(
      `INSERT INTO notifications (user_id, title, message, type, link)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        proposal.submitted_by,
        `Budget Proposal ${status === 'approved' ? 'Approved' : 'Returned'}`,
        status === 'approved'
          ? `Your budget proposal "${proposal.title}" has been approved!`
          : `Your budget proposal "${proposal.title}" has been returned with feedback.`,
        'budget_proposal',
        '/staff/my-budget-proposals'
      ]
    );

    await pool.query(
      'INSERT INTO activity_logs (user_id, user_name, action, details) VALUES ($1, $2, $3, $4)',
      [req.user!.id, req.user!.fullName, `${status === 'approved' ? 'Approved' : 'Returned'} budget proposal`, `Proposal ID: ${id}`]
    );

    res.json({ proposal: updateResult.rows[0], message: `Budget proposal ${status === 'approved' ? 'approved' : 'returned'} successfully` });
  } catch (error) {
    console.error('Review budget proposal error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteBudgetProposal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const proposalResult = await pool.query('SELECT submitted_by FROM budget_proposals WHERE id = $1', [id]);

    if (proposalResult.rows.length === 0) {
      res.status(404).json({ error: 'Budget proposal not found' });
      return;
    }

    if (req.user?.id !== proposalResult.rows[0].submitted_by && req.user?.role !== 'chairperson') {
      res.status(403).json({ error: 'You can only delete your own proposals' });
      return;
    }

    await pool.query('DELETE FROM budget_proposals WHERE id = $1', [id]);

    await pool.query(
      'INSERT INTO activity_logs (user_id, user_name, action, details) VALUES ($1, $2, $3, $4)',
      [req.user!.id, req.user!.fullName, 'Deleted budget proposal', `Proposal ID: ${id}`]
    );

    res.json({ message: 'Budget proposal deleted successfully' });
  } catch (error) {
    console.error('Delete budget proposal error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
