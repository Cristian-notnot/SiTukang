import { useEffect, useState } from "react";
import { useToast } from "../../components/admin/Toast";
import { ConfirmModal } from "../../components/admin/Modal";
import { getAllBookingAdmin, getBookingById, updateBookingStatus, deleteBookingAdmin, getBookingStats } from "../../api/adminApi";
import DataTable, { ActionDropdown } from "../../components/admin/DataTable";

const statusOptions = ["pending", "diterima", "dikerjakan", "selesai", "ditolak", "dibatalkan"];

function AdminBooking() {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const { success, error } = useToast();
    const [stats, setStats] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [actionType, setActionType] = useState("");

    useEffect(() => { load(); }, []);

    const load = async () => {
        setLoading(true);
        try {
            const [r, s] = await Promise.all([
                getAllBookingAdmin(),
                getBookingStats()
            ]);
            setList(r.data || []);
            setStats(s.data || null);
        } catch (e) {
            error("Gagal memuat data");
        }
        setLoading(false);
    };

    const handleStatus = async (id, status) => {
        try {
            await updateBookingStatus(id, status);
            success("Status booking berhasil diubah");
            load();
        } catch (e) {
            error("Gagal mengubah status");
        }
    };

    const handleDelete = async () => {
        try {
            await deleteBookingAdmin(selectedRow.id);
            success("Booking berhasil dihapus");
            load();
        } catch (e) {
            error("Gagal menghapus booking");
        } finally {
            setShowConfirm(false);
            setSelectedRow(null);
            setActionType("");
        }
    };

    const confirmDelete = (row) => {
        setSelectedRow(row);
        setActionType("delete");
        setShowConfirm(true);
    };

    const columns = [
        { header: "ID", accessor: "id" },
        { header: "User", accessor: "nama_user" },
        { header: "Tukang", accessor: "nama_tukang" },
        { header: "Alamat", accessor: "alamat" },
        { header: "Status", accessor: "status", render: row => (
            <span className={`badge badge-${row.status}`}>{row.status}</span>
        )},
        { header: "Tanggal", accessor: "tanggal_booking", render: row => new Date(row.tanggal_booking).toLocaleDateString() },
    ];

    const actions = [
        { label: "Lihat Detail", onClick: row => console.log("Detail", row.id) },
        { label: "Ubah Status", onClick: row => {
            const newStatus = statusOptions.find(s => s !== row.status) || "pending";
            handleStatus(row.id, newStatus);
        } },
        { label: "Hapus", className: "danger", onClick: confirmDelete }
    ];

    return (
        <div className="page-content">
            <div className="page-header">
                <h1>Manajemen Booking</h1>
                {stats && (
                    <div className="stats-subgrid">
                        <div className="stat-mini"><span>Total:</span> <b>{stats.total}</b></div>
                        <div className="stat-mini pending"><span>Pending:</span> <b>{stats.pending}</b></div>
                        <div className="stat-mini selesai"><span>Selesai:</span> <b>{stats.selesai}</b></div>
                    </div>
                )}
            </div>

            <DataTable
                columns={columns}
                data={list}
                loading={loading}
                actions={actions}
                searchable={true}
                placeholder="Cari user/tukang..."
                pageSize={10}
                emptyMessage="Belum ada booking"
            />

            <ConfirmModal
                open={showConfirm}
                onClose={() => { setShowConfirm(false); setSelectedRow(null); setActionType(""); }}
                onConfirm={handleDelete}
                title="Konfirmasi Hapus"
                message={`Yakin hapus booking ID ${selectedRow?.id}?`}
            />
        </div>
    );
}
export default AdminBooking;