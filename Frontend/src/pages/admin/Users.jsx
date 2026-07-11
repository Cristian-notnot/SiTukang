import { useEffect, useState } from "react";
import { getAllUsersAdmin, deleteUserAdmin, updateUserRole } from "../../api/adminApi";
import { useToast } from "../../components/admin/Toast";
import { ConfirmModal } from "../../components/admin/Modal";
import DataTable from "../../components/admin/DataTable";

const roleOptions = ["user", "tukang", "admin"];

function AdminUsers() {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const { success, error } = useToast();
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [roleFilter, setRoleFilter] = useState("semua");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => { load(); }, []);

    const load = async (params = {}) => {
        setLoading(true);
        try {
            const r = await getAllUsersAdmin(params);
            setList(r.data || []);
        } catch (e) {
            error("Gagal memuat data");
        }
        setLoading(false);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const params = {};
        if (searchQuery.trim()) params.search = searchQuery.trim();
        if (roleFilter !== "semua") params.role = roleFilter;
        load(params);
    };

    const handleRoleFilter = (role) => {
        setRoleFilter(role);
        const params = {};
        if (searchQuery.trim()) params.search = searchQuery.trim();
        if (role !== "semua") params.role = role;
        load(params);
    };

    const handleDelete = async () => {
        try {
            await deleteUserAdmin(selectedRow.id);
            success("User berhasil dihapus");
            load({ search: searchQuery.trim() || undefined, role: roleFilter !== "semua" ? roleFilter : undefined });
        } catch (e) { error("Gagal menghapus user"); }
        finally { setShowConfirm(false); setSelectedRow(null); }
    };

    const handleRoleChange = async (id, role) => {
        try {
            await updateUserRole(id, role);
            success("Role berhasil diubah");
            load({ search: searchQuery.trim() || undefined, role: roleFilter !== "semua" ? roleFilter : undefined });
        } catch (e) { error("Gagal mengubah role"); }
    };

    const getInitials = (name) => {
        if (!name) return "U";
        return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    };

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
                <form onSubmit={handleSearch} style={{ display: "contents" }}>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Cari nama/email..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </form>
                <div className="filter-select-wrapper">
                    <select className="filter-select" value={roleFilter} onChange={e => handleRoleFilter(e.target.value)}>
                        <option value="semua">Role: Semua</option>
                        <option value="user">User</option>
                        <option value="tukang">Tukang</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
            </div>
            <DataTable columns={columns} data={list} loading={loading} actions={actions} searchable={false} pageSize={10} emptyMessage="Belum ada user" />
            <ConfirmModal open={showConfirm} onClose={() => { setShowConfirm(false); setSelectedRow(null); }} onConfirm={handleDelete} title="Konfirmasi Hapus" message={`Yakin hapus user "${selectedRow?.nama}"?`} />
        </div>
    );
}
export default AdminUsers;
