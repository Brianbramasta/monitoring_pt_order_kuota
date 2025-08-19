import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import dayjs from 'dayjs';

// Fungsi untuk membaca data dari db.json
function readDbData() {
  try {
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbContent = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(dbContent);
  } catch (error) {
    console.error('Error reading db.json:', error);
    return null;
  }
}

// Fungsi untuk filter data berdasarkan tanggal
function filterByDate(data, startDate, endDate) {
  if (!startDate && !endDate) return data;
  
  return data.filter(item => {
    const itemDate = new Date(item.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    
    if (start && end) {
      return itemDate >= start && itemDate <= end;
    } else if (start) {
      return itemDate >= start;
    } else if (end) {
      return itemDate <= end;
    }
    return true;
  });
}

// Fungsi untuk search data
function searchData(data, searchTerm) {
  if (!searchTerm) return data;
  
  const term = searchTerm.toLowerCase();
  return data.filter(item => 
    item.product_name?.toLowerCase().includes(term) ||
    item.supplier_name?.toLowerCase().includes(term) ||
    item.product_code?.toLowerCase().includes(term)
  );
}

// Fungsi untuk pagination
function paginateData(data, page = 1, limit = 10) {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = data.slice(startIndex, endIndex);
  
  return {
    data: paginatedData,
    pagination: {
      total_data: data.length,
      total_pages: Math.ceil(data.length / limit),
      current_page: parseInt(page),
      limit: parseInt(limit)
    }
  };
}

// Fungsi untuk menghitung rekapitulasi
function calculateRecap(data) {
  if (data.length === 0) {
    return {
      most_failed_product_name: "-",
      total_failed_transactions: 0,
      total_failed_nominal: 0,
      total_products: 0
    };
  }

  // Hitung total nominal
  const totalNominal = data.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Hitung produk yang paling sering gagal
  const productCount = {};
  data.forEach(item => {
    productCount[item.product_name] = (productCount[item.product_name] || 0) + item.quantity;
  });
  
  const mostFailedProduct = Object.keys(productCount).reduce((a, b) => 
    productCount[a] > productCount[b] ? a : b
  );
  
  // Hitung total jenis produk unik
  const uniqueProducts = new Set(data.map(item => item.product_name)).size;

  return {
    most_failed_product_name: mostFailedProduct,
    total_failed_transactions: data.reduce((sum, item) => sum + item.quantity, 0),
    total_failed_nominal: totalNominal,
    total_products: uniqueProducts
  };
}

// Fungsi untuk menambahkan header CORS
function addCorsHeaders(response) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // Ambil parameter dari query string
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;

    // Baca data dari db.json
    const dbData = readDbData();
    if (!dbData) {
      const errorResponse = NextResponse.json({
        code: 500,
        status: "error",
        message: "Gagal membaca data database"
      }, { status: 500 });
      return addCorsHeaders(errorResponse);
    }

    let transactions = dbData.transactions_failed || [];

    // Filter berdasarkan tanggal
     //comment Brian - tampilkan semua data dulu
    // transactions = filterByDate(transactions, startDate, endDate);

    // Filter berdasarkan search
    transactions = searchData(transactions, search);

    // Hitung rekapitulasi
    const recap = calculateRecap(transactions);

    // Pagination
    const { data: paginatedTransactions, pagination } = paginateData(transactions, page, limit);

    // Tambahkan nomor urut
    const transactionsWithNo = paginatedTransactions.map((item, index) => ({
      no: (page - 1) * limit + index + 1,
      ...item
    }));

    // Generate 15 data points berdasarkan periode
    const periode = searchParams.get('periode') || '4hours';
    const now = dayjs();
    let startPoint;
    let interval;
    let dateFormat;
    
    switch (periode) {
      case '4hours':
        startPoint = now.subtract(4, 'hour');
        interval = 16; // 4 jam / 15 = 16 menit
        dateFormat = 'minute';
        break;
      case 'daily':
        startPoint = now.subtract(24, 'hour');
        interval = 96; // 24 jam / 15 = 96 menit
        dateFormat = 'minute';
        break;
      case '3days':
        startPoint = now.subtract(3, 'day');
        interval = 288; // (3 * 24 * 60) / 15 = 288 menit
        dateFormat = 'minute';
        break;
      case 'weekly':
        startPoint = now.subtract(7, 'day');
        interval = 672; // (7 * 24 * 60) / 15 = 672 menit
        dateFormat = 'minute';
        break;
      case 'monthly':
        startPoint = now.subtract(14, 'month'); // mulai dari 14 bulan yang lalu
        interval = 1; // interval 1 bulan
        dateFormat = 'month';
        break;
    }

    // Generate 15 empty data points
    let chart_data = Array.from({ length: 15 }, (_, index) => {
      const pointDate = periode === 'monthly' 
        ? startPoint.add(index, 'month')
        : startPoint.add(interval * index, 'minute');
      let label;
      
      switch (periode) {
        case '4hours':
          label = pointDate.format('DD MMM YYYY HH:mm');
          break;
        case 'daily':
          label = pointDate.format('DD MMM YYYY');
          break;
        case '3days':
          label = `${pointDate.format('DD')}–${pointDate.add(2, 'day').format('DD MMM YYYY')}`;
          break;
        case 'weekly':
          label = `${pointDate.format('DD')}–${pointDate.add(6, 'day').format('DD MMM YYYY')}`;
          break;
        case 'monthly':
          label = pointDate.format('MMM YYYY');
          break;
      }
      
      return {
        date: pointDate.format(),
        label: label,
        value: 0
      };
    });

    // Merge dengan data aktual dari database
    const dbChartData = dbData.transactions_failed_chart || [];
    dbChartData.forEach(dbItem => {
      const dbDate = dayjs(dbItem.date);
      const matchingPoint = chart_data.find(point => {
        const pointDate = dayjs(point.date);
        return dbDate.isAfter(pointDate) && dbDate.isBefore(pointDate.add(interval, 'minute'));
      });
      if (matchingPoint) {
        matchingPoint.value = dbItem.value;
      }
    });

    const response = NextResponse.json({
      code: 200,
      status: "success",
      message: "Data transaksi gagal berhasil diambil",
      data: {
        recap,
        transactions: transactionsWithNo,
        pagination,
        most_failed_products_daily: dbData.most_failed_products_daily || [],
        top_failed_partners_daily: dbData.top_failed_partners_daily || [],
        total_failed_transactions_daily: dbData.total_failed_transactions_daily || [],
        chart_data
      }
    });

    return addCorsHeaders(response);

  } catch (error) {
    console.error('Error in failed transactions API:', error);
    const errorResponse = NextResponse.json({
      code: 500,
      status: "error",
      message: "Terjadi kesalahan server"
    }, { status: 500 });
    return addCorsHeaders(errorResponse);
  }
}

export async function OPTIONS(request) {
  const response = new NextResponse(null, { status: 200 });
  return addCorsHeaders(response);
}