import apiClient from './apiClient';

/**
 * Ambil data supplier
 * @param {Object} params
 *   - search: Kata kunci pencarian nama atau kode supplier (opsional)
 *   - limit: Jumlah data per halaman (opsional, default 10)
 *   - page: Nomor halaman (opsional, default 1)
 */
export const getSuppliers = (params) =>
  apiClient.get('/api/v1/suppliers', { params }); 