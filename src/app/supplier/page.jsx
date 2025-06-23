'use client'
import { useState, useEffect } from 'react';
import DynamicTable from '../../components/DynamicTable';
import { getSuppliers } from '@/services/suppliers';

const columns = [
  { key: 'no', label: 'No.' },
  { key: 'nama_supplier', label: 'Nama Supplier' },
  { key: 'kode_supplier', label: 'Kode Supplier' },
  { key: 'saldo_supplier', label: 'Saldo Supplier' },
  { key: 'status_server', label: 'Status Server' },
];

export default function SupplierPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getSuppliers({
      page,
      limit: pageSize,
    })
      .then(res => {
        const arr = res.data.data?.suppliers || [];
        setData(arr.map((item, idx) => ({
          no: item.no,
          nama_supplier: item.supplier_name || '-',
          kode_supplier: item.supplier_code || '-',
          saldo_supplier: '',
          status_server: item.server_status === 'Online'
            ? <span className="text-[#177F7E] font-medium">Online</span>
            : <span className="text-[#E53935] font-medium">Offline</span>
        })));
        setTotalData(res.data.data?.pagination?.total_data || arr.length);
      })
      .catch(() => {
        setData([]);
        setTotalData(0);
      })
      .finally(() => setLoading(false));
  }, [page, pageSize]);

  return (
    <div className="w-full max-w-6xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6">Supplier</h1>
      <DynamicTable
        columns={columns}
        data={data}
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
  );
} 