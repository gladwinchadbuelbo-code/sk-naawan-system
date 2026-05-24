# 📋 How to Record Attendance in SK Management System

## 🎯 Overview

The SK Management System provides **TWO methods** for recording attendance:

1. **📊 Live Attendance Tracking** - Track attendance in real-time during the event
2. **📄 Attendance Sheet Upload** - Upload a pre-filled attendance sheet (image/PDF)

---

## Method 1: 📊 Live Attendance Tracking (Recommended)

This is the **primary method** for recording attendance during an event.

### **Step-by-Step Guide:**

#### **Step 1: Navigate to Events Page**
```
Login → Events & Program Management
```

#### **Step 2: Find Your Event**
- Locate the event in the events table
- Event should have status "Upcoming" or "Planning"

#### **Step 3: Click "Track Attendance" Button**
```
Actions Column → 👥 Attendance Button (Users icon)
```

**OR** Navigate directly to:
```
/events/{eventId}/attendance
```

#### **Step 4: You'll See the Attendance Tracking Interface**

**Summary Cards Display:**
- 📊 **Total Registered** - Number of pre-registered attendees
- ✅ **Present** - Number marked as present
- ⏰ **Late** - Number marked as late
- ❌ **Absent** - Number marked as absent
- 📈 **Attendance Rate** - Percentage calculation with progress bar

---

### **Recording Attendance:**

#### **Option A: Add New Attendee**

1. **Click "Add Attendee" Button** (top right)
2. **Fill in the form:**
   - **Name** (required)
   - **Age Group** (select from dropdown: 15-18, 19-21, etc.)
   - **Contact Number** (required)
   - **Time In** (optional - e.g., "9:30 AM")
   - **Time Out** (optional - e.g., "5:00 PM")
3. **Click "Add Attendee"**
4. New attendee appears in the table with status "Present"

#### **Option B: Toggle Attendance Status**

For existing attendees in the list:

1. **Find the attendee** in the table
2. **Click on their Status Badge** (Present/Absent/Late)
3. **Status cycles automatically:**
   - Present → Absent → Late → Present

**Status Indicators:**
- 🟢 **Present** (Green badge)
- 🔴 **Absent** (Red badge)
- 🟡 **Late** (Amber/Yellow badge)

---

### **Attendance Tracking Features:**

#### **Search Functionality:**
```
Search Bar → Type attendee name → Filtered results appear
```

#### **Real-time Statistics:**
- Attendance rate calculated automatically
- Present + Late counts toward attendance rate
- Visual progress bar shows percentage
- Individual counts for each status

#### **Export Attendance:**
```
Click "Export to Excel" → Download attendance report
```

---

### **Complete Workflow Example:**

**Scenario: Youth Summit 2025**

**Before the Event:**
1. Secretary creates event "Youth Summit 2025"
2. Pre-register expected attendees (optional)

**During the Event:**
1. Secretary navigates to Events → Youth Summit 2025
2. Clicks "Track Attendance" button
3. As youth arrive:
   - Click "Add Attendee"
   - Enter: Name, Age Group, Contact
   - Enter Time In (e.g., "9:15 AM")
   - Click "Add Attendee"
   - Repeat for each arrival

**Managing Status:**
1. If someone is marked present but didn't arrive:
   - Click the "Present" badge → Changes to "Absent"
2. If someone arrives late:
   - Click status until it shows "Late"

**End of Event:**
1. Update Time Out for attendees
2. Review attendance statistics
3. Click "Export to Excel" for records
4. Attendance data is automatically saved

---

## Method 2: 📄 Attendance Sheet Upload

Upload a pre-filled attendance sheet (scanned document, photo, or PDF).

### **Step-by-Step Guide:**

#### **Step 1: Navigate to Events Page**
```
Login → Events & Program Management
```

#### **Step 2: Find Your Event**
- Locate the event in the events table

#### **Step 3: Click "Upload Documents" Button**
```
Actions Column → 📤 Upload Button (Upload icon)
```

#### **Step 4: Upload Attendance Sheet**

In the Upload Documents modal:

1. **Find "Attendance Sheet" Section**
2. **Click "Choose File"**
3. **Select your file:**
   - ✅ Scanned attendance sheet (PDF)
   - ✅ Photo of paper attendance (JPG/PNG)
   - ✅ Signed attendance document
