'use client'
import { useState, useEffect } from 'react';
import TableSupplier from '@/components/TableSupplier';
import { useRouter } from 'next/navigation';

export default function SupplierPage() {
  const [mode, setMode] = useState('normal');
  const [selected, setSelected] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalData, setTotalData] = useState(0);
  const router = useRouter();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/suppliers?search=${encodeURIComponent(search)}&limit=${pageSize}&page=${page}`);
      const json = await res.json();
      setData(json.data.suppliers || []);
      setTotalData(json.data.pagination.total_data || 0);
    } catch {
      setData([]);
      setTotalData(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, page, pageSize]);

  const handleCompare = () => {
    if (mode === 'normal') {
      setMode('compare');
      setSelected([]);
    } else {
      // Lakukan perbandingan
      if (selected.length >= 2) {
        router.push(`/supplier/compare?codes=${selected.join(',')}`);
      }
    }
  };

  const handleCancelCompare = () => {
    setMode('normal');
    setSelected([]);
  };

  const handleDetail = (item) => {
    router.push(`/supplier/detail/${item.supplier_code}`);
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-8">
      <div className="flex flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Supplier</h1>
      </div>
      <TableSupplier
        data={data}
        mode={mode}
        onCompare={handleCompare}
        onCancelCompare={handleCancelCompare}
        onDetail={handleDetail}
        onSearch={setSearch}
        onSelect={setSelected}
        selected={selected}
        loading={loading}
      />
      {/* Pagination (opsional) */}
      <div className="flex justify-end mt-4">
        <span className="mr-2">Halaman:</span>
        {[...Array(Math.ceil(totalData / pageSize)).keys()].map(i => (
          <button
            key={i}
            className={`px-2 py-1 mx-1 rounded ${page === i + 1 ? 'bg-teal-600 text-white' : 'bg-gray-100'}`}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
} 