import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function readDbData() {
  try {
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbContent = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(dbContent);
  } catch (error) {
    return null;
  }
}

function searchData(data, searchTerm) {
  if (!searchTerm) return data;
  const term = searchTerm.toLowerCase();
  return data.filter(item =>
    item.product_name?.toLowerCase().includes(term)
  );
}

function filterByCategory(data, category) {
  if (!category || category === 'all') return data;
  return data.filter(item => item.category?.toLowerCase() === category.toLowerCase());
}

// Fungsi untuk menambahkan header CORS
function addCorsHeaders(response) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = 10;
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const dbData = readDbData();
    if (!dbData) {
      const errorResponse = NextResponse.json({ code: 500, status: "error", message: "Gagal membaca data database" }, { status: 500 });
      return addCorsHeaders(errorResponse);
    }
    let products = dbData.products_best_selling || [];
    products = filterByCategory(products, category);
    products = searchData(products, search);
    products = products.slice(0, limit);
    // Tambahkan peringkat
    products = products.map((item, idx) => ({
      rank: idx + 1,
      ...item
    }));
    const response = NextResponse.json({
      code: 200,
      status: "success",
      message: "Data produk terlaris berhasil diambil",
      data: { products }
    });
    return addCorsHeaders(response);
  } catch (error) {
    const errorResponse = NextResponse.json({ code: 500, status: "error", message: "Terjadi kesalahan server" }, { status: 500 });
    return addCorsHeaders(errorResponse);
  }
}

export async function OPTIONS(request) {
  const response = new NextResponse(null, { status: 200 });
  return addCorsHeaders(response);
} 