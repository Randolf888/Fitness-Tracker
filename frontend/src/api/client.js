import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 12000
});

client.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('fitlog-session');
      if (stored) {
        const { token } = JSON.parse(stored);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (_) {
      // Ignore malformed session data in storage
    }
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error?.response?.data?.message || error.message || 'Request failed';
    return Promise.reject(new Error(message));
  }
);

export default client;
