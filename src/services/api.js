import axios from 'axios';

const API_URL = 'http://localhost:58698/api';

export const registerUser = async (userData) => {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
};

export const loginUser = async (loginData) => {
    const response = await axios.post(`${API_URL}/auth/login`, loginData);
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
		localStorage.setItem('user', JSON.stringify({
		    userId: response.data.userId,
		    username: response.data.username,
		    role: response.data.role
		}));
    }
    return response.data;
};

export const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

export const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

export const getToken = () => {
    return localStorage.getItem('token');
};

export const getProducts = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const getProductById = async (id) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};