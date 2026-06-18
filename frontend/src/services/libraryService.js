import { apiClient, authConfig } from './apiClient';

export const libraryService = {
  getBooks: () => apiClient.get('/api/books'),
  getLoans: (token) => apiClient.get('/api/loans', authConfig(token)),
  createLoan: (payload, token) => apiClient.post('/api/loans', payload, authConfig(token)),
  getBorrowers: (token) => apiClient.get('/api/borrowers', authConfig(token)),
  createBorrower: (payload, token) => apiClient.post('/api/borrowers', payload, authConfig(token)),
};
