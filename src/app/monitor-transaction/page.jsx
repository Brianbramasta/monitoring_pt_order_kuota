'use client'
import AreaGrafik from "@/components/AreaGrafik";
import { useState, useEffect } from "react";
import { getTransactionChart } from "@/services/monitor";
import { getProductsOptions } from '@/services/products';
import RefreshButton from '@/components/RefreshButton';

export default function MonitorTransactionPage() {
  const [periode, setPeriode] = useState("bulan");
  const [produk, setProduk] = useState("");
  const [produkOptions, setProdukOptions] = useState([]);
  const [produkReady, setProdukReady] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    getProductsOptions({ limit: 100 }).then(res => {
      const arr = res.data.data?.products || [];
      setProdukOptions(arr.map(opt => ({ label: opt.name, value: opt.id })));
      if (arr.length > 0) {
        setProduk(arr[0].id);
        setProdukReady(true);
      }
    });
  }, []);

  const filters = [
    {
      label: "Bulanan",
      options: [
        { label: "Bulanan", value: "monthly" },
        { label: "Mingguan", value: "weekly" },
      ],
      value: periode,
      onChange: setPeriode,
    },
  ];

  if (produkReady) {
    filters.push({
      label: produkOptions.find(opt => opt.value === produk)?.label || "Pilih Produk",
      options: produkOptions,
      value: produk,
      onChange: setProduk,
    });
  }

  const fetchData = () => {
    setLoading(true);
    getTransactionChart({ period: periode, product_id: produk })
      .then(res => {
        const arr = res.data.data?.chart_data || [];
        setData(arr.map(item => ({ x: item.label, y: item.value })));
        setTotalValue(arr.reduce((sum, item) => sum + (item.value || 0), 0));
      })
      .catch(() => {
        setData([]);
        setTotalValue(0);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (produkReady && produk) fetchData();
    const interval = setInterval(() => {
      if (produkReady && produk) fetchData();
    }, 10000);
    return () => clearInterval(interval);
  }, [periode, produk, produkReady]);

  return (
    <div className="px-8 py-8">
      <div className="flex flex-row justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Monitor Transaksi</h1>
        <RefreshButton onClick={fetchData} disabled={loading} loading={loading} />
      </div>
      <AreaGrafik
        totalLabel="NOMINAL TOTAL PENJUALAN"
        totalValue={<span style={{ color: '#1EC98B' }}>Rp {Number(totalValue).toLocaleString('id-ID')}</span>}
        filters={filters}
        data={data}
        dataKeyX="x"
        dataKeyY="y"
        tooltipFormatter={(value, name, props) => [
          `Rp ${Number(value).toLocaleString('id-ID')}.000.000`,
          props && props.payload && props.payload.x ? props.payload.x : name
        ]}
        loading={loading}
      />
    </div>
  );
} 