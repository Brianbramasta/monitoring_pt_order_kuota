import apiClient from './apiClient';

/**
 * Ambil daftar VO ID Kode
 * @param {Object} params
 *   - period: Filter periode (opsional, misal: 'today', 'last_3_days', 'this_week', 'this_month')
 *   - search: Kata kunci pencarian (opsional)
 *   - limit: Jumlah data per halaman (opsional, default 10)
 *   - page: Nomor halaman (opsional, default 1)
 */
export const getVoidKodes = (params) =>
  apiClient.get('/api/v1/void-codes', { params });

/**
 * Tambah VO ID Kode baru
 * @param {Object} data
 *   - product_type: Jenis Produk (string, wajib, harus dari daftar dropdown)
 *   - product_name: Nama Produk (string, wajib)
 *   - vd_id_code: VD ID Kode (string, wajib)
 */
export const addVoidKode = (data) =>
  apiClient.post('/api/v1/void-codes', data);

/**
 * Edit VO ID Kode
 * @param {number} id - ID VO ID Kode yang akan diedit
 * @param {Object} data
 *   - product_type: Jenis Produk (string, opsional)
 *   - product_name: Nama Produk (string, opsional)
 *   - vd_id_code: VD ID Kode (string, opsional)
 */
export const editVoidKode = (id, data) =>
  apiClient.put(`/api/v1/void-codes/${id}`, data);

/**
 * Hapus VO ID Kode
 * @param {number} id - ID VO ID Kode yang akan dihapus
 */
export const deleteVoidKode = (id) =>
  apiClient.delete(`/api/v1/void-codes/${id}`);
