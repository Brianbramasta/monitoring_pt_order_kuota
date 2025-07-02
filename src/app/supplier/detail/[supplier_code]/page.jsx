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

  // Ambil label legend dari data donut
  const donutData = [
    { name: 'Transaksi Berhasil', value: data.product_transaction_analysis.success },
    { name: 'Transaksi Pending', value: data.product_transaction_analysis.pending },
    { name: 'Transaksi Gagal', value: data.product_transaction_analysis.failed },
  ];
  const legendLabels = donutData.map((d, idx) => ({
    label: d.name,
    color: ["#177F7E", "#FFD600", "#E53935"][idx]
  }));

  return (
    <div className="w-full  mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6">{supplierName}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <DonutChart
          data={donutData}
          title="Analisis Transaksi Produk"
          showLegend={true}
          legendLabels={legendLabels}
        />
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