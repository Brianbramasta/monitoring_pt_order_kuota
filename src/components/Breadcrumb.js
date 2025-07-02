import React from 'react';
import Link from 'next/link';

export default function Breadcrumb({ items = [] }) {
  return (
    <nav className="flex items-center text-sm py-2 px-0" aria-label="Breadcrumb">
      {items.map((item, idx) => (
        <span key={idx} className="flex items-center">
          {item.href ? (
            <Link href={item.href} className="text-[#000] hover:text-[#179F8B] transition-colors font-medium">
              {item.label}
            </Link>
          ) : (
            <span className="text-[#868686] font-semibold">{item.label}</span>
          )}
          {idx < items.length - 1 && (
            <svg className="mx-2" width="16" height="16" fill="none" viewBox="0 0 16 16">
              <path d="M6 4l4 4-4 4" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </span>
      ))}
    </nav>
  );
} 