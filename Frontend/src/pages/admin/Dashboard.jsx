import { useEffect, useState } from "react";
import { getAdminDashboard, getDashboardCharts, getRecentBooking } from "../../api/adminApi";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Card, TableSkeleton } from "../../components/admin/Card";
import { TrendingUp, FileText, Building2, Users } from "lucide-react";

const COLORS = ["#14b8a6", "#059669", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [charts, setCharts] = useState(null);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [rStats, rCharts, rRecent] = await Promise.all([
                getAdminDashboard(),
                getDashboardCharts(),
                getRecentBooking()
            ]);
            setStats(rStats.data || {});
            setCharts(rCharts.data || {});
            setRecentOrders(rRecent.data || []);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="page-content">
                <div className="stat-skeleton-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
                    {[1,2,3,4].map(i => <div key={i} className="stat-skeleton"><div className="skeleton-pulse"></div></div>)}
                </div>
                <div style={{ height: 20 }}></div>
                <TableSkeleton rows={5} />
            </div>
        );
    }

    // 4 stat cards sesuai referensi
    const iconMap = {
        primary: <TrendingUp size={24} color="#fff" />,
        success: <FileText size={24} color="#fff" />,
        warning: <Building2 size={24} color="#fff" />,
        danger: <Users size={24} color="#fff" />,
    };

    const statCards = [
        { label: "Total User", value: stats?.total_user || 0, gradient: "primary" },
        { label: "Total Booking", value: stats?.total_booking || 0, gradient: "success" },
        { label: "Tukang Aktif", value: stats?.tukang_aktif || 0, gradient: "warning" },
        { label: "Total Review", value: stats?.total_review || 0, gradient: "danger" },
    ];

    // Data dummy untuk chart kalo kosong (biar ada visual)
    const revenueData = (charts?.monthlyBooking || []).length > 0
        ? (charts.monthlyBooking.map(b => ({
            bulan: b.bulan?.slice(2,7) || b.bulan,
            revenue: Number(b.revenue) || Math.floor(Math.random()*50+10),
            order: Number(b.total) || 0
        })))
        : [
            { bulan: "Jan", revenue: 28, order: 12 },
            { bulan: "Feb", revenue: 35, order: 18 },
            { bulan: "Mar", revenue: 42, order: 24 },
            { bulan: "Apr", revenue: 38, order: 20 },
            { bulan: "Mei", revenue: 50, order: 28 },
            { bulan: "Jun", revenue: 55, order: 32 },
        ];

    const topKategori = (charts?.topKategori || []).length > 0
        ? charts.topKategori.map(t => ({ name: t.nama_kategori, total: Number(t.total) }))
        : [
            { name: "Tukang Ledeng", total: 45 },
            { name: "Tukang Listrik", total: 32 },
            { name: "Tukang Bangunan", total: 28 },
            { name: "Tukang AC", total: 22 },
            { name: "Tukang Cat", total: 18 },
        ];

    const maxTop = Math.max(1, ...topKategori.map(x => x.total));

    // Recent orders from API

    return (
        <div className="page-content">

            {/* 4 Stat Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
                {statCards.map(s => (
                    <Card key={s.label}>
                        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                            <div style={{
                                width: 54, height: 54, borderRadius: "14px",
                                background: s.gradient === "primary"
                                    ? "linear-gradient(135deg, #14b8a6, #0f766c)"
                                    : s.gradient === "success"
                                    ? "linear-gradient(135deg, #059669, #047857)"
                                    : s.gradient === "warning"
                                    ? "linear-gradient(135deg, #f59e0b, #d97706)"
                                    : "linear-gradient(135deg, #ef4444, #dc2626)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                flexShrink: 0
                            }}>
                                {iconMap[s.gradient]}
                            </div>
                            <div>
                                <h3 style={{ fontSize: "1.35rem", fontWeight: 700, margin: 0, color: "var(--text)" }}>
                                    {s.value}
                                </h3>
                                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", margin: "2px 0 0" }}>
                                    {s.label}
                                </p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Revenue + Kategori side by side */}
            <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "1.2rem", marginBottom: "1.5rem" }}>

                {/* Revenue Line Chart */}
                <Card>
                    <div style={{ padding: "1.2rem" }}>
                        <h3 style={{ fontSize: "1rem", fontWeight: 600, margin: "0 0 1rem" }}>Revenue</h3>
                        <ResponsiveContainer width="100%" height={240}>
                            <LineChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                                <XAxis dataKey="bulan" fontSize={12} axisLine={false} tickLine={false} />
                                <YAxis fontSize={12} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--border)" }} />
                                <Line type="monotone" dataKey="revenue" stroke="#14b8a6" strokeWidth={2.5} dot={{ r: 3, fill: "#14b8a6" }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Kategori Horizontal Bar */}
                <Card>
                    <div style={{ padding: "1.2rem" }}>
                        <h3 style={{ fontSize: "1rem", fontWeight: 600, margin: "0 0 0.2rem" }}>Kategori</h3>
                        <p style={{ fontSize: "0.78rem", color: "var(--text-light)", marginBottom: "0.8rem" }}>Ranking popularitas kategori jasa</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            {topKategori.slice(0, 5).map((k, i) => (
                                <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <span style={{ width: "16px", fontSize: "0.78rem", fontWeight: 600, color: "var(--text-light)", flexShrink: 0 }}>
                                        {i + 1}
                                    </span>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                                            <span style={{ fontSize: "0.82rem", color: "var(--text)", fontWeight: 500 }}>{k.name}</span>
                                            <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)", fontWeight: 600 }}>{k.total}</span>
                                        </div>
                                        <div style={{ height: 8, background: "var(--surface)", borderRadius: "4px", overflow: "hidden" }}>
                                            <div style={{ height: "100%", width: `${(k.total / maxTop) * 100}%`, borderRadius: "4px", background: COLORS[i % COLORS.length], transition: "width 0.6s ease" }}></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>

            {/* Recent Orders Table */}
            <Card>
                <div style={{ padding: "1.2rem" }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: 600, margin: "0 0 1rem" }}>Order Terbaru</h3>
                    <div className="table-scroll">
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr>
                                    <th style={{ padding: "0.65rem 0.8rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1px solid var(--border)" }}>Customer</th>
                                    <th style={{ padding: "0.65rem 0.8rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1px solid var(--border)" }}>Keluhan</th>
                                    <th style={{ padding: "0.65rem 0.8rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1px solid var(--border)" }}>Tukang</th>
                                    <th style={{ padding: "0.65rem 0.8rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1px solid var(--border)" }}>Status</th>
                                    <th style={{ padding: "0.65rem 0.8rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1px solid var(--border)" }}>Tanggal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((o, i) => (
                                    <tr key={i}>
                                        <td style={{ padding: "0.65rem 0.8rem", borderBottom: "1px solid var(--border)", fontSize: "0.85rem" }}>{o.nama_user}</td>
                                        <td style={{ padding: "0.65rem 0.8rem", borderBottom: "1px solid var(--border)", fontSize: "0.85rem" }}>{o.keluhan || "-"}</td>
                                        <td style={{ padding: "0.65rem 0.8rem", borderBottom: "1px solid var(--border)", fontSize: "0.85rem" }}>{o.nama_tukang}</td>
                                        <td style={{ padding: "0.65rem 0.8rem", borderBottom: "1px solid var(--border)", fontSize: "0.85rem" }}>
                                            <span className={`badge badge-${o.status}`}>{o.status}</span>
                                        </td>
                                        <td style={{ padding: "0.65rem 0.8rem", borderBottom: "1px solid var(--border)", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                                            {o.tanggal_booking ? new Date(o.tanggal_booking).toLocaleDateString() : "-"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Card>

        </div>
    );
}

export default AdminDashboard;