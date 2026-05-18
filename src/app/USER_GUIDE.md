# SK Management System - User Guide

## Getting Started

### First Login
1. Navigate to the login page
2. Enter any username and password (demo mode)
3. Click "Log In" to access the system

**Note**: In this prototype version, any credentials will work. In production, use your assigned credentials.

---

## Dashboard Overview

The Dashboard is your central hub for all SK management activities.

### Key Sections:

#### Summary Cards (Top Row)
- **Total Budget**: Shows your current fiscal year allocation
- **Total Expenses**: Displays cumulative spending and percentage used
- **Remaining Budget**: Available funds for future programs
- **Upcoming Events**: Count of events in the next 30 days

#### Quick Navigation Cards
Click any card to jump directly to that module:
- **Budget Management**: Track income and expenses
- **Event & Program Management**: Plan and organize activities
- **Report Generator**: Create official documentation

#### Activity Widgets
- **Budget Allocation Chart**: Visual breakdown of fund distribution
- **Upcoming Events**: List of scheduled programs
- **Pending Reports**: Reports requiring attention
- **Recent Transactions**: Latest budget activities

---

## Budget Management

### Adding Income
1. Click the "Add Income" button
2. Fill in the form:
   - Date of receipt
   - Category (e.g., Government Allocation)
   - Description
   - Amount
3. Click "Add Entry"
4. View the new entry in the Income section

### Recording Expenses
1. Click the "Add Expense" button
2. Complete the form:
   - Date of expense
   - Category (Programs, Operations, Infrastructure)
   - Description
   - Amount
   - OR Number (Official Receipt)
   - Supplier name
3. Click "Add Entry"
4. Entry appears in the Expenses section

### Managing Entries
- **Edit**: Click the edit icon on any entry
- **Delete**: Click the delete icon and confirm
- **View Summary**: Check the summary cards at the top

### Best Practices
- Always get and record OR numbers for expenses
- Categorize expenses correctly for accurate reporting
- Record transactions promptly
- Keep supplier information accurate

---

## Events & Program Management

### Creating a New Event
1. Navigate to Events page
2. Click "Create Event"
3. Fill in event details:
   - Event title
   - Date and time
   - Venue
   - Budget allocation
   - Description
   - Assigned officials
4. Click "Create Event"

### Event Views

#### Calendar View
- See all events on a monthly calendar
- Navigate between months using arrow buttons
- Events show as colored dots on dates
- Click a date to see events

#### List View
- See all events in a filterable list
- Use tabs to filter by status:
  - All Events
  - Upcoming
  - Completed
  - Planning
- Click "View Details" to see full event information

### Event Details Page
Access by clicking on any event. Shows:
- Complete event information
- Budget details
- Assigned officials
- Action buttons:
  - **Track Attendance**: Open attendance system
  - **Generate Report**: Create liquidation/accomplishment report
  - **Edit Event**: Modify event details
  - **Upload Documents**: Attach supporting files

### Attendance Tracking
1. From event details, click "Track Attendance"
2. Add participants:
   - Enter name
   - Add contact information
   - Click "Add Participant"
3. Mark attendance during the event
4. Export attendance report when complete

---

## Reports & Documentation

### Liquidation Reports
**When to use**: After an event, to account for expenses

1. Go to Reports → Liquidation Reports tab
2. Click "Create Liquidation Report"
3. Select event (or create new report)
4. The system pre-fills:
   - Event details
   - Allocated budget
   - Date information
5. Add expense items:
   - Description
   - Amount
   - OR Number
   - Date
6. Review totals (Auto-calculated)
7. Actions:
   - **Print**: Create physical copy
   - **Export PDF**: Save digital version
   - **Save Draft**: Continue later

### Accomplishment Reports
**When to use**: To document event success and outcomes

1. Navigate to Reports → Event Reports tab
2. Click "Create Accomplishment Report"
3. Select event
4. Fill in sections:
   - Event Overview
   - Objectives
   - Activities Conducted
   - Number of Participants
   - Outcomes and Impact
   - Challenges Encountered
   - Recommendations
5. Add photos (if available)
6. Generate report

### Documentation Packet
**When to use**: Compile all event documents in one package

1. Go to Reports → Documentation Packet tab
2. Click "Generate Documentation Packet"
3. Select event
4. Choose documents to include:
   - Liquidation report
   - Accomplishment report
   - Attendance sheets
   - Photos
   - Supporting documents
5. Generate complete packet
6. Export as PDF

### Custom Templates
**When to use**: Create reusable report formats

