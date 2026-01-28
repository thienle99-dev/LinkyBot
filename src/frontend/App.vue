<template>
  <div class="min-h-screen flex flex-col">
    <header class="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
      <div class="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <div>
          <h1 class="text-xl font-semibold tracking-tight">
            Shortlink
          </h1>
          <p class="text-sm text-slate-400">
            URL Shortener with Telegram Bot integration
          </p>
        </div>
        <span class="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300 border border-emerald-500/30">
          Production‑ready architecture
        </span>
      </div>
    </header>

    <main class="flex-1">
      <div class="max-w-4xl mx-auto px-4 py-10 space-y-8">
        <section
          class="grid gap-8 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] items-start"
        >
          <ShortenerForm @short-created="onShortCreated" />

          <article class="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
            <h2 class="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <span class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-500/20 text-sky-300 text-xs">
                🤖
              </span>
              Telegram Bot Flow
            </h2>
            <p class="text-xs text-slate-400 leading-relaxed">
              Send a URL to your bot in Telegram. The webhook handler validates the URL, generates a
              short code, stores it in the database, and replies with the short link, e.g:
            </p>
            <pre class="text-xs bg-slate-950/60 border border-slate-800 rounded-xl p-3 overflow-x-auto">
<code>✅ Short link created:
https://sl0.vercel.appabc123</code>
            </pre>
          </article>
        </section>

        <section v-if="recentShorts.length" class="space-y-3">
          <h2 class="text-sm font-semibold text-slate-200">
            Recently created links
          </h2>
          <ul class="space-y-2">
            <li
              v-for="item in recentShorts"
              :key="item.code"
              class="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 flex flex-col gap-1 text-sm"
            >
              <div class="flex items-center justify-between gap-3">
                <a
                  class="font-medium text-sky-300 hover:text-sky-200 truncate"
                  :href="item.shortUrl"
                  target="_blank"
                  rel="noreferrer"
                >
                  {{ item.shortUrl }}
                </a>
                <button
                  class="text-xs px-2 py-1 rounded-md border border-slate-700 text-slate-300 hover:bg-slate-800"
                  type="button"
                  @click="copy(item.shortUrl)"
                >
                  Copy
                </button>
              </div>
              <p class="text-xs text-slate-400 truncate">
                {{ item.longUrl }}
              </p>
            </li>
          </ul>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ShortenerForm from "./components/ShortenerForm.vue";

interface ShortItem {
  code: string;
  shortUrl: string;
  longUrl: string;
}

const recentShorts = ref<ShortItem[]>([]);

function onShortCreated(payload: ShortItem) {
  recentShorts.value = [payload, ...recentShorts.value].slice(0, 5);
}

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // ignore
  }
}
</script>

