import React from 'react';

const COLORS = ['#177F7E', '#FFD600'];

export default function BestSellingProductList({ title, products = [] }) {
  // Cari sales terbesar untuk persentase bar
  const maxSales = Math.max(...products.map(p => p.sales), 1);

  return (
    <div className="w-full bg-[#FAFAFB] rounded-2xl p-6 flex flex-col items-start" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
      <div className="text-xl font-bold mb-4 text-center w-full">{title}</div>
      <div className="w-full flex flex-col gap-4">
        {products.map((prod, idx) => (
          <div key={prod.product_name + idx} className="w-full">
            <div className="text-gray-700 text-base mb-1">{prod.product_name}</div>
            <div className="flex items-center w-full">
              <div className="flex-1 bg-gray-100 rounded-full h-3 relative mr-3">
                <div
                  className="h-3 rounded-full absolute top-0 left-0"
                  style={{
                    width: `${(prod.sales / maxSales) * 100}%`,
                    backgroundColor: COLORS[idx % COLORS.length],
                    transition: 'width 0.3s',
                  }}
                ></div>
              </div>
              <div className="text-gray-800 font-semibold ml-2 min-w-[60px] text-right">
                {prod.sales.toLocaleString('id-ID')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 