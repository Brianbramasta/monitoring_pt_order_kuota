'use client'
import { useState, useEffect } from "react";
import { getQrisTransactions } from "@/services/monitor";
import dayjs from "dayjs";
import RefreshButton from '@/components/RefreshButton';
import AreaGrafik from "@/components/AreaGrafik";
import QrisLineChart from "@/components/QrisLineChart";
import QrisComparisonChart from "@/components/QrisComparisonChart";

export default function MonitorQrisPage() {
  const [selectedFilter, setSelectedFilter] = useState("4hours");
  const [staticData, setStaticData] = useState([]);
  const [depositData, setDepositData] = useState([]);
  const [merchantData, setMerchantData] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
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
        { value: '4hours', label: '4 Jam' },
        { value: 'daily', label: 'Harian' },
        { value: '3days', label: '3 Hari' },
        { value: 'weekly', label: 'Mingguan' },
        { value: 'monthly', label: 'Bulanan' },
      ],
      value: selectedFilter,
      onChange: setSelectedFilter,
    },
  ];

  const getDateRange = (filter, customStartDate = '', customEndDate = '') => {
    // If custom dates are provided, use them
    if (customStartDate && customEndDate) {
      return {
        start_date: dayjs(customStartDate).format('YYYY-MM-DD HH:mm:ss'),
        end_date: dayjs(customEndDate).format('YYYY-MM-DD HH:mm:ss')
      };
    }
    
    // If both custom dates are empty, return null to let API handle period filtering
    if (!customStartDate && !customEndDate) {
      return { start_date: null, end_date: null };
    }
    
    const today = dayjs();
    let start_date = null;
    let end_date = null;
    switch (filter) {
      case '4hours':
        start_date = today.subtract(4, 'hour').format('YYYY-MM-DD HH:mm:ss');
        end_date = today.format('YYYY-MM-DD HH:mm:ss');
        break;
      case 'daily':
        start_date = today.startOf('day').format('YYYY-MM-DD HH:mm:ss');
        end_date = today.endOf('day').format('YYYY-MM-DD HH:mm:ss');
        break;
      case '3days':
        start_date = today.subtract(3, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss');
        end_date = today.endOf('day').format('YYYY-MM-DD HH:mm:ss');
        break;
      case 'weekly':
        start_date = today.subtract(7, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss');
        end_date = today.format('YYYY-MM-DD HH:mm:ss');
        break;
      case 'monthly':
        start_date = today.subtract(1, 'month').startOf('day').format('YYYY-MM-DD HH:mm:ss');
        end_date = today.format('YYYY-MM-DD HH:mm:ss');
        break;
      default:
        start_date = null;
        end_date = null;
    }
    return { start_date, end_date };
  };

  const [transactionComparisonData, setTransactionComparisonData] = useState([]);
  const [revenueComparisonData, setRevenueComparisonData] = useState([]);

  const fetchAllData = () => {
    setLoading({
      merchant: true,
      static: true,
      deposit: true,
      comparison: true
    });

    const { start_date, end_date } = getDateRange(selectedFilter, startDate, endDate);
    getQrisTransactions({ period: selectedFilter, start_date, end_date })
      .then(res => {
        const data = res.data.data || {};
        
        // Update merchant chart data
        const merchantArr = data.merchant_chart || [];
        setMerchantData(merchantArr.map(item => ({ x: item.label, y: item.value })));

        // Update static chart data
        const staticArr = data.static_chart || [];
        setStaticData(staticArr.map(item => ({ x: item.label, y: item.value })));

        // Update deposit chart data
        const depositArr = data.deposit_chart || [];
        setDepositData(depositArr.map(item => ({ x: item.label, y: item.value })));

        // Update comparison data
        setTransactionComparisonData([
          { name: 'QRIS Winpay', value: data.comparison?.transactions?.winpay || 0 },
          { name: 'QRIS Nobu', value: data.comparison?.transactions?.nobu || 0 }
        ]);
        setRevenueComparisonData([
          { name: 'QRIS Winpay', value: data.comparison?.revenue?.winpay || 0 },
          { name: 'QRIS Nobu', value: data.comparison?.revenue?.nobu || 0 }
        ]);
      })
      .catch(() => {
        setMerchantData([]);
        setStaticData([]);
        setDepositData([]);
        setTransactionComparisonData([]);
        setRevenueComparisonData([]);
      })
      .finally(() => {
        setLoading({
          merchant: false,
          static: false,
          deposit: false,
          comparison: false
        });
      });
  };

  useEffect(() => {
    fetchAllData();
    
    // Auto refresh setiap 10 detik
    const interval = setInterval(() => {
      fetchAllData();
    }, 10000);

    // Cleanup interval saat component unmount atau dependency berubah
    return () => clearInterval(interval);
  }, [selectedFilter, startDate, endDate]);

  const calculateTotal = (data) => {
    return data.reduce((sum, item) => sum + (item.y || 0), 0);
  };

  const handleFilterChange = (newFilter) => {
    setSelectedFilter(newFilter);
    // Reset custom dates if switching away from custom filter
    if (newFilter !== 'custom') {
      setStartDate('');
      setEndDate('');
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-8 px-4 sm:px-0 mt-2">
      <div className="flex flex-row justify-between items-center mb-8 absolute top-[75px] right-[35px]">
        <RefreshButton onClick={fetchAllData} disabled={Object.values(loading).some(Boolean)} loading={Object.values(loading).some(Boolean)} />
      </div>

      <AreaGrafik
        title="Transaksi QRIS Merchant"
        totalLabel="NOMINAL"
        totalValue={<span style={{ color: '#1EC98B' }}>Rp {Number(calculateTotal(merchantData)).toLocaleString('id-ID')}</span>}
        loading={loading.merchant}
        filters={filters}
        data={merchantData}
        dataKeyX="x"
        dataKeyY="y"
        tooltipFormatter={(value, name, props) => [
          `Rp ${Number(value).toLocaleString('id-ID')}`,
          props?.payload?.x || name
        ]}
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onFilterChange={handleFilterChange}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <QrisLineChart
          title="Transaksi QRIS Static"
          totalLabel="NOMINAL"
          totalValue={<span style={{ color: '#1EC98B' }}>Rp {Number(calculateTotal(staticData)).toLocaleString('id-ID')}</span>}
          // filters={filters}
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
          // filters={filters}
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
          data={transactionComparisonData}
        />
        <QrisComparisonChart
          title="Perbandingan Pendapatan"
          data={revenueComparisonData}
        />
      </div>
    </div>
  );
}