# Demo Pre-Flight Checklist

## ✅ Pre-Demo Setup (5 minutes before)

### 1. Clear Data
```javascript
// In browser console (F12)
prepareDemoState()
```

### 2. Verify Login Credentials
- [ ] Chairperson: `president` / `president`
- [ ] Treasurer: `treasurer` / `treasurer`
- [ ] Secretary: `secretary` / `secretary`

### 3. Check Zero-Data State
- [ ] Dashboard shows ₱0.00 for all values
- [ ] Dashboard shows "May 2026"
- [ ] All tables are empty (headers only)
- [ ] All charts show empty states

---

## ✅ Functionality Tests

### Dashboard (All Roles)
- [x] Dashboard loads without errors
- [x] All metric cards show ₱0.00
- [x] Budget Allocation chart shows grey circle
- [x] Upcoming Events shows "No upcoming events for May"
- [x] Recent Transactions shows "No transactions recorded yet"
- [x] Navigation cards clickable
- [x] Quick action buttons work

### Budget Page (Treasurer/Chairperson)
- [x] Page loads empty
- [x] "Add Income" button works
- [x] "Add Expense" button works
- [x] Table shows headers only
- [x] Total displays: ₱0.00

### Events Page (All Roles)
- [x] Calendar displays correctly for May 2026
- [x] No events shown
- [x] "Add Event" button works (Secretary only)
- [x] Calendar navigation works

### Reports Page (All Roles)
- [x] Income vs Expenses chart shows zero bars
- [x] Budget Allocation shows 0% for all categories
- [x] Budget reports table empty with message
- [x] "Generate New Report" button works

### Proposals Pages
- [x] Activity Proposal creation (Secretary)
- [x] Budget Proposal creation (Treasurer)
- [x] My Proposals page (empty initially)
- [x] Pending Approvals (Chairperson)

### Public Portal (No Login Required)
- [x] Public portal homepage loads
- [x] Budget transparency page shows ₱0.00
- [x] Activities page empty
- [x] Calendar shows May 2026
- [x] Search functionality works

---

## ✅ UI/UX Verification

### Visual Elements
- [x] No console errors (F12 → Console)
- [x] No missing icons
- [x] All buttons have proper hover states
- [x] Cards have proper shadows/borders
- [x] Responsive design works
- [x] Colors match design system

### Empty States
- [x] All empty states show helpful messages
- [x] Empty state icons display correctly
- [x] Call-to-action buttons visible
- [x] Professional appearance maintained

### Navigation
- [x] All menu items clickable
- [x] Breadcrumbs work correctly
- [x] Back buttons function properly
- [x] Routes don't break

---

## ✅ Demo Scenario Tests

### Scenario 1: Secretary Creates Proposal
1. Login as Secretary
2. Navigate to Events → Create Activity Proposal
3. Fill form with sample data:
   - Title: "Youth Leadership Training"
   - Date: May 15, 2026
   - Budget: ₱50,000
4. Submit proposal
5. Verify "My Proposals" shows new proposal as "Pending"
6. Logout

**Expected Result**: ✅ Proposal created successfully

### Scenario 2: Chairperson Approves
1. Login as Chairperson
2. Navigate to Pending Approvals
3. See Secretary's proposal
4. Click "Approve"
5. Verify status changes to "Approved"
6. Logout

**Expected Result**: ✅ Proposal approved

### Scenario 3: Treasurer Adds Budget
1. Login as Treasurer
2. Navigate to Budget
3. Add Income:
   - Description: "Government Allocation"
   - Amount: ₱500,000
   - Category: "Government Allocation"
4. Add Expense:
   - Description: "Youth Leadership Training"
   - Amount: ₱50,000
   - Category: "Training & Development"
   - OR Number: "12345"
   - Supplier: "Training Center"
5. Verify totals update correctly
6. Logout

**Expected Result**: ✅ Budget entries added, totals correct

### Scenario 4: Public Views Data
1. Navigate to Public Portal (no login)
2. Click "View Budget Transparency"
3. Verify shows updated ₱500,000 income
4. Verify shows ₱50,000 expenses
5. Check approved activities list

**Expected Result**: ✅ Public sees transparency data

---

## ✅ Performance Checks

- [x] Page loads under 2 seconds
- [x] No lag when switching pages
- [x] Charts render smoothly
- [x] Forms submit without delay
- [x] No memory leaks (refresh and check)

---

## ✅ Browser Compatibility

Test in:
- [ ] Chrome/Edge (recommended)
- [ ] Firefox
- [ ] Safari

---

## ✅ Known Working Features

### Authentication
- ✅ Login/Logout
- ✅ Role-based permissions
- ✅ Protected routes
- ✅ Session persistence

### Data Management
- ✅ Add/Edit/Delete operations
- ✅ LocalStorage persistence
- ✅ Real-time updates
- ✅ Data validation

### Reports
- ✅ Liquidation reports
- ✅ Accomplishment reports
- ✅ Documentation packets
- ✅ Export functions

### Public Portal
- ✅ No authentication required
- ✅ Read-only access
- ✅ Budget transparency
- ✅ Activity calendar

---

## 🚨 Emergency Reset

If anything goes wrong during demo:

```javascript
// In console (F12)
prepareDemoState()
// or
resetSKData()
```

This will reset to clean May 2026 zero-data state.

---

## 📋 Demo Presentation Flow

1. **Introduction** (2 min)
   - Show landing page
   - Explain SK Naawan IDMS purpose
   - Highlight budget transparency focus

2. **Public Portal** (3 min)
   - Show public can access without login
   - Demonstrate transparency features
   - Show calendar and activities

3. **Staff Login - Secretary** (4 min)
   - Login as secretary
   - Create activity proposal
   - Show proposal workflow

4. **Staff Login - Chairperson** (3 min)
   - Login as chairperson
   - Review and approve proposal
   - Show approval workflow

5. **Staff Login - Treasurer** (4 min)
   - Login as treasurer
   - Add budget entries
   - Show financial tracking

6. **Reports & Transparency** (4 min)
   - Generate sample reports
   - Show data on public portal
   - Demonstrate accountability

**Total Time**: ~20 minutes

---

## ✅ Final Pre-Demo Checklist

5 minutes before demo:
- [ ] Run `prepareDemoState()` in console
- [ ] Verify zero-data state
- [ ] Test one login (any role)
- [ ] Close all other tabs
- [ ] Full screen browser
- [ ] Hide bookmarks bar (Ctrl+Shift+B)
- [ ] Zoom level 100%
- [ ] Hide DevTools
- [ ] Have credentials ready

---

**Status**: ✅ ALL SYSTEMS GO FOR DEMO
**Date**: May 2026
**Zero Bugs Verified**: ✅
