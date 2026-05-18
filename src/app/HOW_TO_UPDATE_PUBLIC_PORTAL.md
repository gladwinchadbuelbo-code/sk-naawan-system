# 🛠️ How to Update the Public Portal

This guide shows you exactly where to update each part of the public portal.

---

## 📂 **File Locations**

All public portal files are in `/pages/`:

```
/pages/
├── LandingPage.tsx              → Main landing page (/)
├── PublicPortalPage.tsx         → Public homepage (/public)
├── PublicBudgetPage.tsx         → Budget transparency (/public/budget)
├── PublicActivitiesPage.tsx     → Activity reports (/public/activities)
├── PublicCalendarPage.tsx       → Event calendar (/public/calendar)
└── PublicSearchPage.tsx         → Search & downloads (/public/search)
```

---

## 🎨 **1. Landing Page** (`/pages/LandingPage.tsx`)

### **What You Can Update:**

#### **Hero Section (Lines ~30-50)**
```tsx
<h1 className="text-5xl mb-4">
  Sangguniang Kabataan  {/* ← Change title here */}
</h1>
<h2 className="text-3xl text-gray-700 mb-6">
  Integrated Digital Management System  {/* ← Change subtitle */}
</h2>
<p className="text-xl text-gray-600 max-w-3xl mx-auto">
  Comprehensive platform for...  {/* ← Change description */}
</p>
```

#### **Public Portal Card (Lines ~60-120)**
```tsx
<h2 className="text-2xl mb-4">Public Transparency Portal</h2>
<p className="text-gray-600 mb-6">
  Access budget reports...  {/* ← Update description */}
</p>

{/* Feature list - update these */}
<span className="text-sm">View Budget Transparency</span>
<span className="text-sm">Browse Activity Reports</span>
<span className="text-sm">View Event Calendar</span>
<span className="text-sm">Search Public Documents</span>
```

#### **Staff Login Card (Lines ~125-200)**
```tsx
{/* Update role descriptions */}
<p className="text-xs text-gray-500 mt-1">Full access & approvals</p>
<p className="text-xs text-gray-500 mt-1">Budget & expense management</p>
<p className="text-xs text-gray-500 mt-1">Event planning & documentation</p>
```

#### **About Section (Lines ~210-260)**
```tsx
<p className="text-gray-700 mb-6">
  The SK Integrated Digital Management System...  {/* ← Update about text */}
</p>
```

---

## 🏠 **2. Public Portal Homepage** (`/pages/PublicPortalPage.tsx`)

### **What You Can Update:**

#### **Statistics Cards (Lines ~120-160)**
```tsx
{/* Update these stats - they auto-calculate from data */}
<p className="text-3xl">₱{totalBudget.toLocaleString()}</p>
<p className="text-sm text-gray-500">Total Budget</p>

<p className="text-3xl">₱{totalExpenses.toLocaleString()}</p>
<p className="text-sm text-gray-500">Total Expenses</p>

<p className="text-3xl">{utilizationRate}%</p>
<p className="text-sm text-gray-500">Utilization Rate</p>
```

#### **Hero Text (Lines ~85-110)**
```tsx
<h1 className="text-5xl mb-4 text-white">
  Public Transparency Portal  {/* ← Change title */}
</h1>
<p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
  Access real-time information...  {/* ← Change description */}
</p>
```

#### **Quick Access Cards (Lines ~165-240)**
```tsx
{/* Budget Card */}
<h3 className="text-xl mb-2">Budget Transparency</h3>
<p className="text-gray-600 mb-4">
  View comprehensive budget reports...  {/* ← Update description */}
</p>

{/* Activities Card */}
<h3 className="text-xl mb-2">Activity Reports</h3>
<p className="text-gray-600 mb-4">
  Browse approved SK activities...  {/* ← Update description */}
</p>
```

#### **Recent Activities Section (Lines ~245-320)**
```tsx
<h2 className="text-3xl mb-6">Recent Approved Activities</h2>
{/* Activities are loaded from storage automatically */}
{/* To change the layout, modify the Card structure */}
```

#### **Transparency Statement (Lines ~400-450)**
```tsx
<p className="text-gray-700">
  This public transparency portal...  {/* ← Update statement */}
</p>
```

---

## 💰 **3. Budget Transparency Page** (`/pages/PublicBudgetPage.tsx`)

### **What You Can Update:**

#### **Header Section (Lines ~80-110)**
```tsx
<h1 className="text-4xl">Budget Transparency</h1>
<p className="text-xl text-gray-600 max-w-3xl">
  Complete overview of SK budget...  {/* ← Update description */}
</p>
```

