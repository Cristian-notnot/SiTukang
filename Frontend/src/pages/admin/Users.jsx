import { useEffect, useState } from "react";
import { getAllUsersAdmin, deleteUserAdmin, updateUserRole } from "../../api/adminApi";
import { useToast } from "../../components/admin/Toast";
import { ConfirmModal } from "../../components/admin/Modal";
import DataTable from "../../components/admin/DataTable";

const roleOptions = ["user", "tukang", "admin"];
const statusOptions = ["semua", "aktif", "diblokir", "pending"];

function AdminUsers() {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const { success, error } = useToast();
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [statusFilter, setStatusFilter] = useState("semua");
    const [roleFilter, setRoleFilter] = useState("semua");

    useEffect(() => { load(); }, []);

    const load = async () => {
        setLoading(true);
        try { const r = await getAllUsersAdmin(); setList(r.data || []); } catch (e) { error("Gagal memuat data"); }
        setLoading(false);
    };

    const handleDelete = async () => {
        try {
            await deleteUserAdmin(selectedRow.id);
            success("User berhasil dihapus");
            load();
        } catch (e) { error("Gagal menghapus user"); }
        finally { setShowConfirm(false); setSelectedRow(null); }
    };

    const handleRoleChange = async (id, role) => {
        try {
            await updateUserRole(id, role);
            success("Role berhasil diubah");
            load();
        } catch (e) { error("Gagal mengubah role"); }
    };

    const getInitials = (name) => {
        if (!name) return "U";
        return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    };

    const filtered = list.filter(row => {
        if (statusFilter !== "semua" && row.status !== statusFilter) return false;
        if (roleFilter !== "semua" && row.role !== roleFilter) return false;
        return true;
    });

    const columns = [
        { header: "User", accessor: "nama", render: row => (
            <div className="user-cell">
                <div className="user-avatar-sm">{getInitials(row.nama)}</div>
                <div className="user-info">
                    <span className="user-name-text">{row.nama}</span>
                    <span className="user-email-text">{row.email}</span>
                </div>
            </div>
        )},
        { header: "Role", accessor: "role", render: row => (
            <span className={`badge badge-${row.role}`}>{row.role}</span>
        )},
        { header: "Status", accessor: "status", render: row => (
            <span className={`badge badge-${row.status || "aktif"}`}>{row.status || "aktif"}</span>
        )},
        { header: "Bergabung", accessor: "created_at", render: row => new Date(row.created_at).toLocaleDateString() },
    ];

    const actions = [
        { label: "Ubah Role", onClick: row => {
            const nextRole = roleOptions.find(r => r !== row.role) || "user";
            handleRoleChange(row.id, nextRole);
        }},
        { label: "Hapus", className: "danger", onClick: row => { setSelectedRow(row); setShowConfirm(true); } },
    ];

    return (
        <div className="page-content">
            <div className="page-header"><h1>Manajemen User</h1><p className="page-subtitle">Kelola seluruh pengguna platform</p></div>
            <div className="page-toolbar">
                <input type="text" className="search-input" placeholder="Cari nama/email..." />
                <div className="filter-select-wrapper">
                    <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                        <option value="semua">Status: Semua</option>
                        <option value="aktif">Aktif</option>
                        <option value="diblokir">Diblokir</option>
                        <option value="pending">Pending</option>
                    </select>
                    <select className="filter-select" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
                        <option value="semua">Role: Semua</option>
                        <option value="user">User</option>
                        <option value="tukang">Tukang</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
            </div>
            <DataTable columns={columns} data={filtered} loading={loading} actions={actions} searchable={false} pageSize={10} emptyMessage="Belum ada user" />
            <ConfirmModal open={showConfirm} onClose={() => { setShowConfirm(false); setSelectedRow(null); }} onConfirm={handleDelete} title="Konfirmasi Hapus" message={`Yakin hapus user "${selectedRow?.nama}"?`} />
        </div>
    );
}
export default AdminUsers;
