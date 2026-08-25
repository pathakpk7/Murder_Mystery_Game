/**
 * ============================================================
 * PROJECT VRITRA — CENTRALIZED API CLIENT
 * ============================================================
 *
 * Works in:
 *   1. Local Vite development
 *   2. Vercel frontend + separate Vercel backend
 *   3. Same-domain/co-located deployment
 *
 * Environment:
 *   VITE_API_URL=https://your-backend.vercel.app
 *
 * If VITE_API_URL is not provided, requests use relative paths:
 *   /api/...
 *
 * ============================================================
 */

/**
 * Resolve the API base URL.
 *
 * Production:
 *   VITE_API_URL=https://project-vritra-api.vercel.app
 *
 * Development:
 *   VITE_API_URL=http://localhost:5433
 *
 * Same-domain deployment:
 *   leave VITE_API_URL empty
 */
const rawApiUrl = import.meta.env.VITE_API_URL || '';

export const API_BASE_URL = rawApiUrl
  .trim()
  .replace(/\/+$/, '');

/**
 * Build a complete API URL.
 *
 * Examples:
 *
 * getApiUrl('/api/cases')
 * -> https://project-vritra-api.vercel.app/api/cases
 *
 * getApiUrl('api/health')
 * -> https://project-vritra-api.vercel.app/api/health
 *
 * If API_BASE_URL is empty:
 *
 * getApiUrl('/api/cases')
 * -> /api/cases
 */
export function getApiUrl(path = '') {
  if (!path) {
    return API_BASE_URL || '/';
  }

  const cleanPath = String(path).startsWith('/')
    ? String(path)
    : `/${path}`;

  return `${API_BASE_URL}${cleanPath}`;
}

/**
 * Get the stored Vritra authentication token.
 */
function getAuthToken() {
  try {
    return localStorage.getItem('vritra_auth_token');
  } catch {
    return null;
  }
}

/**
 * Standardized API fetch wrapper.
 *
 * @param {string} endpoint
 * @param {RequestInit} options
 * @returns {Promise<any>}
 */
export async function fetchAPI(endpoint, options = {}) {
  const url = getApiUrl(endpoint);

  const token = getAuthToken();

  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  /**
   * Attach JWT when available.
   */
  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;

  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (networkError) {
    const error = new Error(
      `Unable to connect to the Vritra API. ${
        networkError?.message || 'Network request failed.'
      }`
    );

    error.code = 'NETWORK_ERROR';
    error.originalError = networkError;
    error.url = url;

    throw error;
  }

  /**
   * Try to parse JSON.
   *
   * Some endpoints may return an empty response,
   * so parsing failure is handled gracefully.
   */
  let data = null;

  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    data = await response.json().catch(() => null);
  } else {
    const text = await response.text().catch(() => '');

    if (text) {
      data = text;
    }
  }

  /**
   * Handle HTTP errors.
   */
  if (!response.ok) {
    const message =
      data?.error ||
      data?.message ||
      (typeof data === 'string' ? data : null) ||
      response.statusText ||
      `HTTP ${response.status}`;

    const error = new Error(message);

    error.status = response.status;
    error.statusText = response.statusText;
    error.body = data;
    error.url = url;

    throw error;
  }

  return data;
}

/**
 * ============================================================
 * HTTP HELPERS
 * ============================================================
 */

export function apiGet(endpoint, options = {}) {
  return fetchAPI(endpoint, {
    ...options,
    method: 'GET',
  });
}

