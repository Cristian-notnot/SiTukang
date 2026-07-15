import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    getDashboardV2, getOrders, updateOrderStatus,
    getEarnings, getSchedule, getTodaySchedule,
    getPortfolio, addPortfolio, deletePortfolio,
    getBank, saveBank, requestWithdraw, getWithdrawHistory,
    getReviewsV2, getNotifications, readNotification, readAllNotifications,
    getAvailability, saveAvailability, getLeaves,
    getProfileV2, updateProfileV2, getTips
} from "../../api/tukangApi";
import "../../assets/css/TukangDashboard.css";
import logoImg from "../../assets/gambar/logo.jpeg";
import { FiHome, FiInbox, FiTool, FiCheckCircle, FiCalendar, FiDollarSign, FiCreditCard, FiImage, FiStar, FiBell, FiToggleLeft, FiUser, FiLogOut } from "react-icons/fi";

const DAYS = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const HARI = ["senin", "selasa", "rabu", "kamis", "jumat", "sabtu", "minggu"];
const MONTHS = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

function Dashboard() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    // ─── Menu ───
    const [menu, setMenu] = useState("dashboard");
    const [submenu, setSubmenu] = useState(null);
    const fileInputRef = useRef(null);

    // ─── Loading ───
    const [loading, setLoading] = useState(false);

    // ─── Dashboard ───
    const [stats, setStats] = useState(null);
    const [tips, setTips] = useState([]);
    const [todaySched, setTodaySched] = useState([]);

    // ─── Orders ───
    const [orders, setOrders] = useState([]);
    const [orderLoading, setOrderLoading] = useState(false);

    // ─── Calendar ───
    const [calMonth, setCalMonth] = useState(new Date().getMonth() + 1);
    const [calYear, setCalYear] = useState(new Date().getFullYear());
    const [schedules, setSchedules] = useState([]);

    // ─── Earnings ───
    const [earnings, setEarnings] = useState(null);

    // ─── Portfolio ───
    const [portfolios, setPortfolios] = useState([]);
    const [portCaption, setPortCaption] = useState("");

    // ─── Bank & Withdraw ───
    const [bank, setBank] = useState(null);
    const [bankForm, setBankForm] = useState({ bank_name: "", account_number: "", account_holder: "" });
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [withdrawHistory, setWithdrawHistory] = useState([]);

    // ─── Reviews ───
    const [reviews, setReviews] = useState([]);

    // ─── Notifications ───
    const [notifs, setNotifs] = useState([]);

    // ─── Availability ───
    const [avail, setAvail] = useState(null);
    const [leaves, setLeaves] = useState([]);

    // ─── Profile ───
    const [profile, setProfile] = useState(null);
    const [profileForm, setProfileForm] = useState({});

    // ─── Messages ───
    const [message, setMessage] = useState(null);

    const showMsg = (msg, type = "success") => {
        setMessage({ text: msg, type });
        setTimeout(() => setMessage(null), 4000);
    };

    // ─── Loaders ───
    useEffect(() => {
        if (menu === "dashboard") { loadDashboard(); loadTips(); loadTodaySchedule(); }
        if (menu === "incoming" || menu === "active" || menu === "completed") loadOrders(menu);
        if (menu === "schedule") loadSchedule();
        if (menu === "earnings") loadEarnings();
        if (menu === "portfolio") loadPortfolio();
        if (menu === "withdraw") { loadBank(); loadWithdrawHistory(); }
        if (menu === "reviews") loadReviews();
        if (menu === "notifications") loadNotifs();
        if (menu === "availability") { loadAvailability(); loadLeaves(); }
        if (menu === "profile") loadProfile();
    }, [menu]);

    const loadDashboard = async () => {
        setLoading(true);
        try { const r = await getDashboardV2(); setStats(r.data); } catch (e) { /* ignore */ }
        setLoading(false);
    };
    const loadTips = async () => {
        try { const r = await getTips(); setTips(r.data); } catch (e) { /* ignore */ }
    };
    const loadTodaySchedule = async () => {
        try { const r = await getTodaySchedule(); setTodaySched(r.data || []); } catch (e) { /* ignore */ }
    };
    const loadOrders = async (type) => {
        setOrderLoading(true);
        try { const r = await getOrders(type); setOrders(r.data || []); } catch (e) { setOrders([]); }
        setOrderLoading(false);
    };
    const loadSchedule = async () => {
        try { const r = await getSchedule(calMonth, calYear); setSchedules(r.data || []); } catch (e) { setSchedules([]); }
    };
    useEffect(() => { if (menu === "schedule") loadSchedule(); }, [calMonth, calYear]);
    const loadEarnings = async () => {
        setLoading(true);
        try { const r = await getEarnings(); setEarnings(r.data); } catch (e) { /* ignore */ }
        setLoading(false);
    };
    const loadPortfolio = async () => {
        try { const r = await getPortfolio(); setPortfolios(r.data || []); } catch (e) { setPortfolios([]); }
    };
    const loadBank = async () => {
        try { const r = await getBank(); setBank(r.data); if (r.data) setBankForm(r.data); } catch (e) { /* ignore */ }
    };
    const loadWithdrawHistory = async () => {
        try { const r = await getWithdrawHistory(); setWithdrawHistory(r.data || []); } catch (e) { setWithdrawHistory([]); }
    };
    const loadReviews = async () => {
        try { const r = await getReviewsV2(); setReviews(r.data || []); } catch (e) { setReviews([]); }
    };
    const loadNotifs = async () => {
        try { const r = await getNotifications(); setNotifs(r.data || []); } catch (e) { setNotifs([]); }
    };
    const loadAvailability = async () => {
        try { const r = await getAvailability(); setAvail(r.data); } catch (e) { /* ignore */ }
    };
    const loadLeaves = async () => {
        try { const r = await getLeaves(); setLeaves(r.data || []); } catch (e) { setLeaves([]); }
    };
    const loadProfile = async () => {
        setLoading(true);
        try { const r = await getProfileV2(); setProfile(r.data); setProfileForm(r.data); } catch (e) { /* ignore */ }
        setLoading(false);
    };

    // ─── Actions ───
    const handleOrderStatus = async (id, status) => {
        try {
            const r = await updateOrderStatus(id, status);
            showMsg(r.message);
            loadOrders(menu);
            if (menu === "dashboard") loadDashboard();
        } catch (e) {
            showMsg(e.response?.data?.message || "Gagal update status", "error");
        }
    };

    const handlePortfolioUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const fd = new FormData();
        fd.append("foto", file);
        if (portCaption) fd.append("caption", portCaption);
        try {
            const r = await addPortfolio(fd);
            showMsg(r.message);
            setPortCaption("");
            loadPortfolio();
        } catch (err) {
            showMsg("Gagal upload portfolio", "error");
        }
    };

    const handleDeletePortfolio = async (id) => {
        if (!confirm("Hapus foto ini?")) return;
        try { await deletePortfolio(id); showMsg("Portfolio dihapus"); loadPortfolio(); }
        catch (e) { showMsg("Gagal hapus", "error"); }
    };

    const handleSaveBank = async () => {
        try {
            const r = await saveBank(bankForm);
            showMsg(r.message);
            loadBank();
        } catch (e) { showMsg("Gagal simpan bank", "error"); }
    };

    const handleWithdraw = async () => {
        const amount = Number(withdrawAmount);
        if (!amount || amount < 10000) { showMsg("Minimal penarikan Rp10.000", "error"); return; }
        try {
            const r = await requestWithdraw(amount);
            showMsg(r.message);
            setWithdrawAmount("");
            loadWithdrawHistory();
        } catch (e) { showMsg(e.response?.data?.message || "Gagal", "error"); }
    };

    const handleReadNotif = async (id) => {
        try { await readNotification(id); loadNotifs(); } catch (e) { /* ignore */ }
    };

    const handleReadAll = async () => {
        try { await readAllNotifications(); loadNotifs(); } catch (e) { /* ignore */ }
    };

    const handleSaveAvailability = async () => {
        try {
            const r = await saveAvailability(avail || {});
            showMsg(r.message);
        } catch (e) { showMsg("Gagal simpan", "error"); }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const r = await updateProfileV2(profileForm);
            showMsg(r.message);
            loadProfile();
        } catch (e) { showMsg("Gagal update", "error"); }
    };

    const sidebarLinks = [
        { key: "dashboard", label: "Dashboard" },
        { key: "incoming", label: "Pesanan Masuk" },
        { key: "active", label: "Pekerjaan Aktif" },
        { key: "completed", label: "Riwayat" },
        { key: "schedule", label: "Jadwal" },
        { key: "earnings", label: "Pendapatan" },
        { key: "withdraw", label: "Tarik Dana" },
        { key: "portfolio", label: "Portfolio" },
        { key: "reviews", label: "Ulasan" },
        { key: "notifications", label: "Notifikasi" },
        { key: "availability", label: "Ketersediaan" },
        { key: "profile", label: "Profil" },
    ];

    const navItems = [
        { key: "dashboard", label: "Dashboard", icon: FiHome, badge: false },
        { key: "incoming", label: "Pesanan Masuk", icon: FiInbox, badge: stats?.pending },
        { key: "active", label: "Pekerjaan Aktif", icon: FiTool, badge: (stats?.diterima || 0) + (stats?.dikerjakan || 0) },
        { key: "completed", label: "Riwayat", icon: FiCheckCircle },
        { key: "schedule", label: "Jadwal", icon: FiCalendar },
        { key: "", label: "— Keuangan —", divider: true },
        { key: "earnings", label: "Pendapatan", icon: FiDollarSign },
        { key: "withdraw", label: "Tarik Dana", icon: FiCreditCard },
        { key: "", label: "— Lainnya —", divider: true },
        { key: "portfolio", label: "Portfolio", icon: FiImage },
        { key: "reviews", label: "Ulasan", icon: FiStar },
        { key: "notifications", label: "Notifikasi", icon: FiBell, badge: notifs.filter(n => !n.is_read).length },
        { key: "availability", label: "Ketersediaan", icon: FiToggleLeft },
        { key: "profile", label: "Profil", icon: FiUser },
    ];

    // ─── Calendar ───
    const renderCalendar = () => {
        const firstDay = new Date(calYear, calMonth - 1, 1);
        const lastDay = new Date(calYear, calMonth, 0);
        const startDay = firstDay.getDay();
        const totalDays = lastDay.getDate();

        const cells = [];
        for (let i = 0; i < startDay; i++) cells.push(<td key={`empty-${i}`} className="cal-empty"></td>);

        for (let d = 1; d <= totalDays; d++) {
            const dateStr = `${calYear}-${String(calMonth).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
            const daySched = schedules.filter(s => {
                const sDate = new Date(s.tanggal_booking).toISOString().split("T")[0];
                return sDate === dateStr;
            });
            const isToday = dateStr === new Date().toISOString().split("T")[0];
            cells.push(
                <td key={d} className={`cal-day ${isToday ? "cal-today" : ""} ${daySched.length ? "cal-has-event" : ""}`}>
                    <span className="cal-date-num">{d}</span>
                    {daySched.slice(0, 2).map(s => (
                        <div key={s.id} className={`cal-event cal-${s.status}`}>
                            {s.nama_user?.split(" ")[0]}
                        </div>
                    ))}
                    {daySched.length > 2 && <div className="cal-more">+{daySched.length - 2}</div>}
                </td>
            );
        }

        const rows = [];
        for (let i = 0; i < cells.length; i += 7) {
            rows.push(<tr key={i}>{cells.slice(i, i + 7)}</tr>);
        }

        return (
            <div className="cal-wrap">
                <div className="cal-nav">
                    <button onClick={() => { if (calMonth === 1) { setCalMonth(12); setCalYear(calYear - 1); } else setCalMonth(calMonth - 1); }}>‹</button>
                    <span>{MONTHS[calMonth - 1]} {calYear}</span>
                    <button onClick={() => { if (calMonth === 12) { setCalMonth(1); setCalYear(calYear + 1); } else setCalMonth(calMonth + 1); }}>›</button>
                </div>
                <table className="cal-table">
                    <thead><tr>{["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map(d => <th key={d}>{d}</th>)}</tr></thead>
                    <tbody>{rows}</tbody>
                </table>
            </div>
        );
    };

    // ─── Earnings Chart ───
    const renderEarningsChart = () => {
        if (!earnings?.monthly?.length) return <p className="empty-text">Belum ada data pendapatan</p>;
        const data = earnings.monthly;
        const maxVal = Math.max(...data.map(d => Number(d.total)), 1);

        return (
            <div className="chart-container">
                {data.map((d, i) => {
                    const pct = (Number(d.total) / maxVal) * 100;
                    const [y, m] = d.bulan.split("-");
                    const label = MONTHS[parseInt(m) - 1].slice(0, 3);
                    return (
                        <div key={i} className="chart-bar-group">
                            <div className="chart-bar-wrap">
                                <div className="chart-bar" style={{ height: `${pct}%` }}>
                                    <span className="chart-bar-val">Rp{Number(d.total).toLocaleString()}</span>
                                </div>
                            </div>
                            <span className="chart-label">{label}</span>
                        </div>
                    );
                })}
            </div>
        );
    };

    // ─── Status Color ───
    const statusBadge = (status) => {
        const map = {
            pending: "badge-pending", diterima: "badge-diterima",
            dikerjakan: "badge-dikerjakan", selesai: "badge-selesai",
            ditolak: "badge-ditolak", dibatalkan: "badge-dibatalkan",
        };
        return <span className={`badge ${map[status] || ""}`}>{status}</span>;
    };

    const statusLabel = (s) => {
        const map = { pending: "Pending", diterima: "Diterima", dikerjakan: "Dikerjakan", selesai: "Selesai", ditolak: "Ditolak", dibatalkan: "Dibatalkan" };
        return map[s] || s;
    };

    const progressPct = (status) => {
        const map = { diterima: 25, dikerjakan: 65, selesai: 100 };
        return map[status] || 0;
    };

    // ─── Format Currency ───
    const fmt = (n) => "Rp" + Number(n || 0).toLocaleString();

    // ─── Render ───
    return (
        <div className="tukang-dashboard-v2">
            {/* Toast */}
            {message && <div className={`toast-msg toast-${message.type}`}>{message.text}</div>}

            {/* Sidebar */}
            <aside className="t-sidebar">
                <div className="t-sidebar-brand">
                    <div className="t-brand-icon">SiT</div>
                    <span>SiTukang</span>
                </div>

                <nav className="t-sidebar-nav">
                    {navItems.map((item, i) => {
                        if (item.divider) return <div key={i} className="t-nav-divider">{item.label}</div>;
                        return (
                            <button
                                key={item.key}
                                className={`t-nav-link ${menu === item.key ? "active" : ""}`}
                                onClick={() => setMenu(item.key)}
                            >
                                <span className="t-nav-icon">{item.icon && <item.icon size={18} />}</span>
                                <span className="t-nav-label">{item.label}</span>
                                {item.badge > 0 && <span className="t-nav-badge">{item.badge > 99 ? "99+" : item.badge}</span>}
                            </button>
                        );
                    })}
                </nav>

                <div className="t-sidebar-user">
                    <div className="t-avatar">{user?.nama?.charAt(0) || "T"}</div>
                    <div className="t-user-info">
                        <span className="t-user-name">{user?.nama || "Tukang"}</span>
                        <span className="t-user-role">Tukang</span>
                    </div>
                    <button className="t-btn-logout-icon" onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("user"); navigate("/login"); }}>
                        <FiLogOut size={18} />
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="t-main">
                {/* Top Bar */}
                <div className="t-topbar">
                    <h1 className="t-page-title">
                        {sidebarLinks.find(l => l.key === menu)?.label || "Dashboard"}
                    </h1>
                    <div className="t-topbar-right">
                        <Link to="/" className="t-back-link">← Website</Link>
                    </div>
                </div>

                {/* ─── DASHBOARD ─── */}
                {menu === "dashboard" && (
                    <>
                        {/* Hero */}
                        <div className="t-hero">
                            <div className="t-hero-text">
                                <h2>Halo, {user?.nama?.split(" ")[0] || "Tukang"}!</h2>
                                <p>Kelola pesanan, jadwal, dan pendapatan Anda di sini.</p>
                            </div>
                            <div className="t-hero-stats">
                                <div className="t-hero-stat">
                                    <span className="t-hero-num">{fmt(stats?.total_earnings || 0)}</span>
                                    <span className="t-hero-lbl">Total Pendapatan</span>
                                </div>
                                <div className="t-hero-stat">
                                    <span className="t-hero-num">{stats?.rating || 0} ★</span>
                                    <span className="t-hero-lbl">Rating ({stats?.total_review || 0})</span>
                                </div>
                                <div className="t-hero-stat">
                                    <span className="t-hero-num">{(stats?.diterima || 0) + (stats?.dikerjakan || 0)}</span>
                                    <span className="t-hero-lbl">Order Aktif</span>
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="t-stats-grid">
                            {[
                                { label: "Pending", value: stats?.pending || 0, color: "#f59e0b" },
                                { label: "Diterima", value: stats?.diterima || 0, color: "#3b82f6" },
                                { label: "Dikerjakan", value: stats?.dikerjakan || 0, color: "#8b5cf6" },
                                { label: "Selesai", value: stats?.selesai || 0, color: "#10b981" },
                                { label: "Ditolak", value: stats?.ditolak || 0, color: "#ef4444" },
                            ].map((s, i) => (
                                <div key={i} className="t-stat-card" style={{ borderLeftColor: s.color }}>
                                    <div className="t-stat-body">
                                        <h3>{s.value}</h3>
                                        <p>{s.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Content Grid */}
                        <div className="t-dashboard-grid">
                            {/* Today's Schedule */}
                            <div className="t-card">
                                <div className="t-card-header">
                                    <h3>Jadwal Hari Ini</h3>
                                    <button className="t-btn-sm" onClick={() => setMenu("schedule")}>Lihat Semua</button>
                                </div>
                                <div className="t-card-body">
                                    {todaySched.length === 0 ? (
                                        <p className="empty-text">Tidak ada jadwal hari ini</p>
                                    ) : (
                                        todaySched.map(s => (
                                            <div key={s.id} className="t-today-item">
                                                <div className="t-today-time">{new Date(s.tanggal_booking).toLocaleTimeString("id", { hour: "2-digit", minute: "2-digit" })}</div>
                                                <div className="t-today-info">
                                                    <strong>{s.nama_user}</strong>
                                                    <span>{s.alamat}</span>
                                                </div>
                                                {statusBadge(s.status)}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Tips */}
                            <div className="t-card">
                                <div className="t-card-header">
                                    <h3>Tips untuk Anda</h3>
                                </div>
                                <div className="t-card-body">
                                    <div className="t-tips-list">
                                        {tips.slice(0, 4).map((t, i) => (
                                            <div key={i} className="t-tip-item">
                                                <span className="t-tip-icon">{t.icon}</span>
                                                <div>
                                                    <strong>{t.title}</strong>
                                                    <p>{t.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Earnings Chart Preview */}
                        {earnings?.monthly?.length > 0 && (
                            <div className="t-card" style={{ marginTop: 16 }}>
                                <div className="t-card-header">
                                    <h3>Tren Pendapatan</h3>
                                    <button className="t-btn-sm" onClick={() => setMenu("earnings")}>Detail</button>
                                </div>
                                <div className="t-card-body">
                                    {renderEarningsChart()}
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* ─── INCOMING ─── */}
                {menu === "incoming" && (
                    <div className="t-card">
                        <div className="t-card-header"><h3>Pesanan Masuk</h3></div>
                        <div className="t-card-body">
                            {renderOrderList(orders, orderLoading, [
                                { label: "Terima", cls: "btn-success", action: (id) => handleOrderStatus(id, "diterima") },
                                { label: "Tolak", cls: "btn-danger", action: (id) => handleOrderStatus(id, "ditolak") },
                            ])}
                        </div>
                    </div>
                )}

                {/* ─── ACTIVE ─── */}
                {menu === "active" && (
                    <div className="t-card">
                        <div className="t-card-header"><h3>Pekerjaan Aktif</h3></div>
                        <div className="t-card-body">
                            {renderOrderList(orders, orderLoading, [
                                {
                                    label: "Selesai", cls: "btn-success", action: (id, status) => {
                                        if (status === "dikerjakan") handleOrderStatus(id, "selesai");
                                    }
                                },
                                {
                                    label: "Mulai", cls: "btn-primary", action: (id, status) => {
                                        if (status === "diterima") handleOrderStatus(id, "dikerjakan");
                                    }
                                },
                            ], true)}
                        </div>
                    </div>
                )}

                {/* ─── COMPLETED ─── */}
                {menu === "completed" && (
                    <div className="t-card">
                        <div className="t-card-header"><h3>Riwayat Pekerjaan</h3></div>
                        <div className="t-card-body">
                            {renderOrderList(orders, orderLoading, [])}
                        </div>
                    </div>
                )}

                {/* ─── SCHEDULE ─── */}
                {menu === "schedule" && (
                    <div className="t-card">
                        <div className="t-card-header"><h3>Jadwal</h3></div>
                        <div className="t-card-body">
                            {renderCalendar()}
                            <div className="t-legend">
                                <span><span className="dot dot-pending"></span> Pending</span>
                                <span><span className="dot dot-diterima"></span> Diterima</span>
                                <span><span className="dot dot-dikerjakan"></span> Dikerjakan</span>
                                <span><span className="dot dot-selesai"></span> Selesai</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── EARNINGS ─── */}
                {menu === "earnings" && (
                    <>
                        <div className="t-earnings-cards">
                            <div className="t-earnings-card">
                                <span className="t-earnings-label">Total Pendapatan</span>
                                <span className="t-earnings-value">{fmt(earnings?.total_earnings || 0)}</span>
                            </div>
                            <div className="t-earnings-card">
                                <span className="t-earnings-label">Saldo Tersedia</span>
                                <span className="t-earnings-value">{fmt(earnings?.balance || 0)}</span>
                            </div>
                            <div className="t-earnings-card">
                                <span className="t-earnings-label">Transaksi</span>
                                <span className="t-earnings-value">{earnings?.transactions?.length || 0}</span>
                            </div>
                        </div>

                        <div className="t-card">
                            <div className="t-card-header"><h3>Grafik Pendapatan Bulanan</h3></div>
                            <div className="t-card-body">{renderEarningsChart()}</div>
                        </div>

                        <div className="t-card" style={{ marginTop: 16 }}>
                            <div className="t-card-header"><h3>Riwayat Transaksi</h3></div>
                            <div className="t-card-body">
                                {!earnings?.transactions?.length ? (
                                    <p className="empty-text">Belum ada transaksi</p>
                                ) : (
                                    <div className="t-table-wrap">
                                        <table className="t-table">
                                            <thead>
                                                <tr>
                                                    <th>Tanggal</th>
                                                    <th>Pelanggan</th>
                                                    <th>Jumlah</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {earnings.transactions.map((t, i) => (
                                                    <tr key={i}>
                                                        <td>{new Date(t.created_at).toLocaleDateString("id")}</td>
                                                        <td>{t.nama_user || "-"}</td>
                                                        <td className="t-amount">{fmt(t.total)}</td>
                                                        <td>{statusBadge(t.status)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {/* ─── WITHDRAW ─── */}
                {menu === "withdraw" && (
                    <div className="t-two-col">
                        <div className="t-card">
                            <div className="t-card-header"><h3>Data Rekening</h3></div>
                            <div className="t-card-body">
                                <div className="t-form-group">
                                    <label>Nama Bank</label>
                                    <input value={bankForm.bank_name} onChange={e => setBankForm({ ...bankForm, bank_name: e.target.value })} placeholder="Contoh: BCA, Mandiri" />
                                </div>
                                <div className="t-form-group">
                                    <label>Nomor Rekening</label>
                                    <input value={bankForm.account_number} onChange={e => setBankForm({ ...bankForm, account_number: e.target.value })} placeholder="Nomor rekening" />
                                </div>
                                <div className="t-form-group">
                                    <label>Atas Nama</label>
                                    <input value={bankForm.account_holder} onChange={e => setBankForm({ ...bankForm, account_holder: e.target.value })} placeholder="Nama pemilik rekening" />
                                </div>
                                <button className="t-btn t-btn-primary" onClick={handleSaveBank}>Simpan Rekening</button>
                            </div>
                        </div>

                        <div>
                            <div className="t-card" style={{ marginBottom: 16 }}>
                                <div className="t-card-header"><h3>Tarik Dana</h3></div>
                                <div className="t-card-body">
                                    <p className="t-saldo">Saldo: {fmt(earnings?.balance || 0)}</p>
                                    <div className="t-form-group">
                                        <label>Jumlah Penarikan</label>
                                        <input type="number" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} placeholder="Rp 0" min="10000" />
                                    </div>
                                    <button className="t-btn t-btn-primary" onClick={handleWithdraw} disabled={!bank}>Ajukan Penarikan</button>
                                    {!bank && <p className="t-hint">Simpan data rekening terlebih dahulu</p>}
                                </div>
                            </div>

                            <div className="t-card">
                                <div className="t-card-header"><h3>Riwayat Penarikan</h3></div>
                                <div className="t-card-body">
                                    {withdrawHistory.length === 0 ? (
                                        <p className="empty-text">Belum ada penarikan</p>
                                    ) : (
                                        withdrawHistory.map(w => (
                                            <div key={w.id} className="t-withdraw-item">
                                                <div>
                                                    <strong>{fmt(w.jumlah)}</strong>
                                                    <small>{new Date(w.created_at).toLocaleDateString("id")}</small>
                                                </div>
                                                <span className={`badge badge-${w.status}`}>{w.status}</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── PORTFOLIO ─── */}
                {menu === "portfolio" && (
                    <>
                        <div className="t-card" style={{ marginBottom: 16 }}>
                            <div className="t-card-header"><h3>Tambah Portfolio</h3></div>
                            <div className="t-card-body">
                                <div className="t-port-upload">
                                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePortfolioUpload} style={{ display: "none" }} />
                                    <input placeholder="Caption (opsional)" value={portCaption} onChange={e => setPortCaption(e.target.value)} className="t-input" style={{ flex: 1 }} />
                                    <button className="t-btn t-btn-primary" onClick={() => fileInputRef.current?.click()}>Pilih & Upload</button>
                                </div>
                            </div>
                        </div>

                        <div className="t-port-grid">
                            {portfolios.length === 0 ? (
                                <p className="empty-text" style={{ gridColumn: "1/-1" }}>Belum ada portfolio</p>
                            ) : (
                                portfolios.map(p => (
                                    <div key={p.id} className="t-port-card">
                                        <img src={`http://localhost:5000/uploads/portfolio/${p.foto}`} alt={p.caption || "Portfolio"} />
                                        {p.caption && <p className="t-port-caption">{p.caption}</p>}
                                        <button className="t-port-del" onClick={() => handleDeletePortfolio(p.id)} title="Hapus">X</button>
                                    </div>
                                ))
                            )}
                        </div>
                    </>
                )}

                {/* ─── REVIEWS ─── */}
                {menu === "reviews" && (
                    <div className="t-card">
                        <div className="t-card-header"><h3>Ulasan Pelanggan</h3></div>
                        <div className="t-card-body">
                            {reviews.length === 0 ? (
                                <p className="empty-text">Belum ada ulasan</p>
                            ) : (
                                reviews.map(r => (
                                    <div key={r.id} className="t-review-card">
                                        <div className="t-review-header">
                                            <strong>{r.nama_user}</strong>
                                            <span className="t-review-stars">{Array.from({ length: 5 }, (_, i) => i < r.rating ? "★" : "☆").join("")} {r.rating}</span>
                                        </div>
                                        <p className="t-review-text">{r.komentar || "Tidak ada komentar"}</p>
                                        <small className="t-review-date">{new Date(r.created_at).toLocaleDateString("id", { year: "numeric", month: "long", day: "numeric" })}</small>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* ─── NOTIFICATIONS ─── */}
                {menu === "notifications" && (
                    <div className="t-card">
                        <div className="t-card-header">
                            <h3>Notifikasi</h3>
                            {notifs.some(n => !n.is_read) && (
                                <button className="t-btn-sm" onClick={handleReadAll}>Tandai Semua Dibaca</button>
                            )}
                        </div>
                        <div className="t-card-body">
                            {notifs.length === 0 ? (
                                <p className="empty-text">Tidak ada notifikasi</p>
                            ) : (
                                notifs.map(n => (
                                    <div key={n.id} className={`t-notif-item ${!n.is_read ? "unread" : ""}`} onClick={() => !n.is_read && handleReadNotif(n.id)}>
                                        <div className="t-notif-dot"></div>
                                        <div className="t-notif-content">
                                            <strong>{n.title}</strong>
                                            <p>{n.message}</p>
                                            <small>{new Date(n.created_at).toLocaleDateString("id")}</small>
                                        </div>
                                        {!n.is_read && <span className="t-notif-badge">Baru</span>}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* ─── AVAILABILITY ─── */}
                {menu === "availability" && (
                    <>
                        <div className="t-card" style={{ marginBottom: 16 }}>
                            <div className="t-card-header">
                                <h3>Status Online</h3>
                                <label className="t-toggle">
                                    <input type="checkbox" checked={avail?.is_online !== 0} onChange={e => setAvail({ ...avail, is_online: e.target.checked ? 1 : 0 })} />
                                    <span className="t-toggle-slider"></span>
                                </label>
                            </div>
                        </div>

                        <div className="t-card" style={{ marginBottom: 16 }}>
                            <div className="t-card-header"><h3>Jam Kerja Mingguan</h3></div>
                            <div className="t-card-body">
                                <div className="t-jam-grid">
                                    {HARI.map((h, i) => (
                                        <div key={h} className="t-jam-row">
                                            <span className="t-jam-label">{DAYS[i]}</span>
                                            <input type="time" value={avail?.[`${h}_mulai`] || "08:00"} onChange={e => setAvail({ ...avail, [`${h}_mulai`]: e.target.value })} />
                                            <span className="t-jam-sep">—</span>
                                            <input type="time" value={avail?.[`${h}_selesai`] || "17:00"} onChange={e => setAvail({ ...avail, [`${h}_selesai`]: e.target.value })} />
                                        </div>
                                    ))}
                                </div>
                                <button className="t-btn t-btn-primary" style={{ marginTop: 16 }} onClick={handleSaveAvailability}>Simpan Jam Kerja</button>
                            </div>
                        </div>

                        <div className="t-card">
                            <div className="t-card-header"><h3>Riwayat Cuti</h3></div>
                            <div className="t-card-body">
                                {leaves.length === 0 ? (
                                    <p className="empty-text">Belum ada cuti</p>
                                ) : (
                                    leaves.map(l => (
                                        <div key={l.id} className="t-leave-item">
                                            <span>{new Date(l.tanggal_mulai).toLocaleDateString("id")} — {new Date(l.tanggal_selesai).toLocaleDateString("id")}</span>
                                            <span className={`badge badge-${l.status}`}>{l.status}</span>
                                            {l.alasan && <small>{l.alasan}</small>}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </>
                )}

                {/* ─── PROFILE ─── */}
                {menu === "profile" && (
                    <div className="t-card" style={{ maxWidth: 600 }}>
                        <div className="t-card-header"><h3>Profil Profesional</h3></div>
                        <div className="t-card-body">
                            {loading ? <p className="empty-text">Loading...</p> : !profile ? <p className="empty-text">Profil belum lengkap</p> : (
                                <form onSubmit={handleUpdateProfile}>
                                    <div className="t-form-group">
                                        <label>Nama Lengkap</label>
                                        <input value={profileForm.nama || ""} onChange={e => setProfileForm({ ...profileForm, nama: e.target.value })} />
                                    </div>
                                    <div className="t-form-group">
                                        <label>Email</label>
                                        <input value={profile.email || ""} disabled className="t-input-disabled" />
                                    </div>
                                    <div className="t-form-group">
                                        <label>Kategori</label>
                                        <input value={profile.nama_kategori || ""} disabled className="t-input-disabled" />
                                    </div>
                                    <div className="t-form-group">
                                        <label>Telepon</label>
                                        <input value={profileForm.telepon || ""} onChange={e => setProfileForm({ ...profileForm, telepon: e.target.value })} />
                                    </div>
                                    <div className="t-form-group">
                                        <label>Alamat</label>
                                        <textarea value={profileForm.alamat || ""} onChange={e => setProfileForm({ ...profileForm, alamat: e.target.value })} rows={2} />
                                    </div>
                                    <div className="t-form-group">
                                        <label>Deskripsi</label>
                                        <textarea value={profileForm.deskripsi || ""} onChange={e => setProfileForm({ ...profileForm, deskripsi: e.target.value })} rows={3} />
                                    </div>
                                    <div className="t-form-group">
                                        <label>Pengalaman (tahun)</label>
                                        <input type="number" value={profileForm.pengalaman || ""} onChange={e => setProfileForm({ ...profileForm, pengalaman: e.target.value })} />
                                    </div>
                                    <button type="submit" className="t-btn t-btn-primary">Simpan Profil</button>
                                </form>
                            )}
                        </div>
                    </div>
                )}

            </main>
        </div>
    );

    // ─── Order List Helper ───
    function renderOrderList(orderList, isLoading, actions, showProgress = false) {
        if (isLoading) return <p className="empty-text">Loading...</p>;
        if (!orderList.length) return <p className="empty-text">Tidak ada pesanan</p>;

        return (
            <div className="t-order-list">
                {orderList.map(o => (
                    <div key={o.id} className="t-order-card">
                        <div className="t-order-top">
                            <div className="t-order-user">
                                <div className="t-order-avatar">{o.nama_user?.charAt(0) || "U"}</div>
                                <div>
                                    <strong>{o.nama_user}</strong>
                                    <small>{o.email_user || ""}</small>
                                </div>
                            </div>
                            {statusBadge(o.status)}
                        </div>
                        <div className="t-order-details">
                            <span>{o.alamat}</span>
                            {o.keluhan && <span>{o.keluhan}</span>}
                            <span>{new Date(o.tanggal_booking).toLocaleDateString("id", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                        </div>
                        {showProgress && (
                            <div className="t-progress-wrap">
                                <div className="t-progress-bar">
                                    <div className="t-progress-fill" style={{ width: `${progressPct(o.status)}%` }}></div>
                                </div>
                                <span className="t-progress-label">{statusLabel(o.status)} ({progressPct(o.status)}%)</span>
                            </div>
                        )}
                        {actions.length > 0 && (
                            <div className="t-order-actions">
                                {actions.map((a, i) => {
                                    const shouldShow = a.label === "Selesai" ? o.status === "dikerjakan" : a.label === "Mulai" ? o.status === "diterima" : o.status === "pending";
                                    if (!shouldShow) return null;
                                    return (
                                        <button key={i} className={`t-btn t-${a.cls}`} onClick={() => a.action(o.id, o.status)}>
                                            {a.label}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    }
}

export default Dashboard;
