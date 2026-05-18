# 🗄️ SK Digital Management System - Database Schema Documentation

## 📋 Table of Contents
1. [Overview](#overview)
2. [Entity Definitions](#entity-definitions)
3. [Relationships](#relationships)
4. [Enumerations](#enumerations)
5. [Business Rules](#business-rules)
6. [Migration Guide](#migration-guide)

---

## Overview

The SK Digital Management System uses a **relational data model** currently implemented in **LocalStorage** for frontend simulation. The schema is designed to support migration to **PostgreSQL/Supabase** with minimal changes.

### Key Features:
- ✅ Role-based access control (RBAC)
- ✅ Proposal-based workflow system
- ✅ Audit logging for all actions
- ✅ Document management with base64 encoding
- ✅ Public transparency portal integration

---

## Entity Definitions

### 1. 👤 USER
**Table Name:** `users`  
**Description:** Stores SK official account information with role-based permissions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | STRING (UUID) | PRIMARY KEY | Unique user identifier |
| `username` | STRING | UNIQUE, NOT NULL | Login username |
| `fullName` | STRING | NOT NULL | Full name of SK official |
| `password` | STRING | NOT NULL | Hashed password (bcrypt) |
| `role` | ENUM(UserRole) | NOT NULL | User role/position |
| `createdAt` | TIMESTAMP | DEFAULT NOW() | Account creation timestamp |
| `lastLogin` | TIMESTAMP | NULL | Last login timestamp |

**Indexes:**
- PRIMARY KEY on `id`
- UNIQUE INDEX on `username`

---

### 2. 📅 EVENT
**Table Name:** `events`  
**Description:** SK events, activities, and programs with scheduling and budget tracking

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER/BIGINT | PRIMARY KEY AUTO_INCREMENT | Unique event identifier |
| `title` | STRING | NOT NULL | Event name |
| `date` | DATE | NOT NULL | Event start date |
| `endDate` | DATE | NULL | Event end date (multi-day events) |
| `venue` | STRING | NOT NULL | Event location/venue |
| `time` | STRING | NOT NULL | Event start time |
| `budget` | DECIMAL(10,2) | NOT NULL | Allocated budget |
| `description` | TEXT | NOT NULL | Event description/details |
| `status` | ENUM(EventStatus) | NOT NULL | Current event status |
| `assignedOfficials` | JSON/ARRAY | NULL | Assigned SK officials (user IDs) |
| `documents` | JSON | NULL | Embedded documents structure |
| `createdAt` | TIMESTAMP | DEFAULT NOW() | Record creation timestamp |
| `updatedAt` | TIMESTAMP | ON UPDATE NOW() | Last update timestamp |

**Indexes:**
- PRIMARY KEY on `id`
- INDEX on `status`
- INDEX on `date`

**Embedded Documents Structure:**
```json
{
  "photos": [
    { "name": "string", "data": "base64", "uploadedAt": "ISO8601", "uploadedBy": "userId" }
  ],
  "receipts": [
    { "name": "string", "data": "base64", "uploadedAt": "ISO8601", "uploadedBy": "userId" }
  ],
  "attendance": { "name": "string", "data": "base64", "uploadedAt": "ISO8601", "uploadedBy": "userId" },
  "others": [
    { "name": "string", "data": "base64", "uploadedAt": "ISO8601", "uploadedBy": "userId" }
  ]
}
```

---

### 3. 💰 FUND_ENTRY
**Table Name:** `fund_entries`  
**Description:** Income and expense transactions for SK budget management

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER/BIGINT | PRIMARY KEY AUTO_INCREMENT | Unique fund entry identifier |
| `date` | DATE | NOT NULL | Transaction date |
| `category` | STRING | NOT NULL | Budget category |
| `description` | TEXT | NOT NULL | Transaction description |
| `type` | ENUM('income', 'expense') | NOT NULL | Transaction type |
| `amount` | DECIMAL(10,2) | NOT NULL | Transaction amount |
| `orNumber` | STRING | NULL | Official Receipt number |
| `supplier` | STRING | NULL | Supplier/vendor name |
| `receiptId` | INTEGER | FOREIGN KEY | Reference to receipt document |
| `createdAt` | TIMESTAMP | DEFAULT NOW() | Record creation timestamp |
| `createdBy` | STRING | FOREIGN KEY (users.id) | User who created the entry |

**Indexes:**
- PRIMARY KEY on `id`
- INDEX on `type`
- INDEX on `category`
- INDEX on `date`
- FOREIGN KEY `receiptId` REFERENCES `receipts(id)`

---

### 4. 📝 ACTIVITY_PROPOSAL
**Table Name:** `activity_proposals`  
**Description:** Activity/event proposals submitted by SK Secretary for Chairperson approval

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER/BIGINT | PRIMARY KEY AUTO_INCREMENT | Unique proposal identifier |
| `title` | STRING | NOT NULL | Activity title |
| `description` | TEXT | NOT NULL | Detailed description (min 20 chars) |
| `date` | DATE | NOT NULL | Proposed activity date |
| `location` | STRING | NOT NULL | Activity venue/location |
| `budget` | DECIMAL(10,2) | NOT NULL | Requested budget |
| `targetParticipants` | INTEGER | NOT NULL | Expected number of participants |
| `requirements` | JSON/ARRAY | NULL | List of requirements |
| `attachments` | JSON/ARRAY | NULL | Supporting documents |
| `submittedBy` | STRING | FOREIGN KEY (users.id) | Secretary who submitted |
| `submittedDate` | TIMESTAMP | DEFAULT NOW() | Submission timestamp |
| `status` | ENUM(ProposalStatus) | NOT NULL | Current status |
| `comments` | TEXT | NULL | Chairperson's comments/feedback |
| `reviewedBy` | STRING | FOREIGN KEY (users.id) | Chairperson who reviewed |
| `reviewedDate` | TIMESTAMP | NULL | Review timestamp |

**Indexes:**
- PRIMARY KEY on `id`
- INDEX on `status`
- INDEX on `submittedBy`
- FOREIGN KEY `submittedBy` REFERENCES `users(id)`
- FOREIGN KEY `reviewedBy` REFERENCES `users(id)`

---

### 5. 💵 BUDGET_PROPOSAL
**Table Name:** `budget_proposals`  
**Description:** Budget allocation proposals submitted by SK Treasurer for Chairperson approval

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER/BIGINT | PRIMARY KEY AUTO_INCREMENT | Unique proposal identifier |
| `title` | STRING | NOT NULL | Budget proposal title |
| `description` | TEXT | NOT NULL | Detailed description (min 20 chars) |
| `totalAmount` | DECIMAL(10,2) | NOT NULL | Total requested amount |
| `items` | JSON/ARRAY | NOT NULL | Budget breakdown items |
| `attachments` | JSON/ARRAY | NULL | Supporting documents |
| `submittedBy` | STRING | FOREIGN KEY (users.id) | Treasurer who submitted |
| `submittedDate` | TIMESTAMP | DEFAULT NOW() | Submission timestamp |
| `status` | ENUM(ProposalStatus) | NOT NULL | Current status |
| `comments` | TEXT | NULL | Chairperson's comments/feedback |
| `approvalDate` | TIMESTAMP | NULL | Approval timestamp |
| `reviewedBy` | STRING | FOREIGN KEY (users.id) | Chairperson who reviewed |

**Indexes:**
- PRIMARY KEY on `id`
- INDEX on `status`
- INDEX on `submittedBy`
- FOREIGN KEY `submittedBy` REFERENCES `users(id)`
- FOREIGN KEY `reviewedBy` REFERENCES `users(id)`

**Budget Items Structure:**
```json
[
  {
    "category": "string",
    "description": "string",
    "amount": 0.00
  }
]
```

---

### 6. 🔔 NOTIFICATION
**Table Name:** `notifications`  
**Description:** System notifications for proposal approvals, comments, and updates

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER/BIGINT | PRIMARY KEY AUTO_INCREMENT | Unique notification identifier |
| `type` | ENUM(NotificationType) | NOT NULL | Notification type |
| `title` | STRING | NOT NULL | Notification title |
| `message` | TEXT | NOT NULL | Notification message |
| `timestamp` | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| `read` | BOOLEAN | DEFAULT FALSE | Read status |
| `recipientRole` | ENUM(UserRole) | NULL | Target user role |
| `recipientId` | STRING | FOREIGN KEY (users.id) | Specific recipient user ID |
| `link` | STRING | NULL | Related page/resource link |
| `metadata` | JSON | NULL | Additional data |

**Indexes:**
- PRIMARY KEY on `id`
- INDEX on `recipientId`
- INDEX on `read`
- FOREIGN KEY `recipientId` REFERENCES `users(id)`

---

### 7. 🧾 RECEIPT
**Table Name:** `receipts`  
**Description:** Uploaded receipt documents for expense verification

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER/BIGINT | PRIMARY KEY AUTO_INCREMENT | Unique receipt identifier |
| `fileName` | STRING | NOT NULL | Original filename |
| `fileUrl` | STRING/TEXT | NOT NULL | File storage URL or base64 data |
| `uploadDate` | TIMESTAMP | DEFAULT NOW() | Upload timestamp |
| `category` | STRING | NOT NULL | Expense category |
| `orNumber` | STRING | UNIQUE | Official Receipt number |
| `amount` | DECIMAL(10,2) | NOT NULL | Receipt amount |
| `supplier` | STRING | NOT NULL | Vendor/supplier name |
| `uploadedBy` | STRING | FOREIGN KEY (users.id) | User who uploaded |

**Indexes:**
- PRIMARY KEY on `id`
- UNIQUE INDEX on `orNumber`
- INDEX on `category`
- FOREIGN KEY `uploadedBy` REFERENCES `users(id)`

---

### 8. 📋 ACTIVITY_LOG
**Table Name:** `activity_logs`  
**Description:** Audit trail of all system actions for accountability and tracking

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER/BIGINT | PRIMARY KEY AUTO_INCREMENT | Unique log entry identifier |
| `type` | STRING | NOT NULL | Action type (event, budget, proposal, etc.) |
| `action` | STRING | NOT NULL | Action performed (created, updated, deleted, approved) |
| `description` | TEXT | NOT NULL | Human-readable description |
| `timestamp` | TIMESTAMP | DEFAULT NOW() | Action timestamp |
| `userId` | STRING | FOREIGN KEY (users.id) | User who performed action |
| `metadata` | JSON | NULL | Additional context data |

**Indexes:**
- PRIMARY KEY on `id`
- INDEX on `userId`
- INDEX on `timestamp`
- INDEX on `type`
- FOREIGN KEY `userId` REFERENCES `users(id)`

---

### 9. ⚙️ SETTINGS
**Table Name:** `settings`  
**Description:** System-wide configuration and SK organization information

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | STRING | PRIMARY KEY | Settings identifier (singleton) |
| `skName` | STRING | NOT NULL | SK organization name |
| `barangay` | STRING | NOT NULL | Barangay name |
| `contactEmail` | STRING | NULL | Official email address |
| `contactPhone` | STRING | NULL | Official phone number |
| `fiscalYear` | STRING | NOT NULL | Current fiscal year |
| `logoUrl` | STRING | NULL | Organization logo URL |
| `publicPortalEnabled` | BOOLEAN | DEFAULT TRUE | Public portal access toggle |
| `updatedAt` | TIMESTAMP | ON UPDATE NOW() | Last update timestamp |

**Indexes:**
- PRIMARY KEY on `id`

---

## Relationships

### One-to-Many Relationships

```
USER (1) ──── (N) ACTIVITY_PROPOSAL
  └── submittedBy

USER (1) ──── (N) BUDGET_PROPOSAL
  └── submittedBy

USER (1) ──── (N) ACTIVITY_LOG
  └── userId

USER (1) ──── (N) RECEIPT
  └── uploadedBy

USER (1) ──── (N) NOTIFICATION
  └── recipientId

RECEIPT (1) ──── (N) FUND_ENTRY
  └── receiptId
```

### Approval Relationships (Many-to-Many via status)

```
USER (Chairperson) ──approves──> ACTIVITY_PROPOSAL
USER (Chairperson) ──approves──> BUDGET_PROPOSAL
```

### Embedded Relationships

```
EVENT (1) ──contains──> (N) DOCUMENT (embedded JSON)
BUDGET_PROPOSAL (1) ──contains──> (N) BUDGET_ITEM (embedded JSON)
```

---

## Enumerations

### UserRole
```typescript
type UserRole = 'chairperson' | 'treasurer' | 'secretary';
```

**Permissions:**
- **Chairperson**: Full access, approval authority, view all
- **Treasurer**: Manage budgets, create budget proposals
- **Secretary**: Manage events, create activity proposals

---

### EventStatus
```typescript
type EventStatus = 'Planning' | 'Upcoming' | 'Completed' | 'Cancelled';
```

**Public Visibility:**
- `Planning`: Not visible on public portal
- `Upcoming`, `Completed`, `Cancelled`: Visible on public portal

---

### ProposalStatus
```typescript
type ProposalStatus = 'pending' | 'approved' | 'returned';
```

**Workflow:**
1. `pending`: Awaiting Chairperson review
2. `approved`: Approved by Chairperson (visible on public portal)
3. `returned`: Returned to submitter for revisions

---

### NotificationType
```typescript
type NotificationType = 
  | 'proposal_submitted'
  | 'proposal_approved'
  | 'proposal_returned'
  | 'comment_added'
  | 'budget_updated'
  | 'event_created';
```

---

## Business Rules

### 1. **Role-Based Access Control**
- Only **Secretary** can create Activity Proposals
- Only **Treasurer** can create Budget Proposals and manage Fund Entries
- Only **Chairperson** can approve/return proposals
- All roles can view approved data

### 2. **Proposal Workflow**
```
Secretary/Treasurer → Submit Proposal
        ↓
Chairperson → Review
        ↓
    ┌───────┴────────┐
Approve          Return with Comments
    ↓                   ↓
Public Portal      Back to Submitter
```

### 3. **Public Transparency Rules**
- **Events**: Only `Upcoming`, `Completed`, `Cancelled` visible publicly
- **Activity Proposals**: Only `approved` status visible publicly
- **Budget Proposals**: Only `approved` status visible publicly
- **Fund Entries**: All approved income/expense visible publicly

### 4. **Data Validation**
- Activity Proposal: Title min 5 chars, description min 20 chars
- Budget Proposal: Title min 5 chars, description min 20 chars
- Event: Title min 3 chars, venue min 3 chars
- Fund Entry: Amount must be positive, OR number required for expenses

### 5. **Audit Logging**
All CRUD operations are logged in `activity_logs` with:
- User who performed action
- Timestamp
- Action type and description
- Metadata (e.g., record ID, changes)

---

## Migration Guide

### From LocalStorage to Supabase/PostgreSQL

#### Step 1: Create Tables
```sql
-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('chairperson', 'treasurer', 'secretary')),
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);

-- Create events table
CREATE TABLE events (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  end_date DATE,
  venue VARCHAR(255) NOT NULL,
  time VARCHAR(50) NOT NULL,
  budget DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('Planning', 'Upcoming', 'Completed', 'Cancelled')),
  assigned_officials JSONB,
  documents JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create fund_entries table
CREATE TABLE fund_entries (
  id BIGSERIAL PRIMARY KEY,
  date DATE NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
  amount DECIMAL(10,2) NOT NULL,
  or_number VARCHAR(50),
  supplier VARCHAR(255),
  receipt_id BIGINT REFERENCES receipts(id),
  created_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

-- Continue for all other tables...
```

#### Step 2: Enable Row Level Security (RLS)
```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE fund_entries ENABLE ROW LEVEL SECURITY;

-- Create policies for role-based access
CREATE POLICY "Chairperson full access" ON events
  FOR ALL USING (auth.jwt() ->> 'role' = 'chairperson');

CREATE POLICY "Public read approved events" ON events
  FOR SELECT USING (status IN ('Upcoming', 'Completed', 'Cancelled'));
```

#### Step 3: Data Migration Script
```javascript
// Export from LocalStorage
const exportData = storage.exportAllData();

// Transform and import to Supabase
const { data, error } = await supabase
  .from('events')
  .insert(exportData.events);
```

---

## 📊 Database Statistics

| Entity | Estimated Records | Growth Rate | Priority |
|--------|------------------|-------------|----------|
| Users | 3-10 | Low | High |
| Events | 50-200/year | Medium | High |
| Fund Entries | 100-500/year | High | Critical |
| Activity Proposals | 20-50/year | Low | Medium |
| Budget Proposals | 10-30/year | Low | Medium |
| Notifications | 500-2000/year | High | Low |
| Activity Logs | 1000-5000/year | High | Medium |
| Receipts | 100-500/year | Medium | High |

---

## 🔐 Security Considerations

1. **Password Hashing**: Use bcrypt with salt rounds >= 10
2. **Input Validation**: Server-side validation for all inputs
3. **SQL Injection**: Use parameterized queries
4. **XSS Protection**: Sanitize all user-generated content
5. **File Upload**: Validate file types, scan for malware
6. **Rate Limiting**: Implement on API endpoints
7. **Audit Logging**: Log all sensitive operations
8. **Backup Strategy**: Daily automated backups with 30-day retention

---

**Generated:** December 11, 2025  
**System Version:** 1.0.0  
**Schema Version:** 1.0
