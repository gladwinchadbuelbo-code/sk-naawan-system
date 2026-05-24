# SK Naawan IMS - Vue.js + Node.js + PostgreSQL Migration Guide

## Overview
This guide documents the complete migration from React + localStorage to Vue.js + Node.js + PostgreSQL.

## ✅ Completed Components

### Backend (100% Complete)
Located in `/backend/` directory:

#### Database
- ✅ **PostgreSQL Schema** (`/database/schema.sql`)
  - Users table with role-based access
  - Events, Funds, Activity Proposals, Budget Proposals
  - Notifications and Activity Logs
  - Indexes for performance optimization
  - Triggers for auto-updating timestamps
  - Default users with bcrypt hashed passwords

#### API Server
- ✅ **TypeScript Express Server** (`/backend/src/server.ts`)
  - CORS, Helmet, Compression middleware
  - JSON body parsing
  - Error handling
  - Route organization

#### Controllers (All Complete)
- ✅ `authController.ts` - Login & JWT authentication
- ✅ `eventsController.ts` - Event CRUD operations (secretary-only)
- ✅ `fundsController.ts` - Budget management (treasurer-only)
- ✅ `activityProposalsController.ts` - Activity proposals (secretary → chairperson)
- ✅ `budgetProposalsController.ts` - Budget proposals (treasurer → chairperson)
- ✅ `notificationsController.ts` - User notifications
- ✅ `activityLogsController.ts` - System activity logging

#### Authentication & Authorization
- ✅ JWT token-based authentication
- ✅ Role-based middleware (chairperson, treasurer, secretary)
- ✅ Password hashing with bcrypt
- ✅ Protected routes

#### API Routes (All Complete)
- ✅ `/api/auth` - Login, get profile
- ✅ `/api/events` - Event management
- ✅ `/api/funds` - Budget/fund management
- ✅ `/api/activity-proposals` - Activity proposal workflow
- ✅ `/api/budget-proposals` - Budget proposal workflow
- ✅ `/api/notifications` - Notification system
- ✅ `/api/activity-logs` - Activity logging

---

## 🚀 Setup Instructions

### Step 1: Database Setup

```bash
# Create PostgreSQL database
createdb sk_naawan_ims

# Or using psql
psql -U postgres
CREATE DATABASE sk_naawan_ims;
\q

# Run schema
psql -U postgres -d sk_naawan_ims -f database/schema.sql
```

### Step 2: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Edit .env with your configuration
nano .env

# Build TypeScript
npm run build

# Start development server
npm run dev

# Or start production server
npm start
```

#### Environment Variables (.env)
```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=sk_naawan_ims
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRE=7d

CORS_ORIGIN=http://localhost:5173
```

### Step 3: Frontend Setup (Vue.js)

#### Create Vue Project Structure

```bash
# Create Vue project
npm create vue@latest frontend

# Select options:
# ✅ TypeScript
# ✅ Vue Router
# ✅ Pinia
# ✅ ESLint
# ❌ Vitest (optional)
# ❌ Playwright (optional)

cd frontend
npm install

# Install additional dependencies
npm install axios @vueuse/core date-fns lucide-vue-next sonner
```

#### Install Tailwind CSS

```bash
cd frontend
npm install -D tailwindcss@4.1.12 postcss autoprefixer

# Create config files
npx tailwindcss init -p
```

#### Configure Tailwind (`tailwind.config.js`)

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#059669',
        secondary: '#10B981',
        danger: '#EF4444',
        warning: '#F59E0B',
        dark: '#111827',
        background: '#F9FAFB',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

---

## 📁 Vue.js Project Structure

```
frontend/
├── src/
│   ├── api/                    # API service layer
│   │   ├── axios.ts           # Axios configuration
│   │   ├── auth.ts            # Auth API calls
│   │   ├── events.ts          # Events API calls
│   │   ├── funds.ts           # Funds API calls
│   │   └── proposals.ts       # Proposals API calls
│   ├── assets/                # Static assets
│   ├── components/            # Vue components
│   │   ├── ui/               # Base UI components
│   │   ├── Layout.vue        # Main layout with sidebar
│   │   └── ProtectedRoute.vue
│   ├── composables/          # Vue composables
│   │   ├── useAuth.ts        # Authentication composable
│   │   └── useApi.ts         # API composable
│   ├── router/               # Vue Router
│   │   └── index.ts
│   ├── stores/               # Pinia stores
│   │   ├── auth.ts          # Auth store
│   │   ├── events.ts        # Events store
│   │   └── funds.ts         # Funds store
│   ├── views/               # Page components
│   │   ├── Dashboard.vue
│   │   ├── BudgetPage.vue
│   │   ├── EventsPage.vue
│   │   └── ...
│   ├── styles/              # CSS files
│   │   ├── main.css
│   │   └── tailwind.css
│   ├── App.vue              # Root component
│   └── main.ts              # App entry point
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 🔧 Key Vue.js Files

