import React from 'react';
import { BarChart as RBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const DEFAULT_COLORS = ['#177F7E', '#FFD600', '#E53935', '#6C63FF', '#00BFAE', '#FF8A65'];

export default function BarChart({ data = [], barKeys = ['value'], colors = DEFAULT_COLORS, title }) {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl p-8 flex flex-col items-center" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
      <div className="text-xl font-bold text-center mb-6">{title}</div>
      {data.length === 0 ? (
        <div className="text-gray-400">Tidak ada data</div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={400}>
            <RBarChart data={data} barGap={16} margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 18, fill: '#888' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 16, fill: '#888' }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: 'rgba(23,127,126,0.08)' }} formatter={(v) => v} />
              {barKeys.map((key, idx) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={colors[idx % colors.length]}
                  radius={[12, 12, 0, 0]}
                  barSize={32}
                  name={key}
                />
              ))}
            </RBarChart>
          </ResponsiveContainer>
          {/* Custom Legend */}
          {barKeys && barKeys.length > 1 && (
            <div className="flex flex-row justify-center items-center gap-8 mt-8 flex-wrap">
              {barKeys.map((key, idx) => (
                <div key={key} className="flex items-center gap-2">
                  <span className="inline-block w-5 h-5 rounded-full" style={{ backgroundColor: colors[idx % colors.length] }}></span>
                  <span className="text-gray-500 font-medium text-base">{key}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
} 