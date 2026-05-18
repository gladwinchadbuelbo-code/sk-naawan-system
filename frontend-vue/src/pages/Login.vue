<template>
  <!-- Full Landing Page -->
  <div class="min-h-screen flex flex-col font-sans bg-slate-50">

    <!-- ══════════════════════════════════════════════
         HERO SECTION — Split Layout
    ══════════════════════════════════════════════ -->
    <section class="relative min-h-screen flex items-center overflow-hidden">

      <!-- Background gradient + subtle pattern -->
      <div class="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#134E4A] to-[#064E3B]"></div>
      <!-- Decorative circles -->
      <div class="absolute -top-32 -left-32 w-[600px] h-[600px] bg-[#10B981]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"></div>
      <!-- Grid overlay -->
      <div class="absolute inset-0 opacity-5" style="background-image: linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px); background-size: 40px 40px;"></div>

      <div class="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        <!-- LEFT — Branding & value prop -->
        <div class="text-white space-y-8">
          <!-- Logo row -->
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-xl shadow-emerald-900/40 overflow-hidden">
              <img src="@/assets/logo.jpg" alt="SK Logo" class="w-full h-full object-cover" />
            </div>
            <div>
              <p class="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">Sangguniang Kabataan</p>
              <p class="text-sm font-medium text-white/70">Naawan, Misamis Oriental</p>
            </div>
          </div>

          <!-- Headline -->
          <div class="space-y-4">
            <h1 class="text-4xl lg:text-5xl font-extrabold leading-tight text-white">
              Advancing Youth Governance
              <span class="text-[#10B981]"> in Naawan.</span>
            </h1>
            <p class="text-lg text-white/70 max-w-lg leading-relaxed">
              A centralized platform for budget transparency, automated reporting, and youth-led activity management.
            </p>
          </div>

          <!-- Impact badges -->
          <div class="flex flex-wrap gap-3">
            <div class="flex items-center gap-2 bg-white/10 border border-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <CheckCircleIcon class="w-4 h-4 text-[#10B981]" />
              <span class="text-sm text-white/90 font-medium">12 Programs Conducted</span>
            </div>
            <div class="flex items-center gap-2 bg-white/10 border border-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <UsersIcon class="w-4 h-4 text-[#10B981]" />
              <span class="text-sm text-white/90 font-medium">850+ Youth Served</span>
            </div>
            <div class="flex items-center gap-2 bg-white/10 border border-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <ShieldCheckIcon class="w-4 h-4 text-[#10B981]" />
              <span class="text-sm text-white/90 font-medium">100% Documented</span>
            </div>
          </div>
        </div>

        <!-- RIGHT — Login Card (matches reference image) -->
        <div class="flex justify-center lg:justify-end">
          <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">

            <!-- Card header with logo -->
            <div class="flex flex-col items-center text-center mb-6">
              <div class="w-20 h-20 rounded-2xl bg-white flex items-center justify-center shadow-lg shadow-emerald-200 mb-4 overflow-hidden border border-slate-100">
                <img src="@/assets/logo.jpg" alt="SK Logo" class="w-full h-full object-cover" />
              </div>
              <h2 class="text-lg font-bold text-slate-900">Information Management System</h2>
              <p class="text-sm text-emerald-600 mt-1 font-medium">for the Sangguniang Kabataan of Naawan</p>
              <p class="text-xs text-slate-400">Activities, Budget Transparency, and Reporting</p>
            </div>

            <!-- Public transparency shortcut -->
            <div class="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-6 text-center">
              <p class="text-xs text-slate-500 mb-1">Looking for public information?</p>
              <button @click="goPublic" class="text-sm text-[#10B981] font-semibold hover:underline flex items-center gap-1 mx-auto">
                Visit Public Transparency Portal <ArrowRightIcon class="w-4 h-4" />
              </button>
            </div>

            <!-- Login Form -->
            <form @submit.prevent="handleLogin" class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-1.5">Username</label>
                <input v-model="username" type="text" placeholder="Enter your username" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-slate-700 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                <input v-model="password" type="password" placeholder="Enter your password" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-slate-700 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white" />
              </div>

              <!-- Demo role selector -->
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-1.5">Login As <span class="text-xs font-normal text-slate-400">(Demo)</span></label>
                <div class="relative">
                  <select v-model="selectedRole" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-slate-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none appearance-none bg-slate-50 focus:bg-white">
                    <option value="SK Chairperson">SK Chairperson</option>
                    <option value="SK Secretary">SK Secretary</option>
                    <option value="SK Treasurer">SK Treasurer</option>
                    <option value="Public Viewer">Public Viewer</option>
                  </select>
                  <ChevronDownIcon class="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <button type="submit" class="w-full bg-[#10B981] hover:bg-emerald-600 text-white font-bold py-3.5 rounded-xl text-sm transition-colors shadow-md shadow-emerald-200 mt-2">
                Log In
              </button>
            </form>

          </div>
        </div>

      </div>
    </section>

    <!-- ══════════════════════════════════════════════
         IMPACT STATS
    ══════════════════════════════════════════════ -->
    <section class="bg-white py-16 border-b border-gray-100">
      <div class="max-w-6xl mx-auto px-6">
        <h2 class="text-center text-2xl font-bold text-slate-800 mb-10">SK Naawan at a Glance</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="stat in stats" :key="stat.label" class="flex flex-col items-center text-center p-8 bg-slate-50 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
            <div class="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
              <component :is="stat.icon" class="w-7 h-7 text-[#10B981]" />
            </div>
            <h3 class="text-3xl font-extrabold text-slate-900">{{ stat.value }}</h3>
            <p class="text-sm font-semibold text-slate-600 mt-1">{{ stat.label }}</p>
            <p class="text-xs text-slate-400 mt-1">{{ stat.sub }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════
         HOW IT WORKS — Features Overview
    ══════════════════════════════════════════════ -->
    <section class="bg-slate-50 py-20">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center mb-12">
          <span class="inline-block bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-3">System Capabilities</span>
          <h2 class="text-3xl font-bold text-slate-900">How the SK IMS Works</h2>
          <p class="text-slate-500 mt-3 max-w-xl mx-auto text-sm">Everything the Sangguniang Kabataan needs to run effectively — in one place.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="feat in features" :key="feat.title" class="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
            <div :class="feat.bg" class="w-12 h-12 rounded-xl flex items-center justify-center mb-5">
              <component :is="feat.icon" class="w-6 h-6 text-white" />
            </div>
            <h3 class="font-bold text-slate-800 text-base mb-2">{{ feat.title }}</h3>
            <p class="text-sm text-slate-500 leading-relaxed">{{ feat.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════
         RECENT ACTIVITIES (Public Feed)
    ══════════════════════════════════════════════ -->
    <section class="bg-white py-16 border-t border-gray-100">
      <div class="max-w-6xl mx-auto px-6">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-2xl font-bold text-slate-900">Recent Activities</h2>
          <span class="text-xs text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full border border-gray-100">Public Feed</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="act in activities" :key="act.title" class="rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div :class="act.bg" class="h-36 flex items-center justify-center">
              <component :is="act.icon" class="w-12 h-12 text-white/80" />
            </div>
            <div class="p-5">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-bold text-[#10B981] uppercase tracking-wider">{{ act.category }}</span>
                <span class="text-xs text-slate-400">{{ act.date }}</span>
              </div>
              <h3 class="font-bold text-slate-800 text-sm">{{ act.title }}</h3>
              <p class="text-xs text-slate-500 mt-1 leading-relaxed">{{ act.summary }}</p>
              <div class="flex items-center gap-1.5 mt-3 text-xs text-slate-500">
                <UsersIcon class="w-3.5 h-3.5 text-[#10B981]" /> {{ act.participants }} participants
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════
         FOOTER
    ══════════════════════════════════════════════ -->
    <footer class="bg-[#0F172A] text-white">
      <div class="max-w-6xl mx-auto px-6 py-12">
        <div class="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          <div class="text-center md:text-left">
            <div class="flex items-center gap-3 justify-center md:justify-start mb-3">
              <div class="w-12 h-12 rounded-xl bg-white flex items-center justify-center overflow-hidden border border-slate-800">
                <img src="@/assets/logo.jpg" alt="SK Logo" class="w-full h-full object-cover" />
              </div>
              <div>
                <p class="font-bold text-base">SK Naawan IMS</p>
                <p class="text-xs text-gray-400">Integrated Digital Management System</p>
              </div>
            </div>
            <p class="text-xs text-gray-500 max-w-sm">Official Management System of the Sangguniang Kabataan of Naawan, Misamis Oriental.</p>
          </div>

          <div class="grid grid-cols-2 gap-8 text-sm">
            <div>
              <p class="font-semibold text-gray-300 mb-3 text-xs uppercase tracking-widest">Modules</p>
              <ul class="space-y-2 text-gray-500 text-xs">
                <li>Budget Transparency</li>
                <li>Activity Management</li>
                <li>Digital Attendance</li>
                <li>Automated Reports</li>
              </ul>
            </div>
            <div>
              <p class="font-semibold text-gray-300 mb-3 text-xs uppercase tracking-widest">Roles</p>
              <ul class="space-y-2 text-gray-500 text-xs">
                <li>SK Chairperson</li>
                <li>SK Secretary</li>
                <li>SK Treasurer</li>
                <li>Public Viewer</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="border-t border-gray-800 mt-10 pt-6 text-center text-xs text-gray-600">
          © 2026 Sangguniang Kabataan of Naawan, Misamis Oriental. All Rights Reserved.
        </div>
      </div>
    </footer>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import {
  CheckCircle as CheckCircleIcon,
  Users as UsersIcon,
  ShieldCheck as ShieldCheckIcon,
  ArrowRight as ArrowRightIcon,
  ChevronDown as ChevronDownIcon,
  FileText as FileTextIcon,
  Wallet as WalletIcon,
  CalendarCheck as CalendarCheckIcon,
  BarChart2 as BarChartIcon,
  Leaf as LeafIcon,
  Dumbbell as DumbbellIcon
} from 'lucide-vue-next'

const router = useRouter()
const userStore = useUserStore()

const username = ref('')
const password = ref('')
const selectedRole = ref('SK Chairperson')

const handleLogin = async () => {
  try {
    // For demo purposes, we allow the role selector to override if no credentials are provided
    // but we try to perform a real login first
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: username.value.includes('@') ? username.value : `${selectedRole.value.toLowerCase().replace(' ', '')}@sknaawan.gov.ph`,
        password: password.value || 'password123' // Default password for seed users
      })
    })

    if (response.ok) {
      const data = await response.json()
      userStore.setUser(data, data.token)
      console.log('Login successful:', data.role)
      router.push('/')
    } else {
      const errorData = await response.json()
      alert(errorData.message || 'Login failed')
    }
  } catch (error) {
    console.error('Login error:', error)
    alert('Failed to connect to the server. Please ensure the backend is running.')
  }
}

const goPublic = () => {
  userStore.setUser({ role: 'Public Viewer', full_name: 'Guest' }, null)
  router.push('/')
}

// Impact Stats
const stats = [
  { label: 'Activities Conducted', value: '12 Programs', sub: 'FY 2026', icon: CheckCircleIcon },
  { label: 'Total Youth Served',   value: '850+ Participants', sub: 'Across all barangays', icon: UsersIcon },
  { label: 'Transparency Rating',  value: '100% Documented', sub: 'All records digitized', icon: BarChartIcon }
]

// Features
const features = [
  {
    title: 'Automated Reporting',
    desc: 'Instant generation of Accomplishment and Liquidation reports for every approved SK activity — no manual paperwork.',
    icon: FileTextIcon,
    bg: 'bg-blue-500'
  },
  {
    title: 'Budget Tracking',
    desc: 'Real-time visibility of allocated and spent funds per SK category — Sports, Education, Environment, and more.',
    icon: WalletIcon,
    bg: 'bg-[#10B981]'
  },
  {
    title: 'Digital Attendance',
    desc: 'Paperless participant registration for all barangay-level events, with instant head-count and gender analytics.',
    icon: CalendarCheckIcon,
    bg: 'bg-[#047857]'
  }
]

// Public Activities Feed
const activities = [
  {
    title: 'Summer Sports Fest 2026',
    category: 'Sports & Health',
    date: 'May 15, 2026',
    summary: 'An inter-barangay sports tournament promoting camaraderie and physical fitness among SK youth.',
    participants: 250,
    icon: DumbbellIcon,
    bg: 'bg-gradient-to-br from-amber-400 to-red-500'
  },
  {
    title: 'Tree Planting Drive',
    category: 'Environment',
    date: 'April 28, 2026',
    summary: 'A coastal clean-up and mangrove planting activity to promote environmental stewardship.',
    participants: 180,
    icon: LeafIcon,
    bg: 'bg-gradient-to-br from-emerald-400 to-teal-600'
  },
  {
    title: 'Youth Leadership Summit',
    category: 'Youth Development',
    date: 'March 10, 2026',
    summary: 'A 2-day leadership training seminar for SK officers and youth leaders across all barangays.',
    participants: 120,
    icon: UsersIcon,
    bg: 'bg-gradient-to-br from-blue-500 to-indigo-600'
  }
]
</script>

<style scoped>
* { font-family: 'Inter', 'Segoe UI', sans-serif; }
</style>
