"use client";

import Image from 'next/image';
import { useState } from 'react';

/**
 * Komponen Sidebar reuseable
 * Props:
 * - menus: array menu {icon, label, active, onClick}
 * - user: {name, email, onSetting, onLogout}
 * - logoSrc: path logo
 */
export default function Sidebar({ menus, user, logoSrc }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md lg:hidden hover:bg-gray-100"
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
          {isOpen ? (
            <path d="M6 18L18 6M6 6l12 12"/>
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16"/>
          )}
        </svg>
      </button>

      {/* Overlay untuk mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar sticky & scrollable menu */}
      <aside className={`
        fixed top-0 left-0 h-screen z-40 
        bg-[#F8F8F8] 
        transition-transform duration-300 ease-in-out
        w-[220px] sm:w-[270px] lg:translate-x-0 lg:static
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        flex flex-col
        shadow-none
      `} style={{fontFamily: 'Poppins, Arial, sans-serif'}}>
        <div className="flex flex-col h-full px-6 pt-8 pb-6">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-10 flex-shrink-0">
            <Image src={logoSrc} alt="Logo" width={140} height={32} priority />
          </div>

          {/* Menu scrollable */}
          <nav className="flex-1 min-h-0 overflow-auto custom-scrollbar">
            <ul className="flex flex-col gap-2">
              {menus.map((menu, idx) => (
                <li key={idx}>
                  <button
                    className={`flex items-center gap-3 w-full px-4 py-2 rounded-[8px] transition-colors text-[14px] leading-[22px] font-light
                      ${menu.active ? 'bg-[#177F7E] text-white font-medium' : 'hover:bg-[#F0F0F0] text-[#222]'}
                    `}
                    style={{
                      boxShadow: menu.active ? '0 2px 8px 0 rgba(23,127,126,0.08)' : undefined,
                      border: menu.active ? 'none' : undefined,
                    }}
                    onClick={() => {
                      menu.onClick?.();
                      setIsOpen(false); // Tutup sidebar di mobile setelah klik menu
                    }}
                  >
                    <span className="flex items-center justify-center w-6 h-6">
                      {menu.icon}
                    </span>
                    <span className="font-inherit">{menu.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Info sticky di bawah */}
          <div className="flex flex-col items-center gap-2 border-t border-[#E0E0E0] pt-6 mt-6 flex-shrink-0 bg-[#F8F8F8]">
            <div className="font-semibold text-base text-[#222]">{user.name}</div>
            <div className="text-xs text-[#4F4F4F] mb-2">{user.email}</div>
            <div className="flex gap-2">
              <button onClick={user.onSetting} className="w-9 h-9 flex items-center justify-center rounded-[8px] bg-white border border-[#E0E0E0] hover:bg-gray-100">
                <svg width="20" height="20" fill="none" stroke="#222" strokeWidth="1.6"><circle cx="10" cy="10" r="7"/><path d="M10 7v3l2 2"/></svg>
              </button>
              <button onClick={user.onLogout} className="w-9 h-9 flex items-center justify-center rounded-[8px] bg-white border border-[#E0E0E0] hover:bg-red-50">
                <svg width="20" height="20" fill="none" stroke="#EB5757" strokeWidth="1.6"><path d="M6 10h8M10 7l3 3-3 3"/><circle cx="10" cy="10" r="9" stroke="#EB5757" strokeWidth="1.6"/></svg>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
} 