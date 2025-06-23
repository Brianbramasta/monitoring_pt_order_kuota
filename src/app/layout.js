"use client";
import './globals.css';
import Sidebar from '../components/Sidebar';
import { usePathname, useRouter } from 'next/navigation';

const menuList = [
  { label: 'Transaksi Gagal', path: '/transaction-fail' },
  { label: 'Transaksi Pending', path: '/transaction-pending' },
  { label: 'Transaksi Sukses', path: '/transaction-success' },
  { label: 'Komplain Transaksi', path: '/transaction-complaint' },
  { label: 'Produk Terlaris', path: '/products-best-selling' },
  { label: 'Supplier', path: '/supplier' },
  { label: 'Monitor Transaksi', path: '/monitor-transaction' },
  { label: 'Monitor QRIS', path: '/monitor-qris' },
];

const icons = [
  <svg width="20" height="20" fill="none" stroke="currentColor"><circle cx="10" cy="10" r="8" strokeWidth="2"/></svg>,
  <svg width="20" height="20" fill="none" stroke="currentColor"><circle cx="10" cy="10" r="8" strokeWidth="2"/></svg>,
  <svg width="20" height="20" fill="none" stroke="currentColor"><circle cx="10" cy="10" r="8" strokeWidth="2"/></svg>,
  <svg width="20" height="20" fill="none" stroke="currentColor"><circle cx="10" cy="10" r="8" strokeWidth="2"/></svg>,
  <svg width="20" height="20" fill="none" stroke="currentColor"><circle cx="10" cy="10" r="8" strokeWidth="2"/></svg>,
  <svg width="20" height="20" fill="none" stroke="currentColor"><circle cx="10" cy="10" r="8" strokeWidth="2"/></svg>,
  <svg width="20" height="20" fill="none" stroke="currentColor"><circle cx="10" cy="10" r="8" strokeWidth="2"/></svg>,
  <svg width="20" height="20" fill="none" stroke="currentColor"><circle cx="10" cy="10" r="8" strokeWidth="2"/></svg>,
];

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const menus = menuList.map((menu, idx) => ({
    icon: icons[idx],
    label: menu.label,
    active: pathname.startsWith(menu.path),
    onClick: () => router.push(menu.path),
  }));

  const user = {
    name: 'Gilang Ilham',
    email: 'gilangilham@gmail.com',
    onSetting: () => {},
    onLogout: () => {},
  };
  const logoSrc = '/logo_order_kuota.png';

  return (
    <html lang="id">
      <body className="antialiased bg-[#F8FAFB]">
        <div className="flex min-h-screen">
          <Sidebar menus={menus} user={user} logoSrc={logoSrc} />
          <main className="flex-1 p-8 w-full">{children}</main>
        </div>
      </body>
    </html>
  );
}
