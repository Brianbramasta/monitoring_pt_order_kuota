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
    console.error('Error reading db.json:', error);
    return null;
  }
}

function writeDbData(data) {
  try {
    const dbPath = path.join(process.cwd(), 'db.json');
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing to db.json:', error);
    return false;
  }
}

function generateTransaction(customDate = null) {
  const products = [
    { name: 'Indosat 5GB', code: 'IND5GB', price: 25000 },
    { name: 'Telkomsel 10GB', code: 'TSEL10GB', price: 50000 },
    { name: 'XL 15GB', code: 'XL15GB', price: 75000 },
    { name: 'Smartfren 20GB', code: 'SMART20GB', price: 100000 }
  ];

  const suppliers = [
    'PT Supplier A',
    'PT Supplier B',
    'PT Supplier C',
    'PT Supplier D'
  ];

  const baseDate = customDate ? dayjs(customDate) : dayjs();
  const minutesAgo = Math.floor(Math.random() * 240); // Random dalam 4 jam terakhir
  const transactionTime = baseDate.subtract(minutesAgo, 'minute');
  
  const randomProduct = products[Math.floor(Math.random() * products.length)];
  const randomSupplier = suppliers[Math.floor(Math.random() * suppliers.length)];
  const quantity = Math.floor(Math.random() * 5) + 1;

  return {
    date: transactionTime.format('YYYY-MM-DD HH:mm:ss'),
    product_name: randomProduct.name,
    product_code: randomProduct.code,
    supplier_name: randomSupplier,
    quantity: quantity,
    price: randomProduct.price
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
    const count = parseInt(searchParams.get('count')) || 10;
    const date = searchParams.get('date'); // Format expected: YYYY-MM-DD HH:mm:ss

    const db = readDbData();
    if (!db) {
      const errorResponse = NextResponse.json({
        code: 500,
        status: "error",
        message: "Gagal membaca database"
      }, { status: 500 });
      return addCorsHeaders(errorResponse);
    }

    // Generate multiple transactions
    const transactions = Array.from({ length: count }, () => generateTransaction(date));

    // Add to transactions_pending
    if (!db.transactions_pending) {
      db.transactions_pending = [];
    }
    db.transactions_pending.push(...transactions);

    // Add to chart data
    if (!db.transactions_pending_chart) {
      db.transactions_pending_chart = [];
    }
    transactions.forEach(transaction => {
      db.transactions_pending_chart.push({
        date: transaction.date,
        value: 1
      });
    });

    // Write back to database
    if (!writeDbData(db)) {
      const errorResponse = NextResponse.json({
        code: 500,
        status: "error",
        message: "Gagal menyimpan ke database"
      }, { status: 500 });
      return addCorsHeaders(errorResponse);
    }

    const response = NextResponse.json({
      code: 200,
      status: "success",
      message: "Berhasil menambahkan transaksi pending",
      data: {
        transactions,
        count: transactions.length
      }
    });

    return addCorsHeaders(response);

  } catch (error) {
    console.error('Error generating pending transaction:', error);
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
