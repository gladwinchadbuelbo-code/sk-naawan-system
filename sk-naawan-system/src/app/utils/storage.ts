// Utility functions for managing localStorage data persistence

export const storage = {
  // Events
  getEvents: () => {
    const data = localStorage.getItem('sk_events');
    return data ? JSON.parse(data) : null;
  },
  setEvents: (events: any[]) => {
    localStorage.setItem('sk_events', JSON.stringify(events));
  },

  // Budget/Funds
  getFunds: () => {
    const data = localStorage.getItem('sk_funds');
    return data ? JSON.parse(data) : null;
  },
  setFunds: (funds: any[]) => {
    localStorage.setItem('sk_funds', JSON.stringify(funds));
  },

  // Reports
  getReports: () => {
    const data = localStorage.getItem('sk_reports');
    return data ? JSON.parse(data) : null;
  },
  setReports: (reports: any[]) => {
    localStorage.setItem('sk_reports', JSON.stringify(reports));
  },

  // Templates
  getTemplates: () => {
    const data = localStorage.getItem('sk_templates');
    return data ? JSON.parse(data) : null;
  },
  setTemplates: (templates: any[]) => {
    localStorage.setItem('sk_templates', JSON.stringify(templates));
  },

  // Activity Proposals
  getActivityProposals: () => {
    const data = localStorage.getItem('sk_activity_proposals');
    return data ? JSON.parse(data) : [];
  },
  setActivityProposals: (proposals: any[]) => {
    localStorage.setItem('sk_activity_proposals', JSON.stringify(proposals));
  },

  // Budget Proposals
  getBudgetProposals: () => {
    const data = localStorage.getItem('sk_budget_proposals');
    return data ? JSON.parse(data) : [];
  },
  setBudgetProposals: (proposals: any[]) => {
    localStorage.setItem('sk_budget_proposals', JSON.stringify(proposals));
  },

  // Notifications (synchronous for immediate feedback)
  getNotifications: () => {
    const data = localStorage.getItem('sk_notifications');
    return data ? JSON.parse(data) : [];
  },
  addNotification: (notification: any) => {
    const notifications = storage.getNotifications();
    notifications.unshift({ ...notification, id: Date.now(), timestamp: new Date().toISOString(), read: false });
    localStorage.setItem('sk_notifications', JSON.stringify(notifications));
  },
  markNotificationAsRead: (id: number) => {
    const notifications = storage.getNotifications();
    const updated = notifications.map((n: any) => 
      n.id === id ? { ...n, read: true } : n
    );
    localStorage.setItem('sk_notifications', JSON.stringify(updated));
  },
  markAllNotificationsAsRead: () => {
    const notifications = storage.getNotifications();
    const updated = notifications.map((n: any) => ({ ...n, read: true }));
    localStorage.setItem('sk_notifications', JSON.stringify(updated));
  },
  deleteNotification: (id: number) => {
    const notifications = storage.getNotifications();
    const filtered = notifications.filter((n: any) => n.id !== id);
    localStorage.setItem('sk_notifications', JSON.stringify(filtered));
  },

  // Activity Log (synchronous for immediate logging)
  getActivityLog: () => {
    const data = localStorage.getItem('sk_activity_log');
    return data ? JSON.parse(data) : [];
  },
  addActivity: (activity: any) => {
    const logs = storage.getActivityLog();
    logs.unshift({ ...activity, id: Date.now(), timestamp: new Date().toISOString() });
    localStorage.setItem('sk_activity_log', JSON.stringify(logs));
  },

  // Settings
  getSettings: () => {
    const data = localStorage.getItem('sk_settings');
    return data ? JSON.parse(data) : null;
  },
  setSettings: (settings: any) => {
    localStorage.setItem('sk_settings', JSON.stringify(settings));
  },

  // Clear all SK data (except authentication)
  clearAllData: () => {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('sk_')) {
        localStorage.removeItem(key);
      }
    });
  },

  // Export all data
  exportAllData: () => {
    const data = {
      events: localStorage.getItem('sk_events') ? JSON.parse(localStorage.getItem('sk_events')!) : null,
      funds: localStorage.getItem('sk_funds') ? JSON.parse(localStorage.getItem('sk_funds')!) : null,
      reports: localStorage.getItem('sk_reports') ? JSON.parse(localStorage.getItem('sk_reports')!) : null,
      templates: localStorage.getItem('sk_templates') ? JSON.parse(localStorage.getItem('sk_templates')!) : null,
      activityProposals: localStorage.getItem('sk_activity_proposals') ? JSON.parse(localStorage.getItem('sk_activity_proposals')!) : [],
      budgetProposals: localStorage.getItem('sk_budget_proposals') ? JSON.parse(localStorage.getItem('sk_budget_proposals')!) : [],
      notifications: storage.getNotifications(),
      activityLog: storage.getActivityLog(),
      settings: localStorage.getItem('sk_settings') ? JSON.parse(localStorage.getItem('sk_settings')!) : null,
      exportDate: new Date().toISOString(),
    };
    return data;
  },

  // Import all data
  importAllData: (data: any) => {
    if (data.events) localStorage.setItem('sk_events', JSON.stringify(data.events));
    if (data.funds) localStorage.setItem('sk_funds', JSON.stringify(data.funds));
    if (data.reports) localStorage.setItem('sk_reports', JSON.stringify(data.reports));
    if (data.templates) localStorage.setItem('sk_templates', JSON.stringify(data.templates));
    if (data.activityProposals) localStorage.setItem('sk_activity_proposals', JSON.stringify(data.activityProposals));
    if (data.budgetProposals) localStorage.setItem('sk_budget_proposals', JSON.stringify(data.budgetProposals));
    if (data.notifications) localStorage.setItem('sk_notifications', JSON.stringify(data.notifications));
    if (data.activityLog) localStorage.setItem('sk_activity_log', JSON.stringify(data.activityLog));
    if (data.settings) localStorage.setItem('sk_settings', JSON.stringify(data.settings));
  },

  // Validation helpers
  validateEvent: (event: any): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!event.title || event.title.trim().length < 3) {
      errors.push('Event title must be at least 3 characters');
    }
    if (!event.date) {
      errors.push('Event date is required');
    }
    if (!event.venue || event.venue.trim().length < 3) {
      errors.push('Venue must be at least 3 characters');
    }
    if (event.budget && (isNaN(event.budget) || event.budget < 0)) {
      errors.push('Budget must be a positive number');
    }
    
    return { valid: errors.length === 0, errors };
  },

  validateFund: (fund: any): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!fund.name || fund.name.trim().length < 3) {
      errors.push('Name must be at least 3 characters');
    }
    if (!fund.amount || isNaN(fund.amount) || fund.amount <= 0) {
      errors.push('Amount must be a positive number');
    }
    if (!fund.category) {
      errors.push('Category is required');
    }
    if (fund.type === 'expense' && (!fund.orNumber || fund.orNumber.trim().length < 3)) {
      errors.push('OR Number is required for expenses');
    }
    
    return { valid: errors.length === 0, errors };
  },

  validateProposal: (proposal: any): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!proposal.title || proposal.title.trim().length < 5) {
      errors.push('Title must be at least 5 characters');
    }
    if (!proposal.description || proposal.description.trim().length < 20) {
      errors.push('Description must be at least 20 characters');
    }
    if (!proposal.submittedBy) {
      errors.push('Submitter information is required');
    }
    
    return { valid: errors.length === 0, errors };
  },

  // ===========================
  // ARCHIVING FUNCTIONS
  // ===========================

  // Archived Events
  getArchivedEvents: () => {
    const data = localStorage.getItem('sk_archived_events');
    return data ? JSON.parse(data) : [];
  },
  setArchivedEvents: (events: any[]) => {
    localStorage.setItem('sk_archived_events', JSON.stringify(events));
  },
  archiveEvent: (event: any, archivedBy: string) => {
    const archivedEvents = storage.getArchivedEvents();
    const archivedEvent = {
      ...event,
      archivedAt: new Date().toISOString(),
      archivedBy,
    };
    archivedEvents.unshift(archivedEvent);
    storage.setArchivedEvents(archivedEvents);
    
    // Remove from active events
    const activeEvents = storage.getEvents() || [];
    storage.setEvents(activeEvents.filter((e: any) => e.id !== event.id));
  },
  restoreArchivedEvent: (eventId: number) => {
    const archivedEvents = storage.getArchivedEvents();
    const eventToRestore = archivedEvents.find((e: any) => e.id === eventId);
    
    if (eventToRestore) {
      // Remove archive metadata
      const { archivedAt, archivedBy, ...restoredEvent } = eventToRestore;
      
      // Add back to active events
      const activeEvents = storage.getEvents() || [];
      activeEvents.push(restoredEvent);
      storage.setEvents(activeEvents);
      
      // Remove from archived
      storage.setArchivedEvents(archivedEvents.filter((e: any) => e.id !== eventId));
    }
  },

  // Archived Fund Entries
  getArchivedFundEntries: () => {
    const data = localStorage.getItem('sk_archived_funds');
    return data ? JSON.parse(data) : [];
  },
  setArchivedFundEntries: (funds: any[]) => {
    localStorage.setItem('sk_archived_funds', JSON.stringify(funds));
  },
  archiveFundEntry: (fund: any, archivedBy: string) => {
    const archivedFunds = storage.getArchivedFundEntries();
    const archivedFund = {
      ...fund,
      archivedAt: new Date().toISOString(),
      archivedBy,
    };
    archivedFunds.unshift(archivedFund);
    storage.setArchivedFundEntries(archivedFunds);
    
    // Remove from active funds
    const activeFunds = storage.getFunds() || [];
    storage.setFunds(activeFunds.filter((f: any) => f.id !== fund.id));
  },
  restoreArchivedFundEntry: (fundId: number) => {
    const archivedFunds = storage.getArchivedFundEntries();
    const fundToRestore = archivedFunds.find((f: any) => f.id === fundId);
    
    if (fundToRestore) {
      // Remove archive metadata
      const { archivedAt, archivedBy, ...restoredFund } = fundToRestore;
      
      // Add back to active funds
      const activeFunds = storage.getFunds() || [];
      activeFunds.push(restoredFund);
      storage.setFunds(activeFunds);
      
      // Remove from archived
      storage.setArchivedFundEntries(archivedFunds.filter((f: any) => f.id !== fundId));
    }
  },

  // Archived Proposals (both activity and budget)
  getArchivedProposals: () => {
    const data = localStorage.getItem('sk_archived_proposals');
    return data ? JSON.parse(data) : [];
  },
  setArchivedProposals: (proposals: any[]) => {
    localStorage.setItem('sk_archived_proposals', JSON.stringify(proposals));
  },
  archiveProposal: (proposal: any, proposalType: 'activity' | 'budget', archivedBy: string) => {
    const archivedProposals = storage.getArchivedProposals();
    const archivedProposal = {
      ...proposal,
      type: proposalType,
      archivedAt: new Date().toISOString(),
      archivedBy,
    };
    archivedProposals.unshift(archivedProposal);
    storage.setArchivedProposals(archivedProposals);
    
    // Remove from active proposals
    if (proposalType === 'activity') {
      const activeProposals = storage.getActivityProposals();
      storage.setActivityProposals(activeProposals.filter((p: any) => p.id !== proposal.id));
    } else {
      const activeProposals = storage.getBudgetProposals();
      storage.setBudgetProposals(activeProposals.filter((p: any) => p.id !== proposal.id));
    }
  },
  restoreArchivedProposal: (proposalId: number) => {
    const archivedProposals = storage.getArchivedProposals();
    const proposalToRestore = archivedProposals.find((p: any) => p.id === proposalId);
    
    if (proposalToRestore) {
      // Remove archive metadata
      const { archivedAt, archivedBy, type, ...restoredProposal } = proposalToRestore;
      
      // Add back to active proposals
      if (type === 'activity') {
        const activeProposals = storage.getActivityProposals();
        activeProposals.push(restoredProposal);
        storage.setActivityProposals(activeProposals);
      } else {
        const activeProposals = storage.getBudgetProposals();
        activeProposals.push(restoredProposal);
        storage.setBudgetProposals(activeProposals);
      }
      
      // Remove from archived
      storage.setArchivedProposals(archivedProposals.filter((p: any) => p.id !== proposalId));
    }
  },

  // ===========================
  // ATTENDANCE FUNCTIONS
  // ===========================

  // Get attendance records for a specific event
  getEventAttendance: (eventId: number) => {
    const data = localStorage.getItem(`sk_attendance_${eventId}`);
    return data ? JSON.parse(data) : [];
  },

  // Set attendance records for a specific event
  setEventAttendance: (eventId: number, attendance: any[]) => {
    localStorage.setItem(`sk_attendance_${eventId}`, JSON.stringify(attendance));
  },

  // Add single attendance record
  addAttendanceRecord: (eventId: number, record: any) => {
    const attendance = storage.getEventAttendance(eventId);
    const newRecord = {
      ...record,
      id: Date.now(),
      timestamp: new Date().toISOString(),
    };
    attendance.push(newRecord);
    storage.setEventAttendance(eventId, attendance);
    return newRecord;
  },

  // Check if participant already checked in
  isAlreadyCheckedIn: (eventId: number, contactNumber: string) => {
    const attendance = storage.getEventAttendance(eventId);
    return attendance.some((record: any) => record.contactNumber === contactNumber);
  },

  // Delete attendance record
  deleteAttendanceRecord: (eventId: number, recordId: number) => {
    const attendance = storage.getEventAttendance(eventId);
    storage.setEventAttendance(
      eventId,
      attendance.filter((record: any) => record.id !== recordId)
    );
  },

  // Get attendance statistics
  getAttendanceStats: (eventId: number) => {
    const attendance = storage.getEventAttendance(eventId);
    return {
      total: attendance.length,
      qrCheckIns: attendance.filter((r: any) => r.checkInMethod === 'qr').length,
      manualCheckIns: attendance.filter((r: any) => r.checkInMethod === 'manual').length,
      withPhotos: attendance.filter((r: any) => r.photo).length,
    };
  },
};