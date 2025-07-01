# Kontrak API Web Monitoring

Berikut adalah rancangan kontrak API untuk masing-masing fitur yang Anda sebutkan, dengan detail endpoint, parameter request, method, parameter response, dan contoh response (JSON).

**Catatan Penting:**

- Ini adalah rancangan awal dan mungkin perlu disesuaikan dengan kebutuhan spesifik dan desain database Anda.
- Nama-nama endpoint, parameter, dan nilai contoh bisa diubah sesuai konvensi API Anda.
- Asumsi otentikasi (misalnya token API) tidak disertakan di sini, namun penting untuk diimplementasikan.
- Parameter pagination `limit` dan `page` akan disertakan di hampir semua endpoint daftar.

---

## 1. Transaksi Gagal

- **Endpoint:** `/api/v1/transactions/failed`
- **Method:** `GET`
- **Parameter Request:**
  - `start_date`: Tanggal mulai filter (opsional, format `YYYY-MM-DD`)
  - `end_date`: Tanggal akhir filter (opsional, format `YYYY-MM-DD`)
  - `search`: Kata kunci pencarian nama produk, supplier, atau kode produk (opsional)
  - `limit`: Jumlah data per halaman (opsional, default 10)
  - `page`: Nomor halaman (opsional, default 1)
- **Parameter Response:**
  - `recap`: Objek rekapitulasi
    - `most_failed_product_name`: Nama produk yang sering gagal (string)
    - `total_failed_transactions`: Jumlah total transaksi gagal (integer)
    - `total_failed_nominal`: Total nominal transaksi gagal (decimal)
    - `total_products`: Total jenis produk yang gagal (integer)
  - `transactions`: Array transaksi gagal
    - `no`: Nomor urut (integer)
    - `date`: Tanggal transaksi (string, format `YYYY-MM-DD`)
    - `product_name`: Nama produk (string)
    - `supplier_name`: Nama supplier (string)
    - `product_code`: Kode produk (string)
    - `price`: Harga (decimal)
    - `quantity`: Jumlah transaksi (integer)
  - `pagination`: Objek informasi pagination
    - `total_data`: Total seluruh data (integer)
    - `total_pages`: Total halaman (integer)
    - `current_page`: Halaman saat ini (integer)
    - `limit`: Batas data per halaman (integer)
- **Example Response (JSON):**
  ```json
  {
    "code": 200,
    "status": "success",
    "message": "Data transaksi gagal berhasil diambil",
    "data": {
      "recap": {
        "most_failed_product_name": "Pulsa Indosat 5rb",
        "total_failed_transactions": 150,
        "total_failed_nominal": 750000.0,
        "total_products": 25
      },
      "transactions": [
        {
          "no": 1,
          "date": "2025-06-22",
          "product_name": "Pulsa Indosat 5rb",
          "supplier_name": "Supplier A",
          "product_code": "IND5K",
          "price": 5200.0,
          "quantity": 10
        },
        {
          "no": 2,
          "date": "2025-06-22",
          "product_name": "Paket Data XL 1GB",
          "supplier_name": "Supplier B",
          "product_code": "XL1GB",
          "price": 11000.0,
          "quantity": 5
        }
      ],
      "pagination": {
        "total_data": 150,
        "total_pages": 15,
        "current_page": 1,
        "limit": 10
      }
    }
  }
  ```

---

## 2. Transaksi Pending

- **Endpoint:** `/api/v1/transactions/pending`
- **Method:** `GET`
- **Parameter Request:**
  - `start_date`: Tanggal mulai filter (opsional, format `YYYY-MM-DD`)
  - `end_date`: Tanggal akhir filter (opsional, format `YYYY-MM-DD`)
  - `search`: Kata kunci pencarian nama produk, supplier, atau kode produk (opsional)
  - `limit`: Jumlah data per halaman (opsional, default 10)
  - `page`: Nomor halaman (opsional, default 1)
