<template>
  <div class="max-w-[1440px] mx-auto pb-12 p-10 font-inter bg-[#F8FAFC] animate-fade-up">
    
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
      <div class="flex items-start gap-5">
        <div class="p-4 bg-emerald-50 rounded-[1.5rem] text-emerald-600 shadow-inner group hover:bg-emerald-500 hover:text-white transition-all duration-500">
          <ArchiveIcon class="w-8 h-8" />
        </div>
        <div>
          <h1 class="text-4xl font-black text-slate-900 tracking-tight">System Archives</h1>
          <p class="text-slate-500 text-sm font-medium mt-1">Review historical records and restored strategic projects</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
         <button @click="refreshArchives" class="btn-secondary !px-6">
            <RefreshCwIcon class="w-4 h-4" /> Refresh Repository
         </button>
      </div>
    </div>

    <!-- Repository Navigation -->
    <div class="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-2 flex flex-col md:flex-row items-center gap-2 w-fit mb-10">
      <button 
        v-for="tab in tabOptions"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="activeTab === tab.id ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'"
        class="flex items-center gap-3 px-8 py-3.5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest transition-all duration-300"
      >
        <component :is="tab.icon" class="w-4 h-4" />
        {{ tab.label }}
      </button>
    </div>

    <!-- Content Repository Area -->
    <div class="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-sm min-h-[550px] flex flex-col relative overflow-hidden group">
      
      <!-- Integrated Search -->
      <div class="flex items-center justify-between mb-8">
         <h3 class="text-xl font-black text-slate-900 tracking-tight uppercase">{{ activeLabel }} Archive</h3>
         <div class="relative group w-80">
            <SearchIcon class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
            <input v-model="searchQuery" type="text" placeholder="Search archive database..." class="w-full bg-slate-50 border border-slate-100 rounded-2xl px-12 py-3 text-[12px] font-medium focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white outline-none transition-all" />
         </div>
      </div>

      <!-- Table Content (Activities) -->
      <div v-if="activeTab === 'events' && filteredActivities.length > 0" class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100">
              <th class="px-8 py-5">Record Title</th>
              <th class="px-8 py-5">Date Archived</th>
              <th class="px-8 py-5">Original Status</th>
              <th class="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-for="item in filteredActivities" :key="item.id" class="group hover:bg-slate-50/50 transition-all">
              <td class="px-8 py-6">
                <div class="flex flex-col">
                  <span class="font-black text-slate-900 text-sm tracking-tight">{{ item.title }}</span>
                  <span class="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{{ item.category }}</span>
                </div>
              </td>
              <td class="px-8 py-6">
                <span class="text-[11px] font-bold text-slate-500">{{ item.archivedDate }}</span>
              </td>
              <td class="px-8 py-6">
                <span class="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[9px] font-black uppercase tracking-widest">{{ item.status }}</span>
              </td>
              <td class="px-8 py-6 text-right">
                <button @click="restoreItem(item)" class="flex items-center gap-2 ml-auto px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                  <RotateCcwIcon class="w-3.5 h-3.5" /> Restore Record
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-else class="flex-1 flex flex-col items-center justify-center text-center py-20">
         <div class="w-32 h-32 bg-slate-50 rounded-[3rem] flex items-center justify-center text-slate-100 mb-10 border border-slate-100 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-700 shadow-inner">
            <ArchiveIcon class="w-16 h-16" />
         </div>
         <h3 class="text-3xl font-black text-slate-900 tracking-tight">No archived records found</h3>
         <p class="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-4">The centralized repository currently contains no closed records for <span class="text-emerald-600">{{ activeLabel }}</span></p>
         
         <div class="mt-12 p-8 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center gap-6 max-w-md shadow-sm">
            <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm shrink-0">
               <InfoIcon class="w-6 h-6" />
            </div>
            <p class="text-[11px] font-bold text-slate-500 text-left leading-relaxed uppercase tracking-tight">Archives are automatically generated when project lifecycles are finalized and verified by the SK Chairperson.</p>
         </div>
      </div>

      <!-- Ambient Decoration -->
      <div class="absolute -left-20 -bottom-20 w-80 h-80 bg-emerald-50 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
    </div>

    <!-- TOAST -->
    <Transition name="slide-up">
       <div v-if="toast" class="fixed bottom-10 right-10 z-[300]">
          <div class="bg-slate-900 rounded-[1.5rem] shadow-2xl p-6 text-white flex items-center gap-5 min-w-[350px]">
             <div class="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                <CheckCircleIcon class="w-6 h-6" />
             </div>
             <div>
                <p class="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 leading-none mb-1">System Update</p>
                <p class="text-sm font-black tracking-tight">{{ toast.message }}</p>
             </div>
          </div>
       </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  Archive as ArchiveIcon, Search as SearchIcon, RefreshCw as RefreshCwIcon,
  Calendar as CalendarIcon, FileText as FileTextIcon, Info as InfoIcon,
  RotateCcw as RotateCcwIcon, CheckCircle as CheckCircleIcon
} from 'lucide-vue-next'

const activeTab = ref('events')
const searchQuery = ref('')
const toast = ref(null)

const tabOptions = [
  { id: 'events', label: 'Activities', icon: CalendarIcon },
  { id: 'financial', label: 'Financial Ledger', icon: FileTextIcon },
  { id: 'proposals', label: 'Project Proposals', icon: FileTextIcon }
]

const archivedActivities = ref([
  { id: 101, title: 'Summer Sports Fest 2025', category: 'SPORTS', archivedDate: 'Jan 15, 2026', status: 'Completed' },
  { id: 102, title: 'Year-end General Assembly', category: 'GOVERNANCE', archivedDate: 'Jan 10, 2026', status: 'Completed' }
])

const filteredActivities = computed(() => {
  return archivedActivities.value.filter(a => a.title.toLowerCase().includes(searchQuery.value.toLowerCase()))
})

const activeLabel = computed(() => {
  return tabOptions.find(t => t.id === activeTab.value)?.label || 'records'
})

const restoreItem = (item) => {
  if (confirm(`Restore "${item.title}" to the active activity list?`)) {
    archivedActivities.value = archivedActivities.value.filter(a => a.id !== item.id)
    showToast('Record successfully restored to active list.')
  }
}

const showToast = (message) => {
  toast.value = { message }
  setTimeout(() => toast.value = null, 4000)
}

const refreshArchives = () => {
  showToast('Archive repository refreshed.')
}
</script>

<style scoped>
.font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
.animate-fade-up { animation: fadeUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.4s ease; }
.slide-up-enter-from { opacity: 0; transform: translateY(20px); }
.slide-up-leave-to { opacity: 0; transform: translateY(20px); }
</style>
