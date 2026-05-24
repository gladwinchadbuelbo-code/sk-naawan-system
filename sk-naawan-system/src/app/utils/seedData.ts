// Seed data for demo/initial content in the transparency portal
import { storage } from './storage';

export function initializeSeedData() {
  // Check if data already exists - don't overwrite
  const existingEvents = storage.getEvents();
  const existingFunds = storage.getFunds();
  const existingActivityProposals = storage.getActivityProposals();
  const existingBudgetProposals = storage.getBudgetProposals();
  
  // Only initialize if storage is truly empty (check for null or empty arrays)
  const hasEvents = existingEvents && existingEvents.length > 0;
  const hasFunds = existingFunds && existingFunds.length > 0;
  const hasActivityProposals = existingActivityProposals && existingActivityProposals.length > 0;
  const hasBudgetProposals = existingBudgetProposals && existingBudgetProposals.length > 0;
  
  if (hasEvents || hasFunds || hasActivityProposals || hasBudgetProposals) {
    console.log('ℹ️ Seed data already exists, skipping initialization');
    return; // Data already exists, don't reinitialize
  }

  console.log('🌱 Initializing zero-data state for May 2026...');

  // Zero-Data State - Empty arrays for fresh start
  const seedEvents: any[] = [];
  const seedFunds: any[] = [];
  const seedActivityProposals: any[] = [];

  // Seed Budget Proposals
  const seedBudgetProposals: any[] = [];

  // Initialize storage with seed data
  storage.setEvents(seedEvents);
  storage.setFunds(seedFunds);
  storage.setActivityProposals(seedActivityProposals);
  storage.setBudgetProposals(seedBudgetProposals);
  
  console.log('✅ Zero-data state initialized successfully for May 2026');
}

// Export a function to force reset all data (useful for debugging/testing)
export function resetAllData() {
  console.log('🔄 Resetting all data to zero state...');
  localStorage.clear();
  initializeSeedData();
  console.log('✅ All data has been reset to zero state for May 2026');
  window.location.reload();
}

// Export a function to prepare for demo (ensures zero state)
export function prepareDemoState() {
  console.log('🎬 Preparing demo state...');
  localStorage.clear();
  // Force initialize even if data exists
  const seedEvents: any[] = [];
  const seedFunds: any[] = [];
  const seedActivityProposals: any[] = [];
  const seedBudgetProposals: any[] = [];

  storage.setEvents(seedEvents);
  storage.setFunds(seedFunds);
  storage.setActivityProposals(seedActivityProposals);
  storage.setBudgetProposals(seedBudgetProposals);

  console.log('✅ Demo state ready - May 2026 zero-data state');
  window.location.reload();
}

// Make it available on window for easy console access
if (typeof window !== 'undefined') {
  (window as any).resetSKData = resetAllData;
  (window as any).prepareDemoState = prepareDemoState;
  console.log('💡 Tip: Run "resetSKData()" or "prepareDemoState()" in console to reset all data');
}