- **Parameter Response:**
  - `recap`: Objek rekapitulasi
    - `most_pending_product_name`: Nama produk yang sering pending (string)
    - `total_pending_transactions`: Jumlah total transaksi pending (integer)
    - `total_pending_nominal`: Total nominal transaksi pending (decimal)
    - `total_products`: Total jenis produk yang pending (integer)
  - `transactions`: Array transaksi pending
    - `no`: Nomor urut (integer)
    - `date`: Tanggal transaksi (string, format `YYYY-MM-DD`)
    - `product_name`: Nama produk (string)
    - `supplier_name`: Nama supplier (string)
    - `product_code`: Kode produk (string)
    - `price`: Harga (decimal)
    - `quantity`: Jumlah transaksi (integer)
  - `pagination`: Objek informasi pagination
    - `total_data`: Total seluruh data (integer)
    - `total_pages`: Total halaman (integer)
    - `current_page`: Halaman saat ini (integer)
    - `limit`: Batas data per halaman (integer)
- **Example Response (JSON):**
  ```json
  {
    "code": 200,
    "status": "success",
    "message": "Data transaksi pending berhasil diambil",
    "data": {
      "recap": {
        "most_pending_product_name": "Token PLN 50rb",
        "total_pending_transactions": 80,
        "total_pending_nominal": 4000000.0,
        "total_products": 15
      },
      "transactions": [
        {
          "no": 1,
          "date": "2025-06-22",
          "product_name": "Token PLN 50rb",
          "supplier_name": "Supplier C",
          "product_code": "PLN50K",
          "price": 50500.0,
          "quantity": 5
        },
        {
          "no": 2,
          "date": "2025-06-22",
          "product_name": "Pembayaran BPJS",
          "supplier_name": "Supplier D",
          "product_code": "BPJS001",
          "price": 25000.0,
          "quantity": 2
        }
      ],
      "pagination": {
        "total_data": 80,
        "total_pages": 8,
        "current_page": 1,
        "limit": 10
      }
    }
  }
  ```

---

## 3. Transaksi Sukses

- **Endpoint:** `/api/v1/transactions/success`
- **Method:** `GET`
- **Parameter Request:**
  - `start_date`: Tanggal mulai filter (opsional, format `YYYY-MM-DD`)
  - `end_date`: Tanggal akhir filter (opsional, format `YYYY-MM-DD`)
  - `search`: Kata kunci pencarian nama produk, supplier, atau kode produk (opsional)
  - `limit`: Jumlah data per halaman (opsional, default 10)
  - `page`: Nomor halaman (opsional, default 1)
- **Parameter Response:**
  - `recap`: Objek rekapitulasi
    - `most_successful_product_name`: Nama produk yang sering sukses (string)
    - `total_successful_transactions`: Jumlah total transaksi sukses (integer)
    - `total_successful_nominal`: Total nominal transaksi sukses (decimal)
    - `total_products`: Total jenis produk yang sukses (integer)
  - `transactions`: Array transaksi sukses
    - `no`: Nomor urut (integer)
    - `date`: Tanggal transaksi (string, format `YYYY-MM-DD`)
    - `product_name`: Nama produk (string)
    - `supplier_name`: Nama supplier (string)
    - `product_code`: Kode produk (string)
    - `price`: Harga (decimal)
    - `quantity`: Jumlah transaksi (integer)
  - `pagination`: Objek informasi pagination
    - `total_data`: Total seluruh data (integer)
    - `total_pages`: Total halaman (integer)
    - `current_page`: Halaman saat ini (integer)
    - `limit`: Batas data per halaman (integer)
- **Example Response (JSON):**
  ```json
  {
    "code": 200,
    "status": "success",
    "message": "Data transaksi sukses berhasil diambil",
    "data": {
      "recap": {
        "most_successful_product_name": "Pulsa Telkomsel 10rb",
        "total_successful_transactions": 5000,
        "total_successful_nominal": 50000000.0,
        "total_products": 100
      },
      "transactions": [
        {
          "no": 1,
          "date": "2025-06-22",
          "product_name": "Pulsa Telkomsel 10rb",
          "supplier_name": "Supplier E",
          "product_code": "TSEL10K",
          "price": 10500.0,
          "quantity": 50
        },
        {
          "no": 2,
          "date": "2025-06-22",
          "product_name": "Game Voucher Mobile Legends 50Diamonds",
          "supplier_name": "Supplier F",
          "product_code": "ML50D",
          "price": 15000.0,
          "quantity": 10
        }
      ],
      "pagination": {
        "total_data": 5000,
        "total_pages": 500,
        "current_page": 1,
        "limit": 10
      }
    }
  }
  ```

