# 💰 Budget Proposal Workflow Guide

## 📋 Complete Step-by-Step Guide

---

## 🎯 **Where to Create Budget Proposal**

### **Method 1: From Dashboard (Recommended)**

**Steps:**
1. **Login as SK Treasurer**
   - Username: `treasurer`
   - Password: `password`

2. **Go to Dashboard** (`/staff/dashboard`)
   - You'll see the dashboard with quick actions

3. **Click "Create Budget Proposal"** button
   - Green button with 💰 Wallet icon
   - Located in the Quick Actions section
   - Label: "Create Budget Proposal - Submit budget requests"

4. **You'll be redirected to:** `/staff/budget/proposal/create`

---

### **Method 2: From Budget Management Page**

**Steps:**
1. Login as SK Treasurer
2. Go to **Budget Management** page
3. Click **"Back to Budget"** navigation
4. Look for budget proposal creation option

---

## ✍️ **How to Create a Budget Proposal**

### **Required Information:**

1. **Proposal Title** *
   - Example: "Q1 2025 Youth Programs Budget"

2. **Description** *
   - Purpose and justification for the budget request
   - Example: "Budget allocation for youth development programs including sports fest, educational seminars, and community outreach activities."

3. **Budget Items** (at least 1 required)
   - **Category**: Select from dropdown
     - Programs and Projects
     - Office Supplies
     - Transportation
     - Food and Venue
     - Equipment
     - Documentation
     - Honorarium
     - Miscellaneous
   - **Description**: What the item is for
   - **Amount**: Budget amount in pesos

4. **Add/Remove Items**
   - Click **"+ Add Item"** to add more budget items
   - Click **🗑️ Remove** to delete items
   - Must have at least 1 valid item

5. **Total Budget**
   - Automatically calculated from all items

---

### **Example Budget Proposal:**

```
Title: "Youth Leadership Training Program 2025"

Description: "Budget allocation for a comprehensive leadership training program for SK members and youth leaders in the barangay."

Budget Items:
┌──────────────────────┬─────────────────────────────┬───────────┐
│ Category             │ Description                 │ Amount    │
├──────────────────────┼─────────────────────────────┼───────────┤
│ Food and Venue       │ Training venue rental       │ ₱15,000   │
│ Food and Venue       │ Meals for 50 participants   │ ₱20,000   │
│ Office Supplies      │ Training materials & kits   │ ₱8,000    │
│ Documentation        │ Certificates & tarpaulins   │ ₱5,000    │
│ Honorarium           │ Resource speakers (3)       │ ₱12,000   │
│ Miscellaneous        │ Contingency                 │ ₱3,000    │
└──────────────────────┴─────────────────────────────┴───────────┘

TOTAL BUDGET: ₱63,000
```

---

## 🔔 **What Happens After Submission**

### **Step 1: Treasurer Submits Proposal**

**What happens:**
- ✅ Proposal saved to system
- ✅ Status set to: **"pending"**
- ✅ Activity logged in system
- ✅ **Notification sent to SK Chairperson (President)**

**Notification to Chairperson:**
```
🔔 New Budget Proposal Awaiting Approval
[Treasurer Name] submitted "[Proposal Title]" for your review and approval. 
Total budget: ₱[Amount]
```

**Toast Message (Treasurer sees):**
```
✅ Budget proposal submitted! The SK Chairperson will be notified for approval.
```

**Redirect:** Back to Budget Management page

---

### **Step 2: Chairperson Reviews Proposal**

**Where:**
- **Dashboard** → Click **"Review Pending Approvals"** (orange button)
- **Direct URL:** `/staff/approvals`
- **Navigation:** Menu → Pending Approvals

**What Chairperson Sees:**

1. **Pending Approvals Dashboard**
   - Summary cards showing:
     - 📅 Pending Activity Proposals
     - 💰 Pending Budget Proposals
     - ✅ Total Approved This Month

2. **Budget Proposals Tab**
   - List of all pending budget proposals
   - Each card shows:
     - 📝 Title
     - 📄 Description
     - 💵 Total Amount
     - 👤 Submitted By
     - 📅 Submission Date
     - 📋 Number of budget items

3. **Review Actions:**
   - ✅ **Approve** (green button)
   - ↩️ **Request Changes** (yellow button)
   - 👁️ **View Details** (to see full proposal)

---

### **Step 3: Chairperson Approves/Returns Proposal**

#### **Option A: Approve Proposal** ✅

**Actions by Chairperson:**
1. Click **"✓ Approve"** button on the proposal card
2. Modal opens: "Review Budget Proposal"
3. Select action: **"Approve Proposal"**
4. Add optional comments (e.g., "Approved for Q1 implementation")
5. Click **"Submit Review"**