1. Go to Reports → Generated Templates tab
2. Click "Create Custom Template"
3. Use the template builder:
   - Drag and drop fields
   - Add text sections
   - Include organization branding
   - Set up signature blocks
4. Save template
5. Reuse for future reports

---

## Settings & Configuration

### Profile Settings
1. Go to Settings → Profile tab
2. Update:
   - Full name
   - Email address
   - Position
3. Change password if needed
4. Click "Save Changes"

### Organization Details
1. Go to Settings → Organization tab
2. Enter:
   - Barangay name
   - Municipality
   - Province
3. Upload barangay logo (optional)
4. Click "Save Changes"

### Notification Preferences
1. Go to Settings → Notifications tab
2. Toggle preferences:
   - Email notifications
   - Event reminders
   - Budget alerts
   - Report deadline reminders
3. Click "Save Preferences"

### Data Management
**Export Data**:
- Click "Export System Data"
- Save the JSON file as backup
- Store securely

**Import Data**:
- Click the file input under "Import Data"
- Select previously exported JSON file
- Data will be restored

**⚠️ Clear All Data**:
- Use with extreme caution
- Permanently deletes all system data
- Requires confirmation
- Cannot be undone

---

## Activity Log

### Viewing Activities
1. Navigate to Activity Log from sidebar
2. See all system activities listed chronologically
3. Each entry shows:
   - Timestamp
   - User who performed action
   - Module (Budget, Events, Reports, System)
   - Action description
   - Additional details

### Filtering Activities
- **Search**: Type keywords in search bar
- **Filter by Module**: Use dropdown to select specific module
- **Export**: Click "Export" to download CSV file

### Activity Summary
View statistics at the bottom:
- Budget activities count
- Event activities count
- Report activities count
- System activities count

---

## Tips & Tricks

### Navigation
- Use the sidebar for quick access to main sections
- Click the SK Management logo to return to dashboard
- Use browser back button to navigate history
- Breadcrumbs show your current location

### Keyboard Shortcuts
- **Enter**: Submit forms
- **Esc**: Close modal dialogs
- **Tab**: Navigate between form fields

### Data Entry
- All dates use YYYY-MM-DD format
- Currency amounts automatically format with commas
- Required fields are marked with asterisk (*)
- Form validation prevents invalid submissions

### Reports
- Always preview before finalizing
- Use Print → Save as PDF for best PDF quality
- Include all required signatures
- Keep digital and physical copies

### Performance
- System stores data locally in your browser
- Regular exports recommended for backup
- Clear browser cache if experiencing issues
- Use Chrome or Firefox for best experience

---

## Troubleshooting

### Can't Login
- Ensure JavaScript is enabled
- Try clearing browser cache
- Use incognito/private mode to test
- Check browser console for errors

### Data Not Saving
- Check browser localStorage is enabled
- Ensure sufficient storage space
- Try refreshing the page
- Export data before troubleshooting

### Reports Not Generating
- Verify all required fields are filled
- Check browser console for errors
- Try different browser
- Ensure pop-ups are allowed

### Slow Performance
- Close unnecessary browser tabs
- Clear browser cache
- Check internet connection
- Reduce number of open modals

---

## Security Best Practices

1. **Regular Backups**: Export data weekly
2. **Secure Computer**: Use password-protected device
3. **Logout**: Always logout when finished
4. **Private Browsing**: Avoid public computers
5. **Data Verification**: Double-check entries
6. **Document Storage**: Keep physical copies of critical reports

---

## Support & Contact

For technical support or questions:
- Contact your SK system administrator
- Refer to the FEATURES.md for detailed feature documentation
- Check the Activity Log for action history
- Export data before reporting issues

---

## Appendix: Report Templates

### Liquidation Report Structure
```
1. Event Information
   - Event name
   - Date and venue
   - Total budget

2. Expense List
   - Item descriptions
   - Amounts
   - OR numbers
   - Dates

3. Summary
   - Total expenses
   - Remaining balance
   - Variance

4. Certification
   - Signature blocks
   - Date certified
```

### Accomplishment Report Structure
```
1. Event Overview
   - Event details
   - Objectives

2. Implementation
   - Activities conducted
   - Participants

3. Results
   - Outcomes
   - Impact

4. Analysis
   - Challenges
   - Lessons learned
   - Recommendations

5. Documentation
   - Photos
   - Attendance
```

---

**Remember**: This system is designed to make SK management easier. Take time to explore all features and customize it to your barangay's needs!

**Version**: 1.0.0  
**Last Updated**: November 25, 2025
