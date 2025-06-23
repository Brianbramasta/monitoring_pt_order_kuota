'use client'
import CardProduct from "@/components/CardProduct";
import { useEffect, useState } from "react";
import { getBestSellingProducts } from "@/services/products";

export default function ProductsBestSellingPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getBestSellingProducts({ limit: 10 })
      .then(res => {
        const arr = res.data.data?.products || [];
        setProducts(arr.map((item, idx) => ({
          nomor: (idx + 1).toString().padStart(2, "0"),
          iconDiamond: item.icon_diamond || { show: false },
          namaProduk: item.product_name || '-',
          nominalTerjual: item.nominal_sold || '-',
          iconProduk: item.icon_product || '',
        })));
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="px-8 py-8">
      <h1 className="text-2xl font-bold mb-8">Produk Terlaris</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {loading ? (
          <div className="col-span-full text-center">Loading...</div>
        ) : (
          products.map((p, i) => (
            <CardProduct
              key={i}
              nomor={p.nomor}
              iconDiamond={p.iconDiamond}
              namaProduk={p.namaProduk}
              nominalTerjual={p.nominalTerjual}
              iconProduk={p.iconProduk}
            />
          ))
        )}
      </div>
    </div>
  );
} 