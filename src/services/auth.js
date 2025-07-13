import apiClient from './apiClient';

/**
 * Request login user
 * @param {Object} data
 *   - email: Email user (string, wajib)
 *   - password: Password user (string, wajib)
 */
export const login = (data) =>
  apiClient.post('/api/v1/auth/login', data);

/**
 * Request register user baru
 * @param {Object} data
 *   - username: Username/email user (string, wajib)
 *   - password: Password user (string, wajib)
 *   - nama_lengkap: Nama lengkap user (string, opsional)
 */
export const register = (data) =>
  apiClient.post('/api/v1/auth/register', data); 