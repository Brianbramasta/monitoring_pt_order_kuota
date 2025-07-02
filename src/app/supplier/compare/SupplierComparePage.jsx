'use client';
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import DonutChart from '@/components/charts/DonutChart';
import BarChart from '@/components/charts/BarChart';
import HorizontalBarChart from '@/components/charts/HorizontalBarChart';
import LineChart from '@/components/charts/LineChart';
import BestSellingProductList from '@/components/BestSellingProductList';

const COLORS = ['#177F7E', '#FFD600', '#E53935'];
// Warna khusus untuk bar/line chart (Total Revenue & Penjualan Produk)
const BAR_LINE_COLORS = ['#177F7E', '#049DD4', '#FFD66B'];

export default function SupplierComparePage() {
  const searchParams = useSearchParams();
  // Ambil codes hanya sekali di awal render
  const [codes] = useState(() => {
    const c = searchParams.get('codes');
    return c ? c.split(',').filter(Boolean) : [];
  });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCompare() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/v1/suppliers/compare', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ supplier_codes: codes })
        });
        const json = await res.json();
        if (json.code === 200) {
          setData(json.data || []);
        } else {
          setError(json.message || 'Gagal mengambil data');
        }
      } catch (e) {
        setError('Gagal mengambil data');
      } finally {
        setLoading(false);
      }
    }
    if (codes.length >= 2) fetchCompare();
  }, [codes]);

  if (loading) return <div className="w-full max-w-6xl mx-auto mt-8 text-center">Loading...</div>;
  if (error) return <div className="w-full max-w-6xl mx-auto mt-8 text-center text-red-500">{error}</div>;
  if (!data || data.length === 0) return <div className="w-full max-w-6xl mx-auto mt-8 text-center">Tidak ada data perbandingan</div>;

  // Legend global
  const supplierNames = data.map(sup => sup.supplier_name);
  // const supplierCodes = data.map(sup => sup.supplier_code);

  // Gabungkan data Produk Terlaris
  // Kumpulkan semua nama produk unik dari semua supplier
  const allProducts = Array.from(new Set(data.flatMap(sup => (sup.best_selling_products || []).map(p => p.product_name))));
  // Untuk setiap produk, buat object dengan sales dari tiap supplier (pakai nama supplier)
  const bestSellingData = allProducts.map(product => {
    const obj = { product_name: product };
    data.forEach((sup, idx) => {
      const found = (sup.best_selling_products || []).find(p => p.product_name === product);
      obj[sup.supplier_name] = found ? found.sales : 0;
    });
    return obj;
  });

  // Gabungkan data Total Revenue
  // Kumpulkan semua bulan unik dari semua supplier
  const allMonths = Array.from(new Set(data.flatMap(sup => (sup.total_revenue || []).map(r => r.label))));
  const totalRevenueData = allMonths.map(month => {
    const obj = { label: month };
    data.forEach((sup, idx) => {
      const found = (sup.total_revenue || []).find(r => r.label === month);
      obj[sup.supplier_name] = found ? found.value : 0;
    });
    return obj;
  });

  // Gabungkan data Penjualan Produk
  // Kumpulkan semua bulan unik dari semua supplier
  const allSalesMonths = Array.from(new Set(data.flatMap(sup => (sup.product_sales || []).map(r => r.label))));
  const productSalesData = allSalesMonths.map(month => {
    const obj = { label: month };
    data.forEach((sup, idx) => {
      const found = (sup.product_sales || []).find(r => r.label === month);
      obj[sup.supplier_name] = found ? found.value : 0;
    });
    return obj;
  });

  // barKeys untuk chart multi-bar (pakai nama supplier)
  const barKeys = supplierNames;
  const barColors = BAR_LINE_COLORS.slice(0, barKeys.length);

  return (
    <div className="w-full mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6">Perbandingan Supplier</h1>
      {/* Legend Global */}
      {/* <div className="flex gap-6 justify-center my-4">
        {data.map((sup, idx) => (
          <div key={sup.supplier_code} className="flex items-center gap-2">
            <span className="inline-block w-5 h-5 rounded-full" style={{ backgroundColor: COLORS[idx] }}></span>
            <span className="font-medium text-gray-700">{sup.supplier_name}</span>
          </div>
        ))}
      </div> */}
      {/* Analisis Transaksi Produk */}
      <div className="mb-8 bg-[#FAFAFB] rounded-2xl p-8" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <div className="text-3xl font-bold text-center mb-8">Analisis Transaksi Produk</div>
        <div
          className={
            data.length === 2
              ? "grid grid-cols-1 md:grid-cols-2 gap-6 items-end justify-items-center justify-center"
              : "grid grid-cols-1 md:grid-cols-3 gap-6 items-end justify-items-center"
          }
        >
          {data.map((sup, idx) => (
            <div key={sup.supplier_code} className="flex flex-col items-center">
              <div className="text-lg font-semibold mb-2 text-center">{sup.supplier_name}</div>
              <DonutChart
                data={[
                  { name: 'Transaksi Berhasil', value: sup.product_transaction_analysis.success },
                  { name: 'Transaksi Pending', value: sup.product_transaction_analysis.pending },
                  { name: 'Transaksi Gagal', value: sup.product_transaction_analysis.failed },
                ]}
                title=""
              />
            </div>
          ))}
        </div>
        {/* Legend global untuk donut */}
        <div className="flex flex-row justify-center items-center gap-8 mt-8 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="inline-block w-5 h-5 rounded-full" style={{ backgroundColor: '#177F7E' }}></span>
            <span className="text-gray-500 font-medium text-base">Transaksi Berhasil</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-5 h-5 rounded-full" style={{ backgroundColor: '#FFD600' }}></span>
            <span className="text-gray-500 font-medium text-base">Transaksi Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-5 h-5 rounded-full" style={{ backgroundColor: '#E53935' }}></span>
            <span className="text-gray-500 font-medium text-base">Transaksi Gagal</span>
          </div>
        </div>
      </div>
      {/* Produk Terlaris per supplier (bukan chart) */}
      <div className="mb-8 bg-[#FAFAFB] rounded-2xl p-8" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <div className="text-3xl font-bold text-center mb-8">Produk Terlaris</div>
        <div
          className={
            data.length === 2
              ? "grid grid-cols-1 md:grid-cols-2 gap-6 justify-center"
              : "grid grid-cols-1 md:grid-cols-3 gap-6"
          }
        >
          {data.map(sup => (
            <BestSellingProductList
              key={sup.supplier_code}
              title={sup.supplier_name}
              products={sup.best_selling_products}
            />
          ))}
        </div>
      </div>
      {/* Total Revenue Gabungan */}
      <div className="mb-8 bg-[#FAFAFB] rounded-2xl p-8" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <div className="text-3xl font-bold text-center mb-8">Total Revenue</div>
        <BarChart
          data={totalRevenueData}
          barKeys={barKeys}
          colors={barColors}
          title=""
        />
      </div>
      {/* Penjualan Produk (gabungan) */}
      <div className="mb-8 bg-[#FAFAFB] rounded-2xl p-8" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <div className="text-3xl font-bold text-center mb-8">Penjualan Produk</div>
        <LineChart
          data={productSalesData}
          lineKeys={barKeys}
          colors={barColors}
          title=""
        />
      </div>
    </div>
  );
} 