**What Happens Automatically:**

1. **✅ Status Changed**: `pending` → `approved`

2. **💰 Budget Allocated**: Creates a new fund entry in Budget Management
   - Type: **Income**
   - Category: "Budget Allocation"
   - Description: [Proposal Title]
   - Amount: [Total Budget]
   - Date: Current date
   - Linked to proposal ID

3. **🔔 Notification Sent to Treasurer:**
   ```
   Budget Proposal Approved
   Your proposal "[Title]" has been approved.
   ```

4. **📝 Activity Logged:**
   ```
   [Chairperson Name] approved budget proposal
   ```

5. **✅ Success Toast:**
   ```
   Budget proposal approved successfully
   ```

---

#### **Option B: Return for Revision** ↩️

**Actions by Chairperson:**
1. Click **"↩ Request Changes"** button
2. Modal opens: "Review Budget Proposal"
3. Select action: **"Return for Revision"**
4. **Add comments** (required to explain what needs to be changed)
   - Example: "Please provide breakdown for venue rental cost and reduce miscellaneous budget."
5. Click **"Submit Review"**

**What Happens:**

1. **⚠️ Status Changed**: `pending` → `returned`

2. **🔔 Notification Sent to Treasurer:**
   ```
   Budget Proposal Returned
   Your proposal "[Title]" has been returned for revision.
   Comments: [Chairperson's feedback]
   ```

3. **📝 Activity Logged:**
   ```
   [Chairperson Name] returned budget proposal
   ```

4. **Treasurer Can:**
   - View the returned proposal
   - See chairperson's comments
   - Edit and resubmit
   - Create a new revised proposal

---

## 👁️ **Visual Indicators of Approval Status**

### **For Treasurer:**

**Check Notification Bell** (Top right of dashboard)
- 🔔 Badge shows number of new notifications
- Click to see notifications list
- Look for:
  - ✅ **Green notification**: "Budget Proposal Approved"
  - ⚠️ **Yellow notification**: "Budget Proposal Returned"

**Check Budget Management Page:**
- Look for the income entry:
  - **Category**: "Budget Allocation"
  - **Description**: Your proposal title
  - **Amount**: Your requested budget
  - If present → **APPROVED** ✅

**Check Activity Log:**
- Menu → Activity Logs
- Look for entry: "[Chairperson] approved budget proposal: [Title]"

---

### **For Chairperson:**

**Pending Approvals Dashboard:**

**Before Approval:**
```
┌─────────────────────────────────────────────────┐
│ Youth Leadership Training 2025                  │
│ [⏳ PENDING]                                    │
│                                                 │
│ Budget allocation for leadership training...   │
│                                                 │
│ 💵 Total: ₱63,000                              │
│ 👤 By: Maria Santos                            │
│ 📅 Jan 15, 2025                                │
│ 📋 6 budget items                              │
│                                                 │
│ [✓ Approve]  [↩ Request Changes]  [👁️ View]   │
└─────────────────────────────────────────────────┘
```

**After Approval:**
```
Card disappears from "Pending" tab
↓
Moves to "Approved" history
↓
Budget allocated in system
```

---

## 📊 **How to Track Approval Status**

### **Real-Time Indicators:**

| Location | Indicator | Status |
|----------|-----------|--------|
| **Notification Bell** | 🔔 Badge number | New updates |
| **Notifications List** | ✅ Green message | Approved |
| **Notifications List** | ⚠️ Yellow message | Returned |
| **Budget Management** | Income entry added | Approved |
| **Activity Log** | "approved budget proposal" | Approved |
| **Pending Approvals** | Card present | Still pending |
| **Pending Approvals** | Card removed | Reviewed |

---

### **Treasurer Checklist: "Is My Proposal Approved?"**

**✅ YES - Approved if you see:**
- [ ] Green notification: "Budget Proposal Approved"
- [ ] New income entry in Budget Management with your proposal title
- [ ] Activity log shows: "[Chairperson] approved budget proposal"
- [ ] Proposal no longer in "pending" list

**⚠️ NO - Returned if you see:**
- [ ] Yellow notification: "Budget Proposal Returned"
- [ ] Notification contains chairperson's comments
- [ ] No new income entry in Budget Management
- [ ] Activity log shows: "[Chairperson] returned budget proposal"

**⏳ PENDING if you see:**
- [ ] No notification yet
- [ ] Proposal still shows as "pending"
- [ ] Chairperson hasn't reviewed yet

---

## 🔐 **Access Control**

### **Who Can Do What:**

