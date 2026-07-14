# Dokumentasi Aplikasi SiTukang

## 1. Deskripsi Program

**SiTukang** adalah platform berbasis web untuk menghubungkan pelanggan dengan tukang profesional. Aplikasi ini memungkinkan pelanggan mencari, memesan, dan memberikan ulasan untuk berbagai layanan tukang seperti listrik, AC, bangunan, ledeng, dan pengecatan.

### Fitur Utama

- **Autentikasi** — Register & Login untuk User, Tukang, dan Admin
- **Pencarian Tukang** — Cari tukang berdasarkan kata kunci dan alamat
- **Booking/Pemesanan** — Pelanggan dapat memesan jasa tukang
- **Review & Rating** — Memberikan ulasan setelah pekerjaan selesai
- **Dashboard Tukang** — Mengelola booking masuk, riwayat pekerjaan, profil
- **Admin Panel** — Memonitoring user, tukang, booking, review, kategori, pembayaran, laporan
- **Verifikasi Tukang** — Admin menyetujui/menolak pendaftaran tukang baru

---

## 2. Tech Stack

| Layer | Teknologi |
|---|---|
| **Frontend** | React 19 + Vite 8 |
| **Backend** | Node.js + Express 5 |
| **Database** | MySQL 8.0 (via `mysql2`) |
| **Autentikasi** | bcrypt + JWT |
| **HTTP Client** | Axios |
| **Charts** | Recharts |
| **Animasi** | Framer Motion |
| **Ikon** | Lucide React, React Icons |

---

## 3. Struktur Direktori

```
C:\laragon\www\siTukang\
├── Backend/
│   ├── .env                          # Konfigurasi environment
│   ├── package.json
│   └── src/
│       ├── server.js                 # Entry point (port 5000)
│       ├── app.js                    # Setup Express & route mounting
│       ├── config/
│       │   └── db.js                 # Koneksi MySQL
│       ├── controllers/
│       │   ├── authController.js     # Register, Login, RegisterTukang, Profile
│       │   ├── tukangController.js   # CRUD Tukang, Search, Booking status
│       │   ├── bookingController.js  # CRUD Booking
│       │   ├── reviewController.js   # CRUD Review
│       │   ├── adminController.js    # Admin: Dashboard, Users, Tukang, Booking, dll
│       │   └── dashbordTukangController.js  # Dashboard Tukang
│       ├── middleware/
│       │   ├── authMiddleware.js     # Verifikasi JWT token
│       │   └── roleMiddleware.js     # Cek role user
│       └── routes/
│           ├── authRoutes.js         # /api/auth/*
│           ├── tukangRoutes.js       # /api/tukang/*
│           ├── bookingRoutes.js      # /api/booking/*
│           ├── reviewRoutes.js       # /api/reviews/*
│           ├── adminRoutes.js        # /api/admin/*
│           └── dashbordTukangRoutes.js  # /api/dashbord-tukang/*
│
├── Frontend/
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx                  # Entry point React
│       ├── App.jsx                   # Root router
│       ├── api/
│       │   ├── axios.js              # Axios instance (baseURL: /api)
│       │   ├── adminApi.js           # API Admin
│       │   ├── bookingApi.js         # API Booking
│       │   ├── reviewApi.js          # API Review
│       │   └── tukangApi.js          # API Tukang
│       ├── context/
│       │   └── AuthContext.jsx       # State autentikasi global
│       ├── layout/
│       │   └── AdminLayout.jsx       # Layout sidebar admin
│       ├── routes/
│       │   ├── AppRoutes.jsx
│       │   └── ProtectedRoute.jsx    # Guard route (cek token)
│       ├── pages/
│       │   ├── auth/                 # Login, Register, RegisterTukang
│       │   ├── user/                 # Halaman pelanggan (11 halaman)
│       │   ├── tukang/               # Dashboard Tukang
│       │   └── admin/                # Admin panel (15 halaman)
│       ├── components/
│       │   └── admin/                # Toast, Modal, DataTable, Card, Button
│       ├── assets/
│       │   ├── css/                  # 19 file stylesheet
│       │   └── gambar/               # 14 file gambar/ikon
│       └── dist/                     # Build output
│
├── database/
│   ├── situkang_db.sql               # Full dump database
│   └── migrasi.sql                   # Migrasi kolom status di tabel tukang
│
├── dokumentasi.md                    # File ini
└── .env.example
```

