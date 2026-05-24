# 🗺️ Public Portal - Complete Visual Map

## 🌐 **URL Structure & File Mapping**

```
PUBLIC ACCESS (No Login Required)
├── / (Landing Page)
│   └── File: /pages/LandingPage.tsx
│   └── Shows: Two cards - Public Portal & Staff Login
│
├── /public (Portal Homepage)
│   └── File: /pages/PublicPortalPage.tsx
│   └── Shows: Hero, Stats, Quick Links, Recent Activities
│
├── /public/budget (Budget Transparency)
│   └── File: /pages/PublicBudgetPage.tsx
│   └── Shows: Budget Overview, Charts, Records, Proposals
│
├── /public/activities (Activity Reports)
│   └── File: /pages/PublicActivitiesPage.tsx
│   └── Shows: Statistics, Activity Cards, Search
│
├── /public/calendar (Event Calendar)
│   └── File: /pages/PublicCalendarPage.tsx
│   └── Shows: Monthly Calendar, Events, Upcoming List
│
└── /public/search (Search & Downloads)
    └── File: /pages/PublicSearchPage.tsx
    └── Shows: Search Bar, Categories, Popular Downloads

STAFF ACCESS (Login Required)
└── /login → /staff/* 
    └── Files: Various staff pages
    └── Access: SK President, Treasurer, Secretary only
```

---

## 📍 **Navigation Flow**

### **User Journey Map:**

```
┌─────────────────────────────────────────────────────────────┐
│                     OPEN APP (/)                            │
│                  ↓                                          │
│            LANDING PAGE                                     │
│   ┌──────────────────────┐    ┌──────────────────────┐    │
│   │  PUBLIC PORTAL       │    │   STAFF LOGIN        │    │
│   │  (Click to enter)    │    │   (Click to login)   │    │
│   └──────────┬───────────┘    └───────────┬──────────┘    │
└──────────────┼────────────────────────────┼────────────────┘
               │                             │
               ↓                             ↓
    ┌──────────────────────┐      ┌──────────────────────┐
    │  PUBLIC PORTAL HOME  │      │    LOGIN PAGE        │
    │    (/public)         │      │    (/login)          │
    └──────────┬───────────┘      └───────────┬──────────┘
               │                               │
               ↓                               ↓
    ┌──────────────────────┐      ┌──────────────────────┐
    │  • Budget            │      │  STAFF DASHBOARD     │
    │  • Activities        │      │  (/staff/dashboard)  │
    │  • Calendar          │      │                      │
    │  • Search            │      │  Full System Access  │
    └──────────────────────┘      └──────────────────────┘
```

---

## 🎯 **Page-by-Page Breakdown**

### **1. Landing Page** (`/`)

```
┌───────────────────────────────────────────────────────────┐
│  HEADER: SK Digital Management System                     │
├───────────────────────────────────────────────────────────┤
│                                                           │
│  🛡️ HERO SECTION                                          │
│  - SK Logo & Title                                        │
│  - "Integrated Digital Management System"                 │
│  - Description paragraph                                  │
│                                                           │
├─────────────────────────┬─────────────────────────────────┤
│  👁️ PUBLIC PORTAL       │  🔒 STAFF LOGIN                │
│  ───────────────────────│  ───────────────────────────   │
│  Features:              │  Roles:                        │
│  ✓ Budget Transparency  │  • SK President (Admin)        │
│  ✓ Activity Reports     │  • SK Treasurer (Finance)      │
│  ✓ Event Calendar       │  • SK Secretary (Activities)   │
│  ✓ Search Documents     │                                │
│                         │                                │
│  [Enter Public Portal]  │  [Staff Login]                 │
│  No login required 🔓   │  Authorized only 🔐            │
├─────────────────────────┴─────────────────────────────────┤
│  ABOUT SECTION                                            │
│  - System description                                     │
│  - 3 pillars: Secure, Transparent, Compliant             │
├───────────────────────────────────────────────────────────┤
│  FOOTER                                                   │
└───────────────────────────────────────────────────────────┘

File: /pages/LandingPage.tsx
Update: Hero text, feature lists, about section
```

---

### **2. Public Portal Homepage** (`/public`)

