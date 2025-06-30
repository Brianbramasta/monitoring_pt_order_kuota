"use client";
import React,{ useState, useRef } from 'react';
import CustomDropdown from './CustomDropdown';

/**
 * Komponen Table reuseable
 * Props:
 * - columns: array {key, label}
 * - data: array objek data
 * - searchPlaceholder: string (opsional)
 * - onSearch: function (opsional)
 * - filters: array {label, options:array, value, onChange} (opsional, bisa lebih dari satu)
 * - pagination: {page, totalPages, onPageChange, pageSize, onPageSizeChange, totalData}
 * - actions: array {label, onClick, icon} (opsional, tombol di kanan atas)
 * - rowActions: function(row) => array of ReactNode (opsional, untuk kolom Action)
 * - headerClass: string/className (opsional, custom className untuk baris header)
 * - rowClass: function(row, idx) => string/className (opsional, custom className untuk baris tr data, bisa berbeda tiap baris)
 *   Contoh: rowClass={(row, idx) => idx === 0 ? 'bg-red-100' : idx === 1 ? 'bg-green-100' : ''}
 */
export default function DynamicTable({ columns, data, searchPlaceholder, onSearch, filters, pagination, actions = [], rowActions, headerClass = "bg-[#E6F4F1]", rowClass }) {
  const [search, setSearch] = useState('');

  // Handler search
  const handleSearch = (e) => {
    setSearch(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  return (
    <div className="bg-white border-t border-[#E0E0E0] p-3 sm:p-5 w-full" style={{fontFamily: 'Poppins, Arial, sans-serif'}}>
      {/* Filter, Search & Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4 items-start sm:items-center justify-between">
        <div className="flex-1 flex justify-between items-center gap-2" style={{'flexWrap':'wrap'}}>
          {onSearch && (
            <input
              type="text"
              className="border border-[#BDBDBD] rounded-full px-3 py-1.5 text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#177F7E]"
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

      {/* Table dengan scroll horizontal di mobile */}
      <div className="overflow-x-auto -mx-3 sm:mx-0">
        <div className="min-w-[640px] p-3 sm:p-0">
          <table className="w-full border-collapse" style={{fontFamily: 'Poppins, Arial, sans-serif', fontSize: 14}}>
            <thead>
              <tr className={headerClass}>
                {columns.map((col, idx) => (
                  <th key={idx} className="px-2 sm:px-4 py-2 text-left font-semibold text-xs sm:text-sm whitespace-nowrap  border-[#BDBDBD]">{col.label}</th>
                ))}
                {rowActions && <th className="px-2 sm:px-4 py-2 text-left font-semibold text-xs sm:text-sm whitespace-nowrap border-[#BDBDBD]">Action</th>}
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr><td colSpan={columns.length + (rowActions ? 1 : 0)} className="text-center py-6 text-gray-400 text-sm">Tidak ada data</td></tr>
              ) : (
                data.map((row, i) => (
                  <tr key={i} className={rowClass ? rowClass(row, i) : (i%2===1 ? 'bg-[#F8FAFB]' : '')}>
                    {columns.map((col, j) => (
                      <td key={j} className="px-2 sm:px-4 py-3 sm:py-2 text-xs sm:text-sm text-[#222]  border-[#E0E0E0] whitespace-nowrap">{row[col.key]}</td>
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
  );
} 