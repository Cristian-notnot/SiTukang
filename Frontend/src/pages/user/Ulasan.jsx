import React from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/css/Ulasan.css"; 

function Ulasan() {
  const navigate = useNavigate();

  // Data dummy/random untuk ulasan pelanggan
  const daftarUlasan = [
    {
      id: 1,
      nama: "Sari Dewi",
      pekerjaan: "Ibu Rumah Tangga",
      waktu: "3h lalu",
      inisial: "SD",
      teks: '"Tukangnya cepat, rapi, dan ramah. AC saya dingin lagi seperti baru. Pasti pakai SiTukang lagi!"'
    },
    {
      id: 2,
      nama: "Rian Pratama",
      pekerjaan: "Pemilik Kos",
      waktu: "1m lalu",
      inisial: "RP",
      teks: '"Booking jam 9 pagi, jam 11 sudah datang. Hasil instalasi listrik di kosan saya sangat profesional."'
    },
    {
      id: 3,
      nama: "Maya Putri",
      pekerjaan: "Arsitek",
      waktu: "2m lalu",
      inisial: "MP",
      teks: '"Saya pakai SiTukang untuk klien-klien kecil. Selalu dapat tukang yang bisa diandalkan dengan harga jelas."'
    },
    {
      id: 4,
      nama: "Doni Hartono",
      pekerjaan: "Pegawai Swasta",
      waktu: "5h lalu",
      inisial: "DH",
      teks: '"Aplikasinya mudah dipakai, transparansi harga oke. Live tracking-nya membantu."'
    },
    {
      id: 5,
      nama: "Citra Lestari",
      pekerjaan: "Manajer HRD",
      waktu: "1h lalu",
      inisial: "CL",
      teks: '"Pengecatan ruang tamu selesai tepat waktu dan tidak berantakan. Tukangnya sangat sopan dan rapi."'
    },
    {
      id: 6,
      nama: "Ahmad Fauzi",
      pekerjaan: "Pemilik Cafe",
      waktu: "2h lalu",
      inisial: "AF",
      teks: '"Pipa bocor di dapur cafe langsung teratasi malam itu juga. Penyelamat banget buat bisnis yang harus terus jalan!"'
    },
    {
      id: 7,
      nama: "Lina Marlina",
      pekerjaan: "Ibu Rumah Tangga",
      waktu: "1h lalu",
      inisial: "LM",
      teks: '"Deep cleaning untuk rumah baru sangat memuaskan. Bersih sampai ke sudut-sudut yang susah dijangkau."'
    },
    {
      id: 8,
      nama: "Kevin Sanjaya",
      pekerjaan: "Wiraswasta",
      waktu: "3h lalu",
      inisial: "KS",
      teks: '"Tukang kebunnya paham banget soal tanaman hias. Taman depan rumah jadi segar dan tertata rapi sekarang."'
    },
    {
      id: 9,
      nama: "Budi Santoso",
      pekerjaan: "Pensiunan",
      waktu: "4h lalu",
      inisial: "BS",
      teks: '"Sangat membantu orang tua seperti saya yang sudah tidak kuat perbaiki genteng bocor. Tukangnya jujur dan telaten."'
    }
  ];

  return (
    <div className="ulasan-wrapper">
      
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

      {/* HERO SECTION (Background Hijau) */}
      <section className="ulasan-hero">
        <div className="ulasan-hero-content">
          <span className="ulasan-tag">TESTIMONI</span>
          <h1 className="ulasan-title">Apa kata pelanggan</h1>
          
          <div className="ulasan-stats-row">
            <div className="stat-item">
              <h2>4.9<span>★</span></h2>
              <p>Rating rata-rata dari 24.870 ulasan</p>
            </div>
            <div className="stat-item">
              <h2>98%</h2>
              <p>Pelanggan merekomendasikan</p>
            </div>
          </div>
        </div>
      </section>

      {/* GRID ULASAN */}
      <section className="ulasan-grid-section">
        <div className="ulasan-grid">
          {daftarUlasan.map((item) => (
            <div key={item.id} className="ulasan-card">
              <div className="stars-row">★★★★★</div>
              <p className="ulasan-teks">{item.teks}</p>
              
              <div className="ulasan-divider"></div>
              
              <div className="ulasan-footer">
                <div className="ulasan-user-info">
                  <div className="ulasan-avatar">{item.inisial}</div>
                  <div className="ulasan-user-meta">
                    <h4>{item.nama}</h4>
                    <p>{item.pekerjaan}</p>
                  </div>
                </div>
                <span className="ulasan-waktu">{item.waktu}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer-main">
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

export default Ulasan;