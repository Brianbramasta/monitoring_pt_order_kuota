'use client'
import AreaGrafik from "@/components/AreaGrafik";
import { useState } from "react";

const data = [
  { x: "Jan", y: 20 },
  { x: "Feb", y: 30 },
  { x: "Mar", y: 50 },
  { x: "Apr", y: 70 },
  { x: "May", y: 80 },
  { x: "Jun", y: 90 },
  { x: "Jul", y: 90 },
  { x: "Aug", y: 85 },
  { x: "Sep", y: 90 },
  { x: "Oct", y: 80 },
  { x: "Nov", y: 70 },
  { x: "Dec", y: 40 },
];

export default function MonitorQrisPage() {
  const [periode, setPeriode] = useState("bulan");

  const filters = [
    {
      label: "Bulanan",
      options: [
        { label: "Bulanan", value: "bulan" },
        { label: "Mingguan", value: "minggu" },
      ],
      value: periode,
      onChange: setPeriode,
    },
  ];

  return (
    <div className="px-8 py-8">
      <h1 className="text-2xl font-bold mb-8">Monitor QRIS</h1>
      <AreaGrafik
        totalLabel="NOMINAL TRANSAKSI QRIS"
        totalValue={<span style={{ color: '#1EC98B' }}>Rp 4.200.000</span>}
        filters={filters}
        data={data}
        dataKeyX="x"
        dataKeyY="y"
        tooltipFormatter={(value, name, props) => [
          `Rp ${Number(value).toLocaleString('id-ID')}`,
          props && props.payload && props.payload.x ? props.payload.x : name
        ]}
      />
    </div>
  );
} 