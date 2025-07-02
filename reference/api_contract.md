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
    - `void`: Kode void (string, opsional, null jika tidak ada)
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
          "quantity": 10,
          "void": "PULSA001"
        },
        {
          "no": 2,
          "date": "2025-06-22",
          "product_name": "Paket Data XL 1GB",
          "supplier_name": "Supplier B",
          "product_code": "XL1GB",
          "price": 11000.0,
          "quantity": 5,
          "void": null
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

## 1a. Grafik Transaksi Gagal (Area Chart)

- **Endpoint:** `/api/v1/transactions/failed/chart`
- **Method:** `GET`
- **Parameter Request:**
  - `period`: Filter periode (opsional, default 'monthly'). Pilihan: `daily`, `weekly`, `monthly`, `yearly`.
- **Parameter Response:**
  - `chart_data`: Array data grafik
    - `label`: Label waktu (misal: "Jan 2025", "22 Jun 2025")
    - `value`: Jumlah transaksi gagal (integer)
- **Example Response (JSON - Monthly Period):**
  ```json
  {
    "code": 200,
    "status": "success",
    "message": "Data chart transaksi gagal berhasil diambil",
    "data": {
      "chart_data": [
        { "label": "Jan 2025", "value": 120 },
        { "label": "Feb 2025", "value": 90 },
        { "label": "Mar 2025", "value": 150 }
      ]
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
    - `void`: Kode void (string, opsional, null jika tidak ada)
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
          "quantity": 5,
          "void": "PLN003"
        },
        {
          "no": 2,
          "date": "2025-06-22",
          "product_name": "Pembayaran BPJS",
          "supplier_name": "Supplier D",
          "product_code": "BPJS001",
          "price": 25000.0,
          "quantity": 2,
          "void": null
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

## 2a. Grafik Transaksi Pending (Area Chart)

- **Endpoint:** `/api/v1/transactions/pending/chart`
- **Method:** `GET`
- **Parameter Request:**
  - `period`: Filter periode (opsional, default 'monthly'). Pilihan: `daily`, `weekly`, `monthly`, `yearly`.
- **Parameter Response:**
  - `chart_data`: Array data grafik
    - `label`: Label waktu (misal: "Jan 2025", "22 Jun 2025")
    - `value`: Jumlah transaksi pending (integer)
- **Example Response (JSON - Monthly Period):**
  ```json
  {
    "code": 200,
    "status": "success",
    "message": "Data chart transaksi pending berhasil diambil",
    "data": {
      "chart_data": [
        { "label": "Jan 2025", "value": 100 },
        { "label": "Feb 2025", "value": 80 },
        { "label": "Mar 2025", "value": 130 }
      ]
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
    - `void`: Kode void (string, opsional, null jika tidak ada)
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
          "quantity": 50,
          "void": "PULSA006"
        },
        {
          "no": 2,
          "date": "2025-06-22",
          "product_name": "Game Voucher Mobile Legends 50Diamonds",
          "supplier_name": "Supplier F",
          "product_code": "ML50D",
          "price": 15000.0,
          "quantity": 10,
          "void": null
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

## 3a. Grafik Transaksi Sukses (Area Chart)

- **Endpoint:** `/api/v1/transactions/success/chart`
- **Method:** `GET`
- **Parameter Request:**
  - `period`: Filter periode (opsional, default 'monthly'). Pilihan: `daily`, `weekly`, `monthly`, `yearly`.
- **Parameter Response:**
  - `chart_data`: Array data grafik
    - `label`: Label waktu (misal: "Jan 2025", "22 Jun 2025")
    - `value`: Jumlah transaksi sukses (integer)
- **Example Response (JSON - Monthly Period):**
  ```json
  {
    "code": 200,
    "status": "success",
    "message": "Data chart transaksi sukses berhasil diambil",
    "data": {
      "chart_data": [
        { "label": "Jan 2025", "value": 200 },
        { "label": "Feb 2025", "value": 150 },
        { "label": "Mar 2025", "value": 250 }
      ]
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
    - `total_unread_cs_messages`: Total pesan CS yang belum terbaca (integer)
  - `transactions`: Array komplain transaksi
    - `no`: Nomor urut (integer)
    - `date`: Tanggal transaksi (string, format `YYYY-MM-DD`)
    - `product_name`: Nama produk (string)
    - `supplier_name`: Nama supplier (string)
    - `product_code`: Kode produk (string)
    - `price`: Harga (decimal)
    - `quantity`: Jumlah transaksi (integer)
    - `void`: Kode void (string, opsional, null jika tidak ada)
    - `is_read`: Status pesan CS (boolean, true = sudah dibaca, false = belum dibaca)
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
        "total_complaint_nominal": 150000.0,
        "total_unread_cs_messages": 7
      },
      "transactions": [
        {
          "no": 1,
          "date": "2025-06-21",
          "product_name": "Pulsa Indosat 10rb",
          "supplier_name": "Supplier A",
          "product_code": "IND10K",
          "price": 10200.0,
          "quantity": 1,
          "void": "PULSA004",
          "is_read": false
        },
        {
          "no": 2,
          "date": "2025-06-20",
          "product_name": "Paket Data Telkomsel 2GB",
          "supplier_name": "Supplier E",
          "product_code": "TSEL2GB",
          "price": 22000.0,
          "quantity": 1,
          "void": "DATA005",
          "is_read": true
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

## 4a. Grafik Komplain Transaksi (Area Chart)

- **Endpoint:** `/api/v1/transactions/complaints/chart`
- **Method:** `GET`
- **Parameter Request:**
  - `period`: Filter periode (opsional, default 'monthly'). Pilihan: `daily`, `weekly`, `monthly`, `yearly`.
- **Parameter Response:**
  - `chart_data`: Array data grafik
    - `label`: Label waktu (misal: "Jan 2025", "22 Jun 2025")
    - `value`: Jumlah komplain transaksi (integer)
- **Example Response (JSON - Monthly Period):**
  ```json
  {
    "code": 200,
    "status": "success",
    "message": "Data chart komplain transaksi berhasil diambil",
    "data": {
      "chart_data": [
        { "label": "Jan 2025", "value": 50 },
        { "label": "Feb 2025", "value": 40 },
        { "label": "Mar 2025", "value": 60 }
      ]
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

## 6. Supplier (Update)

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
    - `supplier_balance`: Saldo Supplier (integer)
    - `server_status`: Status Server (string, misal: "Stabil", "Down")
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
          "supplier_name": "PT ABC Jaya",
          "supplier_code": "TRX001",
          "supplier_balance": 1200000,
          "server_status": "Stabil"
        },
        {
          "no": 2,
          "supplier_name": "PT Maju Bersama",
          "supplier_code": "TRX002",
          "supplier_balance": 14000000,
          "server_status": "Down"
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

## 6a. Detail Supplier (Baru)

- **Endpoint:** `/api/v1/suppliers/:supplier_code/detail`
- **Method:** `GET`
- **Parameter Request:**
  - `period`: Filter periode (opsional, default 'monthly') untuk grafik revenue & penjualan produk
- **Parameter Response:**
  - `product_transaction_analysis`: Objek analisis transaksi produk (pie/donut chart)
    - `success`: Jumlah transaksi sukses (integer)
    - `pending`: Jumlah transaksi pending (integer)
    - `failed`: Jumlah transaksi gagal (integer)
  - `total_revenue`: Array data revenue per bulan (bar chart)
    - `label`: Nama bulan/tahun (string)
    - `value`: Nominal revenue (integer)
  - `best_selling_products`: Array produk terlaris (max 5, horizontal bar)
    - `product_name`: Nama produk (string)
    - `sales`: Jumlah penjualan (integer)
  - `product_sales`: Array penjualan produk per bulan (line chart)
    - `label`: Nama bulan/tahun (string)
    - `value`: Jumlah penjualan (integer)
- **Example Response (JSON):**
  ```json
  {
    "code": 200,
    "status": "success",
    "message": "Detail supplier berhasil diambil",
    "data": {
      "product_transaction_analysis": {
        "success": 120,
        "pending": 30,
        "failed": 10
      },
      "total_revenue": [
        { "label": "Jan", "value": 10000000 },
        { "label": "Feb", "value": 12000000 }
      ],
      "best_selling_products": [
        { "product_name": "Pulsa Telkomsel 5rb", "sales": 23400 },
        { "product_name": "Pulsa Indosat 5rb", "sales": 15000 }
      ],
      "product_sales": [
        { "label": "Jan", "value": 5000 },
        { "label": "Feb", "value": 6000 }
      ]
    }
  }
  ```

---

## 6b. Perbandingan Supplier (Baru)

- **Endpoint:** `/api/v1/suppliers/compare`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "supplier_codes": ["TRX001", "TRX003", "TRX004"]
  }
  ```
- **Parameter Response:**
  - Array data supplier (maksimal 3), masing-masing berisi struktur sama seperti detail supplier:
    - `supplier_code`: Kode Supplier (string)
    - `supplier_name`: Nama Supplier (string)
    - `product_transaction_analysis`: Objek analisis transaksi produk
    - `total_revenue`: Array data revenue per bulan
    - `best_selling_products`: Array produk terlaris
    - `product_sales`: Array penjualan produk per bulan
- **Example Response (JSON):**
  ```json
  {
    "code": 200,
    "status": "success",
    "message": "Data perbandingan supplier berhasil diambil",
    "data": [
      {
        "supplier_code": "TRX001",
        "supplier_name": "PT ABC Jaya",
        "product_transaction_analysis": {
          "success": 120,
          "pending": 30,
          "failed": 10
        },
        "total_revenue": [
          { "label": "Jan", "value": 10000000 },
          { "label": "Feb", "value": 12000000 }
        ],
        "best_selling_products": [
          { "product_name": "Pulsa Telkomsel 5rb", "sales": 23400 }
        ],
        "product_sales": [{ "label": "Jan", "value": 5000 }]
      }
      // ... maksimal 3 supplier
    ]
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
