import { useEffect, useState } from "react";
import { useToast } from "../../components/admin/Toast";
import { ConfirmModal } from "../../components/admin/Modal";
import { getAllReviewAdmin, moderateReview, deleteReviewAdmin } from "../../api/adminApi";
import { ThumbsUp, Trash2 } from "lucide-react";

function ModerasiReview() {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const { success, error } = useToast();
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    useEffect(() => { load(); }, []);

    const load = async () => {
        setLoading(true);
        try { const r = await getAllReviewAdmin(); setList(r.data || []); } catch (e) { error("Gagal memuat data"); }
        setLoading(false);
    };

    const handleModerate = async (id, status) => {
        try { await moderateReview(id, status); success(`Review ${status === "approved" ? "disetujui" : "ditolak"}`); load(); }
        catch (e) { error("Gagal memoderasi review"); }
    };

    const handleDelete = async () => {
        try { await deleteReviewAdmin(selectedRow.id); success("Review dihapus"); load(); }
        catch (e) { error("Gagal menghapus review"); }
        finally { setShowConfirm(false); setSelectedRow(null); }
    };

    const getInitials = (name) => {
        if (!name) return "U";
        return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    };

    const renderStars = (rating) => {
        const val = Number(rating) || 0;
        return "★".repeat(Math.min(val, 5)) + "☆".repeat(Math.max(0, 5 - val));
    };

    const getReportLabel = (row) => {
        if (row.report_reason) return row.report_reason;
        if (row.rating <= 1) return { label: "Konten Tidak Pantas", cls: "spam" };
        return null;
    };

    if (loading) {
        return (
            <div className="page-content">
                <div className="page-header"><h1>Moderasi Ulasan</h1><p className="page-subtitle">Kelola ulasan pengguna</p></div>
                <div className="loading-state"><div className="spinner"></div></div>
            </div>
        );
    }

    return (
        <div className="page-content">
            <div className="page-header"><h1>Moderasi Ulasan</h1><p className="page-subtitle">Kelola dan moderasi ulasan pengguna</p></div>

            {list.length === 0 ? (
                <div className="page-state empty-state"><p>Belum ada review</p></div>
            ) : (
                <div className="review-list">
                    {list.map((row) => {
                        const report = getReportLabel(row);
                        return (
                            <div key={row.id} className="review-card">
                                <div className="review-card-header">
                                    <div className="review-user">
                                        <div className="review-avatar">{getInitials(row.nama_user)}</div>
                                        <div className="review-user-info">
                                            <span className="review-user-name">{row.nama_user}</span>
                                            <span className="review-tukang-name">Review untuk {row.nama_tukang}</span>
                                        </div>
                                    </div>
                                    {report && (
                                        <span className={`review-report ${report.cls || ""}`}>
                                            {report.label}
                                        </span>
                                    )}
                                </div>
                                <div className="review-stars">{renderStars(row.rating)}</div>
                                <p className="review-text">{row.komentar}</p>
                                <div className="review-card-actions">
                                    <button className="btn btn-success btn-sm" onClick={() => handleModerate(row.id, "approved")}>
                                        <ThumbsUp size={14} /> Loloskan
                                    </button>
                                    <button className="btn btn-danger btn-sm" onClick={() => { setSelectedRow(row); setShowConfirm(true); }}>
                                        <Trash2 size={14} /> Hapus
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <ConfirmModal open={showConfirm} onClose={() => { setShowConfirm(false); setSelectedRow(null); }} onConfirm={handleDelete} title="Konfirmasi Hapus" message={`Yakin hapus review dari "${selectedRow?.nama_user}"?`} />
        </div>
    );
}
export default ModerasiReview;
