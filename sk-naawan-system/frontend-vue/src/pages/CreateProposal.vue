<template>
  <div class="max-w-[1400px] mx-auto pb-12 p-8 font-inter bg-[#F8FAFC] animate-fade-up">
    
    <!-- Navigation -->
    <div class="mb-8">
      <button @click="$router.push('/proposals')" class="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 hover:bg-slate-50 transition-all uppercase tracking-widest shadow-sm">
        <ArrowLeftIcon class="w-4 h-4" /> Back to List
      </button>
    </div>

    <!-- Header -->
    <div class="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h1 class="text-3xl font-black text-slate-900 tracking-tight">Activity Proposal Form</h1>
        <p class="text-slate-500 text-sm font-medium mt-1">Submit a new project proposal for SK Chairperson review</p>
      </div>
      <div class="flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl border border-slate-100 shadow-sm">
        <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
        <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Official Submission</span>
      </div>
    </div>

    <div class="grid grid-cols-12 gap-8">
      <!-- Left Column: Forms -->
      <div class="col-span-12 lg:col-span-8 space-y-8">
        <!-- Proposal Details -->
        <div class="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8">
          <h3 class="text-sm font-black text-slate-900 uppercase tracking-widest mb-8 text-slate-400">I. Project Context</h3>
          <div class="space-y-6">
            <div>
              <label class="text-[11px] font-black uppercase tracking-widest text-slate-900 mb-3 block">Project Title *</label>
              <input v-model="form.project_title" type="text" placeholder="e.g., Youth Leadership Summit 2026" class="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-5 py-3.5 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
            </div>
            <div class="grid grid-cols-2 gap-6">
              <div>
                <label class="text-[11px] font-black uppercase tracking-widest text-slate-900 mb-3 block">Duration/Date *</label>
                <input v-model="form.duration" type="text" placeholder="e.g., July 10, 2026" class="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-5 py-3.5 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
              </div>
              <div>
                <label class="text-[11px] font-black uppercase tracking-widest text-slate-900 mb-3 block">Venue *</label>
                <input v-model="form.venue" type="text" placeholder="e.g., Municipal Hall" class="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-5 py-3.5 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
              </div>
            </div>
            <div>
              <label class="text-[11px] font-black uppercase tracking-widest text-slate-900 mb-3 block">Rationale & Justification *</label>
              <textarea v-model="form.rationale" rows="4" placeholder="Describe the purpose and need for this project..." class="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-5 py-3.5 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"></textarea>
            </div>
            <div>
              <label class="text-[11px] font-black uppercase tracking-widest text-slate-900 mb-3 block">Target Beneficiaries *</label>
              <input v-model="form.target_beneficiaries" type="text" placeholder="e.g., Youth of Barangay Naawan (15-30 years old)" class="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-5 py-3.5 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
            </div>
          </div>
        </div>

        <!-- Objectives -->
        <div class="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8">
          <div class="flex items-center justify-between mb-8">
            <h3 class="text-sm font-black text-slate-900 uppercase tracking-widest text-slate-400">II. Objectives</h3>
            <button @click="addObjective" class="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black text-slate-600 hover:bg-slate-100 transition-all uppercase tracking-widest">
              <PlusIcon class="w-4 h-4" /> Add Row
            </button>
          </div>
          <div class="space-y-4">
             <div v-for="(obj, index) in form.objectives" :key="index" class="flex items-center gap-4">
                <input v-model="obj.value" type="text" :placeholder="'Objective #' + (index + 1)" class="flex-1 bg-slate-50/50 border border-slate-100 rounded-xl px-5 py-3 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                <button v-if="form.objectives.length > 1" @click="removeObjective(index)" class="text-slate-300 hover:text-red-500 transition-colors">
                   <Trash2Icon class="w-4 h-4" />
                </button>
             </div>
          </div>
        </div>

        <!-- Budget Items -->
        <div class="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8">
          <div class="flex items-center justify-between mb-8">
            <h3 class="text-sm font-black text-slate-900 uppercase tracking-widest text-slate-400">III. Budget Items</h3>
            <button @click="addBudgetItem" class="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black text-slate-600 hover:bg-slate-100 transition-all uppercase tracking-widest">
              <PlusIcon class="w-4 h-4" /> Add Item
            </button>
          </div>
          <div class="space-y-4">
            <div v-for="(item, index) in form.budget_items" :key="index" class="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 relative group transition-all duration-300">
               <div class="flex items-center justify-between mb-4">
                  <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Item #{{ index + 1 }}</p>
                  <button @click="removeBudgetItem(index)" v-if="form.budget_items.length > 1" class="text-slate-300 hover:text-red-500 transition-colors">
                     <Trash2Icon class="w-4 h-4" />
                  </button>
               </div>
               <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div class="md:col-span-1">
                   <label class="text-[11px] font-black uppercase tracking-widest text-slate-900 mb-2 block">Item Name *</label>
                   <input v-model="item.item" type="text" placeholder="e.g., Printing of Materials" class="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none" />
                 </div>
                 <div class="md:col-span-1">
                   <label class="text-[11px] font-black uppercase tracking-widest text-slate-900 mb-2 block">Estimated Cost (₱) *</label>
                   <input v-model.number="item.cost" type="number" placeholder="0.00" class="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-black text-emerald-600 focus:ring-2 focus:ring-emerald-500 outline-none" />
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Summary -->
      <div class="col-span-12 lg:col-span-4">
        <div class="sticky top-8 space-y-6">
          <div class="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8">
            <h3 class="text-sm font-black text-slate-900 uppercase tracking-widest mb-8">Proposal Summary</h3>
            <div class="space-y-6">
              <div class="p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Proponent</p>
                <p class="text-sm font-black text-slate-900 uppercase">{{ userStore.name }}</p>
              </div>
              <div class="p-6 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                <p class="text-[10px] font-black text-emerald-600/60 uppercase tracking-widest mb-2">Total Budget Requirement</p>
                <p class="text-4xl font-black text-emerald-600 font-jakarta">₱{{ totalBudget.toLocaleString() }}</p>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-3">
            <button @click="submit" :disabled="isSubmitting" class="w-full py-4 bg-[#EA580C] hover:bg-[#C2410C] text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-lg shadow-orange-500/10 flex items-center justify-center gap-3 transition-all">
              <SendIcon class="w-5 h-5" /> {{ isSubmitting ? 'Submitting...' : 'Submit Proposal' }}
            </button>
            <button @click="$router.push('/proposals')" class="w-full py-4 bg-white border border-slate-200 rounded-[1.5rem] text-sm font-black text-slate-500 hover:bg-slate-50 transition-all uppercase tracking-widest">
              Cancel Draft
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- SUCCESS/ERROR MODAL -->
    <div v-if="modal.show" class="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
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
                {{ modal.type === 'success' ? 'Back to Proposals' : 'Try Again' }}
             </button>
          </div>
       </div>
    </div>

  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
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
const isSubmitting = ref(false)

