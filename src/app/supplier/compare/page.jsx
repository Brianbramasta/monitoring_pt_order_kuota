"use client";
import { Suspense } from 'react';
import SupplierComparePage from './SupplierComparePage';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SupplierComparePage />
    </Suspense>
  );
} 