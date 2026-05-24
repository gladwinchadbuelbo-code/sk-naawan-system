# 🗄️ SK Digital Management System - Entity Relationship Diagram

## Mermaid ERD (Copy the code block below)

```mermaid
erDiagram
    USER ||--o{ ACTIVITY_PROPOSAL : "submits"
    USER ||--o{ BUDGET_PROPOSAL : "submits"
    USER ||--o{ ACTIVITY_PROPOSAL : "reviews"
    USER ||--o{ BUDGET_PROPOSAL : "reviews"
    USER ||--o{ ACTIVITY_LOG : "performs"
    USER ||--o{ EVENT : "creates"
    USER ||--o{ FUND_ENTRY : "creates"
    USER ||--o{ RECEIPT : "uploads"
    USER ||--o{ NOTIFICATION : "receives"
    
    RECEIPT ||--o{ FUND_ENTRY : "attached_to"
    
    EVENT ||--o{ DOCUMENT : "contains"
    BUDGET_PROPOSAL ||--o{ BUDGET_ITEM : "contains"

    USER {
        uuid id PK
        string username UK "unique login"
        string fullName
        string password "bcrypt hashed"
        enum role "chairperson | treasurer | secretary"
        timestamp createdAt
        timestamp lastLogin
    }

    EVENT {
        bigint id PK
        string title "min 3 chars"
        date date
        date endDate "optional"
        string venue
        string time
        decimal budget "amount"
        text description
        enum status "Planning | Upcoming | Completed | Cancelled"
        json assignedOfficials "user IDs array"
        json documents "embedded docs"
        timestamp createdAt
        timestamp updatedAt
        uuid createdBy FK
    }

    FUND_ENTRY {
        bigint id PK
        date date
        string category
        text description
        enum type "income | expense"
        decimal amount "positive only"
        string orNumber "optional for income"
        string supplier "optional"
        bigint receiptId FK
        timestamp createdAt
        uuid createdBy FK
    }

    ACTIVITY_PROPOSAL {
        bigint id PK
        string title "min 5 chars"
        text description "min 20 chars"
        date date
        string location
        decimal budget
        integer targetParticipants
        json requirements "string array"
        json attachments "file array"
        uuid submittedBy FK
        timestamp submittedDate
        enum status "pending | approved | returned"
        text comments "optional feedback"
        uuid reviewedBy FK
        timestamp reviewedDate
    }

    BUDGET_PROPOSAL {
        bigint id PK
        string title "min 5 chars"
        text description "min 20 chars"
        decimal totalAmount
        json items "budget items array"
        json attachments "file array"
        uuid submittedBy FK
        timestamp submittedDate
        enum status "pending | approved | returned"
        text comments "optional feedback"
        timestamp approvalDate
        uuid reviewedBy FK
    }

    NOTIFICATION {
        bigint id PK
        string type "notification category"
        string title
        text message
        timestamp timestamp
        boolean read "default false"
        enum recipientRole "optional role filter"
        uuid recipientId FK "optional user"
        string link "optional URL"
        json metadata "additional data"
    }

    RECEIPT {
        bigint id PK
        string fileName
        text fileUrl "storage URL or base64"
        timestamp uploadDate
        string category
        string orNumber UK "unique OR number"
        decimal amount
        string supplier
        uuid uploadedBy FK
    }

    ACTIVITY_LOG {
        bigint id PK
        string type "event | budget | proposal"
        string action "created | updated | deleted"
        text description "human readable"
        timestamp timestamp
        uuid userId FK
        json metadata "context data"
    }

    SETTINGS {
        string id PK "singleton: default"
        string skName
        string barangay
        string contactEmail
        string contactPhone
        string fiscalYear
        string logoUrl
        boolean publicPortalEnabled
        timestamp updatedAt
    }

    DOCUMENT {
        string name
        string data "base64 encoded"
        timestamp uploadedAt
        string uploadedBy "user ID"
    }

    BUDGET_ITEM {
        string category
        string description
        decimal amount
    }
```

---

## Alternative: PlantUML ERD (Copy the code block below)

