'use client'
import { useState, useEffect } from "react";
import { getQrisChart, getQrisStaticChart, getQrisDepositChart, getQrisComparison } from "@/services/monitor";
import RefreshButton from '@/components/RefreshButton';
import AreaGrafik from "@/components/AreaGrafik";
import QrisLineChart from "@/components/QrisLineChart";
import QrisComparisonChart from "@/components/QrisComparisonChart";

export default function MonitorQrisPage() {
  const [periode, setPeriode] = useState("monthly");
  const [staticData, setStaticData] = useState([]);
  const [depositData, setDepositData] = useState([]);
  const [merchantData, setMerchantData] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);
  const [loading, setLoading] = useState({
    merchant: false,
    static: false,
    deposit: false,
    comparison: false
  });

  const filters = [
    {
      label: "Periode",
      options: [
        { label: "Bulanan", value: "monthly" },
        { label: "Mingguan", value: "weekly" },
      ],
      value: periode,
      onChange: setPeriode,
    },
  ];

  const fetchMerchantData = () => {
    setLoading(prev => ({ ...prev, merchant: true }));
    getQrisChart({ period: periode })
      .then(res => {
        const arr = res.data.data?.chart_data || [];
        setMerchantData(arr.map(item => ({ x: item.label, y: item.value })));
      })
      .catch(() => setMerchantData([]))
      .finally(() => setLoading(prev => ({ ...prev, merchant: false })));
  };

  const fetchStaticData = () => {
    setLoading(prev => ({ ...prev, static: true }));
    getQrisStaticChart({ period: periode })
      .then(res => {
        const arr = res.data.data?.chart_data || [];
        setStaticData(arr.map(item => ({ x: item.label, y: item.value })));
      })
      .catch(() => setStaticData([]))
      .finally(() => setLoading(prev => ({ ...prev, static: false })));
  };

  const fetchDepositData = () => {
    setLoading(prev => ({ ...prev, deposit: true }));
    getQrisDepositChart({ period: periode })
      .then(res => {
        const arr = res.data.data?.chart_data || [];
        setDepositData(arr.map(item => ({ x: item.label, y: item.value })));
      })
      .catch(() => setDepositData([]))
      .finally(() => setLoading(prev => ({ ...prev, deposit: false })));
  };

  const fetchComparisonData = () => {
    setLoading(prev => ({ ...prev, comparison: true }));
    getQrisComparison()
      .then(res => {
        const data = res.data.data || {};
        setComparisonData([
          { name: 'QRIS Winpay', value: data.winpay || 0 },
          { name: 'QRIS Nobu', value: data.nobu || 0 }
        ]);
      })
      .catch(() => setComparisonData([]))
      .finally(() => setLoading(prev => ({ ...prev, comparison: false })));
  };

  const fetchAllData = () => {
    fetchMerchantData();
    fetchStaticData();
    fetchDepositData();
    fetchComparisonData();
  };

  useEffect(() => {
    fetchAllData();
    
    // Auto refresh setiap 10 detik
    const interval = setInterval(() => {
      fetchAllData();
    }, 10000);

    // Cleanup interval saat component unmount atau dependency berubah
    return () => clearInterval(interval);
  }, [periode]);

  const calculateTotal = (data) => {
    return data.reduce((sum, item) => sum + (item.y || 0), 0);
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-8 px-4 sm:px-0 mt-2">
      <div className="flex flex-row justify-between items-center mb-8 absolute top-[75px] right-[35px]">
        <RefreshButton onClick={fetchAllData} disabled={Object.values(loading).some(Boolean)} loading={Object.values(loading).some(Boolean)} />
      </div>

      <AreaGrafik
        totalLabel="NOMINAL TRANSAKSI QRIS"
        totalValue={<span>Rp {Number(calculateTotal(merchantData)).toLocaleString('id-ID')}</span>}
        filters={filters}
        data={merchantData}
        dataKeyX="x"
        dataKeyY="y"
        tooltipFormatter={(value, name, props) => [
          `Rp ${Number(value).toLocaleString('id-ID')}`,
          props?.payload?.x || name
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <QrisLineChart
          title="Transaksi QRIS Static"
          totalLabel="NOMINAL"
          totalValue={<span style={{ color: '#1EC98B' }}>Rp {Number(calculateTotal(staticData)).toLocaleString('id-ID')}</span>}
          filters={filters}
          data={staticData}
          tooltipFormatter={(value, name, props) => [
            `Rp ${Number(value).toLocaleString('id-ID')}`,
            props?.payload?.x || name
          ]}
          loading={loading.static}
        />

        <QrisLineChart
          title="Transaksi Deposit via QRIS"
          totalLabel="NOMINAL"
          totalValue={<span style={{ color: '#1EC98B' }}>Rp {Number(calculateTotal(depositData)).toLocaleString('id-ID')}</span>}
          filters={filters}
          data={depositData}
          tooltipFormatter={(value, name, props) => [
            `Rp ${Number(value).toLocaleString('id-ID')}`,
            props?.payload?.x || name
          ]}
          loading={loading.deposit}
          lineColor="#A347F9"
        />
      </div>
      <h1 className="text-2xl font-bold mb-2">Perbandingan QRIS Nobu & QRIS Winpay</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <QrisComparisonChart
          title="Perbandingan Transaksi"
          data={comparisonData}
        />
        <QrisComparisonChart
          title="Perbandingan Pendapatan"
          data={comparisonData}
        />
      </div>
    </div>
  );
} 