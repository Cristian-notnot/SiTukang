import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminDashboard, getPendingTukang, getAllTukangAdmin, approveTukang, rejectTukang, getAllBookingAdmin, getAllUsersAdmin, getAllReviewAdmin } from "../../api/adminApi";
import "../../assets/css/AdminDashboard.css";

function Dashboard() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const [menu, setMenu] = useState("dashboard");
    const [stats, setStats] = useState(null);
    const [pendingList, setPendingList] = useState([]);
    const [tukangList, setTukangList] = useState([]);
    const [bookingList, setBookingList] = useState([]);
    const [userList, setUserList] = useState([]);
    const [reviewList, setReviewList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (menu === "dashboard") loadStats();
        if (menu === "pending") loadPending();
        if (menu === "tukang") loadTukang();
        if (menu === "booking") loadBooking();
        if (menu === "users") loadUsers();
        if (menu === "review") loadReview();
    }, [menu]);

    const loadStats = async () => {
        setLoading(true);
        try { const r = await getAdminDashboard(); setStats(r.data); } catch (e) { console.error(e); }
        setLoading(false);
    };

    const loadPending = async () => {
        setLoading(true);
        try { const r = await getPendingTukang(); setPendingList(r.data); } catch (e) { console.error(e); }
        setLoading(false);
    };

    const loadTukang = async () => {
        setLoading(true);
        try { const r = await getAllTukangAdmin(); setTukangList(r.data); } catch (e) { console.error(e); }
        setLoading(false);
    };

    const loadBooking = async () => {
        setLoading(true);
        try { const r = await getAllBookingAdmin(); setBookingList(r.data); } catch (e) { console.error(e); }
        setLoading(false);
    };

    const loadUsers = async () => {
        setLoading(true);
        try { const r = await getAllUsersAdmin(); setUserList(r.data); } catch (e) { console.error(e); }
        setLoading(false);
    };

    const loadReview = async () => {
        setLoading(true);
        try { const r = await getAllReviewAdmin(); setReviewList(r.data); } catch (e) { console.error(e); }
        setLoading(false);
    };

    const handleApprove = async (id) => {
        try { await approveTukang(id); alert("Disetujui!"); loadPending(); } catch (e) { alert("Gagal"); }
    };

    const handleReject = async (id) => {
        try { await rejectTukang(id); alert("Ditolak!"); loadPending(); } catch (e) { alert("Gagal"); }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <div className="admin-dashboard">
            <aside className="sidebar">
                <h2>Admin Panel</h2>
                <p className="user-name">{user?.nama}</p>
                <nav>
                    <button className={menu === "dashboard" ? "active" : ""} onClick={() => setMenu("dashboard")}>Dashboard</button>
                    <button className={menu === "pending" ? "active" : ""} onClick={() => setMenu("pending")}>Persetujuan Tukang</button>
                    <button className={menu === "tukang" ? "active" : ""} onClick={() => setMenu("tukang")}>Semua Tukang</button>
                    <button className={menu === "booking" ? "active" : ""} onClick={() => setMenu("booking")}>Semua Booking</button>
                    <button className={menu === "users" ? "active" : ""} onClick={() => setMenu("users")}>Pengguna</button>
                    <button className={menu === "review" ? "active" : ""} onClick={() => setMenu("review")}>Review</button>
                    <button className="btn-logout" onClick={logout}>Logout</button>
                </nav>
            </aside>
            <main className="main-content">
                {menu === "dashboard" && (
                    <section>
                        <h1>Dashboard Admin</h1>
                        {loading ? <p>Loading...</p> : stats ? (
                            <div className="stats-grid">
                                <div className="stat-card"><h3>{stats.total_user}</h3><p>Total User</p></div>
                                <div className="stat-card"><h3>{stats.total_tukang_approved}</h3><p>Tukang Aktif</p></div>
                                <div className="stat-card pending"><h3>{stats.total_tukang_pending}</h3><p>Pending</p></div>
                                <div className="stat-card"><h3>{stats.total_booking}</h3><p>Total Booking</p></div>
                                <div className="stat-card"><h3>{stats.booking_pending}</h3><p>Booking Pending</p></div>
                                <div className="stat-card selesai"><h3>{stats.booking_selesai}</h3><p>Booking Selesai</p></div>
                                <div className="stat-card"><h3>{stats.total_review}</h3><p>Total Review</p></div>
                            </div>
                        ) : <p>Gagal memuat data</p>}
                    </section>
                )}

                {menu === "pending" && (
                    <section>
                        <h1>Persetujuan Tukang</h1>
                        {loading ? <p>Loading...</p> : pendingList.length === 0 ? <p>Tidak ada pengajuan pending</p> : (
                            <div className="table-wrap">
                                <table>
                                    <thead><tr><th>Nama</th><th>Email</th><th>Kategori</th><th>Telepon</th><th>Pengalaman</th><th>Aksi</th></tr></thead>
                                    <tbody>
                                        {pendingList.map(t => (
                                            <tr key={t.id}>
                                                <td>{t.nama}</td><td>{t.email}</td><td>{t.nama_kategori}</td><td>{t.telepon}</td><td>{t.pengalaman} th</td>
                                                <td className="action-cell">
                                                    <button className="btn-approve" onClick={() => handleApprove(t.id)}>Setujui</button>
                                                    <button className="btn-reject" onClick={() => handleReject(t.id)}>Tolak</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                )}

                {menu === "tukang" && (
                    <section>
                        <h1>Semua Tukang</h1>
                        {loading ? <p>Loading...</p> : tukangList.length === 0 ? <p>Belum ada tukang</p> : (
                            <div className="table-wrap">
                                <table>
                                    <thead><tr><th>Nama</th><th>Kategori</th><th>Telepon</th><th>Rating</th><th>Status</th></tr></thead>
                                    <tbody>
                                        {tukangList.map(t => (
                                            <tr key={t.id}>
                                                <td>{t.nama}</td><td>{t.nama_kategori}</td><td>{t.telepon}</td><td>{t.rating}</td>
                                                <td><span className={`badge badge-${t.status}`}>{t.status}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                )}

                {menu === "booking" && (
                    <section>
                        <h1>Semua Booking</h1>
                        {loading ? <p>Loading...</p> : bookingList.length === 0 ? <p>Belum ada booking</p> : (
                            <div className="table-wrap">
                                <table>
                                    <thead><tr><th>User</th><th>Tukang</th><th>Alamat</th><th>Status</th><th>Tanggal</th></tr></thead>
                                    <tbody>
                                        {bookingList.map(b => (
                                            <tr key={b.id}>
                                                <td>{b.nama_user}</td><td>{b.nama_tukang}</td><td>{b.alamat}</td>
                                                <td><span className={`badge badge-${b.status}`}>{b.status}</span></td>
                                                <td>{new Date(b.tanggal_booking).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                )}

                {menu === "users" && (
                    <section>
                        <h1>Semua Pengguna</h1>
                        {loading ? <p>Loading...</p> : userList.length === 0 ? <p>Belum ada user</p> : (
                            <div className="table-wrap">
                                <table>
                                    <thead><tr><th>Nama</th><th>Email</th><th>Role</th><th>Daftar</th></tr></thead>
                                    <tbody>
                                        {userList.map(u => (
                                            <tr key={u.id}>
                                                <td>{u.nama}</td><td>{u.email}</td>
                                                <td><span className={`badge badge-${u.role}`}>{u.role}</span></td>
                                                <td>{new Date(u.created_at).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                )}

                {menu === "review" && (
                    <section>
                        <h1>Semua Review</h1>
                        {loading ? <p>Loading...</p> : reviewList.length === 0 ? <p>Belum ada review</p> : (
                            <div className="table-wrap">
                                <table>
                                    <thead><tr><th>User</th><th>Tukang</th><th>Rating</th><th>Komentar</th><th>Tanggal</th></tr></thead>
                                    <tbody>
                                        {reviewList.map(r => (
                                            <tr key={r.id}>
                                                <td>{r.nama_user}</td><td>{r.nama_tukang}</td><td>⭐ {r.rating}</td><td>{r.komentar}</td>
                                                <td>{new Date(r.created_at).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                )}
            </main>
        </div>
    );
}

export default Dashboard;