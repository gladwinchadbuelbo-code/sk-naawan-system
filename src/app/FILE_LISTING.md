# 📂 Complete File Listing - SK IDMS

## 📊 Project Statistics
- **Total Files:** 70+
- **Main Application Files:** 20+
- **UI Component Files:** 40+
- **Total Lines of Code:** ~18,000+
- **TypeScript/React:** 100%

---

## 🗂️ Directory Structure with File Descriptions

### 📁 `/` (Root)
```
App.tsx                          - Main app with routing configuration
```

### 📁 `/contexts/`
```
AuthContext.tsx                  - Authentication & role-based permissions
                                  • 3 user roles (President/Treasurer/Secretary)
                                  • Login/logout functions
                                  • Permission checks (canEdit, canApprove)
```

### 📁 `/utils/`
```
storage.ts                       - localStorage utility functions
                                  • Get/Set events, funds, proposals
                                  • Notification management
                                  • Activity logging
                                  • Export/import data
```

### 📁 `/pages/` (13 Application Pages)
```
LoginPage.tsx                    - Authentication page
                                  • 3 demo accounts
                                  • Form validation
                                  • Session persistence

Dashboard.tsx                    - Main dashboard
                                  • Role-specific welcome
                                  • Budget overview cards
                                  • Pie charts
                                  • Upcoming events
                                  • Recent transactions

BudgetPage.tsx                   - Budget management
                                  • View income/expenses
                                  • Add/Edit/Delete entries
                                  • Real-time totals
                                  • Category filtering

BudgetProposalPage.tsx          - Create budget proposals (Treasurer)
                                  • Dynamic budget items
                                  • Category selection
                                  • Auto-calculate totals
                                  • Submit for approval

EventsPage.tsx                   - Events management
                                  • Calendar view
                                  • Event list/grid
                                  • Create/Edit events
                                  • Status tracking

ActivityProposalPage.tsx        - Create activity proposals (Secretary)
                                  • Event details form
                                  • Budget requirements
                                  • Dynamic requirements list
                                  • Submit for approval

PendingApprovalsPage.tsx        - Review proposals (President) ⭐
                                  • Tabs for Activity & Budget
                                  • Approve with comments
                                  • Return for revision
                                  • Auto-create events/budget
                                  • Notification system

EventDetailsPage.tsx            - Single event view
                                  • Event information
                                  • Attendance link
                                  • Document uploads
                                  • Status updates

AttendanceTrackingPage.tsx      - Event attendance
                                  • Add attendees
                                  • Mark presence
                                  • Age group tracking
                                  • Export attendance sheet

ReportsPage.tsx                 - Reports hub
                                  • Liquidation reports
                                  • Accomplishment reports
                                  • Documentation packets
                                  • Custom templates

LiquidationReportPage.tsx       - Financial reports
                                  • Event-based financial accounting
                                  • Income/expense breakdown
                                  • COA-compliant format
                                  • Export functionality

AccomplishmentReportPage.tsx    - Activity reports
                                  • Event summary
                                  • Objectives & outcomes
                                  • Participant statistics
                                  • LYDO-compliant format

DocumentationPacketPage.tsx     - Document compilation
                                  • Photo gallery
                                  • Document attachments
                                  • Activity documentation
                                  • Package generator

TemplateEditorPage.tsx          - Custom report builder
                                  • Drag-drop blocks
                                  • Title, text, table, chart blocks
                                  • Save custom templates
                                  • Template library

SettingsPage.tsx                - App settings
                                  • User preferences
                                  • Data export/import
                                  • Clear all data
                                  • System info

ActivityLogPage.tsx             - System audit trail
                                  • All user actions
                                  • Filter by type/action
                                  • Timestamp tracking
                                  • Export logs
```

### 📁 `/components/` (Helper Components)
```
Layout.tsx                       - Main layout wrapper
                                  • Collapsible sidebar
                                  • Navigation menu
                                  • User profile card
                                  • Logout button

ProtectedRoute.tsx              - Authentication guard
                                  • Check login status
                                  • Redirect to login
                                  • Wrap protected pages

RoleCapabilitiesCard.tsx        - Role info display
                                  • Show user permissions
                                  • Role-specific features
                                  • Access control info

NotificationBell.tsx            - Notification dropdown
                                  • Unread count badge
                                  • Notification list
                                  • Mark as read
                                  • Real-time updates

ConfirmDialog.tsx               - Confirmation modal
                                  • Delete confirmations
                                  • Action confirmations
                                  • Custom messages

EmptyState.tsx                  - Empty state component
                                  • No data placeholder
                                  • Call-to-action
                                  • Custom icons/messages

LoadingState.tsx                - Loading spinner
                                  • Loading animations
                                  • Progress indicators

DataTable.tsx                   - Reusable data table
                                  • Sorting
                                  • Filtering
                                  • Pagination

SearchBar.tsx                   - Search component
                                  • Real-time search
                                  • Debounced input
                                  • Clear button

ExportPDFButton.tsx             - PDF export
                                  • Export reports
                                  • Print functionality

PrintButton.tsx                 - Print component
                                  • Print current page
                                  • Print preview

PermissionInfo.tsx              - Permission tooltip
                                  • Show required role
                                  • Access denied message

RestrictedActionTooltip.tsx     - Action restriction
                                  • Disable unavailable actions
                                  • Show permission requirement
```

