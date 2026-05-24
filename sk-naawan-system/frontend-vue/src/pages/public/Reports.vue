<template>
  <div class="max-w-[1440px] mx-auto pb-12 p-8 font-inter bg-[#F8FAFC] min-h-screen animate-fade-up">
    
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
      <div>
        <h1 class="text-4xl font-black text-slate-900 tracking-tight">Reports & Documents</h1>
        <p class="text-slate-500 text-sm font-medium mt-2">Access official accomplishment reports and project documentation</p>
      </div>
      <div class="flex items-center gap-4">
         <div class="relative group">
            <SearchIcon class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
            <input v-model="searchQuery" type="text" placeholder="Search document library..." class="pl-12 pr-6 py-3.5 bg-white border border-slate-100 rounded-2xl text-[12px] font-medium focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none w-full md:w-80 transition-all shadow-sm" />
         </div>
      </div>
    </div>

    <!-- Document Categories -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-10">
      
      <!-- Left: Categories Sidebar -->
      <div class="lg:col-span-1 space-y-6">
        <div class="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8">
          <h4 class="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
             <div class="w-1.5 h-4 bg-emerald-500 rounded-full"></div>
             Document Categories
          </h4>
          <div class="space-y-3">
            <button 
              v-for="cat in categories" 
              :key="cat.name"
              @click="activeCategory = cat.name"
              :class="activeCategory === cat.name ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' : 'text-slate-500 hover:bg-slate-50'"
              class="w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 group"
            >
              <span class="text-[11px] font-black uppercase tracking-widest">{{ cat.name }}</span>
              <span :class="activeCategory === cat.name ? 'text-emerald-400' : 'text-slate-300'" class="text-[10px] font-bold">{{ cat.count }}</span>
            </button>
          </div>
        </div>

        <div class="bg-emerald-600 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
           <h5 class="text-xl font-black tracking-tight mb-3">Transparency Policy</h5>
           <p class="text-emerald-100 text-[11px] leading-relaxed font-medium uppercase tracking-wider">
              All documents listed here are verified official records of SK Naawan. Citizens are encouraged to download and review for accountability.
           </p>
           <div class="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
        </div>
      </div>

      <!-- Right: Document Grid -->
      <div class="lg:col-span-3 space-y-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div v-for="doc in filteredDocuments" :key="doc.id" class="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm group hover:shadow-xl transition-all duration-500 flex flex-col">
            <div class="flex items-start justify-between mb-8">
               <div class="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors shadow-inner">
                  <component :is="doc.type === 'PDF' ? FileTextIcon : FileIcon" class="w-8 h-8" />
               </div>
               <span class="px-3 py-1 bg-slate-50 border border-slate-100 text-slate-400 text-[9px] font-black uppercase tracking-widest rounded-lg">{{ doc.type }}</span>
            </div>
            <h4 class="text-lg font-black text-slate-900 tracking-tight leading-tight mb-2 group-hover:text-emerald-600 transition-colors">{{ doc.title }}</h4>
            <p class="text-slate-500 text-xs font-medium leading-relaxed mb-8 flex-1">{{ doc.description }}</p>
            
            <div class="pt-8 border-t border-slate-100 flex items-center justify-between">
               <div class="flex flex-col">
                  <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Published On</p>
                  <p class="text-[11px] font-black text-slate-900 uppercase">{{ doc.date }}</p>
               </div>
               <button @click="downloadDoc(doc)" class="p-4 bg-slate-900 hover:bg-emerald-600 text-white rounded-2xl transition-all shadow-lg group-hover:translate-y-[-4px]">
                  <DownloadIcon class="w-5 h-5" />
               </button>
            </div>
          </div>
        </div>

        <div v-if="filteredDocuments.length === 0" class="flex flex-col items-center justify-center py-32 text-center">
           <div class="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200 mb-6">
              <SearchIcon class="w-10 h-10" />
           </div>
           <h3 class="text-xl font-black text-slate-900 tracking-tight uppercase">No documents matching your criteria</h3>
           <p class="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">Try adjusting your category or search terms</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  FileText as FileTextIcon, 
  File as FileIcon, 
  Download as DownloadIcon, 
  Search as SearchIcon,
  Info as InfoIcon
} from 'lucide-vue-next'

const searchQuery = ref('')
const activeCategory = ref('All Documents')

const categories = [
  { name: 'All Documents', count: 12 },
  { name: 'Financial Reports', count: 4 },
  { name: 'Accomplishments', count: 5 },
  { name: 'Transparency', count: 3 }
]

const documents = ref([
  { id: 1, title: 'Annual Accomplishment Report 2025', category: 'Accomplishments', type: 'PDF', date: 'Jan 15, 2026', description: 'Comprehensive review of all SK Naawan youth projects and community impact for the fiscal year 2025.' },
  { id: 2, title: 'Q1 2026 Financial Disbursement Summary', category: 'Financial Reports', type: 'PDF', date: 'May 02, 2026', description: 'Detailed breakdown of quarterly fund utilization, project allocations, and municipal youth development spending.' },
  { id: 3, title: 'Youth Leadership Summit Proceedings', category: 'Accomplishments', type: 'DOC', date: 'May 12, 2026', description: 'Official documentation and minutes of the 2-day leadership capacity building seminar held at the Municipal Gym.' },
  { id: 4, title: 'SK Naawan Constitution & Bylaws', category: 'Transparency', type: 'PDF', date: 'Jan 01, 2026', description: 'The official governing rules and transparency policies adopted by the Sangguniang Kabataan of Naawan.' }
])

const filteredDocuments = computed(() => {
  return documents.value.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          doc.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = activeCategory.value === 'All Documents' || doc.category === activeCategory.value
    return matchesSearch && matchesCategory
  })
})

const downloadDoc = (doc) => {
  alert(`Downloading: ${doc.title}.${doc.type.toLowerCase()}`)
}
</script>

<style scoped>
.font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
.animate-fade-up { animation: fadeUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
@keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
</style>
