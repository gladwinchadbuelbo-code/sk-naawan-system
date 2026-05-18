# ⚡ SK System ERD - Quick Reference Guide

> **One-page cheat sheet for developers and database administrators**

---

## 🗂️ All 9 Tables at a Glance

```
┏━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Table             ┃ Key Column ┃ Purpose                     ┃
┡━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┩
│ users             │ id (UUID)  │ SK official accounts        │
│ events            │ id (INT)   │ Activities & programs       │
│ fund_entries      │ id (INT)   │ Income & expenses           │
│ activity_proposals│ id (INT)   │ Secretary submissions       │
│ budget_proposals  │ id (INT)   │ Treasurer submissions       │
│ notifications     │ id (INT)   │ System alerts               │
│ receipts          │ id (INT)   │ Expense documents           │
│ activity_logs     │ id (INT)   │ Audit trail                 │
│ settings          │ id (STR)   │ System config (singleton)   │
└───────────────────┴────────────┴─────────────────────────────┘
```

---

## 🔑 Primary & Foreign Keys

### Users Table
```sql
users.id (PK) ───┬──> activity_proposals.submitted_by (FK)
                 ├──> activity_proposals.reviewed_by (FK)
                 ├──> budget_proposals.submitted_by (FK)
                 ├──> budget_proposals.reviewed_by (FK)
                 ├──> events.created_by (FK)
                 ├──> fund_entries.created_by (FK)
                 ├──> receipts.uploaded_by (FK)
                 ├──> notifications.recipient_id (FK)
                 └──> activity_logs.user_id (FK)
```

### Receipts Table
```sql
receipts.id (PK) ───> fund_entries.receipt_id (FK)
```

---

## 📋 Column Count by Table

| Table | Total Columns | Mandatory | Optional |
|-------|--------------|-----------|----------|
| users | 6 | 5 | 1 |
| events | 12 | 9 | 3 |
| fund_entries | 10 | 6 | 4 |
| activity_proposals | 13 | 9 | 4 |
| budget_proposals | 11 | 8 | 3 |
| notifications | 9 | 5 | 4 |
| receipts | 8 | 7 | 1 |
| activity_logs | 6 | 5 | 1 |
| settings | 9 | 4 | 5 |

---

## 🎭 User Roles Quick Matrix

```
┌─────────────────────────┬───────────┬───────────┬─────────────┐
│ Action                  │ Secretary │ Treasurer │ Chairperson │
├─────────────────────────┼───────────┼───────────┼─────────────┤
│ Login to system         │     ✅     │     ✅     │      ✅      │
│ Create events           │     ✅     │     ❌     │      ✅      │
│ Create activity proposal│     ✅     │     ❌     │      ❌      │
│ Create fund entries     │     ❌     │     ✅     │      ✅      │
│ Create budget proposal  │     ❌     │     ✅     │      ❌      │
│ Approve proposals       │     ❌     │     ❌     │      ✅      │
│ View activity logs      │     ❌     │     ❌     │      ✅      │
│ Edit settings           │     ❌     │     ❌     │      ✅      │
└─────────────────────────┴───────────┴───────────┴─────────────┘
```

---

## 🔄 Proposal Workflow States

### Activity Proposal
```
Secretary                  Chairperson
    │                           │
    ├──[CREATE]──>  PENDING ───>│
    │                           │
    │              ┌────────────┤
    │              │            │
    │         RETURNED       APPROVED
    │              │            │
    │<──[REVISE]───┤            │
    │                           │
    │                      [PUBLIC PORTAL]
```

### Budget Proposal
```
Treasurer                  Chairperson
    │                           │
    ├──[CREATE]──>  PENDING ───>│
    │                           │
    │              ┌────────────┤
    │              │            │
    │         RETURNED       APPROVED
    │              │            │
    │<──[REVISE]───┤            │
    │                           │
    │                      [PUBLIC PORTAL]
```

---

## 📊 Common Queries Cheat Sheet

### Get Total Budget
```sql
SELECT 
  SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
  SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expenses,
  SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) as balance
FROM fund_entries;
```

### Get Pending Approvals Count
```sql
SELECT 
  (SELECT COUNT(*) FROM activity_proposals WHERE status = 'pending') +
  (SELECT COUNT(*) FROM budget_proposals WHERE status = 'pending') as total_pending;
```

### Get Public Events
```sql
SELECT * FROM events 
WHERE status IN ('Upcoming', 'Completed', 'Cancelled')
ORDER BY date DESC;
```

### Get Unread Notifications for User
```sql
SELECT * FROM notifications 
WHERE recipient_id = $user_id AND read = FALSE
ORDER BY timestamp DESC;
```