### 📁 `/components/ui/` (40+ Shadcn UI Components)

#### 🔘 Form Components
```
button.tsx                       - Button component with variants
input.tsx                        - Text input field
textarea.tsx                     - Multi-line text input
label.tsx                        - Form label
select.tsx                       - Dropdown select
checkbox.tsx                     - Checkbox input
radio-group.tsx                  - Radio button group
switch.tsx                       - Toggle switch
slider.tsx                       - Range slider
```

#### 📦 Layout Components
```
card.tsx                         - Card container
separator.tsx                    - Horizontal divider
accordion.tsx                    - Expandable sections
collapsible.tsx                  - Collapsible content
tabs.tsx                         - Tab navigation
sheet.tsx                        - Slide-over panel
sidebar.tsx                      - Sidebar component
aspect-ratio.tsx                 - Aspect ratio container
resizable.tsx                    - Resizable panels
scroll-area.tsx                  - Scrollable container
```

#### 💬 Overlay Components
```
dialog.tsx                       - Modal dialog
alert-dialog.tsx                 - Alert/confirmation dialog
popover.tsx                      - Popover dropdown
tooltip.tsx                      - Tooltip
hover-card.tsx                   - Hover card
dropdown-menu.tsx                - Dropdown menu
context-menu.tsx                 - Right-click menu
command.tsx                      - Command palette
drawer.tsx                       - Bottom drawer
menubar.tsx                      - Menu bar
navigation-menu.tsx              - Navigation menu
```

#### 📊 Data Display Components
```
table.tsx                        - Data table
badge.tsx                        - Badge/tag
avatar.tsx                       - User avatar
progress.tsx                     - Progress bar
chart.tsx                        - Chart configuration
calendar.tsx                     - Date picker calendar
carousel.tsx                     - Image carousel
```

#### 🎨 Feedback Components
```
alert.tsx                        - Alert message
sonner.tsx                       - Toast notifications
skeleton.tsx                     - Loading skeleton
```

#### 🔧 Utility Components
```
form.tsx                         - Form wrapper (React Hook Form)
pagination.tsx                   - Pagination controls
breadcrumb.tsx                   - Breadcrumb navigation
toggle.tsx                       - Toggle button
toggle-group.tsx                 - Toggle button group
input-otp.tsx                    - OTP input field
```

#### 🛠️ Utilities
```
use-mobile.ts                    - Mobile detection hook
utils.ts                         - Utility functions (cn, etc.)
```

### 📁 `/components/figma/`
```
ImageWithFallback.tsx           - Image component with fallback
                                  • Protected system file
                                  • Error handling
                                  • Placeholder on error
```

### 📁 `/styles/`
```
globals.css                      - Global styles & Tailwind config
                                  • CSS variables
                                  • Color tokens
                                  • Typography settings
                                  • Dark mode support
                                  • Tailwind v4 configuration
```

### 📁 `/guidelines/` (Documentation)
```
Guidelines.md                    - Development guidelines
```

### 📁 Root Documentation Files
```
COMPLETE_CODE_REFERENCE.md      - Complete system documentation
FILE_LISTING.md                 - This file
SYSTEM_OVERVIEW.md              - System overview
FEATURES.md                     - Feature list
ROLE_BASED_ACCESS.md            - Role permissions guide
SYSTEM_ACTORS_GUIDE.md          - User role guide
USER_GUIDE.md                   - User manual
USE_CASE_ALIGNMENT.md           - Use cases
DIAGRAM_COMPLIANCE_SUMMARY.md   - Compliance documentation
Attributions.md                 - Credits
README.md                       - Project readme
```

---

## 📊 File Size Breakdown (Estimated)

### Large Files (500+ lines)
```
PendingApprovalsPage.tsx        - 456 lines
BudgetProposalPage.tsx          - 304 lines
ActivityProposalPage.tsx        - 292 lines
Dashboard.tsx                   - ~400 lines
BudgetPage.tsx                  - ~520 lines
EventsPage.tsx                  - ~480 lines
LiquidationReportPage.tsx       - ~600 lines
AccomplishmentReportPage.tsx    - ~550 lines
```

### Medium Files (100-500 lines)
```
AuthContext.tsx                 - 136 lines
Layout.tsx                      - 154 lines
storage.ts                      - 129 lines
LoginPage.tsx                   - 112 lines
EventDetailsPage.tsx            - ~350 lines
AttendanceTrackingPage.tsx      - ~300 lines
ReportsPage.tsx                 - ~250 lines
TemplateEditorPage.tsx          - ~450 lines
```

### Small Files (< 100 lines)
```
App.tsx                         - 53 lines
ProtectedRoute.tsx              - 14 lines
All UI components               - 20-100 lines each
```

---

## 🎯 Key File Relationships

