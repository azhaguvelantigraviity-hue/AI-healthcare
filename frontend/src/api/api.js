import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Add a response interceptor
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If the server returns a 401 Unauthorized error
    if (error.response && error.response.status === 401) {
      // Clear the stale token from localStorage
      localStorage.removeItem('userInfo');
      // Redirect to the login page (or root)
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const getCorrectUrl = (url) => {
  if (!url) return null;
  let backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  if (backendUrl.endsWith('/')) {
    backendUrl = backendUrl.slice(0, -1);
  }
  if (url.includes('http://localhost:5000')) {
    return url.replace('http://localhost:5000', backendUrl);
  }
  if (url.startsWith('/uploads/')) {
    return `${backendUrl}${url}`;
  }
  return url;
};

export default API;
