<template>
  <div class="space-y-8 pb-12">
    <!-- Header Section -->
    <header class="animate-in fade-in slide-in-from-top-4 duration-700">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Admin Dashboard</h1>
          <p class="text-slate-500 dark:text-slate-400 mt-1">Management and analytics for LinkyBot.</p>
        </div>
        
        <div class="flex flex-wrap items-center gap-3">
          <!-- Tab Switcher -->
          <div class="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl mr-2">
             <button 
               @click="activeTab = 'links'" 
               class="px-4 py-2 rounded-xl text-sm font-bold transition-all"
               :class="activeTab === 'links' ? 'bg-white dark:bg-slate-700 text-sky-500 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'"
             >
               Links
             </button>
             <button 
               @click="activeTab = 'users'" 
               class="px-4 py-2 rounded-xl text-sm font-bold transition-all"
               :class="activeTab === 'users' ? 'bg-white dark:bg-slate-700 text-sky-500 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'"
             >
               Users
             </button>
          </div>

          <button
            @click="handleExport"
            class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400 font-semibold text-sm hover:bg-sky-100 dark:hover:bg-sky-900/40 transition-all hover:scale-105 active:scale-95"
            title="Export CSV"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export
          </button>

          <button
            @click="openCreate"
            class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Create New
          </button>

          <button
            @click="fetchData(true)"
            class="inline-flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 text-slate-600 dark:text-slate-400 hover:text-sky-500 shadow-sm transition-all"
            title="Refresh Data"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5" :class="{ 'animate-spin': loading }">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </button>

          <button
            @click="handleLogout"
            class="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 font-semibold text-sm hover:bg-rose-100 transition-all"
          >
            Sign Out
          </button>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="group relative overflow-hidden rounded-3xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 p-6 shadow-sm transition-all hover:shadow-xl">
          <div class="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-sky-500/5"></div>
          <p class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Total Links</p>
          <div class="flex items-baseline gap-2">
            <p class="text-4xl font-black text-slate-900 dark:text-white">{{ stats.totalLinks }}</p>
            <span class="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">+{{ stats.linksToday }} today</span>
          </div>
        </div>

        <div class="group relative overflow-hidden rounded-3xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div class="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-emerald-500/5"></div>
          <p class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Telegram Users</p>
          <p class="text-4xl font-black text-emerald-500">{{ users.length }}</p>
        </div>

        <div class="group relative overflow-hidden rounded-3xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div class="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-amber-500/5"></div>
          <p class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Total Engagement</p>
          <p class="text-4xl font-black text-amber-500">{{ stats.totalClicks }} <span class="text-slate-400 text-lg font-medium">clicks</span></p>
        </div>
      </div>
    </header>

    <!-- Analytics Charts -->
    <section v-if="analytics.dailyCreation.length" class="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100 fill-mode-both">
      <div class="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-white/5 p-8 shadow-sm">
        <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-6">Link Creation Trend (30 Days)</h3>
        <div class="h-[250px]">
          <LineChart :data="creationChartData" :options="chartOptions" />
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-white/5 p-8 shadow-sm">
        <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-6">Top Performing Links</h3>
        <div class="space-y-4">
          <div v-for="link in analytics.topLinks" :key="link.code" class="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5">
            <div class="flex flex-col gap-1 overflow-hidden">
               <span class="font-bold text-slate-900 dark:text-white font-mono text-sm leading-none">/{{ link.code }}</span>
               <span class="text-xs text-slate-400 truncate max-w-[200px]">{{ link.original_url }}</span>
            </div>
            <div class="flex flex-col items-end">
               <span class="text-sky-500 font-black text-lg">{{ link.clicks }}</span>
               <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">clicks</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bulk Actions Bar -->
      <Transition name="slide-up">
        <div v-if="selectedLinks.size > 0" class="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-4 rounded-[2rem] bg-slate-900 text-white shadow-2xl z-[90] flex items-center gap-6 border border-white/10 animate-in fade-in slide-in-from-bottom-4">
          <div class="flex items-center gap-3 pr-6 border-r border-white/10">
            <span class="h-6 w-6 rounded-full bg-sky-500 flex items-center justify-center text-[10px] font-black">{{ selectedLinks.size }}</span>
            <span class="text-xs font-bold uppercase tracking-widest text-slate-400">Selected</span>
          </div>
          <div class="flex items-center gap-3">
            <button @click="handleBulkDelete" class="px-4 py-2 rounded-xl bg-rose-500/10 text-rose-500 text-xs font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all">Delete All</button>
            <button @click="handleBulkCheck" class="px-4 py-2 rounded-xl bg-sky-500/10 text-sky-500 text-xs font-black uppercase tracking-widest hover:bg-sky-500 hover:text-white transition-all" :disabled="checkingLive">Verify Links</button>
            <button @click="selectedLinks.clear()" class="px-4 py-2 rounded-xl bg-white/5 text-slate-400 text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all">Deselect</button>
          </div>
        </div>
      </Transition>
    </section>

    <!-- Content Section -->
    <main class="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-both">
      <!-- Links Table -->
      <div v-if="activeTab === 'links'" class="space-y-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 class="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            URL Management
            <span class="text-xs font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">{{ total }} items</span>
          </h2>

          <div class="flex flex-wrap items-center gap-3">
            <div class="relative flex-1 min-w-[240px]">
              <input v-model="search" @input="debounceSearch" type="text" placeholder="Search code or destination..." class="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-sky-500 transition-all" />
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="absolute left-3.5 top-3 w-4 h-4 text-slate-400">
                <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>

            <select v-model="sourceFilter" @change="fetchData(true)" class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 py-2.5 px-4 text-sm outline-none cursor-pointer">
              <option value="">All Sources</option>
              <option value="web">Web App</option>
              <option value="telegram">Telegram Bot</option>
            </select>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
          <div class="overflow-x-auto min-h-[400px]">
            <table class="w-full text-left text-sm border-collapse">
              <thead>
                <tr class="bg-slate-50/50 dark:bg-slate-950/30 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest text-[10px]">
            <th class="px-6 py-5 w-10">
              <input 
                type="checkbox" 
                :checked="isAllSelected" 
                @change="toggleAll" 
                class="rounded border-slate-300 dark:border-slate-800 text-sky-500 focus:ring-sky-500"
              />
            </th>
            <th class="px-6 py-5">Code & Link</th>
            <th class="px-6 py-5">Destination</th>
                  <th class="px-6 py-5 text-center">Source</th>
                  <th class="px-6 py-5 text-center">Clicks</th>
                  <th class="px-6 py-5 text-center">Status</th>
                  <th class="px-6 py-5">Created</th>
                  <th class="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-white/[0.03]">
                <tr v-for="link in links" :key="link.code" class="group hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors" :class="{ 'opacity-50 pointer-events-none': deleting === link.code, 'bg-sky-50/30 dark:bg-sky-500/5': selectedLinks.has(link.code) }">
                  <td class="px-6 py-5">
                    <input 
                      type="checkbox" 
                      :checked="selectedLinks.has(link.code)" 
                      @change="toggleSelect(link.code)"
                      class="rounded border-slate-300 dark:border-slate-800 text-sky-500 focus:ring-sky-500"
                    />
                  </td>
                  <td class="px-6 py-5">
                    <div class="flex flex-col gap-0.5">
                      <span class="font-black text-slate-900 dark:text-white font-mono">/{{ link.code }}</span>
                      <div class="flex items-center gap-2">
                        <span class="text-[10px] text-slate-400 truncate max-w-[120px]">{{ getFullShortUrl(link.code) }}</span>
                        <button @click="copy(getFullShortUrl(link.code))" class="text-slate-300 hover:text-sky-500 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3"><path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z"/><path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z"/></svg></button>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-5"><a :href="link.original_url" target="_blank" class="text-slate-600 dark:text-slate-400 hover:text-sky-500 truncate block max-w-xs">{{ link.original_url }}</a></td>
                  <td class="px-6 py-5 text-center">
                    <span class="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider" :class="link.source === 'telegram' ? 'bg-blue-500/10 text-blue-500' : 'bg-slate-500/10 text-slate-500'">{{ link.source }}</span>
                  </td>
                  <td class="px-6 py-5 text-center font-bold">{{ link.clicks }}</td>
                  <td class="px-6 py-5 text-center">
                    <div class="flex flex-col items-center">
                      <span v-if="liveStatuses[link.code]" class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase transition-all" :class="liveStatuses[link.code].ok ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'">
                        <span class="h-1.5 w-1.5 rounded-full" :class="liveStatuses[link.code].ok ? 'bg-emerald-500' : 'bg-rose-500'"></span>
                        {{ liveStatuses[link.code].ok ? 'Live' : 'Dead' }}
                      </span>
                      <button v-else @click="onCheckLive(link)" class="text-[10px] font-bold text-slate-400 hover:text-sky-500 transition-colors uppercase tracking-widest" :disabled="checkingLive">Verify</button>
                    </div>
                  </td>
                  <td class="px-6 py-5"><div class="flex flex-col"><span class="text-slate-700 dark:text-slate-300 font-medium">{{ formatDate(link.created_at) }}</span><span class="text-[10px] text-slate-400 uppercase tracking-widest">{{ formatTime(link.created_at) }}</span></div></td>
                  <td class="px-6 py-5 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <button @click="openQR(link.code)" class="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-white/5 text-slate-400 hover:bg-sky-500 hover:text-white transition-all" title="QR Code">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                          <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 16.5h.75v.75h-.75v-.75zM16.5 13.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
                        </svg>
                      </button>
                      <button @click="openEdit(link)" class="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-white/5 text-slate-400 hover:bg-sky-500 hover:text-white transition-all"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg></button>
                      <button @click="onDelete(link.code)" class="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-white/5 text-slate-400 hover:bg-rose-500 hover:text-white transition-all"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.34 12m-4.72 0-.34-12M4.5 6.336a.81.81 0 0 1 .81-.806h1.259a.81.81 0 1 1 0 1.621H4.5m1.611 0 a.81.81 0 0 1 .803-.806h1.259a.81.81 0 0 1 0 1.621H6.111M4.5 6.336L21 6.336m-16.5 0A40.354 40.354 0 0 1 12 4.5c4.153 0 7.424 1.137 10.5 4.336m-15 0a40.353 40.353 0 0 0 8.854 1.706"/></svg></button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- Pagination -->
          <div class="border-t border-slate-100 dark:border-white/[0.03] px-6 py-5 flex items-center justify-between bg-slate-50/30">
            <div class="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Showing {{ (page - 1) * limit + 1 }}-{{ Math.min(page * limit, total) }} of {{ total }} entries</div>
            <div class="flex items-center gap-1.5">
              <button @click="page > 1 && (page--, fetchData())" :disabled="page === 1" class="h-10 px-4 rounded-xl border border-slate-200 bg-white text-xs font-bold disabled:opacity-30">Previous</button>
              <button @click="page * limit < total && (page++, fetchData())" :disabled="page * limit >= total" class="h-10 px-4 rounded-xl border border-slate-200 bg-white text-xs font-bold disabled:opacity-30">Next</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Users Table -->
      <div v-if="activeTab === 'users'" class="space-y-6">
        <h2 class="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          Telegram Users
          <span class="text-xs font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">{{ users.length }} users</span>
        </h2>
        <div class="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm border-collapse">
              <thead>
                <tr class="bg-slate-50/50 dark:bg-slate-950/30 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                  <th class="px-6 py-5">User</th>
                  <th class="px-6 py-5 text-center">ID</th>
                  <th class="px-6 py-5 text-center">Links</th>
                  <th class="px-6 py-5 text-center">Status</th>
                  <th class="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-white/[0.03]">
                <tr v-for="user in users" :key="user.id" class="group hover:bg-slate-50/50 transition-colors">
                  <td class="px-6 py-5"><div class="flex items-center gap-3"><div class="h-10 w-10 rounded-full bg-sky-500/10 text-sky-500 flex items-center justify-center font-bold">{{ (user.first_name?.[0] || '?').toUpperCase() }}</div><div class="flex flex-col"><span class="font-bold border-slate-900">{{ user.first_name }} {{ user.last_name || '' }}</span><span class="text-xs text-sky-500">@{{ user.username || 'n/a' }}</span></div></div></td>
                  <td class="px-6 py-5 text-center font-mono">{{ user.id }}</td>
                  <td class="px-6 py-5 text-center font-bold">{{ user.link_count }}</td>
                  <td class="px-6 py-5 text-center">
                    <span v-if="user.is_banned" class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-500/10 text-rose-500">
                      <span class="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
                      Banned
                    </span>
                    <span v-else class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-500">
                      <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                      Active
                    </span>
                  </td>
                  <td class="px-6 py-5 text-right">
                    <button 
                      @click="handleUserStatus(user.id, !user.is_banned)" 
                      class="px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                      :class="user.is_banned ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white' : 'bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white'"
                    >
                      {{ user.is_banned ? 'Unban' : 'Ban' }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>

    <!-- Modals & Toasts -->
    <Transition name="slide-up"><div v-if="toast" class="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl bg-slate-900 text-white shadow-2xl z-[100] flex items-center gap-3"><div class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div><span class="text-sm font-bold">{{ toast }}</span></div></Transition>

    <Transition name="fade">
      <div v-if="editModal.show" class="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="editModal.show = false"></div>
        <div class="relative w-full max-w-lg rounded-[2.5rem] bg-white dark:bg-slate-900 p-8 shadow-2xl">
           <h3 class="text-2xl font-black mb-2">Edit Link</h3>
           <textarea v-model="editModal.url" rows="4" class="block w-full rounded-2xl border p-4 text-sm outline-none focus:border-sky-500 mb-4" placeholder="URL"></textarea>
           <div class="flex gap-3"><button @click="editModal.show = false" class="flex-1 py-3 text-sm font-bold border rounded-2xl">Cancel</button><button @click="saveEdit" class="flex-1 bg-sky-500 py-3 text-sm font-black text-white rounded-2xl shadow-lg">Save</button></div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="createModal.show" class="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="createModal.show = false"></div>
        <div class="relative w-full max-w-lg rounded-[2.5rem] bg-white dark:bg-slate-900 p-8 shadow-2xl">
           <h3 class="text-2xl font-black mb-2">Create Link</h3>
           <div class="space-y-4">
             <input v-model="createModal.code" type="text" class="block w-full rounded-2xl border p-4 text-sm font-mono" placeholder="alias" />
             <textarea v-model="createModal.url" rows="3" class="block w-full rounded-2xl border p-4 text-sm" placeholder="destination url"></textarea>
             <div class="flex gap-3"><button @click="createModal.show = false" class="flex-1 py-3 text-sm font-bold border rounded-2xl">Cancel</button><button @click="handleCreate" class="flex-1 bg-sky-500 py-3 text-sm font-black text-white rounded-2xl shadow-lg">Create</button></div>
           </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="qrModal.show" class="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="qrModal.show = false"></div>
        <div class="relative w-full max-w-sm rounded-[2.5rem] bg-white dark:bg-slate-900 p-8 shadow-2xl text-center">
           <h3 class="text-2xl font-black mb-1">QR Code</h3>
           <p class="text-sm text-slate-500 mb-6 font-mono">/{{ qrModal.code }}</p>
           
           <div class="bg-slate-50 dark:bg-white/5 p-4 rounded-3xl inline-block mb-6">
             <img 
               :src="`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(getFullShortUrl(qrModal.code))}`" 
               alt="QR Code"
               class="w-48 h-48"
             />
           </div>

           <button @click="qrModal.show = false" class="w-full py-3 text-sm font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl">Close</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive } from "vue";
