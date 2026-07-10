import { useEffect, useState } from "react";
import { useToast } from "../../components/admin/Toast";
import { ConfirmModal } from "../../components/admin/Modal";
import { getAllTukangAdmin, deleteTukangAdmin } from "../../api/adminApi";
import DataTable from "../../components/admin/DataTable";

function TukangPage() {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const { success, error } = useToast();
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    useEffect(() => { load(); }, []);

    const load = async () => {
        setLoading(true);
        try { const r = await getAllTukangAdmin(); setList(r.data || []); } catch (e) { error("Gagal memuat data"); }
        setLoading(false);
    };

    const handleDelete = async () => {
        try { await deleteTukangAdmin(selectedRow.id); success("Tukang berhasil dihapus"); load(); }
        catch (e) { error("Gagal menghapus"); }
        finally { setShowConfirm(false); setSelectedRow(null); }
    };

    const getInitials = (name) => {
        if (!name) return "T";
        return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    };

    const renderStars = (rating) => {
        const stars = [];
        const val = Number(rating) || 0;
        for (let i = 1; i <= 5; i++) {
            stars.push(i <= val ? "★" : "☆");
        }
        return <span className="rating-stars">{stars.join("")} {val > 0 ? val.toFixed(1) : ""}</span>;
    };

    const columns = [
        { header: "Tukang", accessor: "nama", render: row => (
            <div className="tukang-cell">
                <div className="tukang-avatar-sm">{getInitials(row.nama)}</div>
                <div className="tukang-info">
                    <div className="tukang-name-row">
                        <span className="tukang-name-text">{row.nama}</span>
                        {row.verified && <span className="tukang-verified">✓ Verified</span>}
                    </div>
                    <span className="tukang-field-text">{row.nama_kategori} • {row.kota || "-"}</span>
                </div>
            </div>
        )},
        { header: "Rating", accessor: "rating", render: row => renderStars(row.rating) },
        { header: "Pesanan", accessor: "jumlah_pesanan", render: row => row.jumlah_pesanan || 0 },
        { header: "Tarif", accessor: "tarif", render: row => `Rp ${Number(row.tarif || 0).toLocaleString()}` },
        { header: "Status", accessor: "status", render: row => <span className={`badge badge-${row.status}`}>{row.status}</span> },
    ];

    const actions = [
        { label: "Lihat Detail", onClick: row => console.log("Detail", row.id) },
        { label: "Hapus", className: "danger", onClick: row => { setSelectedRow(row); setShowConfirm(true); } },
    ];

    return (
        <div className="page-content">
            <div className="page-header"><h1>Manajemen Tukang</h1><p className="page-subtitle">Kelola seluruh tukang terdaftar</p></div>
            <div className="page-toolbar">
                <input type="text" className="search-input" placeholder="Cari nama/kategori..." />
                <div className="filter-select-wrapper">
                    <select className="filter-select">
                        <option>Status: Semua</option>
                        <option>Online</option>
                        <option>Offline</option>
                    </select>
                    <select className="filter-select">
                        <option>Kategori: Semua</option>
                    </select>
                </div>
            </div>
            <DataTable columns={columns} data={list} loading={loading} actions={actions} searchable={false} pageSize={10} emptyMessage="Belum ada tukang" />
            <ConfirmModal open={showConfirm} onClose={() => { setShowConfirm(false); setSelectedRow(null); }} onConfirm={handleDelete} title="Konfirmasi Hapus" message={`Yakin hapus tukang "${selectedRow?.nama}"?`} />
        </div>
    );
}
export default TukangPage;
