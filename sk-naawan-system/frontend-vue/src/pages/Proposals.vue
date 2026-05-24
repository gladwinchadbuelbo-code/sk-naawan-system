<template>
  <div class="space-y-6 max-w-7xl mx-auto pb-12 p-8 relative">
    
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-start justify-between gap-4">
      <div>
        <router-link to="/events" class="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 mb-4 transition-colors">
          <ArrowLeftIcon class="w-4 h-4" /> Back to Events
        </router-link>
        <h1 class="text-3xl font-bold text-slate-900">My Activity Proposals</h1>
        <p class="text-slate-500 text-sm mt-1">Track the status of your submitted activity proposals</p>
      </div>
      <button @click="$router.push('/create-proposal')" class="bg-[#10B981] hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 shadow-sm transition-colors shrink-0">
        <PlusIcon class="w-4 h-4" />
        Create Activity Proposal
      </button>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-slate-500">Total Proposals</p>
          <h2 class="text-3xl font-bold text-slate-800 mt-1">{{ proposals.length }}</h2>
        </div>
        <div class="p-3 bg-blue-50 rounded-xl">
          <FileTextIcon class="w-6 h-6 text-blue-600" />
        </div>
      </div>
      
      <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-slate-500">Pending Review</p>
          <h2 class="text-3xl font-bold text-slate-800 mt-1">{{ pendingCount }}</h2>
        </div>
        <div class="p-3 bg-amber-50 rounded-xl">
          <ClockIcon class="w-6 h-6 text-amber-500" />
        </div>
      </div>

      <div class="bg-emerald-50 rounded-2xl border border-emerald-100 p-6 shadow-sm flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-emerald-800">Approved</p>
          <h2 class="text-3xl font-bold text-emerald-700 mt-1">{{ approvedCount }}</h2>
        </div>
        <div class="p-3 bg-emerald-100 rounded-xl">
          <CheckCircleIcon class="w-6 h-6 text-[#10B981]" />
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-slate-500">Returned</p>
          <h2 class="text-3xl font-bold text-slate-800 mt-1">{{ returnedCount }}</h2>
        </div>
        <div class="p-3 bg-red-50 rounded-xl">
          <XCircleIcon class="w-6 h-6 text-red-500" />
        </div>
      </div>
    </div>

    <!-- Proposals Table -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <!-- Table Header & Controls -->
      <div class="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 class="font-semibold text-slate-800 text-lg">Recent Submissions</h3>
        <div class="flex items-center gap-3">
          <div class="relative">
            <input type="text" placeholder="Search proposals..." class="pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none w-full md:w-64 transition-shadow" />
            <SearchIcon class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <button class="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-gray-50 flex items-center gap-2 transition-colors shrink-0">
            <FilterIcon class="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      <!-- Table Content -->
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-gray-100">
              <th class="p-5">Proposal Details</th>
              <th class="p-5">Submission Date</th>
              <th class="p-5">Status</th>
              <th class="p-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in proposals" :key="item.id" class="hover:bg-slate-50/80 transition-colors border-b border-gray-50 last:border-0 group">
              <td class="p-5">
                <p class="font-semibold text-slate-800">{{ item.title }}</p>
                <p class="text-xs text-slate-500 mt-1 truncate max-w-md">{{ item.description }}</p>
              </td>
              <td class="p-5">
                <span class="text-sm font-medium text-slate-600">{{ item.date }}</span>
              </td>
              <td class="p-5">
                <span :class="getStatusStyle(item.status)" class="px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 border border-transparent">
                  <span v-if="item.status === 'Approved'" class="w-1.5 h-1.5 rounded-full bg-current"></span>
                  {{ item.status }}
                </span>
              </td>
              <td class="p-5 text-right whitespace-nowrap">
                <button v-if="item.status === 'Pending Review'" @click="$router.push(`/create-proposal?edit=${item.id}`)" class="text-blue-600 bg-blue-50 hover:bg-blue-100 text-xs font-medium px-4 py-2 rounded-lg transition-colors mr-2">
                  Edit
                </button>
                <button v-if="item.status === 'Approved'" @click="$router.push(`/attendance/${item.id}`)" class="text-white bg-[#10B981] hover:bg-emerald-600 text-xs font-medium px-4 py-2 rounded-lg transition-colors mr-2">
                  Manage Attendance
                </button>
                <button @click="$router.push(`/proposal/${item.id}`)" class="text-slate-500 hover:text-slate-700 text-xs font-medium px-3 py-2 border border-gray-200 hover:bg-gray-100 rounded-lg transition-colors">
                  View Details
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { 
  ArrowLeft as ArrowLeftIcon,
  Plus as PlusIcon,
  FileText as FileTextIcon,
  Clock as ClockIcon,
  CheckCircle as CheckCircleIcon,
  XCircle as XCircleIcon,
  Filter as FilterIcon,
  Search as SearchIcon
} from 'lucide-vue-next'

const userStore = useUserStore()
const proposals = ref([])
const isLoading = ref(false)

const fetchProposals = async () => {
  isLoading.value = true
  try {
    const response = await fetch('http://127.0.0.1:5000/api/proposals/my-proposals', {
      headers: { 'Authorization': `Bearer ${userStore.token}` }
    })
    
    if (!response.ok) throw new Error('Failed to fetch from server')
    
    const data = await response.json()
    // Map both activities and budgets
    const activities = (data.activities || []).map(p => ({
      id: p.id,
      title: p.project_title,
      description: p.rationale,
      date: new Date(p.created_at).toLocaleDateString(),
      status: p.status === 'pending' ? 'Pending Review' : p.status.charAt(0).toUpperCase() + p.status.slice(1),
      comments: p.chairperson_comments
    }))

    const budgets = (data.budgets || []).map(p => ({
      id: p.id,
      title: p.title,
      description: p.description,
      date: new Date(p.created_at).toLocaleDateString(),
      status: p.status === 'pending' ? 'Pending Review' : p.status.charAt(0).toUpperCase() + p.status.slice(1),
      comments: p.chairperson_feedback
    }))

    proposals.value = [...activities, ...budgets].sort((a, b) => new Date(b.date) - new Date(a.date))
  } catch (error) {
    console.error('Error fetching proposals:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchProposals)

const pendingCount = computed(() => proposals.value.filter(p => p.status === 'Pending Review').length)
const approvedCount = computed(() => proposals.value.filter(p => p.status === 'Approved').length)
const returnedCount = computed(() => proposals.value.filter(p => p.status === 'Returned').length)

const getStatusStyle = (status) => {
  if (status === 'Approved') return 'bg-emerald-100 text-[#10B981]'
  if (status === 'Pending Review') return 'bg-amber-100 text-amber-600'
  if (status === 'Returned') return 'bg-red-100 text-red-600'
  return 'bg-slate-100 text-slate-600'
}
</script>

<style scoped>
</style>