import { getStats, getLinks, deleteLink, bulkDeleteLinks, updateLink, createLink, getAnalytics, getUsers, updateUserStatus, exportLinks, logout, verifyLink } from "../services/adminApi";
import {
  Chart as ChartJS, Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale, Filler
} from 'chart.js';
import { Line as LineChart } from 'vue-chartjs';

ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale, Filler);

const stats = ref({ totalLinks: 0, linksToday: 0, totalClicks: 0 });
const links = ref<any[]>([]);
const users = ref<any[]>([]);
const analytics = ref({ dailyCreation: [] as any[], topLinks: [] as any[] });
const total = ref(0);
const page = ref(1);
const limit = ref(20);
const search = ref("");
const sourceFilter = ref("");
const activeTab = ref('links');
const loading = ref(false);
const selectedLinks = ref(new Set<string>());
const deleting = ref<string | null>(null);
const checkingLive = ref(false);
const liveStatuses = reactive<Record<string, { ok: boolean, status: number | null }>>({});
const toast = ref("");

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
  showToast(`Checking ${codes.length} links...`);
  
  for (const code of codes) {
    const link = links.value.find(l => l.code === code);
    if (link) await onCheckLive(link);
  }
  
  checkingLive.value = false;
  showToast("Scan finished!");
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
  scales: { x: { display: false }, y: { beginAtZero: true, grid: { display: false }, ticks: { display: false } } },
  elements: { line: { tension: 0.4, borderColor: '#0ea5e9', borderWidth: 3, fill: true, backgroundColor: 'rgba(14, 165, 233, 0.1)' }, point: { radius: 0 } }
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
  try { showToast("Exporting..."); await exportLinks(); showToast("Done!"); }
  catch (e) { alert("Export failed"); }
}