---

## 4. Instalasi & Menjalankan

### Prasyarat

- Node.js 18+
- MySQL 8.0
- Composer (optional)

### Langkah-langkah

#### 1. Clone & Setup Backend

```bash
cd Backend
npm install
```

Buat file `.env` (sudah tersedia):
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=situkang_db
JWT_SECRET=situkang_secret
```

#### 2. Setup Database

Import database:
```bash
mysql -u root -p < database/situkang_db.sql
mysql -u root -p < database/migrasi.sql
```

Atau buka `database/situkang_db.sql` dan jalankan di MySQL client/phpMyAdmin.

#### 3. Setup Frontend

```bash
cd Frontend
npm install
```

#### 4. Menjalankan

**Backend:**
```bash
cd Backend
npm start        # atau npm run dev (nodemon)
```
Server berjalan di `http://localhost:5000`

**Frontend:**
```bash
cd Frontend
npm run dev
```
Aplikasi berjalan di `http://localhost:5173`

> Pastikan MySQL server sedang berjalan sebelum menjalankan backend.

---

## 5. Database Schema

### Tabel `users`

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | int(11) PK, AUTO_INCREMENT | ID User |
| nama | varchar(100) | Nama lengkap |
| email | varchar(100) UNIQUE | Email |
| foto | varchar(255) | Path foto profil (nullable) |
| password | varchar(255) | Hash bcrypt |
| role | enum('user','tukang','admin') | Default: 'user' |
| created_at | timestamp | Waktu registrasi |
| updated_at | timestamp | Waktu update |

### Tabel `kategori`

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | int(11) PK | ID Kategori |
| nama_kategori | varchar(100) | Nama kategori |

**Data awal:** Tukang AC, Tukang Listrik, Tukang Bangunan, Tukang Ledeng, Tukang Cat

### Tabel `tukang`

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | int(11) PK | ID Tukang |
| user_id | int(11) FK → users.id | Referensi user |
| kategori_id | int(11) FK → kategori.id | Kategori keahlian |
| telepon | varchar(20) | Nomor HP |
| alamat | text | Alamat |
| deskripsi | text | Deskripsi/bio |
| pengalaman | int(11) | Pengalaman (tahun) |
| rating | decimal(2,1) | Rating rata-rata |
| foto | varchar(255) | Nama file foto |
| status* | enum('pending','approved','rejected') | Status verifikasi |

*Kolom `status` ditambahkan oleh `migrasi.sql`

### Tabel `booking`

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | int(11) PK | ID Booking |
| user_id | int(11) FK → users.id | Pelanggan |
| tukang_id | int(11) FK → tukang.id | Tukang yang dipesan |
| tanggal_booking | datetime | Jadwal |
| alamat | text | Alamat layanan |
| keluhan | text | Deskripsi masalah |
| status | enum('pending','diterima','dikerjakan','selesai','ditolak','dibatalkan') | Status booking |
| created_at | timestamp | Waktu booking |

### Tabel `reviews`

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | int(11) PK | ID Review |
| booking_id | int(11) | Booking terkait |
| user_id | int(11) | Pemberi review |
| tukang_id | int(11) | Tukang yang direview |
| rating | int(11) | Rating 1-5 |
| komentar | text | Teks ulasan |
| created_at | timestamp | Waktu review |

---

## 6. API Endpoints

### Autentikasi — `/api/auth`

