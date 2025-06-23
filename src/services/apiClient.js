import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000', // Ganti ke URL API asli nanti
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient; 