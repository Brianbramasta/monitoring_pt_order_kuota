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

// Fungsi untuk menambahkan header CORS
function addCorsHeaders(response) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

export async function GET(request) {
  try {
    const dbData = readDbData();
    if (!dbData) {
      const errorResponse = NextResponse.json({ 
        code: 500, 
        status: "error", 
        message: "Gagal membaca data database" 
      }, { status: 500 });
      return addCorsHeaders(errorResponse);
    }

    const productTypes = dbData.product_types || [];

    const response = NextResponse.json({
      code: 200,
      status: "success",
      message: "Daftar jenis produk berhasil diambil",
      data: {
        product_types: productTypes
      }
    });

    return addCorsHeaders(response);

  } catch (error) {
    console.error('Error in product types API:', error);
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