import { useEffect, useState } from "react";
import { getAllKategori, getAllKomisi } from "../../api/adminApi";
import { useToast } from "../../components/admin/Toast";
import { Card } from "../../components/admin/Card";
import DataTable from "../../components/admin/DataTable";

function KomisiPage() {
    const [list, setList] = useState([]);
    const [kategori, setKategori] = useState([]);
    const [loading, setLoading] = useState(true);
    const [globalCommission, setGlobalCommission] = useState(10);
    const [adminFee, setAdminFee] = useState(2500);
    const [topRatedBonus, setTopRatedBonus] = useState(2);
    const { success, error } = useToast();
    const [komisiData, setKomisiData] = useState({});

    useEffect(() => { load(); }, []);

    const load = async () => {
        setLoading(true);
        try {
            const [rKomisi, rKategori] = await Promise.all([
                getAllKomisi(),
                getAllKategori()
            ]);
            setList(rKomisi.data || []);
            setKategori(rKategori.data || []);
            const kd = {};
            (rKategori.data || []).forEach(k => { kd[k.id] = { komisi: k.komisi || 10, min: k.minimal || 0, max: k.maksimal || 0 }; });
            setKomisiData(kd);
        } catch (e) { error("Gagal memuat data"); }
        setLoading(false);
    };

    const handleSaveGlobal = () => {
        success("Pengaturan komisi global disimpan (simulasi)");
    };

    const updateKomisi = (id, field, value) => {
        setKomisiData(prev => ({ ...prev, [id]: { ...prev[id], [field]: Number(value) || 0 } }));
    };

    const columns = [
        { header: "Kategori", accessor: "nama_kategori", render: row => {
            const k = kategori.find(x => x.id === row.kategori_id) || row;
            return k.nama_kategori || row.nama_kategori || "-";
        }},
        { header: "Komisi %", accessor: "komisi", render: row => (
            <div className="komisi-inline-edit">
                <input type="number" value={komisiData[row.kategori_id]?.komisi ?? row.komisi ?? 10}
                    onChange={e => updateKomisi(row.kategori_id, "komisi", e.target.value)} />%
            </div>
        )},
        { header: "Minimal", accessor: "minimal", render: row => (
            <div className="komisi-inline-edit">
                Rp <input type="number" value={komisiData[row.kategori_id]?.min ?? row.minimal ?? 0}
                    onChange={e => updateKomisi(row.kategori_id, "min", e.target.value)} />
            </div>
        )},
        { header: "Maksimal", accessor: "maksimal", render: row => (
            <div className="komisi-inline-edit">
                Rp <input type="number" value={komisiData[row.kategori_id]?.max ?? row.maksimal ?? 0}
                    onChange={e => updateKomisi(row.kategori_id, "max", e.target.value)} />
            </div>
        )},
    ];

    return (
        <div className="page-content">
            <div className="page-header"><h1>Manajemen Komisi</h1><p className="page-subtitle">Atur komisi untuk setiap kategori</p></div>
            <div className="komisi-layout">
                <div>
                    <DataTable columns={columns} data={kategori} loading={loading} searchable={false} pageSize={20} emptyMessage="Belum ada kategori" />
                </div>
                <div className="komisi-sidebar">
                    <h3>Aturan Global</h3>
                    <div className="komisi-form-group">
                        <label>Default Komisi (%)</label>
                        <input type="number" value={globalCommission} onChange={e => setGlobalCommission(Number(e.target.value))} />
                    </div>
                    <div className="komisi-form-group">
                        <label>Biaya Admin (Rp)</label>
                        <input type="number" value={adminFee} onChange={e => setAdminFee(Number(e.target.value))} />
                    </div>
                    <div className="komisi-form-group">
                        <label>Bonus Top Rated (%)</label>
                        <input type="number" value={topRatedBonus} onChange={e => setTopRatedBonus(Number(e.target.value))} />
                    </div>
                    <button className="btn btn-primary btn-lg" onClick={handleSaveGlobal} style={{ width: "100%", marginTop: 8 }}>
                        Simpan Semua
                    </button>
                </div>
            </div>
        </div>
    );
}
export default KomisiPage;
