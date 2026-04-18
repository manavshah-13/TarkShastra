/**
 * Centralized API utility for TarkShastra
 * Handles JWT injection, global error handling, and response parsing.
 */

const getHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  async get(endpoint) {
    const response = await fetch(`/api${endpoint}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return this.handleResponse(response);
  },

  async post(endpoint, data, isFormData = false) {
    const headers = getHeaders();
    let body = JSON.stringify(data);

    if (isFormData) {
      // For OAuth2 login, FastAPI expects x-www-form-urlencoded
      delete headers['Content-Type'];
      body = new URLSearchParams(data).toString();
      headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }

    const response = await fetch(`/api${endpoint}`, {
      method: 'POST',
      headers,
      body,
    });
    return this.handleResponse(response);
  },

  async handleResponse(response) {
    const contentType = response.headers.get('content-type');
    let data = null;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    }

    if (!response.ok) {
      // Handle 401 Unauthorized (expired token)
      if (response.status === 401 && !window.location.pathname.includes('/auth')) {
        localStorage.removeItem('token');
        // window.location.reload(); // Optional: trigger redirect to login
      }
      
      const error = (data && data.detail) || response.statusText;
      throw new Error(error);
    }

    return data;
  },

  // Helper for login since it uses form-data
  async login(username, password) {
    return this.post('/auth/login', { username, password }, true);
  }
};
