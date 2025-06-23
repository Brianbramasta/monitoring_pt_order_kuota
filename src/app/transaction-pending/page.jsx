'use client'
import Card from '../../components/Card';
import DynamicTable from '../../components/DynamicTable';
import { useState } from 'react';

// Dummy data card
const cards = [
  {
    icon: <div className='w-[34px] h-[34px] rounded-full bg-[#EEEEEE] flex items-center justify-center'><img src='/icon/card/pending/icon-1.svg'/></div>,
    title: 'Produk yang sering Pending',
    value: <span className="text-[#222222] font-bold">Topup Game</span>,
  },
  {
    icon: <div className='w-[34px] h-[34px] rounded-full bg-[#EEEEEE] flex items-center justify-center'><img src='/icon/card/pending/icon-2.svg'/></div>,
    title: 'Total Transaksi Pending',
    value:<span className="text-[#222222] font-bold">8</span>,
  },
  {
    icon: <div className='w-[34px] h-[34px] rounded-full bg-[#EEEEEE] flex items-center justify-center'><img src='/icon/card/pending/icon-3.svg'/></div>,
    title: 'Total Nominal Transaksi Pending',
    value: <span className="text-[#222222] font-bold">Rp 4.000.000</span>,
  },
  {
    icon: <div className='w-[34px] h-[34px] rounded-full bg-[#EEEEEE] flex items-center justify-center'><img src='/icon/card/pending/icon-1.svg'/></div>,
    title: 'Total Produk',
    value: <span className="text-[#222222] font-bold">4</span>,
  },
];

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
const data = [
  { no: '01', tanggal: '14 Juni 2025', nama_produk: 'Pulsa Telkomsel 5rb', nama_supplier: 'PT. Mulya Kencana', kode_produk: 'GA0001', harga: 'Rp 5.000', jumlah: 20 },
  { no: '02', tanggal: '14 Juni 2025', nama_produk: 'Pulsa Telkomsel 10rb', nama_supplier: 'PT. Mulya Kencana', kode_produk: 'QW0008', harga: 'Rp 12.000', jumlah: 40 },
  { no: '03', tanggal: '14 Juni 2025', nama_produk: 'Pulsa Telkomsel 15rb', nama_supplier: 'PT. Mulya Kencana', kode_produk: 'AB0004', harga: 'Rp 17.000', jumlah: 23 },
  { no: '04', tanggal: '14 Juni 2025', nama_produk: 'Pulsa Telkomsel 20rb', nama_supplier: 'PT. Mulya Kencana', kode_produk: 'PC0002', harga: 'Rp 22.000', jumlah: 49 },
];

/**
 * Halaman Transaksi Gagal
 * Menampilkan card ringkasan, search, filter, dan tabel transaksi gagal
 */
export default function TransactionPendingPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(2);
  const [pageSize, setPageSize] = useState(10);

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
        <h1 className="text-xl sm:text-2xl font-bold">Transaksi Pending</h1>
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
            totalPages: 5,
            onPageChange: setPage,
            pageSize,
            onPageSizeChange: setPageSize,
            totalData: 40,
          }}
        />
      </div>
    </div>
  );
}
