<template>
  <div class="space-y-8 pb-12">
    <!-- Stats Header -->
    <header class="animate-in fade-in slide-in-from-top-4 duration-700">
      <div
        class="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4"
      >
        <div>
          <h1
            class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight"
          >
            Admin Dashboard
          </h1>
          <p class="text-slate-500 dark:text-slate-400 mt-1">
            Management and analytics for LinkyBot.
          </p>
        </div>
        <div class="flex items-center gap-3">
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
            @click="fetchData(true)"
            class="inline-flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 text-slate-600 dark:text-slate-400 hover:text-sky-500 dark:hover:text-sky-400 shadow-sm transition-all hover:scale-105 active:scale-95"
            title="Refresh Data"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="w-5 h-5"
              :class="{ 'animate-spin': loading }"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </button>
          <button
            @click="handleLogout"
            class="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 font-semibold text-sm hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-all hover:scale-105 active:scale-95"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          class="group relative overflow-hidden rounded-3xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 p-6 shadow-sm transition-all hover:shadow-xl hover:shadow-sky-500/5"
        >
          <div
            class="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-sky-500/5 group-hover:bg-sky-500/10 transition-colors"
          ></div>
          <p
            class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2"
          >
            Total Links
          </p>
          <div class="flex items-baseline gap-2">
            <p class="text-4xl font-black text-slate-900 dark:text-white">
              {{ stats.totalLinks }}
            </p>
            <span
              class="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full"
              >+{{ stats.linksToday }} today</span
            >
          </div>
        </div>

        <div
          class="group relative overflow-hidden rounded-3xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 p-6 shadow-sm transition-all hover:shadow-xl hover:shadow-emerald-500/5"
        >
          <div
            class="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors"
          ></div>
          <p
            class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2"
          >
            Active Shortlinks
          </p>
          <p class="text-4xl font-black text-emerald-500">
            {{ stats.totalLinks }}
          </p>
        </div>

        <div
          class="group relative overflow-hidden rounded-3xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 p-6 shadow-sm transition-all hover:shadow-xl hover:shadow-amber-500/5"
        >
          <div
            class="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-amber-500/5 group-hover:bg-amber-500/10 transition-colors"
          ></div>
          <p
            class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2"
          >
            Total Engagement
          </p>
          <p class="text-4xl font-black text-amber-500">
            {{ stats.totalClicks }}
            <span class="text-slate-400 text-lg font-medium">clicks</span>
          </p>
        </div>
      </div>
    </header>

    <!-- Links Table Section -->
    <section
      class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 fill-mode-both"
    >
      <div
        class="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <h2
          class="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2"
        >
          URL Management
          <span
            class="text-xs font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full"
            >{{ total }} items</span
          >
        </h2>

        <div class="flex flex-wrap items-center gap-3">
          <div class="relative flex-1 min-w-[240px]">
            <input
              v-model="search"
              @input="debounceSearch"
              type="text"
              placeholder="Search code or destination..."
              class="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="absolute left-3.5 top-3 w-4 h-4 text-slate-400"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </div>

          <div class="flex items-center gap-2">
            <select
              v-model="sourceFilter"
              @change="fetchData(true)"
              class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 py-2.5 px-4 text-sm outline-none focus:border-sky-500 transition-all appearance-none pr-10 relative cursor-pointer"
            >
              <option value="">All Sources</option>
              <option value="web">Web App</option>
              <option value="telegram">Telegram Bot</option>
            </select>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-white/5 overflow-hidden shadow-xl shadow-slate-200/20 dark:shadow-none"
      >
        <div class="overflow-x-auto min-h-[400px]">
          <table class="w-full text-left text-sm border-collapse">
            <thead>
              <tr
                class="bg-slate-50/50 dark:bg-slate-950/30 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest text-[10px]"
              >
                <th class="px-6 py-5">Code & Link</th>
                <th class="px-6 py-5">Original Destination</th>
                <th class="px-6 py-5 text-center">Source</th>
                <th class="px-6 py-5 text-center">Engagement</th>
                <th class="px-6 py-5">Created</th>
                <th class="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-white/[0.03]">
              <tr
                v-for="link in links"
                :key="link.code"
                class="group hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors"
                :class="{
                  'opacity-50 pointer-events-none': deleting === link.code,
                }"
              >
                <td class="px-6 py-5">
                  <div class="flex flex-col gap-0.5">
                    <span
                      class="font-black text-slate-900 dark:text-white group-hover:text-sky-500 transition-colors font-mono"
                      >/{{ link.code }}</span
                    >
                    <div class="flex items-center gap-2">
                      <span
                        class="text-[10px] text-slate-400 truncate max-w-[120px]"
                        >{{ getFullShortUrl(link.code) }}</span
                      >
                      <button
                        @click="copy(getFullShortUrl(link.code))"
                        class="text-slate-300 hover:text-sky-500 transition-colors"
                        title="Copy URL"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          class="w-3 h-3"
                        >
                          <path
                            d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z"
                          />
                          <path
                            d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-5">
                  <div class="max-w-xs xl:max-w-md">
                    <a
                      :href="link.original_url"
                      target="_blank"
                      class="text-slate-600 dark:text-slate-400 hover:text-sky-500 truncate block transition-colors underline-offset-4 decoration-sky-500/30"
                      :title="link.original_url"
                    >
                      {{ link.original_url }}
                    </a>
                  </div>
                </td>
                <td class="px-6 py-5 text-center">
                  <span
                    class="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors"
                    :class="
                      link.source === 'telegram'
                        ? 'bg-blue-500/10 text-blue-500'
                        : 'bg-slate-500/10 text-slate-500'
                    "
                  >
                    {{ link.source }}
                  </span>
                </td>
                <td class="px-6 py-5 text-center">
                  <span class="font-bold text-slate-700 dark:text-slate-300">{{
                    link.clicks
                  }}</span>
                </td>
                <td class="px-6 py-5">
                  <div class="flex flex-col">
                    <span
                      class="text-slate-700 dark:text-slate-300 font-medium"
                      >{{ formatDate(link.created_at) }}</span
                    >
                    <span
                      class="text-[10px] text-slate-400 uppercase tracking-widest"
                      >{{ formatTime(link.created_at) }}</span
                    >
                  </div>
                </td>
                <td class="px-6 py-5 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button
                      @click="openEdit(link)"
                      class="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-white/5 text-slate-400 hover:bg-sky-500 hover:text-white transition-all hover:scale-110 active:scale-90"
                      title="Edit Destination"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                      </svg>
                    </button>
                    <button
                      @click="onDelete(link.code)"
                      class="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-white/5 text-slate-400 hover:bg-rose-500 hover:text-white transition-all hover:scale-110 active:scale-90"
                      title="Delete Link"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        class="w-4 h-4"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="m14.74 9-.34 12m-4.72 0-.34-12M4.5 6.336a.81.81 0 0 1 .81-.806h1.259a.81.81 0 1 1 0 1.621H4.5m1.611 0 a.81.81 0 0 1 .803-.806h1.259a.81.81 0 0 1 0 1.621H6.111M4.5 6.336L21 6.336m-16.5 0A40.354 40.354 0 0 1 12 4.5c4.153 0 7.424 1.137 10.5 4.336m-15 0a40.353 40.353 0 0 0 8.854 1.706"
                        />
                      </svg>
                    </button>
                    <a
                      :href="`/r/${link.code}`"
                      target="_blank"
                      class="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-white/5 text-slate-400 hover:bg-sky-500 hover:text-white transition-all hover:scale-110 active:scale-90"
                      title="Visit Link"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        class="w-4 h-4"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                        />
                      </svg>
                    </a>
                  </div>
                </td>
              </tr>
              <tr v-if="!loading && links.length === 0">
                <td colspan="6" class="px-6 py-24 text-center">
                  <div class="flex flex-col items-center gap-3">
                    <div
                      class="h-16 w-16 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-600"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-8 h-8"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                        />
                      </svg>
                    </div>
                    <p class="text-slate-500 dark:text-slate-400 font-medium">
                      No results found for your search.
                    </p>
                    <button
                      @click="resetFilters"
                      class="text-sky-500 text-sm font-bold hover:underline"
                    >
                      Clear all filters
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Premium Pagination -->
        <div
          class="border-t border-slate-100 dark:border-white/[0.03] px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/30 dark:bg-slate-950/20"
        >
          <div
            class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest"
          >
            Showing
            <span class="text-slate-900 dark:text-slate-300"
              >{{ (page - 1) * limit + 1 }}-{{
                Math.min(page * limit, total)
              }}</span
            >
            of {{ total }} entries
          </div>

          <div class="flex items-center gap-1.5">
            <button
              @click="page > 1 && (page--, fetchData())"
              :disabled="page === 1"
              class="h-10 px-4 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 text-xs font-bold text-slate-600 dark:text-slate-400 hover:border-sky-500 hover:text-sky-500 disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              Previous
            </button>

            <div class="flex items-center gap-1 mx-2">
              <button
                v-for="p in visiblePages"
                :key="p"
                @click="p !== '...' && goToPage(p as number)"
                class="h-8 w-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all"
                :class="
                  p === page
                    ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                    : p === '...'
                      ? 'text-slate-400 cursor-default'
                      : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                "
              >
                {{ p }}
              </button>
            </div>

            <button
              @click="page * limit < total && (page++, fetchData())"
              :disabled="page * limit >= total"
              class="h-10 px-4 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 text-xs font-bold text-slate-600 dark:text-slate-400 hover:border-sky-500 hover:text-sky-500 disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Toast-like notification -->
    <Transition name="slide-up">
      <div
        v-if="toast"
        class="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xl z-[100] flex items-center gap-3 border border-white/10 dark:border-slate-900/10"
      >
        <div class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
        <span class="text-sm font-bold">{{ toast }}</span>
      </div>
    </Transition>

    <!-- Edit Modal -->
    <Transition name="fade">
      <div v-if="editModal.show" class="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="editModal.show = false"></div>
        <div class="relative w-full max-w-lg rounded-[2.5rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
           <h3 class="text-2xl font-black text-slate-900 dark:text-white mb-2">Edit Link</h3>
           <p class="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">Update the destination URL for <span class="text-sky-500 font-mono">/{{ editModal.code }}</span></p>
           
           <div class="space-y-4">
              <div class="space-y-1.5">
                 <label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Original URL</label>
                 <textarea
                   v-model="editModal.url"
                   rows="4"
                   class="block w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 py-3 px-4 text-sm text-slate-900 dark:text-white outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all resize-none"
                   placeholder="https://example.com/very-long-url-to-redirect-to"
                 ></textarea>
              </div>
              
              <div class="flex gap-3 pt-2">
                 <button
                   @click="editModal.show = false"
                   class="flex-1 rounded-2xl border border-slate-200 dark:border-slate-800 py-3 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
                 >
                   Cancel
                 </button>
                 <button
                   @click="saveEdit"
                   :disabled="editModal.saving"
                   class="flex-1 rounded-2xl bg-sky-500 py-3 text-sm font-black text-white shadow-xl shadow-sky-500/20 hover:bg-sky-400 disabled:opacity-50 transition-all"
                 >
                   {{ editModal.saving ? 'Saving...' : 'Update Destination' }}
                 </button>
              </div>
           </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive } from "vue";
