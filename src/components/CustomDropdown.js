'use client'
import React, { useState, useRef } from "react";

function CustomDropdown({ label, options, value, onChange, type = "default" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

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
        className={`flex items-center justify-between w-full border border-[#CACACA] ${type === 'radio' ? 'rounded-[6px]' : 'rounded-full'} px-4 py-2 bg-white text-[14px] font-light text-[#222] focus:outline-none focus:ring-2 focus:ring-[#177F7E]`}
        onClick={() => setOpen(v => !v)}
      >
        {selected.label}
        <svg width="18" height="18" fill="none" stroke="#222" className="ml-2"><path d="M5 8l4 4 4-4" strokeWidth="2"/></svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 z-20 w-full bg-white border border-[#CACACA] rounded-[12px] shadow-lg p-4 flex flex-col gap-2" style={{padding: 16}}>
          <div className="flex flex-col gap-2 max-h-60 overflow-auto">
            {options.map(opt => (
              <button
                key={opt.value}
                // change color to #000
                className={`flex items-center w-full h-[34px] rounded-[4px] px-3 text-left text-[14px] font-light text-[#000] relative ${value === opt.value ? 'bg-[#F0F0F0]' : 'hover:bg-[#F0F0F0]'}`}
                onClick={() => { onChange(opt.value); setOpen(false); }}
              >
                <span className="flex-1">{opt.label}</span>
                {type === 'radio' ? (
                  <span className="ml-2 flex items-center justify-center">
                    <span className={`w-5 h-5 rounded-full border-2 ${value === opt.value ? 'border-[#177F7E]' : 'border-[#CACACA]'} flex items-center justify-center`}>
                      {value === opt.value && <span className="w-3 h-3 rounded-full bg-[#177F7E]"></span>}
                    </span>
                  </span>
                ) : value === opt.value && (
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

export default CustomDropdown; 