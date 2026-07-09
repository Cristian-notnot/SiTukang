import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/css/Kontak.css";
import logoImg from "../../assets/gambar/logo.jpeg"; 

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
                <a href="#instagram" className="social-icon">📸</a>
                <a href="#facebook" className="social-icon">🌐</a>
                <a href="#linkedin" className="social-icon">👔</a>
                <a href="#twitter" className="social-icon">🐦</a>
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
    </div>
  );
}

export default Kontak;