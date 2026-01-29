<template>
  <section
    class="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-2xl shadow-slate-200/50 dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] transition-all"
  >
    <div class="mb-6">
       <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-500 mb-4 flex items-center justify-center shadow-lg shadow-sky-500/30">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-white">
          <path fill-rule="evenodd" d="M19.902 4.098a3.75 3.75 0 00-5.304 0l-4.5 4.5a3.75 3.75 0 001.035 6.037.75.75 0 01-.646 1.353 5.25 5.25 0 01-1.449-8.45l4.5-4.5a5.25 5.25 0 117.424 7.424l-1.757 1.757a.75.75 0 11-1.06-1.06l1.757-1.757a3.75 3.75 0 000-5.304zm-7.389 4.291a3.75 3.75 0 005.304 0l4.5-4.5a3.75 3.75 0 00-1.035-6.037.75.75 0 01.646-1.353 5.25 5.25 0 011.449 8.45l-4.5 4.5a5.25 5.25 0 11-7.424-7.424l1.757-1.757a.75.75 0 111.06 1.06l-1.757 1.757a3.75 3.75 0 000 5.304z" clip-rule="evenodd" />
        </svg>
       </div>
      <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-2">
        New Short Link
      </h2>
      <p class="text-sm text-slate-500 dark:text-slate-400">
        Paste a long URL to generate a secure, production-ready short link.
      </p>
    </div>

    <form class="space-y-6" @submit.prevent="handleSubmit">
      <div class="space-y-3">
        <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1">
          Destination URL
        </label>
        <div
          class="relative group"
        >
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 text-slate-400 group-focus-within:text-sky-500 transition-colors">
              <path d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3z" />
              <path d="M11.603 7.961a.75.75 0 00-1.06 1.06l1.224 1.225a1 1 0 001.414-1.414l-1.224-1.225a.75.75 0 00-1.06 1.06l.707.708a2.5 2.5 0 003.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3z" />
            </svg>
          </div>
          <input
            v-model="url"
            type="url"
            required
            placeholder="https://example.com/very/long/url"
            class="block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 py-3.5 pl-11 pr-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-sky-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-sky-500/10 outline-none transition-all duration-200"
          />
        </div>
      </div>
      
      <button
        type="submit"
        class="relative w-full overflow-hidden rounded-xl bg-slate-900 dark:bg-white py-3.5 text-sm font-bold text-white dark:text-slate-900 shadow-xl shadow-slate-900/10 dark:shadow-white/5 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 transition-all duration-200"
        :disabled="loading"
      >
        <span v-if="!loading" class="flex items-center justify-center gap-2">
          Shorten URL
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
            <path fill-rule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.5a.75.75 0 010 1.08l-5.5 5.5a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clip-rule="evenodd" />
          </svg>
        </span>
        <span v-else class="flex items-center justify-center gap-2">
          <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Creating Link…
        </span>
      </button>

      <div v-if="error" class="rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 p-4 flex items-center gap-3">
         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 text-rose-500">
           <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
         </svg>
        <p class="text-sm font-medium text-rose-600 dark:text-rose-400">
          {{ error }}
        </p>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { shortenUrl } from "../services/api";

const emit = defineEmits<{
  (e: "short-created", payload: { code: string; shortUrl: string; longUrl: string }): void;
}>();

const url = ref("");
const loading = ref(false);
const error = ref<string | null>(null);

async function handleSubmit() {
  error.value = null;
  loading.value = true;
  try {
    const result = await shortenUrl(url.value);
    emit("short-created", {
      code: result.code,
      shortUrl: result.shortUrl,
      longUrl: url.value
    });
    url.value = "";
  } catch (e: any) {
    error.value = e?.message ?? "Failed to create short link.";
  } finally {
    loading.value = false;
  }
}
</script>

