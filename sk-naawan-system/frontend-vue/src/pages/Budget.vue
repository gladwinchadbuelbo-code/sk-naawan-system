<template>
  <PublicBudget v-if="userStore.role === 'Public Viewer'" />
  <div v-else class="max-w-[1440px] mx-auto pb-12 p-10 font-inter bg-[#F8FAFC] animate-fade-up">

    <!-- Header Section - Based on Image 3 -->
    <div class="mb-10 flex flex-col md:flex-row md:items-start justify-between gap-6 relative">
      <div>
        <h1 class="text-3xl font-black text-slate-900 tracking-tight">Budget Management</h1>
        <p class="text-slate-500 text-sm font-medium mt-1">Track and manage SK funds and expenses</p>
        <div class="mt-4 flex items-center gap-2">
           <div class="flex items-center gap-2 px-3 py-1 bg-[#10B981] text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">
              <div class="w-3.5 h-3.5 bg-white/20 rounded-full flex items-center justify-center">
                 <CheckCircleIcon class="w-2.5 h-2.5" />
              </div>
              Can Edit
           </div>
        </div>
      </div>
      <div class="flex flex-wrap items-center gap-3">
         <template v-if="userStore.role === 'SK Treasurer'">
            <button @click="openTransactionModal('income')" class="flex items-center gap-2 px-6 py-2.5 bg-[#10B981] hover:bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm">
               <PlusIcon class="w-4 h-4" /> Add Fund
            </button>
            <button @click="openTransactionModal('expense')" class="flex items-center gap-2 px-6 py-2.5 bg-[#DC2626] hover:bg-red-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm">
               <TrendingDownIcon class="w-4 h-4" /> Record Expense
            </button>
           <button @click="$router.push('/budget-proposals')" class="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm">
              <FilePlusIcon class="w-4 h-4" /> My Proposals
           </button>
           <button @click="generateAuditReport" class="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm">
              <FileTextIcon class="w-4 h-4" /> Generate Report
           </button>
        </template>
        <template v-else-if="userStore.role === 'SK Chairperson'">
           <button @click="generateAuditReport" class="btn-primary !px-8">
            <DownloadIcon class="w-4 h-4" /> Generate Audit Report
          </button>
        </template>
      </div>
    </div>

    <!-- Metrics Row - Based on Image 3 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <!-- Total Funds -->
      <div class="bg-[#10B981] rounded-3xl p-8 text-white shadow-md relative overflow-hidden flex flex-col justify-between h-40">
        <div>
          <p class="text-[9px] font-black uppercase tracking-[0.2em] opacity-60">Total Funds</p>
          <h2 class="text-4xl font-black font-jakarta mt-3">₱{{ totalFunds.toLocaleString() }}</h2>
        </div>
        <div class="absolute top-1/2 -translate-y-1/2 right-8 w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
          <TrendingUpIcon class="w-7 h-7 text-white" />
        </div>
      </div>

      <!-- Total Expenses -->
      <div class="bg-[#DC2626] rounded-3xl p-8 text-white shadow-md relative overflow-hidden flex flex-col justify-between h-40">
        <div>
          <p class="text-[9px] font-black uppercase tracking-[0.2em] opacity-60">Total Expenses</p>
          <h2 class="text-4xl font-black font-jakarta mt-3">₱{{ totalExpenses.toLocaleString() }}</h2>
        </div>
        <div class="absolute top-1/2 -translate-y-1/2 right-8 w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
          <TrendingDownIcon class="w-7 h-7 text-white" />
        </div>
      </div>

      <!-- Remaining Budget -->
      <div class="bg-[#065F46] rounded-3xl p-8 text-white shadow-md relative overflow-hidden flex flex-col justify-between h-40">
        <div>
          <p class="text-[9px] font-black uppercase tracking-[0.2em] opacity-60">Remaining Budget</p>
          <h2 class="text-4xl font-black font-jakarta mt-3">₱{{ remainingBudget.toLocaleString() }}</h2>
        </div>
        <div class="absolute top-1/2 -translate-y-1/2 right-8 w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
          <WalletIcon class="w-7 h-7 text-white" />
        </div>
      </div>
    </div>

    <!-- Ledger Table -->
    <div class="sk-table-container">
      <div class="p-10 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 class="font-black text-slate-900 text-xl tracking-tight uppercase">General Expenditure Ledger</h3>
          <p class="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Audited Financial History for FY 2026</p>
        </div>
        <div class="flex items-center gap-4">
           <div class="relative group">
              <SearchIcon class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
              <input v-model="searchQuery" type="text" placeholder="Search transactions..." class="pl-12 pr-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[12px] font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none w-72 transition-all" />
           </div>
           <button class="btn-secondary !px-4">
              <FilterIcon class="w-4 h-4" />
           </button>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="sk-table">
          <thead class="sk-table-header">
            <tr>
              <th class="px-10 py-6">Reference & Date</th>
              <th class="px-10 py-6">Description</th>
              <th class="px-10 py-6">Category</th>
              <th class="px-10 py-6">Amount</th>
              <th class="px-10 py-6 text-right">Verification</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-for="tx in filteredTransactions" :key="tx.id" class="sk-table-row">
              <td class="px-10 py-8">
                <div class="flex flex-col">
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">REF: {{ tx.ref }}</span>
                  <span class="text-sm font-black text-slate-900 tracking-tight mt-1">{{ tx.date }}</span>
                </div>
              </td>
              <td class="px-10 py-8">
                <span class="text-sm font-bold text-slate-700 tracking-tight">{{ tx.description }}</span>
              </td>
              <td class="px-10 py-8">
                <span class="px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest">{{ tx.category }}</span>
              </td>
              <td class="px-10 py-8">
                <span :class="tx.type === 'income' ? 'text-emerald-600' : 'text-red-600'" class="text-base font-black tracking-tighter">
                  {{ tx.type === 'income' ? '+' : '-' }} ₱{{ tx.amount.toLocaleString() }}
                </span>
              </td>
              <td class="px-10 py-8 text-right">
                <div class="flex items-center justify-end gap-3">
                   <div v-if="tx.verified" class="flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest">
                      <CheckCircleIcon class="w-3 h-3" /> Verified
                   </div>
                   <button class="p-2.5 hover:bg-slate-100 text-slate-400 hover:text-slate-900 rounded-xl transition-all">
                      <FileTextIcon class="w-4.5 h-4.5" />
                   </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- MODAL: ADD FUND / RECORD EXPENSE (Dual Mode) -->
    <div v-if="isTransactionModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
       <div class="bg-white rounded-[2rem] shadow-2xl w-full max-w-xl overflow-hidden animate-fade-up border border-slate-50">
          
          <!-- Dynamic Header -->
          <div class="p-10 pb-4 flex items-center justify-between">
             <div>
                <h2 class="text-2xl font-black text-slate-900 tracking-tight">{{ txForm.type === 'income' ? 'Add Fund' : 'Record Expense' }}</h2>
                <p class="text-xs font-medium text-slate-400 mt-1">
                   {{ txForm.type === 'income' ? 'Add a new income or fund source to the budget.' : 'Record a new expense or budget allocation.' }}
                </p>
             </div>
             <button @click="isTransactionModalOpen = false" class="text-slate-300 hover:text-slate-600 transition-colors">
                <XIcon class="w-6 h-6" />
             </button>
          </div>

          <!-- Form Body -->
          <div class="p-10 pt-2 space-y-7">
             <!-- Date -->
             <div>
                <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 mb-3 block">Date *</label>
                <input v-model="txForm.date" type="date" class="w-full bg-white border border-slate-200 rounded-xl px-5 py-4 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all shadow-sm" />
             </div>

             <!-- Category -->
             <div>
                <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 mb-3 block">Category *</label>
                <select v-model="txForm.category" class="w-full bg-white border border-slate-200 rounded-xl px-5 py-4 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all appearance-none cursor-pointer shadow-sm">
                   <option value="" disabled>Select category</option>
                   <template v-if="txForm.type === 'income'">
                      <option value="Annual Budget Allocation">Annual Budget Allocation</option>
                      <option value="Supplemental Fund">Supplemental Fund</option>
                      <option value="Donation/Grant">Donation/Grant</option>
                   </template>
                   <template v-else>
                      <option value="Sports & Health Programs">Sports & Health Programs</option>
                      <option value="Youth Development Summit">Youth Development Summit</option>
                      <option value="Environmental Programs">Environmental Programs</option>
                      <option value="Administrative Expenses">Administrative Expenses</option>
                      <option value="Supplies & Materials">Supplies & Materials</option>
                   </template>
                </select>
             </div>

             <!-- Description -->
             <div>
                <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 mb-3 block">Description *</label>
                <input v-model="txForm.description" type="text" :placeholder="txForm.type === 'income' ? 'Enter fund description...' : 'Enter expense description...'" class="w-full bg-white border border-slate-200 rounded-xl px-5 py-4 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all shadow-sm" />
             </div>

             <!-- Expense Only Fields -->
             <div v-if="txForm.type === 'expense'" class="grid grid-cols-2 gap-6">
                <div>
                   <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 mb-3 block">OR Number *</label>
                   <input v-model="txForm.or_number" type="text" placeholder="Official Receipt Number" class="w-full bg-white border border-slate-200 rounded-xl px-5 py-4 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all shadow-sm" />
                </div>
                <div>
                   <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 mb-3 block">Supplier *</label>
                   <input v-model="txForm.supplier" type="text" placeholder="Supplier name" class="w-full bg-white border border-slate-200 rounded-xl px-5 py-4 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all shadow-sm" />
                </div>
             </div>

             <!-- Amount -->
             <div>
                <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 mb-3 block">Amount (₱) *</label>
                <input v-model.number="txForm.amount" type="number" placeholder="0" class="w-full bg-white border border-slate-200 rounded-xl px-5 py-4 text-base font-black text-slate-900 focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all shadow-sm" />
                <p v-if="txForm.type === 'expense'" class="text-[10px] font-black text-slate-400 mt-2 ml-1 uppercase tracking-widest">Available budget: ₱{{ remainingBudget.toLocaleString() }}</p>
             </div>

             <!-- Expense Only Receipt -->
             <div v-if="txForm.type === 'expense'">
                <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 mb-3 block">Receipt (Optional)</label>
                <div class="flex items-center gap-4">
                   <button @click="$refs.fileInput.click()" class="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all">Choose File</button>
                   <span class="text-[11px] font-bold text-slate-400">{{ fileName || 'No file chosen' }}</span>
                   <input type="file" ref="fileInput" class="hidden" @change="handleFileUpload" />
                </div>
             </div>

             <!-- Footer Actions -->
             <div class="pt-6 flex items-center justify-end gap-4">
                <button @click="isTransactionModalOpen = false" class="px-10 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">Cancel</button>
                <button @click="submitTransaction" 
                        :class="txForm.type === 'income' ? 'bg-[#10B981] hover:bg-emerald-600 shadow-emerald-500/10' : 'bg-[#DC2626] hover:bg-red-700 shadow-red-500/10'" 
                        class="px-12 py-4 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl transition-all">
                   {{ txForm.type === 'income' ? 'Add Fund' : 'Record Expense' }}
                </button>
             </div>
          </div>
       </div>
    </div>

    <!-- TOAST -->
    <Transition name="slide-up">
       <div v-if="toast" class="fixed bottom-10 right-10 z-[300]">
          <div class="bg-[#059669] rounded-[1.5rem] shadow-2xl p-6 text-white flex items-center gap-5 min-w-[350px]">
             <div class="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                <CheckCircleIcon class="w-6 h-6" />
             </div>
             <div>
                <p class="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 leading-none mb-1">Treasury Alert</p>
                <p class="text-sm font-black tracking-tight">{{ toast.message }}</p>
             </div>
          </div>
       </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useUserStore } from '../stores/user'
