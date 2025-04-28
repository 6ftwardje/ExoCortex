import axios from 'axios';
import { API_CONFIG } from './constants';

const axiosInstance = axios.create({
  baseURL: API_CONFIG.API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance; 