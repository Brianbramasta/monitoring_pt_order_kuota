/**
 * Format angka ke format Rupiah Indonesia.
 * @param {number|string} value - Angka yang akan diformat.
 * @returns {string} Format rupiah, contoh: 'Rp 10.000'
 */
export function formatRupiah(value) {
  const number = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(number)) return 'Rp 0';
  return 'Rp ' + number.toLocaleString('id-ID');
} 