import React from 'react';
import CustomDropdown from './CustomDropdown';

const cardBgColors = [
  '#3B8C8B', // 1st
  '#049DD4', // 2nd
  '#EB5757', // 3rd
];

// Medali PNG sesuai rank
const medalImages = [
  '/icon/card product/medali/medali-1.png',
  '/icon/card product/medali/medali-2.png',
  '/icon/card product/medali/medali-3.png',
];

// Medali dengan hexagon dan efek bintang
function Medal({ rank }) {
  const color = [
    '#FFD600', // gold
    '#B0C4DE', // silver
    '#FF8A65', // bronze
  ][rank-1] || '#FFD600';
  return (
    <div style={{position:'relative', width:56, height:72, display:'flex', flexDirection:'column', alignItems:'center'}}>
      {/* Bintang */}
      
      {/* Medali hexagon */}
      <svg width="56" height="64" viewBox="0 0 56 64" fill="none">
        <polygon points="28,4 52,18 52,46 28,60 4,46 4,18" fill={color} stroke="#fff" strokeWidth="3"/>
      </svg>
      <div style={{position:'absolute', top:20, left:0, width:'100%', textAlign:'center', fontWeight:700, fontSize:22, color:'#222'}}>{rank}</div>
    </div>
  );
}

export default function BestSellingProductTable({ columns, data, searchPlaceholder, onSearch, filters, pagination, actions = [], rowActions, headerClass = "", rowClass, customCellRender }) {
  // Pisahkan top 3 dan sisanya
  const top3 = data.slice(0, 3);
  const rest = data.slice(3);

  // Handler search
  const [search, setSearch] = React.useState('');
  const handleSearch = (e) => {
    setSearch(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  // Mapping data untuk table agar konsisten dengan desain
  const mappedRest = rest.map((item, idx) => ({
    rank: (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        borderRadius: '50%',
        border: '1.5px solid #E0E0E0',
        color: '#ABABAB',
        fontWeight: 600,
        fontSize: 18,
        background: '#fff',
      }}>{item.rank}</span>
    ),
    product_name: (
      <div className="flex items-center gap-2">
        <img src={item.icon_product} alt="produk" className="w-8 h-8" />
        <div>
          <div className="font-semibold">{item.product_name}</div>
          <div className="text-xs text-gray-400">{item.category}</div>
        </div>
      </div>
    ),
    sales: item.sales?.toLocaleString("id-ID"),
    revenue: `Rp ${item.revenue?.toLocaleString("id-ID")}`,
    growth: (
      <span className={item.growth >= 0 ? "text-[#00B386] flex items-center gap-1" : "text-[#FF414D] flex items-center gap-1"}>
        {item.growth >= 0 ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 10L8 6L4 10" stroke="#177F7E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          
        ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 6L8 10L4 6" stroke="#FF0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            
        )}
        <span className="font-semibold">{item.growth >= 0 ? `+${Math.round(item.growth * 100)}%` : `${Math.round(item.growth * 100)}%`}</span>
      </span>
    ),
    diamond: item.icon_diamond ? <img src={item.icon_diamond} alt="diamond" className="w-7 h-7 mx-auto" /> : null,
  }));

  return (
    <>
      {/* Filter, Search & Actions (di luar container) */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4 items-start sm:items-center justify-between" style={{fontFamily: 'Poppins, Arial, sans-serif'}}>
        <div className="flex-1 flex justify-between items-center gap-2" style={{flexWrap:'wrap'}}>
          {onSearch && (
            <input
              type="text"
              className="bg-white border border-[#BDBDBD] rounded-full px-3 py-1.5 text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#177F7E]"
              placeholder={searchPlaceholder || 'Cari...'}
              value={search}
              onChange={handleSearch}
              style={{fontFamily: 'Poppins, Arial, sans-serif'}} />
          )}
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {filters && filters.map((filter, idx) => (
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
        {/* Actions Button */}
        {actions.length > 0 && (
          <div className="flex gap-2 items-center">
            {actions.map((action, idx) => (
              <button
                key={idx}
                onClick={action.onClick}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#1EC98B] text-[#1EC98B] bg-white hover:bg-[#F6FFFC] font-medium text-sm transition"
              >
                {action.icon && <span>{action.icon}</span>}
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="w-full bg-white rounded-2xl shadow-md p-[40px]" style={{boxSizing: 'border-box'}}>
      {/* Top 3 Cards */}
      <div className="flex flex-row gap-[25px] mb-[30px]">
        {top3.map((item, idx) => (
          <div
            key={idx}
            className="relative flex flex-col justify-between rounded-[10px] shadow-md overflow-hidden transition-all duration-200 ease-in-out hover:shadow-lg hover:-translate-y-1 cursor-pointer"
            style={{
              background: cardBgColors[idx],
              color: '#fff',
              width: '100%',
              height: 'fit-content',
              minWidth: 0,
              position: 'relative',
              padding: '32px 32px 32px 32px',
              borderRadius: 10,
              fontFamily: 'Poppins, Arial, sans-serif',
            }}
          >
            {/* Pattern background */}
            <img
              src="/bg/pattern.jpg"
              alt="pattern"
              style={{
                position: 'absolute',
                width: '100%',
                height: 276,
                left: 0,
                top: -8,
                opacity: 0.5,
                zIndex: 0,
                mixBlendMode: 'multiply',
                pointerEvents: 'none',
              }}
            />
            {/* Medali PNG */}
            <div style={{position:'absolute', top:0, right:0, zIndex:2}}>
              <img src={medalImages[idx]} alt={`medali-${idx+1}`} style={{width:150, objectFit:'contain'}} />
            </div>
            {/* Content */}
            <div className="relative z-10 flex flex-col h-full">
              {/* Baris icon + nama produk + kategori sejajar */}
              <div style={{display:'flex', flexDirection:'row', alignItems:'center', gap:20, marginBottom:32}}>
                {/* Icon produk bulat */}
                <div style={{width:64, height:64, borderRadius:'50%', background:'#fff', display:'flex', alignItems:'center', justifyContent:'center'}}>
                  <img src={item.icon_product} alt="produk" style={{width:40, height:40}} />
                </div>
                <div style={{display:'flex', flexDirection:'column', justifyContent:'center'}}>
                  <div style={{fontWeight:700, fontSize:28, lineHeight:'32px'}}>{item.product_name}</div>
                  <div style={{fontSize:16, opacity:0.8}}>{item.category}</div>
                </div>
              </div>
              {/* Informasi lain di bawahnya */}
              <div style={{display:'flex', flexDirection:'column', gap:4}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:18}}>
                  <span style={{fontWeight:400}}>Penjualan</span>
                  <span style={{fontWeight:600}}>{item.sales?.toLocaleString('id-ID')}</span>
                </div>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:18}}>
                  <span style={{fontWeight:400}}>Revenue</span>
                  <span style={{fontWeight:700}}>Rp {item.revenue?.toLocaleString('id-ID')}</span>
                </div>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:18}}>
                  <span style={{fontWeight:400}}>Pertumbuhan</span>
                  <span style={{display:'flex', alignItems:'center', fontWeight:700, color: item.growth >= 0 ? '#FFE36E' : '#FFBABA'}}>
                    {item.growth >= 0 ? (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 10L8 6L4 10" stroke="#FFD66B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      
                    ) : (
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 6L8 10L4 6" stroke="#FFD66B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    )}
                    <span style={{marginLeft:6}}>{item.growth >= 0 ? `+${Math.round(item.growth * 100)}%` : `${Math.round(item.growth * 100)}%`}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table untuk sisanya */}
      <div className="overflow-x-auto w-full rounded-2xl border border-[#E0E0E0]">
        <table className="w-full min-w-[640px] border-collapse bg-white rounded-2xl" style={{fontFamily: 'Poppins, Arial, sans-serif', fontSize: 14}}>
          <thead>
            <tr className={headerClass}>
              {columns.filter(col => col.key !== 'diamond').map((col, idx) => (
                <th
                  key={idx}
                  className={
                    col.key === 'rank'
                      ? 'px-2 sm:px-4 py-2 font-semibold text-xs sm:text-sm whitespace-nowrap border-[#BDBDBD] text-center'
                      : 'px-2 sm:px-4 py-2 text-left font-semibold text-xs sm:text-sm whitespace-nowrap border-[#BDBDBD]'
                  }
                >
                  {col.label}
                </th>
              ))}
              {rowActions && <th className="px-2 sm:px-4 py-2 text-left font-semibold text-xs sm:text-sm whitespace-nowrap border-[#BDBDBD]">Action</th>}
            </tr>
          </thead>
          <tbody>
            {mappedRest.length === 0 ? (
              <tr><td colSpan={columns.length - 1 + (rowActions ? 1 : 0)} className="text-center py-6 text-gray-400 text-sm">Tidak ada data</td></tr>
            ) : (
              mappedRest.map((row, i) => (
                <tr key={i} className={rowClass ? rowClass(row, i+3) : ((i%2===1) ? 'bg-[#F8FAFB]' : '')}>
                  {columns.filter(col => col.key !== 'diamond').map((col, j) => (
                    <td
                      key={j}
                      className={
                        col.key === 'rank'
                          ? 'px-2 sm:px-4 py-3 sm:py-2 text-xs sm:text-sm text-[#222] border-[#E0E0E0] whitespace-nowrap text-center'
                          : 'px-2 sm:px-4 py-3 sm:py-2 text-xs sm:text-sm text-[#222] border-[#E0E0E0] whitespace-nowrap'
                      }
                    >
                      {row[col.key]}
                    </td>
                  ))}
                  {rowActions && (
                    <td className="px-2 sm:px-4 py-3 sm:py-2 text-xs sm:text-sm text-[#222] border-[#E0E0E0] whitespace-nowrap">
                      <div className="flex gap-2 items-center">
                        {rowActions(row).map((action, idx) => (
                          <span key={idx}>{action}</span>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mt-4 text-sm">
          <div className='flex items-center gap-2'> 
            <div className="text-[#222] order-2 sm:order-1 font-light">Data yang ditampilkan</div>
          <div className="flex gap-2 items-center order-1 sm:order-2">
            <select
              className="border border-[#BDBDBD] rounded-[6px] px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#177F7E]"
              value={pagination.pageSize}
              onChange={e => pagination.onPageSizeChange(Number(e.target.value))}
              style={{fontFamily: 'Poppins, Arial, sans-serif'}}>
              {[10, 20, 50].map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div></div>
         
          <div className="flex gap-1 items-center order-3">
            <button 
              onClick={() => pagination.onPageChange(pagination.page-1)} 
              disabled={pagination.page===1} 
              className="px-3 py-1 border border-[#BDBDBD] rounded-[6px] text-sm disabled:opacity-50 bg-white text-[#BDBDBD] font-normal"
              style={{fontFamily: 'Poppins, Arial, sans-serif'}}>
              &lt;</button>
            {[...Array(pagination.totalPages)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => pagination.onPageChange(idx+1)}
                className={`px-3 py-1 border rounded-[6px] text-sm font-normal ${pagination.page===idx+1 ? 'bg-[#177F7E] text-white border-[#177F7E]' : 'bg-white text-[#BDBDBD] border-[#BDBDBD]'}`}
                style={{fontFamily: 'Poppins, Arial, sans-serif'}}>
                {idx+1}</button>
            ))}
            <button 
              onClick={() => pagination.onPageChange(pagination.page+1)} 
              disabled={pagination.page===pagination.totalPages} 
              className="px-3 py-1 border border-[#BDBDBD] rounded-[6px] text-sm disabled:opacity-50 bg-white text-[#BDBDBD] font-normal"
              style={{fontFamily: 'Poppins, Arial, sans-serif'}}>
              &gt;</button>
          </div>
        </div>
      )}
    </div>
    </>
  );
} 