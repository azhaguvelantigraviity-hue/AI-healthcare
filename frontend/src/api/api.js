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

export default API;
