import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function HorizontalBarChart({ data = [], color = '#177F7E', title }) {
  return (
    <div className="w-full h-64 flex flex-col items-center justify-center">
      <div className="font-semibold mb-2 text-xl">{title}</div>
      {data.length === 0 ? (
        <div className="text-gray-400">Tidak ada data</div>
      ) : (
        <ResponsiveContainer width="100%" height="90%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 10, right: 20, left: 40, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="product_name" type="category" width={120} />
            <Tooltip />
            <Bar dataKey="sales" fill={color} radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
} 