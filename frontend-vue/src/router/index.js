import { createRouter, createWebHistory } from 'vue-router'
import DashboardLayout from '../layouts/DashboardLayout.vue'

const routes = [
  {
    path: '/',
    component: DashboardLayout,
    children: [
      { path: '', name: 'Dashboard', component: () => import('../pages/Dashboard.vue') },
      { path: 'approvals', name: 'Approvals', component: () => import('../pages/Approvals.vue') },
      { path: 'budget', name: 'Budget', component: () => import('../pages/Budget.vue') },
      { path: 'events', name: 'Events', component: () => import('../pages/Events.vue') },
      { path: 'proposals', name: 'Proposals', component: () => import('../pages/Proposals.vue') },
      { path: 'attendance/:id', name: 'Attendance', component: () => import('../pages/AttendanceManagement.vue') },
      { path: 'reports', name: 'Reports', component: () => import('../pages/Reports.vue') },
      { path: 'archives', name: 'Archives', component: () => import('../pages/Archives.vue') },
      { path: 'transactions', name: 'Transactions', component: () => import('../pages/Transactions.vue') },
      { path: 'settings', name: 'Settings', component: () => import('../pages/Settings.vue') },
      { path: 'announcements', name: 'Announcements', component: () => import('../pages/public/Announcements.vue') },
      { path: 'create-proposal', name: 'CreateProposal', component: () => import('../pages/CreateProposal.vue') },
      { path: 'create-budget-proposal', name: 'CreateBudgetProposal', component: () => import('../pages/CreateBudgetProposal.vue') },
      { path: 'budget-proposals', name: 'BudgetProposals', component: () => import('../pages/BudgetProposals.vue') }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../pages/Login.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
