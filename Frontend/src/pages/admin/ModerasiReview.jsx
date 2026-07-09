import { useEffect, useState } from "react";
import { useToast } from "../../components/admin/Toast";
import { ConfirmModal } from "../../components/admin/Modal";
import { getAllReviewAdmin, moderateReview, deleteReviewAdmin } from "../../api/adminApi";
import DataTable, { ActionDropdown } from "../../components/admin/DataTable";
const statusOptions = ["pending", "approved", "rejected"];

function ModerasiReview() {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const { success, error } = useToast();
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [actionType, setActionType] = useState("");

    useEffect(() => { load(); }, []);

    const load = async () => {
        setLoading(true);
        try { const r = await getAllReviewAdmin(); setList(r.data || []); } catch (e) { error("Gagal memuat data"); }
        setLoading(false);
    };

    const handleModerate = async (id, status) => {
        try { await moderateReview(id, status); success("Review dimoderasi"); load(); }
        catch (e) { error("Gagal memoderasi review"); }
    };

    const handleDelete = async () => {
        try { await deleteReviewAdmin(selectedRow.id); success("Review dihapus"); load(); }
        catch (e) { error("Gagal menghapus review"); }
        finally { setShowConfirm(false); setSelectedRow(null); setActionType(""); }
    };

    const confirmDelete = (row) => {
        setSelectedRow(row);
        setActionType("delete");
        setShowConfirm(true);
    };

    const columns = [
        { header: "User", accessor: "nama_user" },
        { header: "Tukang", accessor: "nama_tukang" },
        { header: "Rating", accessor: "rating", render: row => `⭐ ${row.rating}` },
        { header: "Komentar", accessor: "komentar", render: row => <span className="komentar-cell">{row.komentar}</span> },
        { header: "Tanggal", accessor: "created_at", render: row => new Date(row.created_at).toLocaleDateString() },
    ];

    const actions = [
        { label: "Setujui", icon: "✅", onClick: row => handleModerate(row.id, "approved") },
        { label: "Tolak", icon: "❌", onClick: row => handleModerate(row.id, "rejected") },
        { label: "Hapus", icon: "🗑", className: "danger", onClick: confirmDelete },
    ];

    return (
        <div className="page-content">
            <div className="page-header"><h1>Moderasi Review</h1><p className="page-subtitle">Kelola ulasan pengguna</p></div>
            <DataTable
                columns={columns}
                data={list}
                loading={loading}
                actions={actions}
                searchable={true}
                placeholder="Cari review/user..."
                pageSize={10}
                emptyMessage="Belum ada review"
                renderRow={(row) => ({
                    status: (
                        <select
                            className="status-select"
                            value={row.status || "pending"}
                            onChange={(e) => handleModerate(row.id, e.target.value)}
                            onClick={e => e.stopPropagation()}
                        >
                            {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    )
                })}
            />
            <ConfirmModal
                open={showConfirm}
                onClose={() => { setShowConfirm(false); setSelectedRow(null); setActionType(""); }}
                onConfirm={handleDelete}
                title="Konfirmasi Hapus"
                message={`Yakin hapus review dari "${selectedRow?.nama_user}" untuk tukang "${selectedRow?.nama_tukang}"?`}
            />
        </div>
    );
}
export default ModerasiReview;