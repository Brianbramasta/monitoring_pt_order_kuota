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
      label: "Nama Produk",
      options: produkOptions,
      value: produk,
      onChange: setProduk,
      type: "search"
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

  // Array cards rekap
  const cards = [
    {
      icon: <div className='w-[34px] h-[34px] rounded-full bg-[#EEEEEE] flex items-center justify-center'><svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 4.5L6.75 12.75L3 9" stroke="#222222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      </div>,
      title: 'Total Transaksi Berhasil Hari Ini',
      value: <span className="text-[#000] font-bold">Rp {Number(rekap.total_today_transaction || 0).toLocaleString('id-ID')}</span>,
    },
    {
      icon: <div className='w-[34px] h-[34px] rounded-full bg-[#EEEEEE] flex items-center justify-center'><svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_276_56)">
      <path d="M12.75 15.75V14.25C12.75 13.4544 12.4339 12.6913 11.8713 12.1287C11.3087 11.5661 10.5456 11.25 9.75 11.25H3.75C2.95435 11.25 2.19129 11.5661 1.62868 12.1287C1.06607 12.6913 0.75 13.4544 0.75 14.25V15.75" stroke="#222222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M6.75 8.25C8.40685 8.25 9.75 6.90685 9.75 5.25C9.75 3.59315 8.40685 2.25 6.75 2.25C5.09315 2.25 3.75 3.59315 3.75 5.25C3.75 6.90685 5.09315 8.25 6.75 8.25Z" stroke="#222222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M17.25 15.7502V14.2502C17.2495 13.5855 17.0283 12.9397 16.621 12.4144C16.2138 11.889 15.6436 11.5138 15 11.3477" stroke="#222222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M12 2.34766C12.6453 2.51288 13.2173 2.88818 13.6257 3.41439C14.0342 3.9406 14.2559 4.58778 14.2559 5.25391C14.2559 5.92003 14.0342 6.56722 13.6257 7.09342C13.2173 7.61963 12.6453 7.99493 12 8.16016" stroke="#222222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      <defs>
      <clipPath id="clip0_276_56">
      <rect width="18" height="18" fill="white"/>
      </clipPath>
      </defs>
      </svg>
      </div>,
      title: 'Total Pengguna Retail',
      value: <span className="text-[#000] font-bold">{rekap.total_retail_user || 0}</span>,
    },
    {
      icon: <div className='w-[34px] h-[34px] rounded-full bg-[#EEEEEE] flex items-center justify-center'><svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 15.75V14.25C15 13.4544 14.6839 12.6913 14.1213 12.1287C13.5587 11.5661 12.7956 11.25 12 11.25H6C5.20435 11.25 4.44129 11.5661 3.87868 12.1287C3.31607 12.6913 3 13.4544 3 14.25V15.75" stroke="#222222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M9 8.25C10.6569 8.25 12 6.90685 12 5.25C12 3.59315 10.6569 2.25 9 2.25C7.34315 2.25 6 3.59315 6 5.25C6 6.90685 7.34315 8.25 9 8.25Z" stroke="#222222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      </div>,
      title: 'Total Pengguna H2H',
      value: <span className="text-[#000] font-bold">{rekap.total_h2h_user || 0}</span>,
    },
    {
      icon: <div className='w-[34px] h-[34px] rounded-full bg-[#EEEEEE] flex items-center justify-center'><svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_276_51)">
      <path d="M12 15.75V14.25C12 13.4544 11.6839 12.6913 11.1213 12.1287C10.5587 11.5661 9.79565 11.25 9 11.25H3.75C2.95435 11.25 2.19129 11.5661 1.62868 12.1287C1.06607 12.6913 0.75 13.4544 0.75 14.25V15.75" stroke="#222222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M6.375 8.25C8.03185 8.25 9.375 6.90685 9.375 5.25C9.375 3.59315 8.03185 2.25 6.375 2.25C4.71815 2.25 3.375 3.59315 3.375 5.25C3.375 6.90685 4.71815 8.25 6.375 8.25Z" stroke="#222222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M12.75 8.25L14.25 9.75L17.25 6.75" stroke="#222222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      <defs>
      <clipPath id="clip0_276_51">
      <rect width="18" height="18" fill="white"/>
      </clipPath>
      </defs>
      </svg>
      </div>,
      title: 'Total Pendaftar Hari Ini',
      value: <span className="text-[#000] font-bold">{rekap.total_today_registration || 0}</span>,
    },
  ];

  return (
    <div className="flex flex-col gap-4 sm:gap-8 px-4 sm:px-0">
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-2xl font-bold">Monitor Transaksi</h1>
        <RefreshButton onClick={fetchData} disabled={loading} loading={loading} />
      </div>
      
      {/* Card ringkasan */}
      <div
        className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
        style={{
          backgroundColor:'black',
          backgroundImage: 'url("/bg/background.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '16px',
          padding: '25px 21px',
        }}
      >
        <h2
          className="col-span-4 "
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 600,
            fontSize: '16px',
            lineHeight: '160%',
            letterSpacing: 0,
            color: '#fff',
          }}
        >
          Rekap Transaksi
        </h2>
        {cards.map((card, idx) => (
          <Card key={idx} icon={card.icon} title={card.title} value={card.value} />
        ))}
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
          customCellRender={(col, row) => {
            if (col.key === 'status') {
              return (
                <span
                  style={{
                    background: '#177F7E',
                    color: '#fff',
                    borderRadius: 12,
                    padding: '4px 16px',
                    display: 'inline-block',
                    minWidth: 32,
                    textAlign: 'center',
                    fontWeight: 600,
                    letterSpacing: 1,
                  }}
                >
                  {row[col.key]}
                </span>
              );
            }
            return undefined;
          }}
        />
      </div>
    </div>
  );
} 