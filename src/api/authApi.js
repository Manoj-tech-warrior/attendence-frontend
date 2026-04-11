import apiClient from './apiClient';

const AUTH_PATH = '/auth';

const register = async (userData) => {
  try {
    const response = await apiClient.post(`${AUTH_PATH}/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response || error;
  }
};

const login = async (userData) => {
  try {
    const response = await apiClient.post(`${AUTH_PATH}/login`, userData);
    return response.data;
  } catch (error) {
    throw error.response || error;
  }
};

const logout = () => {
  localStorage.removeItem('token');
};

const getCurrentUser = () => {
  const token = localStorage.getItem('token');
  if (token) {
    return JSON.parse(atob(token.split('.')[1]));
  }
  return null;
};

export { register, login, logout, getCurrentUser };

