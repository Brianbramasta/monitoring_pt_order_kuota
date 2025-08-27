import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(isSameOrAfter);

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
    const itemDate = new Date(item.purchase_date || item.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    if (start && end) return itemDate >= start && itemDate <= end;
    if (start) return itemDate >= start;
    if (end) return itemDate <= end;
    return true;
  });
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

function searchData(data, searchTerm) {
  if (!searchTerm) return data;
  const term = searchTerm.toLowerCase();
  return data.filter(item =>
    item.id?.toLowerCase().includes(term) ||
    item.user?.toLowerCase().includes(term) ||
    item.server?.toLowerCase().includes(term) ||
    item.provider?.toLowerCase().includes(term) ||
    item.nominal?.toLowerCase().includes(term) ||
    item.phone_or_pln?.toLowerCase().includes(term) ||
    item.price?.toLowerCase().includes(term) ||
    item.payment?.toLowerCase().includes(term) ||
    item.purchase_date?.toLowerCase().includes(term) ||
    item.status?.toLowerCase().includes(term)
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
    const periode = searchParams.get('periode') || '4hours';
    const productId = searchParams.get('product_id');
    
    const dbData = await readDbData();
    if (!dbData || !dbData.monitor_transactions) {
      const errorResponse = NextResponse.json({ code: 500, status: "error", message: "Gagal membaca data database" }, { status: 500 });
      return addCorsHeaders(errorResponse);
    }
    
    let transactions = dbData.monitor_transactions.transactions || [];
    
    // Apply date filtering based on provided parameters
    if (startDate && endDate) {
      // Use custom date range if provided
      transactions = filterByDate(transactions, startDate, endDate);
    } else {
      // Use periode-based filtering if no custom dates
      const now = dayjs();
      let filterStartDate, filterEndDate;
      
      switch (periode) {
        case '4hours':
          filterStartDate = now.subtract(4, 'hour').format('YYYY-MM-DD HH:mm:ss');
          filterEndDate = now.format('YYYY-MM-DD HH:mm:ss');
          break;
        case 'daily':
          filterStartDate = now.startOf('day').format('YYYY-MM-DD HH:mm:ss');
          filterEndDate = now.endOf('day').format('YYYY-MM-DD HH:mm:ss');
          break;
        case '3days':
          filterStartDate = now.subtract(3, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss');
          filterEndDate = now.endOf('day').format('YYYY-MM-DD HH:mm:ss');
          break;
        case 'weekly':
          filterStartDate = now.subtract(7, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss');
          filterEndDate = now.format('YYYY-MM-DD HH:mm:ss');
          break;
        case 'monthly':
          filterStartDate = now.subtract(1, 'month').startOf('day').format('YYYY-MM-DD HH:mm:ss');
          filterEndDate = now.format('YYYY-MM-DD HH:mm:ss');
          break;
        default:
          filterStartDate = null;
          filterEndDate = null;
      }
      
      if (filterStartDate && filterEndDate) {
        transactions = filterByDate(transactions, filterStartDate, filterEndDate);
      }
    }
    
    transactions = searchData(transactions, search);
    
    const { data: paginatedTransactions, pagination } = paginateData(transactions, page, limit);
    const transactionsWithNo = paginatedTransactions.map((item, index) => ({
      no: (page - 1) * limit + index + 1,
      ...item
    }));
    
    const recap = dbData.monitor_transactions.recap || {};
    
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
        // Jika range 1 bulan atau kurang, gunakan interval 3 hari
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

    // Kelompokkan dan jumlahkan data berdasarkan interval dan product_id filter
    let dbChartData = dbData.monitor_transactions_chart || [];
    
    // Filter chart data by product_id if provided
    if (productId) {
      dbChartData = dbChartData.filter(item => item.product_id == productId);
    }
    
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
      message: "Data monitor transaksi berhasil diambil",
      data: { 
        recap, 
        transactions: transactionsWithNo, 
        pagination,
        chart_data
      }
    });
    return addCorsHeaders(response);
  } catch (error) {
    console.error('Error in monitor transactions API:', error);
    const errorResponse = NextResponse.json({ code: 500, status: "error", message: "Terjadi kesalahan server" }, { status: 500 });
    return addCorsHeaders(errorResponse);
  }
}

export async function OPTIONS(request) {
  const response = new NextResponse(null, { status: 200 });
  return addCorsHeaders(response);
}