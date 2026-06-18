# MinjemDong

Aplikasi perpustakaan full-stack dengan React, Express, dan PostgreSQL.

## Struktur proyek

```text
backend/
  src/
    config/       koneksi dan bootstrap schema
    controllers/  handler HTTP
    middleware/   autentikasi, upload, dan error handling
    models/       query PostgreSQL
    routes/       definisi endpoint
    app.js        konfigurasi Express
    server.js     bootstrap database dan HTTP server

frontend/
  src/
    components/
      common/     komponen lintas halaman
      landing/    section landing page
      layout/     navbar, footer, dan public layout
    context/      state autentikasi
    data/         data demo sementara
    hooks/        reusable UI logic
    pages/        komponen halaman
    routes/       konfigurasi React Router
    services/     akses API
    styles/       stylesheet aplikasi dan halaman
```

## Menjalankan aplikasi

1. Salin `backend/.env.example` menjadi `backend/.env`, lalu sesuaikan koneksi PostgreSQL.
2. Instal dependency pada `backend` dan `frontend` dengan `npm install`.
3. Jalankan backend dengan `npm run dev`.
4. Jalankan frontend dengan `npm run dev`.

Frontend menggunakan `VITE_API_BASE_URL` bila tersedia dan kembali ke `http://localhost:3000` secara default.

## Pemeriksaan

```powershell
cd frontend
npm run check

cd ../backend
npm run check
```
