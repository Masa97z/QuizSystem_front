<template>
  <div class="space-y-4 md:space-y-6 font-karbalaei" v-if="selectedQuizDetails">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 md:mb-6 pb-4 border-b border-brand-100">
      <div>
          <h1 class="text-xl md:text-2xl font-bold text-brand-900 mb-2">
              {{ selectedQuizDetails.title }}
              <span v-if="selectedQuizDetails.status === 'ENDED'" class="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg mr-2 align-middle">منتهية</span>
              <span v-else-if="selectedQuizDetails.status === 'PAUSED'" class="text-xs bg-amber-100 text-amber-600 px-2 py-1 rounded-lg mr-2 align-middle">متوقفة مؤقتا</span>
              <span v-else class="text-xs bg-emerald-100 text-emerald-600 px-2 py-1 rounded-lg mr-2 align-middle">قيد العمل</span>
          </h1>
          <p class="text-xs md:text-sm text-brand-600">
            رمز المسابقة: <span class="bg-brand-100 px-2 py-1 rounded-md font-mono font-bold text-xs md:text-sm">{{ selectedQuizDetails.quizCode }}</span> | المشاركات: {{ selectedQuizDetails.submissions.length }}<br/>
            تاريخ الإنشاء: <span class="font-bold">{{ new Date(selectedQuizDetails.createdAt).toLocaleDateString() }}</span>
            <span v-if="selectedQuizDetails.status === 'ENDED'"> | تاريخ الانتهاء: <span class="font-bold">{{ new Date(selectedQuizDetails.endedAt).toLocaleDateString() }}</span></span>
          </p>
      </div>
      <div class="flex flex-wrap gap-2 w-full md:w-auto">
          <template v-if="selectedQuizDetails.status !== 'ENDED'">
              <button @click="toggleQuizStatus" :class="['px-3 md:px-4 py-2 rounded-xl font-bold transition text-sm md:text-base', selectedQuizDetails.status === 'ACTIVE' ? 'bg-amber-100 text-amber-600 hover:bg-amber-200' : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200']">
                  {{ selectedQuizDetails.status === 'ACTIVE' ? 'إيقاف مؤقت' : 'بدء المسابقة' }}
              </button>
              <button @click="endQuizAction" class="bg-red-100 text-red-600 border border-red-200 px-3 md:px-4 py-2 rounded-xl font-bold hover:bg-red-200 transition text-sm md:text-base">إنهاء المسابقة</button>
          </template>
          <template v-else>
              <button @click="exportQuestionsToCSV" class="bg-indigo-100 text-indigo-600 px-3 py-2 rounded-xl font-bold hover:bg-indigo-200 transition text-sm">سحب الأسئلة</button>
              <button @click="exportWinnersToCSV" class="bg-emerald-100 text-emerald-600 px-3 py-2 rounded-xl font-bold hover:bg-emerald-200 transition text-sm">سحب النتائج</button>
          </template>
          <button @click="router.push('/admin/quizzes')" class="bg-white text-brand-600 border border-brand-200 px-4 md:px-6 py-2 rounded-xl font-bold hover:bg-brand-50 transition text-sm md:text-base">العودة</button>
      </div>
    </div>
    
    <!-- Podium for this quiz -->
    <PodiumDisplay 
      v-if="selectedQuizDetails.submissions.length >= 1"
      :title="'أوائل مسابقة: ' + selectedQuizDetails.title" 
      subtitle="أعلى المتسابقين في هذه المسابقة"
      :winners="selectedQuizDetails.submissions"
    />

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      <div class="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-brand-100 shadow-sm flex flex-col h-full">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-0 mb-4 md:mb-6">
            <h3 class="text-lg md:text-xl font-bold text-brand-900">سجل المشاركات</h3>
            <button @click="showTop3 = !showTop3" class="w-full md:w-auto bg-amber-100 text-amber-600 hover:bg-amber-200 text-xs md:text-sm px-3 md:px-4 py-2 rounded-lg font-bold transition">
                {{ showTop3 ? 'عرض الكل' : '🏆 عرض أول 3' }}
            </button>
          </div>
          <div class="overflow-y-auto custom-scrollbar flex-1">
            <!-- Desktop table -->
            <div class="hidden sm:block">
              <table class="w-full text-right text-xs md:text-sm">
                  <thead class="bg-brand-50 sticky top-0">
                    <tr>
                        <th class="p-2 md:p-3 text-brand-700">الترتيب</th>
                        <th class="p-2 md:p-3 text-brand-700">المتسابق</th>
                        <th class="p-2 md:p-3 text-brand-700 text-center">النقاط</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-brand-50">
                    <tr v-for="(sub, idx) in showTop3 ? selectedQuizDetails.submissions.slice(0, 3) : selectedQuizDetails.submissions" :key="sub.id" 
                        @click="selectedSubmission = sub"
                        :class="['cursor-pointer transition-all duration-200', idx < 3 && showTop3 ? 'bg-amber-50/30 hover:bg-amber-100/60' : 'hover:bg-brand-50', selectedSubmission?.id === sub.id ? 'bg-brand-100/60 border-r-4 border-brand-500' : 'border-r-4 border-transparent']">
                        <td class="p-2 md:p-3 font-bold text-amber-500">#{{ idx + 1 }}</td>
                        <td class="p-2 md:p-3">
                          <div class="font-bold text-slate-800 text-xs md:text-sm">{{ sub.participant?.name || 'غير محدد' }}</div>
                          <div class="text-xs text-slate-500 font-mono">{{ sub.participant?.code }}</div>
                        </td>
                        <td class="p-2 md:p-3 text-center font-bold text-brand-600">{{ sub.score }}</td>
                    </tr>
                    <tr v-if="selectedQuizDetails.submissions.length === 0">
                        <td colspan="3" class="p-4 md:p-6 text-center text-slate-400 text-xs md:text-sm">لا توجد مشاركات</td>
                    </tr>
                  </tbody>
              </table>
            </div>
            
            <!-- Mobile cards -->
            <div class="sm:hidden space-y-3">
              <div v-for="(sub, idx) in showTop3 ? selectedQuizDetails.submissions.slice(0, 3) : selectedQuizDetails.submissions" 
                   :key="sub.id"
                   @click="selectedSubmission = sub"
                   :class="['p-3 rounded-xl border cursor-pointer transition', selectedSubmission?.id === sub.id ? 'bg-brand-100/60 border-brand-500 border-2' : 'bg-brand-50/30 border-brand-100']">
                <div class="flex justify-between items-start gap-2 mb-2">
                  <span class="font-bold text-amber-500">#{{ idx + 1 }}</span>
                  <span class="font-bold text-brand-600">{{ sub.score }} نقطة</span>
                </div>
                <div class="font-bold text-slate-800 text-sm">{{ sub.participant?.name || 'غير محدد' }}</div>
                <div class="text-xs text-slate-500 font-mono">{{ sub.participant?.code }}</div>
              </div>
              <div v-if="selectedQuizDetails.submissions.length === 0" class="p-4 text-center text-slate-400 text-xs">
                لا توجد مشاركات
              </div>
            </div>
          </div>
      </div>

      <div class="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-brand-100 shadow-sm relative transition duration-300 hover:shadow-md">
          <div class="flex flex-col md:flex-row justify-between items-start gap-3 mb-4 md:mb-6">
            <h3 class="text-lg md:text-xl font-bold text-brand-900 flex-1">
                {{ selectedSubmission ? `إجابات: ${selectedSubmission.participant?.name || selectedSubmission.participant?.code}` : `الأسئلة (${selectedQuizDetails.questions.length})` }}
            </h3>
            <button v-if="selectedSubmission" @click="selectedSubmission = null" class="text-xs md:text-sm bg-brand-50 text-brand-600 px-2 md:px-3 py-1 rounded-lg font-bold hover:bg-brand-100 transition">العودة</button>
          </div>
          <div class="space-y-3 md:space-y-4 overflow-y-auto custom-scrollbar max-h-[500px] pr-2">
            <div v-for="(q, qIdx) in selectedQuizDetails.questions" :key="q.id" class="p-3 md:p-4 bg-brand-50/40 rounded-2xl border border-brand-50 transition-colors hover:border-brand-200">
                <div class="font-bold text-brand-900 mb-2 md:mb-3 text-sm md:text-base">{{ qIdx + 1 }}. {{ q.text }}</div>
                
                <div v-if="q.type === 'multiple' && q.options" class="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 md:mb-4">
                    <div v-for="(opt, oIdx) in parsedOptions(q.options)" :key="oIdx" 
                          class="bg-white border p-2 rounded-lg text-xs md:text-sm text-brand-800 border-brand-100 flex items-center gap-2 shadow-sm">
                        <span class="w-2 h-2 rounded-full shrink-0" :class="opt === q.correctAnswer ? 'bg-emerald-400' : 'bg-slate-200'"></span>
                        <span class="truncate">{{ opt }}</span>
                    </div>
                </div>
                
                <div class="space-y-2 mt-2 pt-3 border-t border-brand-100/50">
                  <div class="text-xs md:text-sm font-bold text-emerald-600 bg-emerald-50 px-2 md:px-3 py-2 rounded-lg inline-block w-full">
                      🤔 الجواب: {{ q.correctAnswer }}
                  </div>
                  
                  <div v-if="selectedSubmission" :class="['text-xs md:text-sm font-bold px-2 md:px-3 py-2 rounded-lg inline-block w-full border-2', isAnswerCorrect(selectedSubmission, qIdx) ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-red-700 bg-red-50 border-red-200']">
                      ✍️ إجابة الطالب: {{ getSubmissionAnswer(selectedSubmission, qIdx) || 'لم يجب' }}
                  </div>
                </div>
            </div>
          </div>
      </div>
    </div>
  </div>
  <div v-else class="flex justify-center items-center h-64 text-brand-500 font-bold text-sm md:text-base">
    جاري التحميل...
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchApi } from '../../utils/api';
import PodiumDisplay from '../../components/PodiumDisplay.vue';

