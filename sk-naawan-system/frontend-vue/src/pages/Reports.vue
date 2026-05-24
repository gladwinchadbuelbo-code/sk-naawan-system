<template>
  <PublicReports v-if="userStore.role === 'Public Viewer'" />
  <div v-else class="max-w-[1440px] mx-auto pb-12 p-10 font-inter bg-[#F8FAFC] animate-fade-up">
    
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
      <div>
        <h1 class="text-4xl font-black text-slate-900 tracking-tight">Reports & Documentation</h1>
        <p class="text-slate-500 text-sm font-medium mt-1">Strategic monitoring of SK Naawan's accomplishments and financial transparency</p>
      </div>
      <div class="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex items-center gap-5 group hover:border-emerald-200 transition-all">
        <div class="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500 shadow-inner">
          <ShieldCheckIcon class="w-6 h-6" />
        </div>
        <div>
           <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Contextual Role</p>
           <p class="text-xs font-black text-slate-900 uppercase tracking-widest">{{ userStore.role }}</p>
        </div>
      </div>
    </div>

    <!-- Horizontal Tabs (Modern System) -->
    <div class="flex items-center gap-2 p-2 bg-white rounded-[2rem] border border-slate-100 shadow-sm w-fit mb-10">
      <button 
        v-for="tab in tabs" 
        :key="tab"
        @click="activeTab = tab"
        class="px-8 py-3.5 text-[11px] font-black uppercase tracking-widest rounded-[1.5rem] transition-all duration-300"
        :class="activeTab === tab ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'"
      >
        {{ tab }}
      </button>
    </div>

    <!-- TAB: BUDGET REPORTS -->
    <div v-if="activeTab === 'Budget Reports'" class="space-y-10">
      <!-- Analytics Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div class="glass-card p-12 min-h-[400px] flex flex-col group">
          <div class="flex items-center justify-between mb-12">
             <h3 class="text-xs font-black text-slate-900 uppercase tracking-[0.3em]">Revenue vs Expenditure</h3>
             <TrendingUpIcon class="w-5 h-5 text-emerald-500" />
          </div>
          <div class="flex-1 flex flex-col items-center justify-center py-8">
            <div class="w-full h-5 bg-slate-50 rounded-full overflow-hidden flex shadow-inner border border-slate-100 p-1">
               <div class="h-full bg-emerald-500 w-[65%] rounded-full shadow-lg shadow-emerald-500/20 transition-all duration-1000"></div>
               <div class="h-full bg-red-500 w-[35%] rounded-full shadow-lg shadow-red-500/20 ml-1 transition-all duration-1000"></div>
            </div>
            <div class="flex justify-between w-full mt-10">
               <div class="flex flex-col">
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Revenue</span>
                  <span class="text-3xl font-black text-slate-900 tracking-tight mt-1">₱1,400,000</span>
               </div>
               <div class="flex flex-col text-right">
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Liquidated Expenses</span>
                  <span class="text-3xl font-black text-slate-900 tracking-tight mt-1">₱487,000</span>
               </div>
            </div>
          </div>
          <div class="absolute -right-16 -top-16 w-48 h-48 bg-emerald-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>

        <div class="glass-card p-12 min-h-[400px] flex flex-col group">
          <div class="flex items-center justify-between mb-12">
             <h3 class="text-xs font-black text-slate-900 uppercase tracking-[0.3em]">Strategic Allocation</h3>
             <PieChartIcon class="w-5 h-5 text-blue-500" />
          </div>
          <div class="flex-1 flex flex-col items-center justify-center relative">
            <div class="w-44 h-44 rounded-[3rem] border-[14px] border-slate-50 border-t-emerald-500 border-r-blue-500 border-b-amber-500 flex items-center justify-center mb-8 shadow-2xl shadow-slate-100 group-hover:rotate-12 transition-transform duration-700">
              <BarChart3Icon class="w-10 h-10 text-slate-200" />
            </div>
            <p class="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Distribution of Funds</p>
          </div>
        </div>
      </div>

      <!-- Reports Table -->
      <div class="sk-table-container">
        <div class="p-10 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
          <h3 class="font-black text-slate-900 text-xl tracking-tight uppercase">Master Financial Reports</h3>
          <button v-if="userStore.role === 'SK Treasurer'" class="btn-primary">
            <PlusIcon class="w-4 h-4" /> Generate New Report
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="sk-table">
            <thead class="sk-table-header">
              <tr>
                <th class="px-10 py-6">Official Report Title</th>
                <th class="px-10 py-6">Date Finalized</th>
                <th class="px-10 py-6 text-center">Format</th>
                <th class="px-10 py-6 text-center">Status</th>
                <th class="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr v-for="report in budgetReports" :key="report.id" class="sk-table-row">
                <td class="px-10 py-8">
                   <div class="flex items-center gap-5">
                      <div class="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500 shadow-inner">
                         <FileTextIcon class="w-6 h-6" />
                      </div>
                      <span class="font-black text-slate-900 text-base tracking-tight">{{ report.title }}</span>
                   </div>
                </td>
                <td class="px-10 py-8 text-[11px] font-black text-slate-500 uppercase tracking-widest">{{ report.date }}</td>
                <td class="px-10 py-8 text-center">
                   <span class="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-xl text-[9px] font-black uppercase tracking-widest border border-slate-200 shadow-sm">{{ report.format }}</span>
                </td>
                <td class="px-10 py-8">
                   <div class="flex justify-center">
                      <span class="badge badge-emerald">
                         <div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Verified
                      </span>
                   </div>
                </td>
                <td class="px-10 py-8 text-right">
                  <button @click="downloadReport(report.title)" class="btn-primary !px-8 !py-2.5 !bg-slate-900 shadow-slate-200">
                    Download
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- TAB: EVENT REPORTS -->
    <div v-if="activeTab === 'Activity Reports'" class="space-y-10">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        <div v-for="card in reportCards" :key="card.title" class="glass-card p-12 flex flex-col items-center text-center group cursor-pointer">
          <div :class="card.bg" class="w-24 h-24 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl shadow-slate-100 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
            <component :is="card.icon" class="w-10 h-10 text-white" />
          </div>
          <h3 class="font-black text-slate-900 text-xl tracking-tight uppercase">{{ card.title }}</h3>
          <p class="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-3">{{ card.desc }}</p>
          <div class="mt-10 flex items-center gap-3 px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:bg-emerald-50 group-hover:text-emerald-600 group-hover:border-emerald-200 transition-all duration-300 shadow-sm">
             Open Portal Template <ChevronRightIcon class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      <!-- Activity Reports Table -->
      <div class="sk-table-container">
        <div class="p-10 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-8">
          <h3 class="font-black text-slate-900 text-xl tracking-tight uppercase">Strategic Activity Documents</h3>
          <div class="relative group">
             <SearchIcon class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
             <input type="text" placeholder="Search report library..." class="pl-12 pr-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[12px] font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none w-80 transition-all" />
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="sk-table">
            <thead class="sk-table-header">
              <tr>
                <th class="px-10 py-6">Activity Documentation</th>
                <th class="px-10 py-6">Filing Date</th>
                <th class="px-10 py-6 text-center">Submitted By</th>
                <th class="px-10 py-6 text-center">Status</th>
                <th class="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr v-for="report in activityReports" :key="report.id" class="sk-table-row">
                <td class="px-10 py-8">
                   <span class="font-black text-slate-900 text-base tracking-tight">{{ report.title }}</span>
                </td>
                <td class="px-10 py-8 text-[11px] font-black text-slate-500 uppercase tracking-widest">{{ report.date }}</td>
                <td class="px-10 py-8 text-center">
                   <span class="text-[11px] font-black text-slate-500 uppercase tracking-tighter">{{ report.submittedBy }}</span>
                </td>
                <td class="px-10 py-8">
                   <div class="flex justify-center">
                      <span class="badge badge-emerald">Published</span>
                   </div>
                </td>
                <td class="px-10 py-8 text-right">
                  <button @click="downloadReport(report.title)" class="btn-secondary !px-6 !py-2.5">
                    View Dossier
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '../stores/user'
import PublicReports from './public/Reports.vue'
import { 
  ShieldCheck as ShieldCheckIcon,
  CheckCircle as CheckCircleIcon,
  FileText as FileTextIcon,
  Download as DownloadIcon,
  Lock as LockIcon,
  BarChart2 as BarChartIcon,
  BarChart3 as BarChart3Icon,
  DownloadCloud as DownloadCloudIcon,
  Search as SearchIcon,
  ChevronRight as ChevronRightIcon,
  Plus as PlusIcon,
  Wallet as WalletIcon,
  TrendingUp as TrendingUpIcon,
  PieChart as PieChartIcon
} from 'lucide-vue-next'

