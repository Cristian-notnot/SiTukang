import React from "react";
import { useNavigate } from "react-router-dom";
import "../../assets//css/Tentang.css"; 

// IMPORT FOTO TIM (Pastikan file foto ada di folder assets)
import imgAde from "../../assets/gambar/ade.jpeg";
import imgBruno from "../../assets/gambar/bruno.jpeg";
import imgAnnas from "../../assets/gambar/annas.jpeg";
import imgNouval from "../../assets/gambar/nouval.jpeg";
import imgCarly from "../../assets/gambar/carly.jpeg";

function Tentang() {
  const navigate = useNavigate();

  // Data Tim (5 Orang)
  const teamMembers = [
    { id: 1, name: "Nouval Al Ghifary", role: "Backend dan keseluruhan", img: imgNouval },
    { id: 2, name: "Ade Nizar Septian", role: "Backend dan UI/UX", img: imgAde },
    { id: 3, name: "Charly Agusta C.", role: "Frontend", img: imgCarly },
    { id: 4, name: "Bruno Claudio S.", role: "Ketua Project", img: imgBruno },
    { id: 5, name: "Annas Khoirul Amri", role: "Frontend", img: imgAnnas },
  ];

  return (
    <div className="tentang-wrapper">
      
      {/* NAVBAR */}
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

      {/* HERO SECTION */}
      <section className="tentang-hero">
        <span className="tentang-tag">TENTANG SITUKANG</span>
        <h1 className="tentang-title">
          Memberdayakan tukang Indonesia.<br />
          <span className="text-teal">Satu rumah pada satu waktu.</span>
        </h1>
        <p className="tentang-subtitle">
          SiTukang lahir dari satu pertanyaan sederhana: kenapa mencari tukang yang baik sesulit itu? Kami membangun jembatan transparan antara pemilik rumah dan profesional terbaik.
        </p>

        {/* STATS GRID */}
        <div className="stats-grid">
          <div className="stat-card">
            <h2>12K+</h2>
            <p>Tukang aktif</p>
          </div>
          <div className="stat-card">
            <h2>240K+</h2>
            <p>Job selesai</p>
          </div>
          <div className="stat-card">
            <h2>4.9<span className="star-icon">★</span></h2>
            <p>Rating rata-rata</p>
          </div>
          <div className="stat-card">
            <h2>34</h2>
            <p>Kota terlayani</p>
          </div>
        </div>
      </section>

      {/* MISSION & VALUES SECTION */}
      <section className="mission-values-section">
        <div className="mission-box">
          <h2>Misi kami</h2>
          <p>
            Menghadirkan layanan rumah yang transparan, terpercaya, dan adil — baik bagi pelanggan maupun tukang. Kami percaya bahwa keahlian dan kejujuran layak mendapatkan penghasilan yang stabil.
          </p>
        </div>
        
        <div className="values-box">
          <h2>Nilai kami</h2>
          <div className="values-grid">
            <div className="value-card">
              <span className="value-icon">♡</span>
              <h4>Hormat</h4>
              <p>Setiap tukang adalah profesional.</p>
            </div>
            <div className="value-card">
              <span className="value-icon">◎</span>
              <h4>Transparan</h4>
              <p>Tidak ada biaya tersembunyi.</p>
            </div>
            <div className="value-card">
              <span className="value-icon">🏅</span>
              <h4>Kualitas</h4>
              <p>Verifikasi & garansi pengerjaan.</p>
            </div>
            <div className="value-card">
              <span className="value-icon">👥</span>
              <h4>Komunitas</h4>
              <p>Membangun bersama, tumbuh bersama.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="team-section">
        <h2>Tim kami</h2>
        <div className="team-grid">
          {teamMembers.map((member) => (
            <div key={member.id} className="team-card">
              <img src={member.img} alt={member.name} className="team-photo" />
              <h4>{member.name}</h4>
              <p>{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="cta-section">
        <div className="cta-banner">
          <div className="cta-icon">💼</div>
          <h2>Bergabunglah dengan tim kami</h2>
          <p>Kami sedang merekrut di Jakarta, Bandung, dan Surabaya.</p>
          <button className="btn-cta-white">Lihat lowongan</button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer-main">
        {/* Konten Footer sama seperti halaman lainnya */}
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="nav-logo">
              <span className="logo-badge">🔨</span><span>SiTukang</span>
            </div>
            <p>Marketplace tukang terpercaya untuk rumah dan bisnis Anda di seluruh Indonesia.</p>
          </div>
          <div className="footer-col">
            <h5>Layanan</h5>
            <ul>
              <li><a href="#">Listrik</a></li><li><a href="#">AC</a></li><li><a href="#">Pipa</a></li><li><a href="#">Cat</a></li><li><a href="#">Kebersihan</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Perusahaan</h5>
            <ul>
              <li><a href="#">Tentang</a></li><li><a href="#">Karir</a></li><li><a href="#">Press</a></li><li><a href="#">Blog</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Bantuan</h5>
            <ul>
              <li><a href="#">Pusat Bantuan</a></li><li><a href="#">FAQ</a></li><li><a href="#">Hubungi</a></li><li><a href="#">Kebijakan</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Portal</h5>
            <ul>
              <li><a href="#">Admin</a></li><li><a href="#">Tukang</a></li><li><a href="#">Customer</a></li>
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

export default Tentang;