import React from "react";
import { useNavigate } from "react-router-dom"; 
import "../../assets/Dashboard.css"; 

function UserDashboard() {
  const navigate = useNavigate(); 
  
  return (
    <div className="dashboard-wrapper">
      
      {/* 1. NAVBAR SECTION */}
      <nav className="navbar">
        <div className="nav-logo">
          <span className="logo-badge">🔨</span>
          <span>SiTukang</span>
        </div>
        <ul className="nav-links">
          <li><a href="#beranda" className="active">Beranda</a></li>
          <li><a href="#layanan">Layanan</a></li>
          <li><a href="#tentang">Tentang</a></li>
          <li><a href="#ulasan">Ulasan</a></li>
          <li><a href="#faq">FAQ</a></li>
          <li><a href="#kontak">Kontak</a></li>
        </ul>
        <div className="nav-buttons">
          {/* DITAMBAHKAN: onClick ke halaman login */}
          <button className="btn-text" onClick={() => navigate("/login")}>Masuk</button>
          <button className="btn-outline">Daftar</button>
          <button className="btn-filled">Jadi Tukang</button>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <header className="hero-section">
        <div className="hero-left">
          <div className="verify-badge">✨ 12.000+ tukang terverifikasi</div>
          <h1 className="hero-title">
            Tukang andal,<br /><span>satu ketukan</span> jauhnya.
          </h1>
          <p className="hero-desc">
            Pesan profesional terpercaya untuk perbaikan rumah, AC, listrik, dan banyak lagi. Harga transparan, garansi pengerjaan.
          </p>
          
          <div className="search-container">
            <div className="search-input-group">
              <span className="search-icon">🔍</span>
              <input type="text" placeholder="Mau perbaiki apa?" />
            </div>
            <div className="search-input-group">
              <span className="search-icon">📍</span>
              <input type="text" defaultValue="Jakarta Selatan" />
            </div>
            <button className="btn-search">Cari ➔</button>
          </div>

          <div className="hero-features">
            <div className="feature-item"><span>✓</span> Identitas terverifikasi</div>
            <div className="feature-item"><span>🕒</span> Datang dalam 1 jam</div>
            <div className="feature-item"><span>✓</span> Garansi 7 hari</div>
          </div>
        </div>

        <div className="hero-right">
          <div className="choice-card">
            <div className="card-tag-row">
              <span className="tag-label">TUKANG PILIHAN HARI INI</span>
              <span className="status-online">Online</span>
            </div>
            <div className="profile-row">
              <div className="avatar-circle">BS</div>
              <div className="profile-info">
                <h3>Budi Santoso <span>✓</span></h3>
                <p>Tukang Listrik • 8 thn pengalaman</p>
                <div className="rating-span"><span>★</span> 4.9 <span style={{color: '#999', fontWeight: 400}}>(312 job)</span></div>
              </div>
            </div>
            <div className="skills-row">
              <div className="skill-badge">Instalasi</div>
              <div className="skill-badge">Wiring</div>
              <div className="skill-badge">Stop kontak</div>
            </div>
            <div className="card-divider"></div>
            <div className="price-row">
              <div className="price-info">
                <p>Mulai dari</p>
                <div className="price-amount">Rp 75.000<span>/jam</span></div>
              </div>
            <button className="btn-booking" onClick={() => navigate("/login")}>Booking Sekarang</button>
            </div>
          </div>
        </div>
      </header>

      {/* 3. LAYANAN POPULER SECTION */}
      <section className="section-container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Layanan populer</h2>
            <p className="section-subtitle">Pilih kategori tukang yang Anda butuhkan</p>
          </div>
          <a href="#semua" className="view-all-link">Lihat semua ➔</a>
        </div>

        <div className="services-grid">
          <div className="service-card">
            <div className="icon-box" style={{backgroundColor: '#ff9800'}}>⚡</div>
            <h4>Listrik</h4>
            <p>248 tukang tersedia</p>
          </div>
          <div className="service-card">
            <div className="icon-box" style={{backgroundColor: '#03a9f4'}}>💨</div>
            <h4>Service AC</h4>
            <p>184 tukang tersedia</p>
          </div>
          <div className="service-card">
            <div className="icon-box" style={{backgroundColor: '#5c6bc0'}}>🔧</div>
            <h4>Tukang Pipa</h4>
            <p>162 tukang tersedia</p>
          </div>
          <div className="service-card">
            <div className="icon-box" style={{backgroundColor: '#c62828'}}>🔨</div>
            <h4>Tukang Kayu</h4>
            <p>137 tukang tersedia</p>
          </div>
          <div className="service-card">
            <div className="icon-box" style={{backgroundColor: '#ec407a'}}>🖌️</div>
            <h4>Tukang Cat</h4>
            <p>198 tukang tersedia</p>
          </div>
          <div className="service-card">
            <div className="icon-box" style={{backgroundColor: '#795548'}}>🪖</div>
            <h4>Bangunan</h4>
            <p>312 tukang tersedia</p>
          </div>
          <div className="service-card">
            <div className="icon-box" style={{backgroundColor: '#10b981'}}>🍃</div>
            <h4>Tukang Kebun</h4>
            <p>89 tukang tersedia</p>
          </div>
          <div className="service-card">
            <div className="icon-box" style={{backgroundColor: '#00bfa5'}}>✨</div>
            <h4>Cleaning</h4>
            <p>276 tukang tersedia</p>
          </div>
        </div>
      </section>

      {/* 4. CARA KERJA SECTION */}
      <section className="bg-gray-section">
        <div className="center-header">
          <h2>Cara kerja SiTukang</h2>
          <p>Tiga langkah sederhana untuk menyelesaikan pekerjaan Anda.</p>
        </div>
        <div className="steps-container">
          <div className="step-card">
            <div className="step-number">01</div>
            <h4>Pilih layanan</h4>
            <p>Telusuri kategori, baca review, bandingkan harga.</p>
          </div>
          <div className="step-card">
            <div className="step-number">02</div>
            <h4>Booking & bayar</h4>
            <p>Pilih jadwal, isi detail, bayar dengan aman di aplikasi.</p>
          </div>
          <div className="step-card">
            <div className="step-number">03</div>
            <h4>Pekerjaan selesai</h4>
            <p>Tukang datang tepat waktu, garansi 7 hari.</p>
          </div>
        </div>
      </section>

      {/* 5. TUKANG TERATAS SECTION */}
      <section className="section-container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Tukang teratas minggu ini</h2>
          </div>
        </div>
        <div className="tukang-cards-row">
          <div className="tukang-list-card">
            <div className="profile-row" style={{marginBottom: '12px'}}>
              <div className="avatar-circle light-teal">BS</div>
              <div className="profile-info">
                <h3>Budi Santoso <span>✓</span></h3>
                <p>Tukang Listrik</p>
                <div className="rating-span"><span>★</span> 4.9 <span style={{color: '#999', fontWeight: 400}}>(312 job)</span></div>
              </div>
            </div>
            <div className="card-divider"></div>
            <div className="card-footer-row">
              <span className="location-text">Jakarta Selatan</span>
              <span className="price-text-sm">Rp 75.000<span>/jam</span></span>
            </div>
          </div>

          <div className="tukang-list-card">
            <div className="profile-row" style={{marginBottom: '12px'}}>
              <div className="avatar-circle light-teal">AW</div>
              <div className="profile-info">
                <h3>Andi Wijaya <span>✓</span></h3>
                <p>Service AC</p>
                <div className="rating-span"><span>★</span> 4.8 <span style={{color: '#999', fontWeight: 400}}>(256 job)</span></div>
              </div>
            </div>
            <div className="card-divider"></div>
            <div className="card-footer-row">
              <span className="location-text">Jakarta Pusat</span>
              <span className="price-text-sm">Rp 120.000<span>/jam</span></span>
            </div>
          </div>

          <div className="tukang-list-card">
            <div className="profile-row" style={{marginBottom: '12px'}}>
              <div className="avatar-circle light-teal">SR</div>
              <div className="profile-info">
                <h3>Slamet Riyadi <span>✓</span></h3>
                <p>Tukang Pipa</p>
                <div className="rating-span"><span>★</span> 4.7 <span style={{color: '#999', fontWeight: 400}}>(189 job)</span></div>
              </div>
            </div>
            <div className="card-divider"></div>
            <div className="card-footer-row">
              <span className="location-text">Tangerang</span>
              <span className="price-text-sm">Rp 85.000<span>/jam</span></span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONI SECTION */}
      <section className="bg-gray-section" style={{textAlign: 'left'}}>
        <div className="section-header" style={{justifyContent: 'flex-start'}}>
          <h2 className="section-title">Dipercaya oleh ribuan keluarga</h2>
        </div>
        <div className="testimonial-row">
          <div className="testi-card">
            <div className="stars-row">★★★★★</div>
            <p className="testi-comment">"Tukangnya cepat, rapi, dan ramah. AC saya dingin lagi seperti baru. Pasti pakai SiTukang lagi!"</p>
            <div className="user-profile-sm">
              <div className="avatar-sm">SD</div>
              <div className="user-meta">
                <h5>Sari Dewi</h5>
                <p>Ibu Rumah Tangga</p>
              </div>
            </div>
          </div>

          <div className="testi-card">
            <div className="stars-row">★★★★★</div>
            <p className="testi-comment">"Booking jam 9 pagi, jam 11 sudah datang. Hasil instalasi listrik di kosan saya sangat profesional."</p>
            <div className="user-profile-sm">
              <div className="avatar-sm">RP</div>
              <div className="user-meta">
                <h5>Rian Pratama</h5>
                <p>Pemilik Kos</p>
              </div>
            </div>
          </div>

          <div className="testi-card">
            <div className="stars-row">★★★★★</div>
            <p className="testi-comment">"Saya pakai SiTukang untuk klien-klien kecil. Selalu dapat tukang yang bisa diandalkan dengan harga jelas."</p>
            <div className="user-profile-sm">
              <div className="avatar-sm">MP</div>
              <div className="user-meta">
                <h5>Maya Putri</h5>
                <p>Arsitek</p>
              </div>
            </div>
          </div>

          <div className="testi-card">
            <div className="stars-row">★★★★★</div>
            <p className="testi-comment">"Aplikasinya mudah dipakai, transparansi harga oke. Live tracking-nya membantu."</p>
            <div className="user-profile-sm">
              <div className="avatar-sm">DH</div>
              <div className="user-meta">
                <h5>Doni Hartono</h5>
                <p>Pegawai Swasta</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. GABUNG SECTION */}
      <section className="section-container">
        <div style={{textAlign: 'center'}} className="center-header">
          <span style={{backgroundColor: '#e6f4f2', color: '#026b5e', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold'}}>Mulai sekarang</span>
          <h2 style={{marginTop: '10px'}}>Gabung ke SiTukang</h2>
          <p>Pilih cara Anda bergabung — sebagai pelanggan atau tukang profesional.</p>
        </div>
        
        <div className="join-container">
          <div className="join-box-left">
            <div className="icon-badge-circle">🔍</div>
            <h3>Saya butuh tukang</h3>
            <p>Daftar sebagai pelanggan, cari tukang terverifikasi, pesan dalam hitungan menit.</p>
            <div className="bullet-list">
              <div className="bullet-item"><span>✓</span> Pesan tukang 24/7</div>
              <div className="bullet-item"><span>✓</span> Harga transparan</div>
              <div className="bullet-item"><span>✓</span> Garansi pengerjaan</div>
              <div className="bullet-item"><span>✓</span> Pembayaran aman</div>
            </div>
            <div className="join-actions">
              <button className="btn-action-dark">Daftar sebagai Pelanggan ➔</button>
              {/* DITAMBAHKAN: onClick & style cursor pointer pada teks pilihan */}
              <span className="side-text-link" onClick={() => navigate("/login")} style={{ cursor: "pointer" }}>
                Sudah punya akun?
              </span>
            </div>
          </div>

          <div className="join-box-right">
            <div className="icon-badge-circle">🔨</div>
            <h3>Saya seorang tukang</h3>
            <p>Daftar sebagai mitra tukang. Dapatkan order, atur jadwal, kembangkan bisnis.</p>
            <div className="bullet-list">
              <div className="bullet-item"><span>✓</span> Order setiap hari</div>
              <div className="bullet-item"><span>✓</span> Atur jadwal sendiri</div>
              <div className="bullet-item"><span>✓</span> Pencairan cepat</div>
              <div className="bullet-item"><span>✓</span> Pelatihan & sertifikasi</div>
            </div>
            <div className="join-actions">
              <button className="btn-action-white">Daftar sebagai Tukang ➔</button>
              {/* DITAMBAHKAN: onClick pada tombol mitra */}
              <button className="btn-action-outline-white" onClick={() => navigate("/login")}>
                Sudah jadi mitra?
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FOOTER SECTION */}
      <footer className="footer-main">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="nav-logo">
              <span className="logo-badge">🔨</span>
              <span>SiTukang</span>
            </div>
            <p>Marketplace tukang terpercaya untuk rumah dan bisnis Anda di seluruh Indonesia.</p>
          </div>
          <div className="footer-col">
            <h5>Layanan</h5>
            <ul>
              <li><a href="#listrik">Listrik</a></li>
              <li><a href="#ac">AC</a></li>
              <li><a href="#pipa">Pipa</a></li>
              <li><a href="#cat">Cat</a></li>
              <li><a href="#kebersihan">Kebersihan</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Perusahaan</h5>
            <ul>
              <li><a href="#tentang">Tentang</a></li>
              <li><a href="#karir">Karir</a></li>
              <li><a href="#press">Press</a></li>
              <li><a href="#blog">Blog</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Bantuan</h5>
            <ul>
              <li><a href="#bantuan">Pusat Bantuan</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#hubungi">Hubungi</a></li>
              <li><a href="#kebijakan">Kebijakan</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Portal</h5>
            <ul>
              <li><a href="#admin">Admin</a></li>
              <li><a href="#tukang">Tukang</a></li>
              <li><a href="#customer">Customer</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          © 2026 SiTukang. Dibuat dengan ❤️ di Indonesia.
        </div>
      </footer>

    </div>
  );
}

export default UserDashboard;