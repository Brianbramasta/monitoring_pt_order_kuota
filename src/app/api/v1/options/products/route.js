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

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 100;

    const dbData = readDbData();
    if (!dbData) {
      return NextResponse.json({ 
        code: 500, 
        status: "error", 
        message: "Gagal membaca data database" 
      }, { status: 500 });
    }

    let products = dbData.products || [];
    
    // Filter berdasarkan search
    products = searchData(products, search);

    // Pagination
    const { data: paginatedProducts, pagination } = paginateData(products, page, limit);

    return NextResponse.json({
      code: 200,
      status: "success",
      message: "Daftar produk berhasil diambil",
      data: {
        products: paginatedProducts,
        pagination
      }
    });

  } catch (error) {
    console.error('Error in products options API:', error);
    return NextResponse.json({ 
      code: 500, 
      status: "error", 
      message: "Terjadi kesalahan server" 
    }, { status: 500 });
  }
} 