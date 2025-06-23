import apiClient from './apiClient';

/**
 * Ambil data transaksi gagal
 * @param {Object} params
 *   - start_date: Tanggal mulai filter (opsional, format 'YYYY-MM-DD')
 *   - end_date: Tanggal akhir filter (opsional, format 'YYYY-MM-DD')
 *   - search: Kata kunci pencarian nama produk, supplier, atau kode produk (opsional)
 *   - limit: Jumlah data per halaman (opsional, default 10)
 *   - page: Nomor halaman (opsional, default 1)
 */
export const getFailedTransactions = (params) =>
  apiClient.get('/api/v1/transactions/failed', { params });

/**
 * Ambil data transaksi pending
 * @param {Object} params
 *   - start_date: Tanggal mulai filter (opsional, format 'YYYY-MM-DD')
 *   - end_date: Tanggal akhir filter (opsional, format 'YYYY-MM-DD')
 *   - search: Kata kunci pencarian nama produk, supplier, atau kode produk (opsional)
 *   - limit: Jumlah data per halaman (opsional, default 10)
 *   - page: Nomor halaman (opsional, default 1)
 */
export const getPendingTransactions = (params) =>
  apiClient.get('/api/v1/transactions/pending', { params });

/**
 * Ambil data transaksi sukses
 * @param {Object} params
 *   - start_date: Tanggal mulai filter (opsional, format 'YYYY-MM-DD')
 *   - end_date: Tanggal akhir filter (opsional, format 'YYYY-MM-DD')
 *   - search: Kata kunci pencarian nama produk, supplier, atau kode produk (opsional)
 *   - limit: Jumlah data per halaman (opsional, default 10)
 *   - page: Nomor halaman (opsional, default 1)
 */
export const getSuccessTransactions = (params) =>
  apiClient.get('/api/v1/transactions/success', { params });

/**
 * Ambil data komplain transaksi
 * @param {Object} params
 *   - start_date: Tanggal mulai filter (opsional, format 'YYYY-MM-DD')
 *   - end_date: Tanggal akhir filter (opsional, format 'YYYY-MM-DD')
 *   - search: Kata kunci pencarian nama produk, supplier, atau kode produk (opsional)
 *   - limit: Jumlah data per halaman (opsional, default 10)
 *   - page: Nomor halaman (opsional, default 1)
 */
export const getComplaintTransactions = (params) =>
  apiClient.get('/api/v1/transactions/complaints', { params }); 