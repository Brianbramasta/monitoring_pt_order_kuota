# QRIS Data Generation API

## Endpoint
`GET /api/v1/monitor/qris/generate`

## Description
API endpoint untuk generate otomatis data monitor QRIS transaction. API ini akan membuat data dummy untuk:
- Monitor QRIS Chart (merchant data)
- Monitor QRIS Static Chart
- Monitor QRIS Deposit Chart
- Monitor QRIS Comparison (Winpay vs Nobu)

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `count` | integer | No | 10 | Jumlah data yang akan digenerate (maksimal 100) |
| `date` | string | No | Current date | Tanggal mulai generate data (format: YYYY-MM-DD) |

## Usage Examples

### 1. Generate 10 data dengan tanggal hari ini (default)
```
GET /api/v1/monitor/qris/generate
```

### 2. Generate 5 data dengan tanggal spesifik
```
GET /api/v1/monitor/qris/generate?count=5&date=2025-01-20
```

### 3. Generate 20 data mulai dari tanggal tertentu
```
GET /api/v1/monitor/qris/generate?count=20&date=2025-01-15
```

## Response Format

### Success Response (200)
```json
{
  "code": 200,
  "status": "success",
  "message": "Berhasil generate 5 data QRIS untuk tanggal 2025-01-20",
  "data": {
    "generated_count": 5,
    "target_date": "2025-01-20",
    "merchant_data": [
      {
        "date": "2025-01-20T00:00:00+07:00",
        "label": "20 Jan 2025 00:00",
        "value": 2500000
      }
    ],
    "static_data": [
      {
        "date": "2025-01-20T00:00:00+07:00",
        "label": "20 Jan 2025 00:00",
        "value": 1500000
      }
    ],
    "deposit_data": [
      {
        "date": "2025-01-20T00:00:00+07:00",
        "label": "20 Jan 2025 00:00",
        "value": 800000
      }
    ],
    "comparison_data": {
      "transactions": {
        "winpay": 6500000,
        "nobu": 4500000
      },
      "revenue": {
        "winpay": 7800000,
        "nobu": 2400000
      }
    }
  }
}
```

### Error Responses

#### 400 - Invalid Count
```json
{
  "code": 400,
  "status": "error",
  "message": "Count maksimal adalah 100"
}
```

#### 400 - Invalid Date Format
```json
{
  "code": 400,
  "status": "error",
  "message": "Format tanggal tidak valid. Gunakan format YYYY-MM-DD"
}
```

#### 500 - Server Error
```json
{
  "code": 500,
  "status": "error",
  "message": "Terjadi kesalahan server"
}
```

## Data Generation Logic

1. **Time Interval**: Data digenerate per jam mulai dari tanggal yang ditentukan
2. **Random Values**: 
   - Merchant data: 500,000 - 5,000,000
   - Static data: 300,000 - 3,000,000
   - Deposit data: 200,000 - 2,000,000
3. **Comparison Data**: Generate random values untuk perbandingan Winpay vs Nobu
4. **Data Storage**: Data otomatis disimpan ke `db.json` dan ditambahkan ke data existing

## Notes

- Data yang digenerate akan ditambahkan ke data existing di `db.json`
- Setiap kali API dipanggil, comparison data akan di-update dengan nilai baru
- Format tanggal menggunakan ISO 8601 dengan timezone
- Label menggunakan format yang user-friendly untuk display di chart