| Method | Endpoint | Auth | Fungsi |
|---|---|---|---|
| POST | `/api/auth/register` | ✗ | Registrasi user baru |
| POST | `/api/auth/login` | ✗ | Login (body: email, password, loginAs) |
| POST | `/api/auth/register-tukang` | ✗ | Registrasi tukang (user + profil tukang) |
| GET | `/api/auth/profile` | ✓ | Lihat profil user (termasuk foto) |
| PUT | `/api/auth/profile` | ✓ | Update profil (nama, email, password) |
| PUT | `/api/auth/profile/photo` | ✓ | Upload foto profil (multipart, field: foto, max 5MB, format: jpeg/jpg/png/gif/webp/bmp/svg/tiff/ico/avif) |
| PUT | `/api/auth/reset-password/:id` | ✗ | Reset password |

### Tukang — `/api/tukang`

| Method | Endpoint | Auth | Fungsi |
|---|---|---|---|
| GET | `/api/tukang` | ✗ | Semua tukang |
| GET | `/api/tukang/search` | ✗ | Cari tukang (keyword, alamat) |
| GET | `/api/tukang/rekomendasi` | ✗ | 4 tukang approved rating tertinggi |
| GET | `/api/tukang/:id` | ✗ | Detail tukang |
| GET | `/api/tukang/booking` | ✓ | Booking masuk tukang (filter status) |
| PUT | `/api/tukang/booking/:id/status` | ✓ | Update status booking |
| GET | `/api/tukang/dashboard` | ✓ | Statistik dashboard tukang |
| POST | `/api/tukang/register` | ✓ | Daftar jadi tukang (user sudah login) |

### Booking — `/api/booking`

| Method | Endpoint | Auth | Fungsi |
|---|---|---|---|
| POST | `/api/booking` | ✓ | Buat booking baru |
| GET | `/api/booking/my` | ✓ | Booking saya |
| GET | `/api/booking/my/selesai` | ✓ | Booking selesai (dengan review) |
| PUT | `/api/booking/:id/status` | ✓ | Update status |
| PUT | `/api/booking/:id/cancel` | ✓ | Batalkan booking |

### Review — `/api/reviews`

| Method | Endpoint | Auth | Fungsi |
|---|---|---|---|
| POST | `/api/reviews` | ✓ | Buat review |
| GET | `/api/reviews/my` | ✓ | Review saya |
| GET | `/api/reviews/booking/:id` | ✓ | Review per booking |
| GET | `/api/reviews/tukang/:id` | ✗ | Review untuk tukang |

### Admin — `/api/admin` (semua require role admin)

| Method | Endpoint | Fungsi |
|---|---|---|
| GET | `/api/admin/dashboard` | Statistik dashboard |
| GET | `/api/admin/dashboard/charts` | Data chart |
| GET | `/api/admin/dashboard/recent-booking` | 10 booking terbaru |
| GET | `/api/admin/dashboard/recent-users` | 10 user terbaru |
| GET | `/api/admin/users` | Semua user (search, filter role) |
| PUT | `/api/admin/users/:id/role` | Ubah role user |
| DELETE | `/api/admin/users/:id` | Hapus user |
| GET | `/api/admin/tukang/pending` | Tukang pending verifikasi |
| GET | `/api/admin/tukang` | Semua tukang (search, filter) |
| PUT | `/api/admin/tukang/:id/approve` | **Setujui tukang** |
| PUT | `/api/admin/tukang/:id/reject` | **Tolak tukang** |
| DELETE | `/api/admin/tukang/:id` | Hapus tukang |
| GET | `/api/admin/booking` | Semua booking |
| PUT | `/api/admin/booking/:id/status` | Update status booking |
| GET | `/api/admin/kategori` | Semua kategori |
| POST | `/api/admin/kategori` | Tambah kategori |
| PUT | `/api/admin/kategori/:id` | Ubah kategori |
| DELETE | `/api/admin/kategori/:id` | Hapus kategori |
| GET | `/api/admin/laporan` | Ringkasan laporan |
| GET | `/api/admin/pengaturan` | Pengaturan platform |
| PUT | `/api/admin/pengaturan` | Simpan pengaturan |
| GET | `/api/admin/profil` | Profil admin |
| PUT | `/api/admin/profil` | Update profil admin |