4. **Optionally upload other documents:**
   - Event Photos
   - Receipts
   - Other Documents
5. **Click "Upload Documents"**

#### **Step 5: Confirmation**
- Toast notification: "Successfully uploaded X document(s)"
- Attendance sheet is attached to the event
- Accessible in Event Details and Reports

---

### **Supported File Formats:**

**For Attendance Sheets:**
- 📄 **PDF** (.pdf) - Scanned documents
- 🖼️ **Images** (.jpg, .jpeg, .png) - Photos of paper attendance

**Maximum File Size:** No strict limit (depends on browser)

---

## 📊 Attendance Data Storage

### **Live Tracking Data:**

Attendance records are stored with the event and include:

```typescript
{
  id: number,
  name: string,
  ageGroup: string,        // "15-18", "19-21", etc.
  contact: string,          // Phone number
  timeIn: string,           // "9:15 AM"
  timeOut: string,          // "4:50 PM"
  status: 'Present' | 'Absent' | 'Late'
}
```

### **Uploaded Sheet Data:**

Uploaded attendance sheets are stored as event documents:

```typescript
{
  name: string,             // "attendance-sheet.pdf"
  data: string,             // Base64 encoded file
  uploadedAt: string,       // ISO timestamp
  uploadedBy: string        // Full name of uploader
}
```

---

## 🔐 Permission Requirements

### **Who Can Record Attendance?**

✅ **Secretary:**
- Full access to attendance tracking
- Can add/edit attendees
- Can toggle status
- Can upload attendance sheets
- Can export attendance data

✅ **Chairperson:**
- Full access to attendance tracking
- Can perform all attendance operations

❌ **Treasurer:**
- Limited access
- Can view attendance (if permitted)
- Cannot modify attendance records

---

## 📈 Attendance Statistics & Reports

### **Real-time Statistics:**

**Automatically Calculated:**
- Total Registered Attendees
- Present Count
- Late Count
- Absent Count
- Attendance Rate (%)

**Formula:**
```
Attendance Rate = (Present + Late) / Total × 100
```

**Example:**
```
Total: 50 attendees
Present: 35
Late: 10
Absent: 5

Attendance Rate = (35 + 10) / 50 × 100 = 90%
```

---

### **Viewing Attendance Reports:**

#### **Method 1: Event Details Page**
```
Events → Click Event → View Attendance Section
```

#### **Method 2: Reports Page**
```
Reports → Select Event → Attendance Report
```

#### **Method 3: Accomplishment Report**
```
Reports → Accomplishment Report → Includes Attendance Data
```

---

## 🎯 Best Practices

### **Recommended Workflow:**

**1. Before the Event:**
- ✅ Create the event in the system
- ✅ Set up pre-registration list (if available)
- ✅ Prepare tablets/devices for live tracking

**2. During the Event:**
- ✅ Use live attendance tracking
- ✅ Record Time In as youth arrive
- ✅ Mark late arrivals appropriately
- ✅ Update statuses if needed

**3. After the Event:**
- ✅ Record Time Out before closing
- ✅ Export attendance to Excel
- ✅ Upload scanned attendance sheet (if physical form used)
- ✅ Generate accomplishment report

---

### **Tips for Accurate Attendance:**

#### **1. Use Live Tracking When Possible:**
- More accurate than paper forms
- Real-time statistics
- No data entry errors
- Automatic calculations

#### **2. Backup with Physical Forms:**
- Have paper attendance sheets as backup
- Upload scanned copies for records
- Keep physical copies for audits

#### **3. Regular Updates:**
- Update statuses during the event
- Don't wait until the end
- Verify late vs. absent

#### **4. Complete Information:**
- Always record contact numbers
- Note exact time in/out
- Specify correct age groups

---

## 🔄 Attendance Archiving

### **Archived Attendance Access:**

When events are archived, attendance data is preserved:

**For Secretary:**
1. Navigate to **Archives** → **Events & Activities**
2. Find archived event
3. Click **"View Details"**
4. Attendance records are included
5. Can restore event if needed

**For Chairperson:**
1. Navigate to **Archives** (read-only)
2. View all archived events
3. Access attendance history
4. Review for compliance/audits

---

## 📱 Mobile Attendance Tracking

The system is **fully responsive** for mobile devices:

### **Mobile Workflow:**

