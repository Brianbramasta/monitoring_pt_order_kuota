'use client'
import Card from '../../components/Card';
import DynamicTable from '../../components/DynamicTable';
import { useState, useEffect } from 'react';
import { getFailedTransactions } from '@/services/transactions';
import dayjs from 'dayjs';

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
  
  // Auto refresh setiap 10 detik
  const interval = setInterval(() => {
    fetchData();
  }, 10000);

  // Cleanup interval saat component unmount atau dependency berubah
  return () => clearInterval(interval);
}, [search, page, pageSize, selectedFilter]);

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

  return (
    <div className="flex flex-col gap-4 sm:gap-8 px-4 sm:px-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-bold">Transaksi Gagal</h1>
        {/* Tambahan filter di atas untuk mobile jika diperlukan */}
      </div>

      {/* Card ringkasan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {cards.map((card, idx) => (
          <Card key={idx} icon={card.icon} title={card.title} value={card.value} />
        ))}
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
