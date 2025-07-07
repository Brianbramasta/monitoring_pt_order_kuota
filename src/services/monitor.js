import apiClient from './apiClient';

/**
 * Ambil data grafik monitor transaksi
 * @param {Object} params
 *   - period: Filter periode (opsional, default 'monthly'). Pilihan: 'daily', 'weekly', 'monthly', 'yearly'.
 *   - product_id: ID produk untuk filter (opsional, default produk pertama/Telkomsel?)
 */
export const getTransactionChart = (params) =>
  apiClient.get('/api/v1/monitor/transactions/chart', { params });

/**
 * Ambil data grafik monitor QRIS
 * @param {Object} params
 *   - period: Filter periode (opsional, default 'monthly'). Pilihan: 'daily', 'weekly', 'monthly', 'yearly'.
 */
export const getQrisChart = (params) =>
  apiClient.get('/api/v1/monitor/qris/chart', { params });

/**
 * Ambil data rekap dan list transaksi monitoring
 * @param {Object} params
 *   - search: Kata kunci pencarian (opsional)
 *   - limit: Jumlah data per halaman (opsional, default 10)
 *   - page: Nomor halaman (opsional, default 1)
 */
export const getMonitorTransactionList = (params) =>
  apiClient.get('/api/v1/monitor/transactions', { params }); 