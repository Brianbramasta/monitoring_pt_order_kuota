import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// Custom tooltip untuk menampilkan persentase
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { value, payload: data } = payload[0];
    const total = data.total;
    const percent = ((value / total) * 100).toFixed(1);
    return (
      <div className="bg-white rounded-lg shadow px-3 py-2 border text-sm font-medium text-gray-700">
        {data.name}: {percent}%
      </div>
    );
  }
  return null;
};

export default function DonutChart({ data = [], colors = ["#177F7E", "#FFD600", "#E53935"], title, showLegend = false, legendLabels }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  // Tambahkan total ke setiap data agar bisa diakses di tooltip
  const chartData = data.map(d => ({ ...d, total }));

  // Default legend jika tidak ada legendLabels
  const defaultLegend = [
    { label: 'Transaksi Berhasil', color: '#177F7E' },
    { label: 'Transaksi Pending', color: '#FFD600' },
    { label: 'Transaksi Gagal', color: '#E53935' }
  ];
  const legend = legendLabels && legendLabels.length > 0 ? legendLabels : defaultLegend;

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl p-8 flex flex-col items-center" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
      {title && <div className="text-xl font-bold text-center mb-6">{title}</div>}
      <div className="relative w-full flex justify-center items-center" style={{ height: 260 }}>
        <ResponsiveContainer width={220} height={220}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              stroke="none"
              label={false}
            >
              {chartData.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={colors[idx % colors.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {showLegend && (
        <div className="flex flex-row justify-center items-center gap-8 mt-8 flex-wrap">
          {legend.map((item, idx) => (
            <div key={item.label + idx} className="flex items-center gap-2">
              <span className="inline-block w-5 h-5 rounded-full" style={{ backgroundColor: item.color }}></span>
              <span className="text-gray-500 font-medium text-base">{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 