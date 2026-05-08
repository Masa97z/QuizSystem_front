<template>
  <div class="flex h-screen w-full overflow-hidden bg-brand-50/30" dir="rtl">
    
    <!-- Overlay for mobile -->
    <div v-if="sidebarOpen" @click="sidebarOpen = false" class="fixed inset-0 bg-black/30 z-20 md:hidden"></div>
    
    <!-- Sidebar -->
    <aside :class="['bg-white/90 backdrop-blur-xl border-l border-brand-100 h-screen flex flex-col shadow-xl z-30 shrink-0 w-full md:w-72 transition-transform duration-300 fixed md:static left-0 top-0', sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0']">
      <div class="h-16 md:h-20 flex items-center justify-between md:justify-center border-b border-brand-50 px-4">
        <div class="flex items-center gap-2 md:gap-0">
          <div >
<img 
  src="/src/assets/logo_png.png" 
  alt="logo" 
  class="h-10 md:h-12 object-contain"
/>            </div>
          <span class="mr-2 md:mr-3 font-extrabold text-brand-900 text-sm md:text-lg">لوحة التحكم</span>
        </div>
        <button @click="sidebarOpen = false" class="md:hidden text-brand-500 hover:text-brand-700 text-xl">✕</button>
      </div>

      <nav class="flex-1 p-3 md:p-4 space-y-1 md:space-y-2 overflow-y-auto custom-scrollbar">
        <router-link v-for="item in menuItems" :key="item.id" :to="item.path" @click="sidebarOpen = false"
           class="w-full flex items-center gap-3 md:gap-4 px-3 py-2 md:py-3 rounded-xl transition-all duration-200 text-brand-600 hover:bg-brand-50 text-sm md:text-base"
           active-class="bg-brand-500 text-white shadow-lg shadow-brand-200 hover:bg-brand-500 hover:text-white">
          <span class="text-lg md:text-xl shrink-0">{{ item.icon }}</span>
          <span class="font-bold">{{ item.name }}</span>
        </router-link>
      </nav>

      <div class="p-3 md:p-4 border-t border-brand-50">
        <button @click="logout" class="w-full flex items-center justify-center p-2 md:p-3 text-red-400 hover:bg-red-50 rounded-xl transition text-sm md:text-base">
          <span class="text-lg ml-2">🚪</span> <span class="font-bold">تسجيل خروج</span>
        </button>
      </div>
    </aside>
    
    <!-- Main Content -->
    <main class="flex-1 flex flex-col min-w-0 transition-all duration-300 relative h-full">
      <header class="h-16 md:h-16 bg-white/80 backdrop-blur-md border-b border-brand-100 flex items-center justify-between px-4 md:px-8 z-20 shrink-0 gap-4">
        <button @click="sidebarOpen = !sidebarOpen" class="md:hidden text-brand-600 hover:text-brand-900 text-2xl">☰</button>
        <h2 class="text-brand-900 font-bold text-base md:text-lg flex-1 md:flex-none text-center md:text-left">نظام المسابقات</h2>
        <div class="text-right text-xs md:text-sm">
          <p class="text-brand-400 font-bold hidden sm:block">مرحباً بك</p>
          <p class="font-bold text-brand-800">المدير </p>
        </div>
      </header>

      <div class="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()
const sidebarOpen = ref(false)

const menuItems = [
    { id: 'admin/dashboard', path: '/admin/dashboard', name: 'الإحصائيات العامة', icon: '📊' },
    { id: 'admin/quizzes', path: '/admin/quizzes', name: 'إدارة المسابقات', icon: '📁' },
    { id: 'admin/create', path: '/admin/create', name: 'إنشاء مسابقة', icon: '📝' },
    { id: 'admin/participants', path: '/admin/participants', name: 'المتسابقون', icon: '👥' },
    { id: 'admin/winners', path: '/admin/winners', name: 'لوحة الفائزين', icon: '🏆' },
];

const logout = () => {
    router.replace('/');
};
</script>
