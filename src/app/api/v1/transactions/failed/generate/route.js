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
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing db.json:', error);
    return false;
  }
}

// Fungsi untuk generate random number dalam range
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Fungsi untuk generate data transaksi gagal
function generateFailedTransactions(count = 10, customDate = null) {
  const baseDate = customDate ? dayjs(customDate) : dayjs();
  const products = [
    { name: "Pulsa Telkomsel 5rb", code: "TSEL5K", price: 5200 },
    { name: "Pulsa Telkomsel 10rb", code: "TSEL10K", price: 10500 },
    { name: "Paket Data XL 1GB", code: "XL1GB", price: 15000 },
    { name: "Token PLN 20rb", code: "PLN20K", price: 20200 },
    { name: "Paket Data Telkomsel 2GB", code: "TSEL2GB", price: 25000 }
  ];

  const suppliers = [
    "Telkomsel API",
    "XL API",
    "Indosat API",
    "PLN API",
    "Smartfren API"
  ];

  // Generate chart data untuk 4 jam terakhir
  const chartData = Array.from({ length: 15 }, (_, index) => {
    const timePoint = baseDate.subtract(4, 'hour').add(16 * index, 'minute');
    return {
      date: timePoint.format('YYYY-MM-DD HH:mm:ss'),
      label: timePoint.format('DD MMM YYYY HH:mm'),
      value: getRandomNumber(50, 200)
    };
  });

  // Generate data transaksi gagal
  const transactions = Array.from({ length: count }, (_, index) => {
    const product = products[Math.floor(Math.random() * products.length)];
    const quantity = getRandomNumber(1, 10);
    const minutesAgo = getRandomNumber(0, 240); // Random dalam 4 jam terakhir
    const transactionTime = baseDate.subtract(minutesAgo, 'minute');
    
    return {
      no: index + 1,
      date: transactionTime.format('YYYY-MM-DD HH:mm:ss'),
      product_name: product.name,
      supplier_name: suppliers[Math.floor(Math.random() * suppliers.length)],
      product_code: product.code,
      price: product.price,
      quantity: quantity,
      void: Math.random() > 0.5 ? product.code : null
    };
  });

  return {
    transactions,
    chartData
  };
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const count = parseInt(searchParams.get('count')) || 10;
    const date = searchParams.get('date'); // Format expected: YYYY-MM-DD HH:mm:ss

    // Baca data existing
    const dbData = readDbData();
    if (!dbData) {
      return NextResponse.json({
        code: 500,
        status: "error",
        message: "Gagal membaca database"
      }, { status: 500 });
    }

    // Generate data baru
    const { transactions, chartData } = generateFailedTransactions(count, date);

    // Tambahkan data baru ke database (tidak mereplace)
    // Untuk transactions_failed
    const maxNo = Math.max(...dbData.transactions_failed.map(t => t.no), 0);
    const newTransactions = transactions.map((t, idx) => ({
      ...t,
      no: maxNo + idx + 1
    }));
    dbData.transactions_failed = [...dbData.transactions_failed, ...newTransactions];

    // Untuk transactions_failed_chart
    const existingDates = new Set(dbData.transactions_failed_chart.map(item => item.date));
    const newChartData = chartData.filter(item => !existingDates.has(item.date));
    dbData.transactions_failed_chart = [...dbData.transactions_failed_chart, ...newChartData];

    // Tulis kembali ke database
    if (!writeDbData(dbData)) {
      return NextResponse.json({
        code: 500,
        status: "error",
        message: "Gagal menyimpan data"
      }, { status: 500 });
    }

    return NextResponse.json({
      code: 200,
      status: "success",
      message: "Data berhasil di-generate",
      data: {
        transactions,
        chart_data: chartData
      }
    });

  } catch (error) {
    console.error('Error generating data:', error);
    return NextResponse.json({
      code: 500,
      status: "error",
      message: "Terjadi kesalahan server"
    }, { status: 500 });
  }
}
