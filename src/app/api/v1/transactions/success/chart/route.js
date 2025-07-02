import { promises as fs } from 'fs';
import path from 'path';

export async function GET(req) {
  const url = new URL(req.url, 'http://localhost');
  const period = url.searchParams.get('period') || 'monthly';
  const dbPath = path.join(process.cwd(), 'db.json');
  const dbRaw = await fs.readFile(dbPath, 'utf-8');
  const db = JSON.parse(dbRaw);
  const chartData = db.transactions_success_chart || [];
  return new Response(JSON.stringify({
    code: 200,
    status: 'success',
    message: 'Data chart transaksi sukses berhasil diambil',
    data: { chart_data: chartData }
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
} 