export function apiPost(endpoint, body = {}, options = {}) {
  return fetchAPI(endpoint, {
    ...options,
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function apiPut(endpoint, body = {}, options = {}) {
  return fetchAPI(endpoint, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

export function apiPatch(endpoint, body = {}, options = {}) {
  return fetchAPI(endpoint, {
    ...options,
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export function apiDelete(endpoint, options = {}) {
  return fetchAPI(endpoint, {
    ...options,
    method: 'DELETE',
  });
}

/**
 * ============================================================
 * AUTH TOKEN HELPERS
 * ============================================================
 */

export function setAuthToken(token) {
  try {
    if (token) {
      localStorage.setItem('vritra_auth_token', token);
    } else {
      localStorage.removeItem('vritra_auth_token');
    }
  } catch (error) {
    console.warn(
      '[Vritra API] Unable to save authentication token:',
      error
    );
  }
}

export function getStoredAuthToken() {
  return getAuthToken();
}

export function clearAuthToken() {
  try {
    localStorage.removeItem('vritra_auth_token');
  } catch (error) {
    console.warn(
      '[Vritra API] Unable to clear authentication token:',
      error
    );
  }
}

/**
 * ============================================================
 * API HEALTH
 * ============================================================
 */

export async function checkApiHealth() {
  try {
    return await apiGet('/api/health');
  } catch (error) {
    console.error('[Vritra API] Health check failed:', error);
    throw error;
  }
}

/**
 * ============================================================
 * CASE API
 * ============================================================
 */

export function getCases() {
  return apiGet('/api/cases');
}

export function getCase(caseId) {
  return apiGet(`/api/cases/${caseId}`);
}

export function getFullCase(caseId) {
  return apiGet(`/api/cases/${caseId}/full`);
}

export function getCaseObjectives(caseId) {
  return apiGet(`/api/cases/${caseId}/objectives`);
}

export function getCaseClues(caseId) {
  return apiGet(`/api/cases/${caseId}/clues`);
}

/**
 * ============================================================
 * QUERY API
 * ============================================================
 */

export function validateQuery(query, caseId = null) {
  return apiPost('/api/query/validate', {
    query,
    caseId,
  });
}

export function executeQuery(query, caseId = null) {
  return apiPost('/api/query/execute', {
    query,
    caseId,
  });
}

export function submitQueryAttempt(data) {
  return apiPost('/api/query/attempt', data);
}

/**
 * ============================================================
 * PROGRESS API
 * ============================================================
 */

export function startProgress(caseId, userId = null) {
  return apiPost('/api/progress/start', {
    caseId,
    userId,
  });
}

export function completeProgress(caseId, data = {}) {
  return apiPost('/api/progress/complete', {
    caseId,
    ...data,
  });
}

export function submitProgressQuery(caseId, query, data = {}) {
  return apiPost('/api/progress/submit-query', {
    caseId,
    query,
    ...data,
  });
}

/**
 * ============================================================
 * PROFILE API
 * ============================================================
 */

export function getProfile(userId) {
  return apiGet(`/api/profile/${userId}`);
}

export function updateProfile(userId, data) {
  return apiPut(`/api/profile/${userId}`, data);
}

export function syncProfile(data) {
  return apiPost('/api/profile/sync', data);
}

export function getSyncedProfile(userId) {
  const query = userId
    ? `?userId=${encodeURIComponent(userId)}`
    : '';

  return apiGet(`/api/profile/sync${query}`);
}

/**
 * ============================================================
 * LEADERBOARD API
 * ============================================================
 */

export function getLeaderboard() {
  return apiGet('/api/leaderboard');
}

export function getUserLeaderboard(userId) {
  return apiGet(`/api/leaderboard/${userId}`);
}

/**
 * ============================================================
 * ACHIEVEMENTS API
 * ============================================================
 */

export function getAchievements() {
  return apiGet('/api/achievements');
}

export function getUserAchievements(userId) {
  return apiGet(`/api/achievements/${userId}`);
}

/**
 * ============================================================
 * DEFAULT EXPORT
 * ============================================================
 */

const apiClient = {
  API_BASE_URL,

  getApiUrl,
  fetchAPI,

  apiGet,
  apiPost,
  apiPut,
  apiPatch,
  apiDelete,

  setAuthToken,
  getStoredAuthToken,
  clearAuthToken,

  checkApiHealth,

  getCases,
  getCase,
  getFullCase,
  getCaseObjectives,
  getCaseClues,

  validateQuery,
  executeQuery,
  submitQueryAttempt,

  startProgress,
  completeProgress,
  submitProgressQuery,

  getProfile,
  updateProfile,
  syncProfile,
  getSyncedProfile,

  getLeaderboard,
  getUserLeaderboard,

  getAchievements,
  getUserAchievements,
};

export default apiClient;