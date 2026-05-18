# System Actors Guide

## Overview
This guide provides a comprehensive overview of the three system actors and their workflows in the **Integrated Digital Management System for SK Activities, Budget Transparency, and Reporting**.

---

## 🟠 Actor 1: SK Secretary

### Profile
- **Primary Role**: Event and Program Coordinator
- **Username**: `secretary`
- **Password**: `secretary`
- **Badge Color**: Orange
- **Icon**: FileEdit

### Core Responsibilities
1. Plan and organize SK events and programs
2. Track attendance at all events
3. Upload and manage event documentation
4. Generate accomplishment reports
5. Submit reports to Chairperson for approval

### Primary Workflows

#### Workflow 1: Create and Manage Event
```
1. Log in as Secretary
2. Navigate to Events & Programs page
3. Click "Create Event" button
4. Fill in event details:
   - Event title
   - Date and time
   - Venue
   - Budget allocation
   - Assigned officials
   - Description
5. Click "Save Event"
6. Event appears in calendar and event list
```

#### Workflow 2: Track Event Attendance
```
1. Navigate to Events page
2. Click "Track Attendance" on an event
3. Options:
   a. Manually add attendees one by one
   b. Upload attendance sheet (Excel/CSV)
4. Mark present/absent
5. Save attendance record
6. Generate attendance summary
```

#### Workflow 3: Upload Event Documentation
```
1. Navigate to Event Details page
2. Click "Upload Documents" button
3. Select files:
   - Event photos
   - Attendance sheets
   - Supporting documents
4. Add descriptions/captions
5. Upload files
6. Files appear in documentation section
```

#### Workflow 4: Generate Accomplishment Report
```
1. Navigate to Reports page
2. Select "Accomplishment Reports" tab
3. Click "Create Report" button
4. Fill in report details:
   - Select event
   - Event objectives
   - Activities timeline
   - Participant statistics
   - Outputs and outcomes
5. Upload photos and documentation
6. Preview report
7. Generate PDF/Word
8. Submit for Chairperson approval
```

### Access Permissions
| Module | Permission | Notes |
|--------|------------|-------|
| Events Management | ✅ Full Access | Create, edit, delete events |
| Attendance Tracking | ✅ Full Access | Add attendees, upload sheets |
| Event Documentation | ✅ Full Access | Upload photos, files |
| Accomplishment Reports | ✅ Full Access | Create, edit, generate |
| Budget Management | 👁️ View Only | Cannot add/edit budget |
| Liquidation Reports | 👁️ View Only | Cannot create/edit |
| Report Approval | ❌ No Access | Cannot approve reports |

### Daily Use Cases
- Creating monthly SK meetings
- Organizing youth programs and activities
- Tracking participation in events
- Documenting event outcomes
- Preparing accomplishment reports for submission

---

## 🟢 Actor 2: SK Treasurer

### Profile
- **Primary Role**: Financial Manager
- **Username**: `treasurer`
- **Password**: `treasurer`
- **Badge Color**: Green
- **Icon**: Wallet2

### Core Responsibilities
1. Manage SK budget and financial records
2. Record all income and expenses
3. Upload receipts and financial documents
4. Generate liquidation reports
5. Ensure COA compliance
6. Submit financial reports to Chairperson

### Primary Workflows

#### Workflow 1: Add Income/Fund Entry
```
1. Log in as Treasurer
2. Navigate to Budget Management page
3. Click "Add Fund" button
4. Fill in fund details:
   - Date received
   - Category (e.g., Barangay Allocation, Donations)
   - Amount
   - Description/Remarks
5. Click "Save"
6. Income appears in budget table
7. Summary cards update automatically
```

#### Workflow 2: Record Expense
```
1. Navigate to Budget Management page
2. Click "Record Expense" button
3. Fill in expense details:
   - Date of expense
   - Category (e.g., Event Supplies, Transportation)
   - Description
   - Amount
   - Supplier name
   - OR (Official Receipt) Number
4. Click "Save"
5. Expense appears in budget table
6. Remaining budget updates
```

#### Workflow 3: Upload Financial Documents
```
1. Navigate to Budget page or Liquidation Report
2. Click "Upload Receipts" button
3. Select receipt/OR images or PDFs
4. Link receipts to specific expenses
5. Add notes if needed
6. Save uploads
7. Receipts appear in document viewer
```

