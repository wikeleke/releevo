import axios from 'axios';

// Create an axios instance pointing to the backend API
const api = axios.create({
  baseURL: 'https://releevo.onrender.com/api',
});

// We store a reference to the Clerk getToken function so the interceptor can use it.
// This is set by calling `setClerkGetToken` from a React component.
let clerkGetToken = null;

export const setClerkGetToken = (fn) => {
  clerkGetToken = fn;
};

// Attach a request interceptor that injects the Clerk JWT token when available
api.interceptors.request.use(
  async (config) => {
    try {
      if (clerkGetToken) {
        const token = await clerkGetToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          return config;
        }
      }
    } catch (e) {
      // ignore errors, fallback to any legacy token
    }
    // Legacy fallback (if any token stored in localStorage)
    const legacy = localStorage.getItem('token');
    if (legacy) {
      config.headers.Authorization = `Bearer ${legacy}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
