<template>
  <PublicEvents v-if="userStore.role === 'Public Viewer'" />
  <div v-else class="max-w-[1440px] mx-auto pb-12 p-8 font-inter bg-[#F8FAFC] min-h-screen">

    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
      <div>
        <h1 class="text-4xl font-black text-slate-900 tracking-tight">Event & Program Management</h1>
        <p class="text-slate-500 text-sm font-medium mt-1">Plan, organize, and monitor SK activities with precision</p>
      </div>
      <div class="flex items-center gap-3">
        <template v-if="userStore.role === 'SK Secretary'">
          <button @click="$router.push('/proposals')" class="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl text-[10px] font-black shadow-sm hover:bg-slate-50 transition-all uppercase tracking-widest">
            <FileTextIcon class="w-4 h-4" /> Proposals
          </button>
          <button @click="openCreateModal" class="flex items-center gap-2 px-6 py-3 bg-[#059669] hover:bg-[#047857] text-white rounded-2xl text-[10px] font-black shadow-lg shadow-emerald-200 transition-all uppercase tracking-widest">
            <PlusIcon class="w-4 h-4" /> Add Event
          </button>
        </template>
        <template v-else-if="userStore.role === 'SK Chairperson'">
           <button @click="$router.push('/approvals')" class="flex items-center gap-2 px-6 py-3 bg-[#10B981] hover:bg-[#059669] text-white rounded-2xl text-[11px] font-black shadow-lg transition-all uppercase tracking-widest">
            <ClockIcon class="w-4 h-4" /> Review Pending Proposals
          </button>
        </template>
      </div>
    </div>

    <!-- Quick Actions Row (Secretary Only) -->
    <div v-if="userStore.role === 'SK Secretary'" class="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 mb-10">
      <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 ml-1">Quick Strategic Actions</h4>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <button @click="openCreateModal" class="flex items-center gap-5 p-5 bg-[#ECFDF5] hover:bg-[#D1FAE5] rounded-[1.5rem] border border-emerald-100 transition-all group overflow-hidden relative">
          <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm group-hover:scale-110 transition-transform z-10">
            <PlusIcon class="w-6 h-6" />
          </div>
          <div class="text-left z-10">
            <p class="text-[12px] font-black text-slate-900 uppercase tracking-widest leading-none">Create Event</p>
            <p class="text-[10px] font-bold text-emerald-600/70 mt-1 uppercase">Plan New Activity</p>
          </div>
          <div class="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-200/20 rounded-full group-hover:scale-150 transition-transform"></div>
        </button>
        
        <button @click="$router.push('/proposals')" class="flex items-center gap-5 p-5 bg-slate-50 hover:bg-slate-100 rounded-[1.5rem] border border-slate-100 transition-all group overflow-hidden relative">
          <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-500 shadow-sm group-hover:scale-110 transition-transform z-10">
            <FileTextIcon class="w-6 h-6" />
          </div>
          <div class="text-left z-10">
            <p class="text-[12px] font-black text-slate-900 uppercase tracking-widest leading-none">My Proposals</p>
            <p class="text-[10px] font-bold text-slate-400 mt-1 uppercase">{{ events.filter(e => e.status === 'Pending').length }} Pending Approval</p>
          </div>
          <div class="absolute -right-4 -bottom-4 w-24 h-24 bg-slate-200/20 rounded-full group-hover:scale-150 transition-transform"></div>
        </button>

        <button @click="openAttendancePanel" class="flex items-center gap-5 p-5 bg-slate-50 hover:bg-slate-100 rounded-[1.5rem] border border-slate-100 transition-all group overflow-hidden relative">
          <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-500 shadow-sm group-hover:scale-110 transition-transform z-10">
            <UsersIcon class="w-6 h-6" />
          </div>
          <div class="text-left z-10">
            <p class="text-[12px] font-black text-slate-900 uppercase tracking-widest leading-none">Attendance</p>
            <p class="text-[10px] font-bold text-slate-400 mt-1 uppercase">{{ events.filter(e => e.status === 'Approved').length }} Active Events</p>
          </div>
          <div class="absolute -right-4 -bottom-4 w-24 h-24 bg-slate-200/20 rounded-full group-hover:scale-150 transition-transform"></div>
        </button>

        <button @click="isAIPanelOpen = true" class="flex items-center gap-5 p-5 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 rounded-[1.5rem] border border-indigo-100 transition-all group overflow-hidden relative">
          <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-500 shadow-sm group-hover:scale-110 transition-transform z-10">
            <SparklesIcon class="w-6 h-6" />
          </div>
          <div class="text-left z-10">
            <p class="text-[12px] font-black text-slate-900 uppercase tracking-widest leading-none">AI Insights</p>
            <p class="text-[10px] font-bold text-indigo-400 mt-1 uppercase">Smart Recommendations</p>
          </div>
          <div class="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-200/20 rounded-full group-hover:scale-150 transition-transform"></div>
        </button>

        <button @click="generateReports" class="flex items-center gap-5 p-5 bg-slate-50 hover:bg-slate-100 rounded-[1.5rem] border border-slate-100 transition-all group overflow-hidden relative">
          <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-500 shadow-sm group-hover:scale-110 transition-transform z-10">
            <DownloadIcon class="w-6 h-6" />
          </div>
          <div class="text-left z-10">
            <p class="text-[12px] font-black text-slate-900 uppercase tracking-widest leading-none">Reports</p>
            <p class="text-[10px] font-bold text-slate-400 mt-1 uppercase">Accomplishments</p>
          </div>
          <div class="absolute -right-4 -bottom-4 w-24 h-24 bg-slate-200/20 rounded-full group-hover:scale-150 transition-transform"></div>
        </button>
      </div>
    </div>

    <!-- ROW 1: Metric Blocks (3 Columns) -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
      <div class="bg-gradient-to-br from-[#065F46] to-[#047857] rounded-[2.5rem] p-10 text-white shadow-xl h-48 flex flex-col justify-between relative overflow-hidden group hover:scale-[1.02] transition-transform cursor-default">
        <div class="z-10">
          <p class="text-[11px] font-black uppercase tracking-[0.2em] text-white/70">Upcoming Activities</p>
          <h2 class="text-7xl font-black leading-none font-jakarta mt-2 text-white">{{ upcomingCount }}</h2>
        </div>
        <div class="absolute top-10 right-10 w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-md">
          <CalendarIcon class="w-10 h-10 text-white" />
        </div>
        <div class="absolute -left-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div class="bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-[2.5rem] p-10 text-white shadow-xl h-48 flex flex-col justify-between relative overflow-hidden group hover:scale-[1.02] transition-transform cursor-default">
        <div class="z-10">
          <p class="text-[11px] font-black uppercase tracking-[0.2em] text-white/70">Pending for Approval</p>
          <h2 class="text-7xl font-black leading-none font-jakarta mt-2 text-white">{{ pendingCount }}</h2>
        </div>
        <div class="absolute top-10 right-10 w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-md">
          <ClockIcon class="w-10 h-10 text-white" />
        </div>
      </div>

      <div class="bg-gradient-to-br from-[#10B981] to-[#059669] rounded-[2.5rem] p-10 text-white shadow-xl h-48 flex flex-col justify-between relative overflow-hidden group hover:scale-[1.02] transition-transform cursor-default">
        <div class="z-10">
          <p class="text-[11px] font-black uppercase tracking-[0.2em] text-white/70">Successfully Completed</p>
          <h2 class="text-7xl font-black leading-none font-jakarta mt-2 text-white">{{ completedCount }}</h2>
        </div>
        <div class="absolute top-10 right-10 w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-md">
          <CheckCircleIcon class="w-10 h-10 text-white" />
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div class="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden min-h-[500px]">
      <div class="p-10 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h3 class="font-black text-slate-900 text-xl tracking-tight uppercase">Master Activity List</h3>
          <p class="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">{{ filteredEvents.length }} Activities Found</p>
        </div>
        <div class="flex items-center gap-4">
           <div class="relative group">
              <SearchIcon class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
              <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="Search by title or venue..." 
                class="pl-12 pr-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[12px] font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none w-full sm:w-72 transition-all" 
              />
           </div>
           <select v-model="statusFilter" class="bg-slate-50 border border-slate-100 rounded-2xl px-6 py-3 text-[11px] font-black uppercase tracking-widest focus:ring-2 focus:ring-emerald-500 outline-none transition-all">
              <option value="All">All Status</option>
              <option value="Planning">Planning</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Completed">Completed</option>
           </select>
        </div>
      </div>

      <!-- Table Body -->
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100">
              <th class="px-10 py-6">Activity Information</th>
              <th class="px-10 py-6">Timeline & Venue</th>
              <th class="px-10 py-6">Allocation</th>
              <th class="px-10 py-6 text-center">Status</th>
              <th class="px-10 py-6 text-right">Strategic Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-if="filteredEvents.length === 0">
               <td colspan="5" class="px-10 py-32 text-center">
                  <div class="flex flex-col items-center justify-center">
                     <div class="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6">
                        <SearchIcon class="w-10 h-10 text-slate-200" />
                     </div>
                     <p class="text-lg font-black text-slate-900 tracking-tight">No activities found</p>
                     <p class="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Try adjusting your search or filters</p>
                     <button @click="resetFilters" class="mt-8 text-emerald-600 text-[10px] font-black uppercase tracking-widest hover:underline">Clear all filters</button>
                  </div>
               </td>
            </tr>
            <tr v-for="ev in filteredEvents" :key="ev.id" class="group hover:bg-slate-50/80 transition-all duration-300">
              <td class="px-10 py-8">
                <div class="flex flex-col">
                  <span class="font-black text-slate-900 text-base tracking-tight group-hover:text-emerald-700 transition-colors">{{ ev.title }}</span>
                  <span class="text-[10px] text-slate-400 font-bold uppercase tracking-[0.15em] mt-1 line-clamp-1 max-w-[250px]">{{ ev.description || 'No description provided' }}</span>
                </div>
              </td>
              <td class="px-10 py-8">
                <div class="flex flex-col gap-2">
                  <div class="flex items-center gap-2">
                     <CalendarIcon class="w-3.5 h-3.5 text-emerald-500" />
                     <span class="text-[11px] font-black text-slate-700 uppercase tracking-tighter">{{ formatDate(ev.startDate) }}{{ ev.endDate ? ' - ' + formatDate(ev.endDate) : '' }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                     <MapPinIcon class="w-3.5 h-3.5 text-slate-400" />
                     <span class="text-[10px] text-slate-500 font-medium uppercase tracking-widest">{{ ev.venue }} @ {{ ev.time }}</span>
                  </div>
                </div>
              </td>
              <td class="px-10 py-8">
                <div class="flex flex-col">
                   <span class="text-sm font-black text-slate-900 tracking-tight">₱{{ Number(ev.budget).toLocaleString() }}</span>
                   <span v-if="ev.linkedProposal" class="text-[9px] text-emerald-600 font-bold uppercase tracking-widest mt-1">Linked to Proposal</span>
                   <span v-else class="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1 italic">Standalone Event</span>
                </div>
              </td>
              <td class="px-10 py-8">
                <div class="flex justify-center">
                  <span :class="getStatusClass(ev.status)" class="px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2.5 shadow-sm border border-transparent group-hover:border-white/20 transition-all">
                    <span :class="getStatusDotClass(ev.status)" class="w-2 h-2 rounded-full shadow-inner animate-pulse"></span>
                    {{ ev.status }}
                  </span>
                </div>
              </td>
              <td class="px-10 py-8 text-right">
                <div class="flex items-center justify-end gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                  <button @click="viewEvent(ev)" class="w-10 h-10 flex items-center justify-center hover:bg-slate-100 text-slate-400 hover:text-slate-900 rounded-xl transition-all" title="View Activity Details">
                    <EyeIcon class="w-5 h-5" />
                  </button>
                  <button v-if="userStore.role === 'SK Secretary'" @click="openEditModal(ev)" class="w-10 h-10 flex items-center justify-center hover:bg-slate-100 text-slate-400 hover:text-emerald-600 rounded-xl transition-all" title="Edit Activity Record">
                    <PencilIcon class="w-5 h-5" />
                  </button>
                  <button @click="openAttendancePanel(ev)" class="w-10 h-10 flex items-center justify-center hover:bg-slate-100 text-slate-400 hover:text-emerald-600 rounded-xl transition-all" title="Attendance Tracking">
                    <UsersIcon class="w-5 h-5" />
                  </button>
                  <button @click="generateReport(ev)" class="w-10 h-10 flex items-center justify-center hover:bg-slate-100 text-slate-400 hover:text-slate-900 rounded-xl transition-all" title="Generate Accomplishment Report">
                    <FileTextIcon class="w-5 h-5" />
                  </button>
                  <button @click="archiveEvent(ev)" class="w-10 h-10 flex items-center justify-center hover:bg-slate-100 text-slate-400 hover:text-blue-600 rounded-xl transition-all" title="Archive Activity">
                    <ArchiveIcon class="w-5 h-5" />
                  </button>
                  <button v-if="userStore.role === 'SK Secretary'" @click="confirmDelete(ev)" class="w-10 h-10 flex items-center justify-center hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-xl transition-all" title="Delete Permanent Record">
                    <Trash2Icon class="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- CREATE/EDIT EVENT MODAL -->
    <div v-if="isModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md transition-all">
      <div class="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-up relative">
        <div class="p-10 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-white to-slate-50">
          <div>
            <h2 class="text-2xl font-black text-slate-900 tracking-tight">{{ isEditing ? 'Edit Existing Record' : 'Create New Activity' }}</h2>
            <p class="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Provide accurate data for SK Naawan records</p>
          </div>
          <button @click="closeModal" class="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition-all shadow-sm">
            <XIcon class="w-6 h-6" />
          </button>
        </div>

        <div class="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <!-- Form Section 1: Title & Timeline -->
          <div class="space-y-6">
            <div class="group">
              <label class="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900 mb-3 block ml-1 group-focus-within:text-emerald-600 transition-colors">Event Title <span class="text-red-500">*</span></label>
              <input v-model="form.title" type="text" placeholder="e.g., Youth Leadership Summit 2026" :class="errors.title ? 'border-red-500 ring-red-100' : 'border-slate-100 focus:ring-emerald-500 focus:border-transparent'" class="w-full bg-slate-50 border rounded-2xl px-6 py-4 text-sm font-bold shadow-sm focus:ring-4 outline-none transition-all placeholder:text-slate-300" />
              <p v-if="errors.title" class="text-[10px] font-bold text-red-500 mt-2 ml-1 uppercase">{{ errors.title }}</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label class="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900 mb-3 block ml-1">Start Date <span class="text-red-500">*</span></label>
                <input v-model="form.startDate" type="date" :class="errors.startDate ? 'border-red-500' : 'border-slate-100'" class="w-full bg-slate-50 border rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-emerald-500 outline-none transition-all" />
              </div>
              <div>
                <label class="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block ml-1">End Date (Optional)</label>
                <input v-model="form.endDate" type="date" class="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-emerald-500 outline-none transition-all" />
              </div>
            </div>
          </div>

          <!-- Form Section 2: Venue & Time -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
             <div class="group">
                <label class="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900 mb-3 block ml-1">Venue <span class="text-red-500">*</span></label>
                <input v-model="form.venue" type="text" placeholder="e.g., Municipal Gym" :class="errors.venue ? 'border-red-500' : 'border-slate-100'" class="w-full bg-slate-50 border rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-emerald-500 outline-none transition-all" />
             </div>
             <div class="group">
                <label class="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900 mb-3 block ml-1">Time Range <span class="text-red-500">*</span></label>
                <input v-model="form.time" type="text" placeholder="e.g., 9:00 AM - 5:00 PM" :class="errors.time ? 'border-red-500' : 'border-slate-100'" class="w-full bg-slate-50 border rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-emerald-500 outline-none transition-all" />
             </div>
          </div>

          <!-- Form Section 3: Finance & Categorization -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
             <div class="group">
                <label class="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900 mb-3 block ml-1">Proposed Budget (₱) <span class="text-red-500">*</span></label>
                <input v-model="form.budget" type="number" placeholder="0.00" :class="errors.budget ? 'border-red-500' : 'border-slate-100'" class="w-full bg-slate-50 border rounded-2xl px-6 py-4 text-sm font-black focus:ring-4 focus:ring-emerald-500 outline-none transition-all" />
             </div>
             <div class="group">
                <label class="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900 mb-3 block ml-1">Category <span class="text-red-500">*</span></label>
                <select v-model="form.status" class="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-black focus:ring-4 focus:ring-emerald-500 outline-none transition-all">
                   <option value="Planning">Planning</option>
                   <option value="Pending">Pending Approval</option>
                   <option value="Approved">Approved</option>
                   <option value="Completed">Completed</option>
                </select>
             </div>
          </div>

          <!-- Form Section 4: Description & Officials -->
          <div class="space-y-6">
             <div>
                <label class="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900 mb-3 block ml-1">Event Description</label>
                <textarea v-model="form.description" rows="4" placeholder="Briefly describe the purpose of this activity..." class="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] px-6 py-4 text-sm font-medium focus:ring-4 focus:ring-emerald-500 outline-none transition-all resize-none"></textarea>
             </div>
             <div>
                <label class="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900 mb-3 block ml-1">Assigned Officials</label>
                <input v-model="form.assignedOfficials" type="text" placeholder="e.g., John Doe, Jane Smith (Comma separated)" class="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-emerald-500 outline-none transition-all" />
             </div>
          </div>

          <!-- Form Section 5: Linkage -->
          <div class="group p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100">
             <label class="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block ml-1 flex items-center gap-2">
                <LinkIcon class="w-3 h-3" /> Linked Budget Proposal (Optional)
             </label>
             <select v-model="form.linkedProposal" class="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-xs font-bold text-slate-600 focus:ring-2 focus:ring-emerald-500 outline-none">
                <option value="">None (Standalone Budget)</option>
                <option value="1">Approved Proposal #0023 - Youth Month</option>
                <option value="2">Approved Proposal #0045 - Sports Equipment</option>
             </select>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="p-10 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row justify-end items-center gap-4">
           <button @click="closeModal" class="w-full sm:w-auto px-10 py-4 bg-white border border-slate-200 text-slate-600 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.15em] hover:bg-slate-100 transition-all shadow-sm">
             Cancel
           </button>
           <button @click="submitForm" class="w-full sm:w-auto px-12 py-4 bg-[#059669] hover:bg-[#047857] text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.15em] shadow-lg shadow-emerald-200 transition-all">
             {{ isEditing ? 'Update Record' : 'Submit Activity' }}
           </button>
        </div>
      </div>
    </div>

    <!-- VIEW DETAILS MODAL -->
    <div v-if="isViewModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
       <div class="bg-white rounded-[3rem] shadow-2xl w-full max-w-3xl overflow-hidden animate-fade-up">
          <div class="p-10 border-b border-slate-100 flex items-center justify-between">
             <div class="flex items-center gap-5">
                <div class="w-16 h-16 bg-emerald-50 rounded-[1.5rem] flex items-center justify-center text-emerald-600 shadow-inner">
                   <CalendarIcon class="w-8 h-8" />
                </div>
                <div>
                   <h2 class="text-2xl font-black text-slate-900 tracking-tight leading-none">{{ selectedEvent?.title }}</h2>
                   <div class="flex items-center gap-3 mt-2">
                      <span :class="getStatusClass(selectedEvent?.status)" class="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">{{ selectedEvent?.status }}</span>
                      <span class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ID: SK-{{ selectedEvent?.id?.toString()?.padStart(4, '0') }}</span>
                   </div>
                </div>
             </div>
             <button @click="isViewModalOpen = false" class="text-slate-400 hover:text-slate-900 transition-colors p-2"><XIcon class="w-6 h-6" /></button>
          </div>
          
          <div class="p-10 grid grid-cols-1 md:grid-cols-2 gap-10 max-h-[60vh] overflow-y-auto custom-scrollbar">
             <div class="space-y-8">
                <div>
                   <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">About Activity</h4>
                   <p class="text-sm font-medium text-slate-600 leading-relaxed">{{ selectedEvent?.description || 'No detailed description provided for this activity.' }}</p>
                </div>
                <div>
                   <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Assigned Team</h4>
                   <div class="flex flex-wrap gap-2">
                      <span v-for="official in (selectedEvent?.assignedOfficials?.split(',') || ['None assigned'])" :key="official" class="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold text-slate-700 shadow-sm">
                         {{ official.trim() }}
                      </span>
                   </div>
                </div>
             </div>

             <div class="space-y-6 bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                <div class="flex items-center justify-between">
                   <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Timeline</span>
                   <span class="text-xs font-black text-slate-900 uppercase">{{ formatDate(selectedEvent?.startDate) }}</span>
                </div>
                <div class="flex items-center justify-between">
                   <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Venue</span>
                   <span class="text-xs font-black text-slate-900 uppercase">{{ selectedEvent?.venue }}</span>
                </div>
                <div class="flex items-center justify-between">
                   <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Budget Allocation</span>
                   <span class="text-base font-black text-emerald-600">₱{{ Number(selectedEvent?.budget).toLocaleString() }}</span>
                </div>
                <div class="pt-6 border-t border-slate-200">
                   <button class="w-full py-4 bg-white border border-slate-200 text-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm flex items-center justify-center gap-2">
                      <UsersIcon class="w-4 h-4" /> Go to Attendance
                   </button>
                </div>
             </div>
          </div>

          <div class="p-10 bg-slate-50 flex justify-end gap-3">
             <button @click="isViewModalOpen = false" class="px-10 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">Close View</button>
          </div>
       </div>
    </div>

    <!-- DELETE CONFIRMATION MODAL -->
    <div v-if="isDeleteModalOpen" class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
       <div class="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-fade-up">
          <div class="p-10 text-center">
             <div class="w-20 h-20 bg-red-50 text-red-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
                <Trash2Icon class="w-10 h-10" />
             </div>
             <h2 class="text-2xl font-black text-slate-900 tracking-tight">Delete Record?</h2>
             <p class="text-slate-400 text-sm font-medium mt-3 leading-relaxed">This action is permanent and will remove <span class="font-bold text-slate-900">"{{ selectedEvent?.title }}"</span> from the SK Naawan IMS activities database.</p>
          </div>
          <div class="p-8 bg-slate-50 flex flex-col gap-3">
             <button @click="deleteConfirmed" class="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest shadow-lg shadow-red-100 transition-all">Confirm Permanent Deletion</button>
             <button @click="isDeleteModalOpen = false" class="w-full py-4 bg-white border border-slate-200 text-slate-600 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">Go Back</button>
          </div>
       </div>
    </div>

    <!-- TOAST NOTIFICATION -->
    <Transition name="slide-up">
       <div v-if="toast" class="fixed bottom-10 right-10 z-[300]">
          <div :class="toast.type === 'success' ? 'bg-[#059669]' : 'bg-[#DC2626]'" class="rounded-[1.5rem] shadow-2xl p-6 text-white flex items-center gap-5 min-w-[350px] transform hover:scale-105 transition-all">
             <div class="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                <CheckIcon v-if="toast.type === 'success'" class="w-6 h-6" />
                <AlertTriangleIcon v-else class="w-6 h-6" />
             </div>
             <div>
                <p class="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 leading-none mb-1">System Message</p>
                <p class="text-sm font-black tracking-tight">{{ toast.message }}</p>
             </div>
          </div>
       </div>
    </Transition>

    <!-- AI Recommendations Panel -->
    <AIRecommendationsPanel :isOpen="isAIPanelOpen" @close="isAIPanelOpen = false" />

  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import PublicEvents from './public/Events.vue'
import AIRecommendationsPanel from '../components/AIRecommendationsPanel.vue'
import {
  Calendar as CalendarIcon, Clock as ClockIcon, CheckCircle as CheckCircleIcon,
  Plus as PlusIcon, FileText as FileTextIcon, Users as UsersIcon, Download as DownloadIcon,
  Pencil as PencilIcon, Search as SearchIcon, Eye as EyeIcon, MapPin as MapPinIcon,
  Trash2 as Trash2Icon, X as XIcon, Share2 as Share2Icon, Link as LinkIcon,
  Check as CheckIcon, AlertTriangle as AlertTriangleIcon, Info as InfoIcon,
  Archive as ArchiveIcon, Sparkles as SparklesIcon
} from 'lucide-vue-next'

const router = useRouter()
const userStore = useUserStore()

// State
const events = ref([
  { id: 1, title: 'Youth Leadership Summit 2026', startDate: '2026-05-12', venue: 'Municipal Gym', time: '8:00 AM - 5:00 PM', budget: 15000, description: 'Leadership training for all SK officials.', assignedOfficials: 'Juan Dela Cruz, Pedro Penduko', status: 'Approved' },
  { id: 2, title: 'Inter-Barangay Basketball League', startDate: '2026-05-05', venue: 'Barangay Covered Court', time: '6:00 PM onwards', budget: 8500, description: 'Annual sports festival.', assignedOfficials: 'Maria Clara', status: 'Pending' },
  { id: 3, title: 'Coastal Clean-up Drive', startDate: '2026-04-28', venue: 'Poblacion Coastal Area', time: '6:00 AM - 10:00 AM', budget: 3200, description: 'Environmental awareness activity.', assignedOfficials: 'Crisostomo Ibarra', status: 'Completed' }
])

const isModalOpen = ref(false)
const isViewModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const isAIPanelOpen = ref(false)
const isEditing = ref(false)
const selectedEvent = ref(null)
const searchQuery = ref('')
const statusFilter = ref('All')
const toast = ref(null)

const form = reactive({
  title: '',
  startDate: '',
  endDate: '',
  venue: '',
  time: '',
  budget: 0,
  description: '',
  assignedOfficials: '',
  linkedProposal: '',
  status: 'Planning'
})

const errors = reactive({
  title: '',
  startDate: '',
  venue: '',
  time: '',
  budget: ''
})

// Computed
const upcomingCount = computed(() => events.value.filter(e => e.status === 'Approved').length)
const pendingCount = computed(() => events.value.filter(e => e.status === 'Pending').length)
const completedCount = computed(() => events.value.filter(e => e.status === 'Completed').length)

const filteredEvents = computed(() => {
  return events.value.filter(ev => {
    const matchesSearch = ev.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          ev.venue.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesStatus = statusFilter.value === 'All' || ev.status === statusFilter.value;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
})

// Methods
const openCreateModal = () => {
  resetForm()
  isEditing.value = false
  isModalOpen.value = true
}

const openEditModal = (event) => {
  isEditing.value = true
  selectedEvent.value = event
  Object.assign(form, event)
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  resetForm()
}

const resetForm = () => {
  Object.assign(form, {
    title: '',
    startDate: '',
    endDate: '',
    venue: '',
    time: '',
    budget: 0,
    description: '',
    assignedOfficials: '',
    linkedProposal: '',
    status: 'Planning'
  })
  Object.keys(errors).forEach(key => errors[key] = '')
}

const validateForm = () => {
  let isValid = true
  if (!form.title) { errors.title = 'Activity title is required'; isValid = false }
  if (!form.startDate) { errors.startDate = 'Start date is required'; isValid = false }
  if (!form.venue) { errors.venue = 'Venue is required'; isValid = false }
  if (!form.time) { errors.time = 'Time range is required'; isValid = false }
  if (form.budget < 0) { errors.budget = 'Budget cannot be negative'; isValid = false }
  return isValid
}

const submitForm = () => {
  if (!validateForm()) return

  if (isEditing.value) {
    const index = events.value.findIndex(e => e.id === selectedEvent.value.id)
    if (index !== -1) {
      events.value[index] = { ...events.value[index], ...form }
      showToast('Activity record updated successfully', 'success')
    }
  } else {
    const newEvent = {
      ...form,
      id: Date.now(),
    }
    events.value.unshift(newEvent)
    showToast('New activity record created successfully', 'success')
  }
  closeModal()
}

const confirmDelete = (event) => {
  selectedEvent.value = event
  isDeleteModalOpen.value = true
}

const deleteConfirmed = () => {
  events.value = events.value.filter(e => e.id !== selectedEvent.value.id)
  isDeleteModalOpen.value = false
  showToast('Activity record permanently removed', 'success')
}

const viewEvent = (event) => {
  selectedEvent.value = event
  isViewModalOpen.value = true
}

const resetFilters = () => {
  searchQuery.value = ''
  statusFilter.value = 'All'
}

const showToast = (message, type = 'success') => {
  toast.value = { message, type }
  setTimeout(() => toast.value = null, 4000)
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()
}

const getStatusClass = (status) => {
  const map = {
    'Planning': 'bg-blue-50 text-blue-600',
    'Pending': 'bg-amber-50 text-amber-600',
    'Approved': 'bg-emerald-50 text-emerald-600',
    'Completed': 'bg-slate-900 text-white shadow-lg'
  }
  return map[status] || 'bg-slate-50 text-slate-500'
}

const getStatusDotClass = (status) => {
  const map = {
    'Planning': 'bg-blue-500',
    'Pending': 'bg-amber-500',
    'Approved': 'bg-emerald-500',
    'Completed': 'bg-emerald-400'
  }
  return map[status] || 'bg-slate-400'
}

// Strategic Actions
const openAttendancePanel = (ev) => {
  // If an event object is passed (from the table), use its ID
  if (ev && ev.id) {
    router.push({ name: 'Attendance', params: { id: ev.id } });
    return;
  }

  // If clicked from Quick Actions, find the most recent active/approved event
  const activeEvent = events.value.find(e => e.status === 'Approved');
  if (activeEvent) {
    router.push({ name: 'Attendance', params: { id: activeEvent.id } });
  } else {
    showToast('No active events available for attendance tracking.', 'error');
  }
}

const shareEvent = (ev) => {
  alert(`Generating share link for: ${ev.title}`)
}

const generateReport = (ev) => {
  alert(`Generating accomplishment report preview for: ${ev.title}`)
}

const archiveEvent = (ev) => {
  if (confirm(`Archive "${ev.title}"? This record will be moved to the System Archives.`)) {
    events.value = events.value.filter(e => e.id !== ev.id)
    showToast('Activity successfully moved to Archives', 'success')
    setTimeout(() => {
      router.push('/archives')
    }, 1000)
  }
}

const generateReports = () => {
  alert('Generating Master Accomplishment Report ZIP...')
}
</script>

<style scoped>
.font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
.animate-fade-up { animation: fadeUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
@keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

.slide-up-enter-active, .slide-up-leave-active { transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
.slide-up-enter-from { opacity: 0; transform: translateY(40px) scale(0.9); }
.slide-up-leave-to { opacity: 0; transform: translateY(20px) scale(0.9); }

.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
