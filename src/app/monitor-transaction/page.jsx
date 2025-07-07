'use client'
import AreaGrafik from "@/components/AreaGrafik";
import { useState, useEffect, useCallback } from "react";
import { getTransactionChart } from "@/services/monitor";
import { getProductsOptions } from '@/services/products';
import RefreshButton from '@/components/RefreshButton';
import Card from '@/components/Card';
import DynamicTable from '@/components/DynamicTable';
import { getMonitorTransactionList } from '@/services/monitor';

export default function MonitorTransactionPage() {
  const [periode, setPeriode] = useState("bulan");
  const [produk, setProduk] = useState("");
  const [produkOptions, setProdukOptions] = useState([]);
  const [produkReady, setProdukReady] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalValue, setTotalValue] = useState(0);
  const [rekap, setRekap] = useState({});
  const [tableData, setTableData] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [tablePagination, setTablePagination] = useState({ page: 1, totalPages: 1, pageSize: 10, totalData: 0 });
  const [tableSearch, setTableSearch] = useState('');

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
    fetchTable();
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

  // Ambil data rekap & tabel
  const fetchTable = useCallback((params = {}) => {
    setTableLoading(true);
    getMonitorTransactionList({
      page: params.page || tablePagination.page,
      limit: params.pageSize || tablePagination.pageSize,
      search: params.search || tableSearch,
    })
      .then(res => {
        const d = res.data.data || {};
        setRekap(d.recap || {});
        setTableData(d.transactions || []);
        setTablePagination({
          page: d.pagination?.current_page || 1,
          totalPages: d.pagination?.total_pages || 1,
          pageSize: d.pagination?.limit || 10,
          totalData: d.pagination?.total_data || 0,
        });
      })
      .finally(() => setTableLoading(false));
  }, [tablePagination.page, tablePagination.pageSize, tableSearch]);

  // useEffect(() => {
  //   fetchTable();
  // }, [fetchTable]);

  // Kolom tabel
  const columns = [
    { key: 'no', label: 'No.' },
    { key: 'id', label: 'ID' },
    { key: 'user', label: 'User' },
    { key: 'server', label: 'Server' },
    { key: 'provider', label: 'Provider' },
    { key: 'nominal', label: 'Nominal' },
    { key: 'phone_or_pln', label: 'No HP/ID PLN' },
    { key: 'price', label: 'Harga' },
    { key: 'payment', label: 'Pembayaran' },
    { key: 'purchase_date', label: 'Tgl. Pembelian' },
    { key: 'status', label: 'Status' },
  ];

  return (
    <div className="px-8 py-8">
      <div className="flex flex-row justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Monitor Transaksi</h1>
        <RefreshButton onClick={fetchData} disabled={loading} loading={loading} />
      </div>
      {/* Card Rekap */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card title="Total Transaksi Berhasil Hari Ini" value={`Rp ${Number(rekap.total_today_transaction || 0).toLocaleString('id-ID')}`} />
        <Card title="Total Pengguna Retail" value={rekap.total_retail_user || 0} />
        <Card title="Total Pengguna H2H" value={rekap.total_h2h_user || 0} />
        <Card title="Total Pendaftar Hari Ini" value={rekap.total_today_registration || 0} />
      </div>
      {/* Grafik */}
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
      {/* Table */}
      <div className="mt-8">
        <DynamicTable
          columns={columns}
          data={tableData}
          searchPlaceholder="Cari transaksi disini ..."
          onSearch={val => { setTableSearch(val); fetchTable({ search: val, page: 1 }); }}
          pagination={{
            page: tablePagination.page,
            totalPages: tablePagination.totalPages,
            pageSize: tablePagination.pageSize,
            onPageChange: (p) => { fetchTable({ page: p }); },
            onPageSizeChange: (s) => { fetchTable({ pageSize: s, page: 1 }); },
            totalData: tablePagination.totalData,
          }}
          loading={tableLoading}
        />
      </div>
    </div>
  );
} 