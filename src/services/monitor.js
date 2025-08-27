import apiClient from './apiClient';

/**
 * Ambil data grafik monitor transaksi
 * @param {Object} params
 *   - periode: Filter periode (opsional, pilihan: '4hours', 'daily', '3days', 'weekly', 'monthly')
 *   - product_id: ID produk untuk filter (opsional)
 *   - start_date: Tanggal mulai filter (opsional, format YYYY-MM-DD HH:mm:ss)
 *   - end_date: Tanggal akhir filter (opsional, format YYYY-MM-DD HH:mm:ss)
 */
export const getTransactionChart = (params) =>
  apiClient.get('/api/v1/monitor/transactions', { params });

/**
 * Ambil semua data QRIS (merchant, static, deposit, dan comparison)
 * @param {Object} params
 *   - period: Filter periode (opsional, pilihan: '4hours', 'daily', '3days', 'weekly', 'monthly')
 *   - start_date: Tanggal mulai filter (opsional, format YYYY-MM-DD HH:mm:ss)
 *   - end_date: Tanggal akhir filter (opsional, format YYYY-MM-DD HH:mm:ss)
 * @returns {Promise} Response data berisi:
 *   - merchant_chart: Array data transaksi QRIS merchant
 *   - static_chart: Array data transaksi QRIS static
 *   - deposit_chart: Array data transaksi deposit via QRIS
 *   - comparison: Object perbandingan QRIS Nobu & Winpay {transactions: {winpay, nobu}, revenue: {winpay, nobu}}
 */
export const getQrisTransactions = (params) =>
  apiClient.get('/api/v1/monitor/qris/transaction', { params });

/**
 * Ambil data rekap dan list transaksi monitoring
 * @param {Object} params
 *   - search: Kata kunci pencarian (opsional)
 *   - limit: Jumlah data per halaman (opsional, default 10)
 *   - page: Nomor halaman (opsional, default 1)
 *   - periode: Filter periode (opsional, pilihan: '4hours', 'daily', '3days', 'weekly', 'monthly')
 *   - start_date: Tanggal mulai filter (opsional, format YYYY-MM-DD HH:mm:ss)
 *   - end_date: Tanggal akhir filter (opsional, format YYYY-MM-DD HH:mm:ss)
 *   - product_id: ID produk untuk filter chart (opsional)
 */
export const getMonitorTransactionList = (params) =>
  apiClient.get('/api/v1/monitor/transactions', { params });