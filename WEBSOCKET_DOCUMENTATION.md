# Dokumentasi WebSocket Implementation

## Overview
Proyek ini telah diupgrade dari menggunakan `setInterval` menjadi WebSocket real-time untuk monitoring transaksi gagal. WebSocket memberikan komunikasi real-time yang lebih efisien dan responsif.

## Arsitektur

### WebSocket Server
- **Lokasi**: `src/websocket/server.js`
- **Port**: 8080
- **Framework**: Express.js + Socket.IO
- **Data Source**: `db.json`

### Frontend Client
- **Lokasi**: `src/app/transaction-fail/page.jsx`
- **Library**: Socket.IO Client
- **Auto-reconnect**: Ya
- **Fallback**: API REST jika WebSocket gagal

## Cara Menjalankan

### 1. Install Dependencies
```bash
npm install
```

### 2. Menjalankan WebSocket Server
```bash
# Opsi 1: Jalankan WebSocket server saja
npm run websocket

# Opsi 2: Jalankan WebSocket + Next.js bersamaan
npm run dev:all
```

### 3. Menjalankan Next.js Development Server
```bash
npm run dev
```

## WebSocket Events

### Client → Server
- `get-failed-data`: Request data transaksi gagal dengan parameter filter

### Server → Client
- `failed-data-response`: Response data transaksi gagal
- `failed-data-update`: Update otomatis setiap 10 detik
- `connect`: Konfirmasi koneksi berhasil
- `disconnect`: Notifikasi koneksi terputus
- `connect_error`: Error koneksi

## Parameter Request

```javascript
{
  search: string,           // Pencarian berdasarkan nama produk/supplier
  page: number,            // Halaman pagination (default: 1)
  limit: number,           // Jumlah data per halaman (default: 10)
  filter: string,          // Filter periode: 'today', '3days', 'weekly', 'monthly'
  startDate: string,       // Tanggal mulai (format: YYYY-MM-DD)
  endDate: string,         // Tanggal akhir (format: YYYY-MM-DD)
  periode: string          // Periode untuk chart data
}
```

## Response Structure

```javascript
{
  success: boolean,
  data: {
    recap: {
      totalTransactions: number,
      totalAmount: number,
      totalQuantity: number
    },
    transactions: Array,     // Data transaksi dengan pagination
    pagination: {
      currentPage: number,
      totalPages: number,
      totalItems: number,
      hasNext: boolean,
      hasPrev: boolean
    },
    mostFailedProducts: Array,
    topFailedPartners: Array,
    totalFailedTransactionsDaily: Array,
    chartData: Array
  }
}
```

## Fitur yang Didukung

✅ **Real-time Updates**: Data diperbarui otomatis setiap 10 detik
✅ **Search**: Pencarian berdasarkan nama produk atau supplier
✅ **Pagination**: Navigasi halaman dengan limit yang dapat disesuaikan
✅ **Date Filtering**: Filter berdasarkan periode atau custom date range
✅ **Auto-reconnect**: Koneksi otomatis tersambung kembali jika terputus
✅ **Fallback API**: Menggunakan REST API jika WebSocket tidak tersedia
✅ **Connection Status**: Indikator status koneksi di UI

## Health Check

WebSocket server menyediakan endpoint health check:
```
GET http://localhost:8080/health
```

Response:
```javascript
{
  status: "OK",
  timestamp: "2024-01-XX...",
  uptime: "XX seconds"
}
```

## Troubleshooting

### WebSocket Server Tidak Bisa Diakses
1. Pastikan port 8080 tidak digunakan aplikasi lain
2. Cek firewall settings
3. Jalankan `npm run websocket` untuk memulai server

### Frontend Tidak Terhubung ke WebSocket
1. Cek console browser untuk error messages
2. Pastikan WebSocket server berjalan di port 8080
3. Sistem akan otomatis fallback ke REST API

### Data Tidak Update Real-time
1. Cek connection status di UI
2. Refresh halaman untuk reconnect
3. Cek WebSocket server logs

## Scripts Package.json

```json
{
  "dev": "next dev",
  "websocket": "node src/websocket/server.js",
  "dev:all": "concurrently \"npm run dev\" \"npm run websocket\""
}
```

## Dependencies Tambahan

- `express`: Web server framework
- `socket.io`: WebSocket server library
- `socket.io-client`: WebSocket client library
- `dayjs`: Date manipulation library
- `concurrently`: Menjalankan multiple commands bersamaan

## Keamanan

- WebSocket server hanya menerima koneksi dari localhost
- Tidak ada autentikasi khusus (sesuai dengan REST API yang ada)
- Data filtering dilakukan di server side
- Input sanitization untuk mencegah injection

## Performance

- Update interval: 10 detik (dapat disesuaikan)
- Connection pooling: Otomatis oleh Socket.IO
- Memory usage: Minimal, tidak menyimpan state client
- CPU usage: Rendah, hanya processing data saat request

---

**Catatan**: Dokumentasi ini dibuat untuk memudahkan maintenance dan development selanjutnya. Jika ada pertanyaan atau issue, silakan cek troubleshooting section atau hubungi developer.