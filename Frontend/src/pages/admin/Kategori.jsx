import { useEffect, useState } from "react";
import { useToast } from "../../components/admin/Toast";
import { ConfirmModal } from "../../components/admin/Modal";
import { getAllKategori, createKategori, updateKategori, deleteKategori } from "../../api/adminApi";
import DataTable from "../../components/admin/DataTable";

function KategoriPage() {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newName, setNewName] = useState("");
    const { success, error } = useToast();
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [editId, setEditId] = useState(null);
    const [editName, setEditName] = useState("");

    useEffect(() => { load(); }, []);

    const load = async () => {
        setLoading(true);
        try { const r = await getAllKategori(); setList(r.data || []); } catch (e) { error("Gagal memuat data"); }
        setLoading(false);
    };

    const handleCreate = async () => {
        if (!newName.trim()) return;
        try { await createKategori(newName); setNewName(""); success("Kategori berhasil ditambahkan"); load(); }
        catch (e) { error("Gagal menambah kategori"); }
    };

    const handleUpdate = async (id) => {
        if (!editName.trim()) return;
        try { await updateKategori(id, editName); setEditId(null); setEditName(""); success("Kategori berhasil diubah"); load(); }
        catch (e) { error("Gagal mengubah kategori"); }
    };

    const handleDelete = async () => {
        try { await deleteKategori(selectedRow.id); success("Kategori berhasil dihapus"); load(); }
        catch (e) { error("Gagal menghapus kategori"); }
        finally { setShowConfirm(false); setSelectedRow(null); }
    };

    const columns = [
        { header: "No", accessor: "id", render: row => list.findIndex(x => x.id === row.id) + 1 },
        { header: "Nama Kategori", accessor: "nama_kategori", render: row => (
            editId === row.id ? <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="edit-input" /> : row.nama_kategori
        )},
    ];

    const actions = [
        { label: editId ? "Simpan" : "Edit", onClick: row => {
            if (editId === row.id) handleUpdate(row.id);
            else { setEditId(row.id); setEditName(row.nama_kategori); }
        }},
        ...(editId ? [{ label: "Batal", onClick: () => { setEditId(null); setEditName(""); }}] : []),
        { label: "Hapus", className: "danger", onClick: row => { setSelectedRow(row); setShowConfirm(true); } },
    ];

    return (
        <div className="page-content">
            <div className="page-header"><h1>Kategori</h1></div>
            <div className="card-add">
                <input type="text" placeholder="Nama kategori baru..." value={newName} onChange={e => setNewName(e.target.value)} />
                <button className="btn-primary" onClick={handleCreate}>Tambah</button>
            </div>
            <DataTable columns={columns} data={list} loading={loading} actions={actions} searchable={false} pageSize={10} emptyMessage="Belum ada kategori" />
            <ConfirmModal open={showConfirm} onClose={() => { setShowConfirm(false); setSelectedRow(null); }} onConfirm={handleDelete} title="Konfirmasi Hapus" message={`Yakin hapus kategori "${selectedRow?.nama_kategori}"?`} />
        </div>
    );
}
export default KategoriPage;