import PublicBudget from './public/Budget.vue'
import { 
  Wallet as WalletIcon, TrendingDown as TrendingDownIcon, TrendingUp as TrendingUpIcon,
  Plus as PlusIcon, Download as DownloadIcon, FilePlus as FilePlusIcon,
  Search as SearchIcon, Filter as FilterIcon, CheckCircle as CheckCircleIcon,
  FileText as FileTextIcon, X as XIcon
} from 'lucide-vue-next'

const userStore = useUserStore()
const searchQuery = ref('')
const toast = ref(null)
const isLoading = ref(false)

const isTransactionModalOpen = ref(false)
const txForm = reactive({ 
  date: '', 
  category: 'Annual Budget Allocation', 
  description: '', 
  amount: 0, 
  type: 'expense',
  or_number: '',
  supplier: '',
  receipt_url: ''
})

const fileName = ref('')

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    fileName.value = file.name
    txForm.receipt_url = URL.createObjectURL(file)
    console.log('File selected:', file.name)
  }
}

const transactions = ref([])

const fetchTransactions = async () => {
  isLoading.value = true
  try {
    const response = await fetch('http://127.0.0.1:5000/api/transactions', {
      headers: { 'Authorization': `Bearer ${userStore.token}` }
    })
    if (!response.ok) throw new Error('Failed to fetch transactions')
    const data = await response.json()
    transactions.value = data.map(tx => ({
      id: tx.id,
      ref: tx.ref_no,
      date: new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      description: tx.description,
      category: tx.category,
      amount: Number(tx.amount),
      type: tx.type,
      verified: tx.verified
    }))
  } catch (error) {
    console.error('Fetch Error:', error)
  } finally {
    isLoading.value = false
  }
}