| Action | Treasurer | Chairperson | Secretary |
|--------|-----------|-------------|-----------|
| Create Budget Proposal | ✅ YES | ❌ NO | ❌ NO |
| View Own Proposals | ✅ YES | ✅ YES | ❌ NO |
| Approve Proposals | ❌ NO | ✅ YES | ❌ NO |
| Return Proposals | ❌ NO | ✅ YES | ❌ NO |
| View Approved Budget | ✅ YES | ✅ YES | ✅ YES |

---

## 📱 **Quick Navigation Paths**

### **For Treasurer:**

**To Create Proposal:**
```
Dashboard → [Create Budget Proposal] button
OR
Dashboard → Budget Management → Create Proposal
```

**To Check Status:**
```
Dashboard → 🔔 Notification Bell → View notifications
OR
Dashboard → Budget Management → Look for income entry
```

---

### **For Chairperson:**

**To Review Proposals:**
```
Dashboard → [Review Pending Approvals] button
OR
Menu → Pending Approvals
OR
Direct: /staff/approvals
```

**To View Approved Budgets:**
```
Menu → Budget Management → View all budget entries
```

---

## 💡 **Tips & Best Practices**

### **For Treasurer:**

1. **Be Specific in Descriptions**
   - Clear descriptions help chairperson understand the need
   - Include purpose, timeline, and justification

2. **Provide Detailed Breakdown**
   - List all items separately
   - Don't lump everything into "Miscellaneous"

3. **Use Realistic Amounts**
   - Research actual costs
   - Include 5-10% contingency

4. **Check Available Budget**
   - Review total SK funds before requesting
   - Ensure request is reasonable

---

### **For Chairperson:**

1. **Review Thoroughly**
   - Check each budget item
   - Verify amounts are reasonable
   - Consider overall SK budget

2. **Provide Clear Feedback**
   - If returning, explain what needs to change
   - Be specific about concerns
   - Suggest alternatives if possible

3. **Timely Reviews**
   - Review proposals within 24-48 hours
   - Avoid delays in budget allocation

---

## 🔄 **Complete Workflow Diagram**

```
TREASURER                          CHAIRPERSON
    │                                  │
    ├─ Create Budget Proposal          │
    │  • Fill in title, description    │
    │  • Add budget items              │
    │  • Click "Submit"                │
    │                                  │
    ├─ ✅ Submitted                    │
    │  Status: pending ────────────────┼─> 🔔 Gets notification
    │  Notification sent               │
    │                                  ├─ View Pending Approvals
    │                                  │  • See proposal details
    │                                  │  • Review items & amounts
    │                                  │
    │                                  ├─ DECISION
    │                                  │
    │                ┌─────────────────┴────────────────┐
    │                │                                  │
    │           [APPROVE]                          [RETURN]
    │                │                                  │
    ├─ 🔔 Approved  │                                  ├─> Comments required
    │  Notification  │                                  │
    │                ├─> 💰 Budget Added               ├─> ⚠️ Returned
    │                │   to Funds                       │
    │                │                                  ├─ 🔔 Notification sent
    ├─ ✅ See Income Entry                             │   with comments
    │  in Budget Management                            │
    │                                                   ├─ Treasurer revises
    │                                                   │  and resubmits
    │                                                   │
    ▼                                                   ▼
  DONE                                           REVISION NEEDED
```

---

## 📞 **Troubleshooting**

### **Q: I submitted a proposal but don't see it**
**A:** Check Activity Log to confirm submission. If submitted, chairperson should see it in Pending Approvals.

### **Q: Chairperson approved but I don't see budget**
**A:** 
1. Check notifications (🔔 bell icon)
2. Check Budget Management → Look for income entry
3. Refresh page
4. Check Activity Log for approval record

### **Q: Can I edit a pending proposal?**
**A:** Currently no direct edit. Options:
- Wait for chairperson to return it for revision
- Contact chairperson to return it
- Create a new proposal

### **Q: What if chairperson doesn't approve/return?**
**A:** 
- Send reminder via notification system
- Contact chairperson directly
- Check if they've seen it in Pending Approvals

---

## ✅ **Status Summary**

| Status | Icon | Meaning | Who Can See |
|--------|------|---------|-------------|
| **Pending** | ⏳ | Awaiting chairperson review | Treasurer, Chairperson |
| **Approved** | ✅ | Approved & budget allocated | All users |
| **Returned** | ⚠️ | Needs revision | Treasurer, Chairperson |

---

## 🎓 **Quick Reference**

**Create Proposal:** Treasurer → Dashboard → "Create Budget Proposal" button  
**Review Proposal:** Chairperson → Dashboard → "Review Pending Approvals" button  
**Check Status:** Notification Bell (🔔) → View notifications  
**See Approved Budget:** Budget Management → Look for income entry  

---

**Last Updated:** December 13, 2025
