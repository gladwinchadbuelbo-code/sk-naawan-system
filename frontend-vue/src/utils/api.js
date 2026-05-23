/**
 * Centralized API configuration for the SK System frontend.
 * Uses Vite environment variables if available, falls back to localhost.
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000';

/**
 * Helper to build a full API URL from a path.
 * @param {string} path - API path (e.g., '/api/proposals/activity-proposals')
 * @returns {string} Full URL
 */
export const apiUrl = (path) => {
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

/**
 * Helper to make an authenticated fetch request with JSON body.
 * @param {string} path - API path
 * @param {Object} options - Fetch options override
 * @param {string} [token] - Bearer token
 * @returns {Promise<Response>}
 */
export const apiFetch = async (path, options = {}, token = null) => {
  const url = apiUrl(path);
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  return response;
};

/**
 * Parses an error response from the backend into a user-friendly message.
 * @param {Response} response - The fetch Response object
 * @param {Object} [result] - Already-parsed JSON body (optional)
 * @returns {string} Error message
 */
export const parseApiError = async (response, result = null) => {
  try {
    const data = result || await response.json();
    if (data.message) return data.message;
    if (data.errors && Array.isArray(data.errors)) {
      return data.errors.map(e => e.message || e).join('; ');
    }
    return `Server error (HTTP ${response.status})`;
  } catch {
    return `Unexpected server error (HTTP ${response.status})`;
  }
};

export default API_BASE_URL;
