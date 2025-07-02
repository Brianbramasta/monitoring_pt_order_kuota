import React from 'react';
import { LineChart as RLineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area } from 'recharts';

const DEFAULT_COLORS = ['#177F7E', '#FFD600', '#E53935', '#6C63FF', '#00BFAE', '#FF8A65'];

const customTooltipStyle = {
  fontFamily: 'Poppins',
  borderRadius: 8,
  fontSize: 14,
};

export default function LineChart({ data = [], lineKeys = ['value'], colors = DEFAULT_COLORS, title }) {
  return (
    <div className="w-full max-w-4xl mx-auto bg-[#FAFAFB] rounded-2xl p-8 flex flex-col items-center" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
      <div className="text-xl font-bold text-center mb-6">{title}</div>
      {data.length === 0 ? (
        <div className="text-gray-400">Tidak ada data</div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={400}>
            <RLineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
              <defs>
                <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#177F7E" stopOpacity={0.5}/>
                  <stop offset="100%" stopColor="#177F7E" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" tick={{ fontFamily: 'Poppins', fontSize: 12, fill: '#222' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontFamily: 'Poppins', fontSize: 12, fill: '#222' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={customTooltipStyle} />
              <Area
                type="monotone"
                dataKey={lineKeys[0]}
                stroke="#177F7E"
                fill="url(#colorArea)"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 7 }}
              />
              <Line
                type="monotone"
                dataKey={lineKeys[0]}
                stroke="#177F7E"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 7 }}
              />
            </RLineChart>
          </ResponsiveContainer>
          {/* Custom Legend */}
          {lineKeys && lineKeys.length > 1 && (
            <div className="flex flex-row justify-center items-center gap-8 mt-8 flex-wrap">
              {lineKeys.map((key, idx) => (
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