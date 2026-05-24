# 🗄️ SK Digital Management System - Complete ERD Documentation

<div align="center">

![Status](https://img.shields.io/badge/status-production%20ready-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Database](https://img.shields.io/badge/database-PostgreSQL%2014%2B-336791)
![License](https://img.shields.io/badge/license-proprietary-red)

**Complete Entity Relationship Diagram & Database Documentation Package**

[Quick Start](#-quick-start) • [Documentation](#-documentation-files) • [Features](#-key-features) • [Deploy](#-deployment)

</div>

---

## 📦 What's Included

This is a **complete, production-ready database documentation package** for the SK Digital Management System. It includes visual diagrams, detailed schemas, migration scripts, and comprehensive guides.

### 🎯 Perfect For:
- ✅ Database deployment (PostgreSQL/Supabase)
- ✅ Developer onboarding & training
- ✅ Client presentations & stakeholder reviews
- ✅ System documentation & wikis
- ✅ Code reviews & technical audits

---

## ⚡ Quick Start

### For Developers (2 minutes)
```bash
# 1. View the visual diagram
open ERD-SK-System.svg

# 2. Read the quick reference
cat QUICK-REFERENCE.md

# 3. Deploy the database
psql -U postgres -d your_database < migration.sql
```

### For Documentation (GitHub/GitLab)
```markdown
<!-- Copy Mermaid code from ERD-MERMAID.md (lines 5-134) -->
<!-- Paste into your README.md -->
```mermaid
erDiagram
    USER ||--o{ ACTIVITY_PROPOSAL : "submits"
    USER ||--o{ BUDGET_PROPOSAL : "submits"
    ...
```
```

### For Presentations
```bash
# Option 1: Use SVG file directly
open ERD-SK-System.svg

# Option 2: Create interactive diagram
# 1. Go to https://dbdiagram.io/
# 2. Copy code from ERD-MERMAID.md (dbdiagram section)
# 3. Export as PNG/PDF
```

---

## 📚 Documentation Files

| File | Size | Purpose | Open |
|------|------|---------|------|
| **[README.md](./README.md)** | - | This file - Quick overview | 📖 You are here |
| **[ERD-SK-System.svg](./ERD-SK-System.svg)** | 15 KB | Visual ERD diagram (Civic Green theme) | [Open SVG](./ERD-SK-System.svg) |
| **[ERD-MERMAID.md](./ERD-MERMAID.md)** | 10 KB | 4 code formats (Mermaid, PlantUML, dbdiagram, ASCII) | [View](./ERD-MERMAID.md) |
| **[DATABASE-SCHEMA.md](./DATABASE-SCHEMA.md)** | 25 KB | Complete schema documentation (200+ lines) | [View](./DATABASE-SCHEMA.md) |
| **[migration.sql](./migration.sql)** | 30 KB | Production-ready SQL migration (400+ lines) | [View](./migration.sql) |
| **[SYSTEM-ARCHITECTURE.md](./SYSTEM-ARCHITECTURE.md)** | 40 KB | System architecture & workflows (500+ lines) | [View](./SYSTEM-ARCHITECTURE.md) |
| **[QUICK-REFERENCE.md](./QUICK-REFERENCE.md)** | 15 KB | One-page cheat sheet for devs | [View](./QUICK-REFERENCE.md) |
| **[README-ERD-PACKAGE.md](./README-ERD-PACKAGE.md)** | 35 KB | Detailed package documentation | [View](./README-ERD-PACKAGE.md) |

**Total:** 7 files, ~170 KB, 1500+ lines of comprehensive documentation

---

## 🎨 Visual Preview

### ERD Diagram (SVG)
Beautiful, scalable diagram with:
- ✅ 9 main entities + 2 embedded structures
- ✅ Color-coded relationships (Foreign Keys, Embedded, Approvals)
- ✅ Civic Green theme matching the system design
- ✅ Primary/Foreign key highlighting
- ✅ Complete legend and system notes

![ERD Preview](ERD-SK-System.svg)

---

## 🗃️ Database Overview

### 9 Main Tables

```
┌─────────────────────────────────────────────────────────────────┐
│  Table Name          │  Records/Year  │  Purpose                │
├──────────────────────┼────────────────┼─────────────────────────┤
│  users               │  3-10 total    │  SK official accounts   │
│  events              │  50-200        │  Activities & programs  │
│  fund_entries        │  100-500       │  Budget transactions    │
│  activity_proposals  │  20-50         │  Activity submissions   │
│  budget_proposals    │  10-30         │  Budget submissions     │
│  notifications       │  500-2000      │  System alerts          │
│  receipts            │  100-500       │  Expense documents      │
│  activity_logs       │  1000-5000     │  Audit trail            │
│  settings            │  1 (singleton) │  System config          │
└─────────────────────────────────────────────────────────────────┘
```

### Key Relationships
- **15+ Foreign Key relationships** for data integrity
- **2 Embedded JSON structures** for flexible document storage
- **Role-based approval workflows** (Chairperson approves proposals)
- **Complete audit trail** tracking all system actions

---

## ✨ Key Features

### 🔐 Security
- ✅ Row Level Security (RLS) policies for all tables
- ✅ Role-based access control (3 roles: Chairperson, Treasurer, Secretary)
- ✅ Password hashing requirements (bcrypt)
- ✅ Input validation at database level
- ✅ Audit logging for all actions

### 📊 Data Integrity
- ✅ Foreign key constraints
- ✅ Check constraints for validation
- ✅ Unique constraints on critical fields
- ✅ NOT NULL requirements
- ✅ Default values for timestamps

### ⚡ Performance
- ✅ 25+ strategic indexes for fast queries
- ✅ Optimized for common query patterns
- ✅ Timestamp auto-update triggers
- ✅ Utility functions for calculations
- ✅ Query performance < 100ms target

### 🌐 Public Transparency
- ✅ Public portal access (no login required)
- ✅ RLS policies for anonymous access
- ✅ Approved data automatically visible
- ✅ Privacy controls for pending data

---

## 🚀 Deployment

### Prerequisites
```bash
PostgreSQL 14+ or Supabase account
Database admin credentials
psql or Supabase SQL Editor
```

### Step 1: Create Database
```bash
# PostgreSQL
createdb sk_management_system

# Or use Supabase dashboard to create project
```

### Step 2: Run Migration
```bash
# PostgreSQL
psql -U postgres -d sk_management_system -f migration.sql

# Supabase
# 1. Open SQL Editor in Supabase dashboard
# 2. Copy contents of migration.sql
# 3. Paste and execute
```

### Step 3: Verify Installation
```sql
-- Check all tables created
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- Should return 9 tables:
-- users, events, fund_entries, activity_proposals,
-- budget_proposals, notifications, receipts,
-- activity_logs, settings

-- Check sample data
SELECT * FROM users;
-- Should return 3 test users (chairperson, treasurer, secretary)
```

### Step 4: Test Permissions
```sql
-- Switch to different roles and test RLS policies
SET ROLE authenticated;
SELECT * FROM events WHERE status = 'Upcoming';
-- Should work for authenticated users

SET ROLE anon;
SELECT * FROM events WHERE status = 'Upcoming';
-- Should work for public access
```

---

## 👥 User Roles & Permissions

### 🎖️ Chairperson (Admin)
**Username:** `sk_chair` | **Password:** `password123` (⚠️ change in production)

**Access:**
- ✅ Full read/write access to all data
- ✅ Approve/return activity proposals
- ✅ Approve/return budget proposals
- ✅ View activity logs
- ✅ Manage system settings
- ✅ Export all data

### 💰 Treasurer
**Username:** `sk_treasurer` | **Password:** `password123` (⚠️ change in production)

**Access:**
- ✅ Create/edit fund entries (income/expense)
- ✅ Upload receipts
- ✅ Submit budget proposals
- ✅ Generate financial reports
- ❌ Cannot approve proposals
- ❌ Cannot view activity logs

### 📝 Secretary
**Username:** `sk_secretary` | **Password:** `password123` (⚠️ change in production)

**Access:**
- ✅ Create/edit events
- ✅ Upload event documents
- ✅ Submit activity proposals
- ✅ Generate activity reports
- ❌ Cannot manage budget
- ❌ Cannot approve proposals

---

## 🔄 Workflow Examples

### Activity Proposal Workflow
```
1. Secretary creates activity proposal
   ↓ [status: pending]
2. Notification sent to Chairperson
   ↓
3. Chairperson reviews proposal
   ↓
   ├─→ APPROVE [status: approved] → Public portal
   │
   └─→ RETURN [status: returned] → Back to Secretary
       ↓
       Secretary revises and resubmits
       ↓ [status: pending]
       Back to step 2
```

### Budget Proposal Workflow
```
1. Treasurer creates budget proposal
   ↓ [status: pending]
2. Notification sent to Chairperson
   ↓
3. Chairperson reviews proposal
   ↓
   ├─→ APPROVE [status: approved] → Public portal
   │
   └─→ RETURN [status: returned] → Back to Treasurer
       ↓
       Treasurer revises and resubmits
       ↓ [status: pending]
       Back to step 2
```

---

## 📊 Common Queries

### Get Current Budget Balance
```sql
SELECT 
  SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) as balance
FROM fund_entries;
```

### Get Pending Approvals
```sql
SELECT 
  (SELECT COUNT(*) FROM activity_proposals WHERE status = 'pending') +
  (SELECT COUNT(*) FROM budget_proposals WHERE status = 'pending') 
AS total_pending;
```

### Get Upcoming Public Events
```sql
SELECT * FROM events 
WHERE status = 'Upcoming' 
  AND date >= CURRENT_DATE
ORDER BY date ASC;
```

### Get User Activity Log
```sql
SELECT 
  al.*,
  u.full_name,
  u.role
FROM activity_logs al
JOIN users u ON al.user_id = u.id
WHERE al.timestamp >= NOW() - INTERVAL '7 days'
ORDER BY al.timestamp DESC;
```

---

## 📖 Documentation Guide

### For First-Time Readers
1. Start with **[QUICK-REFERENCE.md](./QUICK-REFERENCE.md)** (5 min read)
2. View **[ERD-SK-System.svg](./ERD-SK-System.svg)** for visual overview
3. Read **[DATABASE-SCHEMA.md](./DATABASE-SCHEMA.md)** for detailed specs (30 min)
4. Review **[SYSTEM-ARCHITECTURE.md](./SYSTEM-ARCHITECTURE.md)** for context (20 min)

### For Developers
1. Review **[QUICK-REFERENCE.md](./QUICK-REFERENCE.md)** for common queries
2. Study **[migration.sql](./migration.sql)** for implementation details
3. Check RLS policies in **[DATABASE-SCHEMA.md](./DATABASE-SCHEMA.md)**
4. Run migration locally and test CRUD operations

### For Project Managers
1. View **[ERD-SK-System.svg](./ERD-SK-System.svg)** for high-level overview
2. Read **[README-ERD-PACKAGE.md](./README-ERD-PACKAGE.md)** for complete features
3. Review security checklist in **[SYSTEM-ARCHITECTURE.md](./SYSTEM-ARCHITECTURE.md)**
4. Plan deployment timeline and resource allocation

### For Stakeholders
1. Visual overview: **[ERD-SK-System.svg](./ERD-SK-System.svg)**
2. Public transparency features in **[DATABASE-SCHEMA.md](./DATABASE-SCHEMA.md)**
3. User roles and workflows in this README
4. Security and compliance in **[SYSTEM-ARCHITECTURE.md](./SYSTEM-ARCHITECTURE.md)**

---

## 🛠️ Tools & Resources

### Diagram Viewers
- **Mermaid Live Editor:** https://mermaid.live/
- **dbdiagram.io:** https://dbdiagram.io/
- **PlantUML Online:** https://www.plantuml.com/plantuml/uml/

### Database Tools
- **PostgreSQL:** https://www.postgresql.org/
- **Supabase:** https://supabase.com/
- **pgAdmin:** https://www.pgadmin.org/
- **DBeaver:** https://dbeaver.io/

### Documentation
- **PostgreSQL Docs:** https://www.postgresql.org/docs/
- **Supabase Docs:** https://supabase.com/docs
- **RLS Guide:** https://supabase.com/docs/guides/auth/row-level-security

---

## ✅ Pre-Production Checklist

### Database Setup
- [ ] Create production database
- [ ] Run migration.sql successfully
- [ ] Verify all 9 tables exist
- [ ] Check all 25+ indexes created
- [ ] Test RLS policies for each role

### Security
- [ ] Update default admin passwords
- [ ] Enable SSL/TLS for connections
- [ ] Configure firewall rules
- [ ] Set up API key rotation
- [ ] Enable database audit logging

### Backups
- [ ] Configure daily automated backups
- [ ] Set retention to 30 days minimum
- [ ] Test restore procedure
- [ ] Document recovery plan

### Performance
- [ ] Run VACUUM ANALYZE
- [ ] Test query performance (<100ms target)
- [ ] Enable connection pooling
- [ ] Load test with 100+ concurrent users

### Compliance
- [ ] Review data privacy policy
- [ ] Document data retention rules
- [ ] Configure logging for GDPR compliance
- [ ] Train staff on data handling

---

## 📊 System Stats

```
Total Tables:        9
Total Columns:       84
Total Indexes:       25+
Foreign Keys:        15+
RLS Policies:        20+
Embedded Structures: 2
Enum Types:          4

Estimated DB Size:
  Year 1: ~500 MB
  Year 3: ~1.5 GB
  Year 5: ~3 GB

Performance:
  Query Time: <100ms (indexed)
  Concurrent Users: 100+
  Uptime Target: 99.9%
```

---

## 🔄 Version History

| Version | Date | Changes |
|---------|------|---------|
| **1.0.0** | Dec 11, 2025 | ✅ Initial production release |
| | | • Complete ERD package |
| | | • 9 database tables |
| | | • RLS security policies |
| | | • Migration scripts |
| | | • Full documentation |

---

## 🤝 Contributing

### Found an Issue?
1. Check existing documentation
2. Review QUICK-REFERENCE.md for common solutions
3. Document the issue with:
   - Table name
   - Expected behavior
   - Actual behavior
   - Steps to reproduce

### Suggesting Improvements?
1. Ensure backward compatibility
2. Update relevant documentation
3. Test with all 3 user roles
4. Verify RLS policies still work

---

## 📞 Support

### Documentation Questions
- See **[README-ERD-PACKAGE.md](./README-ERD-PACKAGE.md)** for detailed package info
- Check **[QUICK-REFERENCE.md](./QUICK-REFERENCE.md)** for common patterns

### Database Issues
- Review **[DATABASE-SCHEMA.md](./DATABASE-SCHEMA.md)** for schema details
- Check **[migration.sql](./migration.sql)** for implementation

### Architecture Questions
- Read **[SYSTEM-ARCHITECTURE.md](./SYSTEM-ARCHITECTURE.md)** for system overview
- Review data flow examples and diagrams

---

## 📄 License

This database documentation package is proprietary to the SK Digital Management System.

- ✅ Internal use within your organization
- ✅ Share with contracted developers
- ✅ Modify for your specific needs
- ❌ Public redistribution not permitted

---

## 🎯 Next Steps

### Immediate Actions
1. ✅ Review all documentation files
2. ✅ Test migration.sql in development
3. ✅ Verify RLS policies work correctly
4. ✅ Train team on database structure

### Short-term (1-2 weeks)
1. 🔄 Deploy to staging environment
2. 🔄 Load test with sample data
3. 🔄 User acceptance testing (UAT)
4. 🔄 Security audit

### Long-term (1-3 months)
1. 📅 Production deployment
2. 📅 Monitor performance metrics
3. 📅 Regular backup testing
4. 📅 Optimize based on usage patterns

---

<div align="center">

## 🌟 Complete ERD Package - Production Ready

**All documentation files are complete and ready for deployment**

Made with ❤️ for the SK Digital Management System

---

[![View SVG](https://img.shields.io/badge/View-ERD%20Diagram-brightgreen)](./ERD-SK-System.svg)
[![Read Schema](https://img.shields.io/badge/Read-Database%20Schema-blue)](./DATABASE-SCHEMA.md)
[![Deploy](https://img.shields.io/badge/Deploy-migration.sql-orange)](./migration.sql)
[![Quick Ref](https://img.shields.io/badge/Quick-Reference-purple)](./QUICK-REFERENCE.md)

**Version 1.0.0** | December 11, 2025

</div>
