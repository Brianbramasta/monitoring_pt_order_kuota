import React from 'react';
import { BarChart as RBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const BAR_COLOR = '#F87171';

export default function TotalTransactionBarChart({ data = [], title = 'Total Transaksi', totalLabel = 'Total', totalValue = 0 }) {
  return (
    <div className="w-full  bg-white rounded-2xl p-8 flex flex-col items-center" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
      <div className="text-xl font-bold text-center mb-2">{title}</div>
      <div className="text font-bold w-full mb-6">{totalLabel}</div>
      {data.length === 0 ? (
        <div className="text-gray-400">Tidak ada data</div>
      ) : (
        <ResponsiveContainer width="100%" height={350}>
          <RBarChart data={data} barGap={8} margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 16, fill: '#888' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 14, fill: '#888' }} axisLine={false} tickLine={false} />
            <Tooltip cursor={{ fill: 'rgba(248,113,113,0.08)' }} formatter={(v) => v.toLocaleString('id-ID')} labelFormatter={label => `Tanggal: ${label}`} />
            <Bar dataKey="total" fill={BAR_COLOR} radius={[12, 12, 0, 0]} barSize={28} name="Total" />
          </RBarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
} 