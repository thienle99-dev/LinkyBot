<template>
  <section
    class="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-[0_18px_70px_rgba(15,23,42,0.7)]"
  >
    <h2 class="text-base font-semibold text-slate-100 mb-1">
      Create a short link
    </h2>
    <p class="text-xs text-slate-400 mb-5">
      Paste a long URL and we will generate a production‑ready short link backed by a serverless
      API.
    </p>

    <form class="space-y-4" @submit.prevent="handleSubmit">
      <div class="space-y-2">
        <label class="block text-xs font-medium text-slate-300">
          Long URL
        </label>
        <div
          class="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500/70"
        >
          <input
            v-model="url"
            type="url"
            required
            placeholder="https://example.com/very/long/url..."
            class="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-500"
          />
          <button
            type="submit"
            class="inline-flex items-center justify-center rounded-lg bg-sky-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-sky-400 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            :disabled="loading"
          >
            <span v-if="!loading">Shorten URL</span>
            <span v-else>Shortening…</span>
          </button>
        </div>
        <p v-if="error" class="text-xs text-rose-400">
          {{ error }}
        </p>
      </div>
    </form>

    <p class="mt-4 text-[11px] text-slate-500">
      This form calls the <code class="font-mono text-sky-300">POST /api/shorten</code> endpoint,
      which validates the URL, generates a <code class="font-mono text-sky-300">shortCode</code>,
      stores it, and returns the final short link.
    </p>
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