### 1. Axios Configuration (`src/api/axios.ts`)

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 2. Auth Store (`src/stores/auth.ts`)

```typescript
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/api/axios';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const token = ref(localStorage.getItem('token') || '');

  const isAuthenticated = computed(() => !!token.value);
  const userRole = computed(() => user.value?.role);

  const login = async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password });
    token.value = response.data.token;
    user.value = response.data.user;
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  };

  const logout = () => {
    token.value = '';
    user.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const loadUser = async () => {
    if (token.value) {
      try {
        const response = await api.get('/auth/profile');
        user.value = response.data.user;
      } catch (error) {
        logout();
      }
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    userRole,
    login,
    logout,
    loadUser,
  };
});
```

### 3. Dashboard Component Example (`src/views/Dashboard.vue`)

```vue
<template>
  <div class="p-8 space-y-8 min-h-screen bg-[#F9FAFB]">
    <!-- Header -->
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <h1 class="text-3xl font-bold text-[#111827]">
          SK Naawan IMS Dashboard
        </h1>
        <p class="text-gray-600 mt-2">{{ greeting }}</p>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card
        title="Total Funds"
        :value="formatCurrency(budgetSummary.total_income)"
        icon="wallet"
        color="emerald"
      />
      <Card
        title="Total Expenses"
        :value="formatCurrency(budgetSummary.total_expenses)"
        icon="trending-down"
        color="red"
      />
      <Card
        title="Balance"
        :value="formatCurrency(budgetSummary.balance)"
        icon="trending-up"
        color="green"
      />
      <Card
        title="Upcoming Events"
        :value="upcomingEventsCount"
        icon="calendar"
        color="emerald"
      />
    </div>

    <!-- Quick Actions -->
    <QuickActions v-if="user" :role="user.role" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useFundsStore } from '@/stores/funds';
import { useEventsStore } from '@/stores/events';
import Card from '@/components/Card.vue';
import QuickActions from '@/components/QuickActions.vue';

const authStore = useAuthStore();
const fundsStore = useFundsStore();
const eventsStore = useEventsStore();

const user = computed(() => authStore.user);
const budgetSummary = computed(() => fundsStore.summary);
const upcomingEventsCount = computed(() => eventsStore.upcomingEvents.length);

const greeting = computed(() => {
  return `Welcome, ${user.value?.fullName}`;
});

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(amount);
};

onMounted(async () => {
  await fundsStore.fetchBudgetSummary();
  await eventsStore.fetchEvents();
});
</script>
```

### 4. Router Configuration (`src/router/index.ts`)

```typescript
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
    },
    {
      path: '/staff',
      component: () => import('@/components/Layout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/views/Dashboard.vue'),
        },
        {
          path: 'budget',
          name: 'budget',
          component: () => import('@/views/BudgetPage.vue'),
          meta: { role: 'treasurer' },
        },
        {
          path: 'events',
          name: 'events',
          component: () => import('@/views/EventsPage.vue'),
        },
        // ... more routes
      ],
    },
  ],
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else if (to.meta.role && authStore.userRole !== to.meta.role) {
    next('/staff/dashboard');
  } else {
    next();
  }
});

export default router;
```

---

## 🎨 Eco-Trust Theme in Vue

Apply the same Eco-Trust theme colors in your Vue components:

```css
/* src/styles/main.css */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary: #059669;
  --secondary: #10B981;
  --danger: #EF4444;
  --warning: #F59E0B;
  --dark: #111827;
  --background: #F9FAFB;
}

body {
  font-family: 'Inter', sans-serif;
  background-color: var(--background);
}

/* Emerald Green buttons */
.btn-primary {
  @apply bg-[#059669] hover:bg-[#047857] text-white font-semibold py-2 px-4 rounded-xl transition;
}

/* Soft Red buttons */
.btn-danger {
  @apply bg-[#EF4444] hover:bg-[#DC2626] text-white font-semibold py-2 px-4 rounded-xl transition;
}

/* Cards */
.card {
  @apply bg-white rounded-xl shadow-lg p-6;
}

/* Zebra-striped tables */
.table-row:nth-child(even) {
  @apply bg-gray-50/50;
}
```

---

## 🔄 React to Vue Conversion Patterns

