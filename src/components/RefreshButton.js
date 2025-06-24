import React, { useEffect } from 'react';

export default function RefreshButton({ onClick, disabled, loading }) {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.head?.insertAdjacentHTML?.('beforeend', `<style>@keyframes spin-slow{0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}.animate-spin-slow{animation:spin-slow 1.2s linear infinite;}</style>`);
    }
  }, []);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title="Refresh data"
      // opacity buat 0 dulu, nanti on kan ketika diminta
      className={`opacity-0 p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed ${loading ? 'animate-spin-slow' : ''}`}
      style={{ marginLeft: 8 }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={22}
        height={22}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className={loading ? 'animate-spin' : ''}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582M20 20v-5h-.581M19.418 9A7.974 7.974 0 0012 4a8 8 0 00-7.418 5M4.582 15A7.974 7.974 0 0012 20a8 8 0 007.418-5"
        />
      </svg>
    </button>
  );
} 