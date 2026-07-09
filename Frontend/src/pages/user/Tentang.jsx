import React, { useState } from "react"; // Menggunakan useState untuk kontrol slider
import { useNavigate } from "react-router-dom";
import "../../assets//css/Tentang.css"; 

// IMPORT FOTO TIM (Pastikan file foto ada di folder assets)
import imgAde from "../../assets/gambar/ade.jpeg";
import imgBruno from "../../assets/gambar/bruno.jpeg";
import imgAnnas from "../../assets/gambar/annas.jpeg";
import imgNouval from "../../assets/gambar/nouval.jpeg";
import imgCarly from "../../assets/gambar/carly.jpeg";
import logoImg from "../../assets/gambar/logo.jpeg";

function Tentang() {
  const navigate = useNavigate();

  // State untuk melacak indeks slide tim yang sedang aktif
  const [currentSlide, setCurrentSlide] = useState(0);

  // Data Tim (5 Orang) + Ditambahkan Deskripsi sesuai instruksi "DESKRIPSI + NAMA + ROLE"
  const teamMembers = [
    { 
      id: 1, 
      name: "Nouval Al Ghifary", 
      role: "Backend dan keseluruhan", 
      img: imgNouval,
      description: "Fokus mengoptimalkan performa arsitektur server, manajemen database relasional, serta menjamin stabilitas integrasi seluruh sistem utama di SiTukang."
    },
    { 
      id: 2, 
      name: "Ade Nizar Septian", 
      role: "Backend dan UI/UX", 
      img: imgAde,
      description: "Menyelaraskan keindahan fungsionalitas antarmuka dengan efisiensi logika sistem backend untuk melahirkan alur pengguna yang mulus."
    },
    { 
      id: 3, 
      name: "Charly Agusta C.", 
      role: "Frontend", 
      img: imgCarly,
      description: "Bertanggung jawab mengubah desain UI/UX menjadi komponen kode web yang interaktif, responsif, serta nyaman diakses dari perangkat apa pun."
    },
    { 
      id: 4, 
      name: "Bruno Claudio S.", 
      role: "Ketua Project", 
      img: imgBruno,
      description: "Mengoordinasi manajemen proyek secara keseluruhan, menyinkronkan kerja antar-divisi, dan memastikan visi produk tercapai tepat waktu."
    },
    { 
      id: 5, 
      name: "Annas Khoirul Amri", 
      role: "Frontend", 
      img: imgAnnas,
      description: "Berfokus pada pemeliharaan performa sisi klien, optimasi rendering halaman, serta kelancaran konsumsi data dari API backend."
    },
  ];

  // Fungsi untuk menggeser slide ke kanan (Next)
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === teamMembers.length - 1 ? 0 : prev + 1));
  };

  // Fungsi untuk menggeser slide ke kiri (Prev)
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? teamMembers.length - 1 : prev - 1));
  };

  return (
    <div className="tentang-wrapper">
      
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

      {/* TEAM SECTION (SLIDER TERBELAH DIAGONAL SATU GARIS) */}
      <section className="team-slider-section">
        <div className="slider-header-centered">
          <h2>Tim kami</h2>
        </div>

        <div className="slider-wrapper-container">
          {/* Tombol Kiri */}
          <button className="slider-arrow prev-btn" onClick={prevSlide} aria-label="Previous">❮</button>

          {/* Card Slider */}
          <div className="team-slider-card">
            <div className="slider-photo-side">
              <img src={teamMembers[currentSlide].img} alt={teamMembers[currentSlide].name} className="slider-photo" />
            </div>
            <div className="slider-info-side">
              <div className="info-content-box">
                <h3 className="member-name">{teamMembers[currentSlide].name}</h3>
                <span className="member-role">{teamMembers[currentSlide].role}</span>
                <div className="member-divider"></div>
                <p className="member-description">"{teamMembers[currentSlide].description}"</p>
              </div>
            </div>
          </div>

          {/* Tombol Kanan */}
          <button className="slider-arrow next-btn" onClick={nextSlide} aria-label="Next">❯</button>
        </div>

        <div className="slider-dots">
          {teamMembers.map((_, index) => (
            <span 
              key={index} 
              className={`dot ${index === currentSlide ? "active" : ""}`}
              onClick={() => setCurrentSlide(index)}
            ></span>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Tentang;