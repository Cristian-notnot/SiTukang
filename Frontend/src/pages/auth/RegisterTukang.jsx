import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/css/RegisterTukang.css";

function RegisterTukang() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama: "",
    hp: "",
    email: "",
    bidang: "",
    password: ""
  });

  return (
    <div className="register-page">
      {/* BAGIAN KIRI: BRANDING & STATS */}
      <div className="register-left">
        <div className="logo-section">
          <span className="logo-icon">🔨</span> SiTukang
        </div>
        <div className="hero-text">
          <h1>Dapatkan order, atur jadwal, kembangkan bisnis</h1>
          <p>Lebih dari 12.000 tukang terverifikasi siap membantu di seluruh Indonesia.</p>
        </div>
        <div className="stats-row">
          <div className="stat-item">
            <h3>12K+</h3>
            <p>Tukang aktif</p>
          </div>
          <div className="stat-item">
            <h3>4.9 ★</h3>
            <p>Rating rata-rata</p>
          </div>
          <div className="stat-item">
            <h3>98%</h3>
            <p>Order selesai</p>
          </div>
        </div>
      </div>

      {/* BAGIAN KANAN: FORM */}
      <div className="register-right">
        <div className="form-container">
          <h2>Daftar sebagai Tukang</h2>
          <p className="subtitle">Verifikasi 1-3 hari kerja. Gratis pendaftaran.</p>
          
          <form className="register-form">
            <div className="row-input">
              <div className="field-group">
                <label>Nama lengkap</label>
                <input type="text" placeholder="" />
              </div>
              <div className="field-group">
                <label>Nomor HP</label>
                <input type="text" placeholder="" />
              </div>
            </div>

            <div className="field-group">
              <label>Email</label>
              <input type="email" placeholder="" />
            </div>

            <div className="field-group">
              <label>Bidang keahlian</label>
              <select>
                <option>Pilih kategori utama</option>
                <option>Listrik</option>
                <option>AC & Pendingin</option>
                <option>Pipa Air</option>
                <option>Pertukangan Kayu</option>
              </select>
            </div>

            <div className="field-group">
              <label>Password</label>
              <input type="password" placeholder="" />
            </div>

            <div className="verification-box">
              <p>✓ Verifikasi KTP</p>
              <p>✓ Sertifikasi keahlian</p>
              <p>✓ Akun siap menerima order</p>
            </div>

            <button type="submit" className="btn-register">Lanjut ke verifikasi</button>
            
            <p className="login-link">
              Sudah punya akun? <span onClick={() => navigate("/login")}>Masuk</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterTukang;