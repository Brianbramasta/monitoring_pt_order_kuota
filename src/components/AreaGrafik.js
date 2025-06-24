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
    <div style={{ background: "#fff", borderRadius: 16, padding: "clamp(12px, 3vw, 24px)", boxShadow: "0 2px 8px #0001", width: "100%", maxWidth: 900, margin: "0 auto" }}>
      {/* Header */}
      <div className="area-grafik-header" style={{ display: "flex", flexWrap: 'wrap', justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 12 }}>
        <div style={{ fontFamily: 'Poppins, Arial, sans-serif', fontSize: 'clamp(12px, 2vw, 14px)', color: '#222', fontWeight: 400 }}>
          {totalLabel} : <span style={{ color: '#009688', fontWeight: 700 }}>{totalValue}</span>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {filters.map((filter, idx) => (
            <CustomDropdown
              key={idx}
              label={filter.label}
              options={filter.options}
              value={filter.value}
              onChange={filter.onChange}
            />
          ))}
        </div>
      </div>
      {/* Grafik Area */}
      <div style={{ width: '100%', height: 'min(300px, 50vw)', minHeight: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 16, right: 24, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#177F7E" stopOpacity={0.3}/>
                <stop offset="100%" stopColor="#177F7E" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey={dataKeyX} tick={{ fontFamily: 'Poppins', fontSize: 12, fill: '#222' }} />
            <YAxis tick={{ fontFamily: 'Poppins', fontSize: 12, fill: '#222' }} />
            <Tooltip
              contentStyle={{ fontFamily: 'Poppins', borderRadius: 8, fontSize: 14 }}
              formatter={tooltipFormatter}
            />
            <Area type="monotone" dataKey={dataKeyY} stroke="#177F7E" fill="url(#colorArea)" strokeWidth={3} />
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
