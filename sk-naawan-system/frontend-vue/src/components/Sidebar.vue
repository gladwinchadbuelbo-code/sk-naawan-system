<template>
  <div>
    <!-- Mobile overlay -->
    <div 
      v-if="isOpen" 
      class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-all duration-500"
      @click="$emit('close')"
    ></div>

    <!-- Sidebar -->
    <aside 
      class="fixed lg:sticky top-0 h-screen inset-y-0 left-0 z-50 w-72 bg-[#0F172A] text-white transform transition-all duration-500 ease-in-out lg:translate-x-0 flex flex-col shadow-2xl shadow-emerald-900/20"
      :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <!-- Logo Section -->
      <div class="h-24 flex items-center gap-4 px-8 shrink-0 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
        <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/10 rotate-3 group-hover:rotate-6 transition-transform overflow-hidden">
           <img src="@/assets/logo.jpg" alt="Logo" class="w-full h-full object-cover" />
        </div>
        <div class="flex flex-col">
          <span class="font-jakarta font-black text-[17px] tracking-tight leading-none">SK Naawan</span>
          <span class="text-[9px] font-bold text-emerald-500 uppercase tracking-[0.2em] mt-1.5">IMS Dashboard</span>
        </div>
        <button class="lg:hidden ml-auto p-2 text-slate-400 hover:text-white bg-white/5 rounded-xl transition-all" @click="$emit('close')">
          <XIcon class="w-5 h-5" />
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto py-10 px-6 space-y-2 custom-scrollbar">
        <div class="px-4 mb-6">
           <p class="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Main Menu</p>
        </div>
        <router-link 
          v-for="item in navigationItems" 
          :key="item.name"
          :to="item.path"
          class="nav-item group"
          :class="{ 'active': isRouteActive(item.path) }"
          @click="$emit('close')"
        >
          <component :is="item.icon" class="nav-item-icon" />
          <span class="uppercase tracking-widest text-[11px] font-black">{{ item.name }}</span>
          
          <!-- Active Indicator -->
          <div v-if="isRouteActive(item.path)" class="absolute right-4 w-1.5 h-1.5 rounded-full bg-white shadow-sm"></div>
          
          <!-- Hover Background Sparkle -->
          <div class="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </router-link>
      </nav>

      <!-- User Profile & Footer -->
      <div class="p-6 shrink-0 mt-auto bg-gradient-to-t from-white/5 to-transparent border-t border-white/5">
        <div class="bg-white/5 rounded-[2rem] p-5 flex flex-col gap-4 border border-white/5 backdrop-blur-md">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-lg font-black shrink-0 text-white shadow-xl shadow-emerald-900/50">
              {{ userStore.name.charAt(0) }}
            </div>
            <div class="flex flex-col overflow-hidden">
              <span class="text-sm font-black text-white truncate tracking-tight">{{ userStore.name }}</span>
              <span class="text-[9px] uppercase tracking-[0.2em] text-emerald-500 font-black mt-0.5 truncate">{{ userStore.role }}</span>
            </div>
          </div>
          
          <button @click="handleLogout" class="flex items-center justify-center gap-3 px-4 py-3.5 w-full text-[11px] font-black uppercase tracking-widest text-white bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-2xl transition-all duration-300 group shadow-inner">
            <LogOutIcon class="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Logout System
          </button>
        </div>
        
        <p class="text-[9px] text-slate-600 font-bold uppercase text-center mt-6 tracking-[0.2em]">v2.0 &bull; SK Naawan 2026</p>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../stores/user'
import { 
  LayoutDashboard, 
  CheckSquare, 
  Wallet, 
  Calendar, 
  FileText, 
  Archive, 
  Settings,
  LogOut as LogOutIcon,
  Bell as BellIcon,
  X as XIcon
} from 'lucide-vue-next'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

defineEmits(['close'])

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const allNavigationItems = [
  { 
    name: 'Dashboard', 
    path: '/', 
    icon: LayoutDashboard, 
    roles: ['SK Chairperson', 'SK Treasurer', 'SK Secretary', 'Public Viewer'] 
  },
  { 
    name: 'Approvals', 
    path: '/approvals', 
    icon: CheckSquare, 
    roles: ['SK Chairperson'] 
  },
  { 
    name: (userStore.role === 'Public Viewer' ? 'Budget Transparency' : 'Budget'), 
    path: '/budget', 
    icon: Wallet, 
    roles: ['SK Chairperson', 'SK Treasurer', 'SK Secretary', 'Public Viewer'] 
  },
  { 
    name: (userStore.role === 'Public Viewer' ? 'Events & Activities' : 'Events'), 
    path: '/events', 
    icon: Calendar, 
    roles: ['SK Chairperson', 'SK Secretary', 'SK Treasurer', 'Public Viewer'] 
  },
  { 
    name: (userStore.role === 'Public Viewer' ? 'Reports & Documents' : 'Reports'), 
    path: '/reports', 
    icon: FileText, 
    roles: ['SK Chairperson', 'SK Secretary', 'SK Treasurer', 'Public Viewer'] 
  },
  { 
    name: 'Announcements', 
    path: '/announcements', 
    icon: BellIcon, 
    roles: ['Public Viewer', 'SK Secretary'] 
  },
  { 
    name: 'Archives', 
    path: '/archives', 
    icon: Archive, 
    roles: ['SK Chairperson', 'SK Secretary'] 
  },
  { 
    name: 'Settings', 
    path: '/settings', 
    icon: Settings, 
    roles: ['SK Chairperson', 'SK Treasurer', 'SK Secretary'] 
  },
]

const navigationItems = computed(() => {
  return allNavigationItems.filter(item => item.roles.includes(userStore.role))
})

const isRouteActive = (path) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.1);
}
</style>
