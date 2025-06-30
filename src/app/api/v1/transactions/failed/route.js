import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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
      return NextResponse.json({
        code: 500,
        status: "error",
        message: "Gagal membaca data database"
      }, { status: 500 });
    }

    let transactions = dbData.transactions_failed || [];

    // Filter berdasarkan tanggal
    transactions = filterByDate(transactions, startDate, endDate);

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

    return NextResponse.json({
      code: 200,
      status: "success",
      message: "Data transaksi gagal berhasil diambil",
      data: {
        recap,
        transactions: transactionsWithNo,
        pagination
      }
    });

  } catch (error) {
    console.error('Error in failed transactions API:', error);
    return NextResponse.json({
      code: 500,
      status: "error",
      message: "Terjadi kesalahan server"
    }, { status: 500 });
  }
} 