const route = useRoute();
const router = useRouter();

const selectedQuizDetails = ref(null);
const selectedSubmission = ref(null);
const showTop3 = ref(false);

const loadQuizDetails = async () => {
    try {
        const id = route.params.id;
        const data = await fetchApi(`/quizzes/${id}`);
        selectedQuizDetails.value = data;
    } catch (e) {
        // Handled globally
    }
};

const parsedOptions = (opts) => {
    try { return JSON.parse(opts || "[]"); } catch { return []; }
};

const isAnswerCorrect = (sub, qIdx) => {
    try {
        const parsedArray = JSON.parse(sub.answers || "[]");
        const userAnswer = parsedArray[qIdx];
        const correctAns = selectedQuizDetails.value.questions[qIdx].correctAnswer;
        return userAnswer !== undefined && userAnswer?.toString().trim() === correctAns?.toString().trim();
    } catch { return false; }
};

const getSubmissionAnswer = (sub, qIdx) => {
    try {
        const parsedArray = JSON.parse(sub.answers || "[]");
        return parsedArray[qIdx];
    } catch { return ""; }
};

const toggleQuizStatus = async () => {
    try {
        await fetchApi(`/quizzes/${selectedQuizDetails.value.id}/toggle-status`, 'PATCH');
        await loadQuizDetails();
    } catch (e) {}
};

