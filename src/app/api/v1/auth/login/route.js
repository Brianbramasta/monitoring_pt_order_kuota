import { readFileSync } from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'secretkuota2024'; // ganti di env untuk production
const DB_PATH = path.join(process.cwd(), 'db.json');

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return new Response(JSON.stringify({ message: 'Email dan password wajib diisi' }), { status: 400 });
    }
    // Baca user dari db.json
    const dbRaw = readFileSync(DB_PATH, 'utf-8');
    const db = JSON.parse(dbRaw);
    const user = db.users.find(u => u.email === email && u.password === password);
    if (!user) {
      return new Response(JSON.stringify({ message: 'Email atau password salah' }), { status: 401 });
    }
    // Generate JWT
    const token = jwt.sign({ id: user.id, email: user.email, nama_lengkap: user.nama_lengkap }, JWT_SECRET, { expiresIn: '1d' });
    return new Response(JSON.stringify({ token, user: { id: user.id, email: user.email, nama_lengkap: user.nama_lengkap } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ message: 'Terjadi kesalahan server', error: err.message }), { status: 500 });
  }
} 