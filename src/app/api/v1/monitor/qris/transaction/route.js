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
    const start_date = searchParams.get('start_date');
    const end_date = searchParams.get('end_date');

    const dbData = readDbData();
    if (!dbData) {
      const errorResponse = NextResponse.json(
        { code: 500, status: "error", message: "Gagal membaca data database" },
        { status: 500 }
      );
      return addCorsHeaders(errorResponse);
    }

    // Get date range based on period or custom dates
    const dateRange = start_date && end_date 
      ? { start_date, end_date }
      : getDateRange(period);

    // Generate data points berdasarkan periode
    const now = dayjs();
    let startPoint;
    let merchant_chart = [];
    let static_chart = [];
    let deposit_chart = [];
    let intervalHours; // Add interval in hours
    
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

    // Kelompokkan dan jumlahkan data berdasarkan interval
    const dbMerchantData = dbData.monitor_qris_chart || [];
    const dbStaticData = dbData.monitor_qris_static_chart || [];
    const dbDepositData = dbData.monitor_qris_deposit_chart || [];
    
    // Process merchant chart data
    dbMerchantData.forEach(dbItem => {
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

    // Process static chart data
    dbStaticData.forEach(dbItem => {
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

    // Process deposit chart data
    dbDepositData.forEach(dbItem => {
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
    const errorResponse = NextResponse.json(
      { code: 500, status: "error", message: "Terjadi kesalahan server" },
      { status: 500 }
    );
    return addCorsHeaders(errorResponse);
  }
}

export async function OPTIONS(request) {
  const response = new NextResponse(null, { status: 200 });
  return addCorsHeaders(response);
}
