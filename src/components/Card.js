"use client";
import Image from 'next/image';

/**
 * Komponen Card reuseable
 * Props:
 * - icon: elemen icon (svg atau path gambar)
 * - title: string judul
 * - value: string/number value
 */
export default function Card({ icon, title, value }) {
  return (
    <div
      className="bg-white  rounded-[8px] flex flex-col justify-between p-0 transition-all duration-200 ease-in-out hover:shadow-lg hover:-translate-y-1 cursor-pointer gap-2"
      style={{ width: '100%',  fontFamily: 'Poppins, Arial, sans-serif' }}
    >
      <div className="flex items-center gap-3 px-5 pt-4">
        <div className="w-[34px] h-[34px] rounded-full bg-[#EEEEEE] flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-start  px-5 pb-4">
        <div className="text-[14px] leading-[22px] font-bold color-base mb-1">{title}</div>
        <div className="text-[20px] leading-[32px] font-semibold  ">{value}</div>
      </div>
    </div>
  );
} 