1. **Login on mobile device** (phone/tablet)
2. **Navigate to Events**
3. **Click event** → **Attendance button**
4. **Add attendees using mobile form:**
   - Tap "Add Attendee"
   - Fill in details
   - Tap status badges to toggle
5. **Real-time sync** across all devices

**Benefits:**
- ✅ Track attendance at the event location
- ✅ Multiple devices can add attendees
- ✅ No need for desktop/laptop
- ✅ Portable and convenient

---

## 🚨 Troubleshooting

### **Common Issues:**

#### **Issue 1: Can't Find Attendance Button**
**Solution:** 
- Make sure you're logged in as Secretary or Chairperson
- Event must exist in the Events page
- Look for Users (👥) icon in Actions column

#### **Issue 2: Uploaded Attendance Sheet Not Showing**
**Solution:**
- Check file format (must be PDF or image)
- Verify file uploaded successfully (check toast notification)
- View Event Details to see attached documents

#### **Issue 3: Attendance Not Saving**
**Solution:**
- Ensure you have edit permissions
- Check browser console for errors
- Refresh page and try again
- Data is auto-saved to localStorage

#### **Issue 4: Export to Excel Not Working**
**Solution:**
- Feature may be a placeholder in prototype
- Use browser print or screenshot as backup
- Manually copy data if needed

---

## 📊 Attendance Report Example

**Generated Report Includes:**

```
Event: Youth Summit 2025
Date: December 15, 2025
Venue: Barangay Hall

═══════════════════════════════════════
ATTENDANCE SUMMARY
═══════════════════════════════════════
Total Registered:     50
Present:              35 (70%)
Late:                 10 (20%)
Absent:               5 (10%)
Attendance Rate:      90%

═══════════════════════════════════════
DETAILED ATTENDANCE RECORD
═══════════════════════════════════════
#   Name              Age   Contact        Time In   Time Out   Status
───────────────────────────────────────────────────────────────────────
1   Anna Cruz         15-18 09171234567    9:15 AM   4:50 PM    Present
2   Pedro Santos      19-21 09187654321    9:30 AM   5:00 PM    Late
3   Maria Garcia      15-18 09191112222    9:00 AM   4:45 PM    Present
4   Carlos Reyes      19-21 09203334444    -         -          Absent
...
```

---

## 🎯 Quick Reference Commands

### **Access Attendance Tracking:**
```
Events Page → Find Event → Click 👥 Attendance Icon
```

### **Add Attendee:**
```
Attendance Page → Add Attendee Button → Fill Form → Submit
```

### **Toggle Status:**
```
Click on Status Badge → Cycles: Present → Absent → Late → Present
```

### **Upload Attendance Sheet:**
```
Events Page → Find Event → Upload 📤 → Select Attendance File → Upload
```

### **Export Attendance:**
```
Attendance Page → Export to Excel Button
```

### **View Archived Attendance:**
```
Archives → Events & Activities → Select Event → View Details
```

---

## ✅ Attendance Workflow Checklist

### **Pre-Event:**
- [ ] Event created in system
- [ ] Pre-registration list prepared (optional)
- [ ] Devices ready for live tracking

### **During Event:**
- [ ] Open attendance tracking page
- [ ] Add attendees as they arrive
- [ ] Record time in
- [ ] Mark late arrivals
- [ ] Update absences

### **Post-Event:**
- [ ] Record time out for all
- [ ] Verify all statuses
- [ ] Export attendance report
- [ ] Upload scanned attendance sheet (if used)
- [ ] Generate accomplishment report
- [ ] Archive event when complete

---

<div align="center">

# ✅ Attendance Recording System Ready!

**Two Methods Available:**
1. 📊 **Live Attendance Tracking** (Recommended)
2. 📄 **Attendance Sheet Upload** (Backup/Documentation)

**Accessible to:** Secretary & Chairperson  
**Mobile Friendly:** Yes  
**Auto-saves:** Yes  
**Exportable:** Yes

</div>

---

## 🚀 Start Recording Attendance Now!

**Quick Start:**
1. Login as Secretary (`sk_secretary` / `password123`)
2. Go to **Events & Program Management**
3. Create or select an event
4. Click the **👥 Attendance** button
5. Start adding attendees!

The system is ready to use immediately for all your SK event attendance tracking needs.
