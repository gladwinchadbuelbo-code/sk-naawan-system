# 📅 How to Upload/Create Events - Complete Guide

## 🎯 **Quick Answer:**

### **Public Portal (Read-Only)**
❌ **Public users CANNOT upload events**
- The public portal is **read-only**
- Public users can only **view** approved events
- No login = No upload capability

### **Staff Dashboard (Create Events)**
✅ **Staff members CAN create events**
- SK President, Treasurer, and Secretary can create events
- Access through the staff dashboard
- Events are then visible on the public portal

---

## 🔐 **WHO Can Upload Events?**

| User Type | Can Upload? | Access Method |
|-----------|-------------|---------------|
| **Public Users** | ❌ No | View only via `/public/calendar` |
| **SK President** | ✅ Yes | Staff Dashboard → Events page |
| **SK Treasurer** | ✅ Yes | Staff Dashboard → Events page |
| **SK Secretary** | ✅ Yes | Staff Dashboard → Events page |

---

## 📍 **WHERE to Create Events (Staff Only)**

### **Navigation Path:**

```
1. Go to Landing Page (/)
   ↓
2. Click "Staff Login" card
   ↓
3. Login with credentials:
   - SK President (username: president, password: admin123)
   - SK Treasurer (username: treasurer, password: treasurer123)
   - SK Secretary (username: secretary, password: secretary123)
   ↓
4. You'll land on Staff Dashboard
   ↓
5. Click "Events & Programs" card
   OR click "Events" in the sidebar
   ↓
6. Click "Create Event" button (+ icon)
   ↓
7. Fill out the event form
   ↓
8. Click "Create Event" button
   ↓
9. Event is created! ✅
```

---

## 🗺️ **Visual Navigation Map:**

```
┌─────────────────────────────────────────────────────────┐
│                    LANDING PAGE (/)                      │
└────────────────────┬────────────────────────────────────┘
                     │
              Click "Staff Login"
                     ↓
┌─────────────────────────────────────────────────────────┐
│                   LOGIN PAGE (/login)                    │
│  Enter credentials for President/Treasurer/Secretary    │
└────────────────────┬────────────────────────────────────┘
                     │
                Login Success
                     ↓
┌─────────────────────────────────────────────────────────┐
│            STAFF DASHBOARD (/staff/dashboard)            │
│                                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │  Budget  │ │  EVENTS  │ │ Reports  │ │Approvals │  │
│  │  Mgmt    │ │    &     │ │          │ │          │  │
│  │          │ │ Programs │ │          │ │          │  │
│  └──────────┘ └────┬─────┘ └──────────┘ └──────────┘  │
│                     │                                    │
└─────────────────────┼────────────────────────────────────┘
                      │
              Click Events Card
                      ↓
┌─────────────────────────────────────────────────────────┐
│              EVENTS PAGE (/staff/events)                 │
│                                                          │
│  [+ Create Event] ← Click this button                   │
│                                                          │
│  Calendar View with All Events                          │
│  List of Events with Edit/View options                  │
└─────────────────────────────────────────────────────────┘
                      │
           Click "+ Create Event"
                      ↓
┌─────────────────────────────────────────────────────────┐
│              CREATE EVENT MODAL                          │
│  ──────────────────────────────────────────────────     │
│  Event Title: [________________]                        │
│  Start Date:  [________________]                        │
│  End Date:    [________________]                        │
│  Venue:       [________________]                        │
│  Time:        [________________]                        │
│  Budget:      [________________]                        │
│  Description: [________________]                        │
│  Officials:   [Select ▼]                                │
│                                                          │
│  [Cancel]  [Create Event]                               │
└─────────────────────────────────────────────────────────┘
                      │
           Click "Create Event"
                      ↓
                EVENT CREATED! ✅
                      │
                      ├─→ Appears on Staff Events Page
                      ├─→ Appears on Public Portal Calendar
                      └─→ Visible to all public users
```

---

## 📝 **Step-by-Step Instructions:**

### **Step 1: Access Staff Dashboard**
1. Open your app
2. On landing page, click **"Staff Login"** (green card on right)
3. Login with one of these accounts:

**Default Staff Accounts:**
```
SK President:
- Username: president
- Password: admin123
- Role: Full access

SK Treasurer:
- Username: treasurer  
- Password: treasurer123
- Role: Financial management

SK Secretary:
- Username: secretary
- Password: secretary123
- Role: Activities & events
```

