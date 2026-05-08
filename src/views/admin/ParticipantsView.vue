<template>
  <div class="space-y-4 md:space-y-6 font-karbalaei">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
      <h1 class="text-xl md:text-2xl font-bold text-brand-900">إدارة المتسابقين</h1>
      <button @click="printA4Codes" class="w-full md:w-auto bg-indigo-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition duration-300 text-sm md:text-base">🖨️ طباعة البطاقات</button>
    </div>

    <div class="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-brand-100 shadow-sm flex flex-col md:flex-row gap-3 md:gap-4 items-end transition hover:shadow-md duration-300">
      <div class="flex-1 w-full">
          <label class="block text-brand-600 text-xs font-bold mb-2">اسم المتسابق (اختياري)</label>
          <input v-model="newParticipantName" type="text" placeholder="الاسم الثلاثي..." class="w-full bg-brand-50 rounded-xl border border-brand-100 px-3 md:px-4 py-2 md:py-3 outline-none focus:ring-2 focus:ring-brand-200 transition text-sm md:text-base">
      </div>
      <button @click="addParticipant" :disabled="loading" class="w-full md:w-auto bg-brand-600 text-white font-bold px-6 md:px-8 py-2 md:py-3 rounded-xl hover:bg-brand-700 transition disabled:opacity-50 text-sm md:text-base">توليد وإضافة</button>
    </div>

    <div class="bg-white rounded-2xl md:rounded-3xl border border-brand-100 shadow-sm overflow-hidden">
        <!-- Desktop table -->
        <div class="hidden sm:block overflow-x-auto p-4 md:p-6">
          <table class="w-full text-right text-xs md:text-sm">
            <thead class="bg-white text-brand-400 uppercase border-b border-brand-50">
                <tr>
                    <th class="p-3 md:p-4 text-right">الاسم</th>
                    <th class="p-3 md:p-4 text-right">الكود (الدخول)</th>
                    <th class="p-3 md:p-4 text-right">الرمز السري</th>
                    <th class="p-3 md:p-4 text-right">النقاط</th>
                    <th class="p-3 md:p-4 text-center">إجراء</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-brand-50">
                <tr v-for="p in participantsList" :key="p.id" class="hover:bg-brand-50/50 transition duration-200">
                    <td class="p-3 md:p-4 font-bold">{{ p.name || '---' }}</td>
                    <td class="p-3 md:p-4"><span class="bg-brand-100 text-brand-800 px-2 md:px-3 py-1 rounded-lg font-mono font-bold shadow-sm">{{ p.code }}</span></td>
                    <td class="p-3 md:p-4"><span class="bg-emerald-100 text-emerald-800 px-2 md:px-3 py-1 rounded-lg font-mono font-bold shadow-sm">{{ p.secretCode }}</span></td>
                    <td class="p-3 md:p-4 font-bold text-brand-600">{{ p.totalScore }}</td>
                    <td class="p-3 md:p-4 text-center">
                        <button @click="deleteParticipant(p.id)" class="text-red-400 hover:text-red-600 bg-red-50 px-2 md:px-3 py-1 rounded-lg transition duration-200 hover:shadow-sm text-xs md:text-sm">حذف</button>
                    </td>
                </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile cards -->
        <div class="sm:hidden p-4 space-y-3">
          <div v-for="p in participantsList" :key="p.id" class="bg-brand-50/30 p-4 rounded-xl border border-brand-100 space-y-3">
            <div class="flex justify-between items-start gap-2">
              <span class="text-xs font-bold text-brand-500">الاسم</span>
              <span class="font-bold text-brand-800 text-sm">{{ p.name || '---' }}</span>
            </div>
            <div class="flex justify-between items-start gap-2">
              <span class="text-xs font-bold text-brand-500">الكود</span>
              <span class="bg-brand-100 text-brand-800 px-2 py-1 rounded font-mono font-bold text-xs">{{ p.code }}</span>
            </div>
            <div class="flex justify-between items-start gap-2">
              <span class="text-xs font-bold text-brand-500">الرمز السري</span>
              <span class="bg-emerald-100 text-emerald-800 px-2 py-1 rounded font-mono font-bold text-xs">{{ p.secretCode }}</span>
            </div>
            <div class="flex justify-between items-start gap-2">
              <span class="text-xs font-bold text-brand-500">النقاط</span>
              <span class="font-bold text-brand-600">{{ p.totalScore }}</span>
            </div>
            <button @click="deleteParticipant(p.id)" class="w-full text-red-400 hover:text-red-600 bg-red-50 px-3 py-2 rounded-lg transition duration-200 hover:shadow-sm text-xs font-bold mt-2">حذف</button>
          </div>
        </div>
    </div>

    <!-- Print Only Area (A4 Cards) -->
    <div class="print-area hidden">
       <div class="print-grid">
           <div v-for="p in participantsList" :key="'print-'+p.id" class="print-card">
               <div class="card-header"> مدرسة الامام محمد الباقر النسوية </div>
               <div class="card-body">
                   <p><strong>اسم المشارك:</strong> <span>{{ p.name || '---' }}</span></p>
                   <p><strong>كود الدخول:</strong> <span class="code">{{ p.code }}</span></p>
                   <p><strong>الرقم السري:</strong> <span class="secret">{{ p.secretCode }}</span></p>
               </div>
               <div class="card-footer">احتفظ بهذه البطاقة للدخول للمسابقات</div>
           </div>
       </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchApi, showMessage } from '../../utils/api';

const participantsList = ref([]);
const newParticipantName = ref('');
const loading = ref(false);

const loadParticipants = async () => participantsList.value = await fetchApi('/participants');

const addParticipant = async () => {
    loading.value = true;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const secret = Math.floor(100000 + Math.random() * 900000).toString();
    try {
        await fetchApi('/participants', 'POST', { name: newParticipantName.value.trim(), code, secretCode: secret });
        newParticipantName.value = '';
        await loadParticipants();
        showMessage('تم إضافة المتسابق بنجاح', 'success');
    } catch (e) {} finally { loading.value = false; }
};

const deleteParticipant = async (id) => {
    if(confirm('تأكيد الحذف؟')) {
        await fetchApi(`/participants/${id}`, 'DELETE');
        await loadParticipants();
    }
};

const printA4Codes = () => {
    window.print();
};

onMounted(loadParticipants);
</script>
