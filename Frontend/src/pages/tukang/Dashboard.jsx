import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardTukang, getRiwayatTukang, getReviewTukang, getProfilTukang, updateProfilTukang } from "../../api/tukangApi";
import "../../assets/css/TukangDashboard.css";

function Dashboard() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const [menu, setMenu] = useState("dashboard");
    const [stats, setStats] = useState(null);
    const [riwayat, setRiwayat] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [profil, setProfil] = useState(null);
    const [formProfil, setFormProfil] = useState({});
    const [filterStatus, setFilterStatus] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (menu === "dashboard") loadStats();
        if (menu === "riwayat") loadRiwayat();
        if (menu === "review") loadReview();
        if (menu === "profil") loadProfil();
    }, [menu]);

    const loadStats = async () => {
        setLoading(true);
        try {
            const res = await getDashboardTukang();
            setStats(res.data);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const loadRiwayat = async (status) => {
        setLoading(true);
        try {
            const res = await getRiwayatTukang(status || filterStatus);
            setRiwayat(res.data);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const loadReview = async () => {
        setLoading(true);
        try {
            const res = await getReviewTukang();
            setReviews(res.data);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const loadProfil = async () => {
        setLoading(true);
        try {
            const res = await getProfilTukang();
            setProfil(res.data);
            setFormProfil(res.data);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const handleFilter = (status) => {
        setFilterStatus(status);
        loadRiwayat(status);
    };

    const handleUpdateProfil = async (e) => {
        e.preventDefault();
        try {
            const res = await updateProfilTukang(formProfil);
            alert(res.message);
            loadProfil();
        } catch (err) {
            alert("Gagal update profil");
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <div className="tukang-dashboard">
            <aside className="sidebar">
                <h2>Dashboard Tukang</h2>
                <p className="user-name">{user?.nama}</p>
                <nav>
                    <button className={menu === "dashboard" ? "active" : ""} onClick={() => setMenu("dashboard")}>Dashboard</button>
                    <button className={menu === "riwayat" ? "active" : ""} onClick={() => setMenu("riwayat")}>Riwayat Pekerjaan</button>
                    <button className={menu === "review" ? "active" : ""} onClick={() => setMenu("review")}>Review</button>
                    <button className={menu === "profil" ? "active" : ""} onClick={() => setMenu("profil")}>Edit Profil</button>
                    <button className="btn-logout" onClick={logout}>Logout</button>
                </nav>
            </aside>
            <main className="main-content">
                {menu === "dashboard" && (
                    <section>
                        <h1>Dashboard Statistik</h1>
                        {loading ? <p>Loading...</p> : stats ? (
                            <div className="stats-grid">
                                <div className="stat-card pending"><h3>{stats.pending}</h3><p>Pending</p></div>
                                <div className="stat-card diterima"><h3>{stats.diterima}</h3><p>Diterima</p></div>
                                <div className="stat-card dikerjakan"><h3>{stats.dikerjakan}</h3><p>Dikerjakan</p></div>
                                <div className="stat-card selesai"><h3>{stats.selesai}</h3><p>Selesai</p></div>
                                <div className="stat-card ditolak"><h3>{stats.ditolak}</h3><p>Ditolak</p></div>
                                <div className="stat-card rating"><h3>{stats.rating || 0} ★</h3><p>Rating ({stats.total_review} review)</p></div>
                            </div>
                        ) : <p>Gagal memuat data</p>}
                    </section>
                )}

                {menu === "riwayat" && (
                    <section>
                        <h1>Riwayat Pekerjaan</h1>
                        <div className="filter-bar">
                            {["", "pending", "diterima", "dikerjakan", "selesai", "ditolak"].map(s => (
                                <button key={s} className={filterStatus === s ? "active" : ""} onClick={() => handleFilter(s)}>
                                    {s || "Semua"}
                                </button>
                            ))}
                        </div>
                        {loading ? <p>Loading...</p> : riwayat.length === 0 ? <p>Belum ada riwayat</p> : (
                            <div className="table-wrap">
                                <table>
                                    <thead><tr><th>User</th><th>Alamat</th><th>Keluhan</th><th>Status</th><th>Tanggal</th></tr></thead>
                                    <tbody>
                                        {riwayat.map(r => (
                                            <tr key={r.id}>
                                                <td>{r.nama_user}</td>
                                                <td>{r.alamat}</td>
                                                <td>{r.keluhan}</td>
                                                <td><span className={`badge badge-${r.status}`}>{r.status}</span></td>
                                                <td>{new Date(r.tanggal_booking).toLocaleDateString()}</td>
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
                        <h1>Review dari Pelanggan</h1>
                        {loading ? <p>Loading...</p> : reviews.length === 0 ? <p>Belum ada review</p> : (
                            <div className="review-list">
                                {reviews.map(r => (
                                    <div key={r.id} className="review-card">
                                        <p><strong>{r.nama_user}</strong> ⭐ {r.rating}</p>
                                        <p>{r.komentar}</p>
                                        <small>{new Date(r.created_at).toLocaleDateString()}</small>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                )}

                {menu === "profil" && (
                    <section>
                        <h1>Edit Profil</h1>
                        {loading ? <p>Loading...</p> : !profil ? <p>Profil belum lengkap</p> : (
                            <form className="profil-form" onSubmit={handleUpdateProfil}>
                                <label>Nama</label>
                                <input value={formProfil.nama || ""} onChange={e => setFormProfil({ ...formProfil, nama: e.target.value })} />
                                <label>Email</label>
                                <input value={profil.email || ""} disabled />
                                <label>Kategori</label>
                                <input value={profil.nama_kategori || ""} disabled />
                                <label>Telepon</label>
                                <input value={formProfil.telepon || ""} onChange={e => setFormProfil({ ...formProfil, telepon: e.target.value })} />
                                <label>Alamat</label>
                                <textarea value={formProfil.alamat || ""} onChange={e => setFormProfil({ ...formProfil, alamat: e.target.value })} />
                                <label>Deskripsi</label>
                                <textarea value={formProfil.deskripsi || ""} onChange={e => setFormProfil({ ...formProfil, deskripsi: e.target.value })} />
                                <label>Pengalaman (tahun)</label>
                                <input type="number" value={formProfil.pengalaman || ""} onChange={e => setFormProfil({ ...formProfil, pengalaman: e.target.value })} />
                                <button type="submit">Simpan</button>
                            </form>
                        )}
                    </section>
                )}
            </main>
        </div>
    );
}

export default Dashboard;