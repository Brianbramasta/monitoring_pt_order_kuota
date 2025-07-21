'use client'
import React, { useState, useRef } from "react";

function CustomDropdown({ label, options, value, onChange, type = "default", additionalClass }) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const ref = useRef();

  React.useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const selected = options.find(opt => opt.value === value) || options[0];
  
  // Filter options based on search term
  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative" ref={ref} style={{fontFamily: 'Poppins, Arial, sans-serif'}}>
      <button
        type="button"
        className={`flex items-center justify-between w-full ${additionalClass || 'bg-[#F4F8FB]'} text-[#545454] ${type === 'radio' ? 'rounded-[6px]' : 'rounded-full'} px-4 py-2 text-[14px] font-light focus:outline-none focus:ring-2 focus:ring-[#177F7E]`}
        onClick={() => setOpen(v => !v)}
      >
        {selected.label}
        <svg width="18" height="18" fill="none" stroke="#222" className="ml-2"><path d="M5 8l4 4 4-4" strokeWidth="2"/></svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 z-50 bg-white border border-[#CACACA] rounded-[12px] shadow-lg" style={{minWidth: type === 'search' ? '370px' : 'fit-content'}}>
          {type === 'search' && (
            <div className="p-4 border-b border-[#E0E0E0]">
              <div className="text-[14px] font-semibold text-[#000] mb-3">{label}</div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari nama produk"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#F0F0F0] rounded-[6px] px-3 py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#177F7E] pr-10"
                  style={{fontFamily: 'Poppins, Arial, sans-serif'}}
                />
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 16 16" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <path d="M11.5 11.5L14 14" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 13C10.3137 13 13 10.3137 13 7C13 3.68629 10.3137 1 7 1C3.68629 1 1 3.68629 1 7C1 10.3137 3.68629 13 7 13Z" stroke="#666" strokeWidth="1.5"/>
                </svg>
              </div>
            </div>
          )}
          <div className="max-h-60 overflow-auto p-2">
            {(type === 'search' ? filteredOptions : options).map(opt => (
              <button
                key={opt.value}
                className={`flex items-center w-full h-[34px] rounded-[4px] px-3 text-left text-[14px] font-light text-[#000] relative ${value === opt.value ? 'bg-[#F0F0F0]' : 'hover:bg-[#F0F0F0]'}`}
                onClick={() => { onChange(opt.value); setOpen(false); setSearchTerm(''); }}
              >
                <span className="flex-1">{opt.label}</span>
                {type === 'radio' ? (
                  <span className="ml-2 flex items-center justify-center">
                    <span className={`w-5 h-5 rounded-full border-2 ${value === opt.value ? 'border-[#177F7E]' : 'border-[#CACACA]'} flex items-center justify-center`}>
                      {value === opt.value && <span className="w-3 h-3 rounded-full bg-[#177F7E]"></span>}
                    </span>
                  </span>
                ) : value === opt.value && (
                  <svg width="16" height="16" fill="none" stroke="#177F7E" className=""><path d="M4 8l3 3 5-5" strokeWidth="2"/></svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomDropdown; 