#### Workflow 4: Generate Liquidation Report
```
1. Navigate to Reports page
2. Select "Liquidation Reports" tab
3. Click "Create Report" button
4. Fill in liquidation details:
   - Select event or period
   - Approved budget vs actual spending
   - Itemized expense breakdown
   - Upload receipts
   - Attach attendance sheets
5. Add variance explanations
6. Preview report
7. Generate PDF/Excel
8. Submit to Chairperson for approval
```

### Access Permissions
| Module | Permission | Notes |
|--------|------------|-------|
| Budget Management | ✅ Full Access | Add income, record expenses |
| Liquidation Reports | ✅ Full Access | Create, edit, generate |
| Financial Documents | ✅ Full Access | Upload receipts, ORs |
| Budget Analytics | ✅ Full Access | View charts, summaries |
| Events Management | 👁️ View Only | Cannot create/edit events |
| Accomplishment Reports | 👁️ View Only | Cannot create/edit |
| Report Approval | ❌ No Access | Cannot approve reports |

### Daily Use Cases
- Recording daily expenses with ORs
- Tracking barangay fund allocations
- Monitoring budget vs actual spending
- Preparing monthly liquidation reports
- Ensuring all receipts are properly documented

---

## 🟣 Actor 3: SK Chairperson

### Profile
- **Primary Role**: System Overseer & Approver
- **Username**: `president`
- **Password**: `president`
- **Badge Color**: Purple
- **Icon**: User

### Core Responsibilities
1. Oversee all SK activities and operations
2. Review all budget transactions
3. Review all events and programs
4. **Approve all reports** (Liquidation & Accomplishment)
5. Generate consolidated reports
6. Monitor system-wide activities
7. Make final decisions on submissions

### Primary Workflows

#### Workflow 1: Review System Dashboard
```
1. Log in as Chairperson
2. View Dashboard overview:
   - Total budget status
   - Upcoming events
   - Pending reports for approval
   - Recent activities
3. Identify items requiring attention
4. Navigate to specific modules
```

#### Workflow 2: Review and Approve Liquidation Report
```
1. Navigate to Reports page
2. Select "Liquidation Reports" tab
3. View pending reports (submitted by Treasurer)
4. Click on report to review:
   - Check budget vs actual
   - Verify all expenses have receipts
   - Review variance explanations
   - Check COA compliance
5. Options:
   a. Approve → Add signature → Mark as approved
   b. Request revisions → Add comments → Return to Treasurer
6. Generate final approved version (PDF)
```

#### Workflow 3: Review and Approve Accomplishment Report
```
1. Navigate to Reports page
2. Select "Accomplishment Reports" tab
3. View pending reports (submitted by Secretary)
4. Click on report to review:
   - Verify event details
   - Check attendance records
   - Review outputs and outcomes
   - Examine photo documentation
5. Options:
   a. Approve → Add signature → Mark as approved
   b. Request revisions → Add comments → Return to Secretary
6. Generate final approved version (PDF/Word)
```

#### Workflow 4: Generate Consolidated Reports
```
1. Navigate to Reports page
2. Select "Documentation Packet" tab
3. Choose reporting period (e.g., Quarter 1 2025)
4. System generates packet including:
   - All approved liquidation reports
   - All approved accomplishment reports
   - Budget summary
   - Event summary
   - Photo documentation
5. Review packet
6. Generate final ZIP file for submission
```

#### Workflow 5: Monitor Activity Logs
```
1. Navigate to Activity Logs page
2. View all system activities:
   - Budget transactions by Treasurer
   - Events created by Secretary
   - Reports submitted
   - Documents uploaded
3. Filter by date, user, or activity type
4. Export logs if needed
```

### Access Permissions
| Module | Permission | Notes |
|--------|------------|-------|
| All Modules | ✅ Full Access | Complete system access |
| Budget Management | ✅ Full Access | View and edit all budget |
| Events Management | ✅ Full Access | View and edit all events |
| All Reports | ✅ Full Access | View, edit, generate all |
| Report Approval | ✅ Approve All | Unique approval authority |
| Activity Logs | ✅ Full Access | View all user activities |
| Settings | ✅ Full Access | System configuration |

