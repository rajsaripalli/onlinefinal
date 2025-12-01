import axios from 'axios';

const API_URL = 'http://44.200.183.194:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  adminLogin: (data) => api.post('/auth/admin/login', data)
};

// Flights API
export const flightsAPI = {
  getAll: () => api.get('/flights'),
  getById: (flightId) => api.get(`/flights/${flightId}`),
  create: (data) => api.post('/flights', data),
  update: (flightId, data) => api.put(`/flights/${flightId}`, data),
  delete: (flightId) => api.delete(`/flights/${flightId}`)
};

// Bookings API
export const bookingsAPI = {
  create: (data) => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings/my-bookings'),
  getByPNR: (pnr) => api.get(`/bookings/pnr/${pnr}`),
  getAll: () => api.get('/bookings/all'),
  getById: (bookingId) => api.get(`/bookings/${bookingId}`),
  update: (bookingId, data) => api.put(`/bookings/${bookingId}`, data),
  delete: (bookingId) => api.delete(`/bookings/${bookingId}`)
};

export default api;

