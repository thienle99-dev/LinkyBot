<template>
  <div class="min-h-screen bg-[#f8fafc] dark:bg-[#020617] text-slate-900 dark:text-slate-100 flex flex-col md:flex-row overflow-hidden">
    <!-- Sidebar -->
    <aside class="w-full md:w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-white/5 flex flex-col z-50">
      <div class="p-8">
        <div class="flex items-center gap-3 mb-10">
          <div class="h-10 w-10 rounded-2xl bg-sky-500 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-white">
              <path fill-rule="evenodd" d="M19.902 4.098a3.75 3.75 0 0 0-5.304 0l-4.5 4.5a3.75 3.75 0 0 0 1.035 6.037.75.75 0 0 1-.646 1.353 5.25 5.25 0 0 1-1.449-8.45l4.5-4.5a5.25 5.25 0 1 1 7.424 7.424l-1.757 1.757a.75.75 0 1 1-1.06-1.06l1.757-1.757a3.75 3.75 0 0 0 0-5.304Zm-7.389 4.267a.75.75 0 0 1 1-.353 5.25 5.25 0 0 1 1.449 8.45l-4.5 4.5a5.25 5.25 0 1 1-7.424-7.424l1.757-1.757a.75.75 0 1 1 1.06 1.06l-1.757 1.757a3.75 3.75 0 1 0 5.304 5.304l4.5-4.5a3.75 3.75 0 0 0-1.035-6.037.75.75 0 0 1-.354-1Z" clip-rule="evenodd" />
            </svg>
          </div>
          <span class="text-xl font-black tracking-tighter">LINKY<span class="text-sky-500">BOT</span></span>
        </div>

        <nav class="space-y-1.5">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="activeTab = tab.id"
            class="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 group"
            :class="activeTab === tab.id 
              ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25 translate-x-1' 
              : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'"
          >
            <component :is="tab.icon" class="w-5 h-5 transition-transform group-hover:scale-110" />
            {{ tab.name }}
            <span v-if="tab.count !== undefined" class="ml-auto text-[10px] px-2 py-0.5 rounded-full font-black" :class="activeTab === tab.id ? 'bg-white/20' : 'bg-slate-100 dark:bg-white/5'">{{ tab.count }}</span>
          </button>
        </nav>
      </div>

      <div class="mt-auto p-8 border-t border-slate-200 dark:border-white/5 mx-4">
        <button @click="handleLogout" class="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
          </svg>
          Sign Out
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 h-screen overflow-y-auto p-4 md:p-10 relative">
      <!-- Header -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xs font-black uppercase tracking-[0.2em] text-sky-500 bg-sky-500/10 px-3 py-1 rounded-full">Admin Panel</span>
          </div>
          <h2 class="text-4xl font-black text-slate-900 dark:text-white">{{ activeTabName }}</h2>
        </div>

        <div class="flex items-center gap-4">
          <button @click="openCreate" class="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-xl dark:shadow-white/5">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
               <path fill-rule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" />
             </svg>
             Create Link
          </button>
          <button @click="fetchData(true)" class="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 text-slate-500 hover:text-sky-500 hover:border-sky-500/50 transition-all group shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5" :class="{ 'animate-spin': loading }">
               <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
             </svg>
          </button>
        </div>
      </div>

      <!-- Tab Content: Insights -->
      <div v-if="activeTab === 'insights'" class="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
        <!-- Stats Row -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="s in statsCards" :key="s.name" class="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden relative group">
            <div class="absolute -right-6 -top-6 w-32 h-32 rounded-full opacity-[0.03] transition-transform group-hover:scale-125" :class="s.color"></div>
            <p class="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">{{ s.name }}</p>
            <div class="flex items-baseline gap-3">
              <p class="text-5xl font-black" :class="s.textColor">{{ s.value }}</p>
              <span v-if="s.trend" class="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full">{{ s.trend }}</span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <!-- Creation Chart -->
           <div class="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 shadow-sm">
              <div class="flex items-center justify-between mb-8">
                <h3 class="text-lg font-black tracking-tight">Activity Trend</h3>
                <span class="text-xs font-bold text-slate-400">Last 30 Days</span>
              </div>
              <div class="h-[320px]">
                <LineChart :data="creationChartData" :options="chartOptions" />
              </div>
           </div>

           <!-- Top Links -->
           <div class="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 shadow-sm">
              <div class="flex items-center justify-between mb-8">
                <h3 class="text-lg font-black tracking-tight">Top Performing</h3>
                <button @click="activeTab = 'links'" class="text-xs font-bold text-sky-500 hover:underline">View All</button>
              </div>
              <div class="space-y-4">
                <div v-for="link in analytics.topLinks" :key="link.code" class="flex items-center justify-between p-5 rounded-3xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 transition-transform hover:scale-[1.02]">
                  <div class="flex flex-col gap-1 overflow-hidden">
                     <span class="font-black text-slate-900 dark:text-white font-mono text-base leading-none">/{{ link.code }}</span>
                     <span class="text-xs text-slate-400 truncate max-w-[200px]">{{ link.original_url }}</span>
                  </div>
                  <div class="flex flex-col items-end">
                     <span class="text-sky-500 font-black text-2xl tracking-tighter">{{ link.clicks }}</span>
                     <span class="text-[9px] text-slate-400 font-black uppercase tracking-widest leading-none">Clicks</span>
                  </div>
                </div>
              </div>
           </div>
        </div>
      </div>

      <!-- Tab Content: Links -->
      <div v-if="activeTab === 'links'" class="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
           <div class="flex items-center gap-3">
             <div class="relative">
               <input v-model="search" @input="debounceSearch" type="text" placeholder="Search code or URL..." class="w-72 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/50 py-3.5 pl-12 pr-4 text-sm font-medium outline-none focus:border-sky-500/50 transition-all shadow-sm" />
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="absolute left-4 top-4 w-4 h-4 text-slate-400">
                 <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
               </svg>
             </div>
             <select v-model="sourceFilter" @change="fetchData(true)" class="rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/50 py-3.5 px-6 text-sm font-bold outline-none cursor-pointer shadow-sm">
                <option value="">All Sources</option>
                <option value="web">Web App</option>
                <option value="telegram">Bot</option>
              </select>
           </div>
           
           <button @click="handleExport" class="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 font-bold text-sm hover:border-sky-500/50 transition-all shadow-sm">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
               <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
             </svg>
             Export CSV
           </button>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
          <div class="overflow-x-auto min-h-[400px]">
            <table class="w-full text-left text-sm border-collapse">
              <thead>
                <tr class="bg-slate-50/50 dark:bg-slate-950/30 text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.15em] text-[10px]">
                  <th class="px-8 py-6 w-10">
                    <input type="checkbox" :checked="isAllSelected" @change="toggleAll" class="rounded-md border-slate-300 dark:border-slate-800 text-sky-500 focus:ring-sky-500 focus:ring-offset-0 w-4 h-4" />
                  </th>
                  <th class="px-6 py-6">Link Info</th>
                  <th class="px-6 py-6">Destination</th>
                  <th class="px-6 py-6 text-center">Status</th>
                  <th class="px-6 py-6 text-center">Engagement</th>
                  <th class="px-6 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-white/[0.03]">
                <tr v-for="link in links" :key="link.code" class="group transition-colors" :class="{ 'opacity-50 pointer-events-none': deleting === link.code, 'bg-sky-50/30 dark:bg-sky-500/5': selectedLinks.has(link.code), 'hover:bg-slate-50/50 dark:hover:bg-white/[0.01]': !selectedLinks.has(link.code) }">
                  <td class="px-8 py-6">
                    <input type="checkbox" :checked="selectedLinks.has(link.code)" @change="toggleSelect(link.code)" class="rounded-md border-slate-300 dark:border-slate-800 text-sky-500 focus:ring-sky-500 focus:ring-offset-0 w-4 h-4" />
                  </td>
                  <td class="px-6 py-6">
                    <div class="flex flex-col gap-0.5">
                      <span class="font-black text-slate-900 dark:text-white font-mono text-base leading-none">/{{ link.code }}</span>
                      <div class="flex items-center gap-1.5 mt-1">
                        <span class="inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-tighter" :class="link.source === 'telegram' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-slate-500/10 text-slate-500'">{{ link.source }}</span>
                        <span class="text-[10px] text-slate-400 font-medium">{{ formatDate(link.created_at) }}</span>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-6">
                    <div class="max-w-xs truncate text-slate-600 dark:text-slate-400 font-medium group-hover:text-sky-500">
                      {{ link.original_url }}
                    </div>
                  </td>
                  <td class="px-6 py-6 text-center">
                    <div class="flex justify-center">
                      <span v-if="liveStatuses[link.code]" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all" :class="liveStatuses[link.code].ok ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'">
                        <span class="h-1.5 w-1.5 rounded-full animate-pulse" :class="liveStatuses[link.code].ok ? 'bg-emerald-500' : 'bg-rose-500'"></span>
                        {{ liveStatuses[link.code].ok ? 'LIVE' : 'DEAD' }}
                      </span>
                      <button v-else @click="onCheckLive(link)" class="text-[10px] font-bold text-slate-400 hover:text-sky-500 transition-colors uppercase tracking-widest underline decoration-dotted" :disabled="checkingLive">Verify</button>
                    </div>
                  </td>
                  <td class="px-6 py-6 text-center">
                    <div class="flex flex-col">
                      <span class="font-black text-lg leading-tight">{{ link.clicks }}</span>
                      <span class="text-[9px] text-slate-400 font-black uppercase tracking-widest">clicks</span>
                    </div>
                  </td>
                  <td class="px-6 py-6 text-right">
                    <div class="flex items-center justify-end gap-2">
                       <button @click="copy(getFullShortUrl(link.code))" class="h-10 w-10 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-sky-500 transition-all" title="Copy"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4"><path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z"/><path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z"/></svg></button>
                       <button @click="openQR(link.code)" class="h-10 w-10 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-white/5 text-slate-400 hover:bg-sky-500 transition-all font-bold" title="QR Code">QR</button>
                       <button @click="openEdit(link)" class="h-10 w-10 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-white/5 text-slate-400 hover:bg-sky-500 transition-all"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg></button>
                       <button @click="onDelete(link.code)" class="h-10 w-10 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-white/5 text-slate-400 hover:bg-rose-500 hover:text-white transition-all"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.34 12m-4.72 0-.34-12M4.5 6.336a.81.81 0 0 1 .81-.806h1.259a.81.81 0 1 1 0 1.621H4.5m1.611 0 a.81.81 0 0 1 .803-.806h1.259a.81.81 0 0 1 0 1.621H6.111M4.5 6.336L21 6.336m-16.5 0A40.354 40.354 0 0 1 12 4.5c4.153 0 7.424 1.137 10.5 4.336m-15 0a40.353 40.353 0 0 0 8.854 1.706"/></svg></button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="px-8 py-6 flex items-center justify-between border-t border-slate-100 dark:border-white/[0.03]">
             <span class="text-xs font-bold text-slate-400">Page {{ page }} / {{ Math.ceil(total/limit) }}</span>
             <div class="flex gap-2">
               <button @click="page > 1 && (page--, fetchData())" :disabled="page === 1" class="px-5 py-2 rounded-xl border border-slate-200 dark:border-white/5 text-xs font-black uppercase tracking-widest disabled:opacity-30">Back</button>
               <button @click="page * limit < total && (page++, fetchData())" :disabled="page * limit >= total" class="px-5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black uppercase tracking-widest disabled:opacity-30">Next</button>
             </div>
          </div>
        </div>
      </div>

      <!-- Tab Content: Users -->
      <div v-if="activeTab === 'users'" class="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
        <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm border-collapse">
              <thead>
                <tr class="bg-slate-50/50 dark:bg-slate-950/30 text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.15em] text-[10px]">
                  <th class="px-8 py-6">Telegram User</th>
                  <th class="px-6 py-6 text-center">ID / Username</th>
                  <th class="px-6 py-6 text-center">Activity</th>
                  <th class="px-6 py-6 text-center">Status</th>
                  <th class="px-6 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-white/[0.03]">
                <tr v-for="user in users" :key="user.id" class="group hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-colors">
                  <td class="px-8 py-6">
                    <div class="flex items-center gap-4">
                      <div class="h-12 w-12 rounded-full bg-sky-500/10 text-sky-500 flex items-center justify-center font-black text-lg">
                        {{ user.first_name?.[0]?.toUpperCase() || '?' }}
                      </div>
                      <div class="flex flex-col">
                        <span class="font-black text-slate-900 dark:text-white text-base leading-none">{{ user.first_name }} {{ user.last_name || '' }}</span>
                        <span class="text-xs text-slate-400 mt-1">First joined {{ formatDate(user.created_at) }}</span>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-6 text-center font-mono">
                    <p class="text-slate-900 dark:text-white font-black text-sm">{{ user.id }}</p>
                    <p class="text-xs text-sky-500">@{{ user.username || 'n/a' }}</p>
                  </td>
                  <td class="px-6 py-6 text-center">
                    <p class="font-black text-base">{{ user.link_count }}</p>
                    <p class="text-[9px] text-slate-400 uppercase font-black">Links Created</p>
                  </td>
                  <td class="px-6 py-6 text-center">
                    <span v-if="user.is_banned" class="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-rose-500/10 text-rose-500">BANNED</span>
                    <span v-else class="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-500">ACTIVE</span>
                  </td>
                  <td class="px-6 py-6 text-right">
                    <button 
                      @click="handleUserStatus(user.id, !user.is_banned)" 
                      class="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-sm"
                      :class="user.is_banned ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-rose-500 text-white shadow-rose-500/20'"
                    >
                      {{ user.is_banned ? 'Unban User' : 'Ban User' }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Bulk Actions Bar -->
      <Transition name="slide-up">
        <div v-if="selectedLinks.size > 0 && activeTab === 'links'" class="fixed bottom-10 left-1/2 -translate-x-1/2 px-8 py-5 rounded-[2.5rem] bg-slate-900 text-white shadow-2xl z-[90] flex items-center gap-8 border border-white/10 backdrop-blur-xl">
          <div class="flex items-center gap-4 pr-8 border-r border-white/10">
            <span class="h-8 w-8 rounded-full bg-sky-500 flex items-center justify-center text-xs font-black">{{ selectedLinks.size }}</span>
            <span class="text-xs font-black uppercase tracking-widest text-slate-400">Selected</span>
          </div>
          <div class="flex items-center gap-3">
            <button @click="handleBulkCheck" class="px-5 py-2.5 rounded-2xl bg-sky-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-sky-400 transition-all shadow-lg shadow-sky-500/20" :disabled="checkingLive">Verify All</button>
            <button @click="handleBulkDelete" class="px-5 py-2.5 rounded-2xl bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-rose-400 transition-all shadow-lg shadow-rose-500/20">Delete All</button>
            <button @click="selectedLinks.clear()" class="px-5 py-2.5 rounded-2xl bg-white/10 text-slate-300 text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all">Cancel</button>
          </div>
        </div>
      </Transition>

      <!-- Toast -->
      <Transition name="slide-up">
        <div v-if="toast" class="fixed bottom-10 right-10 px-6 py-4 rounded-2xl bg-slate-900 text-white shadow-2xl z-[100] flex items-center gap-3 border border-white/10">
          <div class="h-2 w-2 rounded-full bg-sky-500 animate-pulse"></div>
          <span class="text-sm font-bold tracking-tight">{{ toast }}</span>
        </div>
      </Transition>

      <!-- Modals -->
      <Transition name="fade">
        <div v-if="qrModal.show" class="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-md" @click="qrModal.show = false"></div>
          <div class="relative w-full max-w-sm rounded-[3rem] bg-white dark:bg-slate-900 p-10 shadow-2xl text-center border border-white/5">
             <h3 class="text-2xl font-black mb-1">QR Code</h3>
             <p class="text-sm text-slate-500 mb-8 font-mono">/{{ qrModal.code }}</p>
             <div class="bg-slate-50 dark:bg-white/5 p-6 rounded-[2rem] inline-block mb-8 border border-slate-100 dark:border-white/5">
               <img :src="`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(getFullShortUrl(qrModal.code))}`" class="w-48 h-48" />
             </div>
             <button @click="qrModal.show = false" class="w-full py-4 text-sm font-black uppercase tracking-widest bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl transition-transform active:scale-95">Close</button>
          </div>
        </div>
      </Transition>

      <Transition name="fade">
        <div v-if="editModal.show" class="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-md" @click="editModal.show = false"></div>
          <div class="relative w-full max-w-lg rounded-[3rem] bg-white dark:bg-slate-900 p-10 shadow-2xl border border-white/5">
             <h3 class="text-3xl font-black mb-2">Edit Link</h3>
             <p class="text-slate-500 text-sm mb-8 font-mono">/{{ editModal.code }}</p>
             <textarea v-model="editModal.url" rows="4" class="block w-full rounded-[1.5rem] border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-6 text-sm font-medium outline-none focus:border-sky-500 mb-8 transition-all" placeholder="Enter full URL..."></textarea>
             <div class="flex gap-4">
                <button @click="editModal.show = false" class="flex-1 py-4 text-sm font-black uppercase tracking-widest border border-slate-200 dark:border-white/10 rounded-2xl">Cancel</button>
                <button @click="saveEdit" class="flex-1 bg-sky-500 py-4 text-sm font-black uppercase tracking-widest text-white rounded-2xl shadow-xl shadow-sky-500/20 active:scale-95 transition-all">Save Changes</button>
             </div>
          </div>
        </div>
      </Transition>

      <Transition name="fade">
        <div v-if="createModal.show" class="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-md" @click="createModal.show = false"></div>
          <div class="relative w-full max-w-lg rounded-[3rem] bg-white dark:bg-slate-900 p-10 shadow-2xl border border-white/5">
             <h3 class="text-3xl font-black mb-8 underline decoration-sky-500 underline-offset-8">New Link</h3>
             <div class="space-y-6">
               <div>
                 <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block px-2">Custom Alias</label>
                 <input v-model="createModal.code" type="text" class="block w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-5 text-sm font-mono focus:border-sky-500 outline-none transition-all" placeholder="e.g. portfolio" />
               </div>
               <div>
                 <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block px-2">Destination URL</label>
                 <textarea v-model="createModal.url" rows="3" class="block w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-5 text-sm font-medium focus:border-sky-500 outline-none transition-all" placeholder="https://..."></textarea>
               </div>
               <div class="flex gap-4 pt-4">
                 <button @click="createModal.show = false" class="flex-1 py-4 text-sm font-black uppercase tracking-widest border border-slate-200 dark:border-white/10 rounded-2xl">Cancel</button>
                 <button @click="handleCreate" class="flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 text-sm font-black uppercase tracking-widest rounded-2xl shadow-xl active:scale-95 transition-all">Create Link</button>
               </div>
             </div>
          </div>
        </div>
      </Transition>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive, markRaw } from "vue";
