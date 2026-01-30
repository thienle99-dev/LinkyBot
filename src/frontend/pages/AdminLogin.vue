<template>
  <div class="h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-900 transition-colors">
    <div class="w-full max-w-sm rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-8 shadow-2xl shadow-sky-500/5">
      <div class="text-center mb-8">
        <div class="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 dark:bg-slate-800 text-white shadow-lg shadow-slate-900/10 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
            <path fill-rule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clip-rule="evenodd" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Admin Login
        </h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-2">
          Enter your secret token to continue
        </p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div class="space-y-2">
          <input
            v-model="token"
            type="password"
            placeholder="Secret Token"
            class="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 py-3 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 outline-none transition-all"
            required
          />
        </div>
        
        <button
          type="submit"
          class="w-full rounded-xl bg-sky-500 py-3 text-sm font-bold text-white shadow-lg shadow-sky-500/25 hover:bg-sky-400 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:hover:scale-100"
          :disabled="loading"
        >
          {{ loading ? 'Checking...' : 'Enter Dashboard' }}
        </button>

        <p v-if="error" class="text-xs text-rose-500 text-center font-medium animate-pulse">
          {{ error }}
        </p>
      </form>
      
      <div class="mt-6 text-center">
         <router-link to="/" class="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
            ← Back to Home
         </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
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
      error.value = "Invalid token";
    }
  } catch (e) {
    error.value = "Login failed";
  } finally {
    loading.value = false;
  }
}
</script>
