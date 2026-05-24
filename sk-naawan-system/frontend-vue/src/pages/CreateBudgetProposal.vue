<template>
  <div class="max-w-[1400px] mx-auto pb-12 p-8 font-inter bg-[#F8FAFC] animate-fade-up">
    
    <!-- Navigation -->
    <div class="mb-8">
      <button @click="$router.push('/budget')" class="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 hover:bg-slate-50 transition-all uppercase tracking-widest shadow-sm">
        <ArrowLeftIcon class="w-4 h-4" /> Back to Budget
      </button>
    </div>

    <!-- Header -->
    <div class="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h1 class="text-3xl font-black text-slate-900 tracking-tight">Create Budget Proposal</h1>
        <p class="text-slate-500 text-sm font-medium mt-1">Submit a new budget proposal for SK President approval</p>
      </div>
      <div class="flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl border border-slate-100 shadow-sm">
        <div class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
        <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Drafting Phase</span>
      </div>
    </div>

    <div class="grid grid-cols-12 gap-8">
      <!-- Left Column: Forms -->
      <div class="col-span-12 lg:col-span-8 space-y-8">
        <!-- Proposal Details -->
        <div class="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8">
          <h3 class="text-sm font-black text-slate-900 uppercase tracking-widest mb-8">Proposal Details</h3>
          <div class="space-y-6">
            <div>
              <label class="text-[11px] font-black uppercase tracking-widest text-slate-900 mb-3 block">Proposal Title *</label>
              <input v-model="proposal.title" type="text" placeholder="e.g., Q1 2026 Budget Allocation" class="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-5 py-3.5 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
            </div>
            <div>
              <label class="text-[11px] font-black uppercase tracking-widest text-slate-900 mb-3 block">Description *</label>
              <textarea v-model="proposal.description" rows="4" placeholder="Describe the purpose and scope of this budget..." class="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-5 py-3.5 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"></textarea>
            </div>
          </div>
        </div>

        <!-- Budget Items -->
        <div class="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8">
          <div class="flex items-center justify-between mb-8">
            <h3 class="text-sm font-black text-slate-900 uppercase tracking-widest">Budget Items</h3>
            <button @click="addItem" class="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black text-slate-600 hover:bg-slate-100 transition-all uppercase tracking-widest">
              <PlusIcon class="w-4 h-4" /> Add Item
            </button>
          </div>
          
          <div class="space-y-6">
            <div v-for="(item, index) in proposal.items" :key="index" class="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 relative group transition-all duration-300">
              <div class="flex items-center justify-between mb-4">
                 <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Item #{{ index + 1 }}</p>
                 <button @click="removeItem(index)" v-if="proposal.items.length > 1" class="text-slate-300 hover:text-red-500 transition-colors">
                    <Trash2Icon class="w-4 h-4" />
                 </button>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="text-[11px] font-black uppercase tracking-widest text-slate-900 mb-2 block">Category *</label>
                  <select v-model="item.category" class="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none">
                    <option disabled selected>Select category</option>
                    <option>Youth Development</option>
                    <option>Sports & Health</option>
                    <option>Environment</option>
                  </select>
                </div>
                <div>
                  <label class="text-[11px] font-black uppercase tracking-widest text-slate-900 mb-2 block">Amount (₱) *</label>
                  <input v-model.number="item.amount" type="number" placeholder="0.00" class="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-black focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
              </div>
              <div class="mt-4">
                <label class="text-[11px] font-black uppercase tracking-widest text-slate-900 mb-2 block">Description *</label>
                <input v-model="item.description" type="text" placeholder="Describe this budget item..." class="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Summary -->
      <div class="col-span-12 lg:col-span-4">
        <div class="sticky top-8 space-y-6">
          <div class="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8">
            <h3 class="text-sm font-black text-slate-900 uppercase tracking-widest mb-8">Proposal Summary</h3>
            <div class="space-y-6">
              <div class="p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Budget Items</p>
                <p class="text-2xl font-black text-slate-900 font-jakarta">{{ proposal.items.length }}</p>
              </div>
              <div class="p-6 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                <p class="text-[10px] font-black text-emerald-600/60 uppercase tracking-widest mb-2">Total Amount</p>
                <p class="text-4xl font-black text-emerald-600 font-jakarta">₱{{ totalAmount.toLocaleString() }}</p>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-3">
            <button @click="submitProposal" class="w-full py-4 bg-[#10B981] hover:bg-[#059669] text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-3 transition-all">
              <SendIcon class="w-5 h-5" /> Submit Proposal
            </button>
            <button @click="$router.push('/budget')" class="w-full py-4 bg-white border border-slate-200 rounded-[1.5rem] text-sm font-black text-slate-500 hover:bg-slate-50 transition-all uppercase tracking-widest">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- SUCCESS/ERROR MODAL -->
    <div v-if="modal.show" class="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
       <div class="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-fade-up">
          <div class="p-10 text-center">
             <div :class="modal.type === 'success' ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'" class="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                <CheckCircleIcon v-if="modal.type === 'success'" class="w-10 h-10" />
                <AlertCircleIcon v-else class="w-10 h-10" />
             </div>
             <h3 class="text-2xl font-black text-slate-900 tracking-tight uppercase mb-2">{{ modal.title }}</h3>
             <p class="text-sm font-bold text-slate-500 leading-relaxed">{{ modal.message }}</p>
          </div>
          <div class="p-8 bg-slate-50 border-t border-slate-100">
             <button @click="closeModal" class="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-slate-200">
                {{ modal.type === 'success' ? 'Back to Budget' : 'Try Again' }}
             </button>
          </div>
       </div>
    </div>

  </div>
