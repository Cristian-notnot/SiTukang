import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRekomendasiTukang } from "../../api/tukangApi";
import { getLatestReviews } from "../../api/reviewApi";
import "../../assets/css/Dashboard.css";
import logoImg from "../../assets/gambar/logo.jpeg";
import deskripsiImg from "../../assets/gambar/blockart.jpeg";

function UserDashboard() {
  const navigate = useNavigate();
  const [rekomendasi, setRekomendasi] = useState([]);
  const [latestReviews, setLatestReviews] = useState([]);

  useEffect(() => {
    getRekomendasiTukang()
      .then(res => setRekomendasi(res.data || []))
      .catch(() => {});
    getLatestReviews()
      .then(res => setLatestReviews(res.data || []))
      .catch(() => {});
  }, []);

  const getInitials = (name) => {
    if (!name) return "TK";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className="dashboard-wrapper">
      {/* 1. NAVBAR SECTION */}
      <nav className="navbar">
        <div className="nav-logo">
          <img src={logoImg} alt="SiTukang" className="logo-img" />
        </div>
        <ul className="nav-links">
          <li>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/");
              }}
            >
              Beranda
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/layanan");
              }}
            >
              Layanan
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/tentang");
              }}
            >
              Tentang
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/ulasan");
              }}
            >
              Ulasan
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/faq");
              }}
            >
              FAQ
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/kontak");
              }}
            >
              Kontak
            </a>
          </li>
        </ul>
        <div className="nav-buttons">
          <button className="btn-text" onClick={() => navigate("/login")}>
            Masuk
          </button>
          <button className="btn-outline" onClick={() => navigate("/register")}>Daftar</button>
          <button className="btn-filled" onClick={() => navigate("/registertukang")}>
            Jadi Tukang
          </button>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <header className="hero-section">
        <div className="hero-left">
          <div className="verify-badge">✨ 12.000+ tukang terverifikasi</div>
          <h1 className="hero-title">
            Tukang andal,<br />
            <span>satu ketukan</span> jauhnya.
          </h1>
          <p className="hero-desc">
            Pesan profesional terpercaya untuk perbaikan rumah, AC, listrik, dan banyak lagi. Harga
            transparan, garansi pengerjaan.
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
            <div className="feature-item">
              <span>✓</span> Identitas terverifikasi
            </div>
            <div className="feature-item">
              <span>🕒</span> Datang dalam 1 jam
            </div>
            <div className="feature-item">
              <span>✓</span> Garansi 7 hari
            </div>
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
                <h3>
                  Budi Santoso <span>✓</span>
                </h3>
                <p>Tukang Listrik • 8 thn pengalaman</p>
                <div className="rating-span">
                  <span>★</span> 4.9 <span style={{ color: "#999", fontWeight: 400 }}>(312 job)</span>
                </div>
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
                <div className="price-amount">
                  Rp 75.000<span>/jam</span>
                </div>
              </div>
              <button className="btn-booking" onClick={() => navigate("/login")}>Booking Sekarang</button>
              
            </div>
          </div>
        </div>
      </header>
      {/* --- TAMBAHAN DESKRIPSI SITUKANG DISINI --- */}
{/* --- TAMBAHAN DESKRIPSI SITUKANG DISINI --- */}
      <div className="dashboard-description">
          <div className="description-img-container">
              <img src={deskripsiImg} alt="Ilustrasi Tukang" className="description-avatar" />
          </div>
          <div className="description-text">
              <h3>Solusi Praktis untuk Perbaikan Rumah</h3>
              <p>
                  <strong>SiTukang</strong> adalah platform terpercaya yang menghubungkan Anda dengan para profesional 
                  berpengalaman untuk solusi perbaikan rumah, instalasi listrik, hingga renovasi. 
                  Kami berkomitmen memberikan kemudahan akses, transparansi harga, dan kualitas 
                  kerja yang terjamin agar hunian Anda selalu dalam kondisi terbaik.
                  Kami menghadirkan sistem yang transparan untuk menghilangkan ketidakpastian dalam mencari bantuan teknis. Baik itu perbaikan listrik, AC, pipa, hingga renovasi, semua proses pengerjaan dapat Anda pantau langsung dari dashboard ini.SiTukang membuat perbaikan rumah yang dulunya rumit, kini menjadi sistematis, cepat, dan terpercaya.
              </p>
          </div>
      </div>
      {/* ------------------------------------------ */}
        
      {/* 3. LAYANAN POPULER SECTION */}
      <section className="section-container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Layanan populer</h2>
            <p className="section-subtitle">Pilih kategori tukang yang Anda butuhkan</p>
          </div>
          <a
            href="#"
            className="view-all-link"
            onClick={(e) => {
              e.preventDefault();
              navigate("/layanan");
            }}
          >
            Lihat semua ➔
          </a>
        </div>

        <div className="services-grid">
          <div className="service-card">
            <div className="icon-box" style={{ backgroundColor: "#ff9800" }}>⚡</div>
            <h4>Listrik</h4>
            <p>248 tukang tersedia</p>
          </div>
          <div className="service-card">
            <div className="icon-box" style={{ backgroundColor: "#03a9f4" }}>💨</div>
            <h4>Service AC</h4>
            <p>184 tukang tersedia</p>
          </div>
          <div className="service-card">
            <div className="icon-box" style={{ backgroundColor: "#5c6bc0" }}>🔧</div>
            <h4>Tukang Pipa</h4>
            <p>162 tukang tersedia</p>
          </div>
          <div className="service-card">
            <div className="icon-box" style={{ backgroundColor: "#c62828" }}>🔨</div>
            <h4>Tukang Kayu</h4>
            <p>137 tukang tersedia</p>
          </div>
          <div className="service-card">
            <div className="icon-box" style={{ backgroundColor: "#ec407a" }}>🖌️</div>
            <h4>Tukang Cat</h4>
            <p>198 tukang tersedia</p>
          </div>
          <div className="service-card">
            <div className="icon-box" style={{ backgroundColor: "#795548" }}>🪖</div>
            <h4>Bangunan</h4>
            <p>312 tukang tersedia</p>
          </div>
          <div className="service-card">
            <div className="icon-box" style={{ backgroundColor: "#10b981" }}>🍃</div>
            <h4>Tukang Kebun</h4>
            <p>89 tukang tersedia</p>
          </div>
          <div className="service-card">
            <div className="icon-box" style={{ backgroundColor: "#00bfa5" }}>✨</div>
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
        <div className="section-header" style={{ justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 className="section-title">Rekomendasi tukang terbaik</h2>
          </div>
          <button className="btn-cta btn-primary" onClick={() => navigate("/layanan")} style={{ padding: "8px 16px", borderRadius: 10, fontSize: 13 }}>
            Lihat semua
          </button>
        </div>
        <div className="tukang-cards-row">
          {rekomendasi.length === 0 ? (
            <p style={{ color: "#94a3b8" }}>Belum ada tukang tersedia.</p>
          ) : rekomendasi.map(t => (
            <div key={t.id} className="tukang-list-card" onClick={() => navigate(`/user/tukang/${t.id}`)} style={{ cursor: "pointer" }}>
              <div className="profile-row" style={{ marginBottom: "12px" }}>
                <div className="avatar-circle light-teal">{getInitials(t.nama)}</div>
                <div className="profile-info">
                  <h3>{t.nama} <span>✓</span></h3>
                  <p>{t.nama_kategori}</p>
                  <div className="rating-span">
                    <span>★</span> {t.rating || "0.0"} <span style={{ color: "#999", fontWeight: 400 }}>({t.pengalaman || 0} thn pengalaman)</span>
                  </div>
                </div>
              </div>
              <div className="card-divider"></div>
              <div className="card-footer-row">
                <span className="location-text">{t.alamat || "-"}</span>
                <span className="price-text-sm">{t.telepon || "-"}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. TESTIMONI SECTION */}
      <section className="bg-gray-section" style={{ textAlign: "left" }}>
        <div className="section-header" style={{ justifyContent: "flex-start" }}>
          <h2 className="section-title">Dipercaya oleh ribuan keluarga</h2>
        </div>
        <div className="testimonial-row">
          {latestReviews.length === 0 ? (
            <p style={{ color: "#94a3b8" }}>Belum ada ulasan.</p>
          ) : latestReviews.map(r => (
            <div key={r.id} className="testi-card">
              <div className="stars-row">{'★'.repeat(Math.min(Number(r.rating) || 0, 5))}{'☆'.repeat(Math.max(0, 5 - (Number(r.rating) || 0)))}</div>
              <p className="testi-comment">"{r.komentar}"</p>
              <div className="user-profile-sm">
                <div className="avatar-sm">{getInitials(r.nama_user)}</div>
                <div className="user-meta">
                  <h5>{r.nama_user}</h5>
                  <p>Pelanggan</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. GABUNG SECTION */}
      <section className="section-container">
        <div style={{ textAlign: "center" }} className="center-header">
          <span
            style={{
              backgroundColor: "#e6f4f2",
              color: "#026b5e",
              padding: "4px 12px",
              borderRadius: "12px",
              fontSize: "12px",
              fontWeight: "bold",
              }}
            >
            Mulai sekarang
          </span>
          <h2 style={{ marginTop: "10px" }}>Gabung ke SiTukang</h2>
          <p>Pilih cara Anda bergabung — sebagai pelanggan atau tukang profesional.</p>
        </div>

        <div className="join-container">
          <div className="join-box-left">
            <div className="icon-badge-circle">🔍</div>
            <h3>Saya butuh tukang</h3>
            <p>Daftar sebagai pelanggan, cari tukang terverifikasi, pesan dalam hitungan menit.</p>
            <div className="bullet-list">
              <div className="bullet-item">
                <span>✓</span> Pesan tukang 24/7
              </div>
              <div className="bullet-item">
                <span>✓</span> Harga transparan
              </div>
              <div className="bullet-item">
                <span>✓</span> Garansi pengerjaan
              </div>
              <div className="bullet-item">
                <span>✓</span> Pembayaran aman
              </div>
            </div>

            <div className="join-actions">
              {/* small portal buttons */}
              <button className="btn-action-dark" onClick={() => navigate("/login")}>
                Portal Customer ➔
              </button>
              <button className="btn-action-dark" onClick={() => navigate("/register")}>Daftar sebagai Pelanggan ➔</button>
          
            </div>
          </div>

          <div className="join-box-right">
            <div className="icon-badge-circle">🔨</div>
            <h3>Saya seorang tukang</h3>
            <p>Daftar sebagai mitra tukang. Dapatkan order, atur jadwal, kembangkan bisnis.</p>
            <div className="bullet-list">
              <div className="bullet-item">
                <span>✓</span> Order setiap hari
              </div>
              <div className="bullet-item">
                <span>✓</span> Atur jadwal sendiri
              </div>
              <div className="bullet-item">
                <span>✓</span> Pencairan cepat
              </div>
              <div className="bullet-item">
                <span>✓</span> Pelatihan & sertifikasi
              </div>
            </div>

            <div className="join-actions">
              <button className="btn-action-outline-white" onClick={() => navigate("/login")}>Portal Tukang ➔</button>
              <button className="btn-action-white" onClick={() => navigate("/registerTukang")}>Daftar sebagai Tukang ➔</button>
            </div>

           
          </div>
        </div>
      </section>

      {/* 8. FOOTER SECTION (KONTAK KAMI) */}
      <footer className="dashboard-footer" style={{ backgroundColor: "#1e293b", color: "#f8fafc", padding: "40px 60px", marginTop: "60px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "30px", maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ flex: "1", minWidth: "250px" }}>
            <h3 style={{ color: "#2dd4bf", fontSize: "20px", marginBottom: "15px" }}>SiTukang</h3>
            <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: "1.6" }}>
              Solusi digital untuk memenuhi segala kebutuhan perbaikan rumah Anda dengan cepat, aman, dan bergaransi.
            </p>
          </div>
          
          <div style={{ flex: "1", minWidth: "200px" }}>
            <h4 style={{ fontSize: "16px", marginBottom: "15px", fontWeight: "600" }}>Kontak Kami</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "14px", color: "#94a3b8", display: "flex", flexDirection: "column", gap: "10px" }}>
              <li>📍Jl. Gemah Permai I Nof.15 Sendangguwo, Tembalang, Kota Semarang, Jawa Tengah, Indonesia</li>
              <li>📞 +62 812-3456-7890 (WhatsApp)</li>
              <li>✉️ support@situkang.com</li>
              <li>🕒 Senin - Minggu: 08.00 - 20.00 WIB</li>
            </ul>
          </div>

          <div style={{ flex: "1", minWidth: "200px" }}>
            <h4 style={{ fontSize: "16px", marginBottom: "15px", fontWeight: "600" }}>Bantuan & Navigasi</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("/faq"); }} style={{ color: "#94a3b8", textDecoration: "none" }}>FAQ</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("/kontak"); }} style={{ color: "#94a3b8", textDecoration: "none" }}>Hubungi Support</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("/layanan"); }} style={{ color: "#94a3b8", textDecoration: "none" }}>Semua Layanan</a></li>
            </ul>
          </div>
        </div>

        <div style={{ borderTop: "1px solid #334155", marginTop: "40px", paddingTop: "20px", textAlign: "center", fontSize: "12px", color: "#64748b" }}>
          &copy; {new Date().getFullYear()} SiTukang. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default UserDashboard;