```
┌───────────────────────────────────────────────────────────┐
│  HEADER: Public Transparency Portal (with back to home)  │
├───────────────────────────────────────────────────────────┤
│  🌟 HERO SECTION (Blue Gradient)                         │
│  - "Public Transparency Portal"                           │
│  - Description paragraph                                  │
│  - [Search Bar] → redirects to /public/search            │
├───────────────────────────────────────────────────────────┤
│  📊 STATISTICS (4 Cards)                                 │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐           │
│  │ Total  │ │ Total  │ │Utiliza-│ │ Total  │           │
│  │ Budget │ │Expenses│ │  tion  │ │Activity│           │
│  └────────┘ └────────┘ └────────┘ └────────┘           │
├───────────────────────────────────────────────────────────┤
│  🎯 QUICK ACCESS (4 Cards)                               │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│  │💰Budget │ │📋Activity│ │📅Calendar│ │📥Download│       │
│  │Transpar-│ │ Reports │ │         │ │         │       │
│  │  ency   │ │         │ │         │ │         │       │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘       │
├───────────────────────────────────────────────────────────┤
│  📋 RECENT APPROVED ACTIVITIES                           │
│  - List of 3 most recent activities                      │
│  - Title, date, description, budget                      │
├───────────────────────────────────────────────────────────┤
│  📅 UPCOMING EVENTS                                      │
│  - Next 3 scheduled events                               │
│  - Date, time, location, participants                    │
├───────────────────────────────────────────────────────────┤
│  ℹ️ TRANSPARENCY STATEMENT                               │
│  - Information about transparency policy                  │
│  - Last updated date                                     │
├───────────────────────────────────────────────────────────┤
│  FOOTER                                                   │
└───────────────────────────────────────────────────────────┘

File: /pages/PublicPortalPage.tsx
Data: Auto-loaded from storage
Update: Hero text, stats display, quick links, statements
```

---

### **3. Budget Transparency Page** (`/public/budget`)

```
┌───────────────────────────────────────────────────────────┐
│  HEADER: Budget Transparency                              │
│  - Breadcrumb: Public Portal > Budget                    │
├───────────────────────────────────────────────────────────┤
│  📊 BUDGET OVERVIEW (4 Cards)                            │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐        │
│  │Total Budget │ │Total Expenses│ │  Available  │        │
│  │₱XXX,XXX     │ │₱XXX,XXX      │ │  ₱XX,XXX    │        │
│  └─────────────┘ └─────────────┘ └─────────────┘        │
├───────────────────────────────────────────────────────────┤
│  📈 CHARTS (Side by Side)                                │
│  ┌──────────────────┐  ┌──────────────────┐             │
│  │   PIE CHART      │  │   BAR CHART      │             │
│  │                  │  │                  │             │
│  │ Budget by        │  │ Income vs        │             │
│  │ Category         │  │ Expenses         │             │
│  └──────────────────┘  └──────────────────┘             │
│                                                           │
│  Legend: Education, Sports, Community, Health, Others    │
├───────────────────────────────────────────────────────────┤
│  📋 BUDGET RECORDS TABLE                                 │
│  ┌────┬─────────────┬──────────┬──────┬────────┐        │
│  │Date│Description  │Category  │ Type │ Amount │        │
│  ├────┼─────────────┼──────────┼──────┼────────┤        │
│  │... │...          │...       │...   │...     │        │
│  └────┴─────────────┴──────────┴──────┴────────┘        │
├───────────────────────────────────────────────────────────┤
│  📝 APPROVED BUDGET PROPOSALS                            │
│  - List of approved proposals                            │
│  - Title, amount, status, approval date                  │
├───────────────────────────────────────────────────────────┤
│  FOOTER                                                   │
└───────────────────────────────────────────────────────────┘

File: /pages/PublicBudgetPage.tsx
Data: Auto-calculated from storage funds & proposals
Update: Categories, chart colors, table columns
```

---

### **4. Activity Reports Page** (`/public/activities`)

```
┌───────────────────────────────────────────────────────────┐
│  HEADER: Activity Reports                                 │
│  - Breadcrumb: Public Portal > Activities                │
├───────────────────────────────────────────────────────────┤
│  📊 STATISTICS (4 Cards)                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │  Total   │ │Completed │ │  Total   │ │ Avg Cost │   │
│  │Activities│ │Activities│ │Participants│ │ per Act  │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
├───────────────────────────────────────────────────────────┤
│  📋 APPROVED ACTIVITIES (Cards Grid)                     │
│                                                           │
│  ┌──────────────────────────────────────────┐            │
│  │ Activity Title                           │            │
│  │ ──────────────────────────────────────── │            │
│  │ Description paragraph                    │            │
│  │                                          │            │
│  │ Date: XXX | Category: XXX                │            │
│  │ Participants: XXX | Budget: ₱XX,XXX      │            │
│  │                                          │            │
│  │ Objectives: • Point 1 • Point 2          │            │
│  │                                          │            │
│  │ Status: [Approved] [View Details]        │            │
│  └──────────────────────────────────────────┘            │
│                                                           │
│  (Multiple activity cards in grid layout)                │
├───────────────────────────────────────────────────────────┤
│  FOOTER                                                   │
└───────────────────────────────────────────────────────────┘

File: /pages/PublicActivitiesPage.tsx
Data: Auto-loaded from approved activity proposals
Update: Stats display, card layout, fields shown
```