import { getStats, getLinks, deleteLink, updateLink, exportLinks, logout } from "../services/adminApi";

const stats = ref({ totalLinks: 0, linksToday: 0, totalClicks: 0 });
const links = ref<any[]>([]);
const total = ref(0);
const page = ref(1);
const limit = ref(20);
const search = ref("");
const sourceFilter = ref("");
const loading = ref(false);
const deleting = ref<string | null>(null);
const toast = ref("");
const editModal = reactive({
  show: false,
  code: "",
  url: "",
  saving: false
});
let searchTimeout: any;

function debounceSearch() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    page.value = 1;
    fetchData();
  }, 400);
}

async function handleExport() {
  try {
    showToast("Preparing export...");
    await exportLinks();
    showToast("Export complete!");
  } catch (e) {
    alert("Failed to export links");
  }
}

function openEdit(link: any) {
  editModal.code = link.code;
  editModal.url = link.original_url;
  editModal.show = true;
}

async function saveEdit() {
  if (!editModal.url) return;
  editModal.saving = true;
  try {
    await updateLink(editModal.code, editModal.url);
    showToast(`/${editModal.code} updated successfully`);
    editModal.show = false;
    await fetchData();
  } catch (e) {
    alert("Failed to update link");
  } finally {
    editModal.saving = false;
  }
}

