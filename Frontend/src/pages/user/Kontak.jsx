import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/css/Kontak.css";
import logoImg from "../../assets/gambar/logo.jpeg"; 
import instagramImg from "../../assets/gambar/instagram.jpeg";
import whatsappImg from "../../assets/gambar/whatsapp.png";

function Kontak() {
  const navigate = useNavigate();

  // State untuk form input jika nanti ingin dihubungkan ke backend/API
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    telepon: "",
    pesan: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Terima kasih ${formData.nama}, pesan Anda berhasil dikirim!`);
    // Reset form setelah submit
    setFormData({ nama: "", email: "", telepon: "", pesan: "" });
  };

  return (
    <div className="kontak-wrapper">
      
      {/* NAVBAR */}
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

      {/* MAIN CONTENT SECTION */}
      <section className="kontak-container-section">
        <div className="kontak-grid">
          
          {/* KOLOM KIRI: INFO KONTAK */}
          <div className="kontak-info-column">
            <span className="kontak-tag">HUBUNGI KAMI</span>
            <h1 className="kontak-title">Mari mulai percakapan</h1>
            <p className="kontak-subtitle">
              Ada pertanyaan, masukan, atau butuh bantuan kemitraan skala besar? Tim kami siap merespon pesan Anda dalam waktu kurang dari 24 jam.
            </p>

            <div className="info-list">
              <div className="info-item">
                <span className="info-icon">📍</span>
                <div className="info-text">
                  <h4>Kantor Pusat</h4>
                  <p>Jl. Gemah Permai I Nof.15 Sendangguwo, Tembalang, Kota Semarang, Jawa Tengah, Indonesia</p>
                </div>
              </div>

              <div className="info-item">
                <span className="info-icon">📞</span>
                <div className="info-text">
                  <h4>Telepon / WhatsApp</h4>
                  <p>+62 812-3456-7890</p>
                </div>
              </div>

              <div className="info-item">
                <span className="info-icon">✉️</span>
                <div className="info-text">
                  <h4>Email Dukungan</h4>
                  <p>bantuan@situkang.co.id</p>
                </div>
              </div>
            </div>

            {/* SOSIAL MEDIA */}
            <div className="social-media-box">
              <h4>Ikuti perjalanan kami</h4>
              <div className="social-links">
                <div className="social-links" style={{ display: "flex", gap: "15px", alignItems: "center", marginTop: "15px" }}>
                  {/* Link Instagram */}
                  <a 
                    href="https://www.instagram.com/situ.kangofficial?igsh=cTdocDY0cXh2NDJh&utm_source=qr" 
                    className="social-icon" 
                    target="_blank" 
                    rel="noreferrer"
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}
                  >
                    <img src={instagramImg} alt="Instagram" style={{ width: "22px", height: "22px", objectFit: "cover", borderRadius: "4px" }} />
                  </a>

                  {/* Link WhatsApp - SEKARANG SUDAH SEJAJAR & PUNYA LINGKARAN */}
                  <a 
                    href="https://wa.me/6281234567890" 
                    className="social-icon" 
                    target="_blank" 
                    rel="noreferrer"
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}
                  >
                    <img src={whatsappImg} alt="WhatsApp" style={{ width: "22px", height: "22px", objectFit: "contain" }} />
                  </a>

                  {/* Icon sosmed lainnya */}
                  <a href="#facebook" className="social-icon" style={{ fontSize: "20px", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>🌐</a>
                  <a href="#linkedin" className="social-icon" style={{ fontSize: "20px", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>👔</a>
                  <a href="#twitter" className="social-icon" style={{ fontSize: "20px", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>🐦</a>
                </div>
              </div>
            </div>
          </div>

          {/* KOLOM KANAN: FORM KONTAK */}
          <div className="kontak-form-column">
            <div className="form-card">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="nama">Nama Lengkap</label>
                  <input 
                    type="text" 
                    id="nama" 
                    name="nama"
                    placeholder="Masukkan nama lengkap Anda"
                    value={formData.nama}
                    onChange={handleChange}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Alamat Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    placeholder="nama@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="telepon">Nomor Telepon / WA</label>
                  <input 
                    type="tel" 
                    id="telepon" 
                    name="telepon"
                    placeholder="Contoh: 0812345678xx"
                    value={formData.telepon}
                    onChange={handleChange}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="pesan">Pesan Anda</label>
                  <textarea 
                    id="pesan" 
                    name="pesan"
                    rows="5" 
                    placeholder="Tuliskan detail pertanyaan atau bantuan yang Anda butuhkan..."
                    value={formData.pesan}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn-submit-kontak">
                  Kirim Pesan
                </button>
              </form>
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

export default Kontak;