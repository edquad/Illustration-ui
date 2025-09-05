import { getRequest, postRequest, putRequest, deleteRequest } from './APIUtils';
import { useAuth0 } from '@auth0/auth0-react';

// Hook for authenticated API calls
export const useAuthenticatedAPI = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const getAuthHeaders = async () => {
    if (!isAuthenticated) return {};
    
    try {
      const domain = "illustration.sandbox1.ceresinsurance.com";
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: `https://${domain}/api/v2/`,
          scope: "read:current_user",
        },
      });
      return { Authorization: `Bearer ${token}` };
    } catch (error) {
      console.error('Error getting access token:', error);
      return {};
    }
  };

  const authenticatedGet = async (endpoint) => {
    const authHeaders = await getAuthHeaders();
    return getRequest(endpoint, authHeaders);
  };

  const authenticatedPost = async (endpoint, data) => {
    const authHeaders = await getAuthHeaders();
    return postRequest(endpoint, data, authHeaders);
  };

  const authenticatedPut = async (endpoint, data) => {
    const authHeaders = await getAuthHeaders();
    return putRequest(endpoint, data, authHeaders);
  };

  const authenticatedDelete = async (endpoint, params) => {
    const authHeaders = await getAuthHeaders();
    return deleteRequest(endpoint, params, authHeaders);
  };

  return {
    get: authenticatedGet,
    post: authenticatedPost,
    put: authenticatedPut,
    delete: authenticatedDelete,
  };
};