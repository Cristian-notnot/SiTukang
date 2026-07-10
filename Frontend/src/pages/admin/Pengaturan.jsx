import { useEffect, useState } from "react";
import { getPengaturan, updatePengaturan } from "../../api/adminApi";
import { useToast } from "../../components/admin/Toast";

const TABS = [
    { key: "Umum", icon: "settings" },
    { key: "Brand", icon: "palette" },
    { key: "Pembayaran", icon: "credit-card" },
    { key: "Notifikasi", icon: "bell" },
    { key: "Email", icon: "mail" },
    { key: "API", icon: "code" },
    { key: "Keamanan", icon: "shield" },
    { key: "Backup", icon: "database" },
];

const TAB_ICONS = {
    settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 0v2.5M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.36.15.69.38.97.68s.53.61.68.97Z",
    palette: "M12 22a10 10 0 1 1 10-10c0 1.93-1.57 3.5-3.5 3.5H17a2 2 0 0 0 0 4 2 2 0 0 1 0 4H12Zm-7-7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm14-4a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM12 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
    "credit-card": "M2 8h20M2 8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2M2 8v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8M6 16h4",
    bell: "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9Zm5 13a2 2 0 0 0 4 0",
    mail: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm0 0 8 8 8-8",
    code: "m16 18 6-6-6-6M8 6l-6 6 6 6",
    shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z",
    database: "M4 6c0-1.66 3.58-3 8-3s8 1.34 8 3M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6",
};

