import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

async function readDbData() {
  try {
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbContent = await fs.readFile(dbPath, 'utf8');
    return JSON.parse(dbContent);
  } catch (error) {
    console.error('Error reading db.json:', error);
    return null;
  }
}

function filterByDate(data, startDate, endDate) {
  if (!startDate && !endDate) return data;
  return data.filter(item => {
    const itemDate = new Date(item.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    if (start && end) return itemDate >= start && itemDate <= end;
    if (start) return itemDate >= start;
    if (end) return itemDate <= end;
    return true;
  });
}

function searchData(data, searchTerm) {
  if (!searchTerm) return data;
  const term = searchTerm.toLowerCase();
  return data.filter(item =>
    item.product_name?.toLowerCase().includes(term) ||
    item.supplier_name?.toLowerCase().includes(term) ||
    item.product_code?.toLowerCase().includes(term)
  );
}

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

function calculateRecap(data) {
  if (data.length === 0) {
    return {
      total_complaint_transactions: 0,
      total_complaint_nominal: 0,
      total_unread_cs_messages: 0
    };
  }
  const totalNominal = data.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalUnreadMessages = data.filter(item => item.is_read === false).length;
  
  return {
    total_complaint_transactions: data.reduce((sum, item) => sum + item.quantity, 0),
    total_complaint_nominal: totalNominal,
    total_unread_cs_messages: totalUnreadMessages
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
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const period = searchParams.get('period'); // chart period
    
    const dbData = await readDbData();
    if (!dbData) {
      const errorResponse = NextResponse.json({ code: 500, status: "error", message: "Gagal membaca data database" }, { status: 500 });
      return addCorsHeaders(errorResponse);
    }
    
    let transactions = dbData.transactions_complaints || [];
    transactions = filterByDate(transactions, startDate, endDate);
    transactions = searchData(transactions, search);
    
    // Hitung recap langsung dari data transaksi
    const recap = calculateRecap(transactions);
    
    const { data: paginatedTransactions, pagination } = paginateData(transactions, page, limit);
    const transactionsWithNo = paginatedTransactions.map((item, index) => ({
      no: (page - 1) * limit + index + 1,
      ...item
    }));

    // Chart data filtered by same date range
    let chart_data = dbData.transactions_complaints_chart || [];
    chart_data = filterByDate(chart_data, startDate, endDate);

    const response = NextResponse.json({
      code: 200,
      status: "success",
      message: "Data komplain transaksi berhasil diambil",
      data: {
        recap,
        transactions: transactionsWithNo,
        pagination,
        most_complaint_products_daily: dbData.most_complaint_products_daily || [],
        top_complaint_partners_daily: dbData.top_complaint_partners_daily || [],
        total_complaint_transactions_daily: dbData.total_complaint_transactions_daily || [],
        chart_data
      }
    });
    return addCorsHeaders(response);
  } catch (error) {
    console.error('Error in complaints API:', error);
    const errorResponse = NextResponse.json({ code: 500, status: "error", message: "Terjadi kesalahan server" }, { status: 500 });
    return addCorsHeaders(errorResponse);
  }
}

export async function OPTIONS(request) {
  const response = new NextResponse(null, { status: 200 });
  return addCorsHeaders(response);
}