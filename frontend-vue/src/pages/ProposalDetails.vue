<template>
  <div class="space-y-6 max-w-4xl mx-auto pb-12 p-8 relative animate-fade-up">
    
    <!-- Back Button -->
    <router-link to="/proposals" class="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all hover:shadow-sm">
      <ArrowLeftIcon class="w-4 h-4" /> Back to Proposals
    </router-link>

    <!-- Loading -->
    <div v-if="isLoading" class="flex items-center justify-center py-32">
      <div class="w-10 h-10 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
      <XCircleIcon class="w-12 h-12 text-red-400 mx-auto mb-4" />
      <h3 class="text-lg font-bold text-red-700">Failed to load proposal</h3>
      <p class="text-red-500 text-sm mt-2">{{ error }}</p>
      <button @click="fetchProposal" class="mt-4 px-6 py-2 bg-red-100 text-red-700 rounded-xl text-sm font-semibold hover:bg-red-200 transition-colors">
        Try Again
      </button>
    </div>

    <!-- Content -->
    <div v-else-if="proposal" class="space-y-6">
      
      <!-- Status Banner -->
      <div :class="statusBannerClass" class="rounded-2xl p-6 flex items-center justify-between shadow-sm border">
        <div class="flex items-center gap-4">
          <div :class="statusIconClass" class="w-12 h-12 rounded-xl flex items-center justify-center">
            <CheckCircleIcon v-if="proposal.status === 'approved'" class="w-6 h-6" />
            <ClockIcon v-else-if="proposal.status === 'pending'" class="w-6 h-6" />
            <XCircleIcon v-else class="w-6 h-6" />
          </div>
          <div>
            <p class="text-sm font-bold uppercase tracking-wider">{{ statusLabel }}</p>
            <p class="text-xs opacity-75 mt-0.5">Last updated: {{ formatDate(proposal.updated_at) }}</p>
          </div>
        </div>
      </div>

      <!-- Main Info Card -->
      <div class="bg-white rounded-2xl p-8 md:p-10 border border-gray-100 shadow-sm">
        <h1 class="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
          {{ proposal.project_title || proposal.title }}
        </h1>
        <p class="text-slate-500 text-sm mb-8">
          Submitted on {{ formatDate(proposal.created_at) }}
          <span v-if="proposal.submitter"> by <strong>{{ proposal.submitter.full_name }}</strong></span>
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Activity Proposal fields -->
          <div v-if="proposal.project_proponent" class="space-y-1">
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Proponent</p>
            <p class="text-slate-800 font-medium">{{ proposal.project_proponent }}</p>
          </div>
          <div v-if="proposal.barangay" class="space-y-1">
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Barangay</p>
            <p class="text-slate-800 font-medium">{{ proposal.barangay }}</p>
          </div>
          <div v-if="proposal.venue" class="space-y-1">
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Venue</p>
            <p class="text-slate-800 font-medium">{{ proposal.venue }}</p>
          </div>
          <div v-if="proposal.duration" class="space-y-1">
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Duration</p>
            <p class="text-slate-800 font-medium">{{ proposal.duration }}</p>
          </div>
          <div class="space-y-1">
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Budget Requirement</p>
            <p class="text-slate-800 font-bold text-lg">₱{{ formatCurrency(proposal.budget_requirement || proposal.total_amount) }}</p>
          </div>
          <div v-if="proposal.target_beneficiaries" class="space-y-1">
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Target Beneficiaries</p>
            <p class="text-slate-800 font-medium">{{ proposal.target_beneficiaries }}</p>
          </div>
        </div>
      </div>

      <!-- Detailed Sections -->
      <div v-if="proposal.objectives" class="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Objectives</h3>
        <p class="text-slate-700 leading-relaxed whitespace-pre-wrap">{{ proposal.objectives }}</p>
      </div>

      <div v-if="proposal.rationale" class="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Rationale</h3>
        <p class="text-slate-700 leading-relaxed whitespace-pre-wrap">{{ proposal.rationale }}</p>
      </div>

      <div v-if="proposal.description" class="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Description</h3>
        <p class="text-slate-700 leading-relaxed whitespace-pre-wrap">{{ proposal.description }}</p>
      </div>

      <div v-if="proposal.purpose" class="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Purpose</h3>
        <p class="text-slate-700 leading-relaxed whitespace-pre-wrap">{{ proposal.purpose }}</p>
      </div>

      <!-- Chairperson Comments -->
      <div v-if="proposal.chairperson_comments || proposal.chairperson_feedback" class="bg-amber-50 rounded-2xl p-8 border border-amber-200 shadow-sm">
        <h3 class="text-sm font-bold text-amber-700 uppercase tracking-wider mb-3 flex items-center gap-2">
          <MessageSquareIcon class="w-4 h-4" /> Chairperson Feedback
        </h3>
        <p class="text-amber-800 leading-relaxed whitespace-pre-wrap">{{ proposal.chairperson_comments || proposal.chairperson_feedback }}</p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '../stores/user'
import {
  ArrowLeft as ArrowLeftIcon,
  CheckCircle as CheckCircleIcon,
  Clock as ClockIcon,
  XCircle as XCircleIcon,
  MessageSquare as MessageSquareIcon
} from 'lucide-vue-next'

const route = useRoute()
const userStore = useUserStore()
const proposal = ref(null)
const isLoading = ref(true)
const error = ref(null)

const statusLabel = computed(() => {
  if (!proposal.value) return ''
  const s = proposal.value.status
  if (s === 'pending') return 'Pending Review'
  if (s === 'approved') return 'Approved'
  if (s === 'returned') return 'Returned for Revision'
  return s
})

const statusBannerClass = computed(() => {
  if (!proposal.value) return ''
  const s = proposal.value.status
  if (s === 'approved') return 'bg-emerald-50 border-emerald-200 text-emerald-800'
  if (s === 'pending') return 'bg-amber-50 border-amber-200 text-amber-800'
  return 'bg-red-50 border-red-200 text-red-800'
})

const statusIconClass = computed(() => {
  if (!proposal.value) return ''
  const s = proposal.value.status
  if (s === 'approved') return 'bg-emerald-100 text-emerald-600'
  if (s === 'pending') return 'bg-amber-100 text-amber-600'
  return 'bg-red-100 text-red-600'
})

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  })
}

const formatCurrency = (val) => {
  if (!val) return '0.00'
  return Number(val).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const fetchProposal = async () => {
  isLoading.value = true
  error.value = null
  try {
    const response = await fetch(`http://127.0.0.1:5000/api/proposals/${route.params.id}`, {
      headers: { 'Authorization': `Bearer ${userStore.token}` }
    })
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}))
      throw new Error(errData.message || `HTTP ${response.status}`)
    }
    const data = await response.json()
    proposal.value = data.data
  } catch (err) {
    console.error('Error fetching proposal:', err)
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchProposal)
</script>

<style scoped>
.animate-fade-up { animation: fadeUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
@keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
</style>