### Get Recent Activity Log
```sql
SELECT 
  al.*,
  u.full_name as user_name
FROM activity_logs al
LEFT JOIN users u ON al.user_id = u.id
ORDER BY al.timestamp DESC
LIMIT 50;
```

### Budget Utilization Rate
```sql
SELECT 
  ROUND(
    (SELECT SUM(amount) FROM fund_entries WHERE type = 'expense') * 100.0 / 
    NULLIF((SELECT SUM(amount) FROM fund_entries WHERE type = 'income'), 0),
    2
  ) as utilization_percentage;
```

---

## 🚨 Important Constraints

### Event Constraints
```sql
✓ title: min 3 characters
✓ venue: min 3 characters
✓ budget: must be >= 0
✓ end_date: must be >= date (if provided)
```

### Proposal Constraints
```sql
✓ title: min 5 characters
✓ description: min 20 characters
✓ budget/totalAmount: must be > 0
✓ targetParticipants: must be > 0
```

### Fund Entry Constraints
```sql
✓ amount: must be > 0
✓ type = 'expense': REQUIRES or_number
✓ type = 'income': or_number optional
```

### Receipt Constraints
```sql
✓ or_number: must be UNIQUE
✓ amount: must be > 0
✓ or_number format: A-Z, 0-9, hyphen only
```

---

## 🔍 Index Performance Guide

### Indexed Columns (Fast Queries)
```sql
-- USERS
✓ username (UNIQUE)
✓ role

-- EVENTS
✓ status
✓ date
✓ created_by

-- FUND_ENTRIES
✓ type
✓ category
✓ date
✓ created_by
✓ receipt_id

-- ACTIVITY_PROPOSALS
✓ status
✓ submitted_by
✓ reviewed_by

-- BUDGET_PROPOSALS
✓ status
✓ submitted_by
✓ reviewed_by

-- NOTIFICATIONS
✓ recipient_id
✓ read
✓ timestamp (DESC)

-- RECEIPTS
✓ or_number (UNIQUE)
✓ category
✓ uploaded_by

-- ACTIVITY_LOGS
✓ user_id
✓ timestamp (DESC)
✓ type
```

### Non-Indexed Columns (Slower Queries)
```sql
-- Avoid WHERE clauses on:
✗ description (TEXT fields)
✗ comments (TEXT fields)
✗ metadata (JSONB - unless using GIN index)
✗ attachments (JSONB)
```

---

## 📦 JSON Structure Quick Reference

### Event.documents
```json
{
  "photos": [
    {
      "name": "event-photo-1.jpg",
      "data": "base64_encoded_string...",
      "uploadedAt": "2025-12-11T10:30:00Z",
      "uploadedBy": "user_uuid_here"
    }
  ],
  "receipts": [...],
  "attendance": {
    "name": "attendance-sheet.pdf",
    "data": "base64_encoded_string...",
    "uploadedAt": "2025-12-11T11:00:00Z",
    "uploadedBy": "user_uuid_here"
  },
  "others": [...]
}
```

### BudgetProposal.items
```json
[
  {
    "category": "Transportation",
    "description": "Bus rental for 50 participants",
    "amount": 8000.00
  },
  {
    "category": "Food & Beverages",
    "description": "Lunch and snacks",
    "amount": 12000.00
  }
]
```

### ActivityProposal.requirements
```json
[
  "Sound system",
  "Tent (10x10 meters)",
  "Tables and chairs for 50 people",
  "First aid kit"
]
```

---

## 🔐 Row Level Security (RLS) Quick Reference

### Public Access (No Auth)
```sql
✓ events (status = 'Upcoming' | 'Completed' | 'Cancelled')
✓ activity_proposals (status = 'approved')
✓ budget_proposals (status = 'approved')
✓ fund_entries (all records)
✓ settings (read only)
```

### Secretary Access
```sql
✓ CREATE: events, activity_proposals
✓ UPDATE: own events, own proposals
✓ READ: all events, all proposals
✗ DELETE: restricted
```

### Treasurer Access
```sql
✓ CREATE: fund_entries, receipts, budget_proposals
✓ UPDATE: own fund_entries, own receipts, own proposals
✓ READ: all budget data
✗ DELETE: restricted
```

### Chairperson Access
```sql
✓ CREATE: events, fund_entries, all proposals
✓ UPDATE: all records
✓ DELETE: all records (with audit)
✓ APPROVE: all proposals
✓ READ: all data including activity_logs
```

---

## 🎯 Default Test Users

```sql
-- Username: sk_chair
-- Password: password123
-- Role: chairperson
-- Access: Full system access + approvals

-- Username: sk_treasurer  
-- Password: password123
-- Role: treasurer
-- Access: Budget management only

-- Username: sk_secretary
-- Password: password123
-- Role: secretary
-- Access: Activity/event management only
```

**⚠️ IMPORTANT:** Change passwords before production!

