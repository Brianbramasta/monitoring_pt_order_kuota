'use client'
import Card from '../../components/Card';
import DynamicTable from '../../components/DynamicTable';
import { useState, useEffect } from 'react';
import { getFailedTransactions } from '@/services/transactions';
import dayjs from 'dayjs';
import RefreshButton from '@/components/RefreshButton';
import AreaGrafik from '../../components/AreaGrafik';
import BestSellingProductList from '../../components/BestSellingProductList';
import TotalTransactionBarChart from '../../components/charts/TotalTransactionBarChart';

// Dummy data card


// Dummy data table
const columns = [
  { key: 'no', label: 'No.' },
  { key: 'tanggal', label: 'Tanggal' },
  { key: 'nama_produk', label: 'Nama Produk' },
  { key: 'nama_supplier', label: 'Nama Supplier' },
  { key: 'kode_produk', label: 'Kode Produk' },
  { key: 'harga', label: 'Harga' },
  { key: 'jumlah', label: 'Jumlah Transaksi' },
  { key: 'void', label: 'Void' },
];



/**
 * Halaman Transaksi Gagal
 * Menampilkan card ringkasan, search, filter, dan tabel transaksi gagal
 */
export default function TransactionFailPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(false);
  const [recap, setRecap] = useState({});
  const [selectedFilter, setSelectedFilter] = useState('today');
  const [chartPeriod, setChartPeriod] = useState('monthly');
  const [chartData, setChartData] = useState([]);
  const [loadingChart, setLoadingChart] = useState(false);
  const [mostFailedProducts, setMostFailedProducts] = useState([]);
  const [topFailedPartners, setTopFailedPartners] = useState([]);
  const [totalFailedTransactionsDaily, setTotalFailedTransactionsDaily] = useState([]);

  /**
 * Menghitung start_date dan end_date berdasarkan filter yang dipilih user.
 * @param {string} filter - Nilai filter yang dipilih (today, last_3_days, this_week, this_month)
 * @returns {{start_date: string, end_date: string}} - Objek berisi tanggal mulai dan akhir
 */
const getDateRange = (filter) => {
  const today = dayjs();
  let start_date = null;
  let end_date = null;
  switch (filter) {
    case 'today':
      start_date = today.format('YYYY-MM-DD');
      end_date = today.format('YYYY-MM-DD');
      break;
    case 'last_3_days':
      start_date = today.subtract(2, 'day').format('YYYY-MM-DD');
      end_date = today.format('YYYY-MM-DD');
      break;
    case 'this_week':
      start_date = today.startOf('week').add(1, 'day').format('YYYY-MM-DD'); // Senin
      end_date = today.format('YYYY-MM-DD');
      break;
    case 'this_month':
      start_date = today.startOf('month').format('YYYY-MM-DD');
      end_date = today.format('YYYY-MM-DD');
      break;
    default:
      start_date = null;
      end_date = null;
  }
  return { start_date, end_date };
};

/**
 * Mengambil data transaksi gagal dari API sesuai filter, pencarian, dan pagination.
 * Otomatis mengatur loading, data, totalData, dan recap.
 */
const fetchData = () => {
  setLoading(true);
  const { start_date, end_date } = getDateRange(selectedFilter);
  getFailedTransactions({
    search,
    page,
    limit: pageSize,
    start_date,
    end_date,
  })
    .then(res => {
      const arr = res.data.data?.transactions || [];
      setData(arr.map((item, idx) => ({
        no: item.no,
        tanggal: item.date || '-',
        nama_produk: item.product_name || '-',
        nama_supplier: item.supplier_name || '-',
        kode_produk: item.product_code || '-',
        harga: item.price || '-',
        jumlah: item.quantity || '-',
        void: item.void || '-',
      })));
      setTotalData(res.data.data?.pagination?.total_data || arr.length);
      setRecap(res.data.data?.recap || {});
      setMostFailedProducts(res.data.data?.most_failed_products_daily || []);
      setTopFailedPartners(res.data.data?.top_failed_partners_daily || []);
      setTotalFailedTransactionsDaily(res.data.data?.total_failed_transactions_daily || []);
    })
    .catch(() => {
      setData([]);
      setTotalData(0);
      setRecap({});
      setMostFailedProducts([]);
      setTopFailedPartners([]);
      setTotalFailedTransactionsDaily([]);
    })
    .finally(() => setLoading(false));
};

useEffect(() => {
    fetchData();
    fetchChart();
    // Auto refresh setiap 10 detik
    const interval = setInterval(() => {
      fetchData();
      fetchChart();
    }, 10000);
    return () => clearInterval(interval);
  }, [search, page, pageSize, selectedFilter, chartPeriod]);