### React Component → Vue Component

**React:**
```tsx
export function Dashboard() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const handleClick = () => {
    navigate('/somewhere');
  };

  return (
    <div>
      <button onClick={handleClick}>Click</button>
    </div>
  );
}
```

**Vue:**
```vue
<template>
  <div>
    <button @click="handleClick">Click</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const data = ref([]);
const router = useRouter();

const fetchData = async () => {
  // fetch logic
};

const handleClick = () => {
  router.push('/somewhere');
};

onMounted(() => {
  fetchData();
});
</script>
```

### localStorage → API Calls

**Before (React + localStorage):**
```typescript
const events = storage.getEvents();
storage.setEvents([...events, newEvent]);
```

**After (Vue + API):**
```typescript
// In Pinia store
const fetchEvents = async () => {
  const response = await api.get('/events');
  events.value = response.data.events;
};

const createEvent = async (eventData) => {
  const response = await api.post('/events', eventData);
  events.value.push(response.data.event);
};
```

---

## 📝 API Endpoints Reference

### Authentication
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get current user

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event (secretary only)
- `PUT /api/events/:id` - Update event (secretary only)
- `PATCH /api/events/:id/archive` - Archive event
- `DELETE /api/events/:id` - Delete event

### Funds
- `GET /api/funds` - Get all funds
- `GET /api/funds/summary` - Get budget summary
- `GET /api/funds/:id` - Get single fund
- `POST /api/funds` - Create fund (treasurer only)
- `PUT /api/funds/:id` - Update fund
- `PATCH /api/funds/:id/archive` - Archive fund
- `DELETE /api/funds/:id` - Delete fund

### Activity Proposals
- `GET /api/activity-proposals` - Get all proposals
- `GET /api/activity-proposals/:id` - Get single proposal
- `POST /api/activity-proposals` - Create proposal (secretary only)
- `PATCH /api/activity-proposals/:id/review` - Review proposal (chairperson only)
- `DELETE /api/activity-proposals/:id` - Delete proposal

### Budget Proposals
- `GET /api/budget-proposals` - Get all proposals
- `GET /api/budget-proposals/:id` - Get single proposal
- `POST /api/budget-proposals` - Create proposal (treasurer only)
- `PATCH /api/budget-proposals/:id/review` - Review proposal (chairperson only)
- `DELETE /api/budget-proposals/:id` - Delete proposal

### Notifications
- `GET /api/notifications` - Get user notifications
- `GET /api/notifications/unread-count` - Get unread count
- `PATCH /api/notifications/:id/read` - Mark as read
- `PATCH /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

### Activity Logs
- `GET /api/activity-logs` - Get activity logs
- `POST /api/activity-logs` - Create activity log

---

## 🧪 Testing

### Test Backend API
```bash
# Install httpie or use curl
pip install httpie

# Test login
http POST localhost:5000/api/auth/login username=president password=president

# Test with JWT token
http GET localhost:5000/api/events Authorization:"Bearer YOUR_TOKEN_HERE"
```

### Test Frontend
```bash
cd frontend
npm run dev
# Open http://localhost:5173
```

---

## 🚀 Deployment

### Backend Deployment (Node.js)
- Deploy to: Heroku, Railway, Render, DigitalOcean
- Set environment variables
- Connect to PostgreSQL database
- Run migrations

### Frontend Deployment (Vue.js)
- Build: `npm run build`
- Deploy to: Vercel, Netlify, Cloudflare Pages
- Set `VITE_API_URL` environment variable

### Database Deployment
- Use managed PostgreSQL: Supabase, Railway, Neon, AWS RDS
- Run schema.sql on production database
- Secure with SSL connections

---

## 📚 Additional Resources

- [Vue.js Documentation](https://vuejs.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Vue Router Documentation](https://router.vuejs.org/)
- [Express.js Documentation](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JWT Authentication Best Practices](https://jwt.io/)

---

## ✅ Migration Checklist

- [x] PostgreSQL database schema created
- [x] Backend API with TypeScript + Express
- [x] Authentication with JWT
- [x] Role-based authorization middleware
- [x] All CRUD controllers implemented
- [x] API routes configured
- [ ] Vue.js project setup
- [ ] Pinia stores created
- [ ] API service layer implemented
- [ ] Vue components converted from React
- [ ] Router configured with guards
- [ ] Eco-Trust theme applied
- [ ] Testing completed
- [ ] Documentation finalized

---

**Version:** 1.0.0  
**Last Updated:** May 8, 2026  
**Status:** Backend Complete, Frontend In Progress
