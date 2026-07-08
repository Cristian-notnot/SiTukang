import React from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/Layanan.css";

function Layanan() {
  const navigate = useNavigate();

 const daftarLayanan = [
    { id: 1, nama: "Listrik", icon: "⚡", bg: "#ff9800", count: "248" },
    { id: 2, nama: "Service AC", icon: "💨", bg: "#03a9f4", count: "184" },
    { id: 3, nama: "Tukang Pipa", icon: "🔧", bg: "#5c6bc0", count: "162" },
    { id: 4, nama: "Tukang Kayu", icon: "🔨", bg: "#795548", count: "137" },
    { id: 5, nama: "Tukang Cat", icon: "🖌️", bg: "#ec407a", count: "198" },
    { id: 6, nama: "Bangunan", icon: "🪖", bg: "#616161", count: "312" },
    { id: 7, nama: "Tukang Kebun", icon: "🍃", bg: "#10b981", count: "89" },
    { id: 8, nama: "Cleaning", icon: "✨", bg: "#00bfa5", count: "276" },
  ];

  return (
    <div className="layanan-page-wrapper">
      
      {/* NAVBAR SECTION */}
      <nav className="navbar">
        <div className="nav-logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          <span className="logo-badge">🔨</span>
          <span>SiTukang</span>
        </div>
        <ul className="nav-links">
          <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("/"); }}>Beranda</a></li>
          <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("/layanan"); }}>Layanan</a></li>
          <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("/tentang"); }}>Tentang</a></li>
          <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("/ulasan"); }}>Ulasan</a></li>
          <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("/faq"); }}>FAQ</a></li>
          <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("/kontak"); }}>Kontak</a></li>
        </ul>
        <div className="nav-buttons">
          <button className="btn-text" onClick={() => navigate("/login")}>Masuk</button>
          <button className="btn-outline" onClick={() => navigate("/register")}>Daftar</button>
          <button className="btn-filled">Jadi Tukang</button>
        </div>
      </nav>

      {/* HEADER SECTION */}
      <header className="layanan-header-section">
        <span className="layanan-tag">KATEGORI</span>
        <h1 className="layanan-title">Semua layanan</h1>
        <p className="layanan-subtitle">
          Dari instalasi listrik hingga deep cleaning. Pilih kategori untuk melihat tukang yang tersedia di kota Anda.
        </p>
      </header>
    {/* GRID LAYANAN */}
        <main className="layanan-grid-container">
            <div className="layanan-cards-grid">
            {daftarLayanan.map((item) => (
                <div key={item.id} className="layanan-card-item">
                <div className="layanan-icon-box" style={{ backgroundColor: item.bg }}>
                    {item.icon}
                </div>
                <h4>{item.nama}</h4>
                <p>{item.count} tukang tersedia • mulai Rp 55K/jam</p>
                
                {/* Tulisan ini sekarang muncul di semua card tanpa syarat */}
                <span className="lihat-tukang-link">
                    Lihat tukang <span className="arrow">➔</span>
                </span>
                
                </div>
            ))}
            </div>
        </main>

      {/* FOOTER SECTION */}
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

export default Layanan;