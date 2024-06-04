import axios from 'axios';
import {BaseUrl} from "config";
const axiosInstance = axios.create({
  baseURL: BaseUrl, // Your base URL
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // You can modify the request config here (e.g., adding headers)
    // config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // You can handle successful responses globally here
    return response;
  },
  (error) => {
    // You can handle errors globally here
    return Promise.reject(error);
  }
);

export default axiosInstance;
