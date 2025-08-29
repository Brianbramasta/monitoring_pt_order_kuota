'use client'
import Card from '../../components/Card';
import DynamicTable from '../../components/DynamicTable';
import { useState, useEffect, useRef } from 'react';
import { getFailedTransactions } from '@/services/transactions';
import dayjs from 'dayjs';
import RefreshButton from '@/components/RefreshButton';
import AreaGrafik from '../../components/AreaGrafik';
import BestSellingProductList from '../../components/BestSellingProductList';
import TotalTransactionBarChart from '../../components/charts/TotalTransactionBarChart';
import { io } from 'socket.io-client';

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
  const [selectedFilter, setSelectedFilter] = useState('4hours');
  const [chartData, setChartData] = useState([]);
  const [mostFailedProducts, setMostFailedProducts] = useState([]);
  const [topFailedPartners, setTopFailedPartners] = useState([]);
  const [totalFailedTransactionsDaily, setTotalFailedTransactionsDaily] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const socketRef = useRef(null);

  /**
 * Menghitung start_date dan end_date berdasarkan filter yang dipilih user.
 * @param {string} filter - Nilai filter yang dipilih (today, last_3_days, this_week, this_month)
 * @param {string} customStartDate - Tanggal mulai custom dari date picker
 * @param {string} customEndDate - Tanggal akhir custom dari date picker
 * @returns {{start_date: string, end_date: string}} - Objek berisi tanggal mulai dan akhir
 */
const getDateRange = (filter, customStartDate = null, customEndDate = null) => {
  // Jika ada custom date dari date picker, gunakan itu
  if (customStartDate && customEndDate) {
    return {
      start_date: dayjs(customStartDate).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
      end_date: dayjs(customEndDate).endOf('day').format('YYYY-MM-DD HH:mm:ss')
    };
  }

  // Jika date picker kosong, return null agar API tidak menggunakan filter tanggal
  if (!customStartDate && !customEndDate) {
    return { start_date: null, end_date: null };
  }

  const today = dayjs();
  let start_date = null;
  let end_date = null;
  switch (filter) {
    case '4hours':
      // start_date = today.subtract(4, 'hour').format('YYYY-MM-DD HH:mm:ss');
      // end_date = today.format('YYYY-MM-DD HH:mm:ss');
      break;
    case 'daily':
      // start_date = today.startOf('day').format('YYYY-MM-DD HH:mm:ss');
      // end_date = today.endOf('day').format('YYYY-MM-DD HH:mm:ss');
      break;
    case '3days':
      // start_date = today.subtract(3, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss');
      // end_date = today.endOf('day').format('YYYY-MM-DD HH:mm:ss');
      break;
    case 'weekly':
      // start_date = today.subtract(7, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss');
      // end_date = today.format('YYYY-MM-DD HH:mm:ss');
      break;
    case 'monthly':
      // start_date = today.subtract(1, 'month').startOf('day').format('YYYY-MM-DD HH:mm:ss');
      // end_date = today.format('YYYY-MM-DD HH:mm:ss');
      break;
    default:
      start_date = null;
      end_date = null;
  }
  return { start_date, end_date };
};

/**
 * Helper function untuk memproses data response dari WebSocket atau API fallback
 */
const processResponseData = (responseData) => {
  const arr = responseData?.transactions || [];
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
  setTotalData(responseData?.pagination?.total_data || arr.length);
  setRecap(responseData?.recap || {});
  setMostFailedProducts(responseData?.most_failed_products_daily || []);
  setTopFailedPartners(responseData?.top_failed_partners_daily || []);
  setTotalFailedTransactionsDaily(responseData?.total_failed_transactions_daily || []);
  setChartData(responseData?.chart_data || []);
};

/**
 * Helper function untuk reset data ketika terjadi error
 */
const resetData = () => {
  setData([]);
  setTotalData(0);
  setRecap({});
  setMostFailedProducts([]);
  setTopFailedPartners([]);
  setTotalFailedTransactionsDaily([]);
  setChartData([]);
};

/**
 * Mengambil data transaksi gagal melalui WebSocket atau fallback ke API
 */
const fetchData = () => {
  setLoading(true);
  const { start_date, end_date } = getDateRange(selectedFilter, startDate, endDate);
  
  // Jika WebSocket terhubung, gunakan WebSocket
  if (socketRef.current && connectionStatus === 'connected') {
    socketRef.current.emit('get-failed-data', {
      search,
      page,
      limit: pageSize,
      start_date,
      end_date,
      periode: selectedFilter,
    });
  } else {
    // Fallback ke API jika WebSocket tidak tersedia
    getFailedTransactions({
      search,
      page,
      limit: pageSize,
      start_date,
      end_date,
      periode: selectedFilter,
    })
      .then(res => {
        processResponseData(res.data.data);
      })
      .catch(() => {
        resetData();
      })
      .finally(() => setLoading(false));
  }
};