const cards = [
  {
    icon: <div className='w-[34px] h-[34px] rounded-full bg-[#FFEAEA] flex items-center justify-center'><img src='/icon/card/fail/icon-1.svg'/></div>,
    title: 'Produk yang sering gagal',
    value: <span className="text-[#F87171] font-bold">{recap.most_failed_product_name || '-'}</span>,
  },
  {
    icon: <div className='w-[34px] h-[34px] rounded-full bg-[#FFEAEA] flex items-center justify-center'><img src='/icon/card/fail/icon-2.svg'/></div>,
    title: 'Total Transaksi Gagal',
    value:<span className="text-[#F87171] font-bold">{recap.total_failed_transactions || 0}</span>,
  },
  {
    icon: <div className='w-[34px] h-[34px] rounded-full bg-[#FFEAEA] flex items-center justify-center'><img src='/icon/card/fail/icon-3.svg'/></div>,
    title: 'Total Nominal Transaksi Gagal',
    value: <span className="text-[#F87171] font-bold">Rp {recap.total_failed_nominal?.toLocaleString('id-ID') || 0}</span>,
  },
  {
    icon: <div className='w-[34px] h-[34px] rounded-full bg-[#FFEAEA] flex items-center justify-center'><img src='/icon/card/fail/icon-1.svg'/></div>,
    title: 'Total Produk',
    value: <span className="text-[#F87171] font-bold">{recap.total_products || 0}</span>,
  },
];

// Filter sesuai gambar
const filters = [
  {
    label: 'Transaksi Hari ini',
    options: [
      { value: 'today', label: 'Transaksi Hari ini' },
      { value: 'last_3_days', label: '3 Hari terakhir' },
      { value: 'this_week', label: 'Minggu ini' },
      { value: 'this_month', label: 'Bulan ini' },
    ],
    value: selectedFilter,
    onChange: setSelectedFilter,
  },
];

// Grafik Area
const chartFilters = [
  {
    label: 'Periode',
    options: [
      { label: 'Harian', value: 'daily' },
      { label: 'Mingguan', value: 'weekly' },
      { label: 'Bulanan', value: 'monthly' },
    ],
    value: chartPeriod,
    onChange: setChartPeriod,
  },
];

// Fetch chart data
const fetchChart = () => {
  setLoadingChart(true);
  fetch(`/api/v1/transactions/failed/chart?period=${chartPeriod}`)
    .then(res => res.json())
    .then(json => setChartData(json.data.chart_data || []))
    .catch(() => setChartData([]))
    .finally(() => setLoadingChart(false));
};


  return (
    <div className="flex flex-col gap-4 sm:gap-8 px-4 sm:px-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-bold">Transaksi Gagal</h1>
        <div className="flex-1 flex justify-end">
          <RefreshButton onClick={fetchData} disabled={loading} loading={loading} />
        </div>
        {/* Tambahan filter di atas untuk mobile jika diperlukan */}
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

      {/* Grafik Area */}
      <div className="my-4">
        <AreaGrafik
          totalLabel="TOTAL TRANSAKSI"
          totalValue={chartData.reduce((a, b) => a + b.value, 0).toLocaleString('id-ID')}
          filters={chartFilters}
          data={chartData.map(d => ({ x: d.label, y: d.value }))}
          dataKeyX="x"
          dataKeyY="y"
          tooltipFormatter={(value, name, props) => [value, props && props.payload && props.payload.x ? props.payload.x : name]}
          loading={loadingChart}
        />
      </div>

      {/* Table dan filter */}
      <div className="w-full overflow-hidden">
        <DynamicTable
          columns={columns}
          data={data}
          searchPlaceholder="Cari produk disini . . ."
          onSearch={setSearch}
          filters={filters}
          pagination={{
            page,
            totalPages: Math.ceil(totalData / pageSize),
            onPageChange: setPage,
            pageSize,
            onPageSizeChange: setPageSize,
            totalData,
          }}
          loading={loading}
        />
      </div>
      {/* Section: Produk yang sering gagal (perhari) & Mitra dengan transaksi gagal terbanyak (perhari) */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
  <BestSellingProductList title="Produk yang sering gagal (perhari)" products={mostFailedProducts.map(p => ({ product_name: p.product_name, sales: p.value }))} />
  <div className="w-full bg-white rounded-2xl p-6 flex flex-col items-start" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
    <div className="text-xl font-bold mb-4 text-center w-full">Mitra dengan transaksi gagal terbanyak (perhari)</div>
    <DynamicTable
      columns={[
        { key: 'no', label: 'No.' },
        { key: 'partner_name', label: 'Nama Mitra' },
        { key: 'total_failed_transactions', label: 'Total Transaksi Gagal' },
      ]}
      data={topFailedPartners}
      searchPlaceholder={null}
      onSearch={null}
      filters={[]}
      pagination={false}
      loading={loading}
    />
  </div>
</div>
{/* Section: Total Transaksi Gagal (perhari) */}
<div className="my-4">
  <TotalTransactionBarChart
    title="Total Transaksi Gagal (perhari)"
    totalLabel="Total Kegagalan"
    totalValue={totalFailedTransactionsDaily.reduce((a, b) => a + (b.total || 0), 0)}
    data={totalFailedTransactionsDaily}
  />
</div>
    </div>
  );
}
