<template>
  <div class="max-w-[1440px] mx-auto pb-12 p-8 font-inter bg-[#F8FAFC] min-h-screen animate-fade-up">
    
    <!-- Welcome Banner Section -->
    <div class="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-10 md:p-16 mb-10 text-white shadow-2xl group">
      <div class="relative z-10 max-w-2xl">
        <div class="flex items-center gap-3 mb-6">
          <span class="px-4 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/30 backdrop-blur-md">
            Public Transparency Portal
          </span>
          <span class="text-white/40 font-bold text-[10px] uppercase tracking-widest">Fiscal Year 2026</span>
        </div>
        <h1 class="text-4xl md:text-5xl font-black tracking-tight mb-4">Welcome to Naawan SK <span class="text-emerald-500">Citizen Portal</span></h1>
        <p class="text-slate-400 text-lg font-medium leading-relaxed mb-8">
          This platform is dedicated to transparency and accountability. Here, citizens can monitor SK projects, view budget utilization, and stay updated with official Naawan youth activities.
        </p>
        <div class="flex flex-wrap gap-4">
           <button @click="$router.push('/budget')" class="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-slate-900 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20">
              Monitor Budget utilization
           </button>
           <button @click="$router.push('/events')" class="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest border border-white/10 transition-all">
              View Activity Calendar
           </button>
        </div>
      </div>
      
      <!-- Decorative Elements -->
      <div class="absolute -right-20 -bottom-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
      <div class="absolute top-10 right-20 w-48 h-48 bg-blue-500/10 rounded-full blur-[80px]"></div>
      <div class="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-emerald-500/5 to-transparent"></div>
    </div>

    <!-- Stat Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
      <div v-for="stat in stats" :key="stat.label" class="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm group hover:scale-[1.02] transition-transform cursor-default">
        <div class="flex items-center justify-between mb-6">
          <div :class="stat.colorClass" class="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <component :is="stat.icon" class="w-7 h-7" />
          </div>
          <div class="text-right">
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ stat.label }}</p>
            <p class="text-[9px] font-bold text-emerald-600/70 uppercase mt-0.5">{{ stat.trend }}</p>
          </div>
        </div>
        <h2 class="text-3xl font-black text-slate-900 tracking-tight font-jakarta">{{ stat.value }}</h2>
      </div>
    </div>

    <!-- Content Split Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
      
      <!-- Public Announcements -->
      <div class="lg:col-span-2 space-y-8">
        <div class="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-10">
          <div class="flex items-center justify-between mb-8">
            <h3 class="text-sm font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3">
               <div class="w-2 h-6 bg-emerald-500 rounded-full"></div>
               Latest Official Announcements
            </h3>
            <button @click="$router.push('/announcements')" class="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline">View All News</button>
          </div>
          
          <div class="space-y-6">
             <div v-for="news in announcements" :key="news.id" class="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 group cursor-pointer hover:bg-white hover:shadow-xl transition-all duration-500">
                <div class="flex items-start gap-6">
                   <div class="shrink-0 w-16 h-16 bg-white rounded-2xl flex flex-col items-center justify-center text-slate-400 border border-slate-100 shadow-inner group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                      <p class="text-[10px] font-black leading-none">{{ news.day }}</p>
                      <p class="text-[12px] font-black uppercase mt-1">{{ news.month }}</p>
                   </div>
                   <div>
                      <span class="px-3 py-1 bg-white border border-slate-100 text-slate-400 text-[9px] font-black uppercase tracking-widest rounded-lg mb-2 inline-block">{{ news.category }}</span>
                      <h4 class="text-lg font-black text-slate-900 tracking-tight leading-tight mb-2 group-hover:text-emerald-600 transition-colors">{{ news.title }}</h4>
                      <p class="text-slate-500 text-sm font-medium leading-relaxed line-clamp-2">{{ news.summary }}</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      <!-- Upcoming Highlights -->
      <div class="space-y-8">
        <div class="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-10">
          <h3 class="text-sm font-black text-slate-900 uppercase tracking-[0.2em] mb-8">Upcoming Projects</h3>
          <div class="space-y-6">
            <div v-for="event in upcomingEvents" :key="event.id" class="flex gap-5">
              <div class="shrink-0 w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                 <CalendarIcon class="w-6 h-6" />
              </div>
              <div>
                <h5 class="text-[13px] font-black text-slate-900 uppercase tracking-tight leading-none mb-2">{{ event.title }}</h5>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ event.date }} &bull; {{ event.venue }}</p>
                <div class="mt-3 flex items-center gap-2">
                   <div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                   <span class="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Project Verified</span>
                </div>
              </div>
            </div>
          </div>
          <button @click="$router.push('/events')" class="w-full mt-10 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200">
             Explore Full Calendar
          </button>
        </div>

        <!-- Feedback Section -->
        <div class="bg-emerald-600 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
           <div class="relative z-10">
              <h4 class="text-xl font-black tracking-tight mb-3">Community Feedback</h4>
              <p class="text-emerald-100 text-xs font-medium leading-relaxed mb-6">
                 Your voice matters! Help us improve Naawan by sharing your thoughts on our projects.
              </p>
              <button class="w-full py-4 bg-white text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-transform">
                 Submit Project Feedback
              </button>
           </div>
           <div class="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { 
  Wallet as WalletIcon, 
  ArrowUpRight as ExpensesIcon, 
  PieChart as BalanceIcon, 
  Calendar as CalendarIcon,
  Search as SearchIcon,
  Bell as BellIcon,
  CheckCircle as CheckCircleIcon
} from 'lucide-vue-next'

const stats = [
  { label: 'Annual SK Budget', value: '₱1,250,000', trend: 'Allocated for 2026', icon: WalletIcon, colorClass: 'bg-[#0F172A] shadow-slate-200' },
  { label: 'Total Utilization', value: '₱420,500', trend: 'Verified Expenses', icon: ExpensesIcon, colorClass: 'bg-emerald-500 shadow-emerald-200' },
  { label: 'Remaining Balance', value: '₱829,500', trend: 'Available Funds', icon: BalanceIcon, colorClass: 'bg-emerald-600 shadow-emerald-200' },
  { label: 'Upcoming Programs', value: '8 Projects', trend: 'Scheduled Events', icon: CalendarIcon, colorClass: 'bg-[#1E293B] shadow-slate-200' }
]

const announcements = [
  { id: 1, day: '12', month: 'MAY', category: 'EVENT ADVISORY', title: 'Youth Leadership Summit 2026 Registration Open', summary: 'Calling all aspiring youth leaders of Naawan! Registration is now open for the upcoming 2-day leadership summit at the Municipal Gym.' },
  { id: 2, day: '05', month: 'MAY', category: 'BUDGET UPDATE', title: 'Q1 Financial Transparency Report Released', summary: 'The SK Council has finalized the first quarter financial report. Citizens can now review the expenditures for our community projects.' },
  { id: 3, day: '28', month: 'APR', category: 'CLEAN-UP', title: 'Poblacion Coastal Cleanup Results', summary: 'Thank you to all volunteers! Over 500kg of waste was collected during our recent coastal environmental drive.' }
]

const upcomingEvents = [
  { id: 1, title: 'Youth Month Celebration', date: 'June 15, 2026', venue: 'Poblacion Plaza' },
  { id: 2, title: 'Skills Training Seminar', date: 'June 22, 2026', venue: 'SK Multi-Purpose Hall' },
  { id: 3, title: 'Inter-Barangay Sports', date: 'July 05, 2026', venue: 'Municipal Gym' }
]
</script>

<style scoped>
.font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
.animate-fade-up { animation: fadeUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
@keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
</style>
