<template>
  <div class="space-y-4 md:space-y-6 font-karbalaei">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
        <h1 class="text-xl md:text-2xl font-bold text-brand-900">إنشاء مسابقة جديدة</h1>
        <button @click="saveNewQuiz" :disabled="loading" class="w-full md:w-auto bg-brand-600 text-white px-4 md:px-6 py-3 rounded-xl font-bold shadow hover:bg-brand-700 transition text-sm md:text-base">💾 حفظ المسابقة</button>
    </div>
    
    <div class="flex flex-col md:flex-row gap-3 md:gap-4">
        <input v-model="createQuizForm.title" type="text" placeholder="عنوان المسابقة..." class="flex-1 bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-brand-100 text-base md:text-xl font-bold outline-none shadow-sm transition duration-300 hover:border-brand-300 focus:ring-2 focus:ring-brand-100">
        <input v-model="createQuizForm.timeLimit" type="number" placeholder="الوقت (دقيقة)" class="w-full md:w-48 bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-brand-100 font-bold outline-none shadow-sm text-center focus:ring-2 focus:ring-brand-100 text-sm md:text-base" min="1">
    </div>
    
    <div v-for="(q, index) in createQuizForm.questions" :key="index" class="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-brand-100 shadow-sm relative transition duration-300 hover:shadow-md space-y-4">
        <button @click="createQuizForm.questions.splice(index, 1)" class="absolute left-4 md:left-6 top-4 md:top-6 text-red-400 text-sm md:text-base hover:text-red-600 transition">🗑️ حذف</button>
        <div class="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3 mb-4 pr-10">
            <span class="bg-brand-100 text-brand-600 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm">{{ index + 1 }}</span>
            <select v-model="q.type" class="flex-1 bg-brand-50 rounded-lg text-xs md:text-sm px-3 py-2 outline-none border border-brand-100">
                <option value="multiple">اختيارات متعددة</option>
                <option value="text">إجابة نصية</option>
            </select>
        </div>
        <input v-model="q.text" type="text" placeholder="نص السؤال..." class="w-full border-b-2 border-brand-50 py-2 mb-4 outline-none font-bold text-sm md:text-base">
        
        <div v-if="q.type === 'multiple'" class="space-y-2 p-3 md:p-4 bg-brand-50/30 rounded-xl">
            <div v-for="(opt, oIdx) in q.options" :key="oIdx" class="flex gap-2 items-center">
                <input type="radio" :name="'correct_'+index" :value="oIdx" v-model="q.correctIndex" class="w-4 h-4 shrink-0">
                <input v-model="q.options[oIdx]" type="text" placeholder="الخيار..." class="flex-1 px-2 md:px-3 py-2 border rounded-lg outline-none text-sm md:text-base">
                <button @click="q.options.splice(oIdx, 1)" class="text-red-400 font-bold hover:text-red-600 text-lg shrink-0">&times;</button>
            </div>
            <button @click="q.options.push('')" class="text-xs md:text-sm text-brand-600 font-bold mt-2 hover:text-brand-800 transition">+ إضافة خيار</button>
        </div>
        <div v-if="q.type === 'text'" class="p-3 md:p-4 bg-brand-50/30 rounded-xl">
            <textarea v-model="q.correctAnswer" placeholder="الإجابة النموذجية..." class="w-full p-2 md:p-3 rounded-lg border outline-none text-sm md:text-base"></textarea>
        </div>
    </div>
    
    <button @click="createQuizForm.questions.push({ text: '', type: 'multiple', options: ['',''], correctIndex: 0, correctAnswer: '' })" class="w-full py-4 md:py-6 border-2 border-dashed border-brand-300 bg-brand-50 rounded-2xl md:rounded-3xl text-brand-600 font-bold text-base md:text-lg hover:bg-brand-100 transition shadow-sm">+ إضافة سؤال جديد</button>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { fetchApi, showMessage } from '../../utils/api';

const router = useRouter();
const loading = ref(false);

const createQuizForm = reactive({
    title: '',
    timeLimit: null,
    questions: [{ text: '', type: 'multiple', options: ['', ''], correctIndex: 0, correctAnswer: '' }]
});

const saveNewQuiz = async () => {
    if (!createQuizForm.title) return showMessage('أدخل عنوان المسابقة', 'error');
    loading.value = true;
    
    const payload = {
        title: createQuizForm.title,
        timeLimit: createQuizForm.timeLimit,
        questions: createQuizForm.questions.map(q => ({
            text: q.text,
            type: q.type,
            options: q.type === 'multiple' ? JSON.stringify(q.options) : null,
            correctAnswer: q.type === 'multiple' ? q.options[q.correctIndex] : q.correctAnswer
        }))
    };

    try {
        await fetchApi('/quizzes', 'POST', payload);
        showMessage('تم حفظ ونشر المسابقة بنجاح!', 'success');
        router.push('/admin/quizzes');
    } catch (e) {
        // Handled globally
    } finally { loading.value = false; }
};
</script>
