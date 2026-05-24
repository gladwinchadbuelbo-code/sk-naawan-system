# SK Naawan IMS Backend Foundation

Integrated Digital Management System for the Sangguniang Kabataan of Naawan: Activities, Budget Transparency, and Reporting.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Auth**: JWT & bcryptjs

## Getting Started

### 1. Prerequisites
- PostgreSQL installed and running locally.
- A database named `sk_naawan_ims` created.

### 2. Installation
```bash
cd backend
npm install
```

### 3. Environment Variables
Create a `.env` file in the `backend/` directory and configure your credentials:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sk_naawan_ims
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret
```

### 4. Running the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Routes
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Authenticate and get token
- `GET /api/auth/me` - Get current user (Private)

## Folder Structure
- `config/`: Database and environment configuration.
- `controllers/`: Logic for processing requests.
- `middleware/`: Auth and role validation.
- `models/`: Sequelize database schemas.
- `routes/`: API endpoint definitions.
- `uploads/`: Storage for project documentation/images.
