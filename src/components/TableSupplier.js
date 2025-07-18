import React from 'react';

export default function TableSupplier({
  data = [],
  mode = 'normal',
  onCompare, onCancelCompare, onDetail, onSearch, onSelect, selected = [], loading,
  page = 1, setPage = () => {},
  pageSize = 10, setPageSize = () => {},
  totalData = 0,
}) {
  const [search, setSearch] = React.useState('');

  const handleSearch = (e) => {
    setSearch(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  const handleSelect = (code) => {
    if (!onSelect) return;
    if (selected.includes(code)) {
      onSelect(selected.filter((c) => c !== code));
    } else if (selected.length < 3) {
      onSelect([...selected, code]);
    }
  };

  return (
    <div className=" border-t border-[#E0E0E0] p-3 sm:p-5 w-full" style={{fontFamily: 'Poppins, Arial, sans-serif'}}>
      {/* Filter, Search & Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4 items-start sm:items-center justify-between">
        {mode === 'normal' ? (
          <>
            <div className="flex-1 flex justify-between items-center gap-2" style={{flexWrap:'wrap'}}>
              <input
                type="text"
                className="bg-white border border-[#BDBDBD] rounded-full px-3 py-1.5 text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#177F7E]"
                placeholder="Cari supplier"
                value={search}
                onChange={handleSearch}
                style={{fontFamily: 'Poppins, Arial, sans-serif'}}
              />
            </div>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#177F7E] text-[#177F7E] bg-white hover:bg-[#F6FFFC] font-medium text-sm transition cursor-pointer"
              onClick={onCompare}
            ><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H12M12 3H5C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21071 3.96086 3 4.46957 3 5V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H12M12 3V21" stroke="#177F7E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            
              Bandingkan Supplier
            </button>
          </>
        ) : (
          <>
            <div className="flex w-full gap-2 justify-between">
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#177F7E] text-[#177F7E] bg-white hover:bg-[#F6FFFC] font-medium text-sm transition cursor-pointer"
                onClick={onCompare}
                disabled={selected.length < 2}
              >
                Lakukan Perbandingan
              </button>
              <button
                className="bg-white border border-red-500 text-red-600 px-4 py-2 rounded-full hover:bg-red-50 font-medium text-sm transition cursor-pointer flex items-center gap-2"
                onClick={onCancelCompare}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#FF0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M15 9L9 15" stroke="#FF0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9 9L15 15" stroke="#FF0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              
                Batalkan Perbandingan
              </button>
            </div>
          </>
        )}
      </div>
      <div className="w-full">
        <div className="overflow-x-auto w-full rounded-xl">
          <table className="w-full min-w-[640px] border-collapse rounded-xl bg-white table-supplier" style={{fontFamily: 'Poppins, Arial, sans-serif', fontSize: 14}}>
            <thead>
              <tr className="">
                {mode === 'compare' && <th className="px-2 sm:px-4 py-2 text-left font-semibold text-xs sm:text-sm whitespace-nowrap border-[#BDBDBD]">Pilih</th>}
                <th className="px-2 sm:px-4 py-2 text-left font-semibold text-xs sm:text-sm whitespace-nowrap border-[#BDBDBD]">No</th>
                <th className="px-2 sm:px-4 py-2 text-left font-semibold text-xs sm:text-sm whitespace-nowrap border-[#BDBDBD]">Nama Supplier</th>
                <th className="px-2 sm:px-4 py-2 text-left font-semibold text-xs sm:text-sm whitespace-nowrap border-[#BDBDBD]">Kode Supplier</th>
                <th className="px-2 sm:px-4 py-2 text-left font-semibold text-xs sm:text-sm whitespace-nowrap border-[#BDBDBD]">Saldo Supplier</th>
                <th className="px-2 sm:px-4 py-2 text-left font-semibold text-xs sm:text-sm whitespace-nowrap border-[#BDBDBD]">Status Server</th>
                <th className="px-2 sm:px-4 py-2 text-left font-semibold text-xs sm:text-sm whitespace-nowrap border-[#BDBDBD]">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={mode === 'compare' ? 6 : 6} className="text-center py-8 text-gray-400 text-sm">Loading...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={mode === 'compare' ? 6 : 6} className="text-center py-8 text-gray-400 text-sm">Tidak ada data</td></tr>
              ) : data.map((item, idx) => (
                <tr key={item.supplier_code} className={idx%2===1 ? 'bg-[#F8FAFB]' : ''}>
                  {mode === 'compare' && (
                    <td className="text-center">
                      <input
                        type="checkbox"
                        checked={selected.includes(item.supplier_code)}
                        onChange={() => handleSelect(item.supplier_code)}
                        disabled={!selected.includes(item.supplier_code) && selected.length >= 3}
                      />
                    </td>
                  )}
                  {mode !== 'compare' && <td className="px-2 sm:px-4 py-3 sm:py-2 text-xs sm:text-sm text-[#222] border-[#E0E0E0] whitespace-nowrap text-center">{item.no}</td>}
                  <td className="px-2 sm:px-4 py-3 sm:py-2 text-xs sm:text-sm text-[#222] border-[#E0E0E0] whitespace-nowrap">{item.supplier_name}</td>
                  <td className="px-2 sm:px-4 py-3 sm:py-2 text-xs sm:text-sm text-[#222] border-[#E0E0E0] whitespace-nowrap">{item.supplier_code}</td>
                  <td className="px-2 sm:px-4 py-3 sm:py-2 text-xs sm:text-sm text-[#222] border-[#E0E0E0] whitespace-nowrap">{item.supplier_balance?.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</td>
                  <td className="px-2 sm:px-4 py-3 sm:py-2 text-xs sm:text-sm border-[#E0E0E0] whitespace-nowrap">
                    {item.server_status === 'Stabil' ? (
                      <span className="text-[#177F7E] font-medium">Stabil</span>
                    ) : (
                      <span className="text-[#E53935] font-medium">Down</span>
                    )}
                  </td>
                  <td className="px-2 sm:px-4 py-3 sm:py-2 text-xs sm:text-sm border-[#E0E0E0] whitespace-nowrap">
                    <button
                      className="text-[#177F7E] underline hover:text-[#145e5d] font-medium cursor-pointer"
                      onClick={() => onDetail && onDetail(item)}
                    >
                      Lihat Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Show Data & Pagination */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mt-4 text-sm">
        {/* Show Data */}
        <div className="flex items-center gap-2">
          <span>Tampilkan</span>
          <select
            className="border border-[#BDBDBD] rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#177F7E]"
            value={pageSize}
            onChange={e => setPageSize(Number(e.target.value))}
            style={{fontFamily: 'Poppins, Arial, sans-serif'}}>
            {[10, 20, 50].map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
          <span>data per halaman</span>
        </div>
        {/* Pagination */}
        <div className="flex gap-1 items-center">
          <button
            onClick={() => setPage(page-1)}
            disabled={page === 1}
            className="px-3 py-1 border border-[#BDBDBD] rounded text-sm disabled:opacity-50 bg-white text-[#BDBDBD] font-normal"
            style={{fontFamily: 'Poppins, Arial, sans-serif'}}>
            &lt;
          </button>
          {[...Array(Math.ceil(totalData / pageSize)).keys()].map(i => (
            <button
              key={i}
              onClick={() => setPage(i+1)}
              className={`px-3 py-1 border rounded text-sm font-normal ${page === i+1 ? 'bg-[#177F7E] text-white border-[#177F7E]' : 'bg-white text-[#BDBDBD] border-[#BDBDBD]'}`}
              style={{fontFamily: 'Poppins, Arial, sans-serif'}}>
              {i+1}
            </button>
          ))}
          <button
            onClick={() => setPage(page+1)}
            disabled={page === Math.ceil(totalData / pageSize) || totalData === 0}
            className="px-3 py-1 border border-[#BDBDBD] rounded text-sm disabled:opacity-50 bg-white text-[#BDBDBD] font-normal"
            style={{fontFamily: 'Poppins, Arial, sans-serif'}}>
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
} 