### Authentication Flow
```
App.tsx
  → AuthProvider (AuthContext.tsx)
    → LoginPage.tsx
      → Set user session
    → ProtectedRoute.tsx
      → Check authentication
      → Layout.tsx
        → All protected pages
```

### Proposal Workflow
```
Secretary Login
  → ActivityProposalPage.tsx
    → storage.setActivityProposals()
    → storage.addNotification() → President

President Login
  → PendingApprovalsPage.tsx
    → Review proposals
    → Approve: storage.setEvents()
    → Return: Update status
    → storage.addNotification() → Secretary
```

### Budget Management
```
Treasurer Login
  → BudgetProposalPage.tsx
    → storage.setBudgetProposals()
    → storage.addNotification() → President

President Login
  → PendingApprovalsPage.tsx
    → Approve: storage.setFunds()
    → Budget added to BudgetPage.tsx
```

### Data Flow
```
User Action
  → Page Component (e.g., BudgetPage.tsx)
    → storage.ts functions
      → localStorage
        → Data persisted
          → Other components read
            → UI updates
```

---

## 🔍 Finding Specific Features

### Want to see login logic?
→ `/pages/LoginPage.tsx`
→ `/contexts/AuthContext.tsx`

### Want to see proposal creation?
→ `/pages/ActivityProposalPage.tsx`
→ `/pages/BudgetProposalPage.tsx`

### Want to see approval logic?
→ `/pages/PendingApprovalsPage.tsx` (lines 97-177)

### Want to see data persistence?
→ `/utils/storage.ts`

### Want to see routing?
→ `/App.tsx`

### Want to see sidebar navigation?
→ `/components/Layout.tsx`

### Want to see UI components?
→ `/components/ui/` (any component)

### Want to see notification system?
→ `/utils/storage.ts` (addNotification function)
→ `/components/NotificationBell.tsx`

---

## 🎨 Styling System

### Global Styles
- File: `/styles/globals.css`
- Framework: Tailwind CSS v4
- Components: Shadcn UI design system
- Colors: CSS custom properties
- Typography: Default system fonts

### Color Palette
```css
Primary:   Blue (#2563eb, #1d4ed8)
Success:   Green (#10b981, #059669)
Warning:   Orange (#f59e0b, #d97706)
Error:     Red (#ef4444, #dc2626)
Purple:    Purple (#8b5cf6, #7c3aed)
```

### Role Colors
```css
President:  Purple (#8b5cf6)
Treasurer:  Green (#10b981)
Secretary:  Orange (#f59e0b)
```

---

## 📦 Dependencies

### Core
- react
- react-dom
- react-router-dom
- typescript

### UI & Styling
- tailwindcss
- lucide-react (icons)
- recharts (charts)
- sonner (toasts)
- react-hook-form

### Utilities
- date-fns (date manipulation)
- clsx (class names)
- tailwind-merge (merge classes)

---

## 🚀 Entry Points

### Main Entry
```
index.html → main.tsx → App.tsx → AuthProvider → Router → Pages
```

### First Page User Sees
```
LoginPage.tsx (if not authenticated)
Dashboard.tsx (if authenticated)
```

### Protected Page Access
```
URL → ProtectedRoute.tsx → Check auth → Layout.tsx → Actual Page
```

---

## 💡 Tips for Navigating the Code

1. **Start with App.tsx** - See all routes
2. **Check AuthContext.tsx** - Understand permissions
3. **Review storage.ts** - See data structure
4. **Open PendingApprovalsPage.tsx** - Core approval logic
5. **Browse /components/ui/** - Available components
6. **Read COMPLETE_CODE_REFERENCE.md** - Full documentation

---

## 🔧 Modifying the System

### Add a new page
1. Create file in `/pages/`
2. Add route in `App.tsx`
3. Add navigation in `Layout.tsx` (if needed)

### Add a new feature
1. Update data structure in `storage.ts`
2. Create/modify page component
3. Update permissions in `AuthContext.tsx` (if role-based)

### Add a new role
1. Update `UserRole` type in `AuthContext.tsx`
2. Add credentials in `DEMO_USERS`
3. Update permission functions
4. Update role colors in `Layout.tsx`

### Change styling
1. Modify `/styles/globals.css` for global changes
2. Use Tailwind classes in components
3. Update color tokens in CSS variables

---

## 📝 Code Quality

- ✅ TypeScript for type safety
- ✅ Consistent component structure
- ✅ Reusable UI components
- ✅ Modular architecture
- ✅ Clear naming conventions
- ✅ Comprehensive comments
- ✅ Error handling
- ✅ Input validation

---

## 🎓 Learning Resources

### Understand React concepts:
- Components, Props, State
- Hooks (useState, useEffect, useMemo)
- Context API (AuthContext)
- React Router (navigation)

### Understand TypeScript:
- Interfaces (User, Proposal types)
- Type annotations
- Optional properties (?)
- Union types (|)

### Understand Tailwind CSS:
- Utility classes
- Responsive design (md:, lg:)
- Custom colors
- Spacing system

---

**This file listing provides a complete map of the SK IDMS codebase. Use it as a reference guide to navigate and understand the system architecture.**
