import { useEffect, useState } from "react";
import { getPendingTukang, getTukangById, approveTukang, rejectTukang } from "../../api/adminApi";
import { useToast } from "../../components/admin/Toast";
import { CheckCircle, XCircle, Eye, Info, X } from "lucide-react";

function VerifikasiTukang() {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [preview, setPreview] = useState(null);
    const [previewData, setPreviewData] = useState(null);
    const [previewLoading, setPreviewLoading] = useState(false);
    const { success, error } = useToast();

    useEffect(() => { load(); }, []);

    const load = async () => {
        setLoading(true);
        try { const r = await getPendingTukang(); setList(r.data || []); } catch (e) { error("Gagal memuat data"); }
        setLoading(false);
    };

    const handlePreview = async (id) => {
        setPreview(id);
        setPreviewLoading(true);
        try {
            const r = await getTukangById(id);
            setPreviewData(r.data);
        } catch (e) {
            error("Gagal memuat detail tukang");
            setPreview(null);
        }
        setPreviewLoading(false);
    };

    const closePreview = () => {
        setPreview(null);
        setPreviewData(null);
    };

    const handleApprove = async (id) => {
        try { await approveTukang(id); success("Tukang berhasil disetujui"); closePreview(); load(); } catch (e) { error("Gagal menyetujui"); }
    };

    const handleReject = async (id) => {
        try { await rejectTukang(id); success("Tukang ditolak"); closePreview(); load(); } catch (e) { error("Gagal menolak"); }
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
                                <button className="btn btn-outline-primary btn-sm" onClick={() => handlePreview(t.id)}>
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

            {preview && (
                <div className="modal-backdrop" onClick={closePreview}>
                    <div className="modal-content preview-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Detail Tukang</h2>
                            <button className="btn-close" onClick={closePreview}><X size={20} /></button>
                        </div>
                        <div className="modal-body">
                            {previewLoading ? (
                                <div className="loading-state"><div className="spinner"></div></div>
                            ) : previewData ? (
                                <div className="preview-details">
                                    <div className="preview-avatar-large">
                                        {previewData.foto ? (
                                            <img src={`http://localhost:5000/uploads/${previewData.foto}`} alt={previewData.nama} />
                                        ) : (
                                            <span>{getInitials(previewData.nama)}</span>
                                        )}
                                    </div>
                                    <div className="preview-info-grid">
                                        <div className="preview-field">
                                            <label>Nama</label>
                                            <p>{previewData.nama}</p>
                                        </div>
                                        <div className="preview-field">
                                            <label>Email</label>
                                            <p>{previewData.email}</p>
                                        </div>
                                        <div className="preview-field">
                                            <label>Kategori</label>
                                            <p>{previewData.nama_kategori}</p>
                                        </div>
                                        <div className="preview-field">
                                            <label>Telepon</label>
                                            <p>{previewData.telepon || "-"}</p>
                                        </div>
                                        <div className="preview-field">
                                            <label>Pengalaman</label>
                                            <p>{previewData.pengalaman ? `${previewData.pengalaman} tahun` : "-"}</p>
                                        </div>
                                        <div className="preview-field">
                                            <label>Rating</label>
                                            <p>{previewData.rating || 0} ★</p>
                                        </div>
                                        <div className="preview-field full-width">
                                            <label>Alamat</label>
                                            <p>{previewData.alamat || "-"}</p>
                                        </div>
                                        {previewData.deskripsi && (
                                            <div className="preview-field full-width">
                                                <label>Deskripsi</label>
                                                <p>{previewData.deskripsi}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <p>Data tidak ditemukan</p>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={closePreview}>Tutup</button>
                            {previewData && (
                                <>
                                    <button className="btn btn-danger" onClick={() => handleReject(previewData.id)}>
                                        <XCircle size={16} /> Tolak
                                    </button>
                                    <button className="btn btn-success" onClick={() => handleApprove(previewData.id)}>
                                        <CheckCircle size={16} /> Setujui
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
export default VerifikasiTukang;
