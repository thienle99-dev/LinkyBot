<template>
  <div class="space-y-8 animate-fade-in pb-12">
    <!-- Stats Header -->
    <header>
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Dashboard</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400">Overview of your shortlink service</p>
        </div>
        <button
          @click="handleLogout"
          class="text-xs font-medium text-rose-500 hover:text-rose-600 px-3 py-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
        >
          Sign Out
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <p class="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Total Links</p>
          <p class="text-3xl font-bold text-slate-900 dark:text-white">{{ stats.totalLinks }}</p>
        </div>
        <div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <p class="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Created Today</p>
          <p class="text-3xl font-bold text-emerald-500">{{ stats.linksToday }}</p>
        </div>
        <!-- Clicks might be 0 if not fully implemented in DB function yet, but UI is ready -->
        <div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <p class="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Total Clicks</p>
           <p class="text-3xl font-bold text-sky-500">{{ stats.totalClicks }}</p>
        </div>
      </div>
    </header>

    <!-- Links Table -->
    <section class="space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 class="text-lg font-bold text-slate-900 dark:text-white">All Links</h2>
        
        <div class="flex items-center gap-2">
          <input
            v-model="search"
            @input="debounceSearch"
            type="text"
            placeholder="Search code or URL..."
            class="w-full sm:w-64 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2 px-3 text-sm outline-none focus:border-sky-500 transition-colors"
          />
          <select
            v-model="sourceFilter"
            @change="fetchData"
            class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2 px-3 text-sm outline-none focus:border-sky-500 transition-colors"
          >
            <option value="">All Sources</option>
            <option value="web">Web</option>
            <option value="telegram">Telegram</option>
          </select>
        </div>
      </div>

      <div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-slate-50 dark:bg-slate-950/50 text-slate-500 dark:text-slate-400 font-medium">
              <tr>
                <th class="px-4 py-3 min-w-[100px]">Code</th>
                <th class="px-4 py-3 min-w-[200px]">Original URL</th>
                <th class="px-4 py-3 w-20">Source</th>
                <th class="px-4 py-3 w-20">Clicks</th>
                <th class="px-4 py-3 min-w-[140px]">Created</th>
                <th class="px-4 py-3 w-20 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr 
                v-for="link in links" 
                :key="link.code"
                class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <td class="px-4 py-3 font-mono text-sky-600 dark:text-sky-400">
                  <a :href="`/r/${link.code}`" target="_blank" class="hover:underline">{{ link.code }}</a>
                </td>
                <td class="px-4 py-3 max-w-xs truncate text-slate-600 dark:text-slate-300" :title="link.original_url">
                  {{ link.original_url }}
                </td>
                <td class="px-4 py-3">
                  <span 
                    class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
                    :class="link.source === 'telegram' ? 'bg-blue-50 text-blue-700 ring-blue-700/10 dark:bg-blue-900/20 dark:text-blue-400 dark:ring-blue-400/20' : 'bg-slate-50 text-slate-700 ring-slate-600/10 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-400/20'"
                  >
                    {{ link.source }}
                  </span>
                </td>
                <td class="px-4 py-3 text-slate-900 dark:text-white font-medium">
                  {{ link.clicks }}
                </td>
                <td class="px-4 py-3 text-slate-500 text-xs">
                  {{ new Date(link.created_at).toLocaleDateString() }}
                </td>
                <td class="px-4 py-3 text-right">
                  <button
                    @click="onDelete(link.code)"
                    class="text-rose-500 hover:text-rose-700 p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                    title="Delete Link"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                      <path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </td>
              </tr>
              <tr v-if="links.length === 0">
                <td colspan="6" class="px-4 py-12 text-center text-slate-500 dark:text-slate-400">
                  No links found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div class="border-t border-slate-100 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
           <span class="text-xs text-slate-500">
             Page {{ page }} of {{ Math.ceil(total / limit) }} (Total {{ total }})
           </span>
           <div class="flex gap-2">
             <button
               @click="page > 1 && (page--, fetchData())"
               :disabled="page === 1"
               class="px-3 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
             >
               Previous
             </button>
             <button
               @click="page * limit < total && (page++, fetchData())"
               :disabled="page * limit >= total"
               class="px-3 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
             >
               Next
             </button>
           </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getStats, getLinks, deleteLink, logout } from "../services/adminApi";

const stats = ref({ totalLinks: 0, linksToday: 0, totalClicks: 0 });
const links = ref<any[]>([]);
const total = ref(0);
const page = ref(1);
const limit = ref(20);
const search = ref("");
const sourceFilter = ref("");
let searchTimeout: any;

function debounceSearch() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    page.value = 1;
    fetchData();
  }, 400);
}

async function fetchData() {
  try {
    const res = await getLinks({
      page: page.value,
      limit: limit.value,
      search: search.value,
      source: sourceFilter.value
    });
    links.value = res.data;
    total.value = res.total;
  } catch (e) {
    console.error(e);
  }
}

async function onDelete(code: string) {
  if (!confirm(`Are you sure you want to delete /${code}?`)) return;
  try {
    await deleteLink(code);
    await fetchData();
    // Refresh stats lightly
    const s = await getStats();
    stats.value = s;
  } catch (e) {
    alert("Failed to delete link");
  }
}

function handleLogout() {
  logout();
}

onMounted(async () => {
  try {
    const s = await getStats();
    stats.value = s;
    await fetchData();
  } catch (e) {
    // If auth failed, redirect likely happened or will happen
  }
});
</script>

<style>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.4s ease-out;
}
</style>
