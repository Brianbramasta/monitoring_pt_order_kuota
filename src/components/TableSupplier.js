import React from 'react';

export default function TableSupplier({
  data = [],
  mode = 'normal',
  onCompare, onCancelCompare, onDetail, onSearch, onSelect, selected = [], loading,
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
    <div className="bg-white border-t border-[#E0E0E0] p-3 sm:p-5 w-full" style={{fontFamily: 'Poppins, Arial, sans-serif'}}>
      {/* Filter, Search & Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4 items-start sm:items-center justify-between">
        {mode === 'normal' ? (
          <>
            <div className="flex-1 flex justify-between items-center gap-2" style={{flexWrap:'wrap'}}>
              <input
                type="text"
                className="border border-[#BDBDBD] rounded-full px-3 py-1.5 text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#177F7E]"
                placeholder="Cari supplier"
                value={search}
                onChange={handleSearch}
                style={{fontFamily: 'Poppins, Arial, sans-serif'}}
              />
            </div>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#1EC98B] text-[#1EC98B] bg-white hover:bg-[#F6FFFC] font-medium text-sm transition"
              onClick={onCompare}
            >
              Bandingkan Supplier
            </button>
          </>
        ) : (
          <>
            <div className="flex w-full gap-2 justify-between">
              <button
                className="bg-[#177F7E] text-white px-4 py-2 rounded-full hover:bg-[#145e5d] font-medium text-sm transition"
                onClick={onCompare}
                disabled={selected.length < 2}
              >
                Lakukan Perbandingan
              </button>
              <button
                className="border border-red-500 text-red-600 px-4 py-2 rounded-full hover:bg-red-50 font-medium text-sm transition"
                onClick={onCancelCompare}
              >
                Batalkan Perbandingan
              </button>
            </div>
          </>
        )}
      </div>
      <div className="w-full">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[640px] border-collapse" style={{fontFamily: 'Poppins, Arial, sans-serif', fontSize: 14}}>
            <thead>
              <tr className="bg-[#E6F4F1]">
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
                      className="text-[#177F7E] underline hover:text-[#145e5d] font-medium"
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
    </div>
  );
} 