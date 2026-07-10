import { useEffect, useState } from "react";
import { getPengaturan, updatePengaturan } from "../../api/adminApi";

function PengaturanPage() {
    const [data, setData] = useState({ nama_platform: "SiTukang", email_admin: "", deskripsi: "" });
    const [loading, setLoading] = useState(true);

    useEffect(() => { load(); }, []);

    const load = async () => {
        setLoading(true);
        try { const r = await getPengaturan(); if (r.data) setData(r.data); } catch (e) { console.error(e); }
        setLoading(false);
    };

    const handleSave = async () => {
        try { await updatePengaturan(data); alert("Pengaturan disimpan!"); } catch (e) { alert("Gagal"); }
    };

    if (loading) return <div className="page-content"><div className="loading-state"><div className="spinner"></div></div></div>;

    return (
        <div className="page-content">
            <div className="page-header"><h1>Pengaturan</h1></div>
            <div className="form-card">
                <div className="form-group">
                    <label>Nama Platform</label>
                    <input type="text" value={data.nama_platform} onChange={e => setData({ ...data, nama_platform: e.target.value })} />
                </div>
                <div className="form-group">
                    <label>Email Admin</label>
                    <input type="email" value={data.email_admin} onChange={e => setData({ ...data, email_admin: e.target.value })} />
                </div>
                <div className="form-group">
                    <label>Deskripsi</label>
                    <textarea rows={4} value={data.deskripsi} onChange={e => setData({ ...data, deskripsi: e.target.value })} />
                </div>
                <button className="btn btn-primary btn-lg" onClick={handleSave}>Simpan Pengaturan</button>
            </div>
        </div>
    );
}
export default PengaturanPage;