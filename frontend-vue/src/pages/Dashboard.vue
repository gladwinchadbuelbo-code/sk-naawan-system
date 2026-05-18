<template>
  <PublicDashboard v-if="userStore.role === 'Public Viewer'" />
  <div v-else class="max-w-[1440px] mx-auto pb-12 p-10 font-inter bg-[#F8FAFC] animate-fade-up">
    
    <!-- Header Section -->
    <div class="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <div class="flex items-center gap-4">
          <h1 class="text-3xl font-black text-slate-900 tracking-tight uppercase tracking-widest">Dashboard Overview</h1>
          <span :class="roleBadgeColor" class="px-4 py-1.5 text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-sm">
            {{ userStore.role }}
          </span>
        </div>
        <p class="text-slate-500 text-sm font-medium mt-2">Authenticated as <span class="text-emerald-600 font-bold">{{ userStore.name }}</span></p>
      </div>
      <div class="flex items-center gap-3">
         <div class="bg-white px-5 py-2.5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
            <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Monitoring</span>
         </div>
      </div>
    </div>

    <!-- ROW 1: Metrics (4 Columns) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-[#065F46] rounded-[2rem] p-7 text-white shadow-lg relative overflow-hidden group">
        <div class="z-10 relative">
          <p class="text-[9px] font-black uppercase tracking-[0.2em] text-white/60">Annual Budget</p>
          <h2 class="text-3xl font-black font-jakarta mt-2">₱1.4M</h2>
          <p class="text-[8px] font-black text-white/40 mt-4 uppercase tracking-[0.2em]">FY 2026 Allocation</p>
        </div>
        <div class="absolute top-6 right-6 w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
          <WalletIcon class="w-6 h-6 text-white" />
        </div>
      </div>

      <div class="bg-[#DC2626] rounded-[2rem] p-7 text-white shadow-lg relative overflow-hidden group">
        <div class="z-10 relative">
          <p class="text-[9px] font-black uppercase tracking-[0.2em] text-white/60">Total Expenses</p>
          <h2 class="text-3xl font-black font-jakarta mt-2">₱487K</h2>
          <p class="text-[8px] font-black text-white/40 mt-4 uppercase tracking-[0.2em]">Expenses to date</p>
        </div>
        <div class="absolute top-6 right-6 w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
          <TrendingDownIcon class="w-6 h-6 text-white" />
        </div>
      </div>

      <div class="bg-[#10B981] rounded-[2rem] p-7 text-white shadow-lg relative overflow-hidden group">
        <div class="z-10 relative">
          <p class="text-[9px] font-black uppercase tracking-[0.2em] text-white/60">Remaining Balance</p>
          <h2 class="text-3xl font-black font-jakarta mt-2">₱913K</h2>
          <p class="text-[8px] font-black text-white/40 mt-4 uppercase tracking-[0.2em]">Available Funds</p>
        </div>
        <div class="absolute top-6 right-6 w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
          <TrendingUpIcon class="w-6 h-6 text-white" />
        </div>
      </div>

      <div class="bg-[#1E293B] rounded-[2rem] p-7 text-white shadow-lg relative overflow-hidden group">
        <div class="z-10 relative">
          <p class="text-[9px] font-black uppercase tracking-[0.2em] text-white/60">Upcoming Events</p>
          <h2 class="text-3xl font-black font-jakarta mt-2">02</h2>
          <p class="text-[8px] font-black text-white/40 mt-4 uppercase tracking-[0.2em]">Next 30 Days</p>
        </div>
        <div class="absolute top-6 right-6 w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
          <CalendarIcon class="w-6 h-6 text-white" />
        </div>
      </div>
    </div>

    <!-- Quick Actions Section -->
    <div class="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 mb-8">
      <div class="flex items-center justify-between mb-6">
         <h3 class="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-3">
            <ZapIcon class="w-3.5 h-3.5 text-emerald-500" /> Administrative Quick Actions
         </h3>
         <span class="text-[8px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">Most Frequently Used</span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <template v-if="userStore.role === 'SK Treasurer'">
           <button @click="$router.push('/budget')" class="group bg-[#DC2626] p-7 rounded-[2rem] text-white shadow-lg transition-all hover:-translate-y-1 text-center flex flex-col items-center justify-center gap-5">
              <TrendingDownIcon class="w-9 h-9 opacity-90 group-hover:scale-110 transition-transform" />
              <div>
                <p class="text-lg font-black uppercase tracking-[0.1em]">Record Expense</p>
                <p class="text-[10px] font-bold text-white/60 mt-1 uppercase tracking-widest">Track current spending</p>
              </div>
           </button>
           <button @click="$router.push('/budget')" class="group bg-[#10B981] p-7 rounded-[2rem] text-white shadow-lg transition-all hover:-translate-y-1 text-center flex flex-col items-center justify-center gap-5">
              <TrendingUpIcon class="w-9 h-9 opacity-90 group-hover:scale-110 transition-transform" />
              <div>
                <p class="text-lg font-black uppercase tracking-[0.1em]">Add Fund</p>
                <p class="text-[10px] font-bold text-white/60 mt-1 uppercase tracking-widest">Increase available budget</p>
              </div>
           </button>
           <button @click="$router.push('/create-budget-proposal')" class="group bg-[#065F46] p-7 rounded-[2rem] text-white shadow-lg transition-all hover:-translate-y-1 text-center flex flex-col items-center justify-center gap-5">
              <FilePlusIcon class="w-9 h-9 opacity-90 group-hover:scale-110 transition-transform" />
              <div>
                <p class="text-lg font-black uppercase tracking-[0.1em]">Submit Proposal</p>
                <p class="text-[10px] font-bold text-white/60 mt-1 uppercase tracking-widest">New budget request</p>
              </div>
           </button>
        </template>
        <template v-else-if="userStore.role === 'SK Chairperson'">
           <button @click="$router.push('/approvals')" class="group bg-[#F59E0B] p-7 rounded-[1.5rem] text-white shadow-md transition-all hover:-translate-y-1 text-center flex flex-col items-center justify-center gap-4">
              <CheckCircleIcon class="w-8 h-8 opacity-80 group-hover:scale-110 transition-transform" />
              <div>
                <p class="text-base font-black uppercase tracking-widest">Review Requests</p>
                <p class="text-[9px] font-bold text-white/60 mt-1 uppercase tracking-widest">Pending Approvals</p>
              </div>
           </button>
           <button @click="$router.push('/budget')" class="group bg-[#065F46] p-7 rounded-[1.5rem] text-white shadow-md transition-all hover:-translate-y-1 text-center flex flex-col items-center justify-center gap-4">
              <SearchIcon class="w-8 h-8 opacity-80 group-hover:scale-110 transition-transform" />
              <div>
                <p class="text-base font-black uppercase tracking-widest">Audit Funds</p>
                <p class="text-[9px] font-bold text-white/60 mt-1 uppercase tracking-widest">Monitor Transparency</p>
              </div>
           </button>
           <button @click="$router.push('/reports')" class="group bg-[#1E293B] p-7 rounded-[1.5rem] text-white shadow-md transition-all hover:-translate-y-1 text-center flex flex-col items-center justify-center gap-4">
              <BarChart3Icon class="w-8 h-8 opacity-80 group-hover:scale-110 transition-transform" />
              <div>
                <p class="text-base font-black uppercase tracking-widest">Accomplishments</p>
                <p class="text-[9px] font-bold text-white/60 mt-1 uppercase tracking-widest">Project Reporting</p>
              </div>
           </button>
        </template>
        <template v-else-if="userStore.role === 'SK Secretary'">
           <button @click="$router.push('/events')" class="group bg-[#065F46] p-7 rounded-[1.5rem] text-white shadow-md transition-all hover:-translate-y-1 text-center flex flex-col items-center justify-center gap-4">
              <CalendarIcon class="w-8 h-8 opacity-80 group-hover:scale-110 transition-transform" />
              <div>
                <p class="text-base font-black uppercase tracking-widest">Create Event</p>
                <p class="text-[9px] font-bold text-white/60 mt-1 uppercase tracking-widest">Plan new SK activity</p>
              </div>
           </button>
           <button @click="$router.push('/proposals')" class="group bg-[#10B981] p-7 rounded-[1.5rem] text-white shadow-md transition-all hover:-translate-y-1 text-center flex flex-col items-center justify-center gap-4">
              <FilePlusIcon class="w-8 h-8 opacity-80 group-hover:scale-110 transition-transform" />
              <div>
                <p class="text-base font-black uppercase tracking-widest">Submit Proposal</p>
                <p class="text-[9px] font-bold text-white/60 mt-1 uppercase tracking-widest">Project documentation</p>
              </div>
           </button>
           <button @click="$router.push('/events')" class="group bg-[#1E293B] p-7 rounded-[1.5rem] text-white shadow-md transition-all hover:-translate-y-1 text-center flex flex-col items-center justify-center gap-4">
              <UsersIcon class="w-8 h-8 opacity-80 group-hover:scale-110 transition-transform" />
              <div>
                <p class="text-base font-black uppercase tracking-widest">Attendance</p>
                <p class="text-[9px] font-bold text-white/60 mt-1 uppercase tracking-widest">Manage participants</p>
              </div>
           </button>
        </template>
      </div>
    </div>

    <!-- 2x2 GRID -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 group">
        <div class="flex items-center justify-between mb-8">
           <h3 class="text-sm font-black text-slate-900 tracking-tight">Budget Allocation</h3>
           <button class="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline">View all</button>
        </div>
        <div class="flex flex-col items-center justify-center py-10">
           <div class="w-48 h-48 bg-slate-50 rounded-full border border-slate-100 flex flex-col items-center justify-center relative shadow-inner">
              <div class="absolute inset-2 border-4 border-slate-100 border-t-emerald-500 rounded-full"></div>
              <p class="text-xs font-black text-slate-400 uppercase tracking-widest">No data</p>
           </div>
           <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-8">No expense data yet</p>
        </div>
      </div>

      <div class="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 group">
        <div class="flex items-center justify-between mb-8">
           <h3 class="text-sm font-black text-slate-900 tracking-tight">Upcoming Events</h3>
           <button class="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline">View all</button>
        </div>
        <div class="flex flex-col items-center justify-center py-10">
           <div class="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mb-6">
              <CalendarIcon class="w-8 h-8" />
           </div>
           <p class="text-xs font-black text-slate-900 tracking-tight uppercase tracking-widest">No upcoming events</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import PublicDashboard from './public/Dashboard.vue'
import {
  Wallet as WalletIcon, TrendingDown as TrendingDownIcon, TrendingUp as TrendingUpIcon,
  Calendar as CalendarIcon, FileText as FileTextIcon, PlusCircle as FilePlusIcon,
  Zap as ZapIcon, Search as SearchIcon, Users as UsersIcon, BarChart3 as BarChart3Icon,
  Plus as PlusIcon, CheckCircle as CheckCircleIcon
} from 'lucide-vue-next'

const router = useRouter()
const userStore = useUserStore()

const roleBadgeColor = computed(() => {
  const map = {
    'SK Chairperson': 'bg-blue-600',
    'SK Secretary': 'bg-emerald-600',
    'SK Treasurer': 'bg-amber-600',
    'Public Viewer': 'bg-slate-600'
  }
  return map[userStore.role] || 'bg-emerald-600'
})
</script>

<style scoped>
.font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
</style>
