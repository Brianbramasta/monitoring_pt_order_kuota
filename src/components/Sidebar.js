"use client";

import Image from 'next/image';
import { useState } from 'react';

/**
 * Komponen Sidebar reuseable
 * Props:
 * - menus: array menu {icon, label, active, onClick}
 * - user: {name, email, onSetting, onLogout}
 * - logoSrc: path logo
 * - isVisible: boolean untuk mengontrol visibility sidebar di desktop
 * - onToggle: function untuk toggle sidebar
 */
export default function Sidebar({ menus, user, logoSrc, isVisible = true, onToggle }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-[7px] left-4 z-50 p-2 rounded-lg bg-white shadow-md lg:hidden hover:bg-gray-100"  
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
        bg-white dark:bg-[#262626]
        transition-all duration-300 ease-in-out
        w-full sm:w-[270px]  lg:translate-x-0 lg:sticky
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${!isVisible ? 'lg:w-0 lg:overflow-hidden lg:border-r-0' : 'lg:w-[270px] lg:border-r lg:border-gray-200'}
        flex flex-col
        shadow-none
      `} style={{fontFamily: 'Poppins, Arial, sans-serif'}}>
        <div className={`flex flex-col h-full px-6 pt-8 pb-6 transition-all duration-300 ${!isVisible ? 'lg:opacity-0 lg:pointer-events-none lg:transform lg:translate-x-[-100%]' : 'lg:opacity-100 lg:transform lg:translate-x-0'}`}>
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
                    className={`
                      flex items-center gap-3 w-full px-4 py-2 rounded-[8px] transition-colors text-[14px] leading-[22px] font-light cursor-pointer menu-button
                      ${menu.active 
                        ? 'bg-[#177F7E] active text-white font-medium' 
                        : 'hover:bg-[#F0F0F0] dark:hover:bg-[#404040] dark:hover:   dark:text-white'}
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
                    <span className="font-inherit menu-label  ">{menu.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Info sticky di bawah */}
          <div className="flex flex-col items-center gap-2 border-t border-[#E0E0E0] pt-6 mt-6 flex-shrink-0 bg-white dark:bg-[#262626]">
            <div className="font-semibold text-base dark:text-white">{user.name}</div>
            <div className="text-xs text-[#4F4F4F] mb-2 dark:text-gray-400">{user.email}</div>
            <div className="flex gap-2">
              <button onClick={user.onSetting} className="w-9 h-9 flex items-center justify-center rounded-[8px] bg-white dark:bg-[#404040] border border-[#E0E0E0] dark:border-[#525252] hover:bg-gray-100 dark:hover:bg-[#525252] transition-colors non-menu-button">
                <img 
                  src={document.documentElement.classList.contains('dark') 
                    ? "/icon/login information/settings-white.svg"
                    : "/icon/login information/settings.svg"
                  }
                  alt="settings"
                  className="transition-none"
                />
              </button>
              <button onClick={user.onLogout} className="w-9 h-9 flex items-center justify-center rounded-[8px] bg-white dark:bg-[#404040] border border-[#E0E0E0] dark:border-[#525252] hover:bg-red-50 dark:hover:bg-red-900 transition-colors non-menu-button">
                <img src="/icon/login information/log-in.svg" alt="logout" className="transition-none" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}