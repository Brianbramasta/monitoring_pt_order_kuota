import React from "react";
import CustomDropdown from "./CustomDropdown";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Line } from "recharts";

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
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}) => {
  // Custom Tooltip agar label tidak double
function CustomTooltipWrapper(props) {
  // props: { active, payload, label } dari recharts, plus dataKeyY, tooltipFormatter
  const { active, payload, label, dataKeyY, tooltipFormatter } = props;
  if (!active || !payload || payload.length === 0) return null;
  let value = payload[0].value;
  let displayLabel = label;
  if (tooltipFormatter) {
    const formatted = tooltipFormatter(value, dataKeyY, payload[0]);
    if (Array.isArray(formatted)) {
      value = formatted[0];
      displayLabel = formatted[1] || label;
    } else {
      value = formatted;
    }
  }
  return (
    <div style={{
      fontFamily: 'Poppins',
      borderRadius: 8,
      fontSize: 14,
      backgroundColor: 'var(--background)',
      color: 'var(--foreground)',
      border: '1px solid var(--foreground)',
      padding: 8
    }}>
      <div>Tanggal: {displayLabel}</div>
      <div>Transaksi: <b>{value}</b></div>
    </div>
  );
}
  return (
    <div className="bg-white  rounded-2xl p-[clamp(12px,3vw,24px)] shadow-[0_2px_8px_#0001] w-full m-0">
      {/* Header */}
      <div className="area-grafik-header flex flex-wrap justify-between items-center mb-4 gap-3">
        <div className=" text-[clamp(12px,2vw,14px)]  font-normal">
          {totalLabel} : <span className="text-[#009688] font-bold">{totalValue}</span>
        </div>
        <div className="flex gap-3 flex-wrap items-center">
          {/* Date Pickers */}
          <div className="flex gap-2 items-center">
             <label className="text-sm font-medium text-gray-700">Dari:</label>
             <input
               type="date"
               value={startDate}
               max={endDate || undefined}
               onChange={(e) => onStartDateChange && onStartDateChange(e.target.value)}
               className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#009688] focus:border-transparent"
             />
           </div>
           <div className="flex gap-2 items-center">
             <label className="text-sm font-medium text-gray-700">Sampai:</label>
             <input
               type="date"
               value={endDate}
               min={startDate || undefined}
               onChange={(e) => onEndDateChange && onEndDateChange(e.target.value)}
               className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#009688] focus:border-transparent"
             />
           </div>
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
      {/* Grafik Area (diubah: Area + Line Chart seperti QrisLineChart) */}
      <div className="w-full h-[min(300px,50vw)] min-h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 16, right: 24, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#177F7E" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey={dataKeyX}
              tick={{ fontFamily: 'Poppins', fontSize: 12, fill: 'var(--foreground)' }}
              stroke="var(--foreground)"
            />
            <YAxis 
              tick={{ fontFamily: 'Poppins', fontSize: 12, fill: 'var(--foreground)' }}
              stroke="var(--foreground)"
              tickFormatter={(value) => `Rp ${Number(value).toLocaleString('id-ID')}`}
            />
            <Tooltip
              content={props => <CustomTooltipWrapper {...props} dataKeyY={dataKeyY} tooltipFormatter={tooltipFormatter} />}
              wrapperStyle={{ zIndex: 1000 }}
            />




            <Area 
              type="monotone" 
              dataKey={dataKeyY} 
              stroke="#177F7E" 
              fillOpacity={1} 
              fill="url(#colorArea)" 
            />
            <Line 
              type="monotone" 
              dataKey={dataKeyY} 
              stroke="#177F7E"
              strokeWidth={2} 
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
