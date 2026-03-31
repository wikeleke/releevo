import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (window.location.hostname === 'localhost'
    ? 'http://localhost:5001/api'
    : 'https://releevo.onrender.com/api');

// Create an axios instance pointing to the backend API
const api = axios.create({
  baseURL: API_BASE_URL,
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
        // Request a fresh session token first; fallback to cached if needed.
        let token = await clerkGetToken({ skipCache: true });
        if (!token) {
          token = await clerkGetToken();
        }
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      // Continue without auth header if token retrieval fails.
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
