# Developer Guide - SK Naawan IMS

## Project Structure

```
/workspaces/default/code/
├── src/
│   ├── app/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── ui/             # Base UI components (Button, Card, etc.)
│   │   │   ├── Layout.tsx      # Main layout with sidebar
│   │   │   └── ProtectedRoute.tsx
│   │   ├── contexts/           # React contexts
│   │   │   └── AuthContext.tsx # Authentication & permissions
│   │   ├── pages/              # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── BudgetPage.tsx
│   │   │   ├── EventsPage.tsx
│   │   │   ├── ActivityProposalPage.tsx
│   │   │   ├── BudgetProposalPage.tsx
│   │   │   ├── MyProposalsPage.tsx
│   │   │   ├── MyBudgetProposalsPage.tsx
│   │   │   ├── PendingApprovalsPage.tsx
│   │   │   └── ... (more pages)
│   │   ├── utils/              # Utility functions
│   │   │   ├── storage.ts      # localStorage utilities
│   │   │   └── seedData.ts     # Initial data setup
│   │   └── App.tsx             # Main app component with routes
│   ├── styles/                 # CSS styles
│   │   ├── index.css           # Main CSS entry
│   │   ├── globals.css         # Global styles & Eco-Trust theme
│   │   └── default_theme.css   # Default theme variables
│   └── imports/                # Imported assets (images, logos)
├── package.json                # Dependencies
├── SYSTEM_GUIDE.md            # User documentation
├── FINAL_CHECKLIST.md         # QA checklist
└── DEVELOPER_GUIDE.md         # This file
```

## Technology Stack

### Core
- **React** 18.3.1 - UI library
- **TypeScript** - Type safety
- **React Router** 7.15.0 - Navigation
- **Tailwind CSS** 4.1.12 - Styling

### UI Components
- **Radix UI** - Accessible component primitives
- **Lucide React** 0.487.0 - Icons
- **Recharts** 2.15.2 - Charts

### Utilities
- **date-fns** 3.6.0 - Date formatting
- **sonner** 2.0.3 - Toast notifications
- **clsx** / **tailwind-merge** - Class management

## Key Concepts

### Authentication System
Located in `src/app/contexts/AuthContext.tsx`:
- Three user roles: chairperson, treasurer, secretary
- Demo credentials stored in DEMO_USERS object
- Permission system via `canEdit()` and `canApprove()`
- User state persisted in localStorage

### Data Persistence
Located in `src/app/utils/storage.ts`:
- All data stored in browser localStorage
- Prefixed with 'sk_' for namespace isolation
- Key storage methods:
  - `storage.getEvents()` / `storage.setEvents()`
  - `storage.getFunds()` / `storage.setFunds()`
  - `storage.getActivityProposals()` / `storage.setActivityProposals()`
  - `storage.getBudgetProposals()` / `storage.setBudgetProposals()`
  - Plus many more...

### Routing System
Located in `src/app/App.tsx`:
- Public routes: `/`, `/login`, `/public/*`
- Protected routes: `/staff/*` (requires authentication)
- Role-based access control enforced in components

### Eco-Trust Theme
Located in `src/styles/globals.css`:
- Primary: `#059669` (Emerald Green)
- Secondary: `#10B981` (Mint Green)
- Danger: `#EF4444` (Soft Red)
- Warning: `#F59E0B` (Amber)
- Background: `#F9FAFB` (Off-White)
- Dark: `#111827` (Deep Navy)

## Development Commands

### Install Dependencies
```bash
pnpm install
```

### Run Development Server
The Vite dev server should already be running in Figma Make.
If not running locally:
```bash
pnpm dev
```

### Build for Production
```bash
pnpm build
```

## Common Development Tasks

### Adding a New Page
1. Create component in `src/app/pages/YourPage.tsx`
2. Add route in `src/app/App.tsx`
3. Add navigation link in `src/app/components/Layout.tsx` if needed
4. Apply Eco-Trust theme colors and rounded-xl styling

### Adding a New Form
1. Create form component with validation
2. Use existing UI components from `src/app/components/ui/`
3. Implement form submission handler
4. Add toast notifications for success/error
5. Update localStorage via `storage.ts` utilities
6. Log activity via `storage.addActivity()`

### Modifying Permissions
Edit `src/app/contexts/AuthContext.tsx`:
- Update `canEdit()` function for resource-level permissions
- Update `canApprove()` for approval permissions
- Add permission checks in components

