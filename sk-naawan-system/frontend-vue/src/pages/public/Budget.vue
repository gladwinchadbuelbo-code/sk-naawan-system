<template>
  <div class="max-w-[1440px] mx-auto pb-12 p-8 font-inter bg-[#F8FAFC] min-h-screen animate-fade-up">
    
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
      <div>
        <h1 class="text-4xl font-black text-slate-900 tracking-tight">Budget Transparency</h1>
        <p class="text-slate-500 text-sm font-medium mt-2">Public disclosure of SK Naawan fund utilization and project allocations</p>
      </div>
      <div class="flex items-center gap-3">
         <button @click="downloadFullReport" class="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl text-[10px] font-black shadow-sm hover:bg-slate-50 transition-all uppercase tracking-widest">
            <DownloadIcon class="w-4 h-4" /> Download Annual Report
         </button>
      </div>
    </div>

    <!-- Triple Metric Summary -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
      <div class="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-xl relative overflow-hidden group">
        <p class="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-3">Total Annual Allocation</p>
        <h2 class="text-5xl font-black font-jakarta tracking-tighter">₱1.25M</h2>
        <div class="mt-8 flex items-center gap-2">
           <div class="w-2 h-2 rounded-full bg-emerald-500"></div>
           <span class="text-[9px] font-bold text-white/50 uppercase tracking-widest">Approved for Fiscal Year 2026</span>
        </div>
        <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div class="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden group">
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Verified Expenditures</p>
        <h2 class="text-5xl font-black font-jakarta tracking-tighter text-slate-900">₱420.5K</h2>
        <div class="mt-8 flex items-center gap-2">
           <div class="w-2 h-2 rounded-full bg-blue-500"></div>
           <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Utilized as of May 2026</span>
        </div>
      </div>

      <div class="bg-emerald-600 rounded-[2.5rem] p-10 text-white shadow-xl relative overflow-hidden group">
        <p class="text-[10px] font-black text-emerald-100 uppercase tracking-[0.2em] mb-3">Remaining Balance</p>
        <h2 class="text-5xl font-black font-jakarta tracking-tighter">₱829.5K</h2>
        <div class="mt-8 flex items-center gap-2">
           <div class="w-2 h-2 rounded-full bg-white/40"></div>
           <span class="text-[9px] font-bold text-white/50 uppercase tracking-widest">Available for Future Projects</span>
        </div>
        <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      </div>
    </div>

    <!-- Expenditure Ledger -->
    <div class="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
      <div class="p-10 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/50">
        <div>
          <h3 class="font-black text-slate-900 text-xl tracking-tight uppercase">Public Ledger</h3>
          <p class="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Verified transactions and disbursements</p>
        </div>
        <div class="relative group">
          <SearchIcon class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search by project or item..." 
            class="pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl text-[12px] font-medium focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none w-full md:w-80 transition-all" 
          />
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100">
              <th class="px-10 py-6">Transaction / Project</th>
              <th class="px-10 py-6">Category</th>
              <th class="px-10 py-6">Date Released</th>
              <th class="px-10 py-6">Amount Paid</th>
              <th class="px-10 py-6 text-center">Verification</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-for="item in filteredLedger" :key="item.id" class="group hover:bg-slate-50 transition-all">
              <td class="px-10 py-8">
                <div class="flex flex-col">
                  <span class="font-black text-slate-900 text-sm tracking-tight leading-none mb-1.5">{{ item.title }}</span>
                  <span class="text-[9px] text-slate-400 font-bold uppercase tracking-widest">ID: TXN-{{ item.id }}</span>
                </div>
              </td>
              <td class="px-10 py-8">
                <span class="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-[9px] font-black uppercase tracking-widest">{{ item.category }}</span>
              </td>
              <td class="px-10 py-8 text-[11px] font-bold text-slate-500 uppercase">{{ item.date }}</td>
              <td class="px-10 py-8">
                <span class="text-sm font-black text-slate-900 tracking-tight">₱{{ item.amount.toLocaleString() }}</span>
              </td>
              <td class="px-10 py-8 text-center">
                 <div class="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-100/50">
                    <CheckIcon class="w-3.5 h-3.5" /> Verified
                 </div>
              </td>
            </tr>
            <tr v-if="filteredLedger.length === 0">
               <td colspan="5" class="px-10 py-32 text-center text-slate-400 text-sm font-bold uppercase tracking-widest italic">
                  No transaction records matching your search
               </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  Download as DownloadIcon, 
  Search as SearchIcon, 
  Check as CheckIcon,
  Info as InfoIcon
} from 'lucide-vue-next'

const searchQuery = ref('')

const ledger = ref([
  { id: 4001, title: 'Purchase of Sports Equipment', category: 'Sports Development', date: 'MAY 02, 2026', amount: 45000 },
  { id: 4002, title: 'Youth Leadership Summit Venue Rental', category: 'Capacity Building', date: 'APR 28, 2026', amount: 12500 },
  { id: 4003, title: 'Barangay Clean-up Supplies', category: 'Environment', date: 'APR 15, 2026', amount: 8200 },
  { id: 4004, title: 'SK Office Supplies Refresh', category: 'Administrative', date: 'APR 05, 2026', amount: 15400 },
  { id: 4005, title: 'Inter-Barangay Tournament Prizes', category: 'Sports Development', date: 'MAR 22, 2026', amount: 35000 }
])

const filteredLedger = computed(() => {
  return ledger.value.filter(item => 
    item.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const downloadFullReport = () => {
  alert('Preparing localized Transparency Report PDF for download...')
}
</script>

<style scoped>
.font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
.animate-fade-up { animation: fadeUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
@keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
</style>
