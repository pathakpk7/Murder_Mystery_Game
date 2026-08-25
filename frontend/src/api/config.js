/**
 * Centralized API Configuration & Client
 * PROJECT VRITRA — SQL Detective Thriller
 */

// Resolves base API URL from environment variables or defaults to relative path in dev/co-located serverless
export const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

/**
 * Helper to build full URL for API endpoints
 * @param {string} path - Relative endpoint path (e.g., '/api/cases')
 * @returns {string} Fully qualified URL
 */
export function getApiUrl(path) {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
}

/**
 * Standardized API Fetch Wrapper
 * @param {string} endpoint - API path (e.g. '/api/cases')
 * @param {RequestInit} options - fetch options
 * @returns {Promise<any>} Response JSON data
 */
export async function fetchAPI(endpoint, options = {}) {
  const url = getApiUrl(endpoint);
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  // Attach JWT auth token if stored
  const token = localStorage.getItem('vritra_auth_token');
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ message: response.statusText }));
    const error = new Error(errorBody.error || errorBody.message || `HTTP ${response.status}`);
    error.status = response.status;
    error.body = errorBody;
    throw error;
  }

  return response.json();
}

export default {
  API_BASE_URL,
  getApiUrl,
  fetchAPI,
};
