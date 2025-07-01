"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DonutChart from '@/components/charts/DonutChart';
import BarChart from '@/components/charts/BarChart';
import LineChart from '@/components/charts/LineChart';
import BestSellingProductList from '@/components/BestSellingProductList';

export default function SupplierDetailPage() {
  const { supplier_code } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [supplierName, setSupplierName] = useState('');

  useEffect(() => {
    async function fetchDetail() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/v1/suppliers/${supplier_code}/detail`);
        const json = await res.json();
        if (json.code === 200) {
          setData(json.data);
          // Ambil nama supplier dari endpoint list (opsional, bisa diimprove)
          const resList = await fetch(`/api/v1/suppliers?search=${supplier_code}`);
          const jsonList = await resList.json();
          const found = (jsonList.data.suppliers || []).find(s => s.supplier_code === supplier_code);
          setSupplierName(found?.supplier_name || supplier_code);
        } else {
          setError(json.message || 'Gagal mengambil data');
        }
      } catch (e) {
        setError('Gagal mengambil data');
      } finally {
        setLoading(false);
      }
    }
    if (supplier_code) fetchDetail();
  }, [supplier_code]);

  if (loading) return <div className="w-full max-w-5xl mx-auto mt-8 text-center">Loading...</div>;
  if (error) return <div className="w-full max-w-5xl mx-auto mt-8 text-center text-red-500">{error}</div>;
  if (!data) return null;

  return (
    <div className="w-full max-w-5xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6">{supplierName}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <DonutChart
            data={[
              { name: 'Transaksi Berhasil', value: data.product_transaction_analysis.success },
              { name: 'Transaksi Pending', value: data.product_transaction_analysis.pending },
              { name: 'Transaksi Gagal', value: data.product_transaction_analysis.failed },
            ]}
            title="Analisis Transaksi Produk"
          />
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
        <BarChart
          data={data.total_revenue}
          title="Total Revenue"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BestSellingProductList
          title="Produk Terlaris"
          products={data.best_selling_products}
        />
        <LineChart
          data={data.product_sales}
          title="Penjualan Produk"
        />
      </div>
    </div>
  );
} 