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

export default function DonutChart({ data = [], colors = ["#177F7E", "#FFD600", "#E53935"], title }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  // Tambahkan total ke setiap data agar bisa diakses di tooltip
  const chartData = data.map(d => ({ ...d, total }));

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl p-8 flex flex-col items-center" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
      {title && <div className="text-2xl font-bold text-center mb-6">{title}</div>}
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
    </div>
  );
} 