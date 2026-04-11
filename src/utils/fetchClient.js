import axios from 'axios';

const fetchClient = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjust the base URL as needed
});

// Intercept requests to add the JWT token to the headers
fetchClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Intercept responses to handle errors globally
fetchClient.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response && error.response.status === 401) {
    // Handle unauthorized access (e.g., redirect to login)
    localStorage.removeItem('token');
    window.location.href = '/login'; // Adjust the redirect as needed
  }
  return Promise.reject(error);
});

export default fetchClient;
