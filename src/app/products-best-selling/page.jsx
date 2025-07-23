'use client'
import { useEffect, useState } from "react";
import { getBestSellingProducts } from "@/services/products";
import BestSellingProductTable from "@/components/BestSellingProductTable";
import RefreshButton from '@/components/RefreshButton';

const kategoriOptions = [
  { label: "Semua kategori", value: "all" },
  { label: "E-Toll", value: "E-Toll" },
  // Tambahkan kategori lain jika ada di data
];

export default function ProductsBestSellingPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [kategori, setKategori] = useState("all");

  const fetchData = () => {
    setLoading(true);
    getBestSellingProducts({ search, category: kategori })
      .then(res => {
        setProducts(res.data.data?.products || []);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 10000);
    return () => clearInterval(interval);
  }, [search, kategori]);

  const columns = [
    { key: "rank", label: "Peringkat" },
    { key: "product_name", label: "Nama Produk" },
    { key: "sales", label: "Penjualan" },
    { key: "revenue", label: "Revenue" },
    { key: "growth", label: "Pertumbuhan" },
    { key: "diamond", label: "" },
  ];

  // Data asli sudah sesuai kebutuhan BestSellingProductTable (top 3 card + tabel sisanya)
  return (
    <div className="px-0 py-8">
      <div className="flex flex-row justify-between items-center mb-8 absolute top-[75px] right-[35px] ">
        {/* <h1 className="text-2xl font-bold">Produk Terlaris</h1> */}
        <RefreshButton onClick={fetchData} disabled={loading} loading={loading} />
      </div>
      <BestSellingProductTable
        columns={columns}
        data={products}
        searchPlaceholder="Cari produk terlaris"
        onSearch={setSearch}
        filters={[{
          label: "Semua kategori",
          options: kategoriOptions,
          value: kategori,
          onChange: setKategori,
        }]}
        headerClass="bg-white"
        rowClass={(row, idx) => idx < 3 ? 'bg-[#00B3FF]/[.05]' : ''}
      />
    </div>
  );
} 