#### **Budget Overview Cards (Lines ~115-170)**
```tsx
{/* These auto-calculate from storage data */}
<p className="text-3xl text-blue-600">₱{totalBudget.toLocaleString()}</p>
<p className="text-sm text-gray-500">Total Allocated Budget</p>

{/* To add new cards, copy this structure: */}
<Card className="p-6">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-500 mb-1">Your Label</p>
      <p className="text-3xl text-blue-600">Your Value</p>
    </div>
    <YourIcon className="w-12 h-12 text-blue-600" />
  </div>
</Card>
```

#### **Budget Categories (Lines ~45-60)**
```tsx
const budgetByCategory = useMemo(() => {
  const categories: { [key: string]: number } = {
    'Education': 0,
    'Sports': 0,
    'Community': 0,
    'Health': 0,
    'Others': 0,
    // ← Add new categories here
  };
  // ...
}, [funds]);
```

#### **Charts Section (Lines ~175-300)**
```tsx
{/* Pie Chart - auto-generates from categories */}
<PieChart>
  {/* Colors defined here: */}
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  {/* ← Add more colors for new categories */}
</PieChart>

{/* Bar Chart - auto-generates from data */}
<BarChart data={chartData}>
  {/* Customize bars here */}
  <Bar dataKey="income" fill="#10b981" />
  <Bar dataKey="expenses" fill="#ef4444" />
</BarChart>
```

#### **Budget Records Table (Lines ~310-400)**
```tsx
{/* Table columns - update headers */}
<th className="...">Date</th>
<th className="...">Description</th>
<th className="...">Category</th>
<th className="...">Type</th>
<th className="...">Amount</th>
```

---

## 📋 **4. Activity Reports Page** (`/pages/PublicActivitiesPage.tsx`)

### **What You Can Update:**

#### **Header (Lines ~40-70)**
```tsx
<h1 className="text-4xl">Activity Reports</h1>
<p className="text-xl text-gray-600">
  Browse approved SK activities...  {/* ← Update description */}
</p>
```

#### **Statistics Cards (Lines ~75-130)**
```tsx
{/* Auto-calculated from data */}
<p className="text-3xl text-blue-600">{approvedActivities.length}</p>
<p className="text-sm text-gray-500">Total Activities</p>

{/* Add new stat cards: */}
<Card className="p-6">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-500 mb-1">Your Stat Label</p>
      <p className="text-3xl text-blue-600">{yourValue}</p>
    </div>
    <YourIcon className="w-12 h-12 text-blue-600" />
  </div>
</Card>
```

#### **Activity Cards (Lines ~135-250)**
```tsx
{/* Activity card structure */}
<Card className="p-6">
  <h3 className="text-xl mb-2">{activity.title}</h3>
  <p className="text-gray-600 mb-4">{activity.description}</p>
  
  {/* Customize fields shown: */}
  <div className="grid grid-cols-2 gap-4">
    <div>
      <p className="text-xs text-gray-500">Date</p>
      <p className="text-sm">{activity.date}</p>
    </div>
    {/* ← Add more fields here */}
  </div>
</Card>
```

---

## 📅 **5. Event Calendar Page** (`/pages/PublicCalendarPage.tsx`)

### **What You Can Update:**

#### **Header (Lines ~120-145)**
```tsx
<h1 className="text-4xl">Event Calendar</h1>
<p className="text-xl text-gray-600">
  View all upcoming SK events...  {/* ← Update description */}
</p>
```

#### **Calendar Colors (Lines ~80-95)**
```tsx
const getEventColor = (type: string) => {
  switch (type?.toLowerCase()) {
    case 'sports':
      return 'bg-blue-500';
    case 'education':
      return 'bg-green-500';
    case 'community':
      return 'bg-purple-500';
    case 'health':
      return 'bg-red-500';
    // ← Add new event types and colors here
    default:
      return 'bg-gray-500';
  }
};
```

#### **Event Details Modal (Lines ~300-400)**
```tsx
{/* Customize what shows in modal */}
<h2 className="text-2xl mb-4">{selectedEvent.title}</h2>
<p className="text-gray-700 mb-4">{selectedEvent.description}</p>

{/* Add more fields: */}
<div className="space-y-3">
  <div>
    <p className="text-sm text-gray-500">Your Field</p>
    <p>{selectedEvent.yourField}</p>
  </div>
</div>
```

---

## 🔍 **6. Search & Downloads Page** (`/pages/PublicSearchPage.tsx`)

### **What You Can Update:**

#### **Document Categories (Lines ~20-80)**
```tsx
const documentCategories = [
  {
    id: 'liquidation',
    title: 'Liquidation Reports',
    icon: FileText,
    count: 12,
    description: 'Financial liquidation reports for completed activities'
  },
  // ← Add new categories here
  {
    id: 'custom',
    title: 'Your Category',
    icon: YourIcon,
    count: 0,
    description: 'Your description'
  },
];
```

