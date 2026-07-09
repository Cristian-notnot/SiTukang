# TODO - Login Admin SiTukang

- [x] Membuat halaman `LoginAdmin.jsx` dengan layout 2 kolom (kiri informasi, kanan card login) sesuai spesifikasi
- [x] Membuat stylesheet `LoginAdmin.css` dengan branding hijau-putih, input rounded-xl, button premium, animasi ringan
- [x] Menambahkan route baru `/login-admin` di `Frontend/src/App.jsx` tanpa mengubah route `/login`
- [x] Implementasi login dengan Auth API yang sama seperti `pages/auth/Login.jsx`, namun khusus admin:
  - [x] Setelah login, cek `user.role === "admin"`
  - [x] Jika bukan admin: tampilkan pesan, logout, dan tetap di halaman login
  - [x] Jika admin: navigasi ke `/admin`
- [x] Verifikasi tidak merusak fitur login user/customer
- [ ] Dokumentasi file yang diubah di akhir



