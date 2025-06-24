'use client'
import AreaGrafik from "@/components/AreaGrafik";
import { useState, useEffect } from "react";
import { getQrisChart } from "@/services/monitor";
import RefreshButton from '@/components/RefreshButton';

export default function MonitorQrisPage() {
  const [periode, setPeriode] = useState("bulan");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalValue, setTotalValue] = useState(0);

  const filters = [
    {
      label: "Bulanan",
      options: [
        { label: "Bulanan", value: "bulan" },
        { label: "Mingguan", value: "minggu" },
      ],
      value: periode,
      onChange: setPeriode,
    },
  ];

  const fetchData = () => {
    setLoading(true);
    getQrisChart({ period: periode })
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
    fetchData();
    
    // Auto refresh setiap 10 detik
    const interval = setInterval(() => {
      fetchData();
    }, 10000);

    // Cleanup interval saat component unmount atau dependency berubah
    return () => clearInterval(interval);
  }, [periode]);

  return (
    <div className="px-8 py-8">
      <div className="flex flex-row justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Monitor QRIS</h1>
        <RefreshButton onClick={fetchData} disabled={loading} loading={loading} />
      </div>
      <AreaGrafik
        totalLabel="NOMINAL TRANSAKSI QRIS"
        totalValue={<span style={{ color: '#1EC98B' }}>Rp {Number(totalValue).toLocaleString('id-ID')}</span>}
        filters={filters}
        data={data}
        dataKeyX="x"
        dataKeyY="y"
        tooltipFormatter={(value, name, props) => [
          `Rp ${Number(value).toLocaleString('id-ID')}`,
          props && props.payload && props.payload.x ? props.payload.x : name
        ]}
        loading={loading}
      />
    </div>
  );
} 