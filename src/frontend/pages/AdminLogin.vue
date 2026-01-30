<template>
  <div class="min-h-[80vh] flex items-center justify-center p-4">
    <div
      class="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-1000"
    >
      <div
        class="relative overflow-hidden rounded-[2.5rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 p-10 shadow-2xl shadow-sky-500/10 dark:shadow-none"
      >
        <div class="absolute top-8 right-8 z-10">
          <ThemeToggle />
        </div>
        <!-- Decoration -->
        <div
          class="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-sky-500/5 blur-3xl"
        ></div>
        <div
          class="absolute -left-12 -bottom-12 h-40 w-40 rounded-full bg-indigo-500/5 blur-3xl"
        ></div>

        <div class="relative text-center mb-10">
          <div
            class="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl mb-6 transform hover:rotate-12 transition-transform duration-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-8 h-8"
            >
              <path
                fill-rule="evenodd"
                d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <h1
            class="text-3xl font-black text-slate-900 dark:text-white tracking-tight"
          >
            Restricted Access
          </h1>
          <p class="text-slate-500 dark:text-slate-400 mt-3 font-medium">
            Enter the master token to access the control panel.
          </p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6 relative">
          <div class="space-y-2">
            <label
              class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1"
              >Secret Token</label
            >
            <input
              v-model="token"
              type="password"
              placeholder="••••••••••••••••"
              class="block w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 py-4 px-5 text-sm text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 outline-none transition-all"
              required
            />
          </div>

          <button
            type="submit"
            class="w-full rounded-2xl bg-sky-500 py-4 text-sm font-black text-white shadow-xl shadow-sky-500/20 hover:bg-sky-400 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100"
            :disabled="loading"
          >
            <span v-if="!loading">Unlock Dashboard</span>
            <span v-else class="flex items-center justify-center gap-2">
              <svg
                class="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Authenticating...
            </span>
          </button>

          <p
            v-if="error"
            class="text-xs text-rose-500 text-center font-bold animate-bounce mt-4"
          >
            {{ error }}
          </p>
        </form>

        <div class="mt-10 text-center">
          <router-link
            to="/"
            class="text-xs font-bold text-slate-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              class="w-4 h-4"
            >
              <path
                fill-rule="evenodd"
                d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
                clip-rule="evenodd"
              />
            </svg>
            Return Home
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import ThemeToggle from "../components/ThemeToggle.vue";
import { login } from "../services/adminApi";

const router = useRouter();
const token = ref("");
const loading = ref(false);
const error = ref("");

async function handleLogin() {
  loading.value = true;
  error.value = "";

  try {
    const success = await login(token.value);
    if (success) {
      router.push("/admin");
    } else {
      error.value = "Invalid token provided";
    }
  } catch (e) {
    error.value = "Authentication failed";
  } finally {
    loading.value = false;
  }
}
</script>
