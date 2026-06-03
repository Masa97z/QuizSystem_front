<template>
  <div class="space-y-6 md:space-y-8 font-karbalaei">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <div v-for="(stat, idx) in dashboard.stats" :key="idx"
        class="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-brand-100 hover:shadow-md transition">
        <div class="flex items-center justify-between gap-3">
          <div>
            <p class="text-brand-500 text-xs md:text-sm font-bold mb-1">{{ stat.title }}</p>
            <h3 class="text-2xl md:text-3xl font-extrabold text-brand-900">{{ stat.value }}</h3>
          </div>
          <div
            class="w-10 md:w-12 h-10 md:h-12 rounded-full bg-brand-50 flex items-center justify-center text-xl md:text-2xl shrink-0">
            {{ stat.icon }}</div>
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
            <tr v-for="item in dashboard.recentActivity" :key="item.id"
              class="hover:bg-brand-50/50 transition duration-200 text-xs md:text-sm">
              <td class="px-4 py-3 font-mono font-bold">{{ item.code }}</td>
              <td class="px-4 py-3">{{ item.quiz }}</td>
              <td class="px-4 py-3 font-bold text-brand-600">{{ item.score }} نقاط</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Mobile cards -->
      <div class="sm:hidden space-y-3">
        <div v-for="item in dashboard.recentActivity" :key="item.id"
          class="bg-brand-50/30 p-4 rounded-xl border border-brand-100 space-y-2">
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

    <!-- قائمة المسابقات مع الفرز -->
    <div class="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-brand-100 p-4 md:p-6">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 md:mb-6">
        <h3 class="font-bold text-brand-900 text-base md:text-lg">إحصائيات المسابقات</h3>
        <select v-model="sortBy" class="bg-brand-50 border border-brand-100 text-brand-800 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block p-2 md:p-2.5 font-bold outline-none">
          <option value="newest">الأحدث</option>
          <option value="participants">الأكثر مشاركة</option>
          <option value="winners">الأكثر فائزين</option>
        </select>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-right text-sm">
          <thead class="text-xs text-brand-400 uppercase bg-brand-50/50 rounded-lg">
            <tr>
              <th class="px-4 py-3">المسابقة</th>
              <th class="px-4 py-3">الكود</th>
              <th class="px-4 py-3">الحالة</th>
              <th class="px-4 py-3 text-center">المشاركين</th>
              <th class="px-4 py-3 text-center">الفائزين (الدرجة الكاملة)</th>
              <th class="px-4 py-3">تاريخ الإنشاء</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-brand-50">
            <tr v-for="quiz in sortedQuizzes" :key="quiz.id" class="hover:bg-brand-50/50 transition duration-200 text-xs md:text-sm">
              <td class="px-4 py-3 font-bold text-brand-800">{{ quiz.title }}</td>
              <td class="px-4 py-3 font-mono font-bold">{{ quiz.quizCode }}</td>
              <td class="px-4 py-3 font-bold">
                <span v-if="quiz.status === 'ACTIVE'" class="text-emerald-600 bg-emerald-50 px-2 py-1 rounded">قيد العمل</span>
                <span v-else-if="quiz.status === 'PAUSED'" class="text-amber-600 bg-amber-50 px-2 py-1 rounded">متوقفة مؤقتا</span>
                <span v-else class="text-slate-600 bg-slate-100 px-2 py-1 rounded">منتهية</span>
              </td>
              <td class="px-4 py-3 text-center font-bold text-brand-600">{{ quiz.participantsCount }}</td>
              <td class="px-4 py-3 text-center font-bold text-amber-500">{{ quiz.winnersCount }}</td>
              <td class="px-4 py-3 text-slate-500">{{ new Date(quiz.createdAt).toLocaleDateString() }}</td>
            </tr>
            <tr v-if="sortedQuizzes.length === 0">
              <td colspan="6" class="px-4 py-6 text-center text-slate-400">لا توجد مسابقات حاليا</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref, computed } from 'vue';
import { fetchApi } from '../../utils/api';

const dashboard = reactive(
  {
    stats: [],
    recentActivity: [],
    quizzesList: []
  });

const sortBy = ref('newest');

const sortedQuizzes = computed(() => {
  let list = [...dashboard.quizzesList];
  if (sortBy.value === 'newest') {
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sortBy.value === 'participants') {
    list.sort((a, b) => b.participantsCount - a.participantsCount);
  } else if (sortBy.value === 'winners') {
    list.sort((a, b) => b.winnersCount - a.winnersCount);
  }
  return list;
});

onMounted(async () => {
  const data = await fetchApi('/dashboard');
  dashboard.stats = data.stats;
  dashboard.recentActivity = data.recentActivity;
  dashboard.quizzesList = data.quizzesList || [];
});
</script>
