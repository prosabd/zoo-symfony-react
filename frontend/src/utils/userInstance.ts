import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
const API_URL = import.meta.env.VITE_API_URL;

const token = Cookies.get('token');
console.log(token);

// Function to verify the token
export const verifyToken = () => {
    if (!token) return false;
    try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp < Date.now() / 1000){
            Cookies.remove('token');
            return false;
        } else {
            return true;
        };
    } catch {
        return false;
    }
};

// Create an Axios instance with a base URL 
const instance: AxiosInstance = axios.create({
    baseURL: API_URL,
});

// Add JWT token to requests
instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Check if the token is expired
        if (!verifyToken()) {
            // Redirect to the login page
            useNavigate()('/login');
            return config;
        }
        config.headers.Authorization = `Bearer ${token}`;
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
            Cookies.remove('token');
            useNavigate()('/login');
        }
        return Promise.reject(error);
    }
);

export default instance;