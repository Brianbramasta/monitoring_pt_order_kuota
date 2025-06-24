import React from 'react';

/**
 * Skeleton loading untuk card summary.
 * @param {Object} props
 * @param {number} props.count - Jumlah card (default: 4)
 * @param {string|number} props.width - Lebar card (default: '100%')
 * @param {string|number} props.height - Tinggi card (default: 100)
 */
export default function SkeletonCard({ count = 4, width = '100%', height = 100 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse bg-gray-200"
          style={{
            width: width,
            height: height,
            borderRadius: 12,
          }}
        />
      ))}
    </div>
  );
} 