---

### **Step 2: Navigate to Events Page**

**Option A: From Dashboard Cards**
- Click the **"Events & Programs"** card
- Located in the middle of the dashboard

**Option B: From Sidebar**
- Click **"Events"** in the left sidebar
- Icon: 📅 Calendar

---

### **Step 3: Create New Event**

1. **Click the "+ Create Event" button**
   - Located at the top-right of the Events page
   - Blue button with plus icon

2. **Fill out the event form:**

   **Required Fields:**
   ```
   Event Title: 
   - Name of your event
   - Example: "Youth Leadership Summit"
   
   Start Date:
   - When the event begins
   - Format: YYYY-MM-DD
   
   Venue:
   - Location of the event
   - Example: "Barangay Hall"
   
   Time:
   - Event time
   - Example: "9:00 AM - 5:00 PM"
   
   Budget:
   - Estimated cost in PHP
   - Example: 50000
   
   Description:
   - Brief description of the event
   - Purpose and activities
   
   Assigned Officials:
   - Select responsible staff member
   ```

3. **Click "Create Event"**
   - Event will be saved
   - Toast notification appears: "Event created successfully"

---

### **Step 4: Verify Event Creation**

**Where to Check:**

1. **Staff Events Page** (`/staff/events`)
   - Your event appears in the calendar
   - Shows in the events list
   - Status: "Planning" (default for new events)

2. **Public Portal Calendar** (`/public/calendar`)
   - Event is visible to public users
   - Shows on the calendar date
   - Public can view event details

---

## 🎨 **Event Form Fields Explained:**

| Field | Required? | Description | Example |
|-------|-----------|-------------|---------|
| **Event Title** | ✅ Yes | Name of the event | "Clean-up Drive 2024" |
| **Start Date** | ✅ Yes | Event start date | 2024-12-15 |
| **End Date** | ❌ Optional | Multi-day event end date | 2024-12-16 |
| **Venue** | ✅ Yes | Location | "Barangay Basketball Court" |
| **Time** | ✅ Yes | Time schedule | "8:00 AM - 12:00 PM" |
| **Budget** | ✅ Yes | Estimated cost (₱) | 25000 |
| **Description** | ✅ Yes | Event details | "Community clean-up with 100 volunteers" |
| **Assigned Officials** | ✅ Yes | Responsible person | "SK Secretary" |

---

## 📊 **Event Status Flow:**

```
Planning → Upcoming → Completed → [Need Reports]
   ↓           ↓          ↓              ↓
New event   Approved   Event    Liquidation &
created     & ready    finished  Accomplishment
                                  Reports
```

**Status Types:**
- 🟡 **Planning** - Draft/being planned
- 🔵 **Upcoming** - Confirmed and scheduled
- 🟢 **Completed** - Event has finished
- 🔴 **Cancelled** - Event was cancelled

---

## 🔄 **What Happens After Creating an Event?**

### **1. Event is Saved**
- Stored in local storage
- File: `/utils/storage.ts`
- Function: `setEvents()`

### **2. Event Appears in Multiple Places:**

**Staff Side:**
- ✅ Staff Events Page (`/staff/events`)
- ✅ Staff Dashboard (upcoming events section)
- ✅ Staff Calendar view

**Public Side:**
- ✅ Public Portal Calendar (`/public/calendar`)
- ✅ Public Portal Homepage (upcoming events)
- ✅ Available to all public users

### **3. Activity Log Entry Created**
- Records who created the event
- Timestamp of creation
- Viewable in Activity Log page

---

## ⚙️ **Event Management Options:**

After creating an event, staff can:

| Action | How to Do It | Permission Needed |
|--------|--------------|-------------------|
| **View Details** | Click event → View Details | All staff |
| **Edit Event** | Click Edit icon (pencil) | Creator or President |
| **Cancel Event** | Edit → Change status to "Cancelled" | President |
| **Track Attendance** | Event Details → Attendance | All staff |
| **Upload Photos** | Event Details → Upload Photos | All staff |
| **Generate Report** | After event → Reports module | All staff |

---

## 📂 **Related Files:**

