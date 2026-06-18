import { apiClient } from './apiClient';

export const authService = {
  login: (credentials) => apiClient.post('/api/auth/login', credentials),
  register: (account) => apiClient.post('/api/auth/register', account),
};