import { onMounted } from 'vue'
onMounted(fetchTransactions)

const filteredTransactions = computed(() => {
  if (!transactions.value) return []
  return transactions.value.filter(tx => {
    const descMatch = tx.description?.toLowerCase().includes(searchQuery.value.toLowerCase())
    const refMatch = tx.ref?.toLowerCase().includes(searchQuery.value.toLowerCase())
    return descMatch || refMatch
  })
})

const totalFunds = computed(() => {
  return transactions.value
    .filter(tx => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0)
})

const totalExpenses = computed(() => {
  return transactions.value
    .filter(tx => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0)
})

const remainingBudget = computed(() => totalFunds.value - totalExpenses.value)

const openTransactionModal = (type = 'expense') => {
  Object.assign(txForm, { 
    type: type,
    date: new Date().toISOString().split('T')[0], 
    category: type === 'income' ? 'Annual Budget Allocation' : 'Sports & Health Programs', 
    description: '', 
    amount: 0,
    or_number: '',
    supplier: '',
    receipt_url: ''
  })
  fileName.value = ''
  isTransactionModalOpen.value = true
}

const submitTransaction = async () => {
  try {
    const response = await fetch('http://127.0.0.1:5000/api/transactions', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userStore.token}` 
      },
      body: JSON.stringify(txForm)
    })
    
    if (!response.ok) throw new Error('Failed to record transaction')
    
    await fetchTransactions()
    isTransactionModalOpen.value = false
    showToast(`Transaction recorded as ${txForm.type} successfully`)
  } catch (error) {
    alert('Error recording transaction: ' + error.message)
  }
}

const showToast = (message) => {
  toast.value = { message }
  setTimeout(() => toast.value = null, 4000)
}

const generateAuditReport = () => {
  alert('Generating Comprehensive Audit Report (PDF)...')
}
</script>

<style scoped>
.font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.4s ease; }
.slide-up-enter-from { opacity: 0; transform: translateY(20px); }
.slide-up-leave-to { opacity: 0; transform: translateY(20px); }
</style>
