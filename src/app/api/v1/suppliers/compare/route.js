import { promises as fs } from 'fs';
import path from 'path';

export async function POST(req) {
  const { supplier_codes } = await req.json();
  const file = await fs.readFile(path.join(process.cwd(), 'db.json'), 'utf-8');
  const suppliers = JSON.parse(file).suppliers || [];
  const result = supplier_codes.slice(0, 3).map(code => {
    const supplier = suppliers.find(s => s.supplier_code === code);
    if (!supplier) return null;
    return {
      supplier_code: supplier.supplier_code,
      supplier_name: supplier.supplier_name,
      product_transaction_analysis: supplier.product_transaction_analysis || { success: 0, pending: 0, failed: 0 },
      total_revenue: supplier.total_revenue || [],
      best_selling_products: supplier.best_selling_products || [],
      product_sales: supplier.product_sales || []
    };
  }).filter(Boolean);
  return Response.json({
    code: 200,
    status: 'success',
    message: 'Data perbandingan supplier berhasil diambil',
    data: result
  });
} 