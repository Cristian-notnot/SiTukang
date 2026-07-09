import { useEffect, useState } from "react";
import { getAllKomisi } from "../../api/adminApi";

function KomisiPage() {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { load(); }, []);

    const load = async () => {
        setLoading(true);
        try { const r = await getAllKomisi(); setList(r.data || []); } catch (e) { console.error(e); }
        setLoading(false);
    };

    return (
        <div className="page-content">
            <div className="page-header"><h1>Komisi</h1><p className="page-subtitle">Riwayat komisi dari setiap transaksi</p></div>
            <div className="table-wrap">
                <table>
                    <thead><tr><th>No</th><th>Tukang</th><th>Booking</th><th>Jumlah Komisi</th><th>Status</th><th>Tanggal</th></tr></thead>
                    <tbody>
                        {loading ? <tr><td colSpan={6}>Loading...</td></tr> : list.length === 0 ? <tr><td colSpan={6}><p className="empty-message">Belum ada data komisi</p></td></tr> : list.map((k, i) => (
                            <tr key={k.id}>
                                <td>{i + 1}</td><td>{k.nama_tukang}</td><td>#{k.booking_id}</td>
                                <td>Rp {Number(k.jumlah || 0).toLocaleString()}</td>
                                <td><span className={`badge badge-${k.status}`}>{k.status}</span></td>
                                <td>{new Date(k.created_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
export default KomisiPage;