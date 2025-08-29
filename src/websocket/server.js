const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');
const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore');

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

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

// Helper function untuk generate chart data points
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

// Fungsi utama untuk mengambil data failed transactions
function getFailedTransactionsData(params) {
  try {
    const {
      search,
      page = 1,
      limit = 10,
      start_date: startDate,
      end_date: endDate,
      periode = '4hours'
    } = params;

    // Baca data dari db.json
    const dbData = readDbData();
    if (!dbData) {
      return {
        success: false,
        message: "Gagal membaca data database"
      };
    }

    let transactions = dbData.transactions_failed || [];

    // Filter berdasarkan tanggal
    if (startDate && endDate) {
      transactions = filterByDate(transactions, startDate, endDate);
    } else {
      // Gunakan filter periode default jika tidak ada parameter tanggal
      const now = dayjs();
      let defaultStartDate, defaultEndDate;
      
      switch (periode) {
        case '4hours':
          defaultStartDate = now.subtract(4, 'hour').format('YYYY-MM-DD HH:mm:ss');
          defaultEndDate = now.format('YYYY-MM-DD HH:mm:ss');
          break;
        case 'daily':
          defaultStartDate = now.startOf('day').format('YYYY-MM-DD HH:mm:ss');
          defaultEndDate = now.endOf('day').format('YYYY-MM-DD HH:mm:ss');
          break;
        case '3days':
          defaultStartDate = now.subtract(3, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss');
          defaultEndDate = now.endOf('day').format('YYYY-MM-DD HH:mm:ss');
          break;
        case 'weekly':
          defaultStartDate = now.subtract(7, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss');
          defaultEndDate = now.format('YYYY-MM-DD HH:mm:ss');
          break;
        case 'monthly':
          defaultStartDate = now.subtract(1, 'month').startOf('day').format('YYYY-MM-DD HH:mm:ss');
          defaultEndDate = now.format('YYYY-MM-DD HH:mm:ss');
          break;
        default:
          defaultStartDate = null;
          defaultEndDate = null;
      }
      
      if (defaultStartDate && defaultEndDate) {
        transactions = filterByDate(transactions, defaultStartDate, defaultEndDate);
      }
    }

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

    // Generate chart data (simplified version)
    const now = dayjs();
    let chart_data = [];
    let intervalHours;
    let chartStartDate, chartEndDate;
    
    if (startDate && endDate) {
      chartStartDate = dayjs(startDate);
      chartEndDate = dayjs(endDate);
      const daysDiff = chartEndDate.diff(chartStartDate, 'day');
      
      if (periode === '4hours') {
        intervalHours = 1;
        const hours = Math.max(24, chartEndDate.diff(chartStartDate, 'hour') + 1);
        chart_data = generateChartDataPoints(
          chartStartDate.startOf('hour'),
          hours,
          intervalHours,
          (start, end) => `${start.format('DD MMM YYYY HH:mm')}-${end.format('HH:mm')}`
        );
      } else if (periode === 'daily') {
        intervalHours = 24;
        const days = daysDiff + 1;
        chart_data = generateChartDataPoints(
          chartStartDate.startOf('day'),
          days,
          intervalHours,
          (start, end) => start.format('DD MMM YYYY')
        );
      }
    } else {
      switch (periode) {
        case '4hours':
          const startPoint = now.startOf('day');
          intervalHours = 4;
          const blocks24Hours = 6;
          chart_data = generateChartDataPoints(
            startPoint, 
            blocks24Hours, 
            intervalHours,
            (start, end) => `${start.format('DD MMM YYYY HH:mm')}-${end.format('HH:mm')}`
          );
          break;
        case 'daily':
          const startPointDaily = now.startOf('month');
          intervalHours = 24;
          const daysInMonth = now.daysInMonth();
          chart_data = generateChartDataPoints(
            startPointDaily, 
            daysInMonth,
            intervalHours,
            (start, end) => start.format('DD MMM YYYY')
          );
          break;
        case '3days':
          const startPoint3Days = now.subtract(3, 'day').startOf('day');
          intervalHours = 24;
          const days3 = 4; // 3 hari + hari ini
          chart_data = generateChartDataPoints(
            startPoint3Days,
            days3,
            intervalHours,
            (start, end) => start.format('DD MMM YYYY')
          );
          break;
        case 'weekly':
          const startPointWeekly = now.subtract(7, 'day').startOf('day');
          intervalHours = 24;
          const days7 = 8; // 7 hari + hari ini
          chart_data = generateChartDataPoints(
            startPointWeekly,
            days7,
            intervalHours,
            (start, end) => start.format('DD MMM YYYY')
          );
          break;
        case 'monthly':
          const startPointMonthly = now.subtract(1, 'month').startOf('day');
          intervalHours = 24;
          const daysInPeriod = now.diff(startPointMonthly, 'day') + 1;
          chart_data = generateChartDataPoints(
            startPointMonthly,
            daysInPeriod,
            intervalHours,
            (start, end) => start.format('DD MMM YYYY')
          );
          break;
      }
    }

    // Populate chart data with actual values
    let dbChartData = dbData.transactions_failed_chart || [];
    
    if (startDate && endDate) {
      dbChartData = dbChartData.filter(item => {
        const itemDate = dayjs(item.date);
        return itemDate.isSameOrAfter(chartStartDate) && itemDate.isSameOrBefore(chartEndDate);
      });
    }
    
    dbChartData.forEach(dbItem => {
      const dbDate = dayjs(dbItem.date);
      const matchingPoint = chart_data.find(point => {
        const pointDate = dayjs(point.date);
        let nextPointDate;
        
        if (startDate && endDate) {
          if (intervalHours === 24 * 30) {
            nextPointDate = pointDate.add(1, 'month');
          } else {
            nextPointDate = pointDate.add(intervalHours, 'hour');
          }
        } else {
          nextPointDate = periode === 'monthly' 
            ? pointDate.add(1, 'month')
            : pointDate.add(intervalHours, 'hour');
        }
        
        return dbDate.isSameOrAfter(pointDate) && dbDate.isBefore(nextPointDate);
      });
      
      if (matchingPoint) {
        matchingPoint.value += dbItem.value;
      }
    });

    return {
      success: true,
      data: {
        recap,
        transactions: transactionsWithNo,
        pagination,
        most_failed_products_daily: dbData.most_failed_products_daily || [],
        top_failed_partners_daily: dbData.top_failed_partners_daily || [],
        total_failed_transactions_daily: dbData.total_failed_transactions_daily || [],
        chart_data
      }
    };

  } catch (error) {
    console.error('Error in getFailedTransactionsData:', error);
    return {
      success: false,
      message: "Terjadi kesalahan server"
    };
  }
}

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Store last request parameters for auto-broadcast
  let lastParams = { periode: '4hours' };

  // Handle request untuk data failed transactions
  socket.on('get-failed-data', (params) => {
    console.log('Received get-failed-data request:', params);
    // Update last params untuk auto-broadcast
    lastParams = { ...params };
    const result = getFailedTransactionsData(params);
    socket.emit('failed-data-response', result);
  });

  // Auto-broadcast data setiap 10 detik menggunakan parameter terakhir
  const broadcastInterval = setInterval(() => {
    const result = getFailedTransactionsData(lastParams);
    socket.emit('failed-data-update', result);
  }, 10000);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    clearInterval(broadcastInterval);
  });
});

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'WebSocket server is running' });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
});

module.exports = { app, server, io };