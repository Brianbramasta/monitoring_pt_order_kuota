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

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 5;
    const dbData = readDbData();
    if (!dbData) {
      return NextResponse.json({ code: 500, status: "error", message: "Gagal membaca data database" }, { status: 500 });
    }
    let products = dbData.products_best_selling || [];
    products = products.slice(0, limit);
    return NextResponse.json({
      code: 200,
      status: "success",
      message: "Data produk terlaris berhasil diambil",
      data: { products }
    });
  } catch (error) {
    return NextResponse.json({ code: 500, status: "error", message: "Terjadi kesalahan server" }, { status: 500 });
  }
} 