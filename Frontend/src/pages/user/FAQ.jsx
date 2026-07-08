import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/FAQ.css"; 

function FAQ() {
  const navigate = useNavigate();

  // State untuk melacak data FAQ mana yang sedang terbuka (bisa dibuka-tutup)
  const [activeId, setActiveId] = useState(null);

  // Daftar data FAQ (Pertanyaan Umum seputar SiTukang)
  const faqData = [
    {
      id: 1,
      question: "Bagaimana cara memesan tukang di SiTukang?",
      answer: "Sangat mudah! Anda cukup masuk ke halaman 'Layanan', pilih kategori jasa yang Anda butuhkan (seperti Listrik, AC, atau Pipa), lalu pilih tukang yang tersedia. Klik tombol pesan dan tentukan jadwal pengerjaannya."
    },
    {
      id: 2,
      question: "Apakah harga yang tertera sudah termasuk biaya material?",
      answer: "Harga yang tertera di aplikasi umumnya adalah biaya jasa pengerjaan per jam atau per paket dasar. Untuk material atau suku cadang tambahan, Anda dapat mendiskusikannya langsung dengan tukang atau membelinya sendiri."
    },
    {
      id: 3,
      question: "Bagaimana sistem pembayaran di SiTukang?",
      answer: "Kami mendukung berbagai metode pembayaran yang aman, mulai dari transfer bank, e-wallet (Dana, Ovo, GoPay), hingga pembayaran tunai langsung ke tukang setelah pengerjaan selesai sesuai kesepakatan."
    },
    {
      id: 4,
      question: "Apakah ada garansi jika hasil pekerjaan kurang memuaskan?",
      answer: "Ya, SiTukang memberikan jaminan garansi pengerjaan selama 7 hari setelah status pekerjaan selesai. Jika ada masalah pada bagian yang sama, tim kami akan mengirimkan tukang kembali tanpa biaya tambahan."
    },
    {
      id: 5,
      question: "Bagaimana proses verifikasi para tukang yang bergabung?",
      answer: "Setiap mitra tukang wajib melalui proses seleksi yang ketat, mulai dari verifikasi identitas (KTP & SKCK), uji kompetensi/keahlian praktis, hingga pelatihan standar pelayanan agar pengerjaan selalu profesional dan sopan."
    },
    {
      id: 6,
      question: "Bagaimana jika saya ingin membatalkan pesanan?",
      answer: "Pembatalan pesanan dapat dilakukan gratis minimal 2 jam sebelum jadwal pengerjaan dimulai melalui halaman riwayat transaksi di akun Anda. Pembatalan mendadak dapat dikenakan biaya administrasi ringan untuk kompensasi waktu tukang."
    }
  ];

  // Fungsi untuk handle klik pada item FAQ
  const toggleFaq = (id) => {
    if (activeId === id) {
      setActiveId(null); // Jika diklik lagi pada item yang sama, maka tertutup
    } else {
      setActiveId(id); // Buka item yang diklik
    }
  };

  return (
    <div className="faq-wrapper">
      
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

      {/* HERO / HEADER SECTION */}
      <section className="faq-hero">
        <span className="faq-tag">PERTANYAAN UMUM</span>
        <h1 className="faq-title">Ada yang bisa kami bantu?</h1>
        <p className="faq-subtitle">
          Temukan jawaban cepat untuk pertanyaan yang sering ditanyakan seputar layanan, sistem pembayaran, dan garansi SiTukang.
        </p>
      </section>

      {/* ACCORDION FAQ SECTION */}
      <section className="faq-content-section">
        <div className="faq-container">
          {faqData.map((item) => (
            <div 
              key={item.id} 
              className={`faq-item ${activeId === item.id ? "open" : ""}`}
              onClick={() => toggleFaq(item.id)}
            >
              <div className="faq-question-row">
                <h3>{item.question}</h3>
                <span className="faq-toggle-icon">
                  {activeId === item.id ? "−" : "+"}
                </span>
              </div>
              
              {/* Box Jawaban yang akan slide-down jika statusnya open */}
              <div className="faq-answer-box">
                <p>{item.answer}</p>
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

export default FAQ;