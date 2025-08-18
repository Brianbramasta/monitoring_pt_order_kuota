import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import dayjs from 'dayjs';

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

    // Get all QRIS related data
    let merchant_chart = dbData.monitor_qris_chart || [];
    let static_chart = dbData.monitor_qris_static_chart || [];
    let deposit_chart = dbData.monitor_qris_deposit_chart || [];
    const comparison = dbData.monitor_qris_comparison || {
      transactions: { winpay: 0, nobu: 0 },
      revenue: { winpay: 0, nobu: 0 }
    };

    // Filter data by date range if needed
    // if (start_date && end_date) {
    //   merchant_chart = filterDataByDateRange(merchant_chart, start_date, end_date);
    //   static_chart = filterDataByDateRange(static_chart, start_date, end_date);
    //   deposit_chart = filterDataByDateRange(deposit_chart, start_date, end_date);
    // }

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
