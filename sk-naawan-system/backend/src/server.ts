import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes';
import eventsRoutes from './routes/eventsRoutes';
import fundsRoutes from './routes/fundsRoutes';
import activityProposalsRoutes from './routes/activityProposalsRoutes';
import budgetProposalsRoutes from './routes/budgetProposalsRoutes';
import notificationsRoutes from './routes/notificationsRoutes';
import activityLogsRoutes from './routes/activityLogsRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/api', (req: Request, res: Response) => {
  res.json({
    message: 'SK Naawan IMS API',
    version: '1.0.0',
    status: 'running'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/funds', fundsRoutes);
app.use('/api/activity-proposals', activityProposalsRoutes);
app.use('/api/budget-proposals', budgetProposalsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/activity-logs', activityLogsRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║     SK Naawan IMS Backend API                        ║
║     Version: 1.0.0                                   ║
║                                                       ║
║     🚀 Server running on port ${PORT}                    ║
║     📝 Environment: ${process.env.NODE_ENV || 'development'}                  ║
║     🌐 API: http://localhost:${PORT}/api               ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
});

export default app;
