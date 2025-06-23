'use client'
import { useState } from 'react';
import DynamicTable from '../../components/DynamicTable';

const allSuppliers = [
  { no: '01', nama_supplier: 'PT ABC Jaya', kode_supplier: 'TRX001', saldo_supplier: 'Rp 1.200.000', status_server: 'Stabil' },
  { no: '02', nama_supplier: 'PT Mukti Sarjana', kode_supplier: 'TRX002', saldo_supplier: 'Rp 14.000.000', status_server: 'Down' },
  { no: '03', nama_supplier: 'PT Bangkita Pratama', kode_supplier: 'TRX003', saldo_supplier: 'Rp 11.000.000', status_server: 'Stabil' },
  { no: '04', nama_supplier: 'PT Murni Kerja', kode_supplier: 'TRX004', saldo_supplier: 'Rp 6.000.000', status_server: 'Stabil' },
  { no: '05', nama_supplier: 'PT Maju Bersama', kode_supplier: 'TRX005', saldo_supplier: 'Rp 31.200.000', status_server: 'Down' },
  { no: '06', nama_supplier: 'PT Kreasi Negeri', kode_supplier: 'TRX006', saldo_supplier: 'Rp 1.200.000', status_server: 'Stabil' },
];

const columns = [
  { key: 'no', label: 'No.' },
  { key: 'nama_supplier', label: 'Nama Supplier' },
  { key: 'kode_supplier', label: 'Kode Supplier' },
  { key: 'saldo_supplier', label: 'Saldo Supplier' },
  { key: 'status_server', label: 'Status Server' },
];

export default function SupplierPage() {
  const [page, setPage] = useState(2);
  const [pageSize, setPageSize] = useState(10);

  // Data untuk halaman ini (dummy, karena hanya 6 data)
  const data = allSuppliers;

  // Custom render status
  const renderData = data.map(row => ({
    ...row,
    status_server: row.status_server === 'Stabil'
      ? <span className="text-[#177F7E] font-medium">Stabil</span>
      : <span className="text-[#E53935] font-medium">Down</span>
  }));

  return (
    <div className="w-full max-w-6xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6">Supplier</h1>
      <DynamicTable
        columns={columns}
        data={renderData}
        pagination={{
          page,
          totalPages: 5,
          onPageChange: setPage,
          pageSize,
          onPageSizeChange: setPageSize,
          totalData: 50,
        }}
      />
    </div>
  );
} 