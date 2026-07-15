import React from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/css/Layanan.css";
import logoImg from "../../assets/gambar/logo.jpeg";

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
          <img src={logoImg} alt="SiTukang" className="logo-img" />
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
          <button className="btn-filled" onClick={() => navigate("/registertukang")}>Jadi Tukang</button>
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
                
                </div>
            ))}
            </div>
        </main>

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
              <li>📍 Jl. Gemah Permai I Nof.15 Sendangguwo, Tembalang, Kota Semarang, Jawa Tengah, Indonesia</li>
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

export default Layanan;