import { useEffect, useState } from "react";
import { getAllPembayaran } from "../../api/adminApi";

function PembayaranPage() {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { load(); }, []);

    const load = async () => {
        setLoading(true);
        try { const r = await getAllPembayaran(); setList(r.data || []); } catch (e) { console.error(e); }
        setLoading(false);
    };

    return (
        <div className="page-content">
            <div className="page-header"><h1>Pembayaran</h1><p className="page-subtitle">Riwayat pembayaran platform</p></div>
            <div className="table-wrap">
                <table>
                    <thead><tr><th>No</th><th>User</th><th>Booking</th><th>Jumlah</th><th>Status</th><th>Tanggal</th></tr></thead>
                    <tbody>
                        {loading ? <tr><td colSpan={6}>Loading...</td></tr> : list.length === 0 ? <tr><td colSpan={6}><p className="empty-message">Belum ada data pembayaran</p></td></tr> : list.map((p, i) => (
                            <tr key={p.id}>
                                <td>{i + 1}</td><td>{p.nama_user}</td><td>#{p.booking_id}</td>
                                <td>Rp {Number(p.jumlah || 0).toLocaleString()}</td>
                                <td><span className={`badge badge-${p.status}`}>{p.status}</span></td>
                                <td>{new Date(p.created_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
export default PembayaranPage;