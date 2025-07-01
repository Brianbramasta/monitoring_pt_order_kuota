import { promises as fs } from 'fs';
import path from 'path';

export async function GET(req, { params }) {
  const { supplier_code } = params;
  const file = await fs.readFile(path.join(process.cwd(), 'db.json'), 'utf-8');
  const suppliers = JSON.parse(file).suppliers || [];
  const supplier = suppliers.find(s => s.supplier_code === supplier_code);
  if (!supplier) {
    return Response.json({ code: 404, status: 'error', message: 'Supplier tidak ditemukan' }, { status: 404 });
  }
  return Response.json({
    code: 200,
    status: 'success',
    message: 'Detail supplier berhasil diambil',
    data: {
      product_transaction_analysis: supplier.product_transaction_analysis || { success: 0, pending: 0, failed: 0 },
      total_revenue: supplier.total_revenue || [],
      best_selling_products: supplier.best_selling_products || [],
      product_sales: supplier.product_sales || []
    }
  });
} 