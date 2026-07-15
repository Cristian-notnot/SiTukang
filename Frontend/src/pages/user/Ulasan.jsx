import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/css/Ulasan.css";
import logoImg from "../../assets/gambar/logo.jpeg";

function Ulasan() {
  const navigate = useNavigate();

  // Data awal dengan tambahan properti 'rating'
  const dataAwal = [
    { id: 1, nama: "Sari Dewi", pekerjaan: "Ibu Rumah Tangga", waktu: "3h lalu", inisial: "SD", rating: 5, teks: '"Tukangnya cepat, rapi, dan ramah. AC saya dingin lagi seperti baru. Pasti pakai SiTukang lagi!"' },
    { id: 2, nama: "Rian Pratama", pekerjaan: "Pemilik Kos", waktu: "1m lalu", inisial: "RP", rating: 5, teks: '"Booking jam 9 pagi, jam 11 sudah datang. Hasil instalasi listrik di kosan saya sangat profesional."' },
    { id: 3, nama: "Maya Putri", pekerjaan: "Arsitek", waktu: "2m lalu", inisial: "MP", rating: 5, teks: '"Saya pakai SiTukang untuk klien-klien kecil. Selalu dapat tukang yang bisa diandalkan dengan harga jelas."' },
    { id: 4, nama: "Doni Hartono", pekerjaan: "Pegawai Swasta", waktu: "5h lalu", inisial: "DH", rating: 4, teks: '"Aplikasinya mudah dipakai, transparansi harga oke. Live tracking-nya membantu."' },
    { id: 5, nama: "Citra Lestari", pekerjaan: "Manajer HRD", waktu: "1h lalu", inisial: "CL", rating: 5, teks: '"Pengecatan ruang tamu selesai tepat waktu dan tidak berantakan. Tukangnya sangat sopan dan rapi."' },
    { id: 6, nama: "Ahmad Fauzi", pekerjaan: "Pemilik Cafe", waktu: "2h lalu", inisial: "AF", rating: 5, teks: '"Pipa bocor di dapur cafe langsung teratasi malam itu juga. Penyelamat banget buat bisnis yang harus terus jalan!"' },
    { id: 7, nama: "Lina Marlina", pekerjaan: "Ibu Rumah Tangga", waktu: "1h lalu", inisial: "LM", rating: 4, teks: '"Deep cleaning untuk rumah baru sangat memuaskan. Bersih sampai ke sudut-sudut yang susah dijangkau."' },
    { id: 8, nama: "Kevin Sanjaya", pekerjaan: "Wiraswasta", waktu: "3h lalu", inisial: "KS", rating: 5, teks: '"Tukang kebunnya paham banget soal tanaman hias. Taman depan rumah jadi segar dan tertata rapi sekarang."' },
    { id: 9, nama: "Budi Santoso", pekerjaan: "Pensiunan", waktu: "4h lalu", inisial: "BS", rating: 5, teks: '"Sangat membantu orang tua seperti saya yang sudah tidak kuat perbaiki genteng bocor. Tukangnya jujur dan telaten."' }
  ];

  const [daftarUlasan, setDaftarUlasan] = useState(dataAwal);
  const [showModal, setShowModal] = useState(false);
  const [newReview, setNewReview] = useState({ nama: "", pekerjaan: "", teks: "" });
  const [rating, setRating] = useState(0); // State untuk rating yang dipilih user

  // Fungsi untuk kirim ulasan
  const handleTambahUlasan = (e) => {
    e.preventDefault();
    if (rating === 0) { alert("Pilih rating bintang dulu ya!"); return; }
    
    const ulasanBaru = {
      id: Date.now(),
      nama: newReview.nama,
      pekerjaan: newReview.pekerjaan,
      waktu: "Baru saja",
      inisial: newReview.nama.charAt(0).toUpperCase(),
      rating: rating,
      teks: `"${newReview.teks}"`
    };
    setDaftarUlasan([ulasanBaru, ...daftarUlasan]); 
    setShowModal(false);
    setNewReview({ nama: "", pekerjaan: "", teks: "" });
    setRating(0); // Reset rating setelah kirim
  };

  return (
    <div className="ulasan-wrapper">
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
      <section className="ulasan-hero">
        <div className="ulasan-hero-content">
          <span className="ulasan-tag">TESTIMONI</span>
          <h1 className="ulasan-title">Apa kata pelanggan</h1>
          <div className="ulasan-stats-row">
            <div className="stat-item"><h2>4.9<span>★</span></h2><p>Rating rata-rata dari 24.870 ulasan</p></div>
            <div className="stat-item"><h2>98%</h2><p>Pelanggan merekomendasikan</p></div>
          </div>
          <button className="btn-tulis-ulasan" onClick={() => setShowModal(true)}>+ Tulis Ulasan Anda</button>
        </div>
      </section>

      {/* GRID ULASAN */}
      <section className="ulasan-grid-section">
        <div className="ulasan-grid">
          {daftarUlasan.map((item) => (
            <div key={item.id} className="ulasan-card">
              {/* BINTANG DINAMIS */}
              <div className="stars-row">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < item.rating ? "star-filled" : "star-empty"}>★</span>
                ))}
              </div>
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

      {/* MODAL FORM */}
      {showModal && (
        <div className="modal-overlay">
          <form className="modal-content" onSubmit={handleTambahUlasan}>
            <h3>Tulis Ulasan Anda</h3>
            
            {/* 1. Rating di atas */}
            <div className="modal-rating-section">
              <p>Berikan Rating:</p>
              <div className="star-input">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span 
                    key={star} 
                    className={star <= rating ? "star-filled" : "star-empty"}
                    onClick={() => setRating(star)}
                    style={{ cursor: 'pointer', fontSize: '24px' }}
                  >★</span>
                ))}
              </div>
            </div>
            

            {/* 2. Input disusun vertikal */}
            <input type="text" placeholder="Nama Lengkap" required onChange={(e) => setNewReview({...newReview, nama: e.target.value})} />
            <input type="text" placeholder="Pekerjaan (Contoh: Arsitek)" required onChange={(e) => setNewReview({...newReview, pekerjaan: e.target.value})} />
            <textarea placeholder="Ceritakan pengalaman Anda..." required onChange={(e) => setNewReview({...newReview, teks: e.target.value})}></textarea>
            
            {/* 3. Tombol di bawah */}
            <div className="modal-actions">
              <button type="button" onClick={() => setShowModal(false)}>Batal</button>
              <button type="submit">Kirim Ulasan</button>
            </div>
          </form>
        </div>
      )}
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

export default Ulasan;