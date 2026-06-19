import { apiClient, authConfig } from './apiClient';

export const libraryService = {
  getBooks: () => apiClient.get('/api/books'),
  getAuthBookPicks: () => apiClient.get('/api/books/auth-picks'),
  getLandingPicks: () => apiClient.get('/api/books/landing-picks'),
  getCategories: () => apiClient.get('/api/categories'),
  createCategory: (payload, token) => apiClient.post('/api/categories', payload, authConfig(token)),
  updateCategory: (id, payload, token) => apiClient.put(`/api/categories/${id}`, payload, authConfig(token)),
  deleteCategory: (id, token) => apiClient.delete(`/api/categories/${id}`, authConfig(token)),
  createBook: (formData, token) => apiClient.post('/api/books', formData, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
  }),
  updateBook: (id, formData, token) => apiClient.put(`/api/books/${id}`, formData, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
  }),
  updateBookStatus: (id, payload, token) => apiClient.patch(`/api/books/${id}/status`, payload, authConfig(token)),
  deleteBook: (id, token) => apiClient.delete(`/api/books/${id}`, authConfig(token)),
  getLoans: (token) => apiClient.get('/api/loans', authConfig(token)),
  getMyLoans: (token) => apiClient.get('/api/loans/my', authConfig(token)),
  createLoan: (payload, token) => apiClient.post('/api/loans', payload, authConfig(token)),
  updateLoanStatus: (id, payload, token) => apiClient.patch(`/api/loans/${id}/status`, payload, authConfig(token)),
  getBorrowers: (token) => apiClient.get('/api/borrowers', authConfig(token)),
  createBorrower: (payload, token) => apiClient.post('/api/borrowers', payload, authConfig(token)),
  updateBorrowerStatus: (id, payload, token) => apiClient.patch(`/api/borrowers/${id}/status`, payload, authConfig(token)),
};