---

### **5. Event Calendar Page** (`/public/calendar`)

```
┌───────────────────────────────────────────────────────────┐
│  HEADER: Event Calendar                                   │
│  - Breadcrumb: Public Portal > Calendar                  │
├───────────────────────────────────────────────────────────┤
│  CONTENT (Split Layout)                                   │
│  ┌─────────────────────────┬───────────────────────────┐ │
│  │  CALENDAR VIEW          │  UPCOMING EVENTS          │ │
│  │  ─────────────────────  │  ─────────────────────    │ │
│  │  < December 2024 >      │                           │ │
│  │                         │  ┌──────────────────────┐ │ │
│  │  Su Mo Tu We Th Fr Sa   │  │ Dec 15 | Sports Day  │ │ │
│  │   1  2  3  4  5  6  7   │  │ 9:00 AM | 150 pax    │ │ │
│  │   8  9 10 11 12 13 14   │  └──────────────────────┘ │ │
│  │  15[16]17 18 19 20 21   │                           │ │
│  │  22 23 24 25 26 27 28   │  ┌──────────────────────┐ │ │
│  │  29 30 31               │  │ Dec 20 | Health Sem  │ │ │
│  │                         │  │ 2:00 PM | 80 pax     │ │ │
│  │  Legend:                │  └──────────────────────┘ │ │
│  │  🔵 Sports              │                           │ │
│  │  🟢 Education           │  (List continues...)      │ │
│  │  🟣 Community           │                           │ │
│  │  🔴 Health              │  Total: XX events         │ │
│  └─────────────────────────┴───────────────────────────┘ │
├───────────────────────────────────────────────────────────┤
│  EVENT DETAILS MODAL (when date clicked)                 │
│  ┌─────────────────────────────────────────────────┐     │
│  │  Event Title                                    │     │
│  │  ────────────────────────────────────────────   │     │
│  │  📅 Date & Time                                 │     │
│  │  📍 Location                                    │     │
│  │  👥 Expected Participants                       │     │
│  │  💰 Budget                                      │     │
│  │  📝 Description                                 │     │
│  │                                                 │     │
│  │  [Close]                                        │     │
│  └─────────────────────────────────────────────────┘     │
├───────────────────────────────────────────────────────────┤
│  FOOTER                                                   │
└───────────────────────────────────────────────────────────┘

File: /pages/PublicCalendarPage.tsx
Data: Auto-loaded from approved events
Update: Calendar colors, event types, modal fields
```

---

### **6. Search & Downloads Page** (`/public/search`)

```
┌───────────────────────────────────────────────────────────┐
│  HEADER: Search & Downloads                               │
│  - Breadcrumb: Public Portal > Search                    │
├───────────────────────────────────────────────────────────┤
│  🔍 SEARCH BAR                                           │
│  ┌─────────────────────────────────────────────────┐     │
│  │ 🔍 Search documents, activities, reports...     │     │
│  └─────────────────────────────────────────────────┘     │
│                                                           │
│  Filters: [All Categories ▼] [All Types ▼] [Sort by ▼]  │
├───────────────────────────────────────────────────────────┤
│  📚 DOCUMENT CATEGORIES (Grid of Cards)                  │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐     │
│  │📄 Liquidation│ │📋Accomplishm │ │📝 Budget     │     │
│  │   Reports    │ │   Reports    │ │  Proposals   │     │
│  │   12 docs    │ │   8 docs     │ │  15 docs     │     │
│  └──────────────┘ └──────────────┘ └──────────────┘     │
│                                                           │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐     │
│  │📅 Activity   │ │📊 Financial  │ │📑 Other      │     │
│  │  Proposals   │ │  Reports     │ │  Documents   │     │
│  │   20 docs    │ │   6 docs     │ │  10 docs     │     │
│  └──────────────┘ └──────────────┘ └──────────────┘     │
├───────────────────────────────────────────────────────────┤
│  ⭐ POPULAR DOWNLOADS                                    │
│  ┌────────────────────────────────────────────────┐      │
│  │ 📄 2024 Annual Budget Report                   │      │
│  │ PDF Document • 2.4 MB • 245 downloads          │      │
│  │ [Download]                                     │      │
│  ├────────────────────────────────────────────────┤      │
│  │ 📄 Q4 2024 Accomplishment Report               │      │
│  │ PDF Document • 1.8 MB • 189 downloads          │      │
│  │ [Download]                                     │      │
│  ├────────────────────────────────────────────────┤      │
│  │ (More documents...)                            │      │
│  └────────────────────────────────────────────────┘      │
├───────────────────────────────────────────────────────────┤
│  FOOTER                                                   │
└───────────────────────────────────────────────────────────┘

File: /pages/PublicSearchPage.tsx
Data: Document listings defined in component
Update: Categories, popular downloads, filters
```