| What | File Location | Purpose |
|------|---------------|---------|
| **Events Page** | `/pages/EventsPage.tsx` | Main events management page |
| **Event Details** | `/pages/EventDetailsPage.tsx` | Individual event view |
| **Attendance** | `/pages/AttendanceTrackingPage.tsx` | Track participants |
| **Storage Utils** | `/utils/storage.ts` | Data persistence |
| **Public Calendar** | `/pages/PublicCalendarPage.tsx` | Public view of events |

---

## 🚨 **Important Notes:**

### **Public Portal Limitations:**
❌ **Public users CANNOT:**
- Create events
- Edit events
- Delete events
- Upload photos
- Change event status
- Access event management

✅ **Public users CAN:**
- View all approved events
- See event details (date, time, venue, description)
- Browse event calendar
- See upcoming events

### **Staff Capabilities:**
✅ **All staff members CAN:**
- Create new events
- View all events
- Edit their own events
- Upload event photos
- Track attendance
- Generate reports

✅ **Only SK President CAN:**
- Delete events
- Cancel events
- Override permissions
- Approve event-related proposals

---

## 🎯 **Common Scenarios:**

### **Scenario 1: Create a Youth Sports Event**
```
1. Login as SK Secretary
2. Go to Events page
3. Click "+ Create Event"
4. Fill form:
   - Title: "Barangay Basketball Tournament"
   - Date: 2024-12-20
   - Venue: "Covered Court"
   - Time: "9:00 AM - 5:00 PM"
   - Budget: 30000
   - Description: "Inter-barangay basketball tournament for youth"
5. Create Event
6. Event appears on public calendar immediately
```

### **Scenario 2: Create a Multi-Day Training**
```
1. Login as SK President
2. Go to Events page
3. Click "+ Create Event"
4. Fill form:
   - Title: "Leadership Training Workshop"
   - Start Date: 2024-12-15
   - End Date: 2024-12-17 (3 days)
   - Venue: "Municipal Hall"
   - Time: "8:00 AM - 5:00 PM"
   - Budget: 75000
   - Description: "3-day intensive leadership training"
5. Create Event
6. Event spans 3 days on calendar
```

### **Scenario 3: Create Event with Activity Proposal**
```
For more formal events, use Activity Proposal workflow:

1. SK Secretary creates Activity Proposal
   - Path: /staff/events/proposal/create
   - More detailed planning form
   - Includes objectives, target participants, timeline

2. SK President reviews and approves
   - Path: /staff/approvals
   - Can comment and request revisions

3. After approval, create the actual event
   - Path: /staff/events
   - Link to approved proposal
```

---

## 💡 **Pro Tips:**

### **For Better Event Management:**
1. **Use descriptive titles** - Make it clear what the event is about
2. **Set realistic budgets** - Based on approved budget proposals
3. **Assign officials properly** - Ensures accountability
4. **Update status regularly** - Keep Planning → Upcoming → Completed flow
5. **Link to proposals** - Reference approved activity proposals
6. **Add detailed descriptions** - Helps public understand the event

### **For Public Transparency:**
1. **Create events early** - Give public advance notice
2. **Keep info accurate** - Public can see all details
3. **Update after completion** - Change status to "Completed"
4. **Generate reports** - Create accomplishment reports for transparency

---

## 🔗 **Quick Links:**

| I want to... | Go to... | URL |
|--------------|----------|-----|
| **Create event (staff)** | Events Page → Create | `/staff/events` |
| **View public calendar** | Public Calendar | `/public/calendar` |
| **Create activity proposal** | Activity Proposal | `/staff/events/proposal/create` |
| **Track attendance** | Event Details → Attendance | `/staff/events/:id/attendance` |
| **Generate report** | Reports → Liquidation | `/staff/reports/liquidation` |
| **View all events (staff)** | Events Page | `/staff/events` |

---

## ✅ **Summary:**

### **To Upload/Create Events:**
1. ✅ **Login as staff** (President, Treasurer, or Secretary)
2. ✅ **Navigate to Events page** (`/staff/events`)
3. ✅ **Click "+ Create Event"**
4. ✅ **Fill out the form**
5. ✅ **Submit**
6. ✅ **Event is live!** (visible to public immediately)

### **Remember:**
- 🔒 **Public portal = Read-only** (no uploads)
- 🔐 **Staff dashboard = Full control** (create, edit, manage)
- 📅 **Events auto-sync** to public calendar
- ✅ **No approval needed** for simple events (use proposals for major events)

---

**You're all set to create events! 🎉**

Need help with a specific event creation scenario? Just ask!
