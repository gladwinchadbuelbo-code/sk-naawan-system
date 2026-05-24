<template>
  <div class="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden">
    <!-- Sidebar -->
    <Sidebar :isOpen="isSidebarOpen" @close="isSidebarOpen = false" />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden relative">
      <!-- Top Navbar -->
      <header class="bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-10 h-20 shrink-0 z-30 sticky top-0">
        <div class="flex items-center gap-6">
          <button @click="isSidebarOpen = true" class="lg:hidden p-3 text-slate-500 hover:text-slate-800 bg-slate-50 rounded-xl transition-all">
            <MenuIcon class="w-6 h-6" />
          </button>
          <div class="hidden sm:flex flex-col">
             <span class="font-jakarta font-black text-slate-900 tracking-tight text-sm uppercase tracking-widest">SK Naawan Integrated Management System</span>
             <p class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5">Government Transparency & Operations Portal</p>
          </div>
        </div>

        <div class="flex items-center gap-6">
          <!-- Role Switcher (Enhanced) -->
          <div class="relative group">
            <div 
              class="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2.5 cursor-pointer hover:bg-slate-100 transition-all duration-300 shadow-sm"
              @click="roleSwitcherOpen = !roleSwitcherOpen"
            >
              <div :class="roleColor" class="w-2.5 h-2.5 rounded-full shadow-inner animate-pulse"></div>
              <span class="text-[11px] font-black text-slate-700 uppercase tracking-widest">{{ userStore.role }}</span>
              <ChevronDownIcon class="w-4 h-4 text-slate-400 group-hover:rotate-180 transition-transform duration-500" />
            </div>

            <!-- Dropdown (Modern) -->
            <Transition name="dropdown">
              <div v-if="roleSwitcherOpen" class="absolute right-0 mt-4 w-72 bg-white rounded-[2rem] shadow-2xl border border-slate-100 z-50 overflow-hidden p-3">
                <div class="px-5 py-3 mb-2">
                  <p class="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Switch Management Context</p>
                </div>
                <div 
                  v-for="r in roles" 
                  :key="r.value" 
                  @click="switchRole(r.value)" 
                  class="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 rounded-2xl cursor-pointer transition-all duration-300 group/item"
                >
                  <div :class="r.color" class="w-3 h-3 rounded-full shadow-sm group-hover/item:scale-125 transition-transform"></div>
                  <div>
                    <p class="text-[12px] font-black text-slate-800 uppercase tracking-widest">{{ r.label }}</p>
                    <p class="text-[10px] text-slate-400 font-bold uppercase mt-0.5 tracking-tighter">{{ r.desc }}</p>
                  </div>
                  <div v-if="userStore.role === r.value" class="ml-auto w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30">
                     <CheckIcon class="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
              </div>
            </Transition>
          </div>

          <!-- User Badge (High Contrast) -->
          <div class="flex items-center gap-4 pl-6 border-l border-slate-100">
            <div class="flex flex-col text-right hidden sm:flex">
              <p class="text-[12px] font-black text-slate-900 uppercase tracking-widest leading-none">{{ userStore.name }}</p>
              <p class="text-[10px] text-emerald-600 font-black uppercase tracking-[0.2em] mt-1.5">Official Account</p>
            </div>
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#1E293B] flex items-center justify-center text-white text-sm font-black shadow-lg shadow-slate-200 ring-4 ring-white">
              {{ userStore.name.charAt(0) }}
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto bg-[#F8FAFC] custom-scrollbar">
        <router-view v-slot="{ Component }">
           <Transition name="fade-slide" mode="out-in">
              <component :is="Component" />
           </Transition>
        </router-view>
      </main>

      <!-- Global Background Elements -->
      <div class="absolute -z-10 top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div class="absolute -z-10 bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>
    </div>

    <!-- Backdrop for role switcher -->
    <div v-if="roleSwitcherOpen" class="fixed inset-0 z-40" @click="roleSwitcherOpen = false"></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Menu as MenuIcon, ChevronDown as ChevronDownIcon, Check as CheckIcon } from 'lucide-vue-next'
import Sidebar from '../components/Sidebar.vue'
import { useUserStore } from '../stores/user'

const isSidebarOpen = ref(false)
const roleSwitcherOpen = ref(false)
const router = useRouter()
const userStore = useUserStore()

const roles = [
  { value: 'SK Chairperson', label: 'Chairperson', desc: 'Review & Oversight', color: 'bg-blue-500' },
  { value: 'SK Secretary', label: 'Secretary', desc: 'Events & Documentation', color: 'bg-emerald-500' },
  { value: 'SK Treasurer', label: 'Treasurer', desc: 'Financial Management', color: 'bg-amber-500' },
  { value: 'Public Viewer', label: 'Portal Guest', desc: 'Transparency View', color: 'bg-slate-400' }
]

const roleColor = computed(() => {
  const map = {
    'SK Chairperson': 'bg-blue-500',
    'SK Secretary': 'bg-emerald-500',
    'SK Treasurer': 'bg-amber-500',
    'Public Viewer': 'bg-slate-400'
  }
  return map[userStore.role] || 'bg-slate-400'
})

const switchRole = (role) => {
  userStore.setRole(role)
  roleSwitcherOpen.value = false
  router.push('/')
}
</script>

<style scoped>
.dropdown-enter-active, .dropdown-leave-active { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
.dropdown-enter-from { opacity: 0; transform: translateY(-10px) scale(0.95); }
.dropdown-leave-to { opacity: 0; transform: translateY(-10px) scale(0.95); }

.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.3s ease; }
.fade-slide-enter-from { opacity: 0; transform: translateX(10px); }
.fade-slide-leave-to { opacity: 0; transform: translateX(-10px); }

.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
</style>
