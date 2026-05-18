# Use Case Diagram Alignment

## System Overview
This document maps the system implementation to the official Use Case Diagram for the **Integrated Digital Management System for SK Activities, Budget Transparency, and Reporting System**.

---

## Quick Reference: Exact Use Case Mapping

### Secretary (SK Secretary)
**Primary Use Cases:**
1. Manage Events
2. Track Attendance
3. Upload Documentation
4. Generate Accomplishment Reports

**View-Only Access:**
- View Budget
- View Liquidation Reports

---

### Treasurer (SK Treasurer)
**Primary Use Cases:**
1. Manage Budget
2. Track Expenses
3. Upload Financial Documents
4. Generate Liquidation Reports

**View-Only Access:**
- View Events
- View Accomplishment Reports

---

### SK Chairperson
**Primary Use Cases:**
1. Approve Reports
2. Generate Documentation Packet

**Full Access:**
- All use cases from Secretary
- All use cases from Treasurer
- System-wide oversight and approval authority

---

## Actor 1: Secretary (SK Secretary)

### Primary Responsibilities
Event and program management, attendance tracking, and accomplishment documentation.

### Use Cases Implemented (Per Diagram)

#### 1. **Manage Events**
- ✅ Create Event
- ✅ Edit Event Details
- ✅ Update Event Status
- ✅ View Event Calendar
- ✅ Delete Event
- **Location**: Events Page (`/events`)
- **Permission**: Full Access
- **Diagram Mapping**: Primary use case for Secretary

#### 2. **Track Attendance**
- ✅ View Attendance List
- ✅ Add Attendee
- ✅ Mark Attendance
- ✅ Upload Attendance Sheet
- ✅ Export Attendance Report
- **Location**: Attendance Page (`/events/:id/attendance`)
- **Permission**: Full Access
- **Diagram Mapping**: Primary use case for Secretary

#### 3. **Upload Documentation**
- ✅ Upload Photos
- ✅ Upload Event Files
- ✅ Upload Attendance Sheets
- ✅ Organize Documentation (event-related only)
- **Location**: Event Details Page, Upload Modals
- **Permission**: Full Access
- **Diagram Mapping**: Primary use case for Secretary

#### 4. **Generate Accomplishment Reports**
- ✅ Create Accomplishment Report
- ✅ Edit Report Content
- ✅ Add Event Outputs
- ✅ Upload Supporting Documents
- ✅ Generate PDF/Word
- **Location**: Reports Page (`/reports?tab=accomplishment`)
- **Permission**: Full Access (Create, Edit, Generate)
- **Diagram Mapping**: Primary use case for Secretary

#### 5. **View Budget** (View Only)
- ✅ View Budget Summary
- ✅ View Transaction History
- ❌ Cannot Add/Edit Budget Entries
- **Location**: Budget Page (`/budget`)
- **Permission**: View Only
- **Diagram Mapping**: View-only access for transparency

#### 6. **View Liquidation Reports** (View Only)
- ✅ View Liquidation Reports
- ✅ Download Reports
- ❌ Cannot Create or Edit Liquidation Reports
- **Location**: Reports Page (`/reports?tab=liquidation`)
- **Permission**: View Only
- **Diagram Mapping**: View-only access for transparency

---

## Actor 2: Treasurer (SK Treasurer)

### Primary Responsibilities
Financial management, budget tracking, and liquidation reporting.

### Use Cases Implemented (Per Diagram)

#### 1. **Manage Budget**
- ✅ Add Income/Fund Entry
- ✅ Record Expense
- ✅ Edit Budget Entries
- ✅ Delete Budget Entries
- ✅ Categorize Transactions
- **Location**: Budget Page (`/budget`)
- **Permission**: Full Access
- **Diagram Mapping**: Primary use case for Treasurer

#### 2. **Track Expenses**
- ✅ Record Expense Details
- ✅ Add OR Number
- ✅ Add Supplier Information
- ✅ Categorize Expenses
- ✅ View Expense Summary
- **Location**: Budget Page - Record Expense Modal
- **Permission**: Full Access
- **Diagram Mapping**: Primary use case for Treasurer

