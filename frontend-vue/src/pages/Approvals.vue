<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useUserStore } from '../stores/user'
import { 
  ShieldCheck as ShieldCheckIcon, Clock as ClockIcon, CheckCircle as CheckCircleIcon,
  AlertTriangle as AlertTriangleIcon, Wallet as WalletIcon, Calendar as CalendarIcon,
  FilePlus as FilePlusIcon, Users as UsersIcon, ChevronRight as ChevronRightIcon,
  Info as InfoIcon, X as XIcon, Send as SendIcon, AlertCircle as AlertCircleIcon
} from 'lucide-vue-next'

const userStore = useUserStore()
const approvalItems = ref([])
const isLoading = ref(false)

// Modal States
const viewModal = reactive({ show: false, item: null })
const returnModal = reactive({ show: false, item: null, feedback: '' })
const statusModal = reactive({ show: false, type: 'success', title: '', message: '' })

const fetchPending = async () => {
  isLoading.value = true
  try {
    const [actRes, budRes] = await Promise.all([
      fetch('http://127.0.0.1:5000/api/proposals/activity-proposals/pending', {
        headers: { 'Authorization': `Bearer ${userStore.token}` }
      }),
      fetch('http://127.0.0.1:5000/api/proposals/budget-proposals/pending', {
        headers: { 'Authorization': `Bearer ${userStore.token}` }
      })
    ])
    
    if (!actRes.ok || !budRes.ok) throw new Error('Failed to fetch from server')
    
    const activities = await actRes.json()
    const budgets = await budRes.json()
    
    const mappedActivities = activities.map(p => ({
      ...p,
      id: p.id,
      title: p.project_title,
      type: 'Activity',
      submittedBy: p.submitter?.full_name || 'SK Official',
      description: p.rationale,
      budget: p.budget_requirement,
      date: new Date(p.created_at).toLocaleDateString(),
      icon: FilePlusIcon,
      typeColor: 'bg-emerald-500 text-white'
    }))

    const mappedBudgets = budgets.map(p => ({
      ...p,
      id: p.id,
      title: p.title,
      type: 'Budget',
      submittedBy: p.submitter?.full_name || 'SK Official',
      description: p.description,
      budget: p.total_amount,
      date: new Date(p.created_at).toLocaleDateString(),
      icon: WalletIcon,
      typeColor: 'bg-blue-500 text-white'
    }))

    approvalItems.value = [...mappedActivities, ...mappedBudgets].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  } catch (error) {
    console.error('Fetch Error:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchPending)

const pendingCount = computed(() => approvalItems.value.length)

const showStatus = (type, title, message) => {
  statusModal.type = type
  statusModal.title = title
  statusModal.message = message
  statusModal.show = true
}

const approveItem = async (item) => {
  try {
    const endpoint = item.type === 'Activity' ? 'activity-proposals' : 'budget-proposals'
    const response = await fetch(`http://127.0.0.1:5000/api/proposals/${endpoint}/${item.id}/approve`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${userStore.token}` }
    })
    
    if (!response.ok) throw new Error('Approval failed on server')
    
    showStatus('success', 'Proposal Approved', 'The proposal has been successfully approved and recorded.')
    approvalItems.value = approvalItems.value.filter(i => i.id !== item.id)
    viewModal.show = false
  } catch (error) {
    showStatus('error', 'Action Failed', error.message)
  }
}

const openReturnModal = (item) => {
  returnModal.item = item
  returnModal.feedback = ''
  returnModal.show = true
}

const submitReturn = async () => {
  if (!returnModal.feedback) return
  const item = returnModal.item
  
  try {
    const endpoint = item.type === 'Activity' ? 'activity-proposals' : 'budget-proposals'
    const response = await fetch(`http://127.0.0.1:5000/api/proposals/${endpoint}/${item.id}/return`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userStore.token}` 
      },
      body: JSON.stringify({ feedback: returnModal.feedback })
    })
    
    if (!response.ok) throw new Error('Return failed on server')
    
    showStatus('success', 'Proposal Returned', 'The proposal has been sent back for revision with your comments.')
    approvalItems.value = approvalItems.value.filter(i => i.id !== item.id)
    returnModal.show = false
    viewModal.show = false
  } catch (error) {
    showStatus('error', 'Action Failed', error.message)
  }
}

const viewDetails = (item) => {
  viewModal.item = item
  viewModal.show = true
}
</script>

<template>
  <div class="max-w-[1440px] mx-auto pb-12 p-10 font-inter bg-[#F8FAFC] animate-fade-up">

    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
      <div>
        <h1 class="text-4xl font-black text-slate-900 tracking-tight">Executive Review & Approvals</h1>
        <p class="text-slate-500 text-sm font-medium mt-1">Review and approve project proposals and budget requests</p>
      </div>
      <div class="bg-white px-6 py-4 rounded-[1.5rem] border border-slate-100 shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
          <ShieldCheckIcon class="w-6 h-6" />
        </div>
        <div>
           <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Chairperson Access</p>
           <p class="text-xs font-black text-slate-900 uppercase mt-0.5">Oversight Mode Active</p>
        </div>
      </div>
    </div>

    <!-- Stats Summary -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
       <div class="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6 group hover:border-blue-200 transition-all">
          <div class="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-all">
             <ClockIcon class="w-7 h-7" />
          </div>
          <div>
             <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending Review</p>
             <p class="text-2xl font-black text-slate-900 tracking-tight mt-1">{{ pendingCount }} Requests</p>
          </div>
       </div>
       <div class="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6 group hover:border-emerald-200 transition-all">
          <div class="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-all">
             <CheckCircleIcon class="w-7 h-7" />
          </div>
          <div>
             <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Approved Today</p>
             <p class="text-2xl font-black text-slate-900 tracking-tight mt-1">04 Requests</p>
          </div>
       </div>
       <div class="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6 group hover:border-red-200 transition-all">
          <div class="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 group-hover:bg-red-500 group-hover:text-white transition-all">
             <AlertTriangleIcon class="w-7 h-7" />
          </div>
          <div>
             <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Returned/Rejected</p>
             <p class="text-2xl font-black text-slate-900 tracking-tight mt-1">01 Request</p>
          </div>
       </div>
    </div>

    <!-- Review Grid -->
    <div class="space-y-8">
       <div v-for="item in approvalItems" :key="item.id" class="glass-card p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10 group overflow-hidden relative">
          <div class="flex items-start gap-8 relative z-10">
             <div class="w-20 h-20 bg-slate-50 border border-slate-100 rounded-[1.5rem] flex items-center justify-center text-slate-400 group-hover:bg-blue-500 group-hover:text-white transition-all duration-500">
                <component :is="item.icon" class="w-10 h-10" />
             </div>
             <div>
                <div class="flex items-center gap-3 mb-2">
                   <span :class="item.typeColor" class="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/20">{{ item.type }}</span>
                   <span class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Submitted By: {{ item.submittedBy }}</span>
                </div>
                <h3 class="text-2xl font-black text-slate-900 tracking-tight mb-2 group-hover:text-blue-600 transition-colors">{{ item.title }}</h3>
                <p class="text-sm font-medium text-slate-500 max-w-xl leading-relaxed">{{ item.description }}</p>
                
                <div class="flex items-center gap-6 mt-6">
                   <div class="flex items-center gap-2">
                      <div class="flex flex-col">
                        <span class="text-sm font-black text-slate-900 tracking-tight">₱{{ Number(item.budget).toLocaleString() }}</span>
                        <span class="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Total Requirement</span>
                      </div>
                      <CalendarIcon class="w-4 h-4 text-slate-400 ml-4" />
                      <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ item.date }}</span>
                   </div>
                </div>
             </div>
          </div>

          <div class="flex items-center gap-3 shrink-0 relative z-10">
             <button @click="viewDetails(item)" class="btn-secondary !px-6">View Details</button>
             <button @click="openReturnModal(item)" class="btn-secondary !text-red-500 hover:!bg-red-50 hover:!border-red-100 !px-6">Return</button>
             <button @click="approveItem(item)" class="btn-primary !px-8 !bg-blue-600 hover:!bg-blue-700 shadow-blue-100">Approve Request</button>
          </div>

          <!-- Ambient Background -->
          <div class="absolute -right-20 -bottom-20 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
       </div>

       <!-- Empty State -->
       <div v-if="approvalItems.length === 0 && !isLoading" class="sk-table-container p-32 text-center">
          <div class="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-slate-100 shadow-inner">
             <CheckCircleIcon class="w-12 h-12 text-emerald-400" />
          </div>
          <h3 class="text-2xl font-black text-slate-900 tracking-tight uppercase">Queue Fully Cleared</h3>
          <p class="text-slate-400 text-sm font-bold uppercase tracking-[0.2em] mt-3">There are no pending requests requiring your review at this time.</p>
       </div>
    </div>

    <!-- VIEW DETAILS MODAL -->
    <div v-if="viewModal.show" class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
       <div class="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-up">
          <div class="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
             <div class="flex items-center gap-4">
                <div :class="viewModal.item.typeColor" class="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg">
                   <component :is="viewModal.item.icon" class="w-6 h-6" />
                </div>
                <div>
                   <h3 class="text-xl font-black text-slate-900 uppercase tracking-tight">{{ viewModal.item.type }} Review</h3>
                   <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Proposal Reference #{{ viewModal.item.id }}</p>
                </div>
             </div>
             <button @click="viewModal.show = false" class="text-slate-400 hover:text-slate-900 transition-colors">
                <XIcon class="w-6 h-6" />
             </button>
          </div>
          
          <div class="p-10 max-h-[70vh] overflow-y-auto custom-scrollbar space-y-8 text-sm">
             <div class="grid grid-cols-2 gap-8">
                <div>
                   <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-2">Project Title</label>
                   <p class="font-black text-slate-900 text-lg leading-tight">{{ viewModal.item.title }}</p>
                </div>
                <div>
                   <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-2">Total Budget Required</label>
                   <p class="font-black text-blue-600 text-lg tracking-tight">₱{{ viewModal.item.budget.toLocaleString() }}</p>
                </div>
             </div>

             <div class="grid grid-cols-2 gap-8">
                <div>
                   <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-2">Submitted By</label>
                   <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500">{{ viewModal.item.submittedBy.charAt(0) }}</div>
                      <p class="font-bold text-slate-700 uppercase tracking-wide">{{ viewModal.item.submittedBy }}</p>
                   </div>
                </div>
                <div>
                   <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-2">Submission Date</label>
                   <p class="font-bold text-slate-700 uppercase tracking-wide">{{ viewModal.item.date }}</p>
                </div>
             </div>

             <div v-if="viewModal.item.type === 'Activity'" class="space-y-8">
                <div>
                   <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-2">Objectives</label>
                   <p class="font-medium text-slate-600 whitespace-pre-line leading-relaxed">{{ viewModal.item.objectives }}</p>
                </div>
                <div>
                   <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-2">Rationale</label>
                   <p class="font-medium text-slate-600 leading-relaxed">{{ viewModal.item.rationale }}</p>
                </div>
                <div>
                   <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-2">Target Beneficiaries</label>
                   <p class="font-medium text-slate-600 leading-relaxed">{{ viewModal.item.target_beneficiaries }}</p>
                </div>
             </div>

             <div v-if="viewModal.item.type === 'Budget'" class="space-y-8">
                <div>
                   <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-2">Description & Purpose</label>
                   <p class="font-medium text-slate-600 leading-relaxed">{{ viewModal.item.description }}</p>
                </div>
             </div>
          </div>

          <div class="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
             <button @click="openReturnModal(viewModal.item)" class="px-8 py-4 bg-white border border-slate-200 text-red-500 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-red-50 transition-all">Return for Revision</button>
             <button @click="approveItem(viewModal.item)" class="px-10 py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">Approve Proposal</button>
          </div>
       </div>
    </div>

    <!-- RETURN MODAL -->
    <div v-if="returnModal.show" class="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
       <div class="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-fade-up">
          <div class="p-8 border-b border-slate-100 flex items-center justify-between">
             <h3 class="text-xl font-black text-slate-900 uppercase tracking-tight">Return for Revision</h3>
             <button @click="returnModal.show = false" class="text-slate-400 hover:text-slate-900 transition-colors"><XIcon class="w-6 h-6" /></button>
          </div>
          <div class="p-8">
             <label class="text-[11px] font-black uppercase tracking-widest text-slate-900 mb-3 block">Chairperson Comments</label>
             <textarea v-model="returnModal.feedback" rows="5" placeholder="Enter revision instructions or feedback regarding missing details, budget adjustments, or required revisions..." class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-red-500 outline-none transition-all resize-none"></textarea>
             <p class="text-[10px] font-bold text-slate-400 mt-4 leading-relaxed uppercase tracking-widest">This feedback will be instantly visible to the submitter for revision.</p>
          </div>
          <div class="p-8 bg-slate-50 border-t border-slate-100 flex flex-col gap-3">
             <button @click="submitReturn" :disabled="!returnModal.feedback" class="w-full py-4 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-red-100 flex items-center justify-center gap-2">
                <SendIcon class="w-4 h-4" /> Send Feedback
             </button>
             <button @click="returnModal.show = false" class="w-full py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">Cancel</button>
          </div>
       </div>
    </div>

    <!-- STATUS NOTIFICATION MODAL -->
    <div v-if="statusModal.show" class="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
       <div class="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xs overflow-hidden animate-fade-up">
          <div class="p-10 text-center">
             <div :class="statusModal.type === 'success' ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'" class="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                <CheckCircleIcon v-if="statusModal.type === 'success'" class="w-8 h-8" />
                <AlertCircleIcon v-else class="w-8 h-8" />
             </div>
             <h3 class="text-lg font-black text-slate-900 uppercase tracking-tight mb-2">{{ statusModal.title }}</h3>
             <p class="text-[11px] font-bold text-slate-500 leading-relaxed">{{ statusModal.message }}</p>
          </div>
          <div class="p-6 bg-slate-50 border-t border-slate-100">
             <button @click="statusModal.show = false" class="w-full py-3.5 bg-slate-900 hover:bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Dismiss</button>
          </div>
       </div>
    </div>

  </div>
</template>

<style scoped>
.font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
.animate-fade-up { animation: fadeUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.glass-card { background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.5); border-radius: 2.5rem; transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
.glass-card:hover { border-color: #3b82f6; transform: translateY(-4px); box-shadow: 0 20px 40px -10px rgba(59, 130, 246, 0.1); }
.btn-primary { @apply px-6 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all duration-300 shadow-lg active:scale-95; }
.btn-secondary { @apply px-6 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all duration-300 active:scale-95 bg-white; }
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
</style>