// Handler untuk mengubah filter
const handleFilterChange = (newFilter) => {
  setSelectedFilter(newFilter);
  // Date picker tetap kosong, user bisa memilih untuk mengisi manual atau biarkan kosong
};

useEffect(() => {
    // Inisialisasi WebSocket connection
    const initializeWebSocket = () => {
      try {
        socketRef.current = io('http://localhost:8080', {
          transports: ['websocket', 'polling'],
          timeout: 5000,
        });

        socketRef.current.on('connect', () => {
          console.log('WebSocket connected');
          setConnectionStatus('connected');
          // Fetch data pertama kali setelah terhubung
          fetchData();
        });

        socketRef.current.on('disconnect', () => {
          console.log('WebSocket disconnected');
          setConnectionStatus('disconnected');
        });

        socketRef.current.on('connect_error', (error) => {
          console.log('WebSocket connection error:', error);
          setConnectionStatus('error');
          // Fallback ke API jika WebSocket gagal
          fetchData();
        });

        // Listen untuk data response dari server
        socketRef.current.on('failed-data-response', (data) => {
          if (data.success) {
            processResponseData(data.data);
          } else {
            resetData();
          }
          setLoading(false);
        });

        // Listen untuk auto-update data setiap 10 detik dari server
        socketRef.current.on('failed-data-update', (data) => {
          if (data.success) {
            processResponseData(data.data);
          }
        });

      } catch (error) {
        console.error('Error initializing WebSocket:', error);
        setConnectionStatus('error');
        // Fallback ke API
        fetchData();
      }
    };

    initializeWebSocket();

    // Cleanup function
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  // Effect untuk fetch data ketika filter berubah
  useEffect(() => {
    if (connectionStatus === 'connected' || connectionStatus === 'error') {
      fetchData();
    }
  }, [search, page, pageSize, selectedFilter, startDate, endDate, connectionStatus]);

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
    label: 'Periode',
    options: [
      { value: '4hours', label: '4 Jam' },
      { value: 'daily', label: 'Harian' },
      { value: '3days', label: '3 Hari' },
      { value: 'weekly', label: 'Mingguan' },
      { value: 'monthly', label: 'Bulanan' },
    ],
    value: selectedFilter,
    onChange: handleFilterChange,
  },
];



  return (
    <div className="flex flex-col gap-4 sm:gap-8 px-4 sm:px-0 mt-2">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 absolute top-[75px] right-[35px] ">
        {/* <h1 className="text-xl sm:text-2xl font-bold">Transaksi Gagal</h1> */}
        <div className="flex-1 flex justify-end">
          <RefreshButton onClick={fetchData} disabled={loading} loading={loading} />
        </div>
        {/* Tambahan filter di atas untuk mobile jika diperlukan */}
      </div>

      {/* Card ringkasan */}
      <div
        className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-2"
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
          data={chartData.map(d => ({ x: d.label, y: d.value }))}
          dataKeyX="x"
          dataKeyY="y"
          tooltipFormatter={(value, name, props) => [value, props && props.payload && props.payload.x ? props.payload.x : name]}
          loading={loading}
          filters={filters}
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
      </div>

    
      {/* Section: Produk yang sering gagal & Mitra dengan transaksi gagal terbanyak */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
  <BestSellingProductList title="Produk yang sering gagal" products={mostFailedProducts.map(p => ({ product_name: p.product_name, sales: p.value }))} />
  <div className="w-full bg-white rounded-2xl p-6 flex flex-col items-start" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
    <div className="text-xl font-bold mb-4 text-center w-full">Mitra dengan transaksi gagal terbanyak</div>
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
{/* Section: Total Transaksi Gagal */}
<div className="my-4">
  <TotalTransactionBarChart
    title="Total Transaksi Gagal"
    totalLabel="Total Kegagalan"
    totalValue={totalFailedTransactionsDaily.reduce((a, b) => a + (b.total || 0), 0)}
    data={totalFailedTransactionsDaily}
  />
</div>
  {/* Table dan filter */}
  <div className="w-full overflow-hidden">
        <DynamicTable
          columns={columns}
          data={data}
          searchPlaceholder="Cari produk disini . . ."
          onSearch={setSearch}
          // filters={filters}
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
