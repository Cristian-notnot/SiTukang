import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import API from "../../api/axios";

import "../../assets/css/LoginAdmin.css";

// Gambar/ikon branding yang sudah ada di project
import shieldIcon from "../../assets/gambar/shield.svg";
import logoImg from "../../assets/gambar/logo.jpeg";

function LoginAdmin() {
    const navigate = useNavigate();
    const { login, logout } = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);

    // Dummy data
    const stats = [
        { label: "Pengguna Aktif", value: "1.2K+" },
        { label: "Layanan Berjalan", value: "320" },
        { label: "Tiket Masuk", value: "48" },
    ];

    const activities = [
        "User baru mendaftar",
        "Tukang diverifikasi",
        "Pembayaran berhasil",
        "Pesanan selesai",
    ];

    const handleLogin = async (e) => {
        e.preventDefault();
        if (isLoading) return;

        try {
            setIsLoading(true);

            // Gunakan API yang sama dengan halaman login user (auth/login)
            // loginAs dipaksa ke admin agar sesuai backend.
            const response = await API.post("/auth/login", {
                email,
                password,
                loginAs: "admin",
            });

            const token = response.data.token;
            const user = response.data.user;

            // Ambil role dan verifikasi akses
            if (user?.role !== "admin") {
                alert("Akun ini tidak memiliki akses ke Admin Panel");
                logout();
                return;
            }

            login(user, token);
            navigate("/admin");
        } catch (error) {
            alert(error.response?.data?.message || "Login admin gagal");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="admin-login-page">
            <div className="admin-login-grid">
                {/* KIRI */}
                <section className="admin-login-left" aria-label="Informasi Admin Panel">
                    <div className="admin-login-left-pattern" aria-hidden="true" />

                    <div className="admin-login-left-content">
                        <div className="admin-login-badge">
                            <span className="admin-login-badge-dot" aria-hidden="true" />
                            ADMIN PANEL
                        </div>

                        <h1 className="admin-login-title">
                            Selamat Datang
                            <br />
                            <span className="admin-login-title-accent">Admin SiTukang</span>
                        </h1>

                        <p className="admin-login-desc">
                            Kelola seluruh layanan, pengguna, transaksi, dan aktivitas platform melalui dashboard admin.
                        </p>

                        <div className="admin-login-stats" role="list" aria-label="Statistik ringkas">
                            {stats.map((s) => (
                                <div key={s.label} className="admin-login-stat" role="listitem">
                                    <div className="admin-login-stat-value">{s.value}</div>
                                    <div className="admin-login-stat-label">{s.label}</div>
                                </div>
                            ))}
                        </div>

                        <div className="admin-login-activity">
                            <div className="admin-login-activity-title">Aktivitas Terbaru</div>
                            <ul className="admin-login-activity-list">
                                {activities.map((item) => (
                                    <li key={item}>
                                        <span className="admin-login-activity-check" aria-hidden="true">
                                            ✓
                                        </span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="admin-login-left-footer-card" aria-hidden="true">
                        <div className="admin-login-left-footer-row">
                            <img className="admin-login-left-footer-icon" src={shieldIcon} alt="" />
                            <div>
                                <div className="admin-login-left-footer-strong">Keamanan ditingkatkan</div>
                                <div className="admin-login-left-footer-sub">Akses admin dibatasi sesuai role.</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* KANAN */}
                <section className="admin-login-right" aria-label="Form Login Admin">
                    <div className="admin-login-card">
                        <div className="admin-login-brand" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
                            <div className="admin-login-brand-icon">
                                <img src={logoImg} alt="SiTukang" />
                            </div>
                            <div className="admin-login-brand-text">SiTukang</div>
                        </div>

                        <h2 className="admin-login-card-title">Login Admin</h2>
                        <p className="admin-login-card-subtitle">Masuk menggunakan akun administrator.</p>

                        <form className="admin-login-form" onSubmit={handleLogin}>
                            <div className="admin-login-field">
                                <label className="admin-login-label">Email</label>
                                <div className="admin-login-input-wrap">
                                    <span className="admin-login-input-icon" aria-hidden="true">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                            <polyline points="22,6 12,13 2,6" />
                                        </svg>
                                    </span>
                                    <input
                                        type="email"
                                        className="admin-login-input"
                                        placeholder="Masukkan email Anda"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="admin-login-field">
                                <div className="admin-login-label-row">
                                    <label className="admin-login-label">Password</label>
                                    <button
                                        type="button"
                                        className="admin-login-link"
                                        onClick={() => alert("Fitur Forgot Password belum tersedia di project ini.")}
                                    >
                                        Forgot Password
                                    </button>
                                </div>

                                <div className="admin-login-input-wrap">
                                    <span className="admin-login-input-icon" aria-hidden="true">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                        </svg>
                                    </span>

                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="admin-login-input"
                                        placeholder="Masukkan password Anda"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />

                                    <button
                                        type="button"
                                        className="admin-login-toggle"
                                        onClick={() => setShowPassword((v) => !v)}
                                        aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                            </div>

                            <div className="admin-login-meta">
                                <label className="admin-login-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    <span>Ingat saya</span>
                                </label>
                                <span className="admin-login-meta-empty" />
                            </div>

                            <button type="submit" className="admin-login-submit" disabled={isLoading}>
                                {isLoading ? "Memproses..." : "Masuk ke Dashboard"}
                                <span className="admin-login-submit-arrow" aria-hidden="true">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                        <polyline points="12 5 19 12 12 19" />
                                    </svg>
                                </span>
                            </button>
                        </form>

                        <button
                            type="button"
                            className="admin-login-back"
                            onClick={() => navigate("/")}
                        >
                            Kembali ke Website
                        </button>

                        <div className="admin-login-fade-note" aria-hidden="true" />
                    </div>
                </section>
            </div>
        </div>
    );
}

export default LoginAdmin;

