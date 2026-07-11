import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
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
  const { login } = React.useContext(AuthContext);

  const [formData, setFormData] = useState({
    nama: "",
    hp: "",
    email: "",
    bidang: "",
    password: "",
    konfirmasiPassword: ""
  });

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

      login(data.user, data.token);

      alert(data.message);
      navigate("/tukang");

    } catch (err) {
      setError(
        err.response?.data?.message || "Pendaftaran gagal"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-left">
        <div className="logo-section">
          <img src={logoImg} alt="SiTukang" className="logo-img" />
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

      <div className="register-right">
        <div className="form-container">
          <h2>Daftar sebagai Tukang</h2>
          <p className="subtitle">Verifikasi 1-3 hari kerja. Gratis pendaftaran.</p>

          {error && <div className="reg-error-message" style={{
            backgroundColor: "#fef2f2", color: "#dc2626", padding: "12px", borderRadius: "8px",
            marginBottom: "16px", border: "1px solid #fecaca", fontSize: "14px"
          }}>{error}</div>}

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="row-input">
              <div className="field-group">
                <label>Nama lengkap</label>
                <input type="text" name="nama" value={formData.nama} onChange={handleChange} required />
              </div>
              <div className="field-group">
                <label>Nomor HP</label>
                <input type="text" name="hp" value={formData.hp} onChange={handleChange} required />
              </div>
            </div>

            <div className="field-group">
              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="field-group">
              <label>Bidang keahlian</label>
              <select name="bidang" value={formData.bidang} onChange={handleChange} required>
                <option value="">Pilih kategori utama</option>
                {KATEGORI_LIST.map((k) => (
                  <option key={k.id} value={k.id}>{k.nama}</option>
                ))}
              </select>
            </div>

            <div className="field-group">
              <label>Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} minLength={8} required />
            </div>

            <div className="field-group">
              <label>Konfirmasi Password</label>
              <input
                type="password"
                name="konfirmasiPassword"
                value={formData.konfirmasiPassword}
                onChange={handleChange}
                required
                style={formData.konfirmasiPassword && formData.password !== formData.konfirmasiPassword ? { borderColor: "#dc2626" } : {}}
              />
              {formData.konfirmasiPassword && formData.password !== formData.konfirmasiPassword && (
                <small style={{ color: "#dc2626", fontSize: "12px" }}>Password tidak sama</small>
              )}
            </div>

            <div className="verification-box">
              <p>✓ Verifikasi KTP</p>
              <p>✓ Sertifikasi keahlian</p>
              <p>✓ Akun siap menerima order</p>
            </div>

            <button type="submit" className="btn-register" disabled={loading}>
              {loading ? "Memproses..." : "Lanjut ke verifikasi"}
            </button>

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