function PengaturanPage() {
    const [data, setData] = useState({
        nama_platform: "SiTukang",
        email_support: "halo@situkang.id",
        mata_uang: "IDR",
        zona_waktu: "Asia/Jakarta (WIB)",
        deskripsi: "Marketplace tukang terpercaya untuk rumah dan bisnis Anda di seluruh Indonesia.",
    });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("Umum");
    const [toggles, setToggles] = useState({
        regis_tukang: true,
        regis_customer: true,
        maintenance: false,
        notif_email: true,
    });
    const { success, error } = useToast();

    useEffect(() => { load(); }, []);

    const load = async () => {
        setLoading(true);
        try { const r = await getPengaturan(); if (r.data) setData(prev => ({ ...prev, ...r.data })); } catch (e) { console.error(e); }
        setLoading(false);
    };

    const handleSave = async () => {
        try { await updatePengaturan(data); success("Pengaturan disimpan!"); } catch (e) { error("Gagal menyimpan"); }
    };

    const toggle = (key) => setToggles(prev => ({ ...prev, [key]: !prev[key] }));

    if (loading) return <div className="page-content"><div className="loading-state"><div className="spinner"></div></div></div>;

    const renderTabContent = () => {
        switch (activeTab) {
            case "Umum":
                return (
                    <>
                        <div className="settings-section">
                            <h4 className="settings-section-title">Pengaturan umum</h4>
                            <div className="settings-grid">
                                <div className="settings-field">
                                    <label>Nama platform</label>
                                    <input type="text" value={data.nama_platform} onChange={e => setData({ ...data, nama_platform: e.target.value })} />
                                </div>
                                <div className="settings-field">
                                    <label>Email support</label>
                                    <input type="email" value={data.email_support} onChange={e => setData({ ...data, email_support: e.target.value })} />
                                </div>
                                <div className="settings-field">
                                    <label>Mata uang</label>
                                    <input type="text" value={data.mata_uang} onChange={e => setData({ ...data, mata_uang: e.target.value })} />
                                </div>
                                <div className="settings-field">
                                    <label>Zona waktu</label>
                                    <input type="text" value={data.zona_waktu} onChange={e => setData({ ...data, zona_waktu: e.target.value })} />
                                </div>
                                <div className="settings-field full">
                                    <label>Deskripsi platform</label>
                                    <textarea rows="3" value={data.deskripsi} onChange={e => setData({ ...data, deskripsi: e.target.value })} />
                                </div>
                            </div>
                        </div>

                        <div className="settings-section">
                            <h4 className="settings-section-title">Mode operasional</h4>
                            <div className="settings-toggle-list">
                                <div className="settings-toggle-row">
                                    <div className="settings-toggle-info">
                                        <div className="settings-toggle-label">Pendaftaran tukang baru</div>
                                        <div className="settings-toggle-desc">Untuk tukang baru mendaftar di platform</div>
                                    </div>
                                    <button className={`settings-toggle ${toggles.regis_tukang ? "on" : ""}`} onClick={() => toggle("regis_tukang")} aria-label="Toggle pendaftaran tukang"></button>
                                </div>
                                <div className="settings-toggle-row">
                                    <div className="settings-toggle-info">
                                        <div className="settings-toggle-label">Pendaftaran customer baru</div>
                                        <div className="settings-toggle-desc">Untuk customer baru membuat akun</div>
                                    </div>
                                    <button className={`settings-toggle ${toggles.regis_customer ? "on" : ""}`} onClick={() => toggle("regis_customer")} aria-label="Toggle pendaftaran customer"></button>
                                </div>
                                <div className="settings-toggle-row">
                                    <div className="settings-toggle-info">
                                        <div className="settings-toggle-label">Mode pemeliharaan</div>
                                        <div className="settings-toggle-desc">Tampilkan halaman maintenance untuk semua user</div>
                                    </div>
                                    <button className={`settings-toggle ${toggles.maintenance ? "on" : ""}`} onClick={() => toggle("maintenance")} aria-label="Toggle mode pemeliharaan"></button>
                                </div>
                                <div className="settings-toggle-row">
                                    <div className="settings-toggle-info">
                                        <div className="settings-toggle-label">Notifikasi email</div>
                                        <div className="settings-toggle-desc">Kirim notifikasi otomatis via email</div>
                                    </div>
                                    <button className={`settings-toggle ${toggles.notif_email ? "on" : ""}`} onClick={() => toggle("notif_email")} aria-label="Toggle notifikasi email"></button>
                                </div>
                            </div>
                        </div>
                    </>
                );
            case "Brand":
                return (
                    <div className="settings-section">
                        <h4 className="settings-section-title">Identitas brand</h4>
                        <div className="settings-grid">
                            <div className="settings-field">
                                <label>Logo platform</label>
                                <input type="file" accept="image/*" />
                            </div>
                            <div className="settings-field">
                                <label>Favicon</label>
                                <input type="file" accept="image/*" />
                            </div>
                            <div className="settings-field">
                                <label>Warna utama</label>
                                <input type="color" defaultValue="#0F766E" style={{ width: 60, height: 40, padding: 2, cursor: "pointer" }} />
                            </div>
                            <div className="settings-field">
                                <label>Warna aksen</label>
                                <input type="color" defaultValue="#14b8a6" style={{ width: 60, height: 40, padding: 2, cursor: "pointer" }} />
                            </div>
                        </div>
                    </div>
                );
            case "Pembayaran":
                return (
                    <div className="settings-section">
                        <h4 className="settings-section-title">Konfigurasi pembayaran</h4>
                        <div className="settings-grid">
                            <div className="settings-field">
                                <label>Metode pembayaran</label>
                                <select>
                                    <option>Transfer Bank</option>
                                    <option>E-Wallet</option>
                                    <option>Kartu Kredit</option>
                                </select>
                            </div>
                            <div className="settings-field">
                                <label>Biaya layanan (%)</label>
                                <input type="number" defaultValue={2.5} />
                            </div>
                            <div className="settings-field">
                                <label>Minimal penarikan</label>
                                <input type="number" defaultValue={50000} />
                            </div>
                        </div>
                    </div>
                );
            case "Notifikasi":
                return (
                    <div className="settings-section">
                        <h4 className="settings-section-title">Notifikasi</h4>
                        <div className="settings-toggle-list">
                            <div className="settings-toggle-row">
                                <div className="settings-toggle-info">
                                    <div className="settings-toggle-label">Notifikasi email</div>
                                    <div className="settings-toggle-desc">Kirim notifikasi via email</div>
                                </div>
                                <button className={`settings-toggle ${toggles.notif_email ? "on" : ""}`} onClick={() => toggle("notif_email")} aria-label="Toggle notifikasi email"></button>
                            </div>
                        </div>
                    </div>
                );
            case "Email":
                return (
                    <div className="settings-section">
                        <h4 className="settings-section-title">Konfigurasi SMTP</h4>
                        <div className="settings-grid">
                            <div className="settings-field">
                                <label>SMTP Host</label>
                                <input type="text" defaultValue="smtp.gmail.com" />
                            </div>
                            <div className="settings-field">
                                <label>SMTP Port</label>
                                <input type="number" defaultValue={587} />
                            </div>
                            <div className="settings-field">
                                <label>SMTP Username</label>
                                <input type="email" defaultValue="admin@situkang.com" />
                            </div>
                            <div className="settings-field">
                                <label>SMTP Password</label>
                                <input type="password" defaultValue="********" />
                            </div>
                        </div>
                    </div>
                );
            case "API":
                return (
                    <div className="settings-section">
                        <h4 className="settings-section-title">Akses API</h4>
                        <div className="settings-grid">
                            <div className="settings-field full">
                                <label>API Key</label>
                                <input type="text" readOnly value="sk-situkang-xxxxxxxx" style={{ background: "#f8fafc", fontFamily: "monospace" }} />
                            </div>
                            <div className="settings-field">
                                <label>Rate Limit (req/min)</label>
                                <input type="number" defaultValue={60} />
                            </div>
                        </div>
                    </div>
                );
            case "Keamanan":
                return (
                    <div className="settings-section">
                        <h4 className="settings-section-title">Pengaturan keamanan</h4>
                        <div className="settings-grid">
                            <div className="settings-field">
                                <label>Sesi kadaluarsa (menit)</label>
                                <input type="number" defaultValue={120} />
                            </div>
                            <div className="settings-field">
                                <label>Maksimal percobaan login</label>
                                <input type="number" defaultValue={5} />
                            </div>
                        </div>
                    </div>
                );
            case "Backup":
                return (
                    <div className="settings-section">
                        <h4 className="settings-section-title">Backup data</h4>
                        <div className="settings-grid">
                            <div className="settings-field">
                                <label>Periode backup</label>
                                <select>
                                    <option>Setiap Hari</option>
                                    <option>Setiap Minggu</option>
                                    <option>Setiap Bulan</option>
                                </select>
                            </div>
                            <div className="settings-field">
                                <label>Backup terakhir</label>
                                <input type="text" readOnly value="10 Juli 2026" style={{ background: "#f8fafc" }} />
                            </div>
                        </div>
                        <div style={{ marginTop: "1rem" }}>
                            <button className="btn btn-primary" onClick={() => success("Backup database dimulai (simulasi)")}>
                                Backup Sekarang
                            </button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="page-content">
            <h1 className="page-title">Pengaturan Sistem</h1>

            <div className="settings-layout">
                <div className="settings-tabs-vertical">
                    {TABS.map(tab => (
                        <button
                            key={tab.key}
                            className={`settings-tab-v ${activeTab === tab.key ? "active" : ""}`}
                            onClick={() => setActiveTab(tab.key)}
                        >
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d={TAB_ICONS[tab.icon]} />
                            </svg>
                            <span>{tab.key}</span>
                        </button>
                    ))}
                </div>

                <div className="settings-content">
                    {renderTabContent()}

                    <div className="settings-actions">
                        <button className="btn btn-secondary">Batal</button>
                        <button className="btn btn-primary" onClick={handleSave}>Simpan perubahan</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PengaturanPage;
