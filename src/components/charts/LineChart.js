import React from 'react';
import { LineChart as RLineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Dot } from 'recharts';

export default function LineChart({ data = [], color = '#177F7E', title }) {
  return (
    <div className="w-full h-64 flex flex-col items-center justify-center">
      <div className="font-semibold mb-2">{title}</div>
      {data.length === 0 ? (
        <div className="text-gray-400">Tidak ada data</div>
      ) : (
        <ResponsiveContainer width="100%" height="90%">
          <RLineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke={color} strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 7 }} />
          </RLineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
} 