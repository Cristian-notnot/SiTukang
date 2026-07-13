import { useContext, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { getAllTukang, getSearchTukang, getAllKategori } from "../../api/tukangApi";
import {
  FiGrid, FiSearch, FiCalendar, FiCheckCircle, FiClock,
  FiMessageSquare, FiBell, FiCreditCard, FiStar, FiSettings,
  FiTool, FiMapPin, FiSliders, FiX
} from "react-icons/fi";
import "../../assets/css/UserDashboard.css";

const sortOptions = [
  { value: "", label: "Rating Tertinggi" },
  { value: "pengalaman", label: "Pengalaman Terbanyak" },
  { value: "nama", label: "Nama A-Z" },
  { value: "kategori", label: "Spesialis A-Z" },
];

function CariTukang() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [tukang, setTukang] = useState([]);
  const [loading, setLoading] = useState(true);
  const [kategoriList, setKategoriList] = useState([]);

  const [keyword, setKeyword] = useState("");
  const [alamat, setAlamat] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("");
  const [sort, setSort] = useState("");

  const displayName = user?.nama || user?.name || "Pelanggan";
  const getInitials = (name) => {
    if (!name) return "TK";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };
  const profileInitials = getInitials(displayName);

  const fetchTukang = async (filters = {}) => {
    setLoading(true);
    try {
      const hasFilters = filters.keyword || filters.alamat || filters.kategori || filters.sort;
      if (hasFilters) {
        const res = await getSearchTukang(filters);
        setTukang(res.data);
      } else {
        const res = await getAllTukang();
        setTukang(res.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTukang();
    getAllKategori()
      .then(res => setKategoriList(res.data || []))
      .catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTukang({ keyword, alamat, kategori: kategoriFilter, sort });
  };

  const handleClearFilters = () => {
    setKeyword("");
    setAlamat("");
    setKategoriFilter("");
    setSort("");
    fetchTukang();
  };

  const hasActiveFilters = keyword || alamat || kategoriFilter || sort;

  return (
    <div className="customer-dashboard">
      <aside className="customer-sidebar">
        <button className="sidebar-brand" type="button" onClick={() => navigate("/")} style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
          <span className="brand-mark"><FiTool /></span>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ lineHeight: 1 }}>SiTukang</span>
            <small style={{ fontSize: "10px", color: "var(--muted)", letterSpacing: "1px", fontWeight: "bold", marginTop: "4px" }}>CUSTOMER</small>
          </div>
        </button>
        <nav className="sidebar-nav" aria-label="Dashboard customer" style={{ flex: 1 }}>
          <div className="sidebar-section" style={{ marginBottom: "20px" }}>
            <p style={{ fontSize: "11px", fontWeight: "700", color: "var(--soft)", textTransform: "uppercase", paddingLeft: "16px", marginBottom: "8px" }}>Menu</p>
            <button className="sidebar-link" type="button" onClick={() => navigate("/user")}><FiGrid /><span>Beranda</span></button>
            <button className="sidebar-link active" type="button"><FiSearch /><span>Cari Tukang</span></button>
            <button className="sidebar-link" type="button" onClick={() => navigate("/user/my-booking")}><FiCalendar /><span>Booking</span></button>
            <button className="sidebar-link" type="button" onClick={() => navigate("/user/order-aktif")}><FiCheckCircle /><span>Order Aktif</span></button>
            <button className="sidebar-link" type="button" onClick={() => navigate("/user/riwayat")}><FiClock /><span>Riwayat</span></button>
          </div>
          <div className="sidebar-section" style={{ marginBottom: "20px" }}>
            <p style={{ fontSize: "11px", fontWeight: "700", color: "var(--soft)", textTransform: "uppercase", paddingLeft: "16px", marginBottom: "8px" }}>Komunikasi</p>
            <button className="sidebar-link" type="button"><FiMessageSquare /><span>Chat</span></button>
            <button className="sidebar-link" type="button"><FiBell /><span>Notifikasi</span></button>
          </div>
          <div className="sidebar-section">
            <p style={{ fontSize: "11px", fontWeight: "700", color: "var(--soft)", textTransform: "uppercase", paddingLeft: "16px", marginBottom: "8px" }}>Akun</p>
            <button className="sidebar-link" type="button"><FiCreditCard /><span>Pembayaran</span></button>
            <button className="sidebar-link" type="button" onClick={() => navigate("/user/ulasan-saya")}><FiStar /><span>Ulasan Saya</span></button>
            <button className="sidebar-link" type="button" onClick={() => navigate("/user/pengaturan")}><FiSettings /><span>Pengaturan</span></button>
          </div>
        </nav>
        <div className="sidebar-profile-card" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "14px", background: "var(--canvas)", marginTop: "auto" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#026b5e", color: "white", display: "grid", placeItems: "center", fontWeight: "bold" }}>{profileInitials}</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--ink)" }}>{displayName}</span>
            <small style={{ fontSize: "12px", color: "#026b5e", fontWeight: "600" }}>Pelanggan Premium</small>
          </div>
        </div>
      </aside>

      <main className="customer-main">
        <header className="customer-topbar">
          <div className="welcome-text">
            <h1 style={{ fontSize: "28px", fontWeight: "800", margin: 0 }}>
              Cari Tukang
            </h1>
            <p style={{ fontSize: "14px", color: "var(--muted)", margin: "4px 0 0 0", fontWeight: "500" }}>
              Temukan tukang profesional berdasarkan kebutuhan dan lokasi Anda.
            </p>
          </div>
        </header>

        <form onSubmit={handleSearch} style={{ background: "white", borderRadius: "20px", padding: "24px", border: "1px solid var(--line)", boxShadow: "var(--shadow-sm)", marginBottom: "24px" }}>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "flex-end" }}>
            <div style={{ flex: "1 1 220px", minWidth: "180px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "var(--muted)", marginBottom: "6px" }}>Cari Tukang / Layanan</label>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", border: "1px solid var(--line)", borderRadius: "12px", background: "var(--canvas)" }}>
                <FiSearch style={{ color: "var(--soft)", flexShrink: 0 }} />
                <input type="text" value={keyword} onChange={e => setKeyword(e.target.value)}
                  placeholder="Nama atau spesialis..."
                  style={{ border: "none", outline: "none", width: "100%", fontSize: "14px", background: "transparent" }} />
              </div>
            </div>
            <div style={{ flex: "1 1 180px", minWidth: "150px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "var(--muted)", marginBottom: "6px" }}>Lokasi</label>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", border: "1px solid var(--line)", borderRadius: "12px", background: "var(--canvas)" }}>
                <FiMapPin style={{ color: "var(--soft)", flexShrink: 0 }} />
                <input type="text" value={alamat} onChange={e => setAlamat(e.target.value)}
                  placeholder="Jakarta, Bandung..."
                  style={{ border: "none", outline: "none", width: "100%", fontSize: "14px", background: "transparent" }} />
              </div>
            </div>
            <div style={{ flex: "0 1 180px", minWidth: "150px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "var(--muted)", marginBottom: "6px" }}>Spesialis</label>
              <select value={kategoriFilter} onChange={e => setKategoriFilter(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", border: "1px solid var(--line)", borderRadius: "12px", fontSize: "14px", background: "var(--canvas)", outline: "none" }}>
                <option value="">Semua Spesialis</option>
                {kategoriList.map(k => (
                  <option key={k.id} value={k.nama_kategori}>{k.nama_kategori}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: "0 1 160px", minWidth: "140px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "var(--muted)", marginBottom: "6px" }}>Urutkan</label>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", border: "1px solid var(--line)", borderRadius: "12px", background: "var(--canvas)" }}>
                <FiSliders style={{ color: "var(--soft)", flexShrink: 0 }} />
                <select value={sort} onChange={e => setSort(e.target.value)}
                  style={{ border: "none", outline: "none", width: "100%", fontSize: "14px", background: "transparent", appearance: "none" }}>
                  {sortOptions.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "flex-end", paddingBottom: "2px" }}>
              <button type="submit" style={{ padding: "10px 24px", background: "var(--primary)", color: "white", border: "none", borderRadius: "12px", fontWeight: "700", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                <FiSearch /> Cari
              </button>
              {hasActiveFilters && (
                <button type="button" onClick={handleClearFilters} style={{ padding: "10px 16px", background: "white", color: "var(--muted)", border: "1px solid var(--line)", borderRadius: "12px", fontWeight: "600", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                  <FiX /> Reset
                </button>
              )}
            </div>
          </div>
        </form>

        {hasActiveFilters && (
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
            <span style={{ fontSize: "13px", color: "var(--muted)" }}>Filter aktif:</span>
            {keyword && <span style={{ padding: "4px 12px", background: "var(--primary-soft)", borderRadius: "20px", fontSize: "12px", fontWeight: "600", color: "var(--primary)" }}>Cari: {keyword}</span>}
            {alamat && <span style={{ padding: "4px 12px", background: "var(--primary-soft)", borderRadius: "20px", fontSize: "12px", fontWeight: "600", color: "var(--primary)" }}>Lokasi: {alamat}</span>}
            {kategoriFilter && <span style={{ padding: "4px 12px", background: "var(--primary-soft)", borderRadius: "20px", fontSize: "12px", fontWeight: "600", color: "var(--primary)" }}>Spesialis: {kategoriFilter}</span>}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <p style={{ fontSize: "14px", color: "var(--muted)", margin: 0 }}>
            {loading ? "Memuat..." : `${tukang.length} tukang ditemukan`}
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ color: "var(--muted)", fontSize: "16px" }}>Memuat data tukang...</p>
          </div>
        ) : tukang.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", background: "white", borderRadius: "20px", border: "1px solid var(--line)" }}>
            <FiSearch style={{ fontSize: "48px", color: "var(--soft)", marginBottom: "16px" }} />
            <h3 style={{ margin: "0 0 8px 0", color: "var(--ink)" }}>Tukang tidak ditemukan</h3>
            <p style={{ color: "var(--muted)", fontSize: "14px", margin: 0 }}>
              Coba gunakan kata kunci atau filter yang berbeda.
            </p>
          </div>
        ) : (
          <div className="tukang-grid" style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "16px"
          }}>
            {tukang.map(item => (
              <div key={item.id} style={{
                background: "white", borderRadius: "18px", border: "1px solid var(--line)",
                boxShadow: "var(--shadow-sm)", overflow: "hidden", transition: "transform 0.2s"
              }}>
                <div style={{ padding: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
                    <div style={{
                      width: "52px", height: "52px", borderRadius: "50%",
                      background: "#e6f4f2", color: "#026b5e",
                      display: "grid", placeItems: "center", fontWeight: "bold",
                      fontSize: "18px", flexShrink: 0
                    }}>
                      {getInitials(item.nama)}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.nama}</h3>
                      <span style={{ fontSize: "13px", color: "var(--primary)", fontWeight: "600" }}>{item.nama_kategori}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "var(--muted)", marginBottom: "16px" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <FiMapPin style={{ flexShrink: 0 }} /> {item.alamat || "-"}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      ⭐ {item.rating || "0.0"} <span style={{ color: "var(--soft)" }}>•</span> {item.pengalaman || 0} thn pengalaman
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <Link to={`/user/tukang/${item.id}`} style={{
                      flex: 1, padding: "10px", textAlign: "center", borderRadius: "12px",
                      border: "1px solid var(--line)", color: "var(--ink)", fontWeight: "600",
                      fontSize: "13px", textDecoration: "none", background: "white"
                    }}>
                      Detail
                    </Link>
                    <Link to={`/user/booking/${item.id}`} style={{
                      flex: 1, padding: "10px", textAlign: "center", borderRadius: "12px",
                      background: "var(--primary)", color: "white", fontWeight: "600",
                      fontSize: "13px", textDecoration: "none"
                    }}>
                      Booking
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default CariTukang;
