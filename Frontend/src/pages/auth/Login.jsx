import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

import API from "../../api/axios";
import "../../assets/login.css";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useContext(AuthContext);
    
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await API.post(
                "/auth/login",
                { email, password }
            );

            const token = response.data.token;
            const user = response.data.user;

            login(user, token);

            if (user.role === "admin") {
                navigate("/admin");
            } else if (user.role === "tukang") {
                navigate("/tukang");
            } else {
                navigate("/user");
            }
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Login gagal"
            );
        }
    };

    return (
        <div className="login-container">
            {/* SISI KIRI (HIJAU GRADIENT) */}
            <div className="left-panel">
                {/* DITAMBAHKAN: onClick agar klik logo bisa kembali ke beranda/dashboard utama */}
                <div className="logo-container" onClick={() => navigate("/user")} style={{ cursor: 'pointer' }}>
                    <span className="logo-icon">🔨</span>
                    <span className="logo-text">SiTukang</span>
                </div>
                
                <div className="left-content">
                    <h1 className="left-heading">Profesional terpercaya di ujung jari Anda</h1>
                    <p className="left-subtext">
                        Lebih dari 12.000 tukang terverifikasi siap membantu di seluruh Indonesia.
                    </p>
                    
                    <div className="stats-container">
                        <div className="stat-box">
                            <span className="stat-number">12K+</span>
                            <span className="stat-label">Tukang aktif</span>
                        </div>
                        <div className="stat-box">
                            <span className="stat-number">4.9★</span>
                            <span className="stat-label">Rating rata-rata</span>
                        </div>
                        <div className="stat-box">
                            <span className="stat-number">98%</span>
                            <span className="stat-label">Order selesai</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* SISI KANAN (FORM LOGIN PUTIH) */}
            <div className="right-panel">
                <div className="form-wrapper">
                    <h2 className="right-heading">Selamat datang kembali</h2>
                    <p className="right-subtext">Masuk untuk melanjutkan booking dan melihat order Anda.</p>

                    <form onSubmit={handleLogin} className="login-form">
                        <div className="input-group">
                            <label className="form-label">Email atau nomor HP</label>
                            <input
                                type="email"
                                placeholder="nama@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="input-group">
                            <div className="label-row">
                                <label className="form-label">Password</label>
                                <a href="#lupa" className="forgot-link">Lupa?</a>
                            </div>
                            <div className="password-container">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="form-input-password"
                                    required
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="eye-button"
                                >
                                    👁️
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="btn-masuk">
                            Masuk
                        </button>
                    </form>

                    <div className="divider-container">
                        <div className="divider-line"></div>
                        <span className="divider-text">atau</span>
                        <div className="divider-line"></div>
                    </div>

                    <button type="button" className="btn-google">
                        <span style={{ marginRight: '8px' }}>🌐</span> Lanjut dengan Google
                    </button>

                    <p className="register-text">
                        Belum punya akun? <a href="#daftar" className="register-link">Daftar</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;