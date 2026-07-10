import { useEffect, useState } from "react";
import { getPengaturan, updatePengaturan } from "../../api/adminApi";
import { useToast } from "../../components/admin/Toast";

const TABS = ["Umum", "Brand", "Pembayaran", "Notifikasi", "Email", "API", "Keamanan", "Backup"];

function PengaturanPage() {
    const [data, setData] = useState({ nama_platform: "SiTukang", email_admin: "", deskripsi: "" });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("Umum");
    const [toggles, setToggles] = useState({
        notif_email: true, notif_whatsapp: false, auto_verify: true,
        maintenance: false, regis_terbuka: true, api_public: false,
        backup_auto: true, two_factor: false,
    });
    const { success, error } = useToast();

    useEffect(() => { load(); }, []);

    const load = async () => {
        setLoading(true);
        try { const r = await getPengaturan(); if (r.data) setData(r.data); } catch (e) { console.error(e); }
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
                        <div className="settings-form-group">
                            <div className="settings-form-label">
                                <span>Nama Platform</span>
                                <small>Nama yang ditampilkan di seluruh sistem</small>
                            </div>
                            <input type="text" value={data.nama_platform} onChange={e => setData({ ...data, nama_platform: e.target.value })} />
                        </div>
                        <div className="settings-form-group">
                            <div className="settings-form-label">
                                <span>Deskripsi Platform</span>
                                <small>Deskripsi singkat tentang platform</small>
                            </div>
                            <input type="text" value={data.deskripsi} onChange={e => setData({ ...data, deskripsi: e.target.value })} />
                        </div>
                        <div className="settings-form-group">
                            <div className="settings-form-label">
                                <span>Email Admin</span>
                                <small>Email untuk notifikasi sistem</small>
                            </div>
                            <input type="email" value={data.email_admin} onChange={e => setData({ ...data, email_admin: e.target.value })} />
                        </div>
                        <div className="settings-form-group">
                            <div className="settings-form-label">
                                <span>Pendaftaran Terbuka</span>
                                <small>Izinkan pengguna baru mendaftar</small>
                            </div>
                            <button className={`settings-toggle ${toggles.regis_terbuka ? "on" : ""}`} onClick={() => toggle("regis_terbuka")}></button>
                        </div>
                        <div className="settings-form-group">
                            <div className="settings-form-label">
                                <span>Mode Maintenance</span>
                                <small>Nonaktifkan akses sementara</small>
                            </div>
                            <button className={`settings-toggle ${toggles.maintenance ? "on" : ""}`} onClick={() => toggle("maintenance")}></button>
                        </div>
                    </>
                );
            case "Brand":
                return (
                    <>
                        <div className="settings-form-group">
                            <div className="settings-form-label">
                                <span>Logo Platform</span>
                                <small>Upload logo untuk tampilan platform</small>
                            </div>
                            <input type="file" accept="image/*" />
                        </div>
                        <div className="settings-form-group">
                            <div className="settings-form-label">
                                <span>Warna Utama</span>
                                <small>Warna tema platform</small>
                            </div>
                            <input type="color" value="#14b8a6" style={{ width: 60, height: 40, padding: 2, cursor: "pointer" }} />
                        </div>
                        <div className="settings-form-group">
                            <div className="settings-form-label">
                                <span>Favicon</span>
                                <small>Icon tab browser</small>
                            </div>
                            <input type="file" accept="image/*" />
                        </div>
                    </>
                );
            case "Pembayaran":
                return (
                    <>
                        <div className="settings-form-group">
                            <div className="settings-form-label">
                                <span>Metode Pembayaran</span>
                                <small>Pilih metode yang tersedia</small>
                            </div>
                            <select>
                                <option>Transfer Bank</option>
                                <option>E-Wallet</option>
                                <option>Kartu Kredit</option>
                            </select>
                        </div>
                        <div className="settings-form-group">
                            <div className="settings-form-label">
                                <span>Biaya Layanan (%)</span>
                                <small>Persentase biaya per transaksi</small>
                            </div>
                            <input type="number" defaultValue={2.5} />
                        </div>
                        <div className="settings-form-group">
                            <div className="settings-form-label">
                                <span>Minimal Penarikan</span>
                                <small>Minimal saldo untuk penarikan tukang</small>
                            </div>
                            <input type="number" defaultValue={50000} />
                        </div>
                    </>
                );
            case "Notifikasi":
                return (
                    <>
                        <div className="settings-form-group">
                            <div className="settings-form-label">
                                <span>Notifikasi Email</span>
                                <small>Kirim notifikasi via email</small>
                            </div>
                            <button className={`settings-toggle ${toggles.notif_email ? "on" : ""}`} onClick={() => toggle("notif_email")}></button>
                        </div>
                        <div className="settings-form-group">
                            <div className="settings-form-label">
                                <span>Notifikasi WhatsApp</span>
                                <small>Kirim notifikasi via WhatsApp</small>
                            </div>
                            <button className={`settings-toggle ${toggles.notif_whatsapp ? "on" : ""}`} onClick={() => toggle("notif_whatsapp")}></button>
                        </div>
                        <div className="settings-form-group">
                            <div className="settings-form-label">
                                <span>Notifikasi Order Baru</span>
                                <small>Pemberitahuan saat ada order masuk</small>
                            </div>
                            <button className="settings-toggle on"></button>
                        </div>
                    </>
                );
            case "Email":
                return (
                    <>
                        <div className="settings-form-group">
                            <div className="settings-form-label">
                                <span>SMTP Host</span>
                                <small>Server email keluar</small>
                            </div>
                            <input type="text" defaultValue="smtp.gmail.com" />
                        </div>
                        <div className="settings-form-group">
                            <div className="settings-form-label">
                                <span>SMTP Port</span>
                                <small>Port server email</small>
                            </div>
                            <input type="number" defaultValue={587} />
                        </div>
                        <div className="settings-form-group">
                            <div className="settings-form-label">
                                <span>SMTP Username</span>
                                <small>Alamat email pengirim</small>
                            </div>
                            <input type="email" defaultValue="admin@situkang.com" />
                        </div>
                        <div className="settings-form-group">
                            <div className="settings-form-label">
                                <span>SMTP Password</span>
                                <small>Password email pengirim</small>
                            </div>
                            <input type="password" defaultValue="********" />
                        </div>
                    </>
                );
            case "API":
                return (
                    <>
                        <div className="settings-form-group">
                            <div className="settings-form-label">
                                <span>API Key</span>
                                <small>Kunci akses API publik</small>
                            </div>
                            <input type="text" readOnly value="sk-situkang-" style={{ background: "#f8fafc", fontFamily: "monospace" }} />
                        </div>
                        <div className="settings-form-group">
                            <div className="settings-form-label">
                                <span>API Public</span>
                                <small>Izinkan akses API dari eksternal</small>
                            </div>
                            <button className={`settings-toggle ${toggles.api_public ? "on" : ""}`} onClick={() => toggle("api_public")}></button>
                        </div>
                        <div className="settings-form-group">
                            <div className="settings-form-label">
                                <span>Rate Limit (req/min)</span>
                                <small>Batas permintaan per menit</small>
                            </div>
                            <input type="number" defaultValue={60} />
                        </div>
                    </>
                );
            case "Keamanan":
                return (
                    <>
                        <div className="settings-form-group">
                            <div className="settings-form-label">
                                <span>Verifikasi 2 Langkah</span>
                                <small>Keamanan tambahan untuk admin</small>
                            </div>
                            <button className={`settings-toggle ${toggles.two_factor ? "on" : ""}`} onClick={() => toggle("two_factor")}></button>
                        </div>
                        <div className="settings-form-group">
                            <div className="settings-form-label">
                                <span>Sesi Kadaluarsa (menit)</span>
                                <small>Waktu kadaluarsa sesi login</small>
                            </div>
                            <input type="number" defaultValue={120} />
                        </div>
                        <div className="settings-form-group">
                            <div className="settings-form-label">
                                <span>Maksimal Percobaan Login</span>
                                <small>Batas gagal login sebelum terkunci</small>
                            </div>
                            <input type="number" defaultValue={5} />
                        </div>
                    </>
                );
            case "Backup":
                return (
                    <>
                        <div className="settings-form-group">
                            <div className="settings-form-label">
                                <span>Backup Otomatis</span>
                                <small>Cadangkan database secara berkala</small>
                            </div>
                            <button className={`settings-toggle ${toggles.backup_auto ? "on" : ""}`} onClick={() => toggle("backup_auto")}></button>
                        </div>
                        <div className="settings-form-group">
                            <div className="settings-form-label">
                                <span>Periode Backup</span>
                                <small>Frekuensi pencadangan data</small>
                            </div>
                            <select>
                                <option>Setiap Hari</option>
                                <option>Setiap Minggu</option>
                                <option>Setiap Bulan</option>
                            </select>
                        </div>
                        <div className="settings-form-group">
                            <div className="settings-form-label">
                                <span>Backup Terakhir</span>
                                <small>Tanggal backup terakhir</small>
                            </div>
                            <input type="text" readOnly value="10 Juli 2026" style={{ background: "#f8fafc" }} />
                        </div>
                        <div style={{ marginTop: "1rem" }}>
                            <button className="btn btn-primary" onClick={() => success("Backup database dimulai (simulasi)")}>
                                Backup Sekarang
                            </button>
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="page-content">
            <div className="page-header"><h1>Pengaturan Sistem</h1><p className="page-subtitle">Konfigurasi platform secara keseluruhan</p></div>

            <div className="settings-tabs">
                {TABS.map(tab => (
                    <button key={tab} className={`settings-tab ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>
                        {tab}
                    </button>
                ))}
            </div>

            <div className="settings-form-card">
                <h3>{activeTab}</h3>
                {renderTabContent()}
                <div className="settings-actions">
                    <button className="btn btn-secondary">Batal</button>
                    <button className="btn btn-primary" onClick={handleSave}>Simpan Perubahan</button>
                </div>
            </div>
        </div>
    );
}
export default PengaturanPage;
