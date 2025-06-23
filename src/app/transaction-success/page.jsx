'use client'
import Card from '../../components/Card';
import DynamicTable from '../../components/DynamicTable';
import { useState, useEffect } from 'react';
import { getSuccessTransactions } from '@/services/transactions';

// Dummy data card (bisa diganti dengan data summary dari API jika ada endpointnya)
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
export default function TransactionSuccessPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(false);
  const [recap, setRecap] = useState({});

  useEffect(() => {
    setLoading(true);
    getSuccessTransactions({
      search,
      page,
      limit: pageSize,
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
  }, [search, page, pageSize]);

  const cards = [
    {
      icon: <div className='w-[34px] h-[34px] rounded-full bg-[#EAF6F6] flex items-center justify-center'><img src='/icon/card/success/icon-1.svg'/></div>,
      title: 'Produk yang sering Sukses',
      value: <span className="text-[#222222] font-bold">{recap.most_successful_product_name || '-'}</span>,
    },
    {
      icon: <div className='w-[34px] h-[34px] rounded-full bg-[#EAF6F6] flex items-center justify-center'><img src='/icon/card/success/icon-2.svg'/></div>,
      title: 'Total Transaksi Sukses',
      value:<span className="text-[#222222] font-bold">{recap.total_successful_transactions || 0}</span>,
    },
    {
      icon: <div className='w-[34px] h-[34px] rounded-full bg-[#EAF6F6] flex items-center justify-center'><img src='/icon/card/success/icon-3.svg'/></div>,
      title: 'Total Nominal Transaksi Sukses',
      value: <span className="text-[#222222] font-bold">Rp {recap.total_successful_nominal?.toLocaleString('id-ID') || 0}</span>,
    },
    {
      icon: <div className='w-[34px] h-[34px] rounded-full bg-[#EAF6F6] flex items-center justify-center'><img src='/icon/card/success/icon-1.svg'/></div>,
      title: 'Total Produk',
      value: <span className="text-[#222222] font-bold">{recap.total_products || 0}</span>,
    },
  ];

  // Filter dummy
  const filters = [
    {
      label: 'Transaksi Hari ini',
      options: [
        { value: 'today', label: 'Transaksi Hari ini' },
        { value: 'all', label: 'Semua' },
      ],
      value: 'today',
      onChange: () => {},
    },
  ];

 

  return (
    <div className="flex flex-col gap-4 sm:gap-8 px-4 sm:px-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-bold">Transaksi Sukses</h1>
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