#### **Popular Downloads (Lines ~85-140)**
```tsx
const popularDownloads = [
  {
    title: '2024 Annual Budget Report',
    type: 'PDF Document',
    size: '2.4 MB',
    downloads: 245,
    date: '2024-01-15'
  },
  // ← Add new documents here
  {
    title: 'Your Document',
    type: 'PDF Document',
    size: '1.0 MB',
    downloads: 0,
    date: '2024-12-03'
  },
];
```

#### **Search Filters (Lines ~250-320)**
```tsx
{/* Add more filter options */}
<select className="...">
  <option value="">All Categories</option>
  <option value="liquidation">Liquidation Reports</option>
  <option value="accomplishment">Accomplishment Reports</option>
  {/* ← Add new filter options */}
  <option value="custom">Your Category</option>
</select>
```

---

## 🎨 **Common Updates:**

### **Change Colors:**
All pages use Tailwind classes. Common colors used:

```tsx
// Primary Blue
className="bg-blue-600 text-white"
className="text-blue-600"

// Success Green
className="bg-green-600 text-white"
className="text-green-600"

// Warning Orange
className="bg-orange-600 text-white"

// Danger Red
className="bg-red-600 text-white"

// Purple
className="bg-purple-600 text-white"

// Gray (neutral)
className="bg-gray-100 text-gray-700"
```

### **Change Icons:**
All pages import from `lucide-react`:

```tsx
import { YourIcon } from 'lucide-react';

// Then use:
<YourIcon className="w-6 h-6" />
```

Common icons: `Shield`, `Eye`, `Calendar`, `Wallet`, `FileText`, `Download`, `Search`, `TrendingUp`, `Users`

### **Change Text:**
Just find the text in the file and update it:

```tsx
<h1>Your New Title</h1>
<p>Your new description</p>
```

---

## 🔧 **How to Make Updates:**

### **Step 1: Find the File**
Look in `/pages/` for the page you want to update

### **Step 2: Open the File**
Use the `read` tool to view the file content

### **Step 3: Make Changes**
Use `fast_apply_tool` or `edit_tool` to update specific sections

### **Step 4: Test**
Navigate to the page in your app to see the changes

---

## 📝 **Quick Reference:**

| What to Update | File | Approximate Lines |
|----------------|------|-------------------|
| **Landing page cards** | `LandingPage.tsx` | 60-200 |
| **Portal homepage hero** | `PublicPortalPage.tsx` | 85-110 |
| **Budget statistics** | `PublicBudgetPage.tsx` | 115-170 |
| **Budget categories** | `PublicBudgetPage.tsx` | 45-60 |
| **Activity cards** | `PublicActivitiesPage.tsx` | 135-250 |
| **Calendar colors** | `PublicCalendarPage.tsx` | 80-95 |
| **Document categories** | `PublicSearchPage.tsx` | 20-80 |
| **Popular downloads** | `PublicSearchPage.tsx` | 85-140 |

---

## 💡 **Pro Tips:**

1. **Data comes from storage** - Most content is auto-loaded from `/utils/storage.ts`
2. **Update text/styling** - You can change descriptions, colors, layouts
3. **Add new sections** - Copy existing Card structures
4. **Test changes** - Always test in the browser after updates
5. **Keep consistent** - Match the existing design style

---

## 🎯 **Common Update Scenarios:**

### **Scenario 1: Change Portal Description**
- **File:** `/pages/PublicPortalPage.tsx`
- **Find:** Hero section around line 90-100
- **Update:** The `<p>` tag with description text

### **Scenario 2: Add New Budget Category**
- **File:** `/pages/PublicBudgetPage.tsx`
- **Find:** `budgetByCategory` function around line 45-60
- **Add:** New category to the object

### **Scenario 3: Change Event Calendar Colors**
- **File:** `/pages/PublicCalendarPage.tsx`
- **Find:** `getEventColor` function around line 80-95
- **Update:** Color classes for each type

### **Scenario 4: Add New Document Category**
- **File:** `/pages/PublicSearchPage.tsx`
- **Find:** `documentCategories` array around line 20-80
- **Add:** New object to the array

### **Scenario 5: Update Landing Page Features**
- **File:** `/pages/LandingPage.tsx`
- **Find:** Feature list in Public Portal card around line 80-120
- **Update:** The `<span>` tags with feature text

---

## ✅ **Need Help?**

Just tell me:
1. **Which page** you want to update (Landing, Budget, Activities, etc.)
2. **What you want to change** (text, colors, layout, add section, etc.)
3. I'll help you make the update!

---

**All files are ready to customize! 🎨**