const endQuizAction = async () => {
    if(confirm('تحذير: عند إنهاء المسابقة لا يمكن إعادة تفعيلها أبداً وسيتم إبطال رمز المسابقة. تجنبا للتلاعب لاحقاً بالمسابقات وأوقات إنهائها. هل أنت متأكد؟')) {
        try {
            await fetchApi(`/quizzes/${selectedQuizDetails.value.id}/end`, 'PATCH');
            await loadQuizDetails();
        } catch (e) {}
    }
};

const exportQuestionsToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    csvContent += "رقم,السؤال,الإجابة الصحيحة\n";
    selectedQuizDetails.value.questions.forEach((q, idx) => {
        const text = q.text.replace(/"/g, '""');
        const answer = q.correctAnswer?.replace(/"/g, '""') || '';
        csvContent += `${idx + 1},"${text}","${answer}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `اسئلة_${selectedQuizDetails.value.title}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const exportWinnersToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    csvContent += "التسلسل,اسم المتسابق,كود الدخول,النقاط\n";
    selectedQuizDetails.value.submissions.forEach((sub, idx) => {
        const name = (sub.participant?.name || 'غير محدد').replace(/"/g, '""');
        const code = sub.participant?.code || '';
        csvContent += `${idx + 1},"${name}","${code}",${sub.score}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `فائزين_${selectedQuizDetails.value.title}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

onMounted(loadQuizDetails);
</script>
