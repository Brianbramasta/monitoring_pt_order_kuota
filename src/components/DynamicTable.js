"use client";
import React,{ useState, useRef } from 'react';

/**
 * Komponen Table reuseable
 * Props:
 * - columns: array {key, label}
 * - data: array objek data
 * - searchPlaceholder: string (opsional)
 * - onSearch: function (opsional)
 * - filters: array {label, options:array, value, onChange} (opsional, bisa lebih dari satu)
 * - pagination: {page, totalPages, onPageChange, pageSize, onPageSizeChange, totalData}
 */
function CustomDropdown({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  // Close dropdown jika klik di luar
  React.useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const selected = options.find(opt => opt.value === value) || options[0];

  return (
    <div className="relative" ref={ref} style={{fontFamily: 'Poppins, Arial, sans-serif'}}>
      <button
        type="button"
        className="flex items-center justify-between w-[220px] border border-[#CACACA] rounded-full px-4 py-2 bg-white text-[14px] font-light text-[#222] focus:outline-none focus:ring-2 focus:ring-[#177F7E]"
        onClick={() => setOpen(v => !v)}
      >
        {selected.label}
        <svg width="18" height="18" fill="none" stroke="#222" className="ml-2"><path d="M5 8l4 4 4-4" strokeWidth="2"/></svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 z-20 w-[220px] bg-white border border-[#CACACA] rounded-[12px] shadow-lg p-4 flex flex-col gap-2" style={{padding: 16}}>
          <div className="flex flex-col gap-2 max-h-60 overflow-auto">
            {options.map(opt => (
              <button
                key={opt.value}
                className={`flex items-center w-full h-[34px] rounded-[4px] px-3 text-left text-[14px] font-light text-[#222] relative ${value === opt.value ? 'bg-[#F0F0F0]' : 'hover:bg-[#F0F0F0]'}`}
                onClick={() => { onChange(opt.value); setOpen(false); }}
              >
                <span className="flex-1">{opt.label}</span>
                {value === opt.value && (
                  <svg width="16" height="16" fill="none" stroke="#222" className="absolute right-3 top-1/2 -translate-y-1/2"><path d="M4 8l3 3 5-5" strokeWidth="2"/></svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function DynamicTable({ columns, data, searchPlaceholder, onSearch, filters, pagination }) {
  const [search, setSearch] = useState('');

  // Handler search
  const handleSearch = (e) => {
    setSearch(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  return (
    <div className="bg-white border-t border-[#E0E0E0] p-3 sm:p-5 w-full" style={{fontFamily: 'Poppins, Arial, sans-serif'}}>
      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4 items-start sm:items-center justify-between">
        {onSearch && (
          <input
            type="text"
            className="border border-[#BDBDBD] rounded-full px-3 py-1.5 text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#177F7E]"
            placeholder={searchPlaceholder || 'Cari...'}
            value={search}
            onChange={handleSearch}
            style={{fontFamily: 'Poppins, Arial, sans-serif'}}
          />
        )}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {filters && filters.map((filter, idx) => (
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

      {/* Table dengan scroll horizontal di mobile */}
      <div className="overflow-x-auto -mx-3 sm:mx-0">
        <div className="min-w-[640px] p-3 sm:p-0">
          <table className="w-full border-collapse" style={{fontFamily: 'Poppins, Arial, sans-serif', fontSize: 14}}>
            <thead>
              <tr className="bg-[#E6F4F1] ">
                {columns.map((col, idx) => (
                  <th key={idx} className="px-2 sm:px-4 py-2 text-left font-semibold text-xs sm:text-sm whitespace-nowrap  border-[#BDBDBD]">{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr><td colSpan={columns.length} className="text-center py-6 text-gray-400 text-sm">Tidak ada data</td></tr>
              ) : (
                data.map((row, i) => (
                  <tr key={i} className={i%2===1 ? 'bg-[#F8FAFB]' : ''}>
                    {columns.map((col, j) => (
                      <td key={j} className="px-2 sm:px-4 py-3 sm:py-2 text-xs sm:text-sm text-[#222]  border-[#E0E0E0] whitespace-nowrap">{row[col.key]}</td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
              style={{fontFamily: 'Poppins, Arial, sans-serif'}}
            >
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
              style={{fontFamily: 'Poppins, Arial, sans-serif'}}
            >&lt;</button>
            {[...Array(pagination.totalPages)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => pagination.onPageChange(idx+1)}
                className={`px-3 py-1 border rounded-[6px] text-sm font-normal ${pagination.page===idx+1 ? 'bg-[#177F7E] text-white border-[#177F7E]' : 'bg-white text-[#BDBDBD] border-[#BDBDBD]'}`}
                style={{fontFamily: 'Poppins, Arial, sans-serif'}}
              >{idx+1}</button>
            ))}
            <button 
              onClick={() => pagination.onPageChange(pagination.page+1)} 
              disabled={pagination.page===pagination.totalPages} 
              className="px-3 py-1 border border-[#BDBDBD] rounded-[6px] text-sm disabled:opacity-50 bg-white text-[#BDBDBD] font-normal"
              style={{fontFamily: 'Poppins, Arial, sans-serif'}}
            >&gt;</button>
          </div>
        </div>
      )}
    </div>
  );
} 