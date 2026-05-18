import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { Dashboard } from './pages/Dashboard';
import { BudgetPage } from './pages/BudgetPage';
import { EventsPage } from './pages/EventsPage';
import { EventDetailsPage } from './pages/EventDetailsPage';
import { AttendanceTrackingPage } from './pages/AttendanceTrackingPage';
import { AttendanceManagementPage } from './pages/AttendanceManagementPage';
import { PublicCheckInPage } from './pages/PublicCheckInPage';
import { ReportsPage } from './pages/ReportsPage';
import { LiquidationReportPage } from './pages/LiquidationReportPage';
import { AccomplishmentReportPage } from './pages/AccomplishmentReportPage';
import { DocumentationPacketPage } from './pages/DocumentationPacketPage';
import { TemplateEditorPage } from './pages/TemplateEditorPage';
import { PendingApprovalsPage } from './pages/PendingApprovalsPage';
import { ActivityProposalPage } from './pages/ActivityProposalPage';
import { BudgetProposalPage } from './pages/BudgetProposalPage';
import { MyProposalsPage } from './pages/MyProposalsPage';
import { MyBudgetProposalsPage } from './pages/MyBudgetProposalsPage';
import { SettingsPage } from './pages/SettingsPage';
import { ActivityLogPage } from './pages/ActivityLogPage';
import { PublicPortalPage } from './pages/PublicPortalPage';
import { PublicBudgetPage } from './pages/PublicBudgetPage';
import { PublicActivitiesPage } from './pages/PublicActivitiesPage';
import { PublicCalendarPage } from './pages/PublicCalendarPage';
import { PublicSearchPage } from './pages/PublicSearchPage';
import { ArchivesPage } from './pages/ArchivesPage';
import { Toaster } from './components/ui/sonner';
import { useEffect } from 'react';
import { initializeSeedData } from './utils/seedData';

export default function App() {
  // Initialize seed data on app load
  useEffect(() => {
    initializeSeedData();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Landing Page - Default Route */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Public Routes - No Authentication Required */}
          <Route path="/public" element={<PublicPortalPage />} />
          <Route path="/public/budget" element={<PublicBudgetPage />} />
          <Route path="/public/activities" element={<PublicActivitiesPage />} />
          <Route path="/public/calendar" element={<PublicCalendarPage />} />
          <Route path="/public/search" element={<PublicSearchPage />} />
          
          {/* Public Check-In - QR Code Destination (No Auth Required) */}
          <Route path="/check-in/:eventId" element={<PublicCheckInPage />} />
          
          {/* Authentication Route */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected Routes - Authentication Required */}
          <Route path="/staff" element={<ProtectedRoute />}>
            <Route index element={<Navigate to="/staff/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="budget" element={<BudgetPage />} />
            <Route path="budget/proposal/create" element={<BudgetProposalPage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="events/proposal/create" element={<ActivityProposalPage />} />
            <Route path="my-proposals" element={<MyProposalsPage />} />
            <Route path="my-budget-proposals" element={<MyBudgetProposalsPage />} />
            <Route path="events/:id" element={<EventDetailsPage />} />
            <Route path="events/:id/attendance-old" element={<AttendanceTrackingPage />} />
            <Route path="events/:eventId/attendance" element={<AttendanceManagementPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="reports/liquidation/:eventId?" element={<LiquidationReportPage />} />
            <Route path="reports/accomplishment/:eventId?" element={<AccomplishmentReportPage />} />
            <Route path="reports/documentation/:eventId?" element={<DocumentationPacketPage />} />
            <Route path="reports/templates/create" element={<TemplateEditorPage />} />
            <Route path="reports/templates/:id/edit" element={<TemplateEditorPage />} />
            <Route path="approvals" element={<PendingApprovalsPage />} />
            <Route path="archives" element={<ArchivesPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="activity-log" element={<ActivityLogPage />} />
          </Route>
          
          {/* Catch all - redirect to landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="top-right" />
      </Router>
    </AuthProvider>
  );
}