async function fetchData(withStats = false) {
  loading.value = true;
  try {
    const [res, s] = await Promise.all([
      getLinks({
        page: page.value,
        limit: limit.value,
        search: search.value,
        source: sourceFilter.value,
      }),
      withStats ? getStats() : Promise.resolve(null),
    ]);

    links.value = res.data;
    total.value = res.total;
    if (s) stats.value = s;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
}

async function onDelete(code: string) {
  if (
    !confirm(
      `Permanently delete the shortlink /${code}? This action cannot be undone.`,
    )
  )
    return;

  deleting.value = code;
  try {
    await deleteLink(code);
    showToast(`Link /${code} deleted successfully`);
    await fetchData(true);
  } catch (e) {
    alert("Failed to delete link");
  } finally {
    deleting.value = null;
  }
}

function resetFilters() {
  search.value = "";
  sourceFilter.value = "";
  page.value = 1;
  fetchData();
}

function handleLogout() {
  logout();
}

function getFullShortUrl(code: string) {
  return `${window.location.origin}/r/${code}`;
}

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    showToast("Copied to clipboard!");
  } catch {
    /* ignore */
  }
}

function showToast(msg: string) {
  toast.value = msg;
  setTimeout(() => (toast.value = ""), 3000);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function goToPage(p: number) {
  page.value = p;
  fetchData();
}

const visiblePages = computed(() => {
  const totalPages = Math.ceil(total.value / limit.value);
  if (totalPages <= 7)
    return Array.from({ length: totalPages }, (_, i) => i + 1);

  if (page.value <= 4) return [1, 2, 3, 4, 5, "...", totalPages];
  if (page.value >= totalPages - 3)
    return [
      1,
      "...",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];

  return [
    1,
    "...",
    page.value - 1,
    page.value,
    page.value + 1,
    "...",
    totalPages,
  ];
});

onMounted(async () => {
  try {
    const s = await getStats();
    stats.value = s;
    await fetchData();
  } catch (e) {
    // Auth guard handles redirect
  }
});
</script>

<style>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from {
  opacity: 0;
  transform: translate(-50%, 20px);
}
.slide-up-leave-to {
  opacity: 0;
  transform: translate(-50%, 20px);
}

/* Animation utilities from Tailwind 3.x if not available */
@keyframes slide-in-from-top {
  from {
    transform: translateY(-1rem);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
@keyframes slide-in-from-bottom {
  from {
    transform: translateY(1rem);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
.animate-in {
  animation-duration: 0.5s;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-in {
  animation-name: fade-in;
}
.slide-in-from-top-4 {
  animation-name: slide-in-from-top;
}
.slide-in-from-bottom-4 {
  animation-name: slide-in-from-bottom;
}
.fill-mode-both {
  animation-fill-mode: both;
}
.delay-150 {
  animation-delay: 150ms;
}
</style>
