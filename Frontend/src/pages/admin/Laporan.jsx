import { useEffect, useState } from "react";
import { getLaporan } from "../../api/adminApi";
import { Card, StatCardSkeleton } from "../../components/admin/Card";
import { TrendingUp, Users, Wrench, CreditCard, Grid3X3, MapPin } from "lucide-react";

const REPORTS = [
    { icon: <TrendingUp size={22} color="#fff" />, title: "Laporan Pendapatan Bulanan", desc: "Ringkasan pendapatan platform per bulan", color: "#14b8a6", dark: "#0f766c" },
    { icon: <Wrench size={22} color="#fff" />, title: "Aktivitas Tukang", desc: "Statistik performa dan aktivitas tukang", color: "#3b82f6", dark: "#1d4ed8" },
    { icon: <Users size={22} color="#fff" />, title: "Customer", desc: "Pertumbuhan dan demografi pengguna", color: "#8b5cf6", dark: "#6d28d9" },
    { icon: <CreditCard size={22} color="#fff" />, title: "Pembayaran", desc: "Rekap transaksi dan status pembayaran", color: "#10b981", dark: "#059669" },
    { icon: <Grid3X3 size={22} color="#fff" />, title: "Kategori", desc: "Distribusi kategori jasa terpopuler", color: "#f59e0b", dark: "#d97706" },
    { icon: <MapPin size={22} color="#fff" />, title: "Wilayah", desc: "Sebaran pengguna dan tukang per kota", color: "#ec4899", dark: "#db2777" },
];

function LaporanPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { load(); }, []);

    const load = async () => {
        setLoading(true);
        try { const r = await getLaporan(); setData(r.data); } catch (e) { console.error(e); }
        setLoading(false);
    };

    return (
        <div className="page-content">
            <div className="page-header"><h1>Laporan</h1><p className="page-subtitle">Unduh laporan dan ringkasan data platform</p></div>

            <div className="report-grid">
                {REPORTS.map((r, i) => (
                    <div key={i} className="report-card">
                        <div className="report-card-header">
                            <div className="report-card-icon" style={{ background: `linear-gradient(135deg, ${r.color}, ${r.dark})`, color: "#fff" }}>
                                {r.icon}
                            </div>
                            <div className="report-card-title">{r.title}</div>
                        </div>
                        <p className="report-card-desc">{r.desc}</p>
                        <div className="report-card-actions">
                            <button className="btn btn-outline-primary btn-sm">Preview</button>
                            <button className="btn btn-primary btn-sm">Download PDF</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
export default LaporanPage;
