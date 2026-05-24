# 🎯 DEMO QUICK REFERENCE CARD

## 🔑 Login Credentials

| Role | Username | Password |
|------|----------|----------|
| **Chairperson** | `president` | `president` |
| **Treasurer** | `treasurer` | `treasurer` |
| **Secretary** | `secretary` | `secretary` |

---

## 🔄 Emergency Reset

**If anything breaks during demo:**

```javascript
prepareDemoState()
```
*(Type in browser console - F12)*

---

## ✅ Current State

- **Month**: May 2026
- **All Values**: ₱0.00
- **All Tables**: Empty (headers only)
- **All Charts**: Zero data / 0%
- **Events**: 0
- **Transactions**: 0

---

## 📋 Demo Script (15 min)

### 1️⃣ Public Portal (2 min)
- Open landing page
- Click "Public Portal"
- Show budget transparency (₱0.00)
- Show empty calendar

### 2️⃣ Secretary Login (3 min)
```
Login: secretary / secretary
```
- Events → Create Activity Proposal
- Fill: "Youth Training" / May 15 / ₱50,000
- Submit → Shows as "Pending"
- Logout

### 3️⃣ Chairperson Approval (2 min)
```
Login: president / president
```
- Pending Approvals
- Review proposal
- Click "Approve"
- Status → "Approved"
- Logout

### 4️⃣ Treasurer Budget (4 min)
```
Login: treasurer / treasurer
```
- Budget → Add Income
  - ₱500,000 / Government Allocation
- Budget → Add Expense
  - ₱50,000 / Youth Training
  - OR#: 12345 / Supplier: Training Center
- See totals update
- Logout

### 5️⃣ Public View (2 min)
- Back to Public Portal
- Budget shows ₱500,000 income
- Budget shows ₱50,000 expense
- Activities show approved event

### 6️⃣ Reports (2 min)
```
Login: treasurer / treasurer
```
- Reports → Generate Report
- Show charts updated
- Logout

---

## 🎨 Key Features to Highlight

✅ **Transparency**: Public can view budget without login  
✅ **Accountability**: All transactions tracked  
✅ **Workflow**: Proposal → Approval → Budget  
✅ **Real-time**: Updates immediately  
✅ **Role-based**: Different permissions per role  
✅ **May 2026**: Fresh month, zero data start  

---

## 🚨 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| Data not empty | Run `prepareDemoState()` |
| Can't login | Check username/password case |
| Page not loading | Hard refresh (Ctrl+Shift+R) |
| Charts not showing | They're empty (by design) |
| No buttons visible | Check role permissions |

---

## 📊 What to Show

### Dashboard
- ₱0.00 for all metrics
- May 2026 date
- Empty state cards
- Navigation working

### Budget
- Empty table
- Add income/expense
- Real-time totals
- Permission-based access

### Events
- Clean May calendar
- Create proposal
- Approval workflow

### Reports
- Zero-data charts
- Report generation
- Export functions

### Public Portal
- No login needed
- Budget transparency
- Activity viewing

---

## 💡 Pro Tips

1. **Start fresh**: Run `prepareDemoState()` before starting
2. **Follow order**: Secretary → Chairperson → Treasurer
3. **Show public**: Start and end with public portal
4. **Highlight May 2026**: Emphasize fresh state
5. **Mention transparency**: Key feature for panel

---

## 🎯 Talking Points

### For Panel Questions

**Q: Why zero data?**  
A: Simulates first day of new fiscal month (May 2026). Shows system ready for fresh data entry.

**Q: Where is data stored?**  
A: Browser localStorage. Can be integrated with backend API.

**Q: How is transparency ensured?**  
A: Public portal allows anyone to view budget/activities without login.

**Q: What about security?**  
A: Role-based access control. Only authorized roles can add/approve/edit.

**Q: Can it scale?**  
A: Yes, currently localStorage but designed for API integration.

---

## ⏱️ Time Management

- Introduction: 1 min
- Public Portal: 2 min
- Secretary Demo: 3 min
- Chairperson Demo: 2 min
- Treasurer Demo: 4 min
- Reports: 2 min
- Q&A Buffer: 3 min

**Total: 15-17 minutes**

---

## 🔧 Browser Console Commands

```javascript
// Reset everything
prepareDemoState()

// Alternative reset
resetSKData()

// Check current data
localStorage
```

---

## ✅ Pre-Demo Checklist

5 minutes before:
- [ ] Run `prepareDemoState()`
- [ ] Verify ₱0.00 on dashboard
- [ ] Test one login
- [ ] Close extra tabs
- [ ] Zoom 100%
- [ ] Hide DevTools
- [ ] Credentials ready

---

**READY? LET'S GO! 🚀**