### Dashboard Tukang — `/api/dashbord-tukang` (require auth)

| Method | Endpoint | Fungsi |
|---|---|---|
| GET | `/api/dashbord-tukang` | Statistik dashboard |
| GET | `/api/dashbord-tukang/booking` | Booking masuk |
| GET | `/api/dashbord-tukang/riwayat` | Riwayat pekerjaan |
| GET | `/api/dashbord-tukang/review` | Review untuk tukang |
| GET | `/api/dashbord-tukang/profil` | Profil tukang |
| PUT | `/api/dashbord-tukang/profil` | Update profil |

### Tambahan Endpoint Baru

| Method | Endpoint | Auth | Fungsi | Ditambahkan |
|---|---|---|---|---|
| GET | `/api/tukang/rekomendasi` | ✗ | 4 tukang approved dengan rating tertinggi | Sesi 3 |

### Endpoint Booking yang diperbaiki

| Method | Endpoint | Auth | Perubahan |
|---|---|---|---|
| POST | `/api/booking` | ✓ | Sekarang menerima `tanggal_booking` (datetime), `tukang_id`, `alamat`, `keluhan` |

---

## 7. Halaman Frontend

### Public (tanpa login)

| Route | Halaman | Fungsi |
|---|---|---|
| `/` | DashboardUtama | Landing page, hero, services, CTA |
| `/layanan` | Layanan | Daftar layanan/kategori |
| `/tentang` | Tentang | Tentang platform |
| `/ulasan` | Ulasan | Testimoni publik |
| `/faq` | FAQ | Pertanyaan umum |
| `/kontak` | Kontak | Form kontak |
| `/login` | Login | Login User/Tukang |
| `/login-admin` | LoginAdmin | Login Admin |
| `/register` | Register | Registrasi user |
| `/registertukang` | RegisterTukang | Registrasi tukang |

### Protected (perlu login)

| Route | Halaman | Role |
|---|---|---|
| `/user` | UserDashboard (tab: Beranda, Cari Tukang, Booking, Order Aktif, Riwayat, Chat, Notifikasi, Pembayaran, Ulasan Saya, Pengaturan) | User |
| `/user/tukang/:id` | DetailTukang | User |
| `/user/booking/:id` | BookingPage | User |
| `/user/booking/detail/:id` | DetailBooking | User |
| `/user/cari-tukang` | CariTukang (standalone) | User |
| `/user/my-booking` | MyBooking (standalone) | User |
| `/user/order-aktif` | OrderAktif (standalone) | User |
| `/user/riwayat` | Riwayat (standalone) | User |
| `/user/ulasan-saya` | UlasanSaya (standalone) | User |
| `/user/pengaturan` | Pengaturan (standalone) | User |
| `/tukang` | Dashboard (tukang) | Tukang |

### Admin Panel (role admin)

| Route | Halaman | Fungsi |
|---|---|---|
| `/admin` | Dashboard | Statistik + chart |
| `/admin/analytics` | Analytics | Analitik detail |
| `/admin/users` | Users | Manajemen user |
| `/admin/tukang/pending` | VerifikasiTukang | Setujui/tolak tukang |
| `/admin/tukang` | Tukang | Manajemen tukang |
| `/admin/booking` | Booking | Manajemen booking |
| `/admin/pembayaran` | Pembayaran | Manajemen bayar |
| `/admin/komisi` | Komisi | Manajemen komisi |
| `/admin/kategori` | Kategori | CRUD kategori |
| `/admin/laporan` | Laporan | Laporan |
| `/admin/ticket` | Ticket | Tiket support |
| `/admin/review` | ModerasiReview | Moderasi review |
| `/admin/pengaturan` | Pengaturan | Pengaturan platform |
| `/admin/profil` | ProfilAdmin | Profil admin |

