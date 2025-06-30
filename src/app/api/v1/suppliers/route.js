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

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const dbData = readDbData();
    if (!dbData) {
      return NextResponse.json({ code: 500, status: "error", message: "Gagal membaca data database" }, { status: 500 });
    }
    let suppliers = dbData.suppliers || [];
    suppliers = searchData(suppliers, search);
    const { data: paginatedSuppliers, pagination } = paginateData(suppliers, page, limit);
    const suppliersWithNo = paginatedSuppliers.map((item, index) => ({
      no: (page - 1) * limit + index + 1,
      ...item,
      supplier_status: "Aktif", // default dummy
      server_status: item.server_status === "Stabil" ? "Online" : "Offline"
    }));
    return NextResponse.json({
      code: 200,
      status: "success",
      message: "Data supplier berhasil diambil",
      data: { suppliers: suppliersWithNo, pagination }
    });
  } catch (error) {
    return NextResponse.json({ code: 500, status: "error", message: "Terjadi kesalahan server" }, { status: 500 });
  }
} 