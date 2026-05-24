# SK Naawan IMS - Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Prerequisites
- ✅ PostgreSQL 14+ installed
- ✅ Node.js 18+ installed
- ✅ Git installed

---

## Option 1: Automated Setup (Recommended)

```bash
# Run the setup script
chmod +x setup.sh
./setup.sh
```

The script will:
1. Create PostgreSQL database
2. Apply database schema
3. Set up backend with .env file
4. Install dependencies
5. Build TypeScript
6. (Optional) Create Vue.js frontend

---

## Option 2: Manual Setup

### Step 1: Database (2 minutes)

```bash
# Create database
createdb sk_naawan_ims

# Apply schema
psql -U postgres -d sk_naawan_ims -f database/schema.sql
```

### Step 2: Backend (2 minutes)

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your database password
nano .env

# Build & start
npm run build
npm run dev
```

**Backend now running on:** http://localhost:5000

### Step 3: Test Backend (1 minute)

```bash
# Test login (in a new terminal)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"president","password":"president"}'
```

You should get a JSON response with a token!

---

## Default Login Credentials

| Role | Username | Password |
|------|----------|----------|
| Chairperson | `president` | `president` |
| Treasurer | `treasurer` | `treasurer` |
| Secretary | `secretary` | `secretary` |

---

## API Endpoints Quick Reference

### Authentication
```bash
# Login
POST /api/auth/login
Body: {"username": "president", "password": "president"}

# Get Profile (requires token)
GET /api/auth/profile
Header: Authorization: Bearer YOUR_TOKEN
```

### Events
```bash
# List all events
GET /api/events
Header: Authorization: Bearer YOUR_TOKEN

# Create event (secretary only)
POST /api/events
Header: Authorization: Bearer YOUR_TOKEN
Body: {
  "title": "Youth Summit 2026",
  "description": "Annual youth summit",
  "date": "2026-06-15",
  "time": "09:00",
  "location": "SK Hall",
  "status": "Planning"
}
```

### Funds
```bash
# Get budget summary
GET /api/funds/summary
Header: Authorization: Bearer YOUR_TOKEN

# Record income (treasurer only)
POST /api/funds
Header: Authorization: Bearer YOUR_TOKEN
Body: {
  "type": "income",
  "amount": 50000,
  "category": "IRA Fund",
  "source": "Municipal Budget",
  "description": "May 2026 allocation",
  "date": "2026-05-08"
}

# Record expense (treasurer only)
POST /api/funds
Header: Authorization: Bearer YOUR_TOKEN
Body: {
  "type": "expense",
  "amount": 15000,
  "category": "Sports Equipment",
  "or_number": "OR-2026-001",
  "description": "Basketball equipment",
  "date": "2026-05-08"
}
```

### Activity Proposals
```bash
# Create activity proposal (secretary only)
POST /api/activity-proposals
Header: Authorization: Bearer YOUR_TOKEN
Body: {
  "project_title": "Skills Training Workshop",
  "project_proponent": "SK Naawan",
  "barangay": "Poblacion",
  "objectives": "Provide skills training to youth",
  "rationale": "Enhance youth employability",
  "target_beneficiaries": "100 youth aged 18-30",
  "budget_requirement": 25000
}

# Review proposal (chairperson only)
PATCH /api/activity-proposals/1/review
Header: Authorization: Bearer YOUR_TOKEN
Body: {
  "status": "approved",
  "chairperson_comments": "Approved. Good initiative."
}
```

### Budget Proposals
```bash
# Create budget proposal (treasurer only)
POST /api/budget-proposals
Header: Authorization: Bearer YOUR_TOKEN
Body: {
  "title": "Sports Equipment Budget",
  "description": "Budget for sports equipment purchase",
  "purpose": "Youth sports development",
  "items": [
    {
      "item": "Basketball",
      "quantity": 10,
      "unit_cost": 500,
      "total_cost": 5000
    },
    {
      "item": "Volleyball",
      "quantity": 5,
      "unit_cost": 800,
      "total_cost": 4000
    }
  ]
}
```

### Notifications
```bash
# Get notifications
GET /api/notifications
Header: Authorization: Bearer YOUR_TOKEN

# Get unread count
GET /api/notifications/unread-count
Header: Authorization: Bearer YOUR_TOKEN

# Mark as read
PATCH /api/notifications/1/read
Header: Authorization: Bearer YOUR_TOKEN
```

---

## Environment Variables

### Backend (.env)
```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sk_naawan_ims
DB_USER=postgres
DB_PASSWORD=your_password_here

# JWT
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:5173
```

---

## Testing the API

### Using curl
```bash
# 1. Login and save token
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"president","password":"president"}' | jq -r '.token')

# 2. Use token for authenticated requests
curl -H "Authorization: Bearer $TOKEN" http://localhost:5000/api/events
```

### Using httpie (cleaner syntax)
```bash
# Install httpie
pip install httpie

# Login
http POST localhost:5000/api/auth/login username=president password=president

# Save token
TOKEN="your_token_here"

# Authenticated request
http GET localhost:5000/api/events Authorization:"Bearer $TOKEN"
```

### Using Postman/Insomnia
1. Import endpoints from MIGRATION_GUIDE.md
2. Set Authorization header: `Bearer YOUR_TOKEN`
3. Test each endpoint

---

## Common Issues & Solutions

### Database Connection Error
```
Error: password authentication failed for user "postgres"
```
**Solution:** Update DB_PASSWORD in backend/.env

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Change PORT in backend/.env or kill process:
```bash
lsof -ti:5000 | xargs kill -9
```

### JWT Secret Not Set
```
Error: JWT_SECRET is not defined
```
**Solution:** Add JWT_SECRET to backend/.env:
```env
JWT_SECRET=$(openssl rand -base64 32)
```

---

## Next Steps

### ✅ Backend is ready! Now implement Vue.js frontend:

1. **Create Vue.js Project**
   ```bash
   npm create vue@latest frontend -- --typescript --router --pinia
   cd frontend
   npm install
   ```

2. **Install Dependencies**
   ```bash
   npm install axios @vueuse/core date-fns lucide-vue-next sonner
   npm install -D tailwindcss@4.1.12 postcss autoprefixer
   ```

3. **Follow MIGRATION_GUIDE.md**
   - Setup Axios with JWT interceptors
   - Create Pinia stores
   - Configure Vue Router
   - Convert React components to Vue
   - Apply Eco-Trust theme

---

## Documentation

- 📘 **[README.md](./README.md)** - Complete project overview
- 📗 **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** - Detailed migration steps
- 📙 **[CONVERSION_SUMMARY.md](./CONVERSION_SUMMARY.md)** - What was built
- 📕 **[SYSTEM_GUIDE.md](./SYSTEM_GUIDE.md)** - Original user guide

---

## Support

Having issues? Check:
1. Database connection in .env
2. PostgreSQL is running: `pg_isready`
3. Node.js version: `node --version` (need 18+)
4. Logs in terminal for error messages

---

**Ready to build!** 🚀

Backend API: ✅ Complete  
Database: ✅ Ready  
Documentation: ✅ Comprehensive  
Frontend: 📋 Guidelines provided in MIGRATION_GUIDE.md
