'use client'
import Card from '../../components/Card';
import DynamicTable from '../../components/DynamicTable';
import { useState } from 'react';

// Dummy data card
const cards = [
  {
    icon: <svg width="28" height="28" fill="none" stroke="#F87171"><rect x="4" y="4" width="20" height="20" rx="6" strokeWidth="2"/><path d="M14 10v4" strokeWidth="2" strokeLinecap="round"/><circle cx="14" cy="18" r="1" fill="#F87171"/></svg>,
    title: 'Produk yang sering gagal',
    value: <span className="text-[#F87171] font-bold">Topup Game</span>,
  },
  {
    icon: <svg width="28" height="28" fill="none" stroke="#F87171"><circle cx="14" cy="14" r="10" strokeWidth="2"/><path d="M14 10v4" strokeWidth="2" strokeLinecap="round"/><circle cx="14" cy="18" r="1" fill="#F87171"/></svg>,
    title: 'Total Transaksi Gagal',
    value: 8,
  },
  {
    icon: <svg width="28" height="28" fill="none" stroke="#F87171"><rect x="4" y="4" width="20" height="20" rx="6" strokeWidth="2"/><path d="M10 14h8" strokeWidth="2"/></svg>,
    title: 'Total Nominal Transaksi Gagal',
    value: <span className="text-[#F87171] font-bold">Rp 4.000.000</span>,
  },
  {
    icon: <svg width="28" height="28" fill="none" stroke="#F87171"><rect x="4" y="4" width="20" height="20" rx="6" strokeWidth="2"/><path d="M14 10v8" strokeWidth="2"/></svg>,
    title: 'Total Produk',
    value: 4,
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
export default function TransactionFailPage() {
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
