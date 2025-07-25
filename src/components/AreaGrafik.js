import React from "react";
import CustomDropdown from "./CustomDropdown";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

/**
 * Props:
 * - totalLabel: string
 * - totalValue: string | number
 * - filters: array {label, options:array, value, onChange}
 * - data: array {x, y}
 * - dataKeyX: string
 * - dataKeyY: string
 * - tooltipFormatter: function (opsional)
 */
const AreaGrafik = ({
  totalLabel,
  totalValue,
  filters = [],
  data = [],
  dataKeyX = "x",
  dataKeyY = "y",
  tooltipFormatter,
}) => {
  return (
    <div className="bg-white  rounded-2xl p-[clamp(12px,3vw,24px)] shadow-[0_2px_8px_#0001] w-full m-0">
      {/* Header */}
      <div className="area-grafik-header flex flex-wrap justify-between items-center mb-4 gap-3">
        <div className=" text-[clamp(12px,2vw,14px)]  font-normal">
          {totalLabel} : <span className="text-[#009688] font-bold">{totalValue}</span>
        </div>
        <div className="flex gap-3 flex-wrap">
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
        </div>
      </div>
      {/* Grafik Area */}
      <div className="w-full h-[min(300px,50vw)] min-h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 16, right: 24, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#177F7E" stopOpacity={0.3}/>
                <stop offset="100%" stopColor="#177F7E" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke="#404040"
              className=""
            />
            <XAxis 
              dataKey={dataKeyX} 
              tick={{ 
                fontFamily: 'Poppins', 
                fontSize: 12, 
                fill: 'var(--foreground)'
              }} 
              stroke="var(--foreground)"
            />
            <YAxis 
              tick={{ 
                fontFamily: 'Poppins', 
                fontSize: 12, 
                fill: 'var(--foreground)'
              }}
              stroke="var(--foreground)"
            />
            <Tooltip
              contentStyle={{ 
                fontFamily: 'Poppins', 
                borderRadius: 8, 
                fontSize: 14,
                backgroundColor: 'var(--background)',
                color: 'var(--foreground)',
                border: '1px solid var(--foreground)'
              }}
              formatter={tooltipFormatter}
              labelStyle={{
                color: 'var(--foreground)'
              }}
            />
            <Area 
              type="monotone" 
              dataKey={dataKeyY} 
              stroke="#177F7E" 
              fill="url(#colorArea)" 
              strokeWidth={3} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {/* Style responsif tambahan */}
      <style>{`
        @media (max-width: 600px) {
          .area-grafik-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default AreaGrafik;
