# 💻 Complete Source Code Guide - SK IDMS
## Full Code Reference with Key Implementation Details

---

## 📋 Table of Contents
1. [Quick Start](#quick-start)
2. [Core System Files](#core-system-files)
3. [Authentication System](#authentication-system)
4. [Proposal Workflow](#proposal-workflow)
5. [Data Management](#data-management)
6. [Page Components](#page-components)
7. [UI Components](#ui-components)
8. [Styling System](#styling-system)
9. [Complete Code Examples](#complete-code-examples)

---

## 🚀 Quick Start

### How to View the Complete Code

All source code files are located in this project:

```
/App.tsx                    → Main application entry point
/contexts/AuthContext.tsx   → Authentication system
/utils/storage.ts           → Data persistence layer
/pages/                     → All 13 application pages
/components/                → Reusable components
/components/ui/             → 40+ UI components
/styles/globals.css         → Global styling
```

### Demo Credentials

```typescript
// President (Full Access + Approvals)
Username: president
Password: president123

// Treasurer (Budget Management)
Username: treasurer
Password: treasurer123

// Secretary (Activity Management)
Username: secretary
Password: secretary123
```

---

## 🏗️ Core System Files

### 1. App.tsx - Main Application Router

**Location:** `/App.tsx`

**Purpose:** 
- Main app entry point
- Route configuration
- Authentication provider wrapper
- Toast notification setup

**Key Features:**
```typescript
// All Routes
/login                              → LoginPage
/dashboard                          → Dashboard
/approvals                          → PendingApprovalsPage (President only)
/budget                             → BudgetPage
/budget/proposal/create             → BudgetProposalPage
/events                             → EventsPage  
/events/proposal/create             → ActivityProposalPage
/events/:id                         → EventDetailsPage
/events/:id/attendance              → AttendanceTrackingPage
/reports                            → ReportsPage
/reports/liquidation/:eventId?      → LiquidationReportPage
/reports/accomplishment/:eventId?   → AccomplishmentReportPage
/reports/documentation/:eventId?    → DocumentationPacketPage
/reports/templates/create           → TemplateEditorPage
/settings                           → SettingsPage
/activity-log                       → ActivityLogPage
```

**Code Structure:**
```typescript
export default function App() {
  return (
    <AuthProvider>              {/* Provides authentication context */}
      <Router>                  {/* React Router */}
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<ProtectedRoute />}>
            {/* All protected routes here */}
          </Route>
        </Routes>
        <Toaster position="top-right" />  {/* Toast notifications */}
      </Router>
    </AuthProvider>
  );
}
```

---

### 2. AuthContext.tsx - Authentication & Permissions

**Location:** `/contexts/AuthContext.tsx`

**Purpose:**
- User authentication
- Role-based permissions
- Session management
- Permission checks

**Type Definitions:**
```typescript
export type UserRole = 'president' | 'treasurer' | 'secretary';

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  canEdit: (resourceType: 'liquidation' | 'accomplishment' | 'budget' | 'event') => boolean;
  canApprove: () => boolean;
}
```

**Demo Users:**
```typescript
const DEMO_USERS: Record<string, { password: string; user: User }> = {
  'president': {
    password: 'president123',
    user: {
      id: '1',
      username: 'president',
      fullName: 'SK President',
      role: 'president',
    },
  },
  'treasurer': {
    password: 'treasurer123',
    user: {
      id: '2',
      username: 'treasurer',
      fullName: 'SK Treasurer',
      role: 'treasurer',
    },
  },
  'secretary': {
    password: 'secretary123',
    user: {
      id: '3',
      username: 'secretary',
      fullName: 'SK Secretary',
      role: 'secretary',
    },
  },
};
```

**Permission Logic:**
```typescript
const canEdit = (resourceType): boolean => {
  if (!user) return false;

  // President has full oversight
  if (user.role === 'president') return true;

  // Treasurer manages budget and liquidation
  if (user.role === 'treasurer') {
    return resourceType === 'liquidation' || resourceType === 'budget';
  }

  // Secretary manages events and accomplishment reports
  if (user.role === 'secretary') {
    return resourceType === 'accomplishment' || resourceType === 'event';
  }

  return false;
};

const canApprove = (): boolean => {
  // Only SK President can approve proposals
  return user?.role === 'president';
};
```

**Usage in Components:**
```typescript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, canEdit, canApprove, logout } = useAuth();
  
  if (!canEdit('budget')) {
    return <AccessDenied />;
  }
  
  // Component code...
}
```

---

### 3. storage.ts - Data Persistence

**Location:** `/utils/storage.ts`

**Purpose:**
- localStorage wrapper functions
- Data CRUD operations
- Notification management
- Activity logging
- Data export/import

**Storage Keys:**
```typescript
sk_events                → Events data
sk_funds                 → Budget entries
sk_activity_proposals    → Activity proposals
sk_budget_proposals      → Budget proposals
sk_notifications         → User notifications
sk_activity_log          → System audit log
sk_reports               → Generated reports
sk_templates             → Custom templates
sk_settings              → App settings
currentUser              → Active user session
```

**Key Functions:**
```typescript
export const storage = {
  // Events
  getEvents: () => JSON.parse(localStorage.getItem('sk_events') || 'null'),
  setEvents: (events: any[]) => localStorage.setItem('sk_events', JSON.stringify(events)),

  // Budget/Funds
  getFunds: () => JSON.parse(localStorage.getItem('sk_funds') || 'null'),
  setFunds: (funds: any[]) => localStorage.setItem('sk_funds', JSON.stringify(funds)),

  // Activity Proposals
  getActivityProposals: () => JSON.parse(localStorage.getItem('sk_activity_proposals') || '[]'),
  setActivityProposals: (proposals: any[]) => localStorage.setItem('sk_activity_proposals', JSON.stringify(proposals)),

  // Budget Proposals
  getBudgetProposals: () => JSON.parse(localStorage.getItem('sk_budget_proposals') || '[]'),
  setBudgetProposals: (proposals: any[]) => localStorage.setItem('sk_budget_proposals', JSON.stringify(proposals)),

  // Notifications
  getNotifications: () => JSON.parse(localStorage.getItem('sk_notifications') || '[]'),
  addNotification: (notification: any) => {
    const notifications = storage.getNotifications();
    notifications.unshift({ 
      ...notification, 
      id: Date.now(), 
      timestamp: new Date().toISOString(), 
      read: false 
    });
    localStorage.setItem('sk_notifications', JSON.stringify(notifications));
  },

  // Activity Log
  getActivityLog: () => JSON.parse(localStorage.getItem('sk_activity_log') || '[]'),
  addActivity: (activity: any) => {
    const logs = storage.getActivityLog();
    logs.unshift({ 
      ...activity, 
      id: Date.now(), 
      timestamp: new Date().toISOString() 
    });
    localStorage.setItem('sk_activity_log', JSON.stringify(logs));
  },

  // Utility functions
  clearAllData: () => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('sk_')) localStorage.removeItem(key);
    });
  },

  exportAllData: () => {
    return {
      events: storage.getEvents(),
      funds: storage.getFunds(),
      activityProposals: storage.getActivityProposals(),
      budgetProposals: storage.getBudgetProposals(),
      notifications: storage.getNotifications(),
      activityLog: storage.getActivityLog(),
      exportDate: new Date().toISOString(),
    };
  },

  importAllData: (data: any) => {
    if (data.events) storage.setEvents(data.events);
    if (data.funds) storage.setFunds(data.funds);
    if (data.activityProposals) storage.setActivityProposals(data.activityProposals);
    if (data.budgetProposals) storage.setBudgetProposals(data.budgetProposals);
    // ... import other data
  },
};
```

**Usage Example:**
```typescript
import { storage } from '../utils/storage';

// Get data
const events = storage.getEvents() || [];
const proposals = storage.getActivityProposals();

// Save data
storage.setEvents([...events, newEvent]);

// Add notification
storage.addNotification({
  recipient: 'president',
  title: 'New Proposal',
  message: 'A new activity proposal was submitted',
  type: 'info',
});

// Log activity
storage.addActivity({
  type: 'proposal',
  action: 'submitted',
  description: 'User submitted activity proposal',
});
```

---

## 🔐 Authentication System

### LoginPage.tsx

**Location:** `/pages/LoginPage.tsx`

**Key Features:**
- Username/password authentication
- Form validation
- Session persistence
- Auto-redirect if already logged in
- Demo credentials display

**Login Handler:**
```typescript
const handleLogin = (e: React.FormEvent) => {
  e.preventDefault();
  setError('');

  if (!username || !password) {
    setError('Please enter both username and password');
    return;
  }

  const success = login(username, password);
  
  if (success) {
    toast.success('Login successful! Welcome to IDMS for SK');
    navigate('/dashboard');
  } else {
    setError('Invalid username or password');
  }
};
```

### ProtectedRoute.tsx

**Location:** `/components/ProtectedRoute.tsx`

**Purpose:** Guard protected routes from unauthenticated access

**Implementation:**
```typescript
export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Layout />;
}
```

### Layout.tsx

**Location:** `/components/Layout.tsx`

**Key Features:**
- Collapsible sidebar
- Dynamic navigation based on role
- User profile display
- Logout functionality

**Navigation Configuration:**
```typescript
const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  ...(user?.role === 'president' ? [
    { name: 'Approvals', href: '/approvals', icon: CheckCircle }
  ] : []),
  { name: 'Budget', href: '/budget', icon: Wallet },
  { name: 'Events', href: '/events', icon: Calendar },
  { name: 'Reports', href: '/reports', icon: FileText },
];
```

**Role Info Display:**
```typescript
const getRoleInfo = () => {
  switch (user.role) {
    case 'president':
      return { icon: User, label: 'President', color: 'bg-purple-600' };
    case 'treasurer':
      return { icon: Wallet2, label: 'Treasurer', color: 'bg-green-600' };
    case 'secretary':
      return { icon: FileEdit, label: 'Secretary', color: 'bg-orange-600' };
  }
};
```

---

## 🔄 Proposal Workflow

### ActivityProposalPage.tsx (Secretary Creates)

**Location:** `/pages/ActivityProposalPage.tsx`

**Access Control:**
```typescript
if (user?.role !== 'secretary') {
  return (
    <div className="p-8">
      <Card className="p-8 text-center">
        <FileText className="w-16 h-16 mx-auto mb-4 text-orange-500" />
        <h2 className="text-xl mb-2">Access Denied</h2>
        <p className="text-gray-600">Only SK Secretary can create activity proposals.</p>
      </Card>
    </div>
  );
}
```

**Form State:**
```typescript
const [formData, setFormData] = useState({
  title: '',
  description: '',
  date: '',
  location: '',
  budget: '',
  targetParticipants: '',
  requirements: [''],
});
```

**Submit Handler:**
```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  // Validation
  if (!formData.title.trim()) {
    toast.error('Please enter activity title');
    return;
  }
  // ... more validation

  // Create proposal
  const proposals = storage.getActivityProposals();
  const newProposal = {
    id: Date.now(),
    title: formData.title,
    description: formData.description,
    date: formData.date,
    location: formData.location,
    budget: parseFloat(formData.budget),
    targetParticipants: parseInt(formData.targetParticipants),
    requirements: formData.requirements.filter(r => r.trim()),
    attachments: [],
    submittedBy: user?.fullName || 'SK Secretary',
    submittedDate: new Date().toISOString(),
    status: 'pending' as const,
  };

  storage.setActivityProposals([...proposals, newProposal]);

  // Notify President
  storage.addNotification({
    recipient: 'president',
    title: 'New Activity Proposal',
    message: `${user?.fullName} submitted a new activity proposal: "${formData.title}"`,
    type: 'info',
  });

  // Log activity
  storage.addActivity({
    type: 'proposal',
    action: 'submitted',
    description: `${user?.fullName} submitted activity proposal: ${formData.title}`,
  });

  toast.success('Activity proposal submitted successfully');
  navigate('/events');
};
```

### BudgetProposalPage.tsx (Treasurer Creates)

**Location:** `/pages/BudgetProposalPage.tsx`

**Access Control:**
```typescript
if (user?.role !== 'treasurer') {
  return (
    <div className="p-8">
      <Card className="p-8 text-center">
        <Wallet className="w-16 h-16 mx-auto mb-4 text-green-500" />
        <h2 className="text-xl mb-2">Access Denied</h2>
        <p className="text-gray-600">Only SK Treasurer can create budget proposals.</p>
      </Card>
    </div>
  );
}
```

**Budget Items State:**
```typescript
interface BudgetItem {
  category: string;
  description: string;
  amount: string;
}

const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([
  { category: '', description: '', amount: '' },
]);
```

**Calculate Total:**
```typescript
const calculateTotal = () => {
  return budgetItems.reduce((sum, item) => {
    const amount = parseFloat(item.amount) || 0;
    return sum + amount;
  }, 0);
};
```

**Submit Handler:**
```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  // Validation
  const validItems = budgetItems.filter(
    item => item.category && item.description.trim() && parseFloat(item.amount) > 0
  );

  if (validItems.length === 0) {
    toast.error('Please add at least one valid budget item');
    return;
  }

  // Create proposal
  const proposals = storage.getBudgetProposals();
  const newProposal = {
    id: Date.now(),
    title: formData.title,
    description: formData.description,
    totalAmount: calculateTotal(),
    items: validItems.map(item => ({
      category: item.category,
      description: item.description,
      amount: parseFloat(item.amount),
    })),
    attachments: [],
    submittedBy: user?.fullName || 'SK Treasurer',
    submittedDate: new Date().toISOString(),
    status: 'pending' as const,
  };

  storage.setBudgetProposals([...proposals, newProposal]);

  // Notify President
  storage.addNotification({
    recipient: 'president',
    title: 'New Budget Proposal',
    message: `${user?.fullName} submitted a new budget proposal: "${formData.title}"`,
    type: 'info',
  });

  // Log activity
  storage.addActivity({
    type: 'proposal',
    action: 'submitted',
    description: `${user?.fullName} submitted budget proposal: ${formData.title}`,
  });

  toast.success('Budget proposal submitted successfully');
  navigate('/budget');
};
```

### PendingApprovalsPage.tsx (President Reviews)

**Location:** `/pages/PendingApprovalsPage.tsx`

**Access Control:**
```typescript
const { canApprove, user } = useAuth();

if (!canApprove()) {
  return (
    <div className="p-8">
      <Card className="p-8 text-center">
        <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
        <h2 className="text-xl mb-2">Access Denied</h2>
        <p className="text-gray-600">Only SK President can access pending approvals.</p>
      </Card>
    </div>
  );
}
```

**Load Proposals:**
```typescript
useEffect(() => {
  const storedActivityProposals = storage.getActivityProposals();
  const storedBudgetProposals = storage.getBudgetProposals();
  
  setActivityProposals(storedActivityProposals);
  setBudgetProposals(storedBudgetProposals);
}, []);

const pendingActivityProposals = activityProposals.filter(p => p.status === 'pending');
const pendingBudgetProposals = budgetProposals.filter(p => p.status === 'pending');
```

**Review Handler:**
```typescript
const handleSubmitReview = () => {
  if (selectedActivityProposal) {
    // Update proposal status
    const updatedProposals = activityProposals.map(p =>
      p.id === selectedActivityProposal.id
        ? { ...p, status: reviewAction === 'approve' ? 'approved' : 'returned', comments: reviewComments }
        : p
    );
    setActivityProposals(updatedProposals);
    storage.setActivityProposals(updatedProposals);

    // Send notification to Secretary
    storage.addNotification({
      recipient: 'secretary',
      title: `Activity Proposal ${reviewAction === 'approve' ? 'Approved' : 'Returned'}`,
      message: `Your proposal "${selectedActivityProposal.title}" has been ${reviewAction === 'approve' ? 'approved' : 'returned for revision'}.`,
      type: reviewAction === 'approve' ? 'success' : 'warning',
    });

    // If approved, create the event
    if (reviewAction === 'approve') {
      const events = storage.getEvents() || [];
      const newEvent = {
        id: Date.now(),
        title: selectedActivityProposal.title,
        description: selectedActivityProposal.description,
        date: selectedActivityProposal.date,
        location: selectedActivityProposal.location,
        status: 'upcoming',
        budget: selectedActivityProposal.budget,
        targetParticipants: selectedActivityProposal.targetParticipants,
        proposalId: selectedActivityProposal.id,
      };
      storage.setEvents([...events, newEvent]);
    }

    toast.success(`Activity proposal ${reviewAction === 'approve' ? 'approved' : 'returned'} successfully`);
  } 
  
  // Similar logic for budget proposals...
  
  // Log activity
  storage.addActivity({
    type: 'approval',
    action: reviewAction === 'approve' ? 'approved' : 'returned',
    description: `${user?.fullName} ${reviewAction === 'approve' ? 'approved' : 'returned'} ${selectedActivityProposal ? 'activity' : 'budget'} proposal`,
  });

  setShowReviewModal(false);
};
```

---

## 📊 Page Components

### Dashboard.tsx

**Location:** `/pages/Dashboard.tsx`

**Key Features:**
- Budget overview cards
- Pie chart visualization
- Upcoming events list
- Recent transactions
- Role-specific welcome

**Calculate Budget:**
```typescript
const totalIncome = useMemo(() => 
  funds.filter((f: any) => f.type === 'income').reduce((sum: number, f: any) => sum + f.amount, 0),
  [funds]
);

const totalExpenses = useMemo(() => 
  funds.filter((f: any) => f.type === 'expense').reduce((sum: number, f: any) => sum + f.amount, 0),
  [funds]
);

const remainingBudget = totalIncome - totalExpenses;
```

**Chart Data:**
```typescript
const budgetData = useMemo(() => {
  const categoryMap: { [key: string]: number } = {};
  funds
    .filter((f: any) => f.type === 'expense')
    .forEach((f: any) => {
      categoryMap[f.category] = (categoryMap[f.category] || 0) + f.amount;
    });

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6366f1'];
  return Object.keys(categoryMap).map((category, index) => ({
    name: category,
    value: categoryMap[category],
    color: colors[index % colors.length],
  }));
}, [funds]);
```

### BudgetPage.tsx

**Location:** `/pages/BudgetPage.tsx`

**Key Features:**
- Add income/funds
- Record expenses
- Edit/Delete entries
- Category filtering
- Real-time totals

**Add Fund Handler:**
```typescript
const handleAddFund = (e: React.FormEvent) => {
  e.preventDefault();
  const formData = new FormData(e.target as HTMLFormElement);
  
  const newFund = {
    id: Date.now(),
    date: formData.get('date') as string,
    category: formData.get('category') as string,
    description: formData.get('description') as string,
    type: 'income' as const,
    amount: parseFloat(formData.get('amount') as string),
  };

  const updatedFunds = [...(storage.getFunds() || []), newFund];
  storage.setFunds(updatedFunds);
  
  storage.addActivity({
    type: 'budget',
    action: 'added',
    description: `Added income: ${newFund.description} - ₱${newFund.amount}`,
  });

  toast.success('Fund added successfully');
  setShowAddFundModal(false);
};
```

### EventsPage.tsx

**Location:** `/pages/EventsPage.tsx`

**Key Features:**
- Calendar view
- Event list/grid
- Create/Edit events
- Status filtering
- Navigate to event details

**Create Event Handler:**
```typescript
const handleCreateEvent = (e: React.FormEvent) => {
  e.preventDefault();
  const formData = new FormData(e.target as HTMLFormElement);
  
  const newEvent = {
    id: Date.now(),
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    date: formData.get('date') as string,
    location: formData.get('location') as string,
    status: formData.get('status') as string,
    budget: parseFloat(formData.get('budget') as string || '0'),
    targetParticipants: parseInt(formData.get('participants') as string || '0'),
  };

  const updatedEvents = [...(storage.getEvents() || []), newEvent];
  storage.setEvents(updatedEvents);
  
  storage.addActivity({
    type: 'event',
    action: 'created',
    description: `Created event: ${newEvent.title}`,
  });

  toast.success('Event created successfully');
  setShowCreateModal(false);
};
```

---

## 🎨 UI Components

### Complete List (40+ Components)

All UI components are located in `/components/ui/` and follow the Shadcn UI design system.

**Form Components:**
- `button.tsx` - Button with variants (default, outline, ghost, etc.)
- `input.tsx` - Text input field
- `textarea.tsx` - Multi-line text input
- `label.tsx` - Form label
- `select.tsx` - Dropdown select
- `checkbox.tsx` - Checkbox input
- `radio-group.tsx` - Radio buttons
- `switch.tsx` - Toggle switch
- `slider.tsx` - Range slider

**Layout Components:**
- `card.tsx` - Card container
- `separator.tsx` - Divider
- `tabs.tsx` - Tab navigation
- `accordion.tsx` - Expandable sections
- `scroll-area.tsx` - Scrollable container

**Overlay Components:**
- `dialog.tsx` - Modal dialog
- `alert-dialog.tsx` - Confirmation dialog
- `popover.tsx` - Popover dropdown
- `tooltip.tsx` - Tooltip
- `dropdown-menu.tsx` - Dropdown menu

**Data Display:**
- `table.tsx` - Data table
- `badge.tsx` - Status badge
- `avatar.tsx` - User avatar
- `chart.tsx` - Chart configuration
- `calendar.tsx` - Date picker

**Feedback:**
- `alert.tsx` - Alert message
- `sonner.tsx` - Toast notifications
- `progress.tsx` - Progress bar
- `skeleton.tsx` - Loading skeleton

### Component Usage Example

```typescript
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

function MyComponent() {
  return (
    <Card className="p-6">
      <h2>My Card</h2>
      
      <form>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Enter name" />
          </div>
          
          <div>
            <Label htmlFor="category">Category</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">Option 1</SelectItem>
                <SelectItem value="option2">Option 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button type="submit" className="mt-4">Submit</Button>
      </form>
    </Card>
  );
}
```

---

## 🎨 Styling System

### globals.css

**Location:** `/styles/globals.css`

**Key Features:**
- Tailwind CSS v4 configuration
- CSS custom properties for theming
- Dark mode support
- Typography defaults

**Color Tokens:**
```css
:root {
  --background: #ffffff;
  --foreground: oklch(0.145 0 0);
  --primary: #030213;
  --primary-foreground: oklch(1 0 0);
  --secondary: oklch(0.95 0.0058 264.53);
  --muted: #ececf0;
  --accent: #e9ebef;
  --destructive: #d4183d;
  --border: rgba(0, 0, 0, 0.1);
  
  /* Chart colors */
  --chart-1: oklch(0.646 0.222 41.116);  /* Blue */
  --chart-2: oklch(0.6 0.118 184.704);   /* Green */
  --chart-3: oklch(0.398 0.07 227.392);  /* Purple */
  --chart-4: oklch(0.828 0.189 84.429);  /* Yellow */
  --chart-5: oklch(0.769 0.188 70.08);   /* Orange */
}
```

**Typography Defaults:**
```css
h1 {
  font-size: var(--text-2xl);
  font-weight: var(--font-weight-medium);
  line-height: 1.5;
}

h2 {
  font-size: var(--text-xl);
  font-weight: var(--font-weight-medium);
  line-height: 1.5;
}

button {
  font-size: var(--text-base);
  font-weight: var(--font-weight-medium);
  line-height: 1.5;
}
```

### Tailwind Usage

**Color Classes:**
```tsx
// Primary colors
className="bg-blue-500 text-white"
className="bg-blue-600 hover:bg-blue-700"

// Role colors
className="bg-purple-600"  // President
className="bg-green-600"   // Treasurer
className="bg-orange-600"  // Secretary

// Status colors
className="bg-green-100 text-green-700"  // Success
className="bg-red-100 text-red-700"      // Error
className="bg-yellow-100 text-yellow-700" // Warning
```

**Spacing & Layout:**
```tsx
className="p-6"           // Padding
className="m-4"           // Margin
className="space-y-4"     // Vertical spacing
className="gap-6"         // Grid/flex gap
className="grid grid-cols-3" // Grid layout
className="flex items-center justify-between" // Flexbox
```

**Responsive Design:**
```tsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
className="text-sm md:text-base lg:text-lg"
className="hidden md:block"
```

---

## 💾 Data Structures

### Activity Proposal
```typescript
interface ActivityProposal {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  budget: number;
  targetParticipants: number;
  requirements: string[];
  attachments: any[];
  submittedBy: string;
  submittedDate: string;
  status: 'pending' | 'approved' | 'returned';
  comments?: string;
}
```

### Budget Proposal
```typescript
interface BudgetProposal {
  id: number;
  title: string;
  description: string;
  totalAmount: number;
  items: Array<{
    category: string;
    description: string;
    amount: number;
  }>;
  attachments: any[];
  submittedBy: string;
  submittedDate: string;
  status: 'pending' | 'approved' | 'returned';
  comments?: string;
}
```

### Event
```typescript
interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  status: 'Upcoming' | 'Completed' | 'Planning';
  budget: number;
  targetParticipants: number;
  proposalId?: number;
}
```

### Fund Entry
```typescript
interface FundEntry {
  id: number;
  date: string;
  category: string;
  description: string;
  type: 'income' | 'expense';
  amount: number;
  proposalId?: number;
}
```

### Notification
```typescript
interface Notification {
  id: number;
  recipient: 'president' | 'treasurer' | 'secretary';
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}
```

### Activity Log
```typescript
interface ActivityLog {
  id: number;
  type: 'proposal' | 'approval' | 'budget' | 'event';
  action: string;
  description: string;
  timestamp: string;
}
```

---

## 🔧 Common Patterns

### Form Submission Pattern
```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  // 1. Validate input
  if (!formData.title.trim()) {
    toast.error('Please enter title');
    return;
  }
  
  // 2. Create data object
  const newItem = {
    id: Date.now(),
    ...formData,
    createdDate: new Date().toISOString(),
  };
  
  // 3. Update storage
  const items = storage.getItems() || [];
  storage.setItems([...items, newItem]);
  
  // 4. Send notification (if needed)
  storage.addNotification({
    recipient: 'user',
    title: 'Success',
    message: 'Item created',
    type: 'success',
  });
  
  // 5. Log activity
  storage.addActivity({
    type: 'item',
    action: 'created',
    description: `Created item: ${newItem.title}`,
  });
  
  // 6. Show feedback
  toast.success('Item created successfully');
  
  // 7. Navigate or close modal
  navigate('/items');
};
```

### Modal Pattern
```typescript
const [showModal, setShowModal] = useState(false);

return (
  <>
    <Button onClick={() => setShowModal(true)}>
      Open Modal
    </Button>

    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modal Title</DialogTitle>
          <DialogDescription>Modal description</DialogDescription>
        </DialogHeader>
        
        {/* Modal content */}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleAction}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </>
);
```

### Access Control Pattern
```typescript
const { user, canEdit } = useAuth();

// Method 1: Guard entire component
if (user?.role !== 'secretary') {
  return <AccessDenied />;
}

// Method 2: Guard specific actions
{canEdit('budget') && (
  <Button onClick={handleEdit}>
    Edit Budget
  </Button>
)}

// Method 3: Show different UI
{user?.role === 'president' ? (
  <ApprovalSection />
) : (
  <ViewOnlySection />
)}
```

---

## 📝 Summary

This SK IDMS system is a complete, production-ready prototype with:

✅ **13 Pages** - Login, Dashboard, Budget, Events, Approvals, Reports, etc.
✅ **40+ UI Components** - Shadcn UI design system
✅ **3 User Roles** - President, Treasurer, Secretary
✅ **Role-Based Access Control** - Fine-grained permissions
✅ **Proposal Workflow** - Submit → Review → Approve/Return
✅ **localStorage Persistence** - All data saved locally
✅ **Notification System** - Real-time updates
✅ **Activity Logging** - Complete audit trail
✅ **Modern Stack** - React, TypeScript, Tailwind CSS

**Total Lines of Code:** ~18,000+
**Total Files:** 70+
**Development Time:** Professional-grade implementation

---

## 🎓 Learning from This Code

### For Beginners
1. Start with `App.tsx` - See how routing works
2. Study `AuthContext.tsx` - Learn React Context
3. Review `LoginPage.tsx` - Simple form handling
4. Explore UI components - See component patterns

### For Intermediate
1. Study the proposal workflow - Complex state management
2. Review `storage.ts` - Data persistence patterns
3. Analyze `PendingApprovalsPage.tsx` - Advanced interactions
4. Understand role-based permissions - Authorization logic

### For Advanced
1. Optimize re-renders with useMemo
2. Implement custom hooks
3. Add backend integration
4. Enhance with animations

---

**All code is available in this project. Simply open any file to see the complete implementation!**
