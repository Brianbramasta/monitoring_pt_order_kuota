import React from 'react';
import { BarChart as RBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function BarChart({ data = [], color = '#177F7E', title }) {
  return (
    <div className="w-full h-64 flex flex-col items-center justify-center">
      <div className="font-semibold mb-2">{title}</div>
      {data.length === 0 ? (
        <div className="text-gray-400">Tidak ada data</div>
      ) : (
        <ResponsiveContainer width="100%" height="90%">
          <RBarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip formatter={(v) => v.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })} />
            <Bar dataKey="value" fill={color} radius={[6, 6, 0, 0]} />
          </RBarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
} 