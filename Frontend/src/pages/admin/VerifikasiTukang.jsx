import { useEffect, useState } from "react";
import { getPendingTukang, approveTukang, rejectTukang } from "../../api/adminApi";
import { useToast } from "../../components/admin/Toast";
import { CheckCircle, XCircle, Eye, Info } from "lucide-react";

function VerifikasiTukang() {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const { success, error } = useToast();

    useEffect(() => { load(); }, []);

    const load = async () => {
        setLoading(true);
        try { const r = await getPendingTukang(); setList(r.data || []); } catch (e) { error("Gagal memuat data"); }
        setLoading(false);
    };

    const handleApprove = async (id) => {
        try { await approveTukang(id); success("Tukang berhasil disetujui"); load(); } catch (e) { error("Gagal menyetujui"); }
    };

    const handleReject = async (id) => {
        try { await rejectTukang(id); success("Tukang ditolak"); load(); } catch (e) { error("Gagal menolak"); }
    };

    const getInitials = (name) => {
        if (!name) return "T";
        return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    };

    const getTimeAgo = (date) => {
        if (!date) return "";
        const diff = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60));
        if (diff < 1) return "Baru saja";
        if (diff < 24) return `${diff} jam lalu`;
        const days = Math.floor(diff / 24);
        return `${days} hari lalu`;
    };

    if (loading) {
        return (
            <div className="page-content">
                <div className="page-header"><h1>Antrian Verifikasi</h1><p className="page-subtitle">Pengajuan pendaftaran tukang baru</p></div>
                <div className="loading-state"><div className="spinner"></div></div>
            </div>
        );
    }

    return (
        <div className="page-content">
            <div className="page-header"><h1>Antrian Verifikasi</h1><p className="page-subtitle">Pengajuan pendaftaran tukang baru</p></div>

            {list.length === 0 ? (
                <div className="page-state empty-state"><p>Tidak ada pengajuan pending</p></div>
            ) : (
                <div className="verification-list">
                    {list.map(t => (
                        <div key={t.id} className="verification-card">
                            <div className="verification-avatar">{getInitials(t.nama)}</div>
                            <div className="verification-info">
                                <div className="verification-name-row">
                                    <span className="verification-name">{t.nama}</span>
                                    <span className="badge badge-warning">Menunggu</span>
                                </div>
                                <div className="verification-meta">
                                    <span>{t.nama_kategori}</span>
                                    <span>📍 {t.kota || "-"}</span>
                                    <span>📄 {t.jumlah_dokumen || 0} dokumen</span>
                                    <span>⏱ {getTimeAgo(t.created_at)}</span>
                                </div>
                            </div>
                            <div className="verification-actions">
                                <button className="btn btn-outline-primary btn-sm" onClick={() => console.log("Review", t.id)}>
                                    <Eye size={14} /> Review
                                </button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleReject(t.id)}>
                                    <XCircle size={14} /> Tolak
                                </button>
                                <button className="btn btn-success btn-sm" onClick={() => handleApprove(t.id)}>
                                    <CheckCircle size={14} /> Setujui
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="verification-info-banner">
                <Info size={18} />
                <span>Catatan: Verifikasi tukang baru akan mempengaruhi status tampilan di halaman pencarian.</span>
            </div>
        </div>
    );
}
export default VerifikasiTukang;
