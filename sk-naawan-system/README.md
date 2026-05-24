# SK Naawan Information Management System

A comprehensive Information Management System for Sangguniang Kabataan (SK) in Naawan, featuring budget transparency, event management, and proposal workflows.

## 🎯 Project Overview

This system has been migrated from a React + localStorage architecture to a full-stack application:

- **Frontend**: Vue.js 3 + TypeScript + Pinia + Vue Router + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Theme**: Professional "Eco-Trust" branding (#059669 Emerald Green)

## 📁 Project Structure

```
sk-naawan-ims/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth & authorization
│   │   ├── routes/         # API routes
│   │   └── server.ts       # Express server
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── frontend/               # Vue.js application
│   ├── src/
│   │   ├── api/           # API service layer
│   │   ├── components/    # Vue components
│   │   ├── composables/   # Vue composables
│   │   ├── router/        # Vue Router config
│   │   ├── stores/        # Pinia stores
│   │   ├── views/         # Page components
│   │   └── main.ts        # App entry
│   ├── package.json
│   └── vite.config.ts
├── database/              # Database schema
│   └── schema.sql
├── MIGRATION_GUIDE.md     # Detailed migration guide
├── SYSTEM_GUIDE.md        # User documentation
├── DEVELOPER_GUIDE.md     # Original React dev guide
└── README.md             # This file
```

## ✨ Features

### Budget Management
- Track income and expenses
- Upload receipts (PDF, JPG, PNG up to 5MB)
- Real-time budget calculations
- Budget proposals with approval workflow
- Archive old transactions
- **Role**: Treasurer only

### Event Management
- Create and manage SK events
- Calendar view with status tracking
- Link events to approved budget proposals
- Upload event documents
- QR code attendance tracking
- Archive completed events
- **Role**: Secretary only

### Proposal System
- **Activity Proposals** (Secretary → Chairperson)
  - Submit project proposals with objectives and budget
  - Chairperson reviews and approves/returns with comments
  - Auto-create events from approved proposals
  
- **Budget Proposals** (Treasurer → Chairperson)
  - Submit itemized budget requests
  - Chairperson reviews and approves/returns with feedback
  - Track proposal status

### Reporting
- Liquidation reports
- Accomplishment reports
- Documentation packets
- Activity logs for audit trail

### Public Portal
- Transparent view of SK budget
- Public events calendar
- No login required for viewing

## 👥 User Roles

### SK Chairperson (President)
- Username: `president`
- Password: `president`
- **Permissions**:
  - Approve/reject all proposals
  - Full oversight of system
  - View all data and reports

### SK Treasurer
- Username: `treasurer`
- Password: `treasurer`
- **Permissions**:
  - Manage funds (income/expenses)
  - Create budget proposals
  - Upload receipts
  - Archive budget entries

### SK Secretary
- Username: `secretary`
- Password: `secretary`
- **Permissions**:
  - Create and manage events
  - Create activity proposals
  - Upload event documents
  - Archive events

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/pnpm
- PostgreSQL 14+
- Git

### 1. Clone Repository
```bash
git clone <repository-url>
cd sk-naawan-ims
```

### 2. Setup Database
```bash
# Create database
createdb sk_naawan_ims

# Run schema
psql -U postgres -d sk_naawan_ims -f database/schema.sql
```

### 3. Setup Backend
```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your database credentials
nano .env

# Start development server
npm run dev
```

Backend runs on: `http://localhost:5000`

### 4. Setup Frontend
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on: `http://localhost:5173`

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=sk_naawan_ims
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_secret_key_change_in_production
JWT_EXPIRE=7d

CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get current user profile

### Events
- `GET /api/events` - List all events
- `POST /api/events` - Create event (secretary only)
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Funds
- `GET /api/funds` - List all funds
- `GET /api/funds/summary` - Get budget summary
- `POST /api/funds` - Record income/expense (treasurer only)
- `PUT /api/funds/:id` - Update fund entry
- `DELETE /api/funds/:id` - Delete fund entry

### Proposals
- `GET /api/activity-proposals` - List activity proposals
- `POST /api/activity-proposals` - Create proposal (secretary)
- `PATCH /api/activity-proposals/:id/review` - Review proposal (chairperson)

- `GET /api/budget-proposals` - List budget proposals
- `POST /api/budget-proposals` - Create proposal (treasurer)
- `PATCH /api/budget-proposals/:id/review` - Review proposal (chairperson)

### Notifications
- `GET /api/notifications` - Get user notifications
- `GET /api/notifications/unread-count` - Get unread count
- `PATCH /api/notifications/:id/read` - Mark as read

### Activity Logs
- `GET /api/activity-logs` - View activity logs

## 🎨 Design Theme: Eco-Trust Professional

### Color Palette
- **Primary**: #059669 (Emerald Green) - Actions, active states
- **Secondary**: #10B981 (Mint Green) - Success indicators
- **Danger**: #EF4444 (Soft Red) - Expenses, errors
- **Warning**: #F59E0B (Amber) - Pending states
- **Dark**: #111827 (Deep Navy) - Sidebar, headers
- **Background**: #F9FAFB (Off-White) - Page background

### Typography
- Font: Inter (Google Fonts)
- Weights: 300, 400, 500, 600, 700

### UI Elements
- Cards: 12px rounded corners (rounded-xl)
- Buttons: Rounded-xl with hover transitions
- Tables: Zebra-striped for readability
- Sidebar: Dark Navy with Emerald Green icons

## 📦 Tech Stack Details

### Frontend
- **Vue 3**: Composition API with `<script setup>`
- **TypeScript**: Type-safe development
- **Pinia**: State management
- **Vue Router**: Navigation with guards
- **Axios**: HTTP client with interceptors
- **Tailwind CSS 4**: Utility-first styling
- **Lucide Vue**: Icon library
- **date-fns**: Date formatting
- **Sonner**: Toast notifications

### Backend
- **Express**: Fast, unopinionated web framework
- **TypeScript**: Strongly typed Node.js
- **pg**: PostgreSQL client
- **bcrypt**: Password hashing
- **jsonwebtoken**: JWT authentication
- **cors**: Cross-origin resource sharing
- **helmet**: Security headers
- **compression**: Response compression

### Database
- **PostgreSQL 14+**: Relational database
- **Indexes**: Optimized queries
- **Triggers**: Auto-update timestamps
- **Foreign Keys**: Data integrity
- **Transactions**: Atomic operations

## 🧪 Testing

### Backend API Testing
```bash
# Using httpie
http POST localhost:5000/api/auth/login username=president password=president

# Using curl
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"president","password":"president"}'

# Authenticated request
curl http://localhost:5000/api/events \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Frontend Testing
```bash
cd frontend
npm run dev
# Open http://localhost:5173
# Login with: president / president
```

## 📚 Documentation

- **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** - Complete migration documentation
- **[SYSTEM_GUIDE.md](./SYSTEM_GUIDE.md)** - User manual (original React version)
- **[DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)** - Developer docs (original React version)
- **[FINAL_CHECKLIST.md](./FINAL_CHECKLIST.md)** - QA checklist (original React version)

## 🚀 Deployment

### Backend Deployment
Recommended platforms:
- **Railway**: Automatic deployments from Git
- **Render**: Free PostgreSQL + Node.js hosting
- **Heroku**: Classic PaaS
- **DigitalOcean App Platform**: Scalable hosting

Steps:
1. Set environment variables
2. Connect PostgreSQL database
3. Run database migrations
4. Deploy backend

### Frontend Deployment
Recommended platforms:
- **Vercel**: Automatic Vue.js deployments
- **Netlify**: Continuous deployment
- **Cloudflare Pages**: Fast global CDN

Steps:
1. Set `VITE_API_URL` environment variable
2. Run `npm run build`
3. Deploy `dist/` folder

### Database Deployment
Recommended services:
- **Supabase**: PostgreSQL + Auth + Storage
- **Railway**: Managed PostgreSQL
- **Neon**: Serverless PostgreSQL
- **AWS RDS**: Enterprise-grade database

## 🔒 Security Features

- JWT-based authentication
- Bcrypt password hashing
- Role-based access control (RBAC)
- Protected API routes
- Input validation
- SQL injection prevention (parameterized queries)
- XSS protection
- CORS configuration
- Helmet security headers

## 🐛 Known Limitations

- No real-time updates (refresh required)
- No email notifications (in-app only)
- No file cloud storage (local upload)
- No cross-device sync
- No mobile app (responsive web only)

## 🔄 Migration from React Version

This project was originally built with React + localStorage. The migration to Vue.js + Node.js + PostgreSQL provides:

✅ **Benefits**:
- Real backend with database persistence
- Multi-user access with authentication
- Scalable architecture
- Data backup and recovery
- Audit trail via activity logs
- Real-time notifications
- RESTful API for future integrations

📖 See **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** for detailed conversion instructions.

## 📝 License

MIT License - Feel free to use for educational or organizational purposes.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📞 Support

For issues or questions:
- Check documentation in `/docs` folder
- Review MIGRATION_GUIDE.md for setup help
- Open GitHub issue for bugs

---

**Version**: 2.0.0 (Full Stack Edition)  
**Original Version**: 1.0.0 (React + localStorage)  
**Last Updated**: May 8, 2026  
**Status**: Backend Complete ✅ | Frontend In Progress 🚧
