<template>
  <div class="space-y-6 md:space-y-8 font-karbalaei">
    
    <!-- Podium Section -->
    <PodiumDisplay 
      title="لوحة شرف النظام" 
      subtitle="المشتركون الذين حققوا أعلى النقاط في جميع المسابقات"
      :winners="leaderboard"
    />

    <!-- Full Leaderboard Table -->
    <div class="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-brand-100 overflow-hidden transition duration-300 hover:shadow-md">
        <!-- Desktop table -->
        <div class="hidden sm:block overflow-x-auto">
          <table class="w-full text-right text-xs md:text-sm">
            <thead class="bg-brand-50 text-brand-700">
                <tr>
                    <th class="p-3 md:p-5">الترتيب</th>
                    <th class="p-3 md:p-5">الكود</th>
                    <th class="p-3 md:p-5">الاسم</th>
                    <th class="p-3 md:p-5 text-center">النقاط</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-brand-50">
                <tr v-for="(winner, idx) in leaderboard" :key="idx" class="hover:bg-brand-50/50 transition duration-200">
                    <td class="p-3 md:p-5 font-bold" :class="idx === 0 ? 'text-amber-500' : idx === 1 ? 'text-slate-400' : idx === 2 ? 'text-amber-700' : 'text-brand-400'">#{{ idx + 1 }}</td>
                    <td class="p-3 md:p-5 font-mono font-bold text-xs md:text-sm">{{ winner.code }}</td>
                    <td class="p-3 md:p-5">{{ winner.name || 'غير محدد' }}</td>
                    <td class="p-3 md:p-5 text-center font-bold text-slate-600">{{ winner.totalScore }}</td>
                </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile cards -->
        <div class="sm:hidden p-4 space-y-3">
          <div v-for="(winner, idx) in leaderboard" :key="idx" class="bg-brand-50/30 p-4 rounded-xl border border-brand-100 space-y-2">
            <div class="flex justify-between items-start gap-2">
              <span class="text-xs font-bold text-brand-500">الترتيب</span>
              <span class="font-bold" :class="idx === 0 ? 'text-amber-500' : idx === 1 ? 'text-slate-400' : idx === 2 ? 'text-amber-700' : 'text-brand-400'">#{{ idx + 1 }}</span>
            </div>
            <div class="flex justify-between items-start gap-2">
              <span class="text-xs font-bold text-brand-500">الكود</span>
              <span class="font-mono font-bold text-xs">{{ winner.code }}</span>
            </div>
            <div class="flex justify-between items-start gap-2">
              <span class="text-xs font-bold text-brand-500">الاسم</span>
              <span class="text-sm font-bold text-brand-800">{{ winner.name || 'غير محدد' }}</span>
            </div>
            <div class="flex justify-between items-start gap-2">
              <span class="text-xs font-bold text-brand-500">النقاط</span>
              <span class="font-bold text-slate-600">{{ winner.totalScore }}</span>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchApi } from '../../utils/api';
import PodiumDisplay from '../../components/PodiumDisplay.vue';

const leaderboard = ref([]);

onMounted(async () => {
    leaderboard.value = await fetchApi('/submissions/leaderboard');
});
</script>
