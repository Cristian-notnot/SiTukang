import { useEffect, useState } from "react";
import { getAllPembayaran } from "../../api/adminApi";
import DataTable from "../../components/admin/DataTable";
import { CreditCard, ArrowDownCircle, ArrowUpCircle, RotateCcw } from "lucide-react";

function PembayaranPage() {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { load(); }, []);

    const load = async () => {
        setLoading(true);
        try { const r = await getAllPembayaran(); setList(r.data || []); } catch (e) { console.error(e); }
        setLoading(false);
    };

    const totalMasuk = list.filter(p => p.status === "sukses").reduce((sum, p) => sum + Number(p.jumlah || 0), 0);
    const totalKeluar = list.filter(p => p.status === "refund").reduce((sum, p) => sum + Number(p.jumlah || 0), 0);
    const refundPending = list.filter(p => p.status === "pending_refund").length;

    const statCards = [
        { label: "Saldo Escrow", value: `Rp ${(totalMasuk - totalKeluar).toLocaleString()}`, gradient: "teal", icon: <CreditCard size={24} color="#fff" /> },
        { label: "Dana Masuk", value: `Rp ${totalMasuk.toLocaleString()}`, gradient: "green", icon: <ArrowDownCircle size={24} color="#fff" /> },
        { label: "Dana Keluar", value: `Rp ${totalKeluar.toLocaleString()}`, gradient: "red", icon: <ArrowUpCircle size={24} color="#fff" /> },
        { label: "Refund Pending", value: refundPending, gradient: "orange", icon: <RotateCcw size={24} color="#fff" /> },
    ];

    const columns = [
        { header: "ID", accessor: "id" },
        { header: "Deskripsi", accessor: "deskripsi", render: row => row.deskripsi || `Pembayaran #${row.booking_id}` },
        { header: "Jumlah", accessor: "jumlah", render: row => {
            const amount = Number(row.jumlah || 0);
            const isOut = row.status === "refund" || row.tipe === "keluar";
            return <span className={isOut ? "payment-amount-negative" : "payment-amount-positive"}>{isOut ? "-" : "+"}Rp {amount.toLocaleString()}</span>;
        }},
        { header: "Status", accessor: "status", render: row => <span className={`badge badge-${row.status}`}>{row.status}</span> },
        { header: "Tanggal", accessor: "created_at", render: row => new Date(row.created_at).toLocaleDateString() },
    ];

    return (
        <div className="page-content">
            <div className="page-header"><h1>Manajemen Pembayaran</h1><p className="page-subtitle">Riwayat transaksi keuangan platform</p></div>

            <div className="payment-stats">
                {statCards.map((s, i) => (
                    <div key={i} className={`payment-stat-card ${s.gradient}`}>
                        <p className="payment-stat-label">{s.label}</p>
                        <h3 className="payment-stat-value">{s.value}</h3>
                    </div>
                ))}
            </div>

            <DataTable columns={columns} data={list} loading={loading} searchable={true} placeholder="Cari transaksi..." pageSize={10} emptyMessage="Belum ada data pembayaran" />
        </div>
    );
}
export default PembayaranPage;
