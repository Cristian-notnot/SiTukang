import { useEffect, useState } from "react";
import { getAllTicket, updateTicketStatus } from "../../api/adminApi";
import DataTable from "../../components/admin/DataTable";
import { MessageSquare, AlertTriangle, Clock, CheckCircle } from "lucide-react";

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

    const statCards = [
        { label: "Tiket Terbuka", value: list.filter(t => t.status === "open").length, gradient: "primary", icon: <MessageSquare size={22} color="#fff" /> },
        { label: "Prioritas Tinggi", value: list.filter(t => t.priority === "high").length, gradient: "danger", icon: <AlertTriangle size={22} color="#fff" /> },
        { label: "Diproses", value: list.filter(t => t.status === "in_progress").length, gradient: "warning", icon: <Clock size={22} color="#fff" /> },
        { label: "Selesai Hari Ini", value: list.filter(t => t.status === "resolved").length, gradient: "success", icon: <CheckCircle size={22} color="#fff" /> },
    ];

    const columns = [
        { header: "ID", accessor: "id" },
        { header: "Subjek", accessor: "judul" },
        { header: "Pelapor", accessor: "nama_user", render: row => row.nama_user || row.email || "-" },
        { header: "Prioritas", accessor: "priority", render: row => <span className={`badge badge-${row.priority}`}>{row.priority}</span> },
        { header: "Status", accessor: "status", render: row => (
            <select className="status-select" value={row.status} onChange={e => handleStatus(row.id, e.target.value)}>
                {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
        )},
        { header: "Waktu", accessor: "created_at", render: row => {
            const diff = Math.floor((new Date() - new Date(row.created_at)) / (1000 * 60 * 60));
            return diff < 1 ? "Baru saja" : diff < 24 ? `${diff} jam lalu` : new Date(row.created_at).toLocaleDateString();
        }},
    ];

    return (
        <div className="page-content">
            <div className="page-header"><h1>Tiket Customer Support</h1><p className="page-subtitle">Kelola tiket bantuan dari pengguna</p></div>

            <div className="ticket-stats">
                {statCards.map((s, i) => (
                    <div key={i} className={`ticket-stat-card ${s.gradient}`}>
                        <div className="ticket-stat-icon">{s.icon}</div>
                        <div className="ticket-stat-body">
                            <h3>{s.value}</h3>
                            <p>{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <DataTable columns={columns} data={list} loading={loading} searchable={true} placeholder="Cari subjek/pelapor..." pageSize={10} emptyMessage="Belum ada ticket" />
        </div>
    );
}
export default TicketPage;
