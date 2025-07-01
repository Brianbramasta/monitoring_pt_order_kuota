import React from 'react';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';

export default function DonutChart({ data = [], colors = ["#177F7E", "#FFD600", "#E53935"], title }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  return (
    <div className="w-full h-64 flex flex-col items-center justify-center">
      <div className="font-semibold mb-2">{title}</div>
      {data.length === 0 ? (
        <div className="text-gray-400">Tidak ada data</div>
      ) : (
        <ResponsiveContainer width="100%" height="90%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {data.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={colors[idx % colors.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
      {total > 0 && (
        <div className="absolute text-lg font-bold mt-[-120px]">{total}</div>
      )}
    </div>
  );
} 