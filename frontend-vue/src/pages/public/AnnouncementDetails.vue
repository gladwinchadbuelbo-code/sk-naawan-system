<template>
  <div class="max-w-4xl mx-auto pb-12 p-8 font-inter bg-[#F8FAFC] min-h-screen animate-fade-up">
    
    <!-- Back Button -->
    <router-link to="/announcements" class="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 mb-8 transition-all hover:shadow-sm">
      <ArrowLeftIcon class="w-4 h-4" /> Back to Announcements
    </router-link>

    <!-- Loading -->
    <div v-if="isLoading" class="flex items-center justify-center py-32">
      <div class="w-10 h-10 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
      <XCircleIcon class="w-12 h-12 text-red-400 mx-auto mb-4" />
      <h3 class="text-lg font-bold text-red-700">Failed to load announcement</h3>
      <p class="text-red-500 text-sm mt-2">{{ error }}</p>
      <button @click="fetchAnnouncement" class="mt-4 px-6 py-2 bg-red-100 text-red-700 rounded-xl text-sm font-semibold hover:bg-red-200 transition-colors">
        Try Again
      </button>
    </div>

    <!-- Content -->
    <div v-else-if="announcement" class="space-y-8">
      <!-- Header Card -->
      <div class="bg-slate-900 rounded-[2.5rem] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl">
        <div class="relative z-10">
          <div class="flex items-center gap-3 mb-6">
            <span class="px-4 py-1.5 bg-emerald-500 text-slate-900 rounded-full text-[10px] font-black uppercase tracking-widest">
              {{ announcement.category }}
            </span>
            <span class="text-white/40 text-[10px] font-black uppercase tracking-widest">
              {{ formatDate(announcement.date) }}
            </span>
          </div>
          <h1 class="text-3xl md:text-4xl font-black tracking-tight leading-tight mb-4">
            {{ announcement.title }}
          </h1>
          <p class="text-slate-400 text-lg font-medium leading-relaxed">
            {{ announcement.summary }}
          </p>
          <div v-if="announcement.author" class="mt-8 flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">
              {{ announcement.author.full_name?.charAt(0) || 'A' }}
            </div>
            <div>
              <p class="text-white text-sm font-semibold">{{ announcement.author.full_name }}</p>
              <p class="text-slate-500 text-xs uppercase tracking-wider">{{ announcement.author.role }}</p>
            </div>
          </div>
        </div>
        <div class="absolute -right-20 -bottom-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
      </div>

      <!-- Content Body -->
      <div class="bg-white rounded-[2rem] p-10 md:p-14 border border-slate-100 shadow-sm">
        <div class="prose prose-slate max-w-none">
          <div class="text-slate-700 text-base leading-relaxed whitespace-pre-wrap">{{ announcement.content || announcement.summary }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '../../stores/user'
import {
  ArrowLeft as ArrowLeftIcon,
  XCircle as XCircleIcon
} from 'lucide-vue-next'

const route = useRoute()
const userStore = useUserStore()
const announcement = ref(null)
const isLoading = ref(true)
const error = ref(null)

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  })
}

const fetchAnnouncement = async () => {
  isLoading.value = true
  error.value = null
  try {
    const response = await fetch(`http://127.0.0.1:5000/api/announcements/${route.params.id}`, {
      headers: { 'Authorization': `Bearer ${userStore.token}` }
    })
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}))
      throw new Error(errData.message || `HTTP ${response.status}`)
    }
    const data = await response.json()
    announcement.value = data.data
  } catch (err) {
    console.error('Error fetching announcement:', err)
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchAnnouncement)
</script>

<style scoped>
.font-inter { font-family: 'Inter', sans-serif; }
.animate-fade-up { animation: fadeUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
@keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
</style>