```plantuml
@startuml SK_Digital_Management_ERD

!define primary_key(x) <b><color:#1BA160>PK: x</color></b>
!define foreign_key(x) <color:#A7E89F>FK: x</color>
!define unique(x) <color:#FF6B6B>UK: x</color>

skinparam linetype ortho
skinparam backgroundColor #F9FAFB
skinparam entity {
  BackgroundColor #FFFFFF
  BorderColor #0E6B3D
  FontColor #1F2937
}

entity "USER" as user {
  primary_key(id: UUID)
  unique(username: VARCHAR(50))
  fullName: VARCHAR(100)
  password: VARCHAR(255)
  role: ENUM
  createdAt: TIMESTAMP
  lastLogin: TIMESTAMP
  --
  Roles: chairperson, treasurer, secretary
}

entity "EVENT" as event {
  primary_key(id: BIGINT)
  title: VARCHAR(255)
  date: DATE
  endDate: DATE
  venue: VARCHAR(255)
  time: VARCHAR(50)
  budget: DECIMAL(10,2)
  description: TEXT
  status: ENUM
  assignedOfficials: JSONB
  documents: JSONB
  createdAt: TIMESTAMP
  updatedAt: TIMESTAMP
  foreign_key(createdBy: UUID)
  --
  Status: Planning, Upcoming, Completed, Cancelled
}

entity "FUND_ENTRY" as fund {
  primary_key(id: BIGINT)
  date: DATE
  category: VARCHAR(100)
  description: TEXT
  type: ENUM
  amount: DECIMAL(10,2)
  orNumber: VARCHAR(50)
  supplier: VARCHAR(255)
  foreign_key(receiptId: BIGINT)
  createdAt: TIMESTAMP
  foreign_key(createdBy: UUID)
  --
  Type: income, expense
}

entity "ACTIVITY_PROPOSAL" as activity_proposal {
  primary_key(id: BIGINT)
  title: VARCHAR(255)
  description: TEXT
  date: DATE
  location: VARCHAR(255)
  budget: DECIMAL(10,2)
  targetParticipants: INTEGER
  requirements: JSONB
  attachments: JSONB
  foreign_key(submittedBy: UUID)
  submittedDate: TIMESTAMP
  status: ENUM
  comments: TEXT
  foreign_key(reviewedBy: UUID)
  reviewedDate: TIMESTAMP
  --
  Status: pending, approved, returned
}

entity "BUDGET_PROPOSAL" as budget_proposal {
  primary_key(id: BIGINT)
  title: VARCHAR(255)
  description: TEXT
  totalAmount: DECIMAL(10,2)
  items: JSONB
  attachments: JSONB
  foreign_key(submittedBy: UUID)
  submittedDate: TIMESTAMP
  status: ENUM
  comments: TEXT
  approvalDate: TIMESTAMP
  foreign_key(reviewedBy: UUID)
  --
  Status: pending, approved, returned
}

entity "NOTIFICATION" as notification {
  primary_key(id: BIGINT)
  type: VARCHAR(50)
  title: VARCHAR(255)
  message: TEXT
  timestamp: TIMESTAMP
  read: BOOLEAN
  recipientRole: ENUM
  foreign_key(recipientId: UUID)
  link: VARCHAR(500)
  metadata: JSONB
}

entity "RECEIPT" as receipt {
  primary_key(id: BIGINT)
  fileName: VARCHAR(255)
  fileUrl: TEXT
  uploadDate: TIMESTAMP
  category: VARCHAR(100)
  unique(orNumber: VARCHAR(50))
  amount: DECIMAL(10,2)
  supplier: VARCHAR(255)
  foreign_key(uploadedBy: UUID)
}

entity "ACTIVITY_LOG" as activity_log {
  primary_key(id: BIGINT)
  type: VARCHAR(50)
  action: VARCHAR(50)
  description: TEXT
  timestamp: TIMESTAMP
  foreign_key(userId: UUID)
  metadata: JSONB
}

entity "SETTINGS" as settings {
  primary_key(id: VARCHAR(50))
  skName: VARCHAR(255)
  barangay: VARCHAR(255)
  contactEmail: VARCHAR(255)
  contactPhone: VARCHAR(50)
  fiscalYear: VARCHAR(20)
  logoUrl: TEXT
  publicPortalEnabled: BOOLEAN
  updatedAt: TIMESTAMP
  --
  Singleton table (id = 'default')
}

' Relationships
user ||--o{ activity_proposal : "submits"
user ||--o{ budget_proposal : "submits"
user ||--o{ activity_proposal : "reviews (chairperson)"
user ||--o{ budget_proposal : "reviews (chairperson)"
user ||--o{ activity_log : "performs"
user ||--o{ event : "creates"
user ||--o{ fund : "creates"
user ||--o{ receipt : "uploads"
user ||--o{ notification : "receives"

receipt ||--o{ fund : "attached to"

note right of user
  **Role-Based Access:**
  • Chairperson: Full access + approvals
  • Treasurer: Budget management
  • Secretary: Activity/event management
end note

note right of activity_proposal
  **Workflow:**
  Secretary → Submit
  Chairperson → Approve/Return
  Approved → Public Portal
end note

note right of fund
  **Validation:**
  • Expense requires OR Number
  • Amount must be positive
  • Receipt attachment for expenses
end note

@enduml
```

---

## Alternative: dbdiagram.io Code (Copy the code block below)

