<template>
  <div class="max-w-[1440px] mx-auto pb-12 p-8 font-inter bg-[#F8FAFC] min-h-screen animate-fade-up">
    
    <!-- Header -->
    <div class="mb-12">
      <h1 class="text-4xl font-black text-slate-900 tracking-tight">Official Announcements</h1>
      <p class="text-slate-500 text-sm font-medium mt-2">Latest news, advisories, and updates from the Sangguniang Kabataan of Naawan</p>
    </div>

    <!-- Featured Announcement -->
    <div class="bg-slate-900 rounded-[3rem] p-10 md:p-16 mb-12 text-white relative overflow-hidden group shadow-2xl">
      <div class="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
         <div>
            <div class="flex items-center gap-3 mb-6">
               <span class="px-4 py-1.5 bg-emerald-500 text-slate-900 rounded-full text-[10px] font-black uppercase tracking-widest">Urgent Advisory</span>
               <span class="text-white/40 text-[10px] font-black uppercase tracking-widest">May 12, 2026</span>
            </div>
            <h2 class="text-4xl font-black tracking-tight mb-6 leading-tight">Youth Leadership Summit 2026: Venue Change Notification</h2>
            <p class="text-slate-400 text-lg font-medium leading-relaxed mb-8">
               Due to the expected high turnout, the Youth Leadership Summit will be moved from the SK Hall to the Municipal Gym. Please arrive by 8:00 AM for registration and orientation.
            </p>
            <button class="px-10 py-4 bg-white text-slate-900 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-xl shadow-slate-950/20">
               Read Full Advisory
            </button>
         </div>
         <div class="hidden lg:flex justify-center">
            <div class="w-64 h-64 bg-white/5 rounded-[3rem] border border-white/10 flex items-center justify-center backdrop-blur-md group-hover:scale-105 transition-transform duration-700">
               <BellIcon class="w-32 h-32 text-emerald-500/50" />
            </div>
         </div>
      </div>
      <!-- Decorative Background -->
      <div class="absolute -right-20 -bottom-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
    </div>

    <!-- Announcement Feed -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="post in feed" :key="post.id" class="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm group hover:shadow-xl transition-all duration-500 flex flex-col">
        <div class="flex items-center justify-between mb-8">
           <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">{{ post.date }}</span>
           <span class="px-3 py-1 bg-slate-50 border border-slate-100 text-slate-400 text-[9px] font-black uppercase tracking-widest rounded-lg">{{ post.category }}</span>
        </div>
        <h4 class="text-xl font-black text-slate-900 tracking-tight leading-tight mb-4 group-hover:text-emerald-600 transition-colors">{{ post.title }}</h4>
        <p class="text-slate-500 text-sm font-medium leading-relaxed mb-8 flex-1">{{ post.summary }}</p>
        
        <div class="pt-8 border-t border-slate-100 flex items-center justify-between">
           <button @click="viewDetails(post.id)" class="text-[10px] font-black text-slate-900 uppercase tracking-widest hover:text-emerald-600 transition-colors flex items-center gap-2">
              Read Details <ArrowRightIcon class="w-3.5 h-3.5" />
           </button>
           <div class="flex -space-x-2">
              <div v-for="i in 3" :key="i" class="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-black text-slate-400 uppercase">
                 {{ ['A', 'B', 'C'][i-1] }}
              </div>
           </div>
        </div>
      </div>
    </div>

    <!-- Newsletter Placeholder -->
    <div class="mt-20 bg-emerald-50 rounded-[3rem] p-16 flex flex-col items-center text-center border border-emerald-100 relative overflow-hidden">
       <div class="relative z-10 max-w-xl">
          <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm mx-auto mb-8">
             <SendIcon class="w-8 h-8" />
          </div>
          <h3 class="text-3xl font-black text-slate-900 tracking-tight mb-4 uppercase tracking-tighter">Stay Updated</h3>
          <p class="text-slate-500 text-sm font-medium leading-relaxed mb-10">
             Subscribe to our digital newsroom to receive official SK Naawan advisories directly via email and SMS notifications.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 w-full">
             <input type="email" placeholder="Enter your email address..." class="flex-1 px-8 py-4 bg-white border border-slate-200 rounded-2xl text-[12px] font-medium focus:ring-4 focus:ring-emerald-500/10 outline-none" />
             <button class="px-10 py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200">Subscribe Now</button>
          </div>
       </div>
       <div class="absolute -left-20 -top-20 w-64 h-64 bg-emerald-100/50 rounded-full blur-3xl"></div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'
import { 
  Bell as BellIcon, 
  ArrowRight as ArrowRightIcon, 
  Send as SendIcon,
  Info as InfoIcon
} from 'lucide-vue-next'

const router = useRouter()
const userStore = useUserStore()
const feed = ref([])
const isLoading = ref(true)
const error = ref(null)

// Fallback mock data in case API returns empty or fails
const fallbackFeed = [
  { id: 'mock-1', date: 'MAY 10, 2026', category: 'EVENT', title: 'Q2 Sports League Registration Deadline Extended', summary: 'Due to popular demand, we are extending the registration for the Inter-Barangay Sports League until May 15.' },
  { id: 'mock-2', date: 'MAY 08, 2026', category: 'GOVERNANCE', title: 'New Transparency Dashboard Goes Live', summary: 'The SK Naawan IMS Public Portal is now operational, providing citizens with real-time access to project expenditures.' },
  { id: 'mock-3', date: 'MAY 05, 2026', category: 'ENVIRONMENT', title: 'Tree Planting Drive: 500 Saplings Planted', summary: 'In partnership with the DENR, Naawan youth successfully planted 500 native saplings along the riverbanks.' },
  { id: 'mock-4', date: 'APR 28, 2026', category: 'HEALTH', title: 'Free Medical Mission for Youth Residents', summary: 'Join us this weekend for a specialized youth medical mission offering free dental checkups and vitamins.' },
  { id: 'mock-5', date: 'APR 20, 2026', category: 'TRAINING', title: 'Digital Literacy Workshop for Out-of-School Youth', summary: 'Empowering our youth with basic computer skills and online safety training at the SK Hub.' },
  { id: 'mock-6', date: 'APR 15, 2026', category: 'MEETING', title: 'Barangay SK Federation Quarterly Meeting', summary: 'Official recap of the federation meeting discussing the upcoming youth month festivities and project allocations.' }
]

const fetchAnnouncements = async () => {
  isLoading.value = true
  error.value = null
  try {
    const response = await fetch('http://127.0.0.1:5000/api/announcements', {
      headers: { 'Authorization': `Bearer ${userStore.token}` }
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    const items = data.data || []
    if (items.length > 0) {
      feed.value = items.map(a => ({
        id: a.id,
        date: new Date(a.date || a.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).toUpperCase(),
        category: (a.category || 'GENERAL').toUpperCase(),
        title: a.title,
        summary: a.summary
      }))
    } else {
      // Use fallback when DB is empty
      feed.value = fallbackFeed
    }
  } catch (err) {
    console.warn('API unavailable, using fallback data:', err.message)
    feed.value = fallbackFeed
  } finally {
    isLoading.value = false
  }
}

const viewDetails = (id) => {
  router.push(`/announcement/${id}`)
}

onMounted(fetchAnnouncements)
</script>

<style scoped>
.font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
.animate-fade-up { animation: fadeUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
@keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
</style>
