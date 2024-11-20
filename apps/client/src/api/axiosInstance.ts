import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000', 
  timeout: 30000,
});


instance.interceptors.request.use(
  (config) => {
    const storedContext = JSON.parse(localStorage.getItem('access-token') || '{}');
    const token = storedContext?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {

      localStorage.removeItem('access-token');

      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;
