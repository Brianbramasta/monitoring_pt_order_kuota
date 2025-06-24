import apiClient from './apiClient';

/**
 * Ambil daftar produk
 * @param {Object} params
 *   - period: Filter periode (opsional, misal: 'today', 'last_3_days', 'this_week', 'this_month')
 *   - search: Kata kunci pencarian (opsional)
 *   - limit: Jumlah data per halaman (opsional, default 10)
 *   - page: Nomor halaman (opsional, default 1)
 */
export const getProducts = (params) =>
  apiClient.get('/api/v1/products', { params });

/**
 * Tambah produk baru
 * @param {Object} data
 *   - product_type: Jenis Produk (string, wajib, harus dari daftar dropdown)
 *   - product_name: Nama Produk (string, wajib)
 *   - vd_id_code: VD ID Kode (string, wajib)
 */
export const addProduct = (data) =>
  apiClient.post('/api/v1/products', data);

/**
 * Edit produk
 * @param {number} id - ID produk yang akan diedit
 * @param {Object} data
 *   - product_type: Jenis Produk (string, opsional)
 *   - product_name: Nama Produk (string, opsional)
 *   - vd_id_code: VD ID Kode (string, opsional)
 */
export const editProduct = (id, data) =>
  apiClient.put(`/api/v1/products/${id}`, data);

/**
 * Hapus produk
 * @param {number} id - ID produk yang akan dihapus
 */
export const deleteProduct = (id) =>
  apiClient.delete(`/api/v1/products/${id}`);

/**
 * Ambil data produk terlaris
 * @param {Object} params
 *   - limit: Jumlah data produk terlaris yang ingin ditampilkan (opsional, default 5)
 */
export const getBestSellingProducts = (params) =>
  apiClient.get('/api/v1/products/best-selling', { params });

/**
 * Ambil opsi jenis produk untuk dropdown (Pengelolaan VO ID Kode)
 * Endpoint: /api/v1/options/product-types
 * @returns {Promise} Response berisi array product_types
 */
export const getProductTypesOptions = () =>
  apiClient.get('/api/v1/options/product-types');

/**
 * Ambil opsi produk untuk dropdown/filter monitor transaksi
 * Endpoint: /api/v1/options/products
 * @param {Object} params
 *   - search: Kata kunci pencarian nama produk (opsional)
 *   - limit: Jumlah data per halaman (opsional, default 100)
 *   - page: Nomor halaman (opsional, default 1)
 * @returns {Promise} Response berisi array products dan pagination
 */
export const getProductsOptions = (params) =>
  apiClient.get('/api/v1/options/products', { params }); 