const modal = reactive({
  show: false,
  type: 'success',
  title: '',
  message: ''
})

const form = reactive({
  project_title: '',
  duration: '',
  venue: '',
  rationale: '',
  objectives: [{ value: '' }],
  target_beneficiaries: '',
  budget_items: [{ item: '', cost: 0 }]
})

const totalBudget = computed(() => {
  return form.budget_items.reduce((sum, item) => sum + (Number(item.cost) || 0), 0)
})

const addObjective = () => form.objectives.push({ value: '' })
const removeObjective = (index) => form.objectives.splice(index, 1)

const addBudgetItem = () => form.budget_items.push({ item: '', cost: 0 })
const removeBudgetItem = (index) => form.budget_items.splice(index, 1)

const closeModal = () => {
  modal.show = false
  if (modal.type === 'success') {
    router.push('/proposals')
  }
}

const submit = async () => {
  if (!form.project_title || !form.rationale || !form.target_beneficiaries) {
    modal.title = 'Missing Information'
    modal.message = 'Please fill in the Project Title, Rationale, and Target Beneficiaries.'
    modal.type = 'error'
    modal.show = true
    return
  }

  isSubmitting.value = true
  try {
    const payload = {
      project_title: form.project_title,
      project_proponent: userStore.name,
      barangay: 'Naawan',
      objectives: form.objectives.map(o => o.value).filter(v => v.trim()).join('\n'),
      rationale: form.rationale,
      target_beneficiaries: form.target_beneficiaries,
      budget_requirement: totalBudget.value,
      duration: form.duration,
      venue: form.venue
    }

    const response = await apiFetch('/api/proposals/activity-proposals', {
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
  } finally {
    isSubmitting.value = false
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
