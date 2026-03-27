import axios from 'axios';

const api = axios.create({
    baseURL: 'https://releevo.onrender.com/api',
});

api.interceptors.request.use(
    async (config) => {
        // Use Clerk token if available
        if (window.Clerk && window.Clerk.session) {
            try {
                const clerkToken = await window.Clerk.session.getToken();
                if (clerkToken) {
                    config.headers.Authorization = `Bearer ${clerkToken}`;
                    return config;
                }
            } catch (err) {
                // Ignore, fallback to local storage
            }
        }

        // Fallback to legacy auth if Clerk is not active
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