---

## 🔢 Enum Values Reference

### UserRole
```typescript
'chairperson' | 'treasurer' | 'secretary'
```

### EventStatus
```typescript
'Planning' | 'Upcoming' | 'Completed' | 'Cancelled'
```

### ProposalStatus
```typescript
'pending' | 'approved' | 'returned'
```

### FundType
```typescript
'income' | 'expense'
```

### NotificationType
```typescript
'proposal_submitted'
'proposal_approved'
'proposal_returned'
'comment_added'
'budget_updated'
'event_created'
```

---

## 📊 Table Size Estimates

### Year 1 (Estimated)
```
users:              3 records      ~1 KB
events:             100 records    ~50 KB
fund_entries:       300 records    ~100 KB
activity_proposals: 30 records     ~30 KB
budget_proposals:   15 records     ~20 KB
notifications:      1000 records   ~300 KB
receipts:           300 records    ~50 KB
activity_logs:      2000 records   ~500 KB
settings:           1 record       ~1 KB
───────────────────────────────────────────
Total (data):                      ~1 MB
Total (with docs):                 ~500 MB
```

### Year 5 (Projected)
```
users:              10 records     ~3 KB
events:             500 records    ~250 KB
fund_entries:       1500 records   ~500 KB
activity_proposals: 150 records    ~150 KB
budget_proposals:   75 records     ~100 KB
notifications:      5000 records   ~1.5 MB
receipts:           1500 records   ~250 KB
activity_logs:      10000 records  ~2.5 MB
settings:           1 record       ~1 KB
───────────────────────────────────────────
Total (data):                      ~5 MB
Total (with docs):                 ~3 GB
```

---

## ⚡ Performance Tips

### DO ✅
```sql
-- Use indexed columns in WHERE
SELECT * FROM events WHERE status = 'Upcoming';

-- Use specific date ranges
SELECT * FROM fund_entries 
WHERE date >= '2025-01-01' AND date <= '2025-12-31';

-- Use LIMIT for large result sets
SELECT * FROM activity_logs ORDER BY timestamp DESC LIMIT 50;

-- Join on indexed foreign keys
SELECT e.*, u.full_name 
FROM events e 
JOIN users u ON e.created_by = u.id;
```

### DON'T ❌
```sql
-- Avoid LIKE on large text without full-text index
SELECT * FROM events WHERE description LIKE '%youth%';

-- Avoid ORDER BY on non-indexed columns
SELECT * FROM events ORDER BY description;

-- Avoid SELECT * when you only need specific columns
SELECT * FROM events; -- Use: SELECT id, title, date FROM events;

-- Avoid N+1 queries
-- Bad: Loop and query for each event's creator
-- Good: Use JOIN to get all data in one query
```

---

## 🗄️ Backup Strategy

### Daily Backups (Automated)
```bash
# PostgreSQL dump
pg_dump -U postgres sk_database > backup_$(date +%Y%m%d).sql

# Supabase automatic backups (included in Pro plan)
# Retention: 30 days
```

### Weekly Full Backup
```bash
# Complete database + files
pg_dump -U postgres -F c sk_database > weekly_backup.dump
```

### Before Major Changes
```bash
# Manual backup before:
# - Schema changes
# - Data migrations
# - Permission updates
pg_dump -U postgres sk_database > pre_migration_backup.sql
```

---

## 🔧 Useful Commands

### Check Table Sizes
```sql
SELECT 
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Check Index Usage
```sql
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan as index_scans
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

### Find Slow Queries (Enable pg_stat_statements first)
```sql
SELECT 
  query,
  calls,
  total_time,
  mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

### Vacuum & Analyze
```sql
-- Reclaim space and update statistics
VACUUM ANALYZE;

-- For specific table
VACUUM ANALYZE events;
```

---

## 📞 Quick Links

| Resource | URL |
|----------|-----|
| **SVG Diagram** | `ERD-SK-System.svg` |
| **Mermaid Code** | `ERD-MERMAID.md` lines 5-134 |
| **Full Schema** | `DATABASE-SCHEMA.md` |
| **SQL Migration** | `migration.sql` |
| **Architecture** | `SYSTEM-ARCHITECTURE.md` |
| **Main README** | `README-ERD-PACKAGE.md` |

---

## ✅ Pre-Deployment Checklist

```
□ Run migration.sql successfully
□ Verify all 9 tables created
□ Check all indexes exist
□ Test RLS policies for each role
□ Update default passwords
□ Enable SSL/TLS
□ Configure backup schedule
□ Test restore procedure
□ Verify public portal queries work
□ Load test with 100+ concurrent users
□ Review and sign off on security audit
```

---

<div align="center">

**⚡ Quick Reference Complete**

*Keep this page bookmarked for instant access to common patterns and queries*

</div>