---

## 8. Alur Autentikasi

### Register User
1. User isi form (nama, email, password) → `POST /api/auth/register`
2. Backend hash password (bcrypt 10 rounds) → insert ke `users` dengan `role='user'`
3. Redirect ke `/login`

### Register Tukang
1. User isi form (nama, email, password, hp, bidang) → `POST /api/auth/register-tukang`
2. Backend buat user dengan `role='tukang'` + buat record `tukang` dengan `status='pending'`
3. Auto-login (dapat JWT token) → redirect ke `/tukang`
4. Admin harus approve tukang agar muncul di pencarian

### Login
1. User submit email + password → `POST /api/auth/login` dengan `loginAs` (customer/tukang/admin)
2. Backend verifikasi password (bcrypt.compare) + validasi role
3. Generate JWT token (`{id, email, role}`) expired 1 hari
4. Frontend simpan token & user ke localStorage

### Cek Auth (Frontend)
- `AuthContext` membaca token dari localStorage
- `ProtectedRoute` redirect ke `/login` jika tidak ada token
- Setiap API call menyertakan header `Authorization: Bearer <token>`

### Cek Auth (Backend)
- `authMiddleware` ekstrak token dari header → verifikasi JWT → set `req.user`
- `roleMiddleware` cek `req.user.role` sesuai role yang diizinkan

---

## 9. Konfigurasi Environment

