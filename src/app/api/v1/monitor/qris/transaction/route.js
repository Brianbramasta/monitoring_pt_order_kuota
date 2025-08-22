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
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

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
    
    if (startDate && endDate) {
      // Generate chart data based on custom date range
      const start = dayjs(startDate);
      const end = dayjs(endDate);
      const diffDays = end.diff(start, 'day');
      
      let intervalHours, labelFormat, dataPoints;
      
      if (diffDays <= 1) {
        // Hourly intervals for 1 day or less
        intervalHours = 1;
        dataPoints = 24;
        labelFormat = (point) => point.format('HH:mm');
      } else if (diffDays <= 7) {
        // Daily intervals for up to 7 days
        intervalHours = 24;
        dataPoints = diffDays + 1;
        labelFormat = (point) => point.format('DD MMM');
      } else if (diffDays <= 30) {
        // Weekly intervals for up to 30 days
        intervalHours = 24 * 7;
        dataPoints = Math.ceil(diffDays / 7);
        labelFormat = (point) => `${point.format('DD MMM')} - ${point.add(6, 'day').format('DD MMM')}`;
      } else {
        // Monthly intervals for longer periods
        intervalHours = 24 * 30;
        dataPoints = Math.ceil(diffDays / 30);
        labelFormat = (point) => point.format('MMM YYYY');
      }
      
      merchant_chart = generateChartDataPoints(start, dataPoints, intervalHours, labelFormat);
      static_chart = generateChartDataPoints(start, dataPoints, intervalHours, labelFormat);
      deposit_chart = generateChartDataPoints(start, dataPoints, intervalHours, labelFormat);
    } else {
      // Generate data points berdasarkan periode
      const now = dayjs();
      let startPoint;
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