```dbdiagram
// SK Digital Management System - Entity Relationship Diagram
// Paste this code at: https://dbdiagram.io/

Table users {
  id uuid [pk, default: `uuid_generate_v4()`]
  username varchar(50) [unique, not null]
  full_name varchar(100) [not null]
  password varchar(255) [not null, note: 'bcrypt hashed']
  role varchar(20) [not null, note: 'chairperson | treasurer | secretary']
  created_at timestamp [default: `now()`]
  last_login timestamp
  
  indexes {
    username
    role
  }
  
  Note: 'SK official user accounts with role-based permissions'
}

Table events {
  id bigserial [pk]
  title varchar(255) [not null]
  date date [not null]
  end_date date
  venue varchar(255) [not null]
  time varchar(50) [not null]
  budget decimal(10,2) [not null]
  description text [not null]
  status varchar(20) [not null, default: 'Planning', note: 'Planning | Upcoming | Completed | Cancelled']
  assigned_officials jsonb [default: '[]']
  documents jsonb [default: '{"photos":[],"receipts":[],"attendance":null,"others":[]}']
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
  created_by uuid [ref: > users.id]
  
  indexes {
    status
    date
    created_by
  }
  
  Note: 'SK events and activities with scheduling and budget tracking'
}

Table fund_entries {
  id bigserial [pk]
  date date [not null]
  category varchar(100) [not null]
  description text [not null]
  type varchar(10) [not null, note: 'income | expense']
  amount decimal(10,2) [not null]
  or_number varchar(50)
  supplier varchar(255)
  receipt_id bigint [ref: > receipts.id]
  created_at timestamp [default: `now()`]
  created_by uuid [ref: > users.id]
  
  indexes {
    type
    category
    date
    created_by
  }
  
  Note: 'Income and expense transactions for budget management'
}

Table activity_proposals {
  id bigserial [pk]
  title varchar(255) [not null]
  description text [not null]
  date date [not null]
  location varchar(255) [not null]
  budget decimal(10,2) [not null]
  target_participants integer [not null]
  requirements jsonb [default: '[]']
  attachments jsonb [default: '[]']
  submitted_by uuid [not null, ref: > users.id]
  submitted_date timestamp [default: `now()`]
  status varchar(20) [not null, default: 'pending', note: 'pending | approved | returned']
  comments text
  reviewed_by uuid [ref: > users.id]
  reviewed_date timestamp
  
  indexes {
    status
    submitted_by
    reviewed_by
  }
  
  Note: 'Activity proposals submitted by Secretary for Chairperson approval'
}

Table budget_proposals {
  id bigserial [pk]
  title varchar(255) [not null]
  description text [not null]
  total_amount decimal(10,2) [not null]
  items jsonb [not null, default: '[]']
  attachments jsonb [default: '[]']
  submitted_by uuid [not null, ref: > users.id]
  submitted_date timestamp [default: `now()`]
  status varchar(20) [not null, default: 'pending', note: 'pending | approved | returned']
  comments text
  approval_date timestamp
  reviewed_by uuid [ref: > users.id]
  
  indexes {
    status
    submitted_by
    reviewed_by
  }
  
  Note: 'Budget proposals submitted by Treasurer for Chairperson approval'
}

Table notifications {
  id bigserial [pk]
  type varchar(50) [not null]
  title varchar(255) [not null]
  message text [not null]
  timestamp timestamp [default: `now()`]
  read boolean [default: false]
  recipient_role varchar(20)
  recipient_id uuid [ref: > users.id]
  link varchar(500)
  metadata jsonb [default: '{}']
  
  indexes {
    recipient_id
    read
    (timestamp, 'DESC')
  }
  
  Note: 'System notifications for approvals, comments, and updates'
}

Table receipts {
  id bigserial [pk]
  file_name varchar(255) [not null]
  file_url text [not null]
  upload_date timestamp [default: `now()`]
  category varchar(100) [not null]
  or_number varchar(50) [unique, not null]
  amount decimal(10,2) [not null]
  supplier varchar(255) [not null]
  uploaded_by uuid [ref: > users.id]
  
  indexes {
    or_number
    category
    uploaded_by
  }
  
  Note: 'Receipt documents for expense verification'
}

Table activity_logs {
  id bigserial [pk]
  type varchar(50) [not null]
  action varchar(50) [not null]
  description text [not null]
  timestamp timestamp [default: `now()`]
  user_id uuid [ref: > users.id]
  metadata jsonb [default: '{}']
  
  indexes {
    user_id
    (timestamp, 'DESC')
    type
  }
  
  Note: 'Audit trail of all system actions'
}

Table settings {
  id varchar(50) [pk, default: 'default']
  sk_name varchar(255) [not null]
  barangay varchar(255) [not null]
  contact_email varchar(255)
  contact_phone varchar(50)
  fiscal_year varchar(20) [not null]
  logo_url text
  public_portal_enabled boolean [default: true]
  updated_at timestamp [default: `now()`]
  
  Note: 'System-wide configuration (singleton table)'
}

// Relationships are defined using [ref: > table.column] above

// Additional relationship labels
Ref: users.id < activity_proposals.submitted_by [note: 'Secretary submits activity proposals']
Ref: users.id < activity_proposals.reviewed_by [note: 'Chairperson reviews/approves']
Ref: users.id < budget_proposals.submitted_by [note: 'Treasurer submits budget proposals']
Ref: users.id < budget_proposals.reviewed_by [note: 'Chairperson reviews/approves']
Ref: users.id < activity_logs.user_id [note: 'User performs actions']
```

