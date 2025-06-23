"use client";
import './globals.css';
import Sidebar from '../components/Sidebar';

// Dummy menu dan user untuk sidebar
const menus = [
  { icon: <svg width="20" height="20" fill="none" stroke="currentColor"><circle cx="10" cy="10" r="8" strokeWidth="2"/></svg>, label: 'Transaksi Gagal', active: false },
  { icon: <svg width="20" height="20" fill="none" stroke="currentColor"><circle cx="10" cy="10" r="8" strokeWidth="2"/></svg>, label: 'Transaksi Pending', active: false },
  { icon: <svg width="20" height="20" fill="none" stroke="currentColor"><circle cx="10" cy="10" r="8" strokeWidth="2"/></svg>, label: 'Transaksi Sukses', active: false },
  { icon: <svg width="20" height="20" fill="none" stroke="currentColor"><circle cx="10" cy="10" r="8" strokeWidth="2"/></svg>, label: 'Komplain Transaksi', active: false },
  { icon: <svg width="20" height="20" fill="none" stroke="currentColor"><circle cx="10" cy="10" r="8" strokeWidth="2"/></svg>, label: 'Produk Terlaris', active: false },
  { icon: <svg width="20" height="20" fill="none" stroke="currentColor"><circle cx="10" cy="10" r="8" strokeWidth="2"/></svg>, label: 'Supplier', active: false },
  { icon: <svg width="20" height="20" fill="none" stroke="currentColor"><circle cx="10" cy="10" r="8" strokeWidth="2"/></svg>, label: 'Monitor Transaksi', active: false },
  { icon: <svg width="20" height="20" fill="none" stroke="currentColor"><circle cx="10" cy="10" r="8" strokeWidth="2"/></svg>, label: 'Monitor QRIS', active: false },
];
const user = {
  name: 'Gilang Ilham',
  email: 'gilangilham@gmail.com',
  onSetting: () => {},
  onLogout: () => {},
};
const logoSrc = '/logo_order_kuota.png'; // Ganti dengan logo asli jika ada

export default function RootLayout({ children }) {
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
