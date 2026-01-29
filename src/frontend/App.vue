<template>
  <div class="min-h-screen flex flex-col transition-colors duration-300">
    <header class="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-50">
      <div class="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="h-8 w-8 rounded-lg bg-sky-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-sky-500/30">
            S
          </div>
          <div>
            <h1 class="text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100">
              Shortlink
            </h1>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <ThemeToggle />
          <a
            href="https://github.com/thienle99-dev/LinkyBot"
            target="_blank"
            class="text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors hidden sm:block"
          >
            GitHub
          </a>
        </div>
      </div>
    </header>

    <main class="flex-1 flex flex-col">
      <div class="max-w-4xl w-full mx-auto px-4 py-12 space-y-10 flex-1 flex flex-col justify-center">
        
        <div class="text-center space-y-4 max-w-2xl mx-auto">
          <h2 class="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight text-balance">
            Shorten your links, <span class="bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent">expand your reach</span>.
          </h2>
          <p class="text-lg text-slate-600 dark:text-slate-400 leading-relaxed text-balance">
            A production-grade URL shortener built with Vue 3, Serverless Functions, and PostgreSQL. Integrated seamlessly with Telegram.
          </p>
        </div>

        <section
          class="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] items-start pt-4"
        >
          <ShortenerForm @short-created="onShortCreated" />

          <div class="space-y-6">
             <article class="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 transition-all hover:shadow-xl hover:shadow-sky-500/5 hover:-translate-y-1">
              <div class="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-sky-500/10 blur-2xl transition-all group-hover:bg-sky-500/20"></div>
              
              <h2 class="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-3">
                <span class="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100 dark:bg-sky-500/20 text-sky-600 dark:text-sky-300">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
                    <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z" />
                    <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z" />
                  </svg>
                </span>
                Telegram Bot
              </h2>
              <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Chat with our bot to shorten links instantly from Telegram. It validates urls, stores them securely, and replies in seconds.
              </p>
              <div class="relative group/code">
                <div class="absolute inset-0 bg-gradient-to-r from-sky-500/10 to-indigo-500/10 rounded-xl opacity-0 group-hover/code:opacity-100 transition-opacity"></div>
                <pre class="text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 overflow-x-auto font-mono text-slate-600 dark:text-slate-400">
✅ Short link created:
<span class="text-sky-600 dark:text-sky-400">https://sl0.vercel.app/abc123</span></pre>
              </div>
            </article>

            <section v-if="recentShorts.length" class="space-y-4 pt-4">
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-semibold text-slate-900 dark:text-slate-200">
                  Recent Links
                </h3>
                <span class="text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">{{ recentShorts.length }}</span>
              </div>
              <ul class="space-y-2">
                <TransitionGroup name="list">
                  <li
                    v-for="item in recentShorts"
                    :key="item.code"
                    class="group flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 hover:border-sky-500/30 dark:hover:border-sky-500/30 transition-all shadow-sm shadow-slate-200/50 dark:shadow-none"
                  >
                    <div class="h-10 w-10 shrink-0 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-lg">
                      🔗
                    </div>
                    <div class="min-w-0 flex-1">
                      <div class="flex items-center gap-2">
                         <a
                          :href="item.shortUrl"
                          target="_blank"
                          class="font-medium text-sky-600 dark:text-sky-400 hover:underline truncate text-sm block"
                        >
                          {{ item.shortUrl.replace(/^https?:\/\//, '') }}
                        </a>
                      </div>
                      <p class="text-xs text-slate-500 dark:text-slate-500 truncate max-w-[200px]">
                        {{ item.longUrl }}
                      </p>
                    </div>
                    <button
                      class="shrink-0 h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-500/10 transition-colors"
                      title="Copy to clipboard"
                      @click="copy(item.shortUrl)"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                        <path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z" />
                        <path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z" />
                      </svg>
                    </button>
                  </li>
                </TransitionGroup>
              </ul>
            </section>
          </div>
        </section>
      </div>
      
      <footer class="border-t border-slate-200 dark:border-slate-800 py-6 mt-auto">
        <div class="max-w-4xl mx-auto px-4 text-center">
          <p class="text-sm text-slate-500 dark:text-slate-400">
            &copy; {{ new Date().getFullYear() }} Shortlink. Open source project.
          </p>
        </div>
      </footer>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ShortenerForm from "./components/ShortenerForm.vue";
import ThemeToggle from "./components/ThemeToggle.vue";

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
    // Could add a toast here
  } catch {
    // ignore
  }
}
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>

