import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
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
    item.supplier_name?.toLowerCase().includes(term) ||
    item.supplier_code?.toLowerCase().includes(term)
  );
}

function paginateData(data, page = 1, limit = 10) {
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

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search')?.toLowerCase() || '';
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const page = parseInt(searchParams.get('page') || '1', 10);

  const file = await fs.readFile(path.join(process.cwd(), 'db.json'), 'utf-8');
  let suppliers = JSON.parse(file).suppliers || [];

  if (search) {
    suppliers = suppliers.filter(s =>
      s.supplier_name.toLowerCase().includes(search) ||
      s.supplier_code.toLowerCase().includes(search)
    );
  }

  const total_data = suppliers.length;
  const total_pages = Math.ceil(total_data / limit);
  const paged = suppliers.slice((page - 1) * limit, page * limit);

  const response = NextResponse.json({
    code: 200,
    status: 'success',
    message: 'Data supplier berhasil diambil',
    data: {
      suppliers: paged,
      pagination: {
        total_data,
        total_pages,
        current_page: page,
        limit
      }
    }
  });
  return addCorsHeaders(response);
}

export async function OPTIONS(request) {
  const response = new NextResponse(null, { status: 200 });
  return addCorsHeaders(response);
} 