---

## 🎨 **Design System**

### **Color Palette:**
```
Primary Blue:   #3b82f6 (bg-blue-600)
Success Green:  #10b981 (bg-green-600)
Warning Orange: #f59e0b (bg-orange-600)
Danger Red:     #ef4444 (bg-red-600)
Purple:         #8b5cf6 (bg-purple-600)
Gray:           #6b7280 (bg-gray-600)
```

### **Common Components:**
- **Cards**: White background, rounded corners, shadow
- **Buttons**: Primary (blue), Secondary (outline), Success (green)
- **Badges**: Colored pills for status/categories
- **Icons**: From lucide-react library

### **Typography:**
- **Headings**: Large, bold, dark gray
- **Body**: Regular weight, medium gray
- **Small text**: Lighter gray for secondary info

---

## 🔗 **Navigation Structure**

### **Public Header (All Public Pages):**
```
┌─────────────────────────────────────────────────────┐
│ 🛡️ SK Public Portal            [🏠 Home] [🔍]      │
└─────────────────────────────────────────────────────┘
```

### **Breadcrumbs (Sub-pages):**
```
Public Portal > Budget Transparency
Public Portal > Activity Reports
Public Portal > Event Calendar
Public Portal > Search & Downloads
```

### **Footer (All Pages):**
```
┌─────────────────────────────────────────────────────┐
│  © 2025 Sangguniang Kabataan                        │
│  All information displayed is public record         │
└─────────────────────────────────────────────────────┘
```

---

## 📊 **Data Flow**

```
Storage (/utils/storage.ts)
        ↓
    Public Pages
        ↓
Auto-filter for "approved" only
        ↓
    Display to Public
```

### **What Data Shows:**
- ✅ **Approved** activity proposals
- ✅ **Approved** budget proposals  
- ✅ **All** events (except Planning status)
- ✅ **All** funds (income/expense records)

### **What Data Hides:**
- ❌ Pending proposals
- ❌ Rejected proposals
- ❌ Draft/Planning events
- ❌ Internal comments/revisions

---

## 🎯 **Quick Navigation Cheat Sheet**

| I want to see... | Go to... | File to update |
|------------------|----------|----------------|
| **Landing page** | `/` | `LandingPage.tsx` |
| **Portal home** | `/public` | `PublicPortalPage.tsx` |
| **Budget info** | `/public/budget` | `PublicBudgetPage.tsx` |
| **Activities** | `/public/activities` | `PublicActivitiesPage.tsx` |
| **Event dates** | `/public/calendar` | `PublicCalendarPage.tsx` |
| **Search docs** | `/public/search` | `PublicSearchPage.tsx` |
| **Staff login** | `/login` | `LoginPage.tsx` |

---

## ✅ **Complete Feature List**

### **Landing Page:**
- ✅ Hero section with branding
- ✅ Two-card choice (Public vs Staff)
- ✅ Feature highlights
- ✅ About section
- ✅ Responsive design

### **Public Portal Homepage:**
- ✅ Hero with search
- ✅ Real-time statistics (4 cards)
- ✅ Quick access buttons (4 cards)
- ✅ Recent activities (3 items)
- ✅ Upcoming events (3 items)
- ✅ Transparency statement

### **Budget Page:**
- ✅ Budget overview (4 cards)
- ✅ Pie chart (by category)
- ✅ Bar chart (income vs expenses)
- ✅ Budget records table
- ✅ Approved proposals list

### **Activities Page:**
- ✅ Statistics dashboard (4 cards)
- ✅ Activity cards grid
- ✅ Search/filter functionality
- ✅ Detailed activity info

### **Calendar Page:**
- ✅ Monthly calendar view
- ✅ Events on dates
- ✅ Color-coded by type
- ✅ Upcoming events sidebar
- ✅ Event details modal

### **Search Page:**
- ✅ Universal search bar
- ✅ Document categories (6 cards)
- ✅ Popular downloads list
- ✅ Advanced filters
- ✅ Download buttons

---

**This is your complete public portal system! 🎉**

All 6 pages are fully implemented and ready to use!
