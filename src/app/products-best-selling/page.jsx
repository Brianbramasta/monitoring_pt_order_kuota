'use client'
import { useEffect, useState } from "react";
import { getBestSellingProducts } from "@/services/products";
import DynamicTable from "@/components/DynamicTable";
import RefreshButton from '@/components/RefreshButton';

const kategoriOptions = [
  { label: "Semua kategori", value: "all" },
  { label: "E-Toll", value: "E-Toll" },
  // Tambahkan kategori lain jika ada di data
];

const rankColors = ["#00D89E", "#FF414D", "#5CE5DF"];

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

  // Mapping data untuk table
  const tableData = products.map((item, idx) => ({
    rank: (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 32,
        height: 32,
        borderRadius: '50%',
        background: rankColors[idx] || '',
        color: idx<3?'#fff':'#ABABAB',
        fontWeight: 700,
        fontSize: 16,
      }}>{item.rank}</span>
    ),
    product_name: (
      <div className="flex items-center gap-2">
        <img src={item.icon_product} alt="produk" className="w-8 h-8" />
        <div>
          <div className="font-semibold">{item.product_name}</div>
          <div className="text-xs text-gray-400">{item.category}</div>
        </div>
      </div>
    ),
    sales: item.sales.toLocaleString("id-ID"),
    revenue: `Rp ${item.revenue.toLocaleString("id-ID")}`,
    growth: (
      <span className={item.growth >= 0 ? "text-green-600 flex items-center gap-1" : "text-red-500 flex items-center gap-1"}>
        {item.growth >= 0 ? (
          <>
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 5L5 1L1 5" stroke="#177F7E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            +{Math.round(item.growth * 100)}%
          </>
        ) : (
          <>
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 1L5 5L1 1" stroke="#FF0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            {Math.round(item.growth * 100)}%
          </>
        )}
      </span>
    ),
    diamond: item.icon_diamond ? <img src={item.icon_diamond} alt="diamond" className="w-7 h-7 mx-auto" /> : null,
  }));

  // Semua baris data warna biru muda opacity 5%
  const rowClass = () => 'bg-[#00B3FF]/[.05]';

  return (
    <div className="px-8 py-8">
      <div className="flex flex-row justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Produk Terlaris</h1>
        <RefreshButton onClick={fetchData} disabled={loading} loading={loading} />
      </div>
      <DynamicTable
        columns={columns}
        data={tableData}
        searchPlaceholder="Cari produk terlaris"
        onSearch={setSearch}
        filters={[{
          label: "Semua kategori",
          options: kategoriOptions,
          value: kategori,
          onChange: setKategori,
        }]}
        headerClass="bg-white"
        rowClass={rowClass}
      />
    </div>
  );
} 