Analisis Akun Dummy & Data Dashboard SiTukang
=====================================================

Status: ✓ Seed data berhasil diimport

DATA YANG TERSEDIA:
- Users: 13 customer, 6 tukang, 1 admin
- Bookings: 9 booking
- Reviews: 5 review
- Tukang: 9 tukang

AKUN UNTUK LOGIN:

1. ADMIN DASHBOARD
   Email: admin@gmail.com
   Password: password123
   Fitur yang terlihat:
   - Dashboard dengan statistik (users, tukang, booking, reviews)
   - Daftar user dengan pencarian & filter
   - Manajemen tukang (approved, pending, rejected)
   - Manajemen booking dengan berbagai status
   - Review moderasi
   - Analytics & chart

2. CUSTOMER (User Biasa)
   Email: siti@gmail.com
   Password: password123
   Atau: rudi@gmail.com, nina@gmail.com, bambang@gmail.com, dll.
   Fitur:
   - Lihat booking saya
   - Cari tukang
   - Buat booking baru
   - Berikan review

3. TUKANG
   Email: tukang@gmail.com (sudah ada sebelumnya)
   Password: password123
   Atau: bambang.h@gmail.com (pending verifikasi), singgih@gmail.com (pending)
   Fitur:
   - Dashboard tukang
   - Lihat booking masuk
   - Update status booking
   - Lihat review/rating

BOOKMARK PENTING:

Database File: D:\Semester 4\Web Pemrograman\SiTukang\database\seed_dummy_data.sql
Seed sudah dijalankan ke database situkang_db

Untuk restart/reset database:
1. Drop & recreate: mysql -u root -e "DROP DATABASE situkang_db; CREATE DATABASE situkang_db;"
2. Import ulang: mysql -u root situkang_db < database/situkang_db.sql
3. Jalankan migrasi: mysql -u root situkang_db < database/migrasi.sql
4. Jalankan seed: mysql -u root situkang_db < database/seed_dummy_data.sql
