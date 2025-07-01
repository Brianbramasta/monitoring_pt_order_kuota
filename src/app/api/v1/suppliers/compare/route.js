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
      product_transaction_analysis: { success: 120, pending: 30, failed: 10 },
      total_revenue: [
        { label: 'Jan', value: 10000000 },
        { label: 'Feb', value: 12000000 },
        { label: 'Mar', value: 9000000 }
      ],
      best_selling_products: [
        { product_name: 'Pulsa Telkomsel 5rb', sales: 23400 },
        { product_name: 'Pulsa Indosat 5rb', sales: 15000 },
        { product_name: 'Token PLN 20rb', sales: 12000 }
      ],
      product_sales: [
        { label: 'Jan', value: 5000 },
        { label: 'Feb', value: 6000 },
        { label: 'Mar', value: 4000 }
      ]
    };
  }).filter(Boolean);
  return Response.json({
    code: 200,
    status: 'success',
    message: 'Data perbandingan supplier berhasil diambil',
    data: result
  });
} 