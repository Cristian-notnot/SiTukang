import { useEffect, useState } from "react";
import { getAllTicket, updateTicketStatus } from "../../api/adminApi";

const statusOptions = ["open", "in_progress", "resolved", "closed"];

function TicketPage() {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { load(); }, []);

    const load = async () => {
        setLoading(true);
        try { const r = await getAllTicket(); setList(r.data || []); } catch (e) { console.error(e); }
        setLoading(false);
    };

    const handleStatus = async (id, status) => {
        try { await updateTicketStatus(id, status); load(); } catch (e) { alert("Gagal"); }
    };

    return (
        <div className="page-content">
            <div className="page-header"><h1>Ticket Support</h1><p className="page-subtitle">Kelola tiket bantuan dari pengguna</p></div>
            <div className="table-wrap">
                <table>
                    <thead><tr><th>No</th><th>Judul</th><th>Deskripsi</th><th>Priority</th><th>Status</th><th>Tanggal</th></tr></thead>
                    <tbody>
                        {loading ? <tr><td colSpan={6}>Loading...</td></tr> : list.length === 0 ? <tr><td colSpan={6}><p className="empty-message">Belum ada ticket</p></td></tr> : list.map((t, i) => (
                            <tr key={t.id}>
                                <td>{i + 1}</td><td>{t.judul}</td><td>{t.deskripsi}</td>
                                <td><span className={`badge badge-${t.priority}`}>{t.priority}</span></td>
                                <td>
                                    <select className="status-select" value={t.status} onChange={e => handleStatus(t.id, e.target.value)}>
                                        {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </td>
                                <td>{new Date(t.created_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
export default TicketPage;