### Daily Use Cases
- Reviewing pending report submissions
- Approving liquidation reports before COA submission
- Approving accomplishment reports before LYDO submission
- Monitoring budget utilization
- Overseeing event implementation
- Generating consolidated quarterly reports

---

## 🔄 Typical System Workflow (All Actors)

### Scenario: SK Youth Summit Event

#### Phase 1: Planning (Secretary)
1. Secretary creates "Youth Summit 2025" event
2. Sets date, venue, budget request: ₱50,000
3. Assigns officials and uploads event design

#### Phase 2: Budget Approval (Treasurer + Chairperson)
1. Treasurer views event budget request
2. Treasurer confirms budget availability
3. Chairperson reviews and approves budget allocation

#### Phase 3: Event Execution (Secretary)
1. Secretary updates event status to "Ongoing"
2. Secretary tracks attendance (150 participants)
3. Secretary uploads event photos and documentation

#### Phase 4: Financial Liquidation (Treasurer)
1. Treasurer records all expenses:
   - Venue rental: ₱15,000 (OR #12345)
   - Food & refreshments: ₱25,000 (OR #12346)
   - Materials: ₱8,000 (OR #12347)
   - Total: ₱48,000
2. Treasurer uploads all receipts
3. Treasurer generates liquidation report
4. Treasurer submits to Chairperson

#### Phase 5: Accomplishment Reporting (Secretary)
1. Secretary generates accomplishment report:
   - Event objectives achieved
   - 150 youth participants
   - Outputs: Action plans created
   - Photos and documentation attached
2. Secretary submits to Chairperson

#### Phase 6: Approval (Chairperson)
1. Chairperson reviews liquidation report
   - Verifies ₱2,000 savings (₱50,000 - ₱48,000)
   - Checks all receipts present
   - Approves report
2. Chairperson reviews accomplishment report
   - Verifies participation numbers
   - Reviews photo documentation
   - Approves report
3. Chairperson generates documentation packet
4. Submits to COA and LYDO

---

## 🎯 Permission Summary Table

| Action | Secretary | Treasurer | Chairperson |
|--------|-----------|-----------|-------------|
| **Events** | | | |
| Create Event | ✅ | ❌ | ✅ |
| Edit Event | ✅ | ❌ | ✅ |
| Track Attendance | ✅ | ❌ | ✅ |
| Upload Event Docs | ✅ | ❌ | ✅ |
| **Budget** | | | |
| Add Income | ❌ | ✅ | ✅ |
| Record Expense | ❌ | ✅ | ✅ |
| Edit Budget | ❌ | ✅ | ✅ |
| Upload Receipts | ❌ | ✅ | ✅ |
| **Reports** | | | |
| Liquidation (Create) | ❌ | ✅ | ✅ |
| Liquidation (View) | ✅ | ✅ | ✅ |
| Accomplishment (Create) | ✅ | ❌ | ✅ |
| Accomplishment (View) | ✅ | ✅ | ✅ |
| Approve Reports | ❌ | ❌ | ✅ |
| Generate Packet | ✅ | ✅ | ✅ |

---

## 🔐 Security & Transparency

### Transparency Principle
- **All actors can VIEW all data** for transparency
- Edit restrictions ensure proper role assignment
- Activity logs track all actions

### Audit Trail
- Every action is logged with:
  - User who performed action
  - Timestamp
  - Description of action
  - Related entity (event, budget, report)

### Report Approval Chain
```
Secretary/Treasurer → Creates Report
         ↓
    Chairperson → Reviews & Approves
         ↓
  Final Approved Report → Ready for Submission
```

---

## 📱 Login Credentials Quick Reference

| Role | Username | Password | Access Level |
|------|----------|----------|--------------|
| Chairperson | `president` | `president` | Full System + Approval |
| Treasurer | `treasurer` | `treasurer` | Budget + Liquidation |
| Secretary | `secretary` | `secretary` | Events + Accomplishment |

---

## 📚 Additional Resources

- **Role Permissions**: See [ROLE_BASED_ACCESS.md](./ROLE_BASED_ACCESS.md)
- **Use Case Mapping**: See [USE_CASE_ALIGNMENT.md](./USE_CASE_ALIGNMENT.md)
- **System Features**: See [README.md](./README.md)

---

**System Status**: ✅ Fully Operational with Role-Based Access Control
**Last Updated**: Aligned with Use Case Diagram Requirements