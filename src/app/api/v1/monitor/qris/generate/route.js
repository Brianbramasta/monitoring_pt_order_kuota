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

// Fungsi untuk menulis data ke db.json
function writeDbData(data) {
  try {
    const dbPath = path.join(process.cwd(), 'db.json');
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing db.json:', error);
    return false;
  }
}

// Fungsi untuk menambahkan header CORS
function addCorsHeaders(response) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

// Fungsi untuk generate random value dalam range
function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Fungsi untuk generate data QRIS
function generateQrisData(count, targetDate) {
  const baseDate = dayjs(targetDate);
  const merchantData = [];
  const staticData = [];
  const depositData = [];
  
  for (let i = 0; i < count; i++) {
    // Generate data per jam dari tanggal target
    const currentDate = baseDate.add(i, 'hour');
    const label = currentDate.format('DD MMM YYYY HH:mm');
    
    // Generate random values untuk setiap chart
    const merchantValue = getRandomValue(500000, 5000000);
    const staticValue = getRandomValue(300000, 3000000);
    const depositValue = getRandomValue(200000, 2000000);
    
    merchantData.push({
      date: currentDate.format(),
      label: label,
      value: merchantValue
    });
    
    staticData.push({
      date: currentDate.format(),
      label: label,
      value: staticValue
    });
    
    depositData.push({
      date: currentDate.format(),
      label: label,
      value: depositValue
    });
  }
  
  return {
    merchant: merchantData,
    static: staticData,
    deposit: depositData
  };
}

// Fungsi untuk generate comparison data
function generateComparisonData() {
  return {
    transactions: {
      winpay: getRandomValue(4000000, 8000000),
      nobu: getRandomValue(3000000, 6000000)
    },
    revenue: {
      winpay: getRandomValue(5000000, 10000000),
      nobu: getRandomValue(2000000, 5000000)
    }
  };
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Ambil parameter dari query string
    const count = parseInt(searchParams.get('count')) || 10;
    const date = searchParams.get('date') || dayjs().format('YYYY-MM-DD');
    
    // Validasi count (maksimal 100 untuk menghindari data terlalu besar)
    if (count > 100) {
      const errorResponse = NextResponse.json({
        code: 400,
        status: "error",
        message: "Count maksimal adalah 100"
      }, { status: 400 });
      return addCorsHeaders(errorResponse);
    }
    
    // Validasi format tanggal
    if (!dayjs(date).isValid()) {
      const errorResponse = NextResponse.json({
        code: 400,
        status: "error",
        message: "Format tanggal tidak valid. Gunakan format YYYY-MM-DD"
      }, { status: 400 });
      return addCorsHeaders(errorResponse);
    }
    
    // Baca data existing dari db.json
    const dbData = readDbData();
    if (!dbData) {
      const errorResponse = NextResponse.json({
        code: 500,
        status: "error",
        message: "Gagal membaca data database"
      }, { status: 500 });
      return addCorsHeaders(errorResponse);
    }
    
    // Generate data QRIS baru
    const newQrisData = generateQrisData(count, date);
    const newComparisonData = generateComparisonData();
    
    // Tambahkan data baru ke existing data
    dbData.monitor_qris_chart = [...(dbData.monitor_qris_chart || []), ...newQrisData.merchant];
    dbData.monitor_qris_static_chart = [...(dbData.monitor_qris_static_chart || []), ...newQrisData.static];
    dbData.monitor_qris_deposit_chart = [...(dbData.monitor_qris_deposit_chart || []), ...newQrisData.deposit];
    dbData.monitor_qris_comparison = newComparisonData;
    
    // Simpan data ke db.json
    const writeSuccess = writeDbData(dbData);
    if (!writeSuccess) {
      const errorResponse = NextResponse.json({
        code: 500,
        status: "error",
        message: "Gagal menyimpan data ke database"
      }, { status: 500 });
      return addCorsHeaders(errorResponse);
    }
    
    const response = NextResponse.json({
      code: 200,
      status: "success",
      message: `Berhasil generate ${count} data QRIS untuk tanggal ${date}`,
      data: {
        generated_count: count,
        target_date: date,
        merchant_data: newQrisData.merchant,
        static_data: newQrisData.static,
        deposit_data: newQrisData.deposit,
        comparison_data: newComparisonData
      }
    });
    
    return addCorsHeaders(response);
    
  } catch (error) {
    console.error('Error in QRIS generate API:', error);
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