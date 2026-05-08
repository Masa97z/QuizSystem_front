<template>
  <div class="space-y-6 md:space-y-8 font-karbalaei">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      <div v-for="(stat, idx) in dashboard.stats" :key="idx" class="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-brand-100 hover:shadow-md transition">
          <div class="flex items-center justify-between gap-3">
              <div>
                  <p class="text-brand-500 text-xs md:text-sm font-bold mb-1">{{ stat.title }}</p>
                  <h3 class="text-2xl md:text-3xl font-extrabold text-brand-900">{{ stat.value }}</h3>
              </div>
              <div class="w-10 md:w-12 h-10 md:h-12 rounded-full bg-brand-50 flex items-center justify-center text-xl md:text-2xl shrink-0">{{ stat.icon }}</div>
          </div>
      </div>
    </div>
    <div class="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-brand-100 p-4 md:p-6">
      <h3 class="font-bold text-brand-900 mb-4 md:mb-6 text-base md:text-lg">أحدث المشاركات الواردة</h3>
      <!-- Desktop table -->
      <div class="hidden sm:block overflow-x-auto">
        <table class="w-full text-right text-sm">
            <thead class="text-xs text-brand-400 uppercase bg-brand-50/50 rounded-lg">
                <tr>
                    <th class="px-4 py-3">الرقم السري</th>
                    <th class="px-4 py-3">المسابقة</th>
                    <th class="px-4 py-3">النتيجة</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-brand-50">
                <tr v-for="item in dashboard.recentActivity" :key="item.id" class="hover:bg-brand-50/50 transition duration-200 text-xs md:text-sm">
                    <td class="px-4 py-3 font-mono font-bold">{{ item.code }}</td>
                    <td class="px-4 py-3">{{ item.quiz }}</td>
                    <td class="px-4 py-3 font-bold text-brand-600">{{ item.score }} نقاط</td>
                </tr>
            </tbody>
        </table>
      </div>
      <!-- Mobile cards -->
      <div class="sm:hidden space-y-3">
        <div v-for="item in dashboard.recentActivity" :key="item.id" class="bg-brand-50/30 p-4 rounded-xl border border-brand-100 space-y-2">
          <div class="flex justify-between items-start gap-2">
            <span class="text-xs font-bold text-brand-500">الرقم السري</span>
            <span class="font-mono font-bold text-brand-800">{{ item.code }}</span>
          </div>
          <div class="flex justify-between items-start gap-2">
            <span class="text-xs font-bold text-brand-500">المسابقة</span>
            <span class="text-sm font-bold text-brand-800">{{ item.quiz }}</span>
          </div>
          <div class="flex justify-between items-start gap-2">
            <span class="text-xs font-bold text-brand-500">النتيجة</span>
            <span class="font-bold text-brand-600">{{ item.score }} نقاط</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { fetchApi } from '../../utils/api';

const dashboard = reactive({ stats: [], recentActivity: [] });

onMounted(async () => {
    const data = await fetchApi('/dashboard');
    dashboard.stats = data.stats;
    dashboard.recentActivity = data.recentActivity;
});
</script>
