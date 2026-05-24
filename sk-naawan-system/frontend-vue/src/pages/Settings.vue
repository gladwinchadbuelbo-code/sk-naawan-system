<template>
  <div class="space-y-6 max-w-7xl mx-auto pb-12 p-8">
    
    <!-- Header -->
    <div class="flex flex-col gap-1">
      <h1 class="text-3xl font-bold text-slate-900">Settings</h1>
      <p class="text-slate-500 text-sm mt-1">Manage your profile, preferences, and system configuration</p>
    </div>

    <!-- Tabs Container -->
    <div class="flex items-center gap-2 border-b border-gray-100 mt-6 pb-2">
      <button 
        @click="activeTab = 'profile'"
        :class="activeTab === 'profile' ? 'bg-white shadow-sm border border-gray-100 text-slate-900' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 border border-transparent'"
        class="px-8 py-3 rounded-t-xl text-sm font-semibold transition-all flex items-center gap-2"
      >
        <UserIcon class="w-4 h-4" /> Profile
      </button>
      <button 
        @click="activeTab = 'organization'"
        :class="activeTab === 'organization' ? 'bg-white shadow-sm border border-gray-100 text-slate-900' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 border border-transparent'"
        class="px-8 py-3 rounded-t-xl text-sm font-semibold transition-all flex items-center gap-2"
      >
        <BuildingIcon class="w-4 h-4" /> Organization
      </button>
      <button 
        @click="activeTab = 'notifications'"
        :class="activeTab === 'notifications' ? 'bg-white shadow-sm border border-gray-100 text-slate-900' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 border border-transparent'"
        class="px-8 py-3 rounded-t-xl text-sm font-semibold transition-all flex items-center gap-2"
      >
        <BellIcon class="w-4 h-4" /> Notifications
      </button>
      <button 
        @click="activeTab = 'data'"
        :class="activeTab === 'data' ? 'bg-white shadow-sm border border-gray-100 text-slate-900' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 border border-transparent'"
        class="px-8 py-3 rounded-t-xl text-sm font-semibold transition-all flex items-center gap-2"
      >
        <DatabaseIcon class="w-4 h-4" /> Data Management
      </button>
    </div>

    <!-- Content Area -->
    <div class="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
      
      <!-- Profile Tab -->
      <template v-if="activeTab === 'profile'">
        
        <!-- Personal Information -->
        <div class="mb-10">
          <h3 class="text-base font-semibold text-slate-800 mb-6">Personal Information</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
              <input type="text" v-model="profile.name" class="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-slate-700 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-colors" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
              <input type="email" v-model="profile.email" class="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-slate-700 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-colors" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Position</label>
              <input type="text" v-model="profile.position" class="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-slate-700 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-colors" />
            </div>
          </div>
        </div>

        <hr class="border-gray-100 mb-10" />

        <!-- Change Password -->
        <div class="mb-8">
          <h3 class="text-base font-semibold text-slate-800 mb-6">Change Password</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
              <input type="password" class="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-colors" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">New Password</label>
              <input type="password" class="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-colors" />
            </div>
          </div>
        </div>

        <div class="flex justify-end pt-4">
          <button @click="saveChanges" class="bg-[#10B981] hover:bg-emerald-600 text-white px-8 py-3 rounded-xl text-sm font-medium shadow-sm transition-colors">
            Save Changes
          </button>
        </div>

      </template>

      <!-- Other Tabs -->
      <template v-else>
        <div class="py-20 flex flex-col items-center justify-center text-center">
          <h3 class="text-lg font-semibold text-slate-800">Under Construction</h3>
          <p class="text-slate-500 text-sm mt-2">This settings page will be available soon.</p>
        </div>
      </template>

    </div>

    <!-- Success Toast Notification -->
    <div v-if="showToast" class="fixed bottom-6 right-6 z-50 animate-fade-in-up">
      <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-4 flex items-center gap-3">
        <div class="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
          <CheckCircleIcon class="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h4 class="text-sm font-bold text-slate-800">Settings Saved!</h4>
          <p class="text-xs text-slate-500 mt-0.5">Your profile preferences have been updated.</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { 
  User as UserIcon,
  Building as BuildingIcon,
  Bell as BellIcon,
  Database as DatabaseIcon,
  CheckCircle as CheckCircleIcon
} from 'lucide-vue-next'

const activeTab = ref('profile')
const showToast = ref(false)

const profile = ref({
  name: 'SK Secretary',
  email: 'sk.official@barangay.gov.ph',
  position: 'SK Secretary'
})

const saveChanges = () => {
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