---

## Alternative: Simple Text-Based ERD (ASCII)

```
╔════════════════════════════════════════════════════════════════════════╗
║                  SK DIGITAL MANAGEMENT SYSTEM - ERD                    ║
╚════════════════════════════════════════════════════════════════════════╝

┌─────────────────┐
│     USER        │
├─────────────────┤
│ PK id           │
│    username     │───┐
│    fullName     │   │
│    password     │   │ submits (1:N)
│    role         │   │
│    createdAt    │   │
│    lastLogin    │   │
└─────────────────┘   │
        │             │
        │ creates     ├──────────────────────┐
        │ (1:N)       │                      │
        │             │                      │
        ▼             ▼                      ▼
┌─────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│     EVENT       │ │ ACTIVITY_PROPOSAL│ │ BUDGET_PROPOSAL  │
├─────────────────┤ ├──────────────────┤ ├──────────────────┤
│ PK id           │ │ PK id            │ │ PK id            │
│    title        │ │    title         │ │    title         │
│    date         │ │    description   │ │    description   │
│    venue        │ │    date          │ │    totalAmount   │
│    budget       │ │    location      │ │    items (JSON)  │
│    status       │ │    budget        │ │    attachments   │
│    documents    │ │    requirements  │ │ FK submittedBy   │──┘
│ FK createdBy    │ │ FK submittedBy   │──┘ FK reviewedBy   │
└─────────────────┘ │ FK reviewedBy    │ │    status        │
                    │    status        │ └──────────────────┘
                    └──────────────────┘
        │
        │ uploads (1:N)
        │
        ▼
┌─────────────────┐         ┌─────────────────┐
│    RECEIPT      │────────>│  FUND_ENTRY     │
├─────────────────┤  1:N    ├─────────────────┤
│ PK id           │         │ PK id           │
│    fileName     │         │    date         │
│    fileUrl      │         │    category     │
│    orNumber     │         │    description  │
│    amount       │         │    type         │
│    supplier     │         │    amount       │
│ FK uploadedBy   │         │ FK receiptId    │
└─────────────────┘         │ FK createdBy    │
                            └─────────────────┘

        │
        │ receives (1:N)
        │
        ▼
┌─────────────────┐         ┌─────────────────┐
│  NOTIFICATION   │         │  ACTIVITY_LOG   │
├─────────────────┤         ├─────────────────┤
│ PK id           │         │ PK id           │
│    type         │         │    type         │
│    title        │         │    action       │
│    message      │         │    description  │
│    read         │         │    timestamp    │
│ FK recipientId  │<────────│ FK userId       │
└─────────────────┘  1:N    └─────────────────┘

┌─────────────────┐
│    SETTINGS     │
├─────────────────┤
│ PK id           │
│    skName       │
│    barangay     │
│    fiscalYear   │
│    logoUrl      │
└─────────────────┘

LEGEND:
━━━━━━
PK = Primary Key
FK = Foreign Key
───> = One-to-Many Relationship
```

---

## How to Use These Diagrams

### 1. **Mermaid (Recommended)**
- Copy the Mermaid code block
- Paste into GitHub README.md or any `.md` file
- Renders automatically on GitHub, GitLab, Notion, etc.
- Online editor: https://mermaid.live/

### 2. **PlantUML**
- Copy the PlantUML code
- Use online editor: https://www.plantuml.com/plantuml/uml/
- Or install PlantUML locally
- Export as PNG/SVG

### 3. **dbdiagram.io (Interactive)**
- Copy the dbdiagram code
- Go to: https://dbdiagram.io/
- Paste code in left panel
- Interactive, exportable ERD appears

### 4. **ASCII (Universal)**
- Copy ASCII diagram
- Paste anywhere (documentation, comments, emails)
- Works in all text editors

---

**Pro Tip:** For presentations, use dbdiagram.io for the most professional-looking, interactive ERD that you can export as PNG or PDF!
