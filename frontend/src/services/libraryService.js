import { apiClient, authConfig } from './apiClient';

export const libraryService = {
  getBooks: () => apiClient.get('/api/books'),
  getCategories: () => apiClient.get('/api/categories'),
  getLoans: (token) => apiClient.get('/api/loans', authConfig(token)),
  getMyLoans: (token) => apiClient.get('/api/loans/my', authConfig(token)),
  createLoan: (payload, token) => apiClient.post('/api/loans', payload, authConfig(token)),
  getBorrowers: (token) => apiClient.get('/api/borrowers', authConfig(token)),
  createBorrower: (payload, token) => apiClient.post('/api/borrowers', payload, authConfig(token)),
};
