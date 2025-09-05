import { useAuth0 } from '@auth0/auth0-react';
import config from '../models/common/AppConfig';

class ApiService {
  constructor() {
    this.getAccessTokenSilently = null;
    this.domain = "illustration.sandbox1.ceresinsurance.com";
  }

  // Initialize with Auth0 hook
  init(getAccessTokenSilently) {
    this.getAccessTokenSilently = getAccessTokenSilently;
  }

  // Get access token automatically
  async getAuthHeaders() {
    if (!this.getAccessTokenSilently) {
      throw new Error('ApiService not initialized. Call init() first.');
    }

    try {
      const accessToken = await this.getAccessTokenSilently({
        authorizationParams: {
          audience: `https://${this.domain}/api/v2/`,
          scope: "read:current_user",
        },
      });
      
      return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      };
    } catch (error) {
      console.error('Error getting access token:', error);
      return {
        'Content-Type': 'application/json',
      };
    }
  }

  // GET request with automatic auth
  async get(endpoint) {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${config.baseURL}${endpoint}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || `Failed to GET data from ${endpoint}`);
    }

    return response.json();
  }

  // POST request with automatic auth
  async post(endpoint, data) {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${config.baseURL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || `Failed to POST data to ${endpoint}`);
    }

    return response.json();
  }

  // PUT request with automatic auth
  async put(endpoint, data) {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${config.baseURL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || `Failed to PUT data to ${endpoint}`);
    }

    return response.json();
  }

  // DELETE request with automatic auth
  async delete(endpoint, data = null) {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${config.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers,
      body: data ? JSON.stringify(data) : null,
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || `Failed to DELETE data from ${endpoint}`);
    }

    return response.json();
  }
}

// Create a singleton instance
const apiService = new ApiService();
export default apiService;