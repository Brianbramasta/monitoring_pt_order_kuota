'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Validasi kredensial
    if (email === 'admin@gmail.com' && password === 'admin') {
      // Simpan status login di localStorage
      localStorage.setItem('isLoggedIn', 'true');
      // Redirect ke halaman transaction-fail
      router.push('/transaction-fail');
    } else {
      setError('Email atau password salah');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFB]">
      <div className="bg-white p-8 rounded-[12px] shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Image
            src="/logo_order_kuota.png"
            alt="Logo"
            width={200}
            height={60}
            priority
          />
        </div>
        
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Login ke Dashboard
        </h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#177F7E] focus:border-transparent"
              placeholder="Masukkan email anda"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#177F7E] focus:border-transparent"
              placeholder="Masukkan password anda"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-[#177F7E] text-white py-2 px-4 rounded-md hover:bg-[#156665] focus:outline-none focus:ring-2 focus:ring-[#177F7E] focus:ring-offset-2"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
