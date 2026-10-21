/**
 * Automated Broadband Installation Workflow
 * Frontend API Service
 * Author: Pushkar Waykole (23102C0012)
 */

const BASE_URL = '/api';

function getAuthHeader() {
  const token = localStorage.getItem('broadband_jwt');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  // If body is FormData (e.g. file upload), remove Content-Type so browser sets boundary
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = data?.message || `HTTP Error ${response.status}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Auth
  async login(username, password) {
    const res = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    if (res.data?.token) {
      localStorage.setItem('broadband_jwt', res.data.token);
      localStorage.setItem('broadband_user', JSON.stringify(res.data));
    }
    return res.data;
  },

  async register(userData) {
    const res = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (res.data?.token) {
      localStorage.setItem('broadband_jwt', res.data.token);
      localStorage.setItem('broadband_user', JSON.stringify(res.data));
    }
    return res.data;
  },

  logout() {
    localStorage.removeItem('broadband_jwt');
    localStorage.removeItem('broadband_user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('broadband_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Customer Requests
  async submitRequest(payload) {
    return request('/requests', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async uploadDocument(requestId, file) {
    const formData = new FormData();
    formData.append('file', file);
    return request(`/documents/upload/${requestId}`, {
      method: 'POST',
      body: formData,
    });
  },

  async getMyRequests() {
    return request('/requests/my-requests');
  },

  async getRequestDetails(id) {
    return request(`/requests/${id}`);
  },

  // Reviewer Requests
  async getAllRequests(status = '', search = '') {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (search) params.append('search', search);
    const query = params.toString() ? `?${params.toString()}` : '';
    return request(`/requests/reviewer/all${query}`);
  },

  async reviewRequest(id, reviewPayload) {
    return request(`/requests/reviewer/${id}/review`, {
      method: 'PUT',
      body: JSON.stringify(reviewPayload),
    });
  },

  async getAnalyticsStats() {
    return request('/requests/analytics/stats');
  },

  getDocumentDownloadUrl(documentId) {
    return `${BASE_URL}/documents/download/${documentId}`;
  },
};
