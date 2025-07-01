et Options untuk Dropdown

1. Opsi Jenis Produk (Untuk Pengelolaan VO ID Kode)
   Endpoint: /api/v1/options/product-types
   Method: GET
   Parameter Request: Tidak ada
   Parameter Response:
   product_types: Array objek
   id: ID unik untuk jenis produk (integer)
   name: Nama jenis produk (string)
   Example Response (JSON):JSON
   {
   "code": 200,
   "status": "success",
   "message": "Daftar jenis produk berhasil diambil",
   "data": {
   "product_types": [
   {
   "id": 1,
   "name": "Telkomsel"
   },
   {
   "id": 2,
   "name": "Indosat"
   },
   {
   "id": 3,
   "name": "XL"
   },
   {
   "id": 4,
   "name": "Smartfren"
   },
   {
   "id": 5,
   "name": "Pembayaran Tagihan"
   }
   ]
   }
   }
   ​
2. Opsi Produk (Untuk Filter Monitor Transaksi)
   Endpoint: /api/v1/options/products
   Method: GET
   Parameter Request:
   search: Kata kunci pencarian nama produk (opsional)
   limit: Jumlah data per halaman (opsional, default 100)
   page: Nomor halaman (opsional, default 1)
   Parameter Response:
   products: Array objek
   id: ID produk (integer)
   name: Nama produk (string)
   pagination: Objek informasi pagination (sama seperti endpoint daftar)
   Example Response (JSON):JSON
   {
   "code": 200,
   "status": "success",
   "message": "Daftar produk berhasil diambil",
   "data": {
   "products": [
   {
   "id": 1,
   "name": "Pulsa Telkomsel 5rb"
   },
   {
   "id": 2,
   "name": "Paket Data XL 1GB"
   },
   {
   "id": 3,
   "name": "Token PLN 20rb"
   }
   ],
   "pagination": {
   "total_data": 250,
   "total_pages": 3,
   "current_page": 1,
   "limit": 100
   }
   }
   }
