<template>
  <div class="min-h-screen bg-[#0F172A] flex items-center justify-center p-6 relative overflow-hidden">
    <!-- Ambient Background Effects -->
    <div class="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-emerald-600/20 rounded-full blur-[120px] pointer-events-none"></div>
    <div class="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>

    <div class="max-w-4xl w-full bg-white/10 backdrop-blur-2xl rounded-[3rem] border border-white/10 shadow-2xl p-8 md:p-12 z-10 grid md:grid-cols-2 gap-12 items-center">
      
      <!-- Left side: Branding -->
      <div class="flex flex-col items-start gap-6">
        <div class="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-lg shadow-emerald-500/20 rotate-3 overflow-hidden">
          <img src="@/assets/logo.jpg" alt="Logo" class="w-full h-full object-cover" />
        </div>
        <div>
          <h1 class="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-2">
            SK Naawan <br />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">IMS Portal</span>
          </h1>
          <p class="text-slate-400 font-medium text-sm md:text-base leading-relaxed max-w-sm mt-4">
            Integrated Management System for Government Transparency and Operations. Select your role to access the dashboard.
          </p>
        </div>
      </div>

      <!-- Right side: Role Selection -->
      <div class="bg-white/5 rounded-[2rem] p-6 border border-white/10 shadow-inner">
        <h2 class="text-xs font-black text-slate-300 uppercase tracking-[0.2em] mb-6 pl-2">Select User Role</h2>
        
        <div class="space-y-3">
          <button 
            v-for="role in roles" 
            :key="role.value"
            @click="handleLogin(role.value)"
            class="w-full group flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all duration-300 relative overflow-hidden"
          >
            <div class="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-300" :class="role.gradient"></div>
            
            <div :class="role.color" class="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shrink-0">
              <component :is="role.icon" class="w-6 h-6 text-white" />
            </div>
            
            <div class="text-left flex-1">
              <p class="text-sm font-black text-white uppercase tracking-widest">{{ role.label }}</p>
              <p class="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-tighter">{{ role.desc }}</p>
            </div>
            
            <div class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-4 transition-all duration-300">
              <ChevronRightIcon class="w-4 h-4 text-white" />
            </div>
          </button>
        </div>
      </div>

    </div>
    
    <div class="absolute bottom-6 text-center w-full text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
      v2.0 &bull; SK Naawan 2026 &bull; Secure Access
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { 
  Shield as ShieldIcon, 
  PenTool as PenToolIcon, 
  Briefcase as BriefcaseIcon, 
  Eye as EyeIcon,
  ChevronRight as ChevronRightIcon
} from 'lucide-vue-next'

const router = useRouter()
const userStore = useUserStore()

const roles = [
  { 
    value: 'SK Chairperson', 
    label: 'Chairperson', 
    desc: 'Full Access & Approvals', 
    color: 'bg-blue-500',
    gradient: 'from-blue-500 to-transparent',
    icon: ShieldIcon 
  },
  { 
    value: 'SK Secretary', 
    label: 'Secretary', 
    desc: 'Records & Events', 
    color: 'bg-emerald-500',
    gradient: 'from-emerald-500 to-transparent',
    icon: PenToolIcon 
  },
  { 
    value: 'SK Treasurer', 
    label: 'Treasurer', 
    desc: 'Financial Control', 
    color: 'bg-amber-500',
    gradient: 'from-amber-500 to-transparent',
    icon: BriefcaseIcon 
  },
  { 
    value: 'Public Viewer', 
    label: 'Public Viewer', 
    desc: 'Transparency Portal', 
    color: 'bg-slate-500',
    gradient: 'from-slate-500 to-transparent',
    icon: EyeIcon 
  }
]

const handleLogin = (role) => {
  userStore.setRole(role)
  router.push('/')
}
</script>

<style scoped>
/* Scoped styles if needed */
</style>
