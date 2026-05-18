<template>
  <div class="max-w-[1440px] mx-auto pb-12 p-8 font-inter bg-[#F8FAFC] min-h-screen animate-fade-up">
    
    <!-- Navigation & Header -->
    <div class="mb-10">
      <button @click="$router.push('/events')" class="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 hover:bg-slate-50 transition-all uppercase tracking-widest shadow-sm mb-8">
        <ArrowLeftIcon class="w-4 h-4" /> Back to Activities
      </button>

      <div class="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div class="flex items-center gap-6">
          <div class="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner">
            <UsersIcon class="w-8 h-8" />
          </div>
          <div>
            <h1 class="text-3xl font-black text-slate-900 tracking-tight leading-none">{{ eventDetails.title }}</h1>
            <div class="flex flex-wrap items-center gap-y-2 gap-x-6 mt-3">
              <div class="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                <CalendarIcon class="w-3.5 h-3.5 text-emerald-500" /> {{ eventDetails.date }}
              </div>
              <div class="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                <MapPinIcon class="w-3.5 h-3.5 text-emerald-500" /> {{ eventDetails.venue }}
              </div>
              <div class="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                <UserIcon class="w-3.5 h-3.5 text-emerald-500" /> {{ eventDetails.officials }}
              </div>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-3">
           <button @click="isAddModalOpen = true" class="flex items-center gap-2 px-6 py-3 bg-[#059669] hover:bg-[#047857] text-white rounded-xl text-[11px] font-black shadow-lg shadow-emerald-100 transition-all uppercase tracking-widest">
              <PlusIcon class="w-4 h-4" /> Add Participant
           </button>
           <button @click="showQRPlaceholder" class="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-black text-white rounded-xl text-[11px] font-black transition-all uppercase tracking-widest">
              <QrCodeIcon class="w-4 h-4" /> QR Attendance
           </button>
        </div>
      </div>
    </div>

    <!-- Attendance Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
      <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Registered</p>
        <p class="text-3xl font-black text-slate-900">{{ participants.length }}</p>
      </div>
      <div class="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 shadow-sm">
        <p class="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1 text-opacity-70">Present</p>
        <p class="text-3xl font-black text-emerald-600">{{ countByStatus('Present') }}</p>
      </div>
      <div class="bg-amber-50 p-6 rounded-2xl border border-amber-100 shadow-sm">
        <p class="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1 text-opacity-70">Late</p>
        <p class="text-3xl font-black text-amber-600">{{ countByStatus('Late') }}</p>
      </div>
      <div class="bg-red-50 p-6 rounded-2xl border border-red-100 shadow-sm">
        <p class="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1 text-opacity-70">Absent</p>
        <p class="text-3xl font-black text-red-600">{{ countByStatus('Absent') }}</p>
      </div>
    </div>

    <!-- Attendance Log Table -->
    <div class="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
      <div class="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h3 class="font-black text-slate-900 text-lg tracking-tight uppercase">Attendance Log</h3>
           <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Manual entry & digital tracking</p>
        </div>
        <div class="relative group w-full md:w-80">
          <SearchIcon class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input v-model="searchQuery" type="text" placeholder="Search participant name..." class="w-full bg-slate-50 border border-slate-100 rounded-xl pl-12 pr-4 py-3 text-[12px] font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
              <th class="px-8 py-5">Participant Name</th>
              <th class="px-8 py-5">Time In</th>
              <th class="px-8 py-5">Attendance Status</th>
              <th class="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-if="filteredParticipants.length === 0">
               <td colspan="4" class="px-8 py-20 text-center">
                  <p class="text-sm font-bold text-slate-400 uppercase tracking-widest">No participants found</p>
               </td>
            </tr>
            <tr v-for="p in filteredParticipants" :key="p.id" class="group hover:bg-slate-50/50 transition-all">
              <td class="px-8 py-6">
                <span class="text-sm font-black text-slate-900 tracking-tight">{{ p.name }}</span>
              </td>
              <td class="px-8 py-6">
                <span class="text-[11px] font-bold text-slate-500 uppercase">{{ p.timeIn || '---' }}</span>
              </td>
              <td class="px-8 py-6">
                <select @change="updateStatus(p, $event.target.value)" :value="p.status" :class="getStatusClass(p.status)" class="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border-none outline-none focus:ring-2 focus:ring-emerald-500 transition-all">
                  <option value="Present">Present</option>
                  <option value="Late">Late</option>
                  <option value="Absent">Absent</option>
                </select>
              </td>
              <td class="px-8 py-6 text-right">
                 <button @click="removeParticipant(p)" class="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                    <Trash2Icon class="w-4.5 h-4.5" />
                 </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ADD PARTICIPANT MODAL -->
    <div v-if="isAddModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
       <div class="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-fade-up">
          <div class="p-8 border-b border-slate-100 flex items-center justify-between">
             <h3 class="text-xl font-black text-slate-900 tracking-tight uppercase">Add Participant</h3>
             <button @click="isAddModalOpen = false" class="text-slate-400 hover:text-slate-900"><XIcon class="w-6 h-6" /></button>
          </div>
          <div class="p-8 space-y-6">
             <div>
                <label class="text-[11px] font-black uppercase tracking-widest text-slate-900 mb-2 block">Full Name *</label>
                <input v-model="newParticipant.name" type="text" placeholder="Enter name..." class="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
             </div>
             <div>
                <label class="text-[11px] font-black uppercase tracking-widest text-slate-900 mb-2 block">Status</label>
                <select v-model="newParticipant.status" class="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 text-sm font-black uppercase tracking-widest outline-none transition-all">
                   <option value="Present">Present</option>
                   <option value="Late">Late</option>
                   <option value="Absent">Absent</option>
                </select>
             </div>
          </div>
          <div class="p-8 bg-slate-50 flex flex-col gap-3">
             <button @click="addParticipant" class="w-full py-4 bg-[#059669] hover:bg-[#047857] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-emerald-100 transition-all">Record Participant</button>
             <button @click="isAddModalOpen = false" class="w-full py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">Cancel</button>
          </div>
       </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { 
  ArrowLeft as ArrowLeftIcon, Users as UsersIcon, Calendar as CalendarIcon,
  MapPin as MapPinIcon, User as UserIcon, Plus as PlusIcon, QrCode as QrCodeIcon,
  Search as SearchIcon, Trash2 as Trash2Icon, X as XIcon
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// State
const eventDetails = ref({
  id: route.params.id,
  title: 'Loading...',
  date: '...',
  venue: '...',
  officials: '...'
})

const searchQuery = ref('')
const isAddModalOpen = ref(false)
const newParticipant = ref({ name: '', status: 'Present' })
const participants = ref([])

const fetchAttendance = async () => {
  try {
    const response = await fetch(`http://127.0.0.1:5000/api/attendance/event/${route.params.id}`, {
      headers: { 'Authorization': `Bearer ${userStore.token}` }
    })
    const data = await response.json()
    participants.value = data.map(p => ({
      id: p.id,
      name: p.participant_name,
      timeIn: new Date(p.time_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Present' // Defaulting to present for now
    }))
  } catch (error) {
    console.error('Error fetching attendance:', error)
  }
}

onMounted(() => {
  fetchAttendance()
  // Mock event detail lookup - normally you'd fetch this too
  eventDetails.value.title = "Youth Activity" 
})

const filteredParticipants = computed(() => {
  return participants.value.filter(p => p.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
})

const countByStatus = (status) => {
  return participants.value.filter(p => p.status === status).length
}

const getStatusClass = (status) => {
  const map = {
    'Present': 'bg-emerald-50 text-emerald-600',
    'Late': 'bg-amber-50 text-amber-600',
    'Absent': 'bg-red-50 text-red-600'
  }
  return map[status] || 'bg-slate-50 text-slate-500'
}

const addParticipant = async () => {
  if (!newParticipant.value.name) return
  
  try {
    const response = await fetch('http://127.0.0.1:5000/api/attendance', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userStore.token}` 
      },
      body: JSON.stringify({
        event_id: route.params.id,
        participant_name: newParticipant.value.name,
        qr_code_used: false
      })
    })
    
    if (response.ok) {
       await fetchAttendance() // Refresh list
       newParticipant.value = { name: '', status: 'Present' }
       isAddModalOpen.value = false
    }
  } catch (error) {
    alert('Failed to record participant: ' + error.message)
  }
}

const updateStatus = (p, status) => {
  p.status = status
}

const removeParticipant = async (p) => {
  if (confirm(`Remove ${p.name} from attendance?`)) {
    try {
      await fetch(`http://127.0.0.1:5000/api/attendance/${p.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${userStore.token}` }
      })
      participants.value = participants.value.filter(item => item.id !== p.id)
    } catch (error) {
      alert('Failed to remove: ' + error.message)
    }
  }
}

const showQRPlaceholder = () => {
  alert('QR Scanner Placeholder: This would activate the camera for digital QR attendance tracking.')
}
</script>

<style scoped>
.animate-fade-up { animation: fadeUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>
