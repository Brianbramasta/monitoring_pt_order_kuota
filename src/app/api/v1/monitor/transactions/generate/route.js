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

// Fungsi untuk generate data monitor transaksi
function generateMonitorTransactions(count = 10, customDate = null) {
  const baseDate = customDate ? dayjs(customDate) : dayjs();
  const products = [
    { id: 1, name: "Pulsa Telkomsel 5rb", code: "TSEL5K", price: 5200 },
    { id: 2, name: "Pulsa Telkomsel 10rb", code: "TSEL10K", price: 10500 },
    { id: 3, name: "Paket Data XL 1GB", code: "XL1GB", price: 15000 },
    { id: 4, name: "Token PLN 20rb", code: "PLN20K", price: 20200 },
    { id: 5, name: "Paket Data Telkomsel 2GB", code: "TSEL2GB", price: 25000 },
    { id: 6, name: "Pulsa Indosat 25rb", code: "ISAT25K", price: 25500 },
    { id: 7, name: "Paket Data Smartfren 3GB", code: "SMART3GB", price: 30000 }
  ];

  const servers = [
    "Server-01",
    "Server-02",
    "Server-03",
    "Server-04",
    "Server-05"
  ];

  const providers = [
    "Telkomsel",
    "XL Axiata",
    "Indosat",
    "Smartfren",
    "PLN"
  ];

  const payments = [
    "QRIS",
    "Transfer Bank",
    "E-Wallet",
    "Virtual Account",
    "Credit Card"
  ];

  const statuses = ["Success", "Pending", "Failed"];

  // Generate chart data untuk berbagai periode
  const chartData = [];
  
  // Generate data untuk 4 jam terakhir (interval 15 menit)
  for (let i = 0; i < 16; i++) {
    const timePoint = baseDate.subtract(4, 'hour').add(15 * i, 'minute');
    const product = products[Math.floor(Math.random() * products.length)];
    chartData.push({
      date: timePoint.format('YYYY-MM-DD HH:mm:ss'),
      product_id: product.id,
      value: getRandomNumber(10, 100)
    });
  }

  // Generate data untuk hari ini (interval 1 jam)
  for (let i = 0; i < 24; i++) {
    const timePoint = baseDate.startOf('day').add(i, 'hour');
    const product = products[Math.floor(Math.random() * products.length)];
    chartData.push({
      date: timePoint.format('YYYY-MM-DD HH:mm:ss'),
      product_id: product.id,
      value: getRandomNumber(50, 300)
    });
  }

  // Generate data untuk 3 hari terakhir (interval 3 jam)
  for (let i = 0; i < 24; i++) {
    const timePoint = baseDate.subtract(3, 'day').add(3 * i, 'hour');
    const product = products[Math.floor(Math.random() * products.length)];
    chartData.push({
      date: timePoint.format('YYYY-MM-DD HH:mm:ss'),
      product_id: product.id,
      value: getRandomNumber(100, 500)
    });
  }

  // Generate data untuk minggu ini (interval 6 jam)
  for (let i = 0; i < 28; i++) {
    const timePoint = baseDate.subtract(7, 'day').add(6 * i, 'hour');
    const product = products[Math.floor(Math.random() * products.length)];
    chartData.push({
      date: timePoint.format('YYYY-MM-DD HH:mm:ss'),
      product_id: product.id,
      value: getRandomNumber(200, 800)
    });
  }

  // Generate data untuk bulan ini (interval 1 hari)
  for (let i = 0; i < 30; i++) {
    const timePoint = baseDate.subtract(30, 'day').add(i, 'day');
    const product = products[Math.floor(Math.random() * products.length)];
    chartData.push({
      date: timePoint.format('YYYY-MM-DD HH:mm:ss'),
      product_id: product.id,
      value: getRandomNumber(500, 2000)
    });
  }

  // Generate data transaksi monitor
  const transactions = Array.from({ length: count }, (_, index) => {
    const product = products[Math.floor(Math.random() * products.length)];
    const minutesAgo = getRandomNumber(0, 240); // Random dalam 4 jam terakhir
    const transactionTime = baseDate.subtract(minutesAgo, 'minute');
    const phoneNumber = `08${getRandomNumber(10000000, 99999999)}`;
    
    return {
      id: `TRX${Date.now()}${index.toString().padStart(3, '0')}`,
      user: `User${getRandomNumber(1000, 9999)}`,
      server: servers[Math.floor(Math.random() * servers.length)],
      provider: providers[Math.floor(Math.random() * providers.length)],
      nominal: product.name,
      phone_or_pln: phoneNumber,
      price: `Rp ${product.price.toLocaleString('id-ID')}`,
      payment: payments[Math.floor(Math.random() * payments.length)],
      purchase_date: transactionTime.format('YYYY-MM-DD HH:mm:ss'),
      status: statuses[Math.floor(Math.random() * statuses.length)]
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
    const { transactions, chartData } = generateMonitorTransactions(count, date);

    // Tambahkan data baru ke database (tidak mereplace)
    // Untuk monitor_transactions
    if (!dbData.monitor_transactions) {
      dbData.monitor_transactions = { transactions: [], recap: {} };
    }
    if (!dbData.monitor_transactions.transactions) {
      dbData.monitor_transactions.transactions = [];
    }
    
    dbData.monitor_transactions.transactions = [...dbData.monitor_transactions.transactions, ...transactions];

    // Untuk monitor_transactions_chart
    if (!dbData.monitor_transactions_chart) {
      dbData.monitor_transactions_chart = [];
    }
    
    const existingDates = new Set(dbData.monitor_transactions_chart.map(item => `${item.date}_${item.product_id}`));
    const newChartData = chartData.filter(item => !existingDates.has(`${item.date}_${item.product_id}`));
    dbData.monitor_transactions_chart = [...dbData.monitor_transactions_chart, ...newChartData];

    // Update recap data
    const totalTransactions = dbData.monitor_transactions.transactions.length;
    const successfulTransactions = dbData.monitor_transactions.transactions.filter(t => t.status === 'Success').length;
    const retailUsers = getRandomNumber(1000, 5000);
    const h2hUsers = getRandomNumber(500, 2000);
    const newRegistrations = getRandomNumber(50, 200);
    
    dbData.monitor_transactions.recap = {
      total_successful_transactions: successfulTransactions,
      total_retail_users: retailUsers,
      total_h2h_users: h2hUsers,
      total_new_registrations: newRegistrations
    };

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
      message: "Data monitor transaksi berhasil di-generate",
      data: {
        transactions,
        chart_data: chartData,
        recap: dbData.monitor_transactions.recap
      }
    });

  } catch (error) {
    console.error('Error generating monitor transactions data:', error);
    return NextResponse.json({
      code: 500,
      status: "error",
      message: "Terjadi kesalahan server"
    }, { status: 500 });
  }
}