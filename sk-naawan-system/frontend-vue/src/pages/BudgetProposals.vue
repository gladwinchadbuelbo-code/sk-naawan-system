<template>
  <div class="max-w-[1440px] mx-auto pb-12 p-10 font-inter bg-[#F8FAFC] animate-fade-up">
    
    <!-- Navigation -->
    <div class="mb-10">
      <button @click="$router.push('/budget')" class="btn-secondary !py-2.5 !px-5 group">
        <ArrowLeftIcon class="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Treasury
      </button>
    </div>

    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
      <div>
        <h1 class="text-4xl font-black text-slate-900 tracking-tight">Financial Proposals</h1>
        <p class="text-slate-500 text-sm font-medium mt-1">Track and manage your submitted budget allocation requests</p>
      </div>
      <button @click="$router.push('/create-budget-proposal')" class="btn-primary !px-10 !py-4 shadow-emerald-100">
        <FilePlusIcon class="w-4 h-4" /> New Budget Proposal
      </button>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
      <div v-for="stat in stats" :key="stat.label" class="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-all duration-300">
        <div>
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{{ stat.label }}</p>
          <p class="text-3xl font-black text-slate-900 font-jakarta leading-none">{{ stat.value }}</p>
        </div>
        <div :class="stat.iconBg" class="w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:bg-slate-900 group-hover:text-white">
          <component :is="stat.icon" :class="stat.iconColor" class="w-7 h-7 group-hover:text-white transition-colors" />
        </div>
      </div>
    </div>

    <!-- Main Content: Empty State -->
    <div class="sk-table-container p-32 flex flex-col items-center justify-center text-center group overflow-hidden relative">
      <div class="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-8 border border-slate-100 shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
        <FileTextIcon class="w-12 h-12 text-slate-200" />
      </div>
      <h2 class="text-2xl font-black text-slate-900 tracking-tight uppercase">No Proposals Found</h2>
      <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-3 mb-12">Your proposal archive is currently empty</p>
      
      <button @click="$router.push('/create-budget-proposal')" class="btn-primary !px-12 !py-4 shadow-emerald-100 relative z-10">
        <PlusIcon class="w-5 h-5" /> Initialize First Proposal
      </button>

      <!-- Ambient Background Decoration -->
      <div class="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-50 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
    </div>

  </div>
</template>

<script setup>
import { 
  ArrowLeft as ArrowLeftIcon, FileText as FileTextIcon, Clock as ClockIcon, 
  CheckCircle as CheckCircleIcon, XCircle as XCircleIcon, Filter as FilterIcon,
  PlusCircle as FilePlusIcon, Plus as PlusIcon
} from 'lucide-vue-next'

const stats = [
  { label: 'Total Dossiers', value: '0', icon: FileTextIcon, iconBg: 'bg-slate-50', iconColor: 'text-slate-400' },
  { label: 'Pending Review', value: '0', icon: ClockIcon, iconBg: 'bg-amber-50', iconColor: 'text-amber-500' },
  { label: 'Officially Approved', value: '0', icon: CheckCircleIcon, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-500' },
  { label: 'Returned Records', value: '0', icon: XCircleIcon, iconBg: 'bg-red-50', iconColor: 'text-red-500' }
]
</script>

<style scoped>
.font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
</style>
