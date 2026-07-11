import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/css/FAQ.css";
import logoImg from "../../assets/gambar/logo.jpeg"; 

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
              <li>📍 Jl. Merdeka No. 45, Jakarta Selatan</li>
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

export default FAQ;