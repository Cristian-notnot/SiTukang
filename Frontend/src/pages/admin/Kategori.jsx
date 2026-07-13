import { useEffect, useState } from "react";
import { useToast } from "../../components/admin/Toast";
import Modal, { ConfirmModal } from "../../components/admin/Modal";
import { getAllKategori, createKategori, updateKategori, deleteKategori } from "../../api/adminApi";
import { Plus, Edit3, Trash2 } from "lucide-react";

const ICONS = ["🔧", "⚡", "🔌", "🔨", "❄️", "🎨", "🪟", "🔩"];

function KategoriPage() {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newName, setNewName] = useState("");
    const [newCommission, setNewCommission] = useState("");
    const { success, error } = useToast();
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [editModal, setEditModal] = useState({ open: false, id: null, nama: "" });

    useEffect(() => { load(); }, []);

    const load = async () => {
        setLoading(true);
        try { const r = await getAllKategori(); setList(r.data || []); } catch (e) { error("Gagal memuat data"); }
        setLoading(false);
    };

    const handleCreate = async () => {
        if (!newName.trim()) return;
        try { await createKategori(newName.trim()); setNewName(""); setNewCommission(""); success("Kategori berhasil ditambahkan"); load(); }
        catch (e) { error("Gagal menambah kategori"); }
    };

    const handleEdit = async () => {
        if (!editModal.nama.trim()) return;
        try { await updateKategori(editModal.id, editModal.nama.trim()); success("Kategori berhasil diubah"); load(); setEditModal({ open: false, id: null, nama: "" }); }
        catch (e) { error("Gagal mengubah kategori"); }
    };

    const handleDelete = async () => {
        try { await deleteKategori(selectedRow.id); success("Kategori berhasil dihapus"); load(); }
        catch (e) { error("Gagal menghapus kategori"); }
        finally { setShowConfirm(false); setSelectedRow(null); }
    };

    const openEdit = (k) => setEditModal({ open: true, id: k.id, nama: k.nama_kategori });

    return (
        <div className="page-content">
            <div className="page-header">
                <h1>Manajemen Kategori</h1>
                <p className="page-subtitle">Kelola kategori jasa tukang</p>
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 20, padding: 16, borderRadius: 12, background: "var(--card)", boxShadow: "var(--shadow)", border: "1px solid var(--border)" }}>
                <input type="text" placeholder="Nama kategori baru..." value={newName} onChange={e => setNewName(e.target.value)} style={{ flex: 1, minWidth: 180, padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border)", fontSize: 14, outline: "none" }} />
                <input type="number" placeholder="Komisi %" value={newCommission} onChange={e => setNewCommission(e.target.value)} style={{ width: 110, padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border)", fontSize: 14, outline: "none" }} />
                <button className="btn btn-primary" onClick={handleCreate} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 18px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", border: "none" }}>
                    <Plus size={18} /> Tambah
                </button>
            </div>

            {loading ? (
                <div className="loading-state"><div className="spinner"></div></div>
            ) : list.length === 0 ? (
                <div className="page-state empty-state">
                    <p>Belum ada kategori</p>
                </div>
            ) : (
                <div className="kategori-grid">
                    {list.map((k, i) => (
                        <div key={k.id} className="kategori-card">
                            <div className="kategori-card-top">
                                <div className="kategori-card-icon" style={{ background: `linear-gradient(135deg, ${["#14b8a6","#3b82f6","#f59e0b","#8b5cf6","#ef4444","#06b6d4","#10b981","#ec4899"][i % 8]}, ${["#0f766c","#1d4ed8","#d97706","#6d28d9","#dc2626","#0891b2","#059669","#db2777"][i % 8]})`, color: "#fff" }}>
                                    {ICONS[i % ICONS.length]}
                                </div>
                                <div>
                                    <div className="kategori-card-name">{k.nama_kategori}</div>
                                    <div className="kategori-card-stats">
                                        <span>{k.jumlah_tukang || 0} tukang aktif</span>
                                        <span className={`badge badge-${k.status || "aktif"}`}>{k.status || "aktif"}</span>
                                        <span style={{ color: "var(--primary)", fontWeight: 600 }}>{k.komisi || 10}% komisi</span>
                                    </div>
                                </div>
                                <div className="kategori-card-actions">
                                    <button className="btn-icon btn-icon-edit" onClick={() => openEdit(k)} title="Edit">
                                        <Edit3 size={15} />
                                    </button>
                                    <button className="btn-icon btn-icon-delete" onClick={() => { setSelectedRow(k); setShowConfirm(true); }} title="Hapus">
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal open={editModal.open} onClose={() => setEditModal({ open: false, id: null, nama: "" })} title="Edit Kategori" size="sm">
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <input type="text" placeholder="Nama kategori" value={editModal.nama} onChange={e => setEditModal(p => ({ ...p, nama: e.target.value }))} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border)", fontSize: 14, outline: "none" }} />
                    <div className="modal-actions" style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 4 }}>
                        <button className="btn btn-secondary" onClick={() => setEditModal({ open: false, id: null, nama: "" })}>Batal</button>
                        <button className="btn btn-primary" onClick={handleEdit} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 18px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", border: "none" }}>Simpan</button>
                    </div>
                </div>
            </Modal>

            <ConfirmModal open={showConfirm} onClose={() => { setShowConfirm(false); setSelectedRow(null); }} onConfirm={handleDelete} title="Konfirmasi Hapus" message={`Yakin hapus kategori "${selectedRow?.nama_kategori}"?`} />
        </div>
    );
}
export default KategoriPage;
