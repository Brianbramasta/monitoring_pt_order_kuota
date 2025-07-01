import axios from 'axios';

const apiClient = axios.create({
  // baseURL: 'https://8cf924a4-47f2-4765-b937-a945e2dd0f8c-00-2xdk8t32t8xn0.pike.replit.dev', // Ganti ke URL API asli nanti
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // Ganti ke URL API asli nanti
  // baseURL: 'https://monitoring-pt-order-kuota.vercel.app', // Ganti ke URL API asli nanti
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient; 