### Customizing Theme
Edit `src/styles/globals.css`:
- Update CSS custom properties in `:root`
- Modify color values while maintaining contrast ratios
- Update component styles to use new colors

### Adding Storage Functions
Edit `src/app/utils/storage.ts`:
- Add getter/setter methods
- Follow existing patterns for consistency
- Add validation if needed

## Code Style Guidelines

### Component Structure
```typescript
// Imports
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from 'lucide-react';

// Types/Interfaces
interface Props {
  // ...
}

// Component
export function ComponentName({ prop }: Props) {
  // Hooks
  const navigate = useNavigate();
  const [state, setState] = useState();

  // Effects
  useEffect(() => {
    // ...
  }, []);

  // Handlers
  const handleClick = () => {
    // ...
  };

  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### Styling Conventions
- Use Tailwind utility classes
- Apply `rounded-xl` for cards and primary buttons
- Use theme colors: `bg-[#059669]` for primary actions
- Apply `text-[#111827]` for headings
- Use `font-semibold` or `font-bold` for emphasis
- Add hover states: `hover:bg-[#047857]`

### Toast Notifications
```typescript
import { toast } from 'sonner';

toast.success('Operation successful');
toast.error('Operation failed');
toast.warning('Warning message');
toast.info('Info message');
```

## Testing Locally

### Test User Flows
1. **Secretary Flow**:
   - Login as secretary
   - Create activity proposal
   - Create event
   - Upload event documents

2. **Treasurer Flow**:
   - Login as treasurer
   - Create budget proposal
   - Add fund
   - Record expense with receipt

3. **Chairperson Flow**:
   - Login as chairperson
   - Review activity proposal
   - Approve/reject with comments
   - Review budget proposal
   - Approve/reject with feedback

### Test Data Management
```javascript
// Reset all data
localStorage.clear();

// Or use utility function in console
resetSKData();

// Prepare demo state
prepareDemoState();
```

## Debugging Tips

### Check localStorage
```javascript
// View all SK data
Object.keys(localStorage)
  .filter(key => key.startsWith('sk_'))
  .forEach(key => {
    console.log(key, JSON.parse(localStorage.getItem(key)));
  });

// Clear specific data
localStorage.removeItem('sk_events');
localStorage.removeItem('sk_funds');
```

### Check Current User
```javascript
// In browser console
JSON.parse(localStorage.getItem('currentUser'));
```

### Activity Log
```javascript
// View all activities
JSON.parse(localStorage.getItem('sk_activity_log'));
```

## Deployment Considerations

### Environment Variables
Currently, the app doesn't use environment variables. All config is in code.

To add environment support:
1. Create `.env` file
2. Add variables with `VITE_` prefix
3. Access via `import.meta.env.VITE_VARIABLE_NAME`

### Production Build
- The build output will be in `dist/` folder
- All assets are bundled and optimized
- Source maps included for debugging

### Hosting Options
- **Static hosting**: Vercel, Netlify, GitHub Pages
- **Firebase Hosting**
- **AWS S3 + CloudFront**
- Any static file server

### Post-Deployment
- Test all user flows
- Verify localStorage persistence
- Check HTTPS (required for localStorage)
- Test on mobile devices

## Known Limitations

### LocalStorage
- Limited to ~5-10MB per domain
- Synchronous API (blocking)
- Data cleared when user clears browser data
- Not suitable for large file storage

### No Backend
- No server-side validation
- No real-time updates
- No data backup
- No cross-device sync

### Authentication
- Demo accounts only
- No password recovery
- No session expiration
- No 2FA

## Future Enhancement Ideas

### Backend Integration
- Replace localStorage with REST API
- Add PostgreSQL/MySQL database
- Implement JWT authentication
- Add file upload to cloud storage

### Features
- Email notifications
- SMS alerts for approvals
- Print-friendly reports
- PDF export
- Excel export
- Mobile app (React Native)
- Real-time collaboration

### Security
- Implement proper authentication
- Add CSRF protection
- Implement rate limiting
- Add input sanitization
- Implement role hierarchies

## Support & Contact

For questions or issues:
- Check SYSTEM_GUIDE.md for user documentation
- Check FINAL_CHECKLIST.md for verification
- Review code comments in source files

---

**Happy Coding!** 🚀
