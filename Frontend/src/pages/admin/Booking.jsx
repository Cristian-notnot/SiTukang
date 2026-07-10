import { useEffect, useState } from "react";
import { useToast } from "../../components/admin/Toast";
import { ConfirmModal } from "../../components/admin/Modal";
import { getAllBookingAdmin, getBookingById, updateBookingStatus, deleteBookingAdmin, getBookingStats } from "../../api/adminApi";
import DataTable from "../../components/admin/DataTable";
import { FileText, CheckCircle, Clock, XCircle } from "lucide-react";

const statusOptions = ["pending", "diterima", "dikerjakan", "selesai", "ditolak", "dibatalkan"];

function AdminBooking() {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const { success, error } = useToast();
    const [stats, setStats] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    useEffect(() => { load(); }, []);

    const load = async () => {
        setLoading(true);
        try {
            const [r, s] = await Promise.all([getAllBookingAdmin(), getBookingStats()]);
            setList(r.data || []);
            setStats(s.data || null);
        } catch (e) { error("Gagal memuat data"); }
        setLoading(false);
    };

    const handleStatus = async (id, status) => {
        try { await updateBookingStatus(id, status); success("Status booking berhasil diubah"); load(); }
        catch (e) { error("Gagal mengubah status"); }
    };

    const handleDelete = async () => {
        try { await deleteBookingAdmin(selectedRow.id); success("Booking berhasil dihapus"); load(); }
        catch (e) { error("Gagal menghapus booking"); }
        finally { setShowConfirm(false); setSelectedRow(null); }
    };

    const statCards = [
        { label: "Total Order", value: stats?.total || 0, gradient: "primary", icon: <FileText size={22} color="#fff" /> },
        { label: "Selesai", value: stats?.selesai || 0, gradient: "success", icon: <CheckCircle size={22} color="#fff" /> },
        { label: "Aktif", value: (stats?.diterima || 0) + (stats?.dikerjakan || 0), gradient: "warning", icon: <Clock size={22} color="#fff" /> },
        { label: "Dibatalkan", value: stats?.dibatalkan || 0, gradient: "danger", icon: <XCircle size={22} color="#fff" /> },
    ];

    const columns = [
        { header: "ID", accessor: "id" },
        { header: "Customer", accessor: "nama_user" },
        { header: "Tukang", accessor: "nama_tukang" },
        { header: "Layanan", accessor: "keluhan", render: row => row.keluhan || row.layanan || "-" },
        { header: "Tanggal", accessor: "tanggal_booking", render: row => new Date(row.tanggal_booking).toLocaleDateString() },
        { header: "Nilai", accessor: "total_harga", render: row => `Rp ${Number(row.total_harga || 0).toLocaleString()}` },
        { header: "Status", accessor: "status", render: row => <span className={`badge badge-${row.status}`}>{row.status}</span> },
    ];

    const actions = [
        { label: "Terima", onClick: row => handleStatus(row.id, "diterima") },
        { label: "Selesaikan", onClick: row => handleStatus(row.id, "selesai") },
        { label: "Batalkan", onClick: row => handleStatus(row.id, "dibatalkan") },
        { label: "Hapus", className: "danger", onClick: row => { setSelectedRow(row); setShowConfirm(true); } },
    ];

    return (
        <div className="page-content">
            <div className="page-header"><h1>Manajemen Order</h1><p className="page-subtitle">Kelola seluruh pesanan layanan</p></div>

            <div className="order-stats">
                {statCards.map((s, i) => (
                    <div key={i} className={`order-stat-card ${s.gradient}`}>
                        <div className="order-stat-icon">{s.icon}</div>
                        <div className="order-stat-body">
                            <h3>{typeof s.value === "number" ? s.value.toLocaleString() : s.value}</h3>
                            <p>{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <DataTable columns={columns} data={list} loading={loading} actions={actions} searchable={true} placeholder="Cari user/tukang..." pageSize={10} emptyMessage="Belum ada booking" />
            <ConfirmModal open={showConfirm} onClose={() => { setShowConfirm(false); setSelectedRow(null); }} onConfirm={handleDelete} title="Konfirmasi Hapus" message={`Yakin hapus booking ID ${selectedRow?.id}?`} />
        </div>
    );
}
export default AdminBooking;
