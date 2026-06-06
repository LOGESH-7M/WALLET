import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      throw new Error(error.response.data?.message || 'API request failed');
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
);

export const dashboardAPI = {
  getToday: async () => {
    return await apiClient.get('/api/dashboard/today');
  },

  getLive: async () => {
    return await apiClient.get('/api/dashboard/live');
  },

  getWeekly: async () => {
    return await apiClient.get('/api/dashboard/weekly');
  },
};

export default apiClient;

