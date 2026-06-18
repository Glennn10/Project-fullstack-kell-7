import { apiClient, authConfig } from './apiClient';

export const libraryService = {
  getBooks: () => apiClient.get('/api/books'),
  getCategories: () => apiClient.get('/api/categories'),
  createBook: (formData, token) => apiClient.post('/api/books', formData, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
  }),
  updateBook: (id, formData, token) => apiClient.put(`/api/books/${id}`, formData, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
  }),
  deleteBook: (id, token) => apiClient.delete(`/api/books/${id}`, authConfig(token)),
  getLoans: (token) => apiClient.get('/api/loans', authConfig(token)),
  getMyLoans: (token) => apiClient.get('/api/loans/my', authConfig(token)),
  createLoan: (payload, token) => apiClient.post('/api/loans', payload, authConfig(token)),
  getBorrowers: (token) => apiClient.get('/api/borrowers', authConfig(token)),
  createBorrower: (payload, token) => apiClient.post('/api/borrowers', payload, authConfig(token)),
};
