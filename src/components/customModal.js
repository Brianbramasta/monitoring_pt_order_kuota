import React from 'react';
import CustomDropdown from './CustomDropdown';

export default function CustomModal({ open, onClose, title, inputs = [], buttons = [] }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30" style={{fontFamily: 'Poppins, Arial, sans-serif'}}>
      <div className="bg-white rounded-[24px] shadow-lg p-8 w-full max-w-md relative" style={{minWidth: 350}}>
        {/* Tombol close */}
        <button
          className="absolute top-6 right-6 text-2xl   hover:text-[#177F7E] focus:outline-none"
          onClick={onClose}
          aria-label="Tutup"
        >
          &times;
        </button>
        {/* Judul */}
        <h2 className="text-2xl font-bold mb-8  ">{title}</h2>
        {/* Input dinamis */}
        <div className="flex flex-col gap-6 mb-8">
          {inputs.map((input, idx) => (
            <div key={idx}>
              {input.label && (
                <label className="block mb-2 text-lg font-semibold  ">{input.label}</label>
              )}
              {input.type === 'text' && (
                <input
                  type="text"
                  className="w-full border border-[#CACACA] rounded-[12px] px-5 py-3 text-base font-light   bg-white focus:outline-none focus:ring-2 focus:ring-[#177F7E]"
                  placeholder={input.placeholder}
                  value={input.value}
                  onChange={e => input.onChange && input.onChange(e.target.value)}
                  disabled={input.disabled}
                />
              )}
              {input.type === 'select' && (
                <CustomDropdown
                  label={input.placeholder}
                  options={input.options}
                  value={input.value}
                  onChange={input.onChange}
                  type='radio'
                />
              )}
              {/* Tambahkan tipe input lain jika perlu */}
            </div>
          ))}
        </div>
        {/* Button dinamis */}
        <div className="flex gap-4 mt-6">
          {buttons.map((btn, idx) => (
            <button
              key={idx}
              onClick={btn.onClick}
              disabled={btn.disabled}
              className={`flex-1 rounded-full py-3 text-base font-semibold transition ${btn.disabled ? 'bg-[#F0F0F0] text-[#888]' : 'bg-[#177F7E] text-white hover:bg-[#179F8B]'}`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
