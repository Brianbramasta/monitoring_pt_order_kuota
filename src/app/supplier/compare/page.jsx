"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import DonutChart from '@/components/charts/DonutChart';
import BarChart from '@/components/charts/BarChart';
import HorizontalBarChart from '@/components/charts/HorizontalBarChart';
import LineChart from '@/components/charts/LineChart';

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

  return (
    <div className="w-full max-w-6xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6">Perbandingan Supplier</h1>
      {/* Analisis Transaksi Produk */}
      <div className="mb-8">
        <div className="font-semibold mb-2">Analisis Transaksi Produk</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.map(sup => (
            <DonutChart
              key={sup.supplier_code}
              data={[
                { name: 'Transaksi Berhasil', value: sup.product_transaction_analysis.success },
                { name: 'Transaksi Pending', value: sup.product_transaction_analysis.pending },
                { name: 'Transaksi Gagal', value: sup.product_transaction_analysis.failed },
              ]}
              title={sup.supplier_name}
            />
          ))}
        </div>
      </div>
      {/* Produk Terlaris */}
      <div className="mb-8">
        <div className="font-semibold mb-2">Produk Terlaris</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.map(sup => (
            <HorizontalBarChart
              key={sup.supplier_code}
              data={sup.best_selling_products}
              title={sup.supplier_name}
            />
          ))}
        </div>
      </div>
      {/* Total Revenue */}
      <div className="mb-8">
        <div className="font-semibold mb-2">Total Revenue</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.map(sup => (
            <BarChart
              key={sup.supplier_code}
              data={sup.total_revenue}
              title={sup.supplier_name}
            />
          ))}
        </div>
      </div>
      {/* Penjualan Produk */}
      <div className="mb-8">
        <div className="font-semibold mb-2">Penjualan Produk</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.map(sup => (
            <LineChart
              key={sup.supplier_code}
              data={sup.product_sales}
              title={sup.supplier_name}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 