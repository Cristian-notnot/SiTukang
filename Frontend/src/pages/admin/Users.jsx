import { useEffect, useState } from "react";
import { getAllUsersAdmin, deleteUserAdmin, updateUserRole } from "../../api/adminApi";
import { useToast } from "../../components/admin/Toast";
import { ConfirmModal } from "../../components/admin/Modal";
import DataTable from "../../components/admin/DataTable";

function AdminUsers() {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const { success, error } = useToast();
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

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

    const columns = [
        { header: "Nama", accessor: "nama" },
        { header: "Email", accessor: "email" },
        { header: "Role", accessor: "role", render: row => (
            <select className="role-select" value={row.role} onChange={e => handleRoleChange(row.id, e.target.value)}>
                <option value="user">User</option>
                <option value="tukang">Tukang</option>
                <option value="admin">Admin</option>
            </select>
        )},
        { header: "Bergabung", accessor: "created_at", render: row => new Date(row.created_at).toLocaleDateString() },
    ];

    const actions = [
        { label: "Ubah Role", icon: "🔄", onClick: row => console.log("Role", row.id) },
        { label: "Hapus", icon: "🗑", className: "danger", onClick: row => { setSelectedRow(row); setShowConfirm(true); } },
    ];

    return (
        <div className="page-content">
            <div className="page-header"><h1>Manajemen Pengguna</h1></div>
            <DataTable columns={columns} data={list} loading={loading} actions={actions} searchable={true} placeholder="Cari nama/email..." pageSize={10} emptyMessage="Belum ada user" />
            <ConfirmModal open={showConfirm} onClose={() => { setShowConfirm(false); setSelectedRow(null); }} onConfirm={handleDelete} title="Konfirmasi Hapus" message={`Yakin hapus user "${selectedRow?.nama}"?`} />
        </div>
    );
}
export default AdminUsers;