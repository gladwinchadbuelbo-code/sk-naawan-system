<template>
  <div v-if="isOpen" class="fixed inset-0 z-[150] flex justify-end">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" @click="$emit('close')"></div>

    <!-- Panel -->
    <div class="relative w-full max-w-xl h-full bg-[#F8FAFC] shadow-2xl flex flex-col transform transition-transform duration-500 ease-in-out" :class="isOpen ? 'translate-x-0' : 'translate-x-full'">
      
      <!-- Header -->
      <div class="p-8 border-b border-slate-100 bg-white/80 backdrop-blur-md flex items-center justify-between shrink-0">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <SparklesIcon class="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 class="text-xl font-black text-slate-900 tracking-tight">AI Strategic Insights</h2>
            <p class="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-1">Activity Planning Analysis</p>
          </div>
        </div>
        <button @click="$emit('close')" class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all">
          <XIcon class="w-5 h-5" />
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <!-- Loading State -->
        <div v-if="isLoading" class="space-y-8 animate-pulse">
          <div class="text-center mb-8">
            <div class="inline-block p-4 bg-indigo-50 rounded-full mb-4">
              <Loader2Icon class="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
            <p class="text-sm font-bold text-slate-500 uppercase tracking-widest">Analyzing Data...</p>
          </div>
          
          <div v-for="i in 2" :key="'loader-insight-'+i" class="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <div class="h-4 bg-slate-100 rounded-full w-1/3 mb-4"></div>
            <div class="h-3 bg-slate-50 rounded-full w-full mb-2"></div>
            <div class="h-3 bg-slate-50 rounded-full w-4/5"></div>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-50 text-red-600 p-6 rounded-[2rem] border border-red-100 text-center">
          <AlertCircleIcon class="w-10 h-10 mx-auto mb-4 opacity-80" />
          <h3 class="font-black text-lg tracking-tight mb-2">Analysis Failed</h3>
          <p class="text-xs font-bold uppercase tracking-widest opacity-80">{{ error }}</p>
          <button @click="fetchInsights" class="mt-6 px-6 py-3 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-200">Try Again</button>
        </div>

        <!-- Success State -->
        <div v-else-if="data" class="space-y-8 animate-fade-up">
          
          <!-- Insights Section -->
          <div>
            <h3 class="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <BarChart2Icon class="w-4 h-4" /> Key Findings
            </h3>
            <div class="space-y-4">
              <div v-for="(insight, index) in data.insights" :key="'insight-'+index" 
                   class="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm relative overflow-hidden group">
                <div :class="getInsightBadgeClass(insight.type)" class="absolute top-0 right-0 px-4 py-1.5 rounded-bl-[1.5rem] text-[9px] font-black uppercase tracking-widest">
                  {{ insight.type }}
                </div>
                <h4 class="font-black text-slate-900 text-base tracking-tight mb-2 pr-16">{{ insight.title }}</h4>
                <p class="text-slate-500 text-sm font-medium leading-relaxed">{{ insight.description }}</p>
              </div>
            </div>
          </div>

          <!-- Recommendations Section -->
          <div>
            <h3 class="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2 mt-8">
              <LightbulbIcon class="w-4 h-4 text-amber-500" /> Actionable Recommendations
            </h3>
            <div class="space-y-4">
              <div v-for="(rec, index) in data.recommendations" :key="'rec-'+index" 
                   class="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-[2rem] p-6 border border-indigo-100 relative group transition-all hover:shadow-md hover:-translate-y-1">
                <div class="flex items-start gap-4">
                  <div class="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm text-indigo-600 font-black">
                    {{ index + 1 }}
                  </div>
                  <div>
                    <h4 class="font-black text-slate-900 text-base tracking-tight mb-2">{{ rec.action }}</h4>
                    <div class="space-y-3">
                      <div>
                        <span class="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em] block mb-1">Rationale</span>
                        <p class="text-slate-600 text-xs font-medium">{{ rec.rationale }}</p>
                      </div>
                      <div>
                        <span class="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em] block mb-1">Expected Impact</span>
                        <p class="text-emerald-700 text-xs font-bold bg-emerald-100/50 inline-block px-3 py-1.5 rounded-lg">{{ rec.impact }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      <!-- Footer -->
      <div class="p-6 bg-slate-50 border-t border-slate-100 flex justify-center shrink-0">
        <p class="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
          Powered by Gemini AI <SparklesIcon class="w-3 h-3 text-indigo-400" />
        </p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { 
  X as XIcon, 
  Sparkles as SparklesIcon,
  Loader2 as Loader2Icon,
  AlertCircle as AlertCircleIcon,
  BarChart2 as BarChart2Icon,
  Lightbulb as LightbulbIcon
} from 'lucide-vue-next'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const isLoading = ref(false)
const error = ref(null)
const data = ref(null)

const fetchInsights = async () => {
  isLoading.value = true
  error.value = null
  data.value = null
  
  try {
    const res = await fetch('http://127.0.0.1:5000/api/recommendations/activity-planning')
    const json = await res.json()
    if (json.success) {
      data.value = json.data
    } else {
      error.value = json.message || 'Failed to fetch insights.'
    }
  } catch (err) {
    error.value = 'Network error or server is down.'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

watch(() => props.isOpen, (newVal) => {
  if (newVal && !data.value) {
    fetchInsights()
  }
})

const getInsightBadgeClass = (type) => {
  const map = {
    'alert': 'bg-red-100 text-red-600',
    'success': 'bg-emerald-100 text-emerald-600',
    'info': 'bg-blue-100 text-blue-600'
  }
  return map[type] || 'bg-slate-100 text-slate-600'
}
</script>

<style scoped>
.animate-fade-up { animation: fadeUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94A3B8; }
</style>