</template>

<script setup>
import { reactive, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { apiFetch, parseApiError } from '../utils/api'
import { 
  ArrowLeft as ArrowLeftIcon, 
  Plus as PlusIcon, 
  Send as SendIcon,
  Trash2 as Trash2Icon,
  CheckCircle as CheckCircleIcon,
  AlertCircle as AlertCircleIcon
} from 'lucide-vue-next'

const router = useRouter()
const userStore = useUserStore()

const modal = reactive({
  show: false,
  type: 'success',
  title: '',
  message: ''
})

const proposal = reactive({
  title: '',
  description: '',
  items: [
    { category: 'Youth Development', amount: 0, description: '' }
  ]
})

const totalAmount = computed(() => {
  return proposal.items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
})

const addItem = () => {
  proposal.items.push({ category: 'Youth Development', amount: 0, description: '' })
}

const removeItem = (index) => {
  proposal.items.splice(index, 1)
}

const closeModal = () => {
  modal.show = false
  if (modal.type === 'success') {
    router.push('/budget')
  }
}

const submitProposal = async () => {
  if (!proposal.title || !proposal.description) {
    modal.title = 'Missing Fields'
    modal.message = 'Please complete all required fields before submitting.'
    modal.type = 'error'
    modal.show = true
    return
  }
  
  try {
    const payload = {
      title: proposal.title,
      description: proposal.description,
      total_amount: totalAmount.value,
      purpose: proposal.description 
    }
    
    console.log('API Request: POST /api/proposals/budget-proposals', payload)

    const response = await apiFetch('/api/proposals/budget-proposals', {
      method: 'POST',
      body: JSON.stringify(payload)
    }, userStore.token)
    
    const result = await response.json()
    
    if (response.ok && result.success) {
      modal.title = 'Proposal Submitted'
      modal.message = 'Your proposal has been successfully submitted to the SK Chairperson for review.'
      modal.type = 'success'
      modal.show = true
    } else {
      const errorMsg = await parseApiError(response, result)
      throw new Error(errorMsg)
    }
  } catch (error) {
    console.error('Submission Error:', error)
    modal.title = 'Submission Failed'
    modal.message = error.message || 'Unable to save proposal to database. Please try again.'
    modal.type = 'error'
    modal.show = true
  }
}
</script>

<style scoped>
.font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
.animate-fade-up { animation: fadeUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>
