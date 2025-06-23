"use client";
import './globals.css';
import Sidebar from '../components/Sidebar';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const menuList = [
  { label: 'Transaksi Gagal', path: '/transaction-fail' },
  { label: 'Transaksi Pending', path: '/transaction-pending' },
  { label: 'Transaksi Sukses', path: '/transaction-success' },
  { label: 'Komplain Transaksi', path: '/transaction-complaint' },
  { label: 'Produk Terlaris', path: '/products-best-selling' },
  { label: 'Supplier', path: '/supplier' },
  { label: 'Monitor Transaksi', path: '/monitor-transaction' },
  { label: 'Monitor QRIS', path: '/monitor-qris' },
  { label: 'VO ID Kode', path: '/vo-id-kode' },
];

const icons = [
  'icon-1.svg',
  'icon-2.svg',
  'icon-3.svg',
  'icon-4.svg',
  'icon-5.svg',
  'icon-6.svg',
  'icon-7.svg',
  'icon-8.svg',
  'icon-8.svg',
];

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Cek status login
    const loginStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loginStatus);

    // Jika belum login dan bukan di halaman login, redirect ke login
    if (!loginStatus && pathname !== '/') {
      router.push('/');
    }
  }, [pathname]);

  const menus = menuList.map((menu, idx) => {
    const isActive = pathname.startsWith(menu.path);
    const iconSrc = isActive
      ? `/icon/sidebar/active sidebar/${icons[idx]}`
      : `/icon/sidebar/${icons[idx]}`;
    return {
      icon: <img src={iconSrc} alt={`icon-${idx+1}`} width={24} height={24} />,
      label: menu.label,
      active: isActive,
      onClick: () => router.push(menu.path),
    };
  });

  const user = {
    name: 'Admin',
    email: 'admin@gmail.com',
    onSetting: () => {},
    onLogout: () => {
      localStorage.removeItem('isLoggedIn');
      router.push('/');
    },
  };
  const logoSrc = '/logo_order_kuota.png';

  return (
    <html lang="id">
      <body className="antialiased bg-[#F8FAFB]">
        <div className="flex min-h-screen">
          {isLoggedIn && pathname !== '/' && (
            <Sidebar menus={menus} user={user} logoSrc={logoSrc} />
          )}
          <main className={`flex-1 ${isLoggedIn && pathname !== '/' ? 'p-8' : ''} w-full`}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
