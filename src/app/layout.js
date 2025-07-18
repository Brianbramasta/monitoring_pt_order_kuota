"use client";
import './globals.css';
import Sidebar from '../components/Sidebar';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Breadcrumb from '../components/Breadcrumb';

const menuList = [
  { label: 'Transaksi Gagal', path: '/transaction-fail' },
  { label: 'Transaksi Pending', path: '/transaction-pending' },
  { label: 'Transaksi Sukses', path: '/transaction-success' },
  { label: 'Komplain Transaksi', path: '/transaction-complaint' },
  { label: 'Produk Terlaris', path: '/products-best-selling' },
  { label: 'Supplier', path: '/supplier' },
  { label: 'Monitor Transaksi', path: '/monitor-transaction' },
  { label: 'Monitor QRIS', path: '/monitor-qris' },
  // { label: 'VO ID Kode', path: '/vo-id-kode' },
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
  // 'icon-9.svg',
];

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false); // Default hidden
  const [user, setUser] = useState({ name: '', email: '' });

  useEffect(() => {
    // Cek status login
    const loginStatus = localStorage.getItem('isLoggedIn') === 'true';
    const token = localStorage.getItem('token');
    setIsLoggedIn(loginStatus && !!token);

    // Ambil user dari localStorage jika ada
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        setUser({
          name: userObj.nama_lengkap || userObj.name || '',
          email: userObj.email || '',
        });
      } catch {}
    } else {
      setUser({ name: '', email: '' });
    }

    // Jika belum login dan bukan di halaman login, redirect ke login
    if ((!loginStatus || !token) && pathname !== '/') {
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

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser({ name: '', email: '' });
    router.push('/');
  };
  const logoSrc = '/logo_order_kuota.png';

  return (
    <html lang="id">
      <body className="antialiased bg-[#F8FAFB]">
        <div className="flex min-h-screen">
          {isLoggedIn && pathname !== '/' && (
            <Sidebar 
              menus={menus} 
              user={{
                ...user,
                onSetting: () => {},
                onLogout: handleLogout,
              }} 
              logoSrc={logoSrc} 
              isVisible={sidebarVisible}
              onToggle={() => setSidebarVisible(!sidebarVisible)}
            />
          )}
          <main className={`flex-1 transition-all duration-300 ${isLoggedIn && pathname !== '/' ? 'p-8 pt-[64px]' : ''} w-full lg:w-[100vh]`}>
            {/* Header dengan toggle button dan user info */}
            {isLoggedIn && pathname !== '/' && (
              <>
                <Header 
                  sidebarVisible={sidebarVisible}
                  onToggleSidebar={() => setSidebarVisible(!sidebarVisible)}
                  user={{
                    ...user,
                    onSetting: () => {},
                    onLogout: handleLogout,
                  }}
                />
                <div className="bg-[transparent] px-0 py-2 w-full">
                  <Breadcrumb items={generateBreadcrumbItems(pathname)} />
                </div>
              </>
            )}
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

// Helper untuk generate breadcrumb dari pathname
function generateBreadcrumbItems(pathname) {
  if (!pathname || pathname === '/') return [];
  const pathArr = pathname.split('/').filter(Boolean);
  const mapping = {
    'transaction-fail': 'Transaksi Gagal',
    'transaction-pending': 'Transaksi Pending',
    'transaction-success': 'Transaksi Sukses',
    'transaction-complaint': 'Komplain Transaksi',
    'products-best-selling': 'Produk Terlaris',
    'monitor-transaction': 'Monitor Transaksi',
    'monitor-qris': 'Monitor QRIS',
    'supplier': 'Supplier',
    'compare': 'Perbandingan',
    'detail': 'Detail',
    'vo-id-kode-(deleted)': 'VO ID Kode',
  };
  let href = '';
  return pathArr.map((slug, idx) => {
    href += '/' + slug;
    const isLast = idx === pathArr.length - 1;
    let label = mapping[slug] || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    // Untuk dynamic route seperti [supplier_code], tampilkan kode as is
    if (slug.startsWith('[') && slug.endsWith(']')) label = slug.slice(1, -1);
    return {
      label,
      href: !isLast ? href : undefined,
    };
  });
}
