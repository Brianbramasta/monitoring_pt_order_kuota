import React from 'react';

/**
 * Skeleton loading untuk tabel.
 * @param {Object} props
 * @param {number} props.rows - Jumlah baris (default: 5)
 * @param {number} props.cols - Jumlah kolom (default: 6)
 * @param {number} props.rowHeight - Tinggi baris (default: 40)
 */
export default function SkeletonTable({ rows = 5, cols = 6, rowHeight = 40 }) {
  return (
    <div className="w-full">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex w-full mb-2">
          {Array.from({ length: cols }).map((_, c) => (
            <div
              key={c}
              className="animate-pulse bg-gray-200 mx-1"
              style={{
                flex: 1,
                height: rowHeight,
                borderRadius: 6,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
} 