import { 
  getStats, getLinks, deleteLink, bulkDeleteLinks, updateLink, createLink, 
  getAnalytics, getUsers, updateUserStatus, exportLinks, logout, verifyLink 
} from "../services/adminApi";
import {
  Chart as ChartJS, Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale, Filler
} from 'chart.js';
import { Line as LineChart } from 'vue-chartjs';

ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale, Filler);

// Icons
const IconInsights = { template: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.035 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 0 1-1.875-1.875V8.625ZM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 0 1 3 19.875v-6.75Z" /></svg>' };
const IconLinks = { template: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19.902 4.098a3.75 3.75 0 0 0-5.304 0l-4.5 4.5a3.75 3.75 0 0 0 1.035 6.037.75.75 0 0 1-.646 1.353 5.25 5.25 0 0 1-1.449-8.45l4.5-4.5a5.25 5.25 0 1 1 7.424 7.424l-1.757 1.757a.75.75 0 1 1-1.06-1.06l1.757-1.757a3.75 3.75 0 0 0 0-5.304Zm-7.389 4.267a.75.75 0 0 1 1-.353 5.25 5.25 0 0 1 1.449 8.45l-4.5 4.5a5.25 5.25 0 1 1-7.424-7.424l1.757-1.757a.75.75 0 1 1 1.06 1.06l-1.757 1.757a3.75 3.75 0 1 0 5.304 5.304l4.5-4.5a3.75 3.75 0 0 0-1.035-6.037.75.75 0 0 1-.354-1Z" /></svg>' };
const IconUsers = { template: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.225 12.003a6.124 6.124 0 0 1 4.907-2.128 4.875 4.875 0 0 1 0 9.75 6.12 6.12 0 0 1-3.664-1.223 5.248 5.248 0 0 0-1.243-6.4Z" /><path d="M1.5 19.062a4.875 4.875 0 0 1 5.028-4.864 4.875 4.875 0 0 1 5.028 4.864 4.875 4.875 0 0 1-10.056 0Z" /></svg>' };

const stats = ref({ totalLinks: 0, linksToday: 0, totalClicks: 0 });
const links = ref<any[]>([]);
const users = ref<any[]>([]);
const analytics = ref({ dailyCreation: [] as any[], topLinks: [] as any[] });
const total = ref(0);
const page = ref(1);
const limit = ref(20);
const search = ref("");
const sourceFilter = ref("");
const activeTab = ref('insights');
const loading = ref(false);
const selectedLinks = ref(new Set<string>());
const deleting = ref<string | null>(null);
const checkingLive = ref(false);
const liveStatuses = reactive<Record<string, { ok: boolean, status: number | null }>>({});
const toast = ref("");

const tabs = computed(() => [
  { id: 'insights', name: 'Insights', icon: markRaw(IconInsights) },
  { id: 'links', name: 'Links', icon: markRaw(IconLinks), count: total.value },
  { id: 'users', name: 'Users', icon: markRaw(IconUsers), count: users.value.length },
]);

const activeTabName = computed(() => tabs.value.find(t => t.id === activeTab.value)?.name);

const statsCards = computed(() => [
  { name: 'Total Links', value: stats.value.totalLinks, trend: `+${stats.value.linksToday} today`, color: 'bg-sky-500', textColor: 'text-slate-900 dark:text-white' },
  { name: 'Engagements', value: stats.value.totalClicks.toLocaleString(), textColor: 'text-sky-500', color: 'bg-sky-500' },
  { name: 'Active Users', value: users.value.filter(u => !u.is_banned).length, textColor: 'text-emerald-500', color: 'bg-emerald-500' },
]);

const editModal = reactive({ show: false, code: "", url: "", saving: false });
const createModal = reactive({ show: false, code: "", url: "", saving: false });
const qrModal = reactive({ show: false, code: "" });

async function onCheckLive(link: any) {
  if (checkingLive.value) return;
  try {
    const res = await verifyLink(link.original_url);
    liveStatuses[link.code] = res;
  } catch (e) {}
}

async function handleBulkCheck() {
  if (checkingLive.value) return;
  checkingLive.value = true;
  const codes = Array.from(selectedLinks.value);
  showToast(`Verifying ${codes.length} links...`);
  for (const code of codes) {
    const link = links.value.find(l => l.code === code);
    if (link) await onCheckLive(link);
  }
  checkingLive.value = false;
  showToast("Verification complete!");
}

async function handleUserStatus(id: any, isBanned: boolean) {
  if (!confirm(`${isBanned ? 'Ban' : 'Unban'} this user?`)) return;
  try {
    await updateUserStatus(id, isBanned);
    showToast(`User ${isBanned ? 'banned' : 'unbanned'}`);
    await fetchData(true);
  } catch (e) {
    alert("Action failed");
  }
}

let searchTimeout: any;
function debounceSearch() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => { page.value = 1; fetchData(); }, 400);
}

const chartOptions = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { x: { display: false }, y: { beginAtZero: true, grid: { color: 'rgba(148, 163, 184, 0.05)' }, ticks: { display: false } } },
  elements: { line: { tension: 0.45, borderColor: '#0ea5e9', borderWidth: 4, fill: true, backgroundColor: 'rgba(14, 165, 233, 0.05)' }, point: { radius: 0 } }
};

