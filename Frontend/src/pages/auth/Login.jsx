import { useMemo, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import API from "../../api/axios";
import "../../assets/login.css";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const [roleTab, setRoleTab] = useState("Customer");



    const handleLogin = async (e) => {
        e.preventDefault();
        if (isLoading) return;
        try {
            setIsLoading(true);

            const response = await API.post("/auth/login", { email, password });
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
            alert(error.response?.data?.message || "Login gagal");
        } finally {
            setIsLoading(false);
        }
    };

    const roleCopy =
        roleTab === "Tukang"
            ? "Kelola job & penghasilan Anda."
            : "Pesan tukang untuk kebutuhan rumah.";

    return (
        <div className="log-container">
            {/* SISI KIRI (HIJAU GRADIENT) */}
            <div className="log-left-panel">
                <div className="log-logo-container" onClick={() => navigate("/")} style={{ cursor: 'pointer' }}>
                    <span className="log-logo-icon">🔨</span>
                    <span className="log-logo-text">SiTukang</span>
                </div>
                
                
                <div className="log-left-content">
                    <h1 className="log-left-heading">Profesional terpercaya di ujung jari Anda</h1>
                    <p className="log-left-subtext">
                        Lebih dari 12.000 tukang terverifikasi siap membantu di seluruh Indonesia.
                    </p>

                    
                    <div className="log-stats-container">
                        <div className="log-stat-box">
                            <span className="log-stat-number">12K+</span>
                            <span className="log-stat-label">Tukang aktif</span>
                        </div>
                        <div className="log-stat-box">
                            <span className="log-stat-number">4.9★</span>
                            <span className="log-stat-label">Rating rata-rata</span>
                        </div>
                        <div className="log-stat-box">
                            <span className="log-stat-number">98%</span>
                            <span className="log-stat-label">Order selesai</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* SISI KANAN (FORM LOGIN PUTIH) */}
            <div className="log-right-panel">
                <div className="log-form-wrapper">
                    
                    <h2 className="log-right-heading">Selamat datang kembali</h2>
                    <p className="log-right-subtext">Masuk sebagai {roleTab} — {roleCopy}</p>



                    {/* TABS SELECTION ROLE */}
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

                    {/* FORM LOGIN UTAMA */}
                    <form onSubmit={handleLogin} className="login-form">
                        
                        {/* INPUT EMAIL */}
                        <div className="log-input-group">
                            <div className="log-label-row">
                                <label className="log-form-label">Email</label>
                            </div>
                            <div className="log-input-wrapper">
                                <input
                                    type="email"
                                    placeholder="Masukkan@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="log-form-input"
                                    required
                                />
                                {email.includes("@") && <span className="log-valid-icon">✓</span>}
                            </div>
                        </div>

                        {/* INPUT PASSWORD */}
                        <div className="log-input-group">
                            <div className="log-label-row">
                                <label className="log-form-label">Password</label>
                                <span className="log-forgot-link" onClick={() => navigate("/forgot-password")}>Lupa?</span>
                            </div>
                            <div className="log-input-wrapper">

                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="log-form-input"
                                    required
                                />

                                
                                {/* TOMBOL MATA PERSIS SEPERTI DI GAMBAR EDITED-IMAGE.PNG */}
                                <button 
                                    type="button" 
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="log-toggle-password-btn"
                                >
                                    {showPassword ? (
                                        /* Ikon Mata Dicoret (Hide) */
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
                                            <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
                                            <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
                                            <line x1="2" y1="2" x2="22" y2="22"/>
                                        </svg>
                                    ) : (
                                        /* Ikon Mata Minimalis (Show) */
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                                            <circle cx="12" cy="12" r="3"/>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* META ROW */}
                        <div className="log-meta-row">
                            <label className="log-remember-me">
                                <input type="checkbox" defaultChecked />
                                Ingat saya
                            </label>
                            <span>Sesi aman 30 hari</span>
                        </div>

                        {/* BUTTONS */}
                        <button
                            type="submit"
                            className="log-btn-submit"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="log-btn-loading">
                                    <span className="log-spinner" aria-hidden="true" />
                                    Memproses...
                                </span>
                            ) : (
                                `Masuk sebagai ${roleTab}`
                            )}
                        </button>

                        <div className="log-divider">

                            <span>atau lanjut dengan</span>
                        </div>

                        <div className="log-social-row">
                            <button type="button" className="log-btn-social">Google</button>
                            <button type="button" class="log-btn-social">Apple</button>
                        </div>
                    </form>

                    <div className="log-register-text">
                        Belum punya akun? <span className="log-register-link" onClick={() => navigate("/register")}>Daftar sekarang</span>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Login;