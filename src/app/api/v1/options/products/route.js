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
    item.name?.toLowerCase().includes(term)
  );
}

function paginateData(data, page = 1, limit = 100) {
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
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 100;

    const dbData = readDbData();
    if (!dbData) {
      const errorResponse = NextResponse.json({ 
        code: 500, 
        status: "error", 
        message: "Gagal membaca data database" 
      }, { status: 500 });
      return addCorsHeaders(errorResponse);
    }

    let products = dbData.products || [];
    
    // Filter berdasarkan search
    products = searchData(products, search);

    // Pagination
    const { data: paginatedProducts, pagination } = paginateData(products, page, limit);

    const response = NextResponse.json({
      code: 200,
      status: "success",
      message: "Daftar produk berhasil diambil",
      data: {
        products: paginatedProducts,
        pagination
      }
    });

    return addCorsHeaders(response);

  } catch (error) {
    console.error('Error in products options API:', error);
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