const creationChartData = computed(() => ({
  labels: analytics.value.dailyCreation.map(d => d.day),
  datasets: [{ data: analytics.value.dailyCreation.map(d => d.count) }]
}));

async function fetchData(withStats = false) {
  loading.value = true;
  try {
    const [res, s, a, u] = await Promise.all([
      getLinks({ page: page.value, limit: limit.value, search: search.value, source: sourceFilter.value }),
      withStats ? getStats() : Promise.resolve(null),
      withStats ? getAnalytics() : Promise.resolve(null),
      withStats ? getUsers() : Promise.resolve(null)
    ]);
    links.value = res.data;
    total.value = res.total;
    if (s) stats.value = s;
    if (a) analytics.value = a;
    if (u) users.value = u.data;
    selectedLinks.value.clear();
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
}

async function handleExport() {
  try { showToast("Preparing export..."); await exportLinks(); showToast("Download started!"); }
  catch (e) { alert("Export failed"); }
}

function openEdit(link: any) { editModal.code = link.code; editModal.url = link.original_url; editModal.show = true; }
async function saveEdit() {
  if (!editModal.url) return;
  try { await updateLink(editModal.code, editModal.url); showToast("Link updated"); editModal.show = false; await fetchData(); }
  catch (e) { alert("Save failed"); }
}

function openCreate() { createModal.code = ""; createModal.url = ""; createModal.show = true; }
function openQR(code: string) { qrModal.code = code; qrModal.show = true; }
async function handleCreate() {
  if (!createModal.code || !createModal.url) return;
  try {
    await createLink({ code: createModal.code.trim(), original_url: createModal.url.trim(), source: "web" });
    showToast("Link created!"); createModal.show = false; await fetchData(true);
  } catch (e: any) { alert(e.response?.data?.error || "Create failed"); }
}

async function onDelete(code: string) {
  if (!confirm(`Permanently delete /${code}?`)) return;
  try { await deleteLink(code); showToast("Link deleted"); await fetchData(true); }
  catch (e) { alert("Delete failed"); }
}

const isAllSelected = computed(() => links.value.length > 0 && selectedLinks.value.size === links.value.length);
function toggleSelect(code: string) {
  if (selectedLinks.value.has(code)) selectedLinks.value.delete(code);
  else selectedLinks.value.add(code);
}
function toggleAll() {
  if (isAllSelected.value) selectedLinks.value.clear();
  else links.value.forEach(l => selectedLinks.value.add(l.code));
}

async function handleBulkDelete() {
  if (!confirm(`Delete ${selectedLinks.value.size} selected links?`)) return;
  try {
    await bulkDeleteLinks(Array.from(selectedLinks.value));
    showToast(`${selectedLinks.value.size} links removed`);
    selectedLinks.value.clear();
    await fetchData(true);
  } catch (e) {
    alert("Bulk delete failed");
  }
}

function handleLogout() { logout(); }
function getFullShortUrl(code: string) { return `${window.location.origin}/r/${code}`; }
async function copy(text: string) { try { await navigator.clipboard.writeText(text); showToast("Copied to clipboard"); } catch {} }
function showToast(msg: string) { toast.value = msg; setTimeout(() => toast.value = "", 3000); }
function formatDate(d: string) { return d ? new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '---'; }
function formatTime(d: string) { return d ? new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''; }

onMounted(() => fetchData(true));
</script>

<style>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translate(-50%, 40px); }
/* Specific fix for right-side toast */
.slide-up-enter-from.fixed.bottom-10.right-10, .slide-up-leave-to.fixed.bottom-10.right-10 { transform: translate(0, 40px); }

::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(148, 163, 184, 0.2); border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: rgba(148, 163, 184, 0.4); }
</style>
