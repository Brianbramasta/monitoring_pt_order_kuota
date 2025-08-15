import { useState } from 'react';
import { Line } from 'recharts';
import CustomDropdown from "./CustomDropdown";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function QrisLineChart({ 
  title,
  totalLabel,
  totalValue,
  filters,
  data,
  dataKeyX = "x",
  dataKeyY = "y",
  tooltipFormatter,
  loading,
  lineColor = "#3354F4",
}) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <> 
    <div className='flex flex-col gap-2'>
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className={`bg-white rounded-lg p-4 ${expanded ? 'fixed inset-4 z-50' : ''}`}>
        <div className="flex justify-between items-center mb-4">
            <div>
                <div className="text-sm text-gray-500">
                {totalLabel}: <span className='font-semibold'>{totalValue}</span>
            </div>
            </div>
            <div className="flex items-center gap-4">
                {filters.map((filter, idx) => (
                <CustomDropdown
                key={idx}
                label={filter.label}
                options={filter.options}
                value={filter.value}
                onChange={filter.onChange}
                type={filter.type}
                />
            ))}
            <button 
                onClick={toggleExpand}
                className="p-2 hover:bg-gray-100 rounded-full bg-[#F4F8FB] cursor-pointer"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 3H21V9" stroke="#222222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M9 21H3V15" stroke="#222222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M21 3L14 10" stroke="#222222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M3 21L10 14" stroke="#222222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>

            </button>
            </div>
        </div>

        <div className={expanded ? 'h-[calc(100%-100px)]' : 'h-[300px]'}>
            <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#177F7E" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0.1}/>
                </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                dataKey={dataKeyX}
                tick={{ fontSize: 12 }}
                />
                <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `Rp ${Number(value).toLocaleString('id-ID')}`}
                />
                <Tooltip 
                formatter={tooltipFormatter}
                contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '12px'
                }}
                />
                <Area 
                type="monotone" 
                dataKey={dataKeyY} 
                stroke="#177F7E" 
                fillOpacity={1} 
                fill="url(#colorUv)" 
                />
                <Line 
                type="monotone" 
                dataKey={dataKeyY} 
                stroke={lineColor}
                strokeWidth={2} 
                />
            </AreaChart>
            </ResponsiveContainer>
        </div>
        </div>
    </div>
    </>
   
  );
}
