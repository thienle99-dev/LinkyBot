<template>
  <div
    class="min-h-screen flex flex-col transition-colors duration-300 bg-white dark:bg-slate-950 font-sans selection:bg-sky-500/30"
  >
    <!-- Navigation Header -->
    <header
      class="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-50"
    >
      <div
        class="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4"
      >
        <router-link to="/" class="flex items-center gap-3 group">
          <div
            class="h-8 w-8 rounded-lg bg-sky-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-sky-500/30 group-hover:scale-110 transition-transform"
          >
            S
          </div>
          <div>
            <h1
              class="text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100 group-hover:text-sky-500 transition-colors"
            >
              Shortlink
            </h1>
          </div>
        </router-link>

        <div class="flex items-center gap-4">
          <ThemeToggle />
          <nav class="hidden sm:flex items-center gap-4">
            <router-link
              to="/admin"
              class="text-xs font-medium text-slate-500 hover:text-sky-500 dark:text-slate-400 dark:hover:text-sky-400 transition-colors"
            >
              Admin
            </router-link>
            <a
              href="https://github.com/thienle99-dev/LinkyBot"
              target="_blank"
              class="text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
            >
              GitHub
            </a>
          </nav>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col">
      <div class="max-w-5xl w-full mx-auto px-4 py-8">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>

    <!-- Footer -->
    <footer
      class="border-t border-slate-200 dark:border-slate-800 py-8 bg-slate-50/50 dark:bg-slate-900/50 mt-auto"
    >
      <div class="max-w-5xl mx-auto px-4 text-center">
        <p class="text-sm text-slate-500 dark:text-slate-400">
          &copy; {{ new Date().getFullYear() }} Shortlink. Built with precision
          and care.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import ThemeToggle from "./components/ThemeToggle.vue";
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(5px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

/* Global transitions */
* {
  transition-property:
    background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>
