import React from 'react';

/**
 * Komponen Skeleton Loading universal.
 * @param {Object} props
 * @param {string|number} props.width - Lebar skeleton (default: '100%')
 * @param {string|number} props.height - Tinggi skeleton (default: 20)
 * @param {number} props.radius - Border radius skeleton (default: 6)
 * @param {number} props.count - Jumlah skeleton (default: 1)
 * @param {string} props.className - Tambahan className (opsional)
 */
export default function Skeleton({ width = '100%', height = 20, radius = 6, count = 1, className = '' }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-gray-200 ${className}`}
          style={{
            width,
            height,
            borderRadius: radius,
            marginBottom: 8,
          }}
        />
      ))}
    </>
  );
} 