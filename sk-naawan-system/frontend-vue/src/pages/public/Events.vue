<template>
  <div class="max-w-[1440px] mx-auto pb-12 p-8 font-inter bg-[#F8FAFC] min-h-screen animate-fade-up">
    
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
      <div>
        <h1 class="text-4xl font-black text-slate-900 tracking-tight">Activities & Programs</h1>
        <p class="text-slate-500 text-sm font-medium mt-2">Explore upcoming and completed youth initiatives in our municipality</p>
      </div>
      <div class="flex items-center gap-3">
         <div class="px-5 py-2.5 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 shadow-sm">
            <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span class="text-[10px] font-black text-emerald-700 uppercase tracking-widest">3 Active Programs</span>
         </div>
      </div>
    </div>

    <!-- Master Activity List (Public View) -->
    <div class="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
      <div class="p-10 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/50">
        <div>
          <h3 class="font-black text-slate-900 text-xl tracking-tight uppercase">Activity Repository</h3>
          <p class="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Total Verified Projects: {{ events.length }}</p>
        </div>
        <div class="flex items-center gap-4">
           <div class="relative group">
              <SearchIcon class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
              <input v-model="searchQuery" type="text" placeholder="Search activities..." class="pl-12 pr-6 py-3.5 bg-white border border-slate-200 rounded-2xl text-[12px] font-medium focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none w-full md:w-64 transition-all" />
           </div>
           <select v-model="statusFilter" class="bg-white border border-slate-200 rounded-2xl px-6 py-3.5 text-[11px] font-black uppercase tracking-widest outline-none transition-all cursor-pointer">
              <option value="All">All Status</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
           </select>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100">
              <th class="px-10 py-6">Activity Information</th>
              <th class="px-10 py-6">Timeline & Venue</th>
              <th class="px-10 py-6">Status</th>
              <th class="px-10 py-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-for="ev in filteredEvents" :key="ev.id" class="group hover:bg-slate-50 transition-all duration-300">
              <td class="px-10 py-8">
                <div class="flex flex-col">
                  <span class="font-black text-slate-900 text-base tracking-tight group-hover:text-emerald-700 transition-colors">{{ ev.title }}</span>
                  <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5 line-clamp-1 max-w-sm">{{ ev.description }}</p>
                </div>
              </td>
              <td class="px-10 py-8">
                <div class="flex flex-col gap-2">
                  <div class="flex items-center gap-2">
                    <CalendarIcon class="w-3.5 h-3.5 text-emerald-500" />
                    <span class="text-[11px] font-black text-slate-700 uppercase tracking-tighter">{{ ev.date }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <MapPinIcon class="w-3.5 h-3.5 text-slate-400" />
                    <span class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{{ ev.venue }}</span>
                  </div>
                </div>
              </td>
              <td class="px-10 py-8">
                 <div class="flex">
                    <span :class="getStatusClass(ev.status)" class="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 border border-transparent shadow-sm">
                       <span :class="getStatusDotClass(ev.status)" class="w-1.5 h-1.5 rounded-full"></span>
                       {{ ev.status }}
                    </span>
                 </div>
              </td>
              <td class="px-10 py-8 text-right">
                 <button @click="viewDetails(ev)" class="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-slate-200">
                    <EyeIcon class="w-4 h-4" /> View Details
                 </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Details Modal (Read Only) -->
    <div v-if="selectedEvent" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
       <div class="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-up">
          <div class="p-10 border-b border-slate-100 flex items-center justify-between">
             <div class="flex items-center gap-5">
                <div class="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner">
                   <CalendarIcon class="w-7 h-7" />
                </div>
                <div>
                   <h2 class="text-2xl font-black text-slate-900 tracking-tight leading-none">{{ selectedEvent.title }}</h2>
                   <p class="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-2">Official Program Repository</p>
                </div>
             </div>
             <button @click="selectedEvent = null" class="p-2 text-slate-400 hover:text-slate-900"><XIcon class="w-6 h-6" /></button>
          </div>
          <div class="p-10 space-y-8">
             <div>
                <h4 class="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-3">Project Overview</h4>
                <p class="text-slate-600 text-sm font-medium leading-relaxed">{{ selectedEvent.description }}</p>
             </div>
             <div class="grid grid-cols-2 gap-8 p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                <div>
                   <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Schedule</p>
                   <p class="text-sm font-black text-slate-900 uppercase">{{ selectedEvent.date }}</p>
                </div>
                <div>
                   <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Venue</p>
                   <p class="text-sm font-black text-slate-900 uppercase">{{ selectedEvent.venue }}</p>
                </div>
             </div>
          </div>
          <div class="p-10 bg-slate-50 flex justify-end">
             <button @click="selectedEvent = null" class="px-10 py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl">Close Details</button>
          </div>
       </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  Search as SearchIcon, Calendar as CalendarIcon, MapPin as MapPinIcon, 
  Eye as EyeIcon, X as XIcon, Info as InfoIcon 
} from 'lucide-vue-next'

const searchQuery = ref('')
const statusFilter = ref('All')
const selectedEvent = ref(null)

const events = ref([
  { id: 1, title: 'Youth Leadership Summit 2026', date: 'MAY 12, 2026', venue: 'Municipal Gym', status: 'Upcoming', description: 'A comprehensive 2-day leadership training and capacity building seminar for aspiring Naawan youth leaders and SK officials.' },
  { id: 2, title: 'Inter-Barangay Sports League', date: 'MAY 05, 2026', venue: 'Barangay Covered Courts', status: 'Ongoing', description: 'The annual municipality-wide basketball and volleyball tournament promoting health and sportsmanship among the youth.' },
  { id: 3, title: 'Coastal Environmental Cleanup', date: 'APR 28, 2026', venue: 'Poblacion Coastal Area', status: 'Completed', description: 'A community-led environmental initiative to restore and protect the Naawan coastal resources.' },
  { id: 4, title: 'SK General Assembly', date: 'MAR 15, 2026', venue: 'SK Multi-Purpose Hall', status: 'Completed', description: 'The quarterly assembly to discuss project proposals and municipal youth developments.' }
])

const filteredEvents = computed(() => {
  return events.value.filter(ev => {
    const matchesSearch = ev.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          ev.venue.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = statusFilter.value === 'All' || ev.status === statusFilter.value
    return matchesSearch && matchesStatus
  })
})

const getStatusClass = (status) => {
  const map = {
    'Upcoming': 'bg-blue-50 text-blue-600',
    'Ongoing': 'bg-emerald-50 text-emerald-600',
    'Completed': 'bg-slate-900 text-white'
  }
  return map[status] || 'bg-slate-50 text-slate-500'
}

const getStatusDotClass = (status) => {
  const map = {
    'Upcoming': 'bg-blue-500',
    'Ongoing': 'bg-emerald-500',
    'Completed': 'bg-emerald-400'
  }
  return map[status] || 'bg-slate-400'
}

const viewDetails = (ev) => {
  selectedEvent.value = ev
}
</script>

<style scoped>
.font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
.animate-fade-up { animation: fadeUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
@keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
</style>
