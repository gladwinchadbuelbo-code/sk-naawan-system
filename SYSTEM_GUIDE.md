# SK Naawan Information Management System - User Guide

## System Overview
The SK Naawan Information Management System (IMS) is a comprehensive web application for managing Sangguniang Kabataan activities, budget transparency, and reporting in Naawan.

## Features
- **Dashboard**: Overview of funds, expenses, balance, and upcoming events
- **Budget Management**: Track income and expenses with receipt uploads
- **Event Management**: Plan, organize, and track SK activities
- **Proposal System**: Submit and approve activity and budget proposals
- **Reports**: Generate liquidation and accomplishment reports
- **Archives**: View historical events and budget data
- **Public Portal**: Transparent view of SK activities for constituents

## Login Credentials

### Chairperson Account
- **Username**: `president`
- **Password**: `president`
- **Permissions**: Full access, can approve all proposals

### Treasurer Account
- **Username**: `treasurer`
- **Password**: `treasurer`
- **Permissions**: Budget management, create budget proposals, record expenses

### Secretary Account
- **Username**: `secretary`
- **Password**: `secretary`
- **Permissions**: Event management, create activity proposals

## User Roles & Responsibilities

### SK Chairperson (President)
- Review and approve/reject activity proposals from Secretary
- Review and approve/reject budget proposals from Treasurer
- Full oversight of all system activities
- Access to all reports and data

### SK Treasurer
- Manage SK funds and budget
- Record income and expenses
- Upload receipts for transactions
- Create and submit budget proposals for approval
- Track budget proposal status (pending/approved/returned)
- Generate budget reports

### SK Secretary
- Create and manage events
- Submit activity proposals for approval
- Track proposal status (pending/approved/returned)
- Upload event documents (photos, attendance, receipts)
- Generate accomplishment reports
- Manage event calendar

## Key Workflows

### Activity Proposal Flow
1. Secretary creates activity proposal with project details, objectives, and budget
2. System notifies Chairperson of new proposal
3. Chairperson reviews and either approves or returns with comments
4. If approved, event is automatically created in the system
5. Secretary can track proposal status in "My Proposals"

### Budget Proposal Flow
1. Treasurer creates budget proposal with budget items and amounts
2. System notifies Chairperson of new proposal
3. Chairperson reviews and either approves or returns with feedback
4. If approved, funds are allocated to the budget
5. Treasurer can track proposal status in "My Budget Proposals"

### Event Management Flow
1. Secretary creates event (either from approved proposal or manually)
2. Event appears in calendar and event list
3. Secretary can upload documents during/after event
4. Secretary can manage attendance via QR code or manual entry
5. After completion, generate accomplishment report

### Budget Management Flow
1. Treasurer records income from various sources
2. Treasurer records expenses with OR numbers and receipts
3. System automatically calculates remaining budget
4. All transactions appear in budget table with zebra-striped rows
5. Generate liquidation reports for transparency

## System Features

### Dashboard
- Real-time summary cards showing:
  - Total Funds Received (Emerald Green)
  - Total Expenses (Soft Red)
  - Balance (Mint Green)
  - Upcoming Events count
- Quick Action buttons based on user role
- Empty states for zero-data (May 2026)

### Budget Page
- Summary cards with color-coded totals
- Searchable and filterable transactions table
- Add Fund and Record Expense modals
- Receipt upload functionality (PDF, JPG, PNG up to 5MB)
- Status badges: Mint Green for Income, Soft Red for Expense
- Archive functionality for old transactions

### Events Page
- Calendar view with monthly navigation
- Summary cards showing event counts by status
- Filterable event list with zebra-striping
- Status badges: Emerald for Upcoming, Mint for Completed, Amber for Planning, Red for Cancelled
- Link events to approved budget proposals
- QR code generation for attendance tracking

### Reports
- Liquidation Reports (Treasurer)
- Accomplishment Reports (Secretary)
- Documentation Packets
- Custom report templates

### Archives
- View archived events
- View archived budget entries
- Restore functionality for archived items

### Public Portal
- Public-facing transparency portal at `/public`
- View all SK activities without login
- Budget transparency
- Calendar of events
- Search functionality

## Design Theme: Eco-Trust Professional

### Color Palette
- **Primary**: #059669 (Emerald Green) - Main actions and active states
- **Secondary**: #10B981 (Mint Green) - Success indicators
- **Danger**: #EF4444 (Soft Red) - Expenses and errors
- **Warning**: #F59E0B (Amber) - Pending/Planning status
- **Background**: #F9FAFB (Off-White) - Reduces eye strain
- **Dark**: #111827 (Deep Navy) - Sidebar and headers

### UI Elements
- Rounded corners: 12px (rounded-xl) on all cards and buttons
- Sidebar: Dark Navy (#111827) with Emerald Green icons
- Tables: Zebra-striped for improved readability
- Empty states: Light grey text (#9CA3AF)
- Font: Inter (professional sans-serif)

## Data Persistence
- All data stored in browser localStorage
- Data persists between sessions
- Export/Import functionality available in Settings
- Zero-data state by default (May 2026)

## Security Features
- Role-based access control
- Permission checks on all sensitive operations
- Activity logging for audit trail
- Secure file upload validation

## Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Responsive design for desktop and tablet
- Mobile-friendly interface

## Technical Stack
- React 18.3.1
- TypeScript
- Tailwind CSS 4.1.12
- React Router 7.15.0
- Lucide React icons
- Recharts for data visualization
- LocalStorage for data persistence

## Support & Maintenance
- System designed for easy maintenance
- Clear code structure with TypeScript
- Comprehensive error handling
- Toast notifications for user feedback

## Getting Started
1. Open the application in your web browser
2. Click "Login" on the landing page
3. Enter credentials for your role (see Login Credentials above)
4. Navigate using the sidebar menu
5. Start with Dashboard to see overview
6. Use Quick Actions for common tasks

## Best Practices
- Record all budget transactions with receipts
- Submit proposals with complete information
- Review proposals promptly to avoid delays
- Generate reports regularly for transparency
- Archive old data to keep system organized
- Export data periodically for backup

## Notes
- First day of the month (May 2026) shows zero state
- All monetary values in Philippine Pesos (₱)
- Dates in MM/DD/YYYY format
- File uploads limited to 5MB
- QR codes generated for each event for attendance

---

**System Version**: 1.0.0  
**Last Updated**: May 2026  
**Contact**: SK Naawan IMS Support
