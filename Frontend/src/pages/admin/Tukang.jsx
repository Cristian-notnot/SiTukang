import { useEffect, useState } from "react";
import { useToast } from "../../components/admin/Toast";
import { ConfirmModal } from "../../components/admin/Modal";
import { getAllTukangAdmin, deleteTukangAdmin, approveTukang, rejectTukang, getAllKategori } from "../../api/adminApi";
import DataTable from "../../components/admin/DataTable";

function TukangPage() {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const { success, error } = useToast();
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showRejectConfirm, setShowRejectConfirm] = useState(false);
    const [selectedReject, setSelectedReject] = useState(null);
    const [statusFilter, setStatusFilter] = useState("semua");
    const [kategoriFilter, setKategoriFilter] = useState("semua");
    const [kategoriList, setKategoriList] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        loadKategori();
    }, []);

    useEffect(() => {
        load(buildParams());
    }, [statusFilter, kategoriFilter]);

    const loadKategori = async () => {
        try {
            const r = await getAllKategori();
            setKategoriList(r.data || []);
        } catch (e) { /* ignore */ }
    };

    const buildParams = () => {
        const params = {};
        if (searchQuery.trim()) params.search = searchQuery.trim();
        if (statusFilter !== "semua") params.status = statusFilter;
        if (kategoriFilter !== "semua") params.kategori = kategoriFilter;
        return params;
    };

    const load = async (params) => {
        setLoading(true);
        try { const r = await getAllTukangAdmin(params); setList(r.data || []); } catch (e) { error("Gagal memuat data"); }
        setLoading(false);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        load(buildParams());
    };

    const handleDelete = async () => {
        try { await deleteTukangAdmin(selectedRow.id); success("Tukang berhasil dihapus"); load(buildParams()); }
        catch (e) { error("Gagal menghapus"); }
        finally { setShowConfirm(false); setSelectedRow(null); }
    };

    const handleApprove = async (id) => {
        try { await approveTukang(id); success("Tukang berhasil disetujui"); load(buildParams()); }
        catch (e) { error("Gagal menyetujui"); }
    };

    const handleReject = async (id) => {
        try { await rejectTukang(id); success("Tukang ditolak"); load(buildParams()); }
        catch (e) { error("Gagal menolak"); }
    };

    const handleRejectConfirm = async () => {
        try { await rejectTukang(selectedReject.id); success("Tukang ditolak"); load(buildParams()); }
        catch (e) { error("Gagal menolak"); }
        finally { setShowRejectConfirm(false); setSelectedReject(null); }
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
                    </div>
                    <span className="tukang-field-text">{row.nama_kategori}</span>
                </div>
            </div>
        )},
        { header: "Rating", accessor: "rating", render: row => renderStars(row.rating) },
        { header: "Pengalaman", accessor: "pengalaman", render: row => `${row.pengalaman || 0} thn` },
        { header: "Telepon", accessor: "telepon", render: row => row.telepon || "-" },
        { header: "Status", accessor: "status", render: row => (
            <span className={`badge badge-${row.status === 'approved' ? 'approved' : row.status === 'rejected' ? 'danger' : 'warning'}`}>
                {row.status === 'pending' ? 'Menunggu' : row.status === 'approved' ? 'Disetujui' : 'Ditolak'}
            </span>
        )},
    ];

    return (
        <div className="page-content">
            <div className="page-header"><h1>Manajemen Tukang</h1><p className="page-subtitle">Kelola seluruh tukang terdaftar</p></div>
            <div className="page-toolbar">
                <form onSubmit={handleSearch} style={{ display: "contents" }}>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Cari nama/kategori..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </form>
                <div className="filter-select-wrapper">
                    <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                        <option value="semua">Status: Semua</option>
                        <option value="pending">Menunggu</option>
                        <option value="approved">Disetujui</option>
                        <option value="rejected">Ditolak</option>
                    </select>
                    <select className="filter-select" value={kategoriFilter} onChange={e => setKategoriFilter(e.target.value)}>
                        <option value="semua">Kategori: Semua</option>
                        {kategoriList.map(k => (
                            <option key={k.id} value={k.nama_kategori}>{k.nama_kategori}</option>
                        ))}
                    </select>
                </div>
            </div>
            <DataTable
                columns={columns}
                data={list}
                loading={loading}
                actions={[
                    { label: "Setujui", onClick: row => { if (row.status === 'pending') handleApprove(row.id); }},
                    { label: "Tolak", className: "danger", onClick: row => { if (row.status === 'pending') { setSelectedReject(row); setShowRejectConfirm(true); } }},
                    { label: "Hapus", className: "danger", onClick: row => { setSelectedRow(row); setShowConfirm(true); }},
                ]}
                searchable={false}
                pageSize={10}
                emptyMessage="Belum ada tukang"
            />
            <ConfirmModal open={showConfirm} onClose={() => { setShowConfirm(false); setSelectedRow(null); }} onConfirm={handleDelete} title="Konfirmasi Hapus" message={`Yakin hapus tukang "${selectedRow?.nama}"?`} />
            <ConfirmModal open={showRejectConfirm} onClose={() => { setShowRejectConfirm(false); setSelectedReject(null); }} onConfirm={handleRejectConfirm} title="Konfirmasi Tolak" message={`Yakin tolak tukang "${selectedReject?.nama}"? Tukang ini tidak akan muncul di pencarian.`} />
        </div>
    );
}
export default TukangPage;
