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
    const dbData = readDbData();
    if (!dbData) {
      return NextResponse.json({ code: 500, status: "error", message: "Gagal membaca data database" }, { status: 500 });
    }
    const chart_data = dbData.monitor_transactions_chart || [];
    return NextResponse.json({
      code: 200,
      status: "success",
      message: "Data monitor transaksi berhasil diambil",
      data: { chart_data }
    });
  } catch (error) {
    return NextResponse.json({ code: 500, status: "error", message: "Terjadi kesalahan server" }, { status: 500 });
  }
} 