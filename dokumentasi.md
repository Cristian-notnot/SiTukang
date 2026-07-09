# Dokumentasi SiTukang

## Arsitektur

```
siTukang/
├── Backend/          # Express.js API (port 5000)
├── Frontend/         # React + Vite (port 5173)
├── database/         # SQL dump + migrasi
└── dokumentasi.md    # File ini
```

**Stack:** MySQL + Express.js + React + Node.js (MERN tanpa MongoDB)

---

## Backend

### Struktur Routes

| Prefix | Middleware | Deskripsi |
|--------|-----------|-----------|
| `/api/auth` | - | Register, Login, Profile, Reset Password |
| `/api/tukang` | - (kecuali booking) | CRUD tukang, search, booking tukang |
| `/api/booking` | verifyToken | Booking user, riwayat selesai |
| `/api/reviews` | verifyToken | CRUD review + auto update rating |
| `/api/admin` | verifyToken + admin | Dashboard admin, approve tukang |
| `/api/dashbord-tukang` | verifyToken | Dashboard, riwayat, review, profil tukang |

### Autentikasi
- JWT disimpan di `localStorage` dengan key `token`
- Payload: `{ id, email, role }`
- `verifyToken` → set `req.user`
- `roleMiddleware("admin")` → cek `req.user.role`

---

## API Endpoints Lengkap

### Auth `/api/auth`
| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| POST | `/register` | - | Register user baru |
| POST | `/login` | - | Login, return JWT + user |
| GET | `/profile` | Token | Profile user login |
| PUT | `/reset-password/:id` | - | Reset password |

### Tukang `/api/tukang`
| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| GET | `/` | - | Semua tukang |
| GET | `/search?keyword=&alamat=` | - | Cari tukang |
| GET | `/:id` | - | Detail tukang |
| POST | `/register` | Token | Daftar jadi tukang (status pending) |
| GET | `/booking?status=` | Token | Booking milik tukang login |
| PUT | `/booking/:id/status` | Token | Update status booking (diterima→dikerjakan→selesai) |
| GET | `/dashboard` | Token | Statistik dashboard tukang |

### Booking `/api/booking`
| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| POST | `/` | Token | Buat booking baru |
| GET | `/my` | Token | Semua booking user login |
| GET | `/my/selesai` | Token | Booking selesai + review status |
| PUT | `/:id/status` | Token | Update status booking |
| PUT | `/:id/cancel` | Token | Batalkan booking (hanya pending) |

### Reviews `/api/reviews`
| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| POST | `/` | Token | Buat review (booking harus selesai) |
| GET | `/my` | Token | Semua review user login |
| GET | `/booking/:booking_id` | Token | Cek review per booking |
| GET | `/tukang/:tukang_id` | - | Review publik untuk tukang |

### Dashboard Tukang `/api/dashbord-tukang`
| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| GET | `/` | Token | Statistik (pending, diterima, dll) |
| GET | `/booking` | Token | Semua booking masuk |
| GET | `/riwayat?status=` | Token | Riwayat pekerjaan (filter status) |
| GET | `/review` | Token | Review dari pelanggan |
| PUT | `/update-rating` | Token | Update rating manual |
| GET | `/profil` | Token | Ambil profil tukang |
| PUT | `/profil` | Token | Update profil tukang |

### Admin `/api/admin`
| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| GET | `/dashboard` | Admin | Statistik global |
| GET | `/tukang/pending` | Admin | Tukang pending |
| GET | `/tukang` | Admin | Semua tukang |
| PUT | `/tukang/:id/approve` | Admin | Setujui tukang |
| PUT | `/tukang/:id/reject` | Admin | Tolak tukang |
| GET | `/booking` | Admin | Semua booking |
| GET | `/users` | Admin | Semua user |
| GET | `/review` | Admin | Semua review |

---

## Auto Update Rating

Setiap kali user membuat review di `POST /api/reviews`, sistem otomatis:
1. Insert ke tabel `reviews`
2. Update kolom `rating` di tabel `tukang` dengan `AVG(rating)` dari `reviews`

---

## Database

### Migrasi
Jalankan `database/migrasi.sql` untuk menambahkan kolom `status` ke tabel `tukang`:
```sql
ALTER TABLE tukang ADD COLUMN status ENUM('pending','approved','rejected') DEFAULT 'pending';
UPDATE tukang SET status = 'approved' WHERE user_id IN (1,2,3,4,5);
```

### Tabel
- **users**: id, nama, email, password, role (user/tukang/admin)
- **tukang**: id, user_id, kategori_id, telepon, alamat, deskripsi, pengalaman, rating, status (pending/approved/rejected)
- **kategori**: id, nama_kategori (AC, Listrik, Bangunan, Ledeng, Cat)
- **booking**: id, user_id, tukang_id, tanggal_booking, alamat, keluhan, status (pending/diterima/dikerjakan/selesai/ditolak/dibatalkan)
- **reviews**: id, booking_id, user_id, tukang_id, rating, komentar

---

## Frontend Routes

| Path | Page | Protected |
|------|------|-----------|
| `/` | DashboardUtama | - |
| `/login` | Login | - |
| `/register` | Register | - |
| `/layanan` / `/tentang` / `/ulasan` / `/faq` / `/kontak` | Static pages | - |
| `/user` | Home (cari tukang) | Token |
| `/user/tukang/:id` | DetailTukang | Token |
| `/user/booking/:id` | BookingPage | Token |
| `/user/my-booking` | MyBooking (riwayat + review) | Token |
| `/tukang` | Dashboard Tukang | Token |
| `/admin` | Dashboard Admin | Token |

### Alur Login
1. Login → JWT + user disimpan di localStorage
2. Redirect berdasarkan role:
   - **user** → `/user`
   - **tukang** → `/tukang`
   - **admin** → `/admin`

### Tukang Dashboard (4 Menu)
1. **Dashboard** → Statistik booking (pending, diterima, dikerjakan, selesai, ditolak, rating)
2. **Riwayat Pekerjaan** → Tabel booking + filter status
3. **Review** → Daftar review dari pelanggan
4. **Edit Profil** → Form update nama, telepon, alamat, deskripsi, pengalaman

### Admin Dashboard (6 Menu)
1. **Dashboard** → Statistik global (user, tukang, booking, review)
2. **Persetujuan Tukang** → Approve/reject pendaftaran
3. **Semua Tukang** → Daftar semua tukang
4. **Semua Booking** → Semua transaksi
5. **Pengguna** → Semua user
6. **Review** → Semua review

### User MyBooking
- Melihat semua booking
- Membatalkan booking (status pending)
- Memberi review untuk booking selesai
- Rating otomatis dari 1-5 + komentar
- Cek apakah sudah review (tidak bisa double review)