import { useEffect, useState } from "react";
import { useToast } from "../../components/admin/Toast";
import { ConfirmModal } from "../../components/admin/Modal";
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

    const handleDelete = async () => {
        try { await deleteKategori(selectedRow.id); success("Kategori berhasil dihapus"); load(); }
        catch (e) { error("Gagal menghapus kategori"); }
        finally { setShowConfirm(false); setSelectedRow(null); }
    };

    return (
        <div className="page-content">
            <div className="page-header">
                <h1>Manajemen Kategori</h1>
                <p className="page-subtitle">Kelola kategori jasa tukang</p>
            </div>

            <div className="card-add">
                <input type="text" placeholder="Nama kategori baru..." value={newName} onChange={e => setNewName(e.target.value)} />
                <input type="number" placeholder="Komisi %" value={newCommission} onChange={e => setNewCommission(e.target.value)} style={{ width: 120 }} />
                <button className="btn btn-primary" onClick={handleCreate}>
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
                                    <button onClick={() => {
                                        const newName = prompt("Edit nama kategori:", k.nama_kategori);
                                        if (newName && newName.trim()) updateKategori(k.id, newName.trim()).then(() => { success("Kategori diubah"); load(); }).catch(() => error("Gagal"));
                                    }}><Edit3 size={14} /></button>
                                    <button className="danger" onClick={() => { setSelectedRow(k); setShowConfirm(true); }}><Trash2 size={14} /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ConfirmModal open={showConfirm} onClose={() => { setShowConfirm(false); setSelectedRow(null); }} onConfirm={handleDelete} title="Konfirmasi Hapus" message={`Yakin hapus kategori "${selectedRow?.nama_kategori}"?`} />
        </div>
    );
}
export default KategoriPage;