---

## 4. Komplain Transaksi

- **Endpoint:** `/api/v1/transactions/complaints`
- **Method:** `GET`
- **Parameter Request:**
  - `start_date`: Tanggal mulai filter (opsional, format `YYYY-MM-DD`)
  - `end_date`: Tanggal akhir filter (opsional, format `YYYY-MM-DD`)
  - `search`: Kata kunci pencarian nama produk, supplier, atau kode produk (opsional)
  - `limit`: Jumlah data per halaman (opsional, default 10)
  - `page`: Nomor halaman (opsional, default 1)
- **Parameter Response:**
  - `recap`: Objek rekapitulasi
    - `total_complaint_transactions`: Total komplain transaksi (integer)
    - `total_complaint_nominal`: Total nominal komplain (decimal)
  - `transactions`: Array komplain transaksi
    - `no`: Nomor urut (integer)
    - `date`: Tanggal transaksi (string, format `YYYY-MM-DD`)
    - `product_name`: Nama produk (string)
    - `supplier_name`: Nama supplier (string)
    - `product_code`: Kode produk (string)
    - `price`: Harga (decimal)
    - `quantity`: Jumlah transaksi (integer)
  - `pagination`: Objek informasi pagination
    - `total_data`: Total seluruh data (integer)
    - `total_pages`: Total halaman (integer)
    - `current_page`: Halaman saat ini (integer)
    - `limit`: Batas data per halaman (integer)
- **Example Response (JSON):**
  ```json
  {
    "code": 200,
    "status": "success",
    "message": "Data komplain transaksi berhasil diambil",
    "data": {
      "recap": {
        "total_complaint_transactions": 20,
        "total_complaint_nominal": 150000.0
      },
      "transactions": [
        {
          "no": 1,
          "date": "2025-06-21",
          "product_name": "Pulsa Indosat 10rb",
          "supplier_name": "Supplier A",
          "product_code": "IND10K",
          "price": 10200.0,
          "quantity": 1
        },
        {
          "no": 2,
          "date": "2025-06-20",
          "product_name": "Paket Data Telkomsel 2GB",
          "supplier_name": "Supplier E",
          "product_code": "TSEL2GB",
          "price": 22000.0,
          "quantity": 1
        }
      ],
      "pagination": {
        "total_data": 20,
        "total_pages": 2,
        "current_page": 1,
        "limit": 10
      }
    }
  }
  ```

---

## 5. Produk Terlaris

- **Endpoint:** `/api/v1/products/best-selling`
- **Method:** `GET`
- **Parameter Request:**
  - `search`: Kata kunci pencarian nama produk (opsional)
  - `category`: Filter kategori produk (opsional, default: semua)
- **Parameter Response:**
  - `products`: Array produk terlaris (maksimal 10 data teratas)
    - `rank`: Peringkat produk (integer)
    - `id`: ID produk (integer)
    - `icon_diamond`: URL ikon diamond (string, hanya untuk 3 teratas, sisanya string kosong)
    - `icon_product`: URL ikon produk (string)
    - `product_name`: Nama produk (string)
    - `category`: Kategori produk (string)
    - `sales`: Jumlah penjualan (integer)
    - `revenue`: Total revenue (integer)
    - `growth`: Pertumbuhan penjualan (float, positif/negatif, contoh: 0.3 untuk +30%, -0.3 untuk -30%)
- **Example Response (JSON):**

