import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(isSameOrAfter);

function readDbData() {
  try {
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbContent = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(dbContent);
  } catch (error) {
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
      most_pending_product_name: "-",
      total_pending_transactions: 0,
      total_pending_nominal: 0,
      total_products: 0
    };
  }
  const totalNominal = data.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const productCount = {};
  data.forEach(item => {
    productCount[item.product_name] = (productCount[item.product_name] || 0) + item.quantity;
  });
  const mostPendingProduct = Object.keys(productCount).reduce((a, b) => productCount[a] > productCount[b] ? a : b);
  const uniqueProducts = new Set(data.map(item => item.product_name)).size;
  return {
    most_pending_product_name: mostPendingProduct,
    total_pending_transactions: data.reduce((sum, item) => sum + item.quantity, 0),
    total_pending_nominal: totalNominal,
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

// Helper function for chart data points generation
function generateChartDataPoints(startPoint, count, intervalHours, labelFormat) {
  return Array.from({ length: count }, (_, index) => {
    const blockStart = startPoint.add(index * intervalHours, 'hour');
    const blockEnd = blockStart.add(intervalHours, 'hour');
    return {
      date: blockStart.format(),
      label: labelFormat(blockStart, blockEnd),
      value: 0
    };
  });
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const periode = searchParams.get('periode') || '4hours';

    const dbData = readDbData();
    if (!dbData) {
      const errorResponse = NextResponse.json({ code: 500, status: "error", message: "Gagal membaca data database" }, { status: 500 });
      return addCorsHeaders(errorResponse);
    }
    
    let transactions = dbData.transactions_pending || [];
    
    // Filter transactions based on date parameters or periode
    if (startDate && endDate) {
      // If both dates are provided, filter by date range
      transactions = filterByDate(transactions, startDate, endDate);
    } else {
      // If no dates provided, filter by periode for transaction data
      const now = dayjs();
      let filterStartDate, filterEndDate;
      
      switch (periode) {
        case '4hours':
          filterStartDate = now.startOf('day').toISOString();
          filterEndDate = now.endOf('day').toISOString();
          break;
        case 'daily':
          filterStartDate = now.startOf('month').toISOString();
          filterEndDate = now.endOf('month').toISOString();
          break;
        case '3days':
          filterStartDate = now.startOf('month').toISOString();
          filterEndDate = now.endOf('month').toISOString();
          break;
        case 'weekly':
          filterStartDate = now.subtract(3, 'month').startOf('month').toISOString();
          filterEndDate = now.endOf('month').toISOString();
          break;
        case 'monthly':
          filterStartDate = now.startOf('year').toISOString();
          filterEndDate = now.endOf('year').toISOString();
          break;
        default:
          filterStartDate = now.startOf('day').toISOString();
          filterEndDate = now.endOf('day').toISOString();
      }
      
      transactions = filterByDate(transactions, filterStartDate, filterEndDate);
    }
    
    transactions = searchData(transactions, search);
    const recap = calculateRecap(transactions);
    const { data: paginatedTransactions, pagination } = paginateData(transactions, page, limit);
    const transactionsWithNo = paginatedTransactions.map((item, index) => ({
      no: (page - 1) * limit + index + 1,
      ...item
    }));

    // Generate chart data points
    const now = dayjs();
    let startPoint;
    let chart_data = [];
    let intervalHours;
    let chartStartDate, chartEndDate;

    // Jika ada parameter tanggal, gunakan range tanggal tersebut untuk chart
    if (startDate && endDate) {
      chartStartDate = dayjs(startDate);
      chartEndDate = dayjs(endDate);
      const daysDiff = chartEndDate.diff(chartStartDate, 'day');
      
      if (periode==='4hours') {
        // Jika range 1 hari atau kurang, gunakan interval per jam
        intervalHours = 1;
        const hours = Math.max(24, chartEndDate.diff(chartStartDate, 'hour') + 1);
        chart_data = generateChartDataPoints(
          chartStartDate.startOf('hour'),
          hours,
          intervalHours,
          (start, end) => `${start.format('DD MMM YYYY HH:mm')}-${end.format('HH:mm')}`
        );
      } else if (periode==='daily') {
        // Jika range 1 minggu atau kurang, gunakan interval per hari
        intervalHours = 24;
        const days = daysDiff + 1;
        chart_data = generateChartDataPoints(
          chartStartDate.startOf('day'),
          days,
          intervalHours,
          (start, end) => start.format('DD MMM YYYY')
        );
      } else if (periode==='3days') {
        // Jika range 1 bulan atau kurang, gunakan interval 4 jam
        intervalHours = 24 * 3;
        const weeks = Math.ceil(daysDiff / 3);
        chart_data = generateChartDataPoints(
          chartStartDate.startOf('day'),
          weeks,
          intervalHours,
          (start, end) => `${start.format('DD')}–${start.add(2, 'day').format('DD MMM YYYY')}`
        );
      } else if (periode==='weekly') {
        // Jika range 3 bulan atau kurang, gunakan interval per minggu
        intervalHours = 24 * 7;
        const weeks = Math.ceil(daysDiff / 7);
        chart_data = generateChartDataPoints(
          chartStartDate.startOf('day'),
          weeks,
          intervalHours,
          (start, end) => `${start.format('DD')}–${start.add(6, 'day').format('DD MMM YYYY')}`
        );
      } else {
        // Jika range lebih dari 3 bulan, gunakan interval per bulan
        intervalHours = 24 * 30;
        const months = chartEndDate.diff(chartStartDate, 'month') + 1;
        chart_data = generateChartDataPoints(
          chartStartDate.startOf('month'),
          months,
          intervalHours,
          (start, end) => start.format('MMM YYYY')
        );
      }
    } else {
      // Use periode-based chart data generation
      switch (periode) {
        case '4hours':
          startPoint = now.startOf('day');
          intervalHours = 4;
          const blocks24Hours = 6; // 24 hours / 4 hours interval
          chart_data = generateChartDataPoints(
            startPoint, 
            blocks24Hours, 
            intervalHours,
            (start, end) => `${start.format('DD MMM YYYY HH:mm')}-${end.format('HH:mm')}`
          );
          break;
        case 'daily':
          // Start from beginning of current month
          startPoint = now.startOf('month');
          intervalHours = 24;
          const daysInMonth = now.daysInMonth();
          chart_data = generateChartDataPoints(
            startPoint, 
            daysInMonth,
            intervalHours,
            (start, end) => start.format('DD MMM YYYY')
          );
          break;
        case '3days':
          // Start from beginning of current month
          startPoint = now.startOf('month');
          intervalHours = 24 * 3;
          const threeDayBlocksInMonth = Math.ceil(now.daysInMonth() / 3);
          chart_data = generateChartDataPoints(
            startPoint,
            threeDayBlocksInMonth,
            intervalHours,
            (start, end) => `${start.format('DD')}–${start.add(2, 'day').format('DD MMM YYYY')}`
          );
          break;
        case 'weekly':
          // Start from 3 months ago
          startPoint = now.subtract(3, 'month').startOf('month');
          intervalHours = 24 * 7;
          const weeksInThreeMonths = 12; // ~4 weeks per month * 3 months
          chart_data = generateChartDataPoints(
            startPoint,
            weeksInThreeMonths,
            intervalHours,
            (start, end) => `${start.format('DD')}–${start.add(6, 'day').format('DD MMM YYYY')}`
          );
          break;
        case 'monthly':
          // Start from beginning of current year
          startPoint = now.startOf('year');
          intervalHours = 24 * 30;
          chart_data = generateChartDataPoints(
            startPoint,
            12,
            intervalHours,
            (start, end) => start.format('MMM YYYY')
          );
          break;
      }
    }

    // Kelompokkan dan jumlahkan data berdasarkan interval
    const dbChartData = dbData.transactions_pending_chart || [];
    dbChartData.forEach(dbItem => {
      const dbDate = dayjs(dbItem.date);
      const matchingPoint = chart_data.find(point => {
        const pointDate = dayjs(point.date);
        const nextPointDate = periode === 'monthly' 
          ? pointDate.add(1, 'month')
          : pointDate.add(intervalHours, 'hour');
        
        return dbDate.isSameOrAfter(pointDate) && dbDate.isBefore(nextPointDate);
      });
      
      if (matchingPoint) {
        matchingPoint.value += dbItem.value;
      }
    });

    const response = NextResponse.json({
      code: 200,
      status: "success",
      message: "Data transaksi pending berhasil diambil",
      data: {
        recap,
        transactions: transactionsWithNo,
        pagination,
        most_pending_products_daily: dbData.most_pending_products_daily || [],
        top_pending_partners_daily: dbData.top_pending_partners_daily || [],
        total_pending_transactions_daily: dbData.total_pending_transactions_daily || [],
        chart_data
      }
    });
    return addCorsHeaders(response);
  } catch (error) {
    const errorResponse = NextResponse.json({ code: 500, status: "error", message: "Terjadi kesalahan server" }, { status: 500 });
    return addCorsHeaders(errorResponse);
  }
}

export async function OPTIONS(request) {
  const response = new NextResponse(null, { status: 200 });
  return addCorsHeaders(response);
}