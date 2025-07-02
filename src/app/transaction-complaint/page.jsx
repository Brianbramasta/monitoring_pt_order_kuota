'use client'
import Card from '../../components/Card';
import DynamicTable from '../../components/DynamicTable';
import { useState, useEffect } from 'react';
import { getComplaintTransactions } from '@/services/transactions';
import dayjs from 'dayjs';
import RefreshButton from '@/components/RefreshButton';
import AreaGrafik from '../../components/AreaGrafik';



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
export default function TransactionComplaintPage() {
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
   * Mengambil data komplain transaksi dari API sesuai filter, pencarian, dan pagination.
   * Otomatis mengatur loading, data, totalData, dan recap.
   */
  const fetchData = () => {
    setLoading(true);
    const { start_date, end_date } = getDateRange(selectedFilter);
    getComplaintTransactions({
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
      })
      .catch(() => {
        setData([]);
        setTotalData(0);
        setRecap({});
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

  // Dummy data card
const cards = [
  {
    icon: <div className='w-[34px] h-[34px] rounded-full bg-[#EAF6F6] flex items-center justify-center'><img src='/icon/card/success/icon-1.svg'/></div>,
    title: 'Total Komplain Transaksi',
    value: <span className="text-[#222222] font-bold">{recap.total_complaint_transactions || 0}</span>,
  },
  {
    icon: <div className='w-[34px] h-[34px] rounded-full bg-[#EAF6F6] flex items-center justify-center'><img src='/icon/card/success/icon-3.svg'/></div>,
    title: 'Total Nominal Komplain',
    value: <span className="text-[#222222] font-bold">Rp {recap.total_complaint_nominal?.toLocaleString('id-ID') || 0}</span>,
  },
  {
    icon: <div className='w-[34px] h-[34px] rounded-full bg-[#EAF6F6] flex items-center justify-center'><img src='/icon/card/success/icon-2.svg'/></div>,
    title: 'Total pesan CS yang belum terbaca',
    value: <span className="text-[#222222] font-bold">{recap.total_unread_cs_messages || 0} pesan.</span>,
  }
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

  // Filter chart
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
    fetch(`/api/v1/transactions/complaints/chart?period=${chartPeriod}`)
      .then(res => res.json())
      .then(json => setChartData(json.data.chart_data || []))
      .catch(() => setChartData([]))
      .finally(() => setLoadingChart(false));
  };


  return (
    <div className="flex flex-col gap-4 sm:gap-8 px-4 sm:px-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-bold">Komplain Transaksi</h1>
        <div className="flex-1 flex justify-end">
          <RefreshButton onClick={fetchData} disabled={loading} loading={loading} />
        </div>
        {/* Tambahan filter di atas untuk mobile jika diperlukan */}
      </div>

      {/* Card ringkasan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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
    </div>
  );
}
