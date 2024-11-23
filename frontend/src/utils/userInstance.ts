import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL;

// Create an Axios instance with a base URL 

const instance: AxiosInstance = axios.create({
    baseURL: API_URL,
});

// Add JWT token to requests
instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Handle 401 responses
instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            useNavigate()('/login'); // Redirect to login page
        }
        return Promise.reject(error);
    }
);

export default instance;