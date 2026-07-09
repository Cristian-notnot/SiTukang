import { useEffect, useState } from "react";
import { getLaporan } from "../../api/adminApi";

function LaporanPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { load(); }, []);

    const load = async () => {
        setLoading(true);
        try { const r = await getLaporan(); setData(r.data); } catch (e) { console.error(e); }
        setLoading(false);
    };

    if (loading) return <div className="page-content"><div className="loading-state"><div className="spinner"></div></div></div>;

    return (
        <div className="page-content">
            <div className="page-header"><h1>Laporan</h1><p className="page-subtitle">Ringkasan statistik platform</p></div>
            <div className="stats-grid">
                <div className="stat-card" style={{ borderTop: "3px solid #3b82f6" }}><div className="stat-icon">👥</div><div className="stat-info"><h3>{data?.total_user || 0}</h3><p>Total User</p></div></div>
                <div className="stat-card" style={{ borderTop: "3px solid #10b981" }}><div className="stat-icon">👨‍🔧</div><div className="stat-info"><h3>{data?.total_tukang_aktif || 0}</h3><p>Tukang Aktif</p></div></div>
                <div className="stat-card" style={{ borderTop: "3px solid #6366f1" }}><div className="stat-icon">📅</div><div className="stat-info"><h3>{data?.total_booking || 0}</h3><p>Total Booking</p></div></div>
                <div className="stat-card" style={{ borderTop: "3px solid #22c55e" }}><div className="stat-icon">✅</div><div className="stat-info"><h3>{data?.booking_selesai || 0}</h3><p>Booking Selesai</p></div></div>
                <div className="stat-card" style={{ borderTop: "3px solid #f59e0b" }}><div className="stat-icon">⭐</div><div className="stat-info"><h3>{data?.avg_rating || 0}</h3><p>Rating Rata-rata</p></div></div>
                <div className="stat-card" style={{ borderTop: "3px solid #ec4899" }}><div className="stat-icon">💬</div><div className="stat-info"><h3>{data?.total_review || 0}</h3><p>Total Review</p></div></div>
                <div className="stat-card" style={{ borderTop: "3px solid #f97316" }}><div className="stat-icon">📋</div><div className="stat-info"><h3>{data?.pending_verifikasi || 0}</h3><p>Pending Verifikasi</p></div></div>
            </div>
        </div>
    );
}
export default LaporanPage;