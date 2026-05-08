<template>
  <div class="w-full py-6 md:py-10 px-2 md:px-4">
    <!-- Title -->
    <div class="text-center mb-8 md:mb-12">
      <h2 class="text-2xl md:text-3xl font-extrabold text-brand-900 mb-1 md:mb-2">{{ title }}</h2>
      <p class="text-brand-500 text-xs md:text-sm">{{ subtitle }}</p>
    </div>

    <!-- Podium -->
    <div class="flex items-end justify-center gap-1 md:gap-3 max-w-2xl mx-auto" v-if="topThree.length > 0">
      
      <!-- 3rd Place (Left) -->
      <div v-if="topThree[2]" class="flex flex-col items-center animate-slide-up-3">
        <div class="relative mb-2 md:mb-3">
          <div class="w-8 md:w-12 h-8 md:h-12 rounded-full bg-amber-700 flex items-center justify-center shadow-lg">
            <span class="text-white font-bold text-xs md:text-lg">3</span>
          </div>
          <span class="absolute -top-1 -right-1 text-lg md:text-xl">🥉</span>
        </div>
        <div class="bg-white rounded-xl md:rounded-2xl border-2 border-brand-100 shadow-md px-3 md:px-8 py-3 md:py-6 text-center min-w-[120px] md:min-w-[160px] transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <p class="text-lg md:text-2xl font-extrabold text-brand-900 mb-1">{{ topThree[2].displayCode }}</p>
          <p v-if="topThree[2].displayName" class="text-xs text-slate-500 mb-1 md:mb-2 truncate max-w-[100px] md:max-w-[120px]">{{ topThree[2].displayName }}</p>
          <p class="text-brand-600 font-bold text-xs md:text-sm">{{ topThree[2].displayScore }} نقطة</p>
        </div>
        <div class="w-full h-12 md:h-20 bg-gradient-to-b from-brand-100 to-brand-200 rounded-b-lg md:rounded-b-xl mt-0"></div>
      </div>

      <!-- 1st Place (Center - Tallest) -->
      <div v-if="topThree[0]" class="flex flex-col items-center animate-slide-up-1 -mt-3 md:-mt-6">
        <div class="relative mb-2 md:mb-3">
          <span class="text-2xl md:text-4xl block mb-1">🏆</span>
        </div>
        <div class="bg-gradient-to-b from-brand-400 to-brand-500 rounded-xl md:rounded-2xl shadow-2xl shadow-brand-300/50 px-4 md:px-10 py-4 md:py-8 text-center min-w-[130px] md:min-w-[180px] transition-all duration-300 hover:shadow-3xl hover:-translate-y-1 border-2 border-brand-300">
          <p class="text-2xl md:text-4xl font-extrabold text-white mb-1">{{ topThree[0].displayCode }}</p>
          <p v-if="topThree[0].displayName" class="text-xs text-brand-100 mb-1 truncate max-w-[110px] md:max-w-[140px]">{{ topThree[0].displayName }}</p>
          <p class="text-white font-bold text-xs md:text-sm mb-1 md:mb-2">المركز الأول</p>
          <span class="inline-block bg-white/20 backdrop-blur-sm text-white text-xs md:text-sm font-bold px-2 md:px-4 py-1 rounded-full">{{ topThree[0].displayScore }} نقطة</span>
        </div>
        <div class="w-full h-16 md:h-32 bg-gradient-to-b from-brand-300 to-brand-400 rounded-b-lg md:rounded-b-xl mt-0"></div>
      </div>

      <!-- 2nd Place (Right) -->
      <div v-if="topThree[1]" class="flex flex-col items-center animate-slide-up-2">
        <div class="relative mb-2 md:mb-3">
          <div class="w-8 md:w-12 h-8 md:h-12 rounded-full bg-slate-400 flex items-center justify-center shadow-lg">
            <span class="text-white font-bold text-xs md:text-lg">2</span>
          </div>
          <span class="absolute -top-1 -right-1 text-lg md:text-xl">🥈</span>
        </div>
        <div class="bg-white rounded-xl md:rounded-2xl border-2 border-brand-100 shadow-md px-3 md:px-8 py-3 md:py-6 text-center min-w-[120px] md:min-w-[160px] transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <p class="text-lg md:text-2xl font-extrabold text-brand-900 mb-1">{{ topThree[1].displayCode }}</p>
          <p v-if="topThree[1].displayName" class="text-xs text-slate-500 mb-1 md:mb-2 truncate max-w-[100px] md:max-w-[120px]">{{ topThree[1].displayName }}</p>
          <p class="text-brand-600 font-bold text-xs md:text-sm">{{ topThree[1].displayScore }} نقطة</p>
        </div>
        <div class="w-full h-14 md:h-24 bg-gradient-to-b from-brand-100 to-brand-200 rounded-b-lg md:rounded-b-xl mt-0"></div>
      </div>

    </div>

    <!-- No data -->
    <div v-else class="text-center text-brand-400 font-bold py-6 md:py-10 text-sm md:text-base">
      لا توجد بيانات كافية لعرض المنصة
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: { type: String, default: 'لوحة شرف الشهر' },
  subtitle: { type: String, default: 'المشتركون الذين حققوا أعلى النقاط' },
  winners: { type: Array, default: () => [] }
});

const topThree = computed(() => {
  return props.winners.slice(0, 3).map(w => ({
    ...w,
    displayCode: w.code || w.participant?.code || '---',
    displayName: w.name || w.participant?.name || '',
    displayScore: w.totalScore ?? w.score ?? 0
  }));
});
</script>

<style scoped>
@keyframes slideUp1 {
  from { opacity: 0; transform: translateY(60px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes slideUp2 {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes slideUp3 {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-slide-up-1 { animation: slideUp1 0.8s ease-out both; }
.animate-slide-up-2 { animation: slideUp2 0.7s ease-out 0.2s both; }
.animate-slide-up-3 { animation: slideUp3 0.6s ease-out 0.4s both; }
</style>
