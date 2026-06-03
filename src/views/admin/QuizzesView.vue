<template>
  <div class="space-y-4 md:space-y-6 font-karbalaei">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
      <h1 class="text-xl md:text-2xl font-bold text-brand-900">المسابقات المتاحة</h1>
      <input v-model="searchQuery" type="text" placeholder="البحث عن مسابقة (الاسم أو الكود)..." class="w-full md:w-1/3 bg-white border border-brand-100 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 transition shadow-sm">
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      <div v-for="quiz in filteredQuizzes" :key="quiz.id" class="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 border border-brand-100 shadow-sm relative transform transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl hover:shadow-brand-200/50 hover:border-brand-300 group cursor-default">
          <button @click="deleteQuiz(quiz.id)" class="absolute top-4 md:top-6 left-4 md:left-6 text-red-400 bg-red-50 px-2 py-1 rounded text-xs font-bold transition-all hover:bg-red-500 hover:text-white opacity-0 group-hover:opacity-100 duration-300">حذف</button>
          <h3 class="text-lg md:text-xl font-bold text-brand-900 mb-2 md:mb-3 group-hover:text-brand-600 transition-colors pr-8">{{ quiz.title }}</h3>
          <p class="text-xs md:text-sm font-bold text-brand-600 mb-1">رمز المسابقة: <span class="bg-brand-100 px-2 py-1 rounded-md font-mono text-xs md:text-sm">{{ quiz.quizCode }}</span></p>
          <p class="text-xs text-slate-400 mb-4">إنشاء: {{ new Date(quiz.createdAt).toLocaleDateString() }}</p>
          <div class="flex flex-wrap gap-2 md:gap-4 mb-4 text-xs md:text-sm">
              <p class="text-slate-500">📝 {{ quiz.questions?.length || 0 }} أسئلة</p>
              <p class="text-slate-500">👥 {{ quiz.submissions?.length || 0 }} مشاركات</p>
              <p class="text-slate-500" v-if="quiz.timeLimit">⏱️ {{ quiz.timeLimit }} دقيقة</p>
          </div>
          <div class="flex flex-col gap-2">
              <div class="flex gap-2">
                <button @click="viewQuizDetails(quiz.id)" class="flex-1 bg-brand-50 text-brand-600 hover:bg-brand-100 font-bold py-2 rounded-xl transition duration-300 text-sm">التفاصيل</button>
                <button @click="editQuiz(quiz.id)" class="flex-1 bg-amber-50 text-amber-600 hover:bg-amber-100 font-bold py-2 rounded-xl transition duration-300 text-sm">التعديل</button>
              </div>
              <div v-if="quiz.status === 'ENDED'" class="w-full font-bold py-2 rounded-xl text-sm bg-slate-100 text-slate-600 text-center">
                  المسابقة منتهية
              </div>
              <button v-else @click="toggleQuizStatus(quiz.id)" :class="['w-full font-bold py-2 rounded-xl transition duration-300 text-sm', quiz.status === 'ACTIVE' ? 'bg-amber-100 text-amber-600 hover:bg-amber-200' : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200']">
                  {{ quiz.status === 'ACTIVE' ? 'قيد العمل (تفعيل)' : 'متوقفة مؤقتا (إيقاف)' }}
              </button>
            </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { fetchApi, showMessage } from '../../utils/api';
import { useRouter } from 'vue-router';

const router = useRouter();
const quizzesList = ref([]);
const searchQuery = ref('');

const filteredQuizzes = computed(() => {
  if (!searchQuery.value) return quizzesList.value;
  const q = searchQuery.value.toLowerCase();
  return quizzesList.value.filter(quiz => 
    quiz.title.toLowerCase().includes(q) || 
    quiz.quizCode.toLowerCase().includes(q)
  );
});

const loadQuizzes = async () => quizzesList.value = await fetchApi('/quizzes');

const deleteQuiz = async (id) => {
    if(confirm('هل أنت متأكد من حذف المسابقة بالكامل؟')) {
        await fetchApi(`/quizzes/${id}`, 'DELETE');
        await loadQuizzes();
    }
};

const toggleQuizStatus = async (id) => {
    try {
        await fetchApi(`/quizzes/${id}/toggle-status`, 'PATCH');
        await loadQuizzes();
        showMessage('تم تحديث حالة المسابقة بنجاح', 'success');
    } catch (e) {}
};

const viewQuizDetails = (id) => {
    router.push(`/admin/quiz-details/${id}`);
};

const editQuiz = (id) => {
    router.push(`/admin/edit/${id}`);
};

onMounted(loadQuizzes);
</script>
