<script setup>
import { toast } from './utils/api';
</script>

<template>
  <transition name="toast">
    <div v-if="toast.show" 
         :class="['fixed top-4 md:top-6 left-1/2 transform -translate-x-1/2 z-[100] px-4 md:px-6 py-2 md:py-3 rounded-full shadow-lg font-bold flex items-center gap-2 text-xs md:text-sm text-white transition-all', 
         toast.type === 'error' ? 'bg-red-500' : toast.type === 'info' ? 'bg-slate-800' : 'bg-emerald-500']">
      <span>{{ toast.type === 'error' ? '⚠️' : toast.type === 'info' ? 'ℹ️' : '✅' }}</span>
      {{ toast.message }}
    </div>
  </transition>

  <router-view />
</template>
