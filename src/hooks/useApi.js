import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import apiService from '../services/ApiService';

export const useApi = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      apiService.init(getAccessTokenSilently);
    }
  }, [getAccessTokenSilently, isAuthenticated]);

  return apiService;
};