```json
{
  "code": 200,
  "status": "success",
  "message": "Data produk terlaris berhasil diambil",
  "data": {
    "products": [
      {
        "rank": 1,
        "id": 1,
        "icon_diamond": "/icon/card product/diamond/red.svg",
        "icon_product": "/icon/card/icon/atm-card.png",
        "product_name": "Topup E-toll",
        "category": "E-Toll",
        "sales": 15000,
        "revenue": 12000000,
        "growth": 0.3
      },
      {
        "rank": 2,
        "id": 2,
        "icon_diamond": "/icon/card product/diamond/green.svg",
        "icon_product": "/icon/card/icon/atm-card.png",
        "product_name": "Topup E-toll",
        "category": "E-Toll",
        "sales": 15000,
        "revenue": 12000000,
        "growth": 0.3
      },
      {
        "rank": 3,
        "id": 3,
        "icon_diamond": "/icon/card product/diamond/blue.svg",
        "icon_product": "/icon/card/icon/atm-card.png",
        "product_name": "Topup E-toll",
        "category": "E-Toll",
        "sales": 15000,
        "revenue": 12000000,
        "growth": 0.3
      },
      {
        "rank": 4,
        "id": 4,
        "icon_diamond": "",
        "icon_product": "/icon/card/icon/atm-card.png",
        "product_name": "Topup E-toll",
        "category": "E-Toll",
        "sales": 15000,
        "revenue": 12000000,
        "growth": -0.3
      }
    ]
  }
}
```

---

## 6. Supplier

- **Endpoint:** `/api/v1/suppliers`
- **Method:** `GET`
- **Parameter Request:**
  - `search`: Kata kunci pencarian nama atau kode supplier (opsional)
  - `limit`: Jumlah data per halaman (opsional, default 10)
  - `page`: Nomor halaman (opsional, default 1)
- **Parameter Response:**
  - `suppliers`: Array data supplier
    - `no`: Nomor urut (integer)
    - `supplier_name`: Nama Supplier (string)
    - `supplier_code`: Kode Supplier (string)
    - `supplier_status`: Status Supplier (string, misal: "Aktif", "Tidak Aktif")
    - `server_status`: Status Server (string, misal: "Online", "Offline")
  - `pagination`: Objek informasi pagination
    - `total_data`: Total seluruh data (integer)
    - `total_pages`: Total halaman (integer)
    - `current_page`: Halaman saat ini (integer)
    - `limit`: Batas data per halaman (integer)
- **Example Response (JSON):**
  ```json
  {
    "code": 200,
    "status": "success",
    "message": "Data supplier berhasil diambil",
    "data": {
      "suppliers": [
        {
          "no": 1,
          "supplier_name": "Telkomsel API",
          "supplier_code": "TSL001",
          "supplier_status": "Aktif",
          "server_status": "Online"
        },
        {
          "no": 2,
          "supplier_name": "Indosat Ooredoo API",
          "supplier_code": "IDS002",
          "supplier_status": "Aktif",
          "server_status": "Online"
        }
      ],
      "pagination": {
        "total_data": 50,
        "total_pages": 5,
        "current_page": 1,
        "limit": 10
      }
    }
  }
  ```

---

## 7. Monitor Transaksi (Grafik Area)

- **Endpoint:** `/api/v1/monitor/transactions/chart`
- **Method:** `GET`
- **Parameter Request:**
  - `period`: Filter periode (opsional, default 'monthly'). Pilihan: `daily`, `weekly`, `monthly`, `yearly`.
  - `product_id`: ID produk untuk filter (opsional, default produk pertama/Telkomsel?)
- **Parameter Response:**
  - `chart_data`: Array data grafik
    - `label`: Label waktu (misal: "Jan 2025", "22 Jun 2025")
    - `value`: Nominal Total Penjualan (decimal)
- **Example Response (JSON - Monthly Period):**
  ```json
  {
    "code": 200,
    "status": "success",
    "message": "Data monitor transaksi berhasil diambil",
    "data": {
      "chart_data": [
        {
          "label": "Jan 2025",
          "value": 15000000.0
        },
        {
          "label": "Feb 2025",
          "value": 18000000.0
        },
        {
          "label": "Mar 2025",
          "value": 17500000.0
        },
        {
          "label": "Apr 2025",
          "value": 20000000.0
        },
        {
          "label": "Mei 2025",
          "value": 22000000.0
        },
        {
          "label": "Jun 2025",
          "value": 19500000.0
        }
      ]
    }
  }
  ```
