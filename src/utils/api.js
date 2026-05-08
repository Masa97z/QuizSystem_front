import { reactive } from 'vue';

// In Docker (production), Nginx proxies /api → backend:3000/api
// In local dev, point directly to localhost:3000
export const API_URL=  'https://quiz-systemv2.onrender.com/api' ;

// Global toast state
export const toast = reactive({
  show: false,
  message: '',
  type: 'success'
});

export const showMessage = (msg, type = 'success') => {
  toast.message = msg;
  toast.type = type;
  toast.show = true;
  setTimeout(() => toast.show = false, 5778);
};

export const fetchApi = async (endpoint, method = 'GET', body = null) => {
  try {
    const options = { method, headers: { 'Content-Type': 'application/json' } };
    if (body) options.body = JSON.stringify(body);
    const res = await fetch(`${API_URL}${endpoint}`, options);
    if (!res.ok) {
      let msg = 'حدث خطأ';
      try {
        const data = await res.json();
        msg = data.message || msg;
      } catch {}
      throw new Error(msg);
    }
    return await res.json();
  } catch (error) {
    showMessage(error.message, 'error');
    throw error;
  }
};