const userStore = useUserStore()
const tabs = ['Activity Reports', 'Budget Reports', 'Compliance Docs']
const activeTab = ref('Activity Reports')

const budgetReports = ref([
  { id: 1, title: 'Annual Budget Realization FY2026', date: 'MAY 01, 2026', format: 'PDF' },
  { id: 2, title: 'Q1 Financial Status Report', date: 'APR 15, 2026', format: 'EXCEL' },
  { id: 3, title: 'Monthly Expenditure Summary - March', date: 'APR 02, 2026', format: 'PDF' }
])

const activityReports = ref([
  { id: 1, title: 'Youth Summit 2026 Accomplishment', date: 'MAY 12, 2026', submittedBy: 'SK Secretary' },
  { id: 2, title: 'Coastal Clean-up Post-Activity Report', date: 'APR 28, 2026', submittedBy: 'SK Secretary' },
  { id: 3, title: 'Inter-Barangay Sports Fest Documentation', date: 'MAR 20, 2026', submittedBy: 'SK Secretary' }
])

const reportCards = [
  { title: 'Liquidation', desc: 'Financial records bundle', icon: WalletIcon, bg: 'bg-[#D97706]' },
  { title: 'Accomplishment', desc: 'Project results & impact', icon: BarChartIcon, bg: 'bg-[#10B981]' },
  { title: 'Documentation', desc: 'Photos & attendee lists', icon: DownloadCloudIcon, bg: 'bg-[#0F172A]' }
]

const downloadReport = (title) => {
  alert(`Opening secure report portal for: ${title}...`)
}
</script>

<style scoped>
.font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
</style>