### Backend `.env`
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=situkang_db
JWT_SECRET=situkang_secret
```

### Frontend (`axios.js`)
```javascript
baseURL: "http://localhost:5000/api"
```

---

## 10. Ringkasan Perubahan

### Sesi 1: Registrasi Tukang + Konfirmasi Password

**Masalah:** Halaman RegisterTukang.jsx statis/tidak terhubung ke backend. Form registrasi tidak memiliki validasi konfirmasi password.

**Perubahan:**

| File | Perubahan |
|---|---|
| `Backend/src/controllers/authController.js` | Menambahkan method `registerTukang()` — membuat user dengan role 'tukang' + profil tukang + auto-login |
| `Backend/src/routes/authRoutes.js` | Menambahkan route `POST /api/auth/register-tukang` |
| `Frontend/src/pages/auth/RegisterTukang.jsx` | Rewrite total: form field terhubung ke state, handleSubmit memanggil API, validasi konfirmasi password, auto-login |
| `Frontend/src/pages/auth/Register.jsx` | Menambahkan input konfirmasi password + validasi |

### Sesi 4: UserDashboard Tab Navigation + Foto Profil + Logout

**Masalah:** Sidebar user mengarah ke halaman terpisah (pindah route) untuk setiap menu. Pengaturan tidak memiliki upload foto dan tombol logout.

**Perubahan:**

| File | Perubahan |
|---|---|
| `Frontend/src/pages/user/UserDashboard.jsx` | Rewrite total menjadi single-page dengan tab navigation (activeTab state). Semua konten (Beranda, CariTukang, Booking, OrderAktif, Riwayat, UlasanSaya, Pengaturan) dirender inline tanpa pindah halaman. Sidebar highlight otomatis sesuai tab aktif. Chat/Notifikasi/Pembayaran sebagai placeholder. Menambahkan link "Lihat Profil Tukang" di Booking, Order Aktif, dan Riwayat. Menambahkan upload foto profil + tombol Logout di Pengaturan. |
| `Frontend/src/api/userApi.js` | Menambahkan fungsi `uploadProfilePhoto()` |
| `Backend/src/controllers/authController.js` | Menambahkan method `uploadPhoto()` — upload file + hapus foto lama. `getProfile()` sekarang mengembalikan field `foto`. |
| `Backend/src/routes/authRoutes.js` | Menambahkan route `PUT /api/auth/profile/photo` dengan multer middleware (max 2MB, hanya gambar) |
| `Backend/src/app.js` | Menambahkan `express.static` untuk folder `/uploads` |
| `Backend/package.json` | Menambahkan dependency `multer` |
| `database/migrasi_foto_user.sql` | Migration: menambah kolom `foto` varchar(255) pada tabel `users` |
| `dokumentasi.md` | Update API endpoints, table schema users, protected routes, ringkasan sesi 4 |

### Sesi 3: Halaman Booking User + Rekomendasi Tukang dari Database

**Masalah:** BookingPage.jsx minimal (tanpa tanggal, tanpa info tukang). UserDashboard.jsx tidak menampilkan rekomendasi tukang dari DB. Landing page (DashboardUtama.jsx) menggunakan data dummy untuk tukang teratas.

**Perubahan:**

| File | Perubahan |
|---|---|
| `Backend/src/controllers/tukangController.js` | Menambahkan method `getRekomendasiTukang()` — query 4 tukang approved dengan rating tertinggi |
| `Backend/src/routes/tukangRoutes.js` | Menambahkan route `GET /api/tukang/rekomendasi` (sebelum `/:id` agar tidak konflik) |
| `Frontend/src/api/tukangApi.js` | Menambahkan fungsi `getRekomendasiTukang()` |
| `Frontend/src/pages/user/DashboardUtama.jsx` | Fetch data rekomendasi dari DB, menampilkan kartu tukang dinamis dengan nama, kategori, rating, alamat |
| `Frontend/src/pages/user/UserDashboard.jsx` | Menambahkan section "Rekomendasi tukang" dengan data dari DB. Stat "Order Aktif" dan "Total Booking" terhubung ke data real dari API. Memperbaiki duplikasi function. |
| `Frontend/src/pages/user/BookingPage.jsx` | Rewrite total: menampilkan info tukang (nama, kategori, rating), input datetime-local untuk tanggal booking, validasi form, styling konsisten dengan tema SiTukang |
| `dokumentasi.md` | Update endpoint baru dan ringkasan perubahan sesi 3 |

### Sesi 2: Admin Panel — Verifikasi Tukang + Integrasi Database

**Masalah:** Admin pages menggunakan kolom database yang tidak ada, filter tidak terhubung ke API, data dummy, tidak ada aksi approve/reject di halaman Tukang.

**Perubahan:**

| File | Perubahan |
|---|---|
| `Frontend/src/pages/admin/Users.jsx` | Search & filter terhubung ke API, hapus kolom "Status" palsu (tabel users tidak punya kolom status) |
| `Frontend/src/pages/admin/Tukang.jsx` | Kolom diperbaiki sesuai DB (`pengalaman`, `telepon`, `nama_kategori`). Filter status & kategori terhubung ke API + realtime dari DB. Menambahkan aksi Setujui/Tolak untuk pending tukang. |
| `Frontend/src/pages/admin/Booking.jsx` | Kolom `total_harga` & `layanan` dihapus, diganti `alamat` & `keluhan` sesuai DB |
| `Frontend/src/pages/admin/Dashboard.jsx` | Tabel "Order Terbaru" menggunakan data real dari `getRecentBooking()`. Stat cards menampilkan data real (Total User, Total Booking, Tukang Aktif, Total Review) |

---

## 11. Troubleshooting

### Database Not Connected
- Pastikan MySQL server berjalan (`net start MySQL80`)
- Cek kredensial di `Backend/.env`

### Backend Error Port 5000
- Cek apakah port sudah digunakan: `netstat -ano | findstr :5000`
- Kill proses: `taskkill /PID <pid> /F`

### CORS Error
- Pastikan backend berjalan di port 5000
- Pastikan frontend mengakses `http://localhost:5000/api`

### Login Gagal
- User seed (budi@gmail.com, dll.) menggunakan password "dummy" yang **tidak ter-hash** — gunakan user yang terdaftar via form registrasi
- Admin: daftar via seed dengan password bcrypt, atau register baru
