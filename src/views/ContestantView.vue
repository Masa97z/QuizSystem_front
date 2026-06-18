<template>
  <div class="h-full overflow-y-auto min-h-screen bg-gradient-to-b from-brand-50 to-brand-200 flex items-center justify-center p-2 md:p-4 antialiased font-karbalaei">
    <div class="bg-white w-full max-w-md rounded-2xl md:rounded-[40px] shadow-2xl shadow-brand-200/50 overflow-hidden border border-brand-100 relative min-h-[500px] md:min-h-[600px] flex flex-col" dir="rtl">
      
      <div v-if="!quizState.started" class="p-4 md:p-8 flex flex-col h-full justify-center">
        <div class="text-center mb-6 md:mb-10">
          <div class="w-12 md:w-16 h-12 md:h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">

<img 
  src="/src/assets/logo_png.png" 
  alt="logo" 
  class="h-10 md:h-12 object-contain"
/>  
          </div>
          <h1 class="text-xl md:text-2xl font-extrabold text-brand-950 mb-2"> مدرسة الامام محمد الباقر النسوية </h1>
        </div>

        <div class="space-y-3 md:space-y-5 mb-6 md:mb-8">
          <div>
            <label class="block text-brand-700 text-xs md:text-sm font-bold mb-2">كود المتسابق</label>
            <input v-model="loginForm.code" type="text" placeholder="123456" class="w-full bg-brand-50 border border-brand-200 rounded-2xl px-3 md:px-4 py-2 md:py-3 text-center tracking-widest font-mono font-bold focus:outline-none focus:ring-2 focus:ring-brand-400 transition text-sm md:text-base">
          </div>
          <div>
            <label class="block text-brand-700 text-xs md:text-sm font-bold mb-2">الرقم السري</label>
            <input v-model="loginForm.secret" type="password" placeholder="******" class="w-full bg-brand-50 border border-brand-200 rounded-2xl px-3 md:px-4 py-2 md:py-3 text-center tracking-widest font-mono font-bold focus:outline-none focus:ring-2 focus:ring-brand-400 transition text-sm md:text-base">
          </div>
          <div>
            <label class="block text-brand-700 text-xs md:text-sm font-bold mb-2">رمز المسابقة (كود الدخول)</label>
            <input v-model="loginForm.quizCode" type="text" placeholder="رمز المسابقة..." class="w-full bg-brand-50 border border-brand-200 rounded-2xl px-3 md:px-4 py-2 md:py-3 text-center tracking-widest font-mono font-bold focus:outline-none focus:ring-2 focus:ring-brand-400 transition text-sm md:text-base" @keyup.enter="handleLogin">
          </div>
        </div>

        <button @click="handleLogin" :disabled="loading" class="w-full bg-gradient-to-r from-brand-400 to-brand-600 text-white font-bold py-3 md:py-4 rounded-full shadow-lg hover:shadow-xl transition-all disabled:opacity-50 text-sm md:text-lg">
          {{ loading ? 'جاري التحقق...' : 'دخول للمسابقة' }}
        </button>
      </div>

      <div v-else class="p-4 md:p-8 flex flex-col h-full justify-center">
        <div class="mb-4 md:mb-6 space-y-2 md:space-y-0">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
            <span class="text-brand-800 font-bold text-xs md:text-sm">مسابقة: {{ quizState.activeQuiz.title }}</span>
            <button @click="quitQuiz" class="text-xs bg-red-100 text-red-600 px-3 py-1 rounded-lg font-bold hover:bg-red-200 transition duration-300">خروج</button>
          </div>
          <div class="flex justify-between items-center gap-2">
            <div v-if="timeLeft > 0" class="text-red-500 font-mono font-bold animate-pulse text-xs md:text-sm">{{ formattedTime }}</div>
            <div class="w-7 md:w-8 h-7 md:h-8 bg-brand-400 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md">
              {{ quizState.currentStep + 1 }}/{{ quizState.activeQuiz.questions.length }}
            </div>
          </div>
        </div>

        <div class="w-full bg-brand-200 rounded-full h-2 md:h-3 mb-4 md:mb-8 overflow-hidden">
          <div class="bg-brand-500 h-2 md:h-3 rounded-full transition-all duration-500" :style="{ width: quizProgress + '%' }"></div>
        </div>

        <div class="flex-1 overflow-y-auto">
          <h2 class="text-base md:text-xl font-bold text-brand-900 mb-4 md:mb-6 leading-relaxed">{{ currentQuestion?.text }}</h2>
          
          <div v-if="currentQuestion?.type === 'multiple'" class="space-y-2 md:space-y-3">
            <button v-for="(option, idx) in parsedOptions(currentQuestion.options)" :key="idx" @click="quizState.answers[quizState.currentStep] = option"
                :class="['w-full  p-3 md:p-4 rounded-2xl border-2 text-right transition-all duration-200 font-medium hover:shadow-md text-xs md:text-sm', quizState.answers[quizState.currentStep] === option ? 'border-brand-500 bg-brand-200 text-brand-800 shadow-md transform scale-[1.02]' : 'border-white bg-brand-100 text-brand-600 hover:border-brand-200']">
                {{ option }}
            </button>
          </div>
          <div v-else>
            <textarea v-model="quizState.answers[quizState.currentStep]" rows="3" placeholder="اكتب إجابتك هنا..." class="w-full bg-gradient-to-r rounded-2xl border-2 border-brand-100 p-3 md:p-4 focus:ring-2 focus:ring-brand-400 focus:border-transparent outline-none transition duration-300 hover:shadow-sm text-xs md:text-sm"></textarea>
          </div>
        </div>

        <div class="mt-4 md:mt-8 flex gap-2 md:gap-3">
          <button v-if="quizState.currentStep > 0" @click="quizState.currentStep--" class="px-3 md:px-6 py-3 md:py-4 rounded-2xl font-bold text-brand-500 hover:bg-brand-100 transition duration-300 text-xs md:text-sm">السابق</button>
          <button @click="submitQuiz(false)" :disabled="loading" class="flex-1 bg-brand-600 text-white font-bold py-3 md:py-4 rounded-2xl shadow-md hover:bg-brand-700 transition duration-300 disabled:opacity-50 text-xs md:text-sm">
            {{ isLastQuestion ? (loading ? 'جاري الإرسال...' : 'إرسال الإجابات') : 'التالي' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { fetchApi, showMessage } from '../utils/api';
import confetti from 'canvas-confetti';

const router = useRouter();
const loading = ref(false);

const loginForm = reactive({ code: '', secret: '', quizCode: '' });
const quizState = reactive({
    started: false,
    activeQuiz: null,
    currentStep: 0,
    answers: {}
});

const timerInterval = ref(null);
const timeLeft = ref(0);

const formattedTime = computed(() => {
    const m = Math.floor(timeLeft.value / 60).toString().padStart(2, '0');
    const s = (timeLeft.value % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
});

const currentQuestion = computed(() => quizState.activeQuiz?.questions[quizState.currentStep]);
const isLastQuestion = computed(() => quizState.currentStep === (quizState.activeQuiz?.questions.length - 1));
const quizProgress = computed(() => ((quizState.currentStep + 1) / quizState.activeQuiz?.questions.length) * 100);

const parsedOptions = (optionsString) => {
    try { return JSON.parse(optionsString); } catch { return []; }
};

const handleLogin = async () => {
    if (loginForm.code === 'admin'&& loginForm.secret === 'B@17*Aa@') {
        showMessage('تم تسجيل الدخول كمدير', 'success');
        router.push('/admin/dashboard');
        return;
    }
    
    if (!loginForm.code || !loginForm.secret || !loginForm.quizCode) {
        return showMessage('الرجاء إدخال كود المتسابق، الرقم السري، ورمز المسابقة', 'error');
    }
    
    loading.value = true;
    try {
        await fetchApi(`/participants/login?code=${loginForm.code}&secretCode=${loginForm.secret}`);
        const quiz = await fetchApi('/quizzes/code/' + loginForm.quizCode);
        if (!quiz) throw new Error('المسابقة غير موجودة');
        
        quizState.activeQuiz = quiz;
        quizState.started = true;
        
        const savedState = localStorage.getItem(`quiz_${loginForm.quizCode}_${loginForm.code}`);
        if (savedState) {
            const parsed = JSON.parse(savedState);
            quizState.currentStep = parsed.currentStep || 0;
            quizState.answers = parsed.answers || {};
            if (quiz.timeLimit && parsed.timeLeft !== undefined) {
                timeLeft.value = parsed.timeLeft;
            }
        } else if (quiz.timeLimit) {
            timeLeft.value = quiz.timeLimit * 60;
        }

        if (quiz.timeLimit && timeLeft.value > 0) {
            timerInterval.value = setInterval(() => {
                timeLeft.value--;
                if (timeLeft.value <= 0) {
                    clearInterval(timerInterval.value);
                    showMessage('انتهى الوقت الممُخصص للمسابقة! جاري التسليم...', 'info');
                    submitQuiz(true); // force submit
                }
            }, 1000);
        } else if (quiz.timeLimit && timeLeft.value <= 0) {
            submitQuiz(true);
        }
        
        showMessage('مرحباً بك في المسابقة', 'success');
    } catch (e) {
        // Handled globally
    } finally {
        loading.value = false;
    }
};

const submitQuiz = async (force = false) => {
    if (!quizState.answers[quizState.currentStep] && !force) return showMessage('الرجاء الإجابة أولاً', 'error');
    
    if (!isLastQuestion.value && !force) {
        quizState.currentStep++;
    } else {
        if (timerInterval.value) clearInterval(timerInterval.value);
        loading.value = true;
        const answersArray = quizState.activeQuiz.questions.map((_, idx) => quizState.answers[idx] || '');
        
        try {
            const res = await fetchApi('/submissions', 'POST', {
                quizId: quizState.activeQuiz.id,
                participantCode: loginForm.code,
                answers: answersArray
            });
            
            if (res.score > 0) {
                confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
            }
            
            localStorage.removeItem(`quiz_${loginForm.quizCode}_${loginForm.code}`);
            
            showMessage(`تمت المشاركة! نتيجتك: ${res.score} من ${res.totalQuestions}`, 'success');
            setTimeout(() => window.location.reload(), 4000);
        } catch (e) {
            loading.value = false;
        }
    }
};

const quitQuiz = () => {
    if(confirm('سيتم الخروج من المسابقة وحفظ إجاباتك الحالية لتعود إليها لاحقاً.')) {
        if (timerInterval.value) clearInterval(timerInterval.value);
        quizState.started = false;
    }
};

const saveQuizStateLocally = () => {
    if (quizState.started && quizState.activeQuiz) {
        localStorage.setItem(`quiz_${loginForm.quizCode}_${loginForm.code}`, JSON.stringify({
            currentStep: quizState.currentStep,
            answers: quizState.answers,
            timeLeft: timeLeft.value
        }));
    }
};

watch(() => quizState, saveQuizStateLocally, { deep: true });
watch(timeLeft, saveQuizStateLocally);
</script>
