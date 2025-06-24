'use client'
import AreaGrafik from "@/components/AreaGrafik";
import { useState, useEffect } from "react";
import { getTransactionChart } from "@/services/monitor";

export default function MonitorTransactionPage() {
  const [periode, setPeriode] = useState("bulan");
  const [produk, setProduk] = useState("telkomsel");
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
    {
      label: "Pulsa Telkomsel",
      options: [
        { label: "Pulsa Telkomsel", value: "telkomsel" },
        { label: "Pulsa XL", value: "xl" },
      ],
      value: produk,
      onChange: setProduk,
    },
  ];

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
    fetchData();
    
    // Auto refresh setiap 10 detik
    const interval = setInterval(() => {
      fetchData();
    }, 10000);

    // Cleanup interval saat component unmount atau dependency berubah
    return () => clearInterval(interval);
  }, [periode, produk]);

  return (
    <div className="px-8 py-8">
      <h1 className="text-2xl font-bold mb-8">Monitor Transaksi</h1>
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