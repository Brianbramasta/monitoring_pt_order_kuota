import React, { useState, useRef, useEffect } from 'react';

export default function Header({ sidebarVisible, onToggleSidebar, user }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setShowTooltip(false);
      }
    }
    if (showTooltip) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTooltip]);

  // Responsive margin left dan width hanya di desktop
  const marginLeftClass = sidebarVisible ? 'lg:ml-[270px]' : 'lg:ml-0';
  const headerStyle = {
    transition: 'width 0.3s, margin-left 0.3s',
    width: '100%',
  };
  if (typeof window !== 'undefined') {
    // Hanya di desktop, width calc(100% - 270px) jika sidebarVisible
    if (window.innerWidth >= 1024 && sidebarVisible) {
      headerStyle.width = 'calc(100% - 270px)';
    } else {
      headerStyle.width = '100%';
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 z-30 bg-white shadow flex items-center justify-between px-4 sm:px-6 lg:px-8 h-14 sm:h-16 transition-all duration-300 ${marginLeftClass}`}
      style={headerStyle}
    >
      {/* Toggle Sidebar Button */}
      <button
        onClick={onToggleSidebar}
        className="p-2 rounded-lg bg-white shadow-md hover:bg-gray-100 transition-colors block"
        title={sidebarVisible ? 'Sembunyikan Sidebar' : 'Tampilkan Sidebar'}
        style={{ minWidth: 36, minHeight: 36 }}
      >
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {/* User Info & Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="text-right hidden md:block">
          <div className="font-semibold text-gray-800 text-xs sm:text-sm">{user?.name}</div>
          <div className="text-xs text-gray-500">{user?.email}</div>
        </div>
        <div className="relative" ref={tooltipRef}>
          <button
            onClick={() => setShowTooltip((v) => !v)}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors focus:outline-none"
            title="Profil"
          >
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 8-4 8-4s8 0 8 4" />
            </svg>
          </button>
          {showTooltip && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg py-2 z-50">
              <button
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => { setShowTooltip(false); user?.onSetting && user.onSetting(); }}
              >
                Setting
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                onClick={() => { setShowTooltip(false); user?.onLogout && user.onLogout(); }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 