#### 3. **Upload Financial Documents**
- ✅ Upload Receipts
- ✅ Upload Official Receipts (OR)
- ✅ Attach Financial Documentation
- ✅ Link Documents to Expenses
- **Location**: Budget Page, Liquidation Reports
- **Permission**: Full Access
- **Diagram Mapping**: Primary use case for Treasurer

#### 4. **Generate Liquidation Reports**
- ✅ Create Liquidation Report
- ✅ Edit Report Details
- ✅ Add Expense Breakdown
- ✅ Attach Receipts
- ✅ Generate PDF/Excel
- **Location**: Reports Page (`/reports?tab=liquidation`)
- **Permission**: Full Access (Create, Edit, Generate)
- **Diagram Mapping**: Primary use case for Treasurer

#### 5. **View Events** (View Only)
- ✅ View Event List
- ✅ View Event Calendar
- ✅ View Event Details
- ❌ Cannot Create/Edit Events
- ❌ Cannot Track Attendance
- **Location**: Events Page (`/events`)
- **Permission**: View Only
- **Diagram Mapping**: View-only access for transparency

#### 6. **View Accomplishment Reports** (View Only)
- ✅ View Accomplishment Reports
- ✅ Download Reports
- ❌ Cannot Create or Edit Accomplishment Reports
- **Location**: Reports Page (`/reports?tab=accomplishment`)
- **Permission**: View Only
- **Diagram Mapping**: View-only access for transparency

---

## Actor 3: SK Chairperson

### Primary Responsibilities
System oversight, report approval, and overall management.

### Use Cases Implemented (Per Diagram)

#### 1. **Approve Reports**
- ✅ Review Liquidation Reports
- ✅ Review Accomplishment Reports
- ✅ Approve/Reject Reports
- ✅ Add Approval Signature
- ✅ Track Approval Status
- **Location**: Reports Page (All Tabs)
- **Permission**: Approval Authority
- **Diagram Mapping**: Primary use case exclusive to SK Chairperson

#### 2. **Generate Documentation Packet**
- ✅ Compile all reports
- ✅ Generate comprehensive documentation
- ✅ Include all supporting documents
- ✅ Create COA/LYDO-compliant packets
- ✅ Export as PDF/ZIP
- **Location**: Reports Page (`/reports?tab=documentation`)
- **Permission**: Full Access
- **Diagram Mapping**: Primary use case exclusive to SK Chairperson

#### 3. **Full Access to All Use Cases**
The SK Chairperson has complete access to all system use cases:

**Budget & Finance:**
- ✅ Manage Budget (Treasurer's primary use case)
- ✅ Track Expenses (Treasurer's primary use case)
- ✅ Upload Financial Documents (Treasurer's primary use case)
- ✅ Generate Liquidation Reports (Treasurer's primary use case)

**Events & Programs:**
- ✅ Manage Events (Secretary's primary use case)
- ✅ Track Attendance (Secretary's primary use case)
- ✅ Upload Documentation (Secretary's primary use case)
- ✅ Generate Accomplishment Reports (Secretary's primary use case)

**System Oversight:**
- ✅ View Activity Logs
- ✅ Monitor System Usage
- ✅ Access all modules
- ✅ Review all data

- **Location**: All Pages
- **Permission**: Full System Access
- **Diagram Mapping**: SK Chairperson connects to all use cases in diagram

---

## Permission Enforcement Matrix

| Use Case | Secretary | Treasurer | Chairperson |
|----------|-----------|-----------|-------------|
| **Event Management** | ✅ Full Access | 👁️ View Only | ✅ Full Access |
| **Attendance Tracking** | ✅ Full Access | 👁️ View Only | ✅ Full Access |
| **Budget Management** | 👁️ View Only | ✅ Full Access | ✅ Full Access |
| **Expense Recording** | 👁️ View Only | ✅ Full Access | ✅ Full Access |
| **Accomplishment Reports** | ✅ Edit & Generate | 👁️ View Only | ✅ Full Access |
| **Liquidation Reports** | 👁️ View Only | ✅ Edit & Generate | ✅ Full Access |
| **Report Approval** | ❌ No Access | ❌ No Access | ✅ Approve All |
| **Documentation Upload** | ✅ Event Docs | ✅ Financial Docs | ✅ All Docs |
| **System Settings** | ✅ View/Edit | ✅ View/Edit | ✅ Full Access |
| **Activity Logs** | ✅ View Own | ✅ View Own | ✅ View All |

---

## UI Implementation Notes

### Visual Indicators
1. **Role Badges**: Color-coded badges (Purple/Green/Orange) appear in:
   - Sidebar header
   - Dashboard header
   - Settings page
   - Permission info cards

2. **Permission Alerts**: Info cards on pages indicate:
   - "You can edit this resource"
   - "View-only access" (when applicable)
   - Specific permissions for current role

3. **Disabled Controls**: 
   - Edit/Delete buttons hidden for view-only users
   - "Add" buttons hidden when user cannot create
   - "View Only" text shown in action columns

4. **Approval Controls**: (Chairperson Only)
   - "Approve Report" button visible only to Chairperson
   - Approval status indicators on reports
   - Signature blocks in generated reports

---

## System Flows

### Secretary Event Management Flow
1. Log in as Secretary → Dashboard
2. Navigate to Events Page
3. Click "Create Event" → Fill Event Details
4. Track Attendance → Upload Attendance Sheet
5. Upload Event Photos/Documents
6. Generate Accomplishment Report
7. Submit for Chairperson Approval

### Treasurer Financial Management Flow
1. Log in as Treasurer → Dashboard
2. Navigate to Budget Page
3. Add Income/Record Expenses
4. Upload Receipts (OR Documents)
5. Generate Liquidation Report
6. Submit for Chairperson Approval

### Chairperson Approval Flow
1. Log in as Chairperson → Dashboard
2. Review Pending Reports Notification
3. Navigate to Reports Page
4. Review Report Details
5. Approve/Reject Report
6. Generate Final Approved Version

---

## Technical Implementation

### Permission Checks
```typescript
// Check if user can edit a specific resource type
const canEditBudget = canEdit('budget');
const canEditEvent = canEdit('event');
const canEditLiquidation = canEdit('liquidation');
const canEditAccomplishment = canEdit('accomplishment');

// Check if user can approve reports
const canApproveReports = canApprove();
```

### UI Conditional Rendering
```tsx
{canEditBudget && (
  <Button onClick={handleAddFund}>Add Fund</Button>
)}

{!canEditBudget && (
  <span className="text-gray-400">View Only</span>
)}
```

---

## Alignment Status

✅ **Secretary Use Cases**: Fully Implemented and Aligned
✅ **Treasurer Use Cases**: Fully Implemented and Aligned  
✅ **Chairperson Use Cases**: Fully Implemented and Aligned  
✅ **Permission Matrix**: Enforced Throughout System  
✅ **Visual Indicators**: Implemented on All Pages  
✅ **Role-Based Navigation**: Working as Expected  

---

## Testing Scenarios

### Test as Secretary
- ✅ Can create and edit events
- ✅ Can track attendance
- ✅ Can generate accomplishment reports
- ❌ Cannot edit budget
- ❌ Cannot edit liquidation reports
- ❌ Cannot approve reports

### Test as Treasurer
- ✅ Can add income and record expenses
- ✅ Can manage budget
- ✅ Can generate liquidation reports
- ❌ Cannot edit events
- ❌ Cannot edit accomplishment reports
- ❌ Cannot approve reports

### Test as Chairperson
- ✅ Can view all modules
- ✅ Can edit all content
- ✅ Can approve all reports
- ✅ Can generate all report types
- ✅ Full system access

---

**Last Updated**: Implementation aligns with official use case diagram
**Status**: ✅ Fully Aligned and Operational
