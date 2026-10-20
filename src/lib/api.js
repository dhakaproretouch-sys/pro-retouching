import axios from 'axios';

/**
 * Shared axios instance for the whole app (public + admin).
 * - Base URL comes from VITE_API_URL. In production, when it is unset we fall
 *   back to the same-origin `/api` (the Vercel function), never to localhost.
 * - In local development the default is the local dev server.
 * - withCredentials sends the httpOnly admin JWT cookie on every request.
 * - 401 responses (other than the login attempt itself) redirect to /admin/login.
 */
const configuredBaseUrl = import.meta.env.VITE_API_URL?.trim();
const fallbackBaseUrl = import.meta.env.PROD
  ? '/api'
  : 'http://localhost:5000/api';
const baseURL = configuredBaseUrl || fallbackBaseUrl;

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || '';
    const isLoginAttempt = requestUrl.includes('/auth/login');

    // Session expired / not authenticated -> bounce to the login page.
    if (status === 401 && !isLoginAttempt) {
      const path = window.location.pathname;
      if (path.startsWith('/admin') && path !== '/admin/login') {
        window.location.assign('/admin/login');
      }
    }

    return Promise.reject(error);
  }
);

/** Extract the API error message from a failed axios call. */
export function getApiErrorMessage(error, fallback = 'Something went wrong') {
  return error?.response?.data?.message || error?.message || fallback;
}

/** Backend envelope: { success, message, data }. */
export function unwrap(response) {
  return response.data;
}

export default api;
