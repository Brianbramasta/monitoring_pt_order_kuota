import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function QrisComparisonChart({ 
  title,
  data,
  colors = [ '#FFD66B', '#177F7E'],
}) {
  const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent, value, name }) => {
    const radius = outerRadius * 0.65;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <g>
        <text
          x={x}
          y={y}
          fill="white"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="12"
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      </g>
    );
  };

  return (
    <div className="bg-white rounded-2xl p-6" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.08)', border: '1px solid #F4F4F4' }}>
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="w-full md:flex-1 h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                <filter id="shadow">
                  <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.3"/>
                </filter>
              </defs>
              <Pie
                data={[{ value: 100 }]}
                cx="50%"
                cy="50%"
                outerRadius={108}
                innerRadius={100}
                fill="none"
                stroke="#f8f8f8ff"
                strokeWidth={8}
              />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
                stroke="#fff"
                strokeWidth={2}
                fill="#8884d8"
                dataKey="value"
                filter="url(#shadow)"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={colors[index % colors.length]}
                    style={{ filter: 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.2))' }}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${value}`, name]}
                contentStyle={{
                  backgroundColor: '#222222',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: 'white',
                  boxShadow: '0 6px 12px rgba(0,0,0,0.2)'
                }}
                itemStyle={{ color: 'white' }}
                labelStyle={{ color: 'white' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col gap-4 md:ml-6 w-full md:w-auto">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between md:justify-start gap-3">
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <span className="text-sm font-medium">{item.name}</span>
              </div>
              <div className="text-sm text-gray-500">{item.value.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
