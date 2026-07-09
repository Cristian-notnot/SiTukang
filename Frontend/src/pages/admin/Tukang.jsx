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

    const columns = [
        { header: "Nama", accessor: "nama" },
        { header: "Kategori", accessor: "nama_kategori" },
        { header: "Telepon", accessor: "telepon" },
        { header: "Rating", accessor: "rating", render: row => `⭐ ${row.rating}` },
        { header: "Status", accessor: "status", render: row => <span className={`badge badge-${row.status}`}>{row.status}</span> },
    ];

    const actions = [
        { label: "Lihat Detail", icon: "👁", onClick: row => console.log("Detail", row.id) },
        { label: "Hapus", icon: "🗑", className: "danger", onClick: row => { setSelectedRow(row); setShowConfirm(true); } },
    ];

    return (
        <div className="page-content">
            <div className="page-header"><h1>Manajemen Tukang</h1></div>
            <DataTable columns={columns} data={list} loading={loading} actions={actions} searchable={true} placeholder="Cari nama/kategori..." pageSize={10} emptyMessage="Belum ada tukang" />
            <ConfirmModal open={showConfirm} onClose={() => { setShowConfirm(false); setSelectedRow(null); }} onConfirm={handleDelete} title="Konfirmasi Hapus" message={`Yakin hapus tukang "${selectedRow?.nama}"?`} />
        </div>
    );
}
export default TukangPage;