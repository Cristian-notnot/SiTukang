import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import "../../assets/register.css"; // Pastikan path file CSS sesuai tempat kamu menyimpannya

function Register() {
    const navigate = useNavigate();


    // State pemecahan nama sesuai visual UI desain gambar
    const [namaDepan, setNamaDepan] = useState("");
    const [namaBelakang, setNamaBelakang] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    // State tambahan pendukung UI gambar
    const [nomorHp, setNomorHp] = useState("+62");
    const [setujuSyarat, setSetujuSyarat] = useState(false);

    const passwordStrength = useMemo(() => {
        const p = password || "";
        // Heuristic yang lebih “masuk akal” untuk password umum:
        // - Panjang minimal yang bagus: >= 10
        // - Variety (huruf besar/kecil/angka/simbol) memberi bobot besar
        const lengthScore = Math.min(p.length / 10, 1);
        const hasUpper = /[A-Z]/.test(p);
        const hasLower = /[a-z]/.test(p);
        const hasNumber = /\d/.test(p);
        const hasSymbol = /[^A-Za-z0-9]/.test(p);

        const varietyCount = [hasUpper, hasLower, hasNumber, hasSymbol].filter(Boolean).length;
        const varietyScore = varietyCount / 4;

        // admin123 = cukup panjang (8? sebenarnya 8) + lower + number + upper -> harusnya minimal “Sedang/Kuat”
        const score = 0.35 * lengthScore + 0.65 * varietyScore;

        if (!p) return { label: "", score: 0, color: "#94a3b8" };
        if (score < 0.4) return { label: "Lemah", score, color: "#ef4444" };
        if (score < 0.7) return { label: "Sedang", score, color: "#f59e0b" };
        return { label: "Kuat", score, color: "#10b981" };

    }, [password]);

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!setujuSyarat) {
            alert("Kamu harus menyetujui Syarat & Privasi terlebih dahulu.");
            return;
        }

        try {

            // Menggabungkan nama depan dan belakang agar masuk ke struktur field 'nama' backend kamu
            const namaLengkap = `${namaDepan} ${namaBelakang}`.trim();

            const response = await API.post(
                "/auth/register",
                {
                    nama: namaLengkap, // Logika asli field payload dari kodemu
                    email,
                    password,
                    no_hp: nomorHp // Tambahan payload nomor HP dari UI baru
                }
            );

            alert(response.data.message);
            navigate("/login");

        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Register gagal"
            );
        }
    };

    return (
        <div className="register-container">
            
            {/* SISI KIRI: PANEL GRADIENT HIJAU */}
            <div className="reg-left-panel">
                <div className="reg-logo-container" onClick={() => navigate("/")} style={{ cursor: 'pointer' }}>
                    <span className="reg-logo-icon">🔨</span>
                    <span className="reg-logo-text">SiTukang</span>
                </div>
                
                <div className="reg-left-content">
                    <h1 className="reg-left-heading">Profesional terpercaya di ujung jari Anda</h1>
                    <p className="reg-left-subtext">
                        Lebih dari 12.000 tukang terverifikasi siap membantu di seluruh Indonesia.
                    </p>
                    
                    <div className="reg-stats-container">
                        <div className="reg-stat-box">
                            <span className="reg-stat-number">12K+</span>
                            <span className="reg-stat-label">Tukang aktif</span>
                        </div>
                        <div className="reg-stat-box">
                            <span className="reg-stat-number">4.9★</span>
                            <span className="reg-stat-label">Rating rata-rata</span>
                        </div>
                        <div className="reg-stat-box">
                            <span className="reg-stat-number">98%</span>
                            <span className="reg-stat-label">Order selesai</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* SISI KANAN: FORM REGISTRASI PUTIH */}
            <div className="reg-right-panel">
                <div className="reg-form-wrapper">
                    <h2 className="reg-right-heading">Buat akun</h2>
                    <p className="reg-right-subtext">Mulai pesan tukang dalam 2 menit.</p>

                    <form onSubmit={handleRegister} className="register-form">
                        
                        {/* Input Row Nama Depan & Belakang berdampingan */}
                        <div className="reg-input-row">
                            <div className="reg-input-group">
                                <label className="reg-form-label">Nama depan</label>
                                <input
                                    type="text"
                                    placeholder="Nama depan"
                                    value={namaDepan}
                                    onChange={(e) => setNamaDepan(e.target.value)}
                                    className="reg-form-input"
                                    required
                                />
                            </div>
                            <div className="reg-input-group">
                                <label className="reg-form-label">Nama belakang</label>
                                <input
                                    type="text"
                                    placeholder="Nama belakang"
                                    value={namaBelakang}
                                    onChange={(e) => setNamaBelakang(e.target.value)}
                                    className="reg-form-input"
                                    required
                                />
                            </div>
                        </div>

                        {/* Input Email */}
                        <div className="reg-input-group">
                            <label className="reg-form-label">Email</label>
                            <input
                                type="email"
                                placeholder="nama@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="reg-form-input"
                                required
                            />
                        </div>

                        {/* Input Nomor HP */}
                        <div className="reg-input-group">
                            <label className="reg-form-label">Nomor HP</label>
                            <input
                                type="text"
                                placeholder="+62"
                                value={nomorHp}
                                onChange={(e) => setNomorHp(e.target.value)}
                                className="reg-form-input"
                                required
                            />
                        </div>

                        {/* Input Password */}
                        <div className="reg-input-group">
                            <label className="reg-form-label">Password</label>

                            <div className="reg-password-strength-row">
                                <div className="reg-password-strength">
                                    <span className="reg-password-strength-label">Kekuatan:</span>
                                    <span className="reg-password-strength-value" style={{ color: passwordStrength.color }}>
                                        {passwordStrength.label}
                                    </span>
                                </div>
                                <div className="reg-password-meter" aria-hidden="true">
                                    <div
                                        className="reg-password-meter-fill"
                                        style={{
                                            width: `${Math.round(passwordStrength.score * 100)}%`,
                                            backgroundColor: passwordStrength.color,
                                        }}
                                    />
                                </div>
                            </div>

                            <input
                                type="password"
                                placeholder="Minimal 8 karakter"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="reg-form-input"
                                minLength={8}
                                required
                            />
                        </div>

                        {/* Checkbox Syarat & Ketentuan */}

                        <div className="reg-checkbox-group">
                            <input
                                type="checkbox"
                                id="setujuSyarat"
                                checked={setujuSyarat}
                                onChange={(e) => setSetujuSyarat(e.target.checked)}
                                className="reg-checkbox-input"
                            />
                            <label htmlFor="setujuSyarat" className="reg-checkbox-label">
                                Saya setuju dengan <a href="#syarat" className="reg-link">Syarat</a> & <a href="#privasi" className="reg-link">Privasi</a>.
                            </label>
                        </div>

                        {/* Tombol Submit Terformat Melengkung Lonjong */}
                        <button type="submit" className="reg-btn-daftar">
                            Daftar sekarang
                        </button>
                    </form>

                    <p className="reg-login-text">
                        Sudah punya akun? <span className="reg-login-link" onClick={() => navigate("/login")}>Masuk</span>
                    </p>
                </div>
            </div>

        </div>
    );
}

export default Register;