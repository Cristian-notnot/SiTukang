import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import "../../assets/css/RegisterTukang.css";
import logoImg from "../../assets/gambar/logo.jpeg";

const KATEGORI_LIST = [
  { id: 1, nama: "Tukang AC" },
  { id: 2, nama: "Tukang Listrik" },
  { id: 3, nama: "Tukang Bangunan" },
  { id: 4, nama: "Tukang Ledeng" },
  { id: 5, nama: "Tukang Cat" }
];

function RegisterTukang() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nama: "",
    hp: "",
    email: "",
    bidang: "",
    password: "",
    konfirmasiPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showKonfirmasi, setShowKonfirmasi] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.konfirmasiPassword) {
      setError("Konfirmasi password tidak sama dengan password");
      return;
    }

    if (!formData.bidang) {
      setError("Pilih bidang keahlian");
      return;
    }

    try {
      setLoading(true);

      const response = await API.post("/auth/register-tukang", {
        nama: formData.nama,
        email: formData.email,
        password: formData.password,
        no_hp: formData.hp,
        kategori_id: Number(formData.bidang)
      });

      const data = response.data;

      alert(data.message);
      navigate("/login");

    } catch (err) {
      setError(
        err.response?.data?.message || "Pendaftaran gagal"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-tukang-page">
      {/* LEFT PANEL */}
      <div className="register-left-panel">
        <div className="left-overlay"></div>
        <div className="left-content">
          <div className="left-logo">
            <img src={logoImg} alt="SiTukang" />
            <span>SiTukang</span>
          </div>

          <div className="left-hero">
            <h1>Bergabunglah menjadi <span className="text-highlight">Tukang</span></h1>
            <p className="left-subtitle">
              Dapatkan lebih banyak pelanggan, atur jadwal kerja sesuai keinginan,
              dan kembangkan bisnis Anda bersama SiTukang.
            </p>
          </div>

          <div className="feature-list">
            <div className="feature-item">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div className="feature-text">
                <h4>Aman & Terpercaya</h4>
                <p>Tukang diverifikasi untuk keamanan pelanggan</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div className="feature-text">
                <h4>Atur Jadwal Sendiri</h4>
                <p>Kerja fleksibel sesuai waktu yang Anda inginkan</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
              <div className="feature-text">
                <h4>Kembangkan Bisnis</h4>
                <p>Dapatkan lebih banyak order dan tingkatkan penghasilan</p>
              </div>
            </div>
          </div>

          <div className="left-footer">
            <div className="avatar-stack">
              <div className="avatar-item">A</div>
              <div className="avatar-item">B</div>
              <div className="avatar-item">C</div>
              <div className="avatar-item">D</div>
              <div className="avatar-item">E</div>
              <div className="avatar-more">+12K</div>
            </div>
            <p>Lebih dari 12.000 tukang terverifikasi siap membantu di seluruh Indonesia</p>
          </div>
        </div>

        {/* Wave decoration */}
        <div className="wave-decoration">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path d="M0,32L48,42.7C96,53,192,75,288,80C384,85,480,75,576,64C672,53,768,43,864,48C960,53,1056,75,1152,80C1248,85,1344,75,1392,69.3L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"/>
          </svg>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="register-right-panel">
        <div className="form-wrapper">
          <div className="form-header">
            <div className="form-header-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <h2>Daftar sebagai Tukang</h2>
            <p>Verifikasi 1-3 hari kerja. Gratis pendaftaran.</p>
          </div>

          {error && (
            <div className="form-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Nama lengkap</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </span>
                <input type="text" name="nama" placeholder="Masukkan nama lengkap Anda" value={formData.nama} onChange={handleChange} required />
              </div>
            </div>

            <div className="input-group">
              <label>Nomor HP</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </span>
                <input type="text" name="hp" placeholder="08xxxxxxxxxx" value={formData.hp} onChange={handleChange} required />
              </div>
            </div>

            <div className="input-group">
              <label>Email</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </span>
                <input type="email" name="email" placeholder="Masukkan email Anda" value={formData.email} onChange={handleChange} required />
              </div>
            </div>

            <div className="input-group">
              <label>Bidang keahlian</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                    <line x1="8" y1="21" x2="16" y2="21"/>
                    <line x1="12" y1="17" x2="12" y2="21"/>
                  </svg>
                </span>
                <select name="bidang" value={formData.bidang} onChange={handleChange} required>
                  <option value="">Pilih kategori utama</option>
                  {KATEGORI_LIST.map((k) => (
                    <option key={k.id} value={k.id}>{k.nama}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input type={showPassword ? "text" : "password"} name="password" placeholder="Buat password" value={formData.password} onChange={handleChange} minLength={8} required />
                <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="input-group">
              <label>Konfirmasi Password</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input type={showKonfirmasi ? "text" : "password"} name="konfirmasiPassword" placeholder="Konfirmasi password" value={formData.konfirmasiPassword} onChange={handleChange} required
                  style={formData.konfirmasiPassword && formData.password !== formData.konfirmasiPassword ? { borderColor: "#dc2626" } : {}}
                />
                <button type="button" className="toggle-password" onClick={() => setShowKonfirmasi(!showKonfirmasi)} tabIndex={-1}>
                  {showKonfirmasi ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
              {formData.konfirmasiPassword && formData.password !== formData.konfirmasiPassword && (
                <span className="input-error-text">Password tidak sama</span>
              )}
            </div>

            <div className="verification-checklist">
              <div className="check-item">
                <div className="check-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <span>Verifikasi KTP</span>
              </div>
              <div className="check-item">
                <div className="check-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <span>Sertifikasi keahlian</span>
              </div>
              <div className="check-item">
                <div className="check-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <span>Akun siap menerima order</span>
              </div>
            </div>

            <button type="submit" className="btn-daftar" disabled={loading}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              {loading ? "Memproses..." : "Daftar Sekarang"}
            </button>

            <p className="login-link-text">
              Sudah punya akun? <Link to="/login">Masuk di sini</Link>
            </p>
          </form>
        </div>

        <div className="bottom-footer-bar">
          <div className="footer-bar-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span>Data Aman</span>
            <small>Informasi Anda terlindungi</small>
          </div>
          <div className="footer-bar-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span>Terverifikasi</span>
            <small>Proses verifikasi ketat</small>
          </div>
          <div className="footer-bar-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span>Dukungan 24/7</span>
            <small>Kami siap membantu Anda</small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterTukang;