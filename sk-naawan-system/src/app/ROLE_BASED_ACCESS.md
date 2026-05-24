# Role-Based Access Control (RBAC) System

## Overview

The Integrated Digital Management System for SK Activities, Budget Transparency, and Reporting implements a role-based access control system with three distinct user roles: **Chairperson**, **Treasurer**, and **Secretary**.

## User Roles and Credentials

### Demo Credentials

| Role | Username | Password | Full Name |
|------|----------|----------|-----------|
| Chairperson | `chairperson` | `chairperson123` | SK Chairperson |
| Treasurer | `treasurer` | `treasurer123` | SK Treasurer |
| Secretary | `secretary` | `secretary123` | SK Secretary |

## Role Permissions

### SK Chairperson
**Full System Oversight**

- ✅ View all modules (Dashboard, Budget, Events, Reports)
- ✅ Review all budget, events, and reports
- ✅ **Approve all reports**
- ✅ Generate all report types
- ✅ Full access to all documentation and templates
- ✅ Access to activity logs and settings
- ✅ System-wide oversight and approval authority

**Use Case:** Overall management and oversight of all SK activities, budget, and reporting. Primary approval authority for all reports.

---

### SK Treasurer
**Budget and Financial Management Focus**

- ✅ View all modules (Dashboard, Budget, Events, Reports)
- ✅ **Add income and record expenses**
- ✅ **Full access to Budget Management** (create, edit, delete)
- ✅ **Full access to Liquidation Reports** (create, edit, generate)
- 👁️ **View-only access to Accomplishment Reports**
- 👁️ **View-only access to Events** (cannot edit)
- ✅ Upload receipts and financial documents
- ✅ Access to budget analytics and reports

**Use Case:** Handles all financial transactions, budget tracking, and COA-compliant liquidation reporting.

---

### SK Secretary
**Events and Documentation Focus**

- ✅ View all modules (Dashboard, Budget, Events, Reports)
- ✅ **Create, edit, and manage events**
- ✅ **Track attendance**
- ✅ **Full access to Accomplishment Reports** (create, edit, generate)
- 👁️ **View-only access to Liquidation Reports**
- 👁️ **View-only access to Budget** (cannot edit)
- ✅ Upload photos, attendance sheets, and event documentation
- ✅ Manage event documentation and summaries

**Use Case:** Handles event management, attendance tracking, accomplishment reporting, and LYDO/NYC documentation.

---

## Permission Matrix

| Feature | Chairperson | Treasurer | Secretary |
|---------|-------------|-----------|-----------|
| Dashboard | Full Access | View All | View All |
| Budget Management | Full Access | Full Access | View Only |
| Events Management | Full Access | View Only | Full Access |
| Liquidation Reports | Full Access | Full Access | View Only |
| Accomplishment Reports | Full Access | View Only | Full Access |
| Approve Reports | ✅ Yes | ❌ No | ❌ No |
| Documentation Packets | Full Access | View All | Full Access |
| Settings | Full Access | Full Access | Full Access |
| Activity Logs | Full Access | Full Access | Full Access |

## System Features

### Authentication
- Separate login credentials for each role
- Session persistence using localStorage
- Automatic redirect if already authenticated
- Secure logout functionality

### Visual Indicators
- **Role badges** in sidebar showing current user's role
- **Permission badges** on report pages (green "Can Edit" or gray "View Only")
- **Color-coded role icons**:
  - President: Purple
  - Treasurer: Green
  - Secretary: Orange
- **Permission info cards** showing user's access level

### Access Control
- Edit buttons hidden for view-only users
- Upload functionality restricted based on role
- Report creation limited to authorized roles
- All users can view all data for transparency

## Implementation Notes

### Context Provider
The system uses React Context (`AuthContext`) to manage:
- Current user state
- Login/logout functions
- Permission checking (`canEdit` function)
- User session persistence

### Protected Routes
All application routes are wrapped in `ProtectedRoute` component that:
- Checks authentication status
- Redirects to login if not authenticated
- Provides access to authenticated pages

### Permission Checking
Use the `canEdit` function to check permissions:

```tsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { canEdit } = useAuth();
  
  const canEditLiquidation = canEdit('liquidation');
  const canEditAccomplishment = canEdit('accomplishment');
  const canEditBudget = canEdit('budget');
  const canEditEvent = canEdit('event');
  
  // Use these booleans to show/hide UI elements
}
```

## User Experience

### For All Users
- Transparent access to all data
- Clear visual indicators of permissions
- Consistent navigation across all roles
- Toast notifications for actions

### For Limited-Access Users
- View-only badges clearly displayed
- Edit buttons hidden (not just disabled)
- Helpful permission info cards
- Access to view and download all reports

## Security Notes

⚠️ **Important:** This is a localStorage-based demo system for prototyping purposes.

For production use:
- Implement proper backend authentication
- Use JWT tokens or session cookies
- Add role verification on the server side
- Implement proper password hashing
- Add rate limiting and security headers
- Use HTTPS in production

## Data Persistence

Currently uses localStorage for:
- User authentication state
- User profile information
- All application data (events, budget, reports)

**Note:** Data is stored locally in the browser and is not shared across devices or users.
