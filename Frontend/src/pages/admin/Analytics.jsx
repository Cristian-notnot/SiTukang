import { useEffect, useState } from "react";
import { getAdminDashboard, getDashboardCharts } from "../../api/adminApi";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Card, TableSkeleton } from "../../components/admin/Card";
import { TrendingUp, Users, DollarSign, MapPin } from "lucide-react";

const COLORS = ["#14b8a6", "#3b82f6", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4"];

function AnalyticsPage() {
    const [stats, setStats] = useState(null);
    const [charts, setCharts] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [rStats, rCharts] = await Promise.all([
                getAdminDashboard(),
                getDashboardCharts()
            ]);
            setStats(rStats.data || {});
            setCharts(rCharts.data || {});
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const statCards = [
        { label: "DAU", value: (stats?.user_hari_ini || 0).toLocaleString(), gradient: "teal", icon: <Users size={22} color="#fff" /> },
        { label: "Conversion Rate", value: `${stats?.conversion_rate || "2.4"}%`, gradient: "blue", icon: <TrendingUp size={22} color="#fff" /> },
        { label: "Avg Order Value", value: `Rp ${(stats?.avg_order_value || 85000).toLocaleString()}`, gradient: "green", icon: <DollarSign size={22} color="#fff" /> },
        { label: "Kota Teratas", value: stats?.top_city || "Jakarta", gradient: "purple", icon: <MapPin size={22} color="#fff" /> },
    ];

    const orderGrowth = (charts?.monthlyBooking || []).length > 0
        ? charts.monthlyBooking.map(b => ({ bulan: b.bulan?.slice(2, 7) || b.bulan, order: Number(b.total) || 0 }))
        : [
            { bulan: "Jan", order: 120 }, { bulan: "Feb", order: 145 }, { bulan: "Mar", order: 168 },
            { bulan: "Apr", order: 155 }, { bulan: "Mei", order: 190 }, { bulan: "Jun", order: 210 },
        ];

    const cityData = [
        { kota: "Jakarta", jumlah: 320 }, { kota: "Bandung", jumlah: 210 },
        { kota: "Surabaya", jumlah: 185 }, { kota: "Medan", jumlah: 140 },
        { kota: "Yogyakarta", jumlah: 115 },
    ];
    const maxCity = Math.max(1, ...cityData.map(c => c.jumlah));

    if (loading) {
        return (
            <div className="page-content">
                <div className="page-header"><h1>Analytics</h1><p className="page-subtitle">Statistik dan analisis platform</p></div>
                <div className="analytics-grid">
                    {[1,2,3,4].map(i => <div key={i} className="stat-skeleton"><div className="skeleton-pulse"></div></div>)}
                </div>
                <TableSkeleton rows={5} />
            </div>
        );
    }

    return (
        <div className="page-content">
            <div className="page-header"><h1>Analytics</h1><p className="page-subtitle">Statistik dan analisis platform</p></div>

            <div className="analytics-grid">
                {statCards.map((s, i) => (
                    <div key={i} className={`analytics-stat ${s.gradient}`}>
                        <div className="analytics-stat-icon">{s.icon}</div>
                        <div className="analytics-stat-body">
                            <h3>{s.value}</h3>
                            <p>{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="analytics-charts-grid">
                <div className="analytics-chart-card">
                    <div className="analytics-chart-header">
                        <h3>Pertumbuhan Order</h3>
                    </div>
                    <div className="analytics-chart-body">
                        <ResponsiveContainer width="100%" height={260}>
                            <LineChart data={orderGrowth}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                                <XAxis dataKey="bulan" fontSize={12} axisLine={false} tickLine={false} />
                                <YAxis fontSize={12} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--border)" }} />
                                <Line type="monotone" dataKey="order" stroke="#14b8a6" strokeWidth={2.5} dot={{ r: 3, fill: "#14b8a6" }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="analytics-chart-card">
                    <div className="analytics-chart-header">
                        <h3>Distribusi Kota</h3>
                    </div>
                    <div className="analytics-chart-body">
                        <div className="analytics-town-bar">
                            {cityData.map((c, i) => (
                                <div key={i} className="analytics-bar-item">
                                    <span className="analytics-bar-label">{c.kota}</span>
                                    <div className="analytics-bar-track">
                                        <div className="analytics-bar-fill" style={{ width: `${(c.jumlah / maxCity) * 100}%`, background: COLORS[i % COLORS.length] }}></div>
                                    </div>
                                    <span className="analytics-bar-value">{c.jumlah}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AnalyticsPage;
