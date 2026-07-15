import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import API from "../../api/axios";
import "../../assets/css/login.css";

// ── Import semua gambar dari src/assets/gambar/ ───────────────
import bgRoom        from "../../assets/gambar/background login,dan register.jpeg";
import shieldIcon    from "../../assets/gambar/shield.svg";
import clockIcon     from "../../assets/gambar/clock.svg";
import badgeIcon     from "../../assets/gambar/badge.svg";
import googleIcon    from "../../assets/gambar/google.svg";
import appleIcon     from "../../assets/gambar/apple.svg";
import logoImg       from "../../assets/gambar/logo.jpeg";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail]               = useState("");
    const [password, setPassword]         = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading]       = useState(false);
    const [rememberMe, setRememberMe]     = useState(true);
    const { login }                       = useContext(AuthContext);
    const [roleTab, setRoleTab]           = useState("Customer");

    const handleLogin = async (e) => {
        e.preventDefault();
        if (isLoading) return;
        try {
            setIsLoading(true);
            const loginAs = roleTab === "Tukang" ? "tukang" : "customer";
            const response = await API.post("/auth/login", { email, password, loginAs });
            const token = response.data.token;
            const user  = response.data.user;
            login(user, token);
            if (user.role === "admin")       navigate("/admin");
            else if (user.role === "tukang") navigate("/tukang");
            else                             navigate("/user");
        } catch (error) {
            alert(error.response?.data?.message || "Login gagal");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="log-container">

            {/* ═══════════════════════════════
                PANEL KIRI (Dengan Background Baru & Gradasi CSS)
            ═══════════════════════════════ */}
            <div
                className="log-left-panel"
                style={{ 
                    backgroundImage: `linear-gradient(105deg, rgba(6, 78, 59, 0.95) 0%, rgba(6, 78, 59, 0.80) 45%, rgba(6, 78, 59, 0.30) 100%), url(${bgRoom})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat"
                }}
            >
                <div className="log-left-overlay" />

                {/* Logo */}
                <div className="log-logo-container" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
                    <div className="log-logo-icon-wrap">
                        <img src={logoImg} alt="logo" className="log-logo-img" />
                    </div>
                    <span className="log-logo-text">SiTukang</span>
                </div>

                {/* Badge */}
                <div className="log-verified-badge">
                    <img src={shieldIcon} alt="" className="log-badge-icon" />
                    12.000+ tukang terverifikasi
                </div>

                {/* Heading + Stats */}
                <div className="log-left-content">
                    <h1 className="log-left-heading">
                        Profesional terpercaya untuk{" "}
                        <span className="log-heading-accent">rumah Anda</span>
                    </h1>
                    <p className="log-left-subtext">
                        Temukan dan pesan tukang terpercaya untuk segala kebutuhan rumah Anda.
                    </p>

                    <div className="log-stats-container">
                        <div className="log-stat-box">
                            <div className="log-stat-icon-circle">
                                <img src={shieldIcon} alt="" className="log-stat-svg" />
                            </div>
                            <span className="log-stat-number">12K+</span>
                            <span className="log-stat-label">Tukang Aktif</span>
                        </div>
                        <div className="log-stat-box">
                            <div className="log-stat-icon-circle">
                                <img src={badgeIcon} alt="" className="log-stat-svg" />
                            </div>
                            <span className="log-stat-number">4.9</span>
                            <span className="log-stat-label">Rating Rata-rata</span>
                        </div>
                        <div className="log-stat-box">
                            <div className="log-stat-icon-circle">
                                <img src={clockIcon} alt="" className="log-stat-svg" />
                            </div>
                            <span className="log-stat-number">98%</span>
                            <span className="log-stat-label">Pelanggan Puas</span>
                        </div>
                    </div>
                </div>

                {/* Testimonial card */}
                <div className="log-testimonial-card">
                    <span className="log-quote-mark">"</span>
                    <p className="log-testimonial-text">
                        SiTukang sangat membantu! Tukangnya profesional dan hasilnya memuaskan.
                    </p>
                    <div className="log-testimonial-footer">
                        <span className="log-testimonial-author">– Rina, Jakarta</span>
                        <span className="log-testimonial-stars">★★★★★</span>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════
                PANEL KANAN
            ═══════════════════════════════ */}
            <div className="log-right-panel">

                {/* Form card */}
                <div className="log-form-wrapper">
                         <h2 className="log-right-heading">
                            {roleTab === "Tukang" ? "Selamat datang kembali" : "Selamat datang kembali"}
                        </h2>
                        <p className="log-right-subtext">
                            {roleTab === "Tukang" 
                                ? "Masuk sebagai Tukang — Kelola job & penghasilan Anda." 
                                : "Masuk sebagai Customer — Pesan tukang untuk kebutuhan rumah."}
                        </p>

                    {/* Role tabs */}
                    <div className="log-role-tabs">
                        <button
                            type="button"
                            className={`log-tab-btn ${roleTab === "Customer" ? "active" : ""}`}
                            onClick={() => setRoleTab("Customer")}
                        >
                            Customer
                        </button>
                        <button
                            type="button"
                            className={`log-tab-btn ${roleTab === "Tukang" ? "active" : ""}`}
                            onClick={() => setRoleTab("Tukang")}
                        >
                            Tukang
                        </button>
                    </div>

                    <form onSubmit={handleLogin} className="login-form">

                        {/* Email */}
                        <div className="log-input-group">
                            <label className="log-form-label">Email</label>
                            <div className="log-input-wrapper">
                                <span className="log-input-icon-left">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                        stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                        <polyline points="22,6 12,13 2,6"/>
                                    </svg>
                                </span>
                                <input
                                    type="email"
                                    placeholder="Masukkan email Anda"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="log-form-input"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="log-input-group">
                            <div className="log-label-row">
                                <label className="log-form-label">Password</label>
                                <span className="log-forgot-link" onClick={() => navigate("/forgot-password")}>
                                    Lupa password?
                                </span>
                            </div>
                            <div className="log-input-wrapper">
                                <span className="log-input-icon-left">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                        stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                    </svg>
                                </span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Masukkan password Anda"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="log-form-input"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="log-toggle-password-btn"
                                    aria-label={showPassword ? "Sembunyikan" : "Tampilkan"}
                                >
                                    {showPassword ? (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                            stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
                                            <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
                                            <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
                                            <line x1="2" y1="2" x2="22" y2="22"/>
                                        </svg>
                                    ) : (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                            stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                                            <circle cx="12" cy="12" r="3"/>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Ingat saya + Butuh bantuan */}
                        <div className="log-meta-row">
                            <label className="log-remember-me">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                Ingat saya
                            </label>
                            <span className="log-forgot-link">Butuh bantuan?</span>
                        </div>

                        {/* Submit */}
                        <button type="submit" className="log-btn-submit" disabled={isLoading}>
                            {isLoading ? (
                                <span className="log-btn-loading">
                                    <span className="log-spinner" aria-hidden="true" />
                                    Memproses...
                                </span>
                            ) : (
                                <>
                                    Masuk sekarang
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                        stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12"/>
                                        <polyline points="12 5 19 12 12 19"/>
                                    </svg>
                                </>
                            )}
                        </button>

                        {/* Divider */}
                        <div className="log-divider">
                            <span>atau lanjut dengan</span>
                        </div>

                        {/* Social */}
                        <div className="log-social-row">
                            <button type="button" className="log-btn-social">
                                <img src={googleIcon} alt="Google" className="log-social-icon" />
                                Google
                            </button>
                            <button type="button" className="log-btn-social">
                                <img src={appleIcon} alt="Apple" className="log-social-icon" />
                                Apple
                            </button>
                        </div>
                    </form>

                    <div className="log-register-text">
                        Belum punya akun?{" "}
                        <span className="log-register-link" onClick={() => navigate("/register")}>
                            Daftar sekarang
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;