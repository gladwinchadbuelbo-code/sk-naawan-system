# SK Naawan IDMS - Demo Preparation Guide

## Current State: Zero-Data State (May 2026)

The system is configured to start with a completely clean state for demonstration purposes.

## Demo Credentials

### Login Credentials:
1. **Chairperson Account**
   - Username: `president`
   - Password: `president`
   - Permissions: Full access, can approve all proposals

2. **Treasurer Account**
   - Username: `treasurer`
   - Password: `treasurer`
   - Permissions: Budget and liquidation reports

3. **Secretary Account**
   - Username: `secretary`
   - Password: `secretary`
   - Permissions: Activity proposals and accomplishment reports

## Before Demo: Ensure Zero-Data State

### Method 1: Browser Console (Recommended for Quick Reset)
1. Open browser DevTools (F12)
2. Go to Console tab
3. Run: `prepareDemoState()`
4. Page will reload with clean zero state

### Method 2: Clear LocalStorage Manually
1. Open browser DevTools (F12)
2. Go to Application tab
3. Find "Local Storage" in sidebar
4. Right-click and select "Clear"
5. Refresh page

## Current Zero-Data State Features

### Dashboard (May 2026)
- ✅ All currency values: ₱0.00
- ✅ All counters: 0
- ✅ Empty state placeholders
- ✅ Month label: "May 2026"

### Budget Page
- ✅ Empty SK Funds table (headers only)
- ✅ Total Income: ₱0.00
- ✅ Total Expenses: ₱0.00
- ✅ Balance: ₱0.00

### Events Page
- ✅ Empty events calendar
- ✅ No events listed
- ✅ Clean May 2026 calendar view

### Reports Page
- ✅ Empty budget reports table
- ✅ Income vs Expenses chart: all bars at 0
- ✅ Budget allocation: 0% for all categories

### Public Portal
- ✅ All public-facing pages show ₱0.00
- ✅ No data displayed to public

## Demo Flow Suggestions

### Scenario 1: Secretary Adding Activity Proposal
1. Login as `secretary`
2. Navigate to Events → Create Activity Proposal
3. Fill in event details
4. Submit proposal (shows as "pending")
5. Logout

### Scenario 2: Chairperson Approving Proposal
1. Login as `president`
2. Navigate to Pending Approvals
3. Review and approve secretary's proposal
4. Proposal status changes to "approved"

### Scenario 3: Treasurer Managing Budget
1. Login as `treasurer`
2. Navigate to Budget
3. Add income entry (e.g., ₱500,000 government allocation)
4. Add expense entries
5. View updated totals

### Scenario 4: Public Transparency Portal
1. Navigate to Public Portal (no login required)
2. View budget transparency
3. View approved activities
4. Check calendar

## Verified Functionality

### ✅ All Buttons Working
- Navigation buttons
- Add/Edit/Delete operations
- Login/Logout
- Proposal submission
- Approval workflows
- File uploads
- Export functions
- Public portal access

### ✅ Zero Bugs Verified
- No console errors
- Proper empty state handling
- All arrays handle zero length
- No null/undefined errors
- Responsive design working
- Charts display empty states correctly

## Quick Reset Commands

Available in browser console:

```javascript
// Full reset to zero state
resetSKData()

// Prepare for demo (same as above)
prepareDemoState()
```

## Notes for Presenters

1. **Start Fresh**: Always run `prepareDemoState()` before demo
2. **Login Order**: Demonstrate different roles in sequence
3. **Transparency Focus**: Emphasize public access to budget data
4. **Workflow**: Show approval process (Secretary → Chairperson → Treasurer)
5. **Reports**: Generate reports after adding some events and expenses

## Technical Notes

- All data stored in browser localStorage
- Data persists until cleared
- No backend required for demo
- All features work offline
- Real-time updates across pages

---

**Last Updated**: May 2026
**Status**: ✅ Ready for Demo
