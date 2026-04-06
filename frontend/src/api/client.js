import axios from 'axios';
import toast from 'react-hot-toast';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  headers: { 'Content-Type': 'application/json' }
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    toast.error(error.response?.data?.detail || 'API Error');
    return Promise.reject(error);
  }
);

export default client;
