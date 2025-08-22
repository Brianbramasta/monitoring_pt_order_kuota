import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

function readDbData() {
  try {
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbContent = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(dbContent);
  } catch (error) {
    return null;
  }
}

function addCorsHeaders(response) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

function getDateRange(filter) {
  const today = dayjs();
  let start_date = null;
  let end_date = null;
  
  switch (filter) {
    case '4hours':
      start_date = today.subtract(4, 'hour').format('YYYY-MM-DD HH:mm:ss');
      end_date = today.format('YYYY-MM-DD HH:mm:ss');
      break;
    case 'daily':
      start_date = today.startOf('day').format('YYYY-MM-DD HH:mm:ss');
      end_date = today.endOf('day').format('YYYY-MM-DD HH:mm:ss');
      break;
    case '3days':
      start_date = today.subtract(3, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss');
      end_date = today.endOf('day').format('YYYY-MM-DD HH:mm:ss');
      break;
    case 'weekly':
      start_date = today.subtract(7, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss');
      end_date = today.format('YYYY-MM-DD HH:mm:ss');
      break;
    case 'monthly':
      start_date = today.subtract(1, 'month').startOf('day').format('YYYY-MM-DD HH:mm:ss');
      end_date = today.format('YYYY-MM-DD HH:mm:ss');
      break;
    default:
      start_date = today.format('YYYY-MM-DD HH:mm:ss');
      end_date = today.format('YYYY-MM-DD HH:mm:ss');
  }
  return { start_date, end_date };
}

// Add this helper function before the GET handler
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

function filterDataByDateRange(data, start_date, end_date) {
  return data.filter(item => {
    const itemDate = dayjs(item.label);
    return itemDate.isAfter(start_date) && itemDate.isBefore(end_date);
  });
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'monthly';
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

    const dbData = readDbData();
    if (!dbData) {
      const errorResponse = NextResponse.json(
        { code: 500, status: "error", message: "Gagal membaca data database" },
        { status: 500 }
      );
      return addCorsHeaders(errorResponse);
    }

    // Kelompokkan dan jumlahkan data berdasarkan interval
    const dbMerchantData = dbData.monitor_qris_chart || [];
    const dbStaticData = dbData.monitor_qris_static_chart || [];
    const dbDepositData = dbData.monitor_qris_deposit_chart || [];
    
    let filteredMerchantData = dbMerchantData;
    let filteredStaticData = dbStaticData;
    let filteredDepositData = dbDepositData;
    
    // Filter data based on date parameters or periode
    if (startDate && endDate) {
      // If both dates are provided, filter by date range
      const start = dayjs(startDate);
      const end = dayjs(endDate);
      
      filteredMerchantData = dbMerchantData.filter(item => {
        const itemDate = dayjs(item.date);
        return itemDate.isSameOrAfter(start) && itemDate.isSameOrBefore(end);
      });
      
      filteredStaticData = dbStaticData.filter(item => {
        const itemDate = dayjs(item.date);
        return itemDate.isSameOrAfter(start) && itemDate.isSameOrBefore(end);
      });
      
      filteredDepositData = dbDepositData.filter(item => {
        const itemDate = dayjs(item.date);
        return itemDate.isSameOrAfter(start) && itemDate.isSameOrBefore(end);
      });
    } else {
      // If no dates provided, filter by periode
      const now = dayjs();
      let filterStartDate, filterEndDate;
      
      switch (period) {
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
        const start = dayjs(filterStartDate);
        const end = dayjs(filterEndDate);
        
        filteredMerchantData = dbMerchantData.filter(item => {
          const itemDate = dayjs(item.date);
          return itemDate.isSameOrAfter(start) && itemDate.isSameOrBefore(end);
        });
        
        filteredStaticData = dbStaticData.filter(item => {
          const itemDate = dayjs(item.date);
          return itemDate.isSameOrAfter(start) && itemDate.isSameOrBefore(end);
        });
        
        filteredDepositData = dbDepositData.filter(item => {
          const itemDate = dayjs(item.date);
          return itemDate.isSameOrAfter(start) && itemDate.isSameOrBefore(end);
        });
      }
    }

    // Generate chart data points
    let merchant_chart = [];
    let static_chart = [];
    let deposit_chart = [];
    let chartStartDate, chartEndDate;
    let intervalHours = 24; // Default interval in hours
    
    // Jika ada parameter tanggal, gunakan range tanggal tersebut untuk chart
    if (startDate && endDate) {
      chartStartDate = dayjs(startDate);
      chartEndDate = dayjs(endDate);
      const daysDiff = chartEndDate.diff(chartStartDate, 'day');
      
      if (period==='4hours') {
        // Jika range 1 hari atau kurang, gunakan interval per jam
        intervalHours = 1;
        const hours = Math.max(24, chartEndDate.diff(chartStartDate, 'hour') + 1);
        merchant_chart = generateChartDataPoints(
          chartStartDate.startOf('hour'),
          hours,
          intervalHours,
          (blockStart, blockEnd) => `${blockStart.format('DD MMM YYYY HH:mm')}-${blockEnd.format('HH:mm')}`
        );
        static_chart = generateChartDataPoints(
          chartStartDate.startOf('hour'),
          hours,
          intervalHours,
          (blockStart, blockEnd) => `${blockStart.format('DD MMM YYYY HH:mm')}-${blockEnd.format('HH:mm')}`
        );
        deposit_chart = generateChartDataPoints(
          chartStartDate.startOf('hour'),
          hours,
          intervalHours,
          (blockStart, blockEnd) => `${blockStart.format('DD MMM YYYY HH:mm')}-${blockEnd.format('HH:mm')}`
        );
      } else if (period==='daily') {
        // Jika range 1 minggu atau kurang, gunakan interval per hari
        intervalHours = 24;
        const days = daysDiff + 1;
        merchant_chart = generateChartDataPoints(
          chartStartDate.startOf('day'),
          days,
          intervalHours,
          (blockStart) => blockStart.format('DD MMM YYYY')
        );
        static_chart = generateChartDataPoints(
          chartStartDate.startOf('day'),
          days,
          intervalHours,
          (blockStart) => blockStart.format('DD MMM YYYY')
        );
        deposit_chart = generateChartDataPoints(
          chartStartDate.startOf('day'),
          days,
          intervalHours,
          (blockStart) => blockStart.format('DD MMM YYYY')
        );
      } else if (period==='3days') {
        // Jika range 1 bulan atau kurang, gunakan interval 3 hari
        intervalHours = 24 * 3;
        const weeks = Math.ceil(daysDiff / 3);
        merchant_chart = generateChartDataPoints(
          chartStartDate.startOf('day'),
          weeks,
          intervalHours,
          (blockStart) => `${blockStart.format('DD')}–${blockStart.add(2, 'day').format('DD MMM YYYY')}`
        );
        static_chart = generateChartDataPoints(
          chartStartDate.startOf('day'),
          weeks,
          intervalHours,
          (blockStart) => `${blockStart.format('DD')}–${blockStart.add(2, 'day').format('DD MMM YYYY')}`
        );
        deposit_chart = generateChartDataPoints(
          chartStartDate.startOf('day'),
          weeks,
          intervalHours,
          (blockStart) => `${blockStart.format('DD')}–${blockStart.add(2, 'day').format('DD MMM YYYY')}`
        );
      } else if (period==='weekly') {
        // Jika range 3 bulan atau kurang, gunakan interval per minggu
        intervalHours = 24 * 7;
        const weeks = Math.ceil(daysDiff / 7);
        merchant_chart = generateChartDataPoints(
          chartStartDate.startOf('day'),
          weeks,
          intervalHours,
          (blockStart) => `${blockStart.format('DD')}–${blockStart.add(6, 'day').format('DD MMM YYYY')}`
        );
        static_chart = generateChartDataPoints(
          chartStartDate.startOf('day'),
          weeks,
          intervalHours,
          (blockStart) => `${blockStart.format('DD')}–${blockStart.add(6, 'day').format('DD MMM YYYY')}`
        );
        deposit_chart = generateChartDataPoints(
          chartStartDate.startOf('day'),
          weeks,
          intervalHours,
          (blockStart) => `${blockStart.format('DD')}–${blockStart.add(6, 'day').format('DD MMM YYYY')}`
        );
      } else {
        // Jika range lebih dari 3 bulan, gunakan interval per bulan
        intervalHours = 24 * 30;
        const months = chartEndDate.diff(chartStartDate, 'month') + 1;
        merchant_chart = generateChartDataPoints(
          chartStartDate.startOf('month'),
          months,
          intervalHours,
          (blockStart) => blockStart.format('MMM YYYY')
        );
        static_chart = generateChartDataPoints(
          chartStartDate.startOf('month'),
          months,
          intervalHours,
          (blockStart) => blockStart.format('MMM YYYY')
        );
        deposit_chart = generateChartDataPoints(
          chartStartDate.startOf('month'),
          months,
          intervalHours,
          (blockStart) => blockStart.format('MMM YYYY')
        );
      }
    } else {
      // Generate data points berdasarkan periode
      const now = dayjs();
      let startPoint;
      
      switch (period) {
      case '4hours':
        startPoint = now.startOf('day');
        intervalHours = 4;
        const blocks24Hours = 6; // 24 hours / 4 hours interval
        merchant_chart = generateChartDataPoints(
          startPoint, 
          blocks24Hours, 
          intervalHours,
          (start, end) => `${start.format('DD MMM YYYY')} ${start.format('HH:mm')}-${end.format('HH:mm')}`
        );
        static_chart = generateChartDataPoints(
          startPoint, 
          blocks24Hours, 
          intervalHours,
          (start, end) => `${start.format('DD MMM YYYY')} ${start.format('HH:mm')}-${end.format('HH:mm')}`
        );
        deposit_chart = generateChartDataPoints(
          startPoint, 
          blocks24Hours, 
          intervalHours,
          (start, end) => `${start.format('DD MMM YYYY')} ${start.format('HH:mm')}-${end.format('HH:mm')}`
        );
        break;
      case 'daily':
        // Start from beginning of current month
        startPoint = now.startOf('month');
        intervalHours = 24;
        const daysInMonth = now.daysInMonth();
        merchant_chart = generateChartDataPoints(
          startPoint, 
          daysInMonth,
          intervalHours,
          (start) => start.format('DD MMM YYYY')
        );
        static_chart = generateChartDataPoints(
          startPoint, 
          daysInMonth,
          intervalHours,
          (start) => start.format('DD MMM YYYY')
        );
        deposit_chart = generateChartDataPoints(
          startPoint, 
          daysInMonth,
          intervalHours,
          (start) => start.format('DD MMM YYYY')
        );
        break;
      case '3days':
        // Start from beginning of current month
        startPoint = now.startOf('month');
        intervalHours = 24 * 3;
        const threeDayBlocksInMonth = Math.ceil(now.daysInMonth() / 3);
        merchant_chart = generateChartDataPoints(
          startPoint,
          threeDayBlocksInMonth,
          intervalHours,
          (start) => `${start.format('DD')}–${start.add(2, 'day').format('DD MMM YYYY')}`
        );
        static_chart = generateChartDataPoints(
          startPoint,
          threeDayBlocksInMonth,
          intervalHours,
          (start) => `${start.format('DD')}–${start.add(2, 'day').format('DD MMM YYYY')}`
        );
        deposit_chart = generateChartDataPoints(
          startPoint,
          threeDayBlocksInMonth,
          intervalHours,
          (start) => `${start.format('DD')}–${start.add(2, 'day').format('DD MMM YYYY')}`
        );
        break;
      case 'weekly':
        // Start from 3 months ago
        startPoint = now.subtract(3, 'month').startOf('month');
        intervalHours = 24 * 7;
        const weeksInThreeMonths = 12; // ~4 weeks per month * 3 months
        merchant_chart = generateChartDataPoints(
          startPoint,
          weeksInThreeMonths,
          intervalHours,
          (start) => `${start.format('DD')}–${start.add(6, 'day').format('DD MMM YYYY')}`
        );
        static_chart = generateChartDataPoints(
          startPoint,
          weeksInThreeMonths,
          intervalHours,
          (start) => `${start.format('DD')}–${start.add(6, 'day').format('DD MMM YYYY')}`
        );
        deposit_chart = generateChartDataPoints(
          startPoint,
          weeksInThreeMonths,
          intervalHours,
          (start) => `${start.format('DD')}–${start.add(6, 'day').format('DD MMM YYYY')}`
        );
        break;
      case 'monthly':
        // Start from beginning of current year
        startPoint = now.startOf('year');
        intervalHours = 24 * 30;
        merchant_chart = Array.from({ length: 12 }, (_, index) => ({
          date: startPoint.add(index, 'month').format(),
          label: startPoint.add(index, 'month').format('MMM YYYY'),
          value: 0
        }));
        static_chart = Array.from({ length: 12 }, (_, index) => ({
          date: startPoint.add(index, 'month').format(),
          label: startPoint.add(index, 'month').format('MMM YYYY'),
          value: 0
        }));
        deposit_chart = Array.from({ length: 12 }, (_, index) => ({
          date: startPoint.add(index, 'month').format(),
          label: startPoint.add(index, 'month').format('MMM YYYY'),
          value: 0
        }));
        break;
    }
  }

    // Process merchant chart data using filtered data
    filteredMerchantData.forEach(dbItem => {
      const dbDate = dayjs(dbItem.date);
      const matchingPoint = merchant_chart.find(point => {
        const pointDate = dayjs(point.date);
        const nextPointDate = period === 'monthly' 
          ? pointDate.add(1, 'month')
          : pointDate.add(intervalHours, 'hour');
        
        return dbDate.isSameOrAfter(pointDate) && dbDate.isBefore(nextPointDate);
      });
      
      if (matchingPoint) {
        matchingPoint.value += dbItem.value;
      }
    });

    // Process static chart data using filtered data
    filteredStaticData.forEach(dbItem => {
      const dbDate = dayjs(dbItem.date);
      const matchingPoint = static_chart.find(point => {
        const pointDate = dayjs(point.date);
        const nextPointDate = period === 'monthly' 
          ? pointDate.add(1, 'month')
          : pointDate.add(intervalHours, 'hour');
        
        return dbDate.isSameOrAfter(pointDate) && dbDate.isBefore(nextPointDate);
      });
      
      if (matchingPoint) {
        matchingPoint.value += dbItem.value;
      }
    });

    // Process deposit chart data using filtered data
    filteredDepositData.forEach(dbItem => {
      const dbDate = dayjs(dbItem.date);
      const matchingPoint = deposit_chart.find(point => {
        const pointDate = dayjs(point.date);
        const nextPointDate = period === 'monthly' 
          ? pointDate.add(1, 'month')
          : pointDate.add(intervalHours, 'hour');
        
        return dbDate.isSameOrAfter(pointDate) && dbDate.isBefore(nextPointDate);
      });
      
      if (matchingPoint) {
        matchingPoint.value += dbItem.value;
      }
    });

    const comparison = dbData.monitor_qris_comparison || {
      transactions: { winpay: 0, nobu: 0 },
      revenue: { winpay: 0, nobu: 0 }
    };

    const response = NextResponse.json({
      code: 200,
      status: "success",
      message: "Data QRIS berhasil diambil",
      data: {
        merchant_chart,
        static_chart,
        deposit_chart,
        comparison
      }
    });
    return addCorsHeaders(response);
  } catch (error) {
    console.error('Error in QRIS transaction API:', error);
    const errorResponse = NextResponse.json(
      { code: 500, status: "error", message: "Terjadi kesalahan server", error: error.message },
      { status: 500 }
    );
    return addCorsHeaders(errorResponse);
  }
}

export async function OPTIONS(request) {
  const response = new NextResponse(null, { status: 200 });
  return addCorsHeaders(response);
}