function openEdit(link: any) { editModal.code = link.code; editModal.url = link.original_url; editModal.show = true; }
async function saveEdit() {
  if (!editModal.url) return;
  try { await updateLink(editModal.code, editModal.url); showToast("Updated!"); editModal.show = false; await fetchData(); }
  catch (e) { alert("Save failed"); }
}

function openCreate() { createModal.code = ""; createModal.url = ""; createModal.show = true; }
function openQR(code: string) { qrModal.code = code; qrModal.show = true; }
async function handleCreate() {
  if (!createModal.code || !createModal.url) return;
  try {
    await createLink({ code: createModal.code.trim(), original_url: createModal.url.trim(), source: "web" });
    showToast("Created!"); createModal.show = false; await fetchData(true);
  } catch (e: any) { alert(e.response?.data?.error || "Create failed"); }
}

async function onDelete(code: string) {
  if (!confirm(`Delete /${code}?`)) return;
  try { await deleteLink(code); showToast("Deleted!"); await fetchData(true); }
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
  if (!confirm(`Permanently delete ${selectedLinks.value.size} selected links?`)) return;
  try {
    await bulkDeleteLinks(Array.from(selectedLinks.value));
    showToast(`${selectedLinks.value.size} links deleted`);
    selectedLinks.value.clear();
    await fetchData(true);
  } catch (e) {
    alert("Bulk delete failed");
  }
}

function handleLogout() { logout(); }
function getFullShortUrl(code: string) { return `${window.location.origin}/r/${code}`; }
async function copy(text: string) { try { await navigator.clipboard.writeText(text); showToast("Copied!"); } catch {} }
function showToast(msg: string) { toast.value = msg; setTimeout(() => toast.value = "", 2000); }
function formatDate(d: string) { return d ? new Date(d).toLocaleDateString() : 'N/A'; }
function formatTime(d: string) { return d ? new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''; }

onMounted(() => fetchData(true));
</script>

<style>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.3s ease; }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translate(-50%, 20px); }
</style>
