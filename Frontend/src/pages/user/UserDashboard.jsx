import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { getRekomendasiTukang } from "../../api/tukangApi";
import { getMyBooking } from "../../api/bookingApi";
import {
  FiBell,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiCreditCard,
  FiGrid,
  FiMapPin,
  FiMenu,
  FiMessageSquare,
  FiSearch,
  FiSettings,
  FiStar,
  FiTool,
  FiZap,
  FiAward,
  FiChevronRight,
  FiShield,
  FiHome,
} from "react-icons/fi";
import "../../assets/css/UserDashboard.css";

const popularServices = [
  { title: "Listrik", icon: FiZap, color: "#f59e0b" },
  { title: "AC", icon: FiHome, color: "#3b82f6" },
  { title: "Pipa", icon: FiTool, color: "#6366f1" },
  { title: "Cat", icon: FiTool, color: "#ec4899" },
  { title: "Bersih", icon: FiShield, color: "#10b981" },
  { title: "Bangunan", icon: FiHome, color: "#6b7280" },
  { title: "Kebun", icon: FiShield, color: "#84cc16" },
  { title: "Lainnya", icon: FiSettings, color: "#4b5563" },
];

function UserDashboard() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [rekomendasi, setRekomendasi] = useState([]);
  const [bookingCount, setBookingCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);

  useEffect(() => {
    getRekomendasiTukang()
      .then(res => setRekomendasi(res.data || []))
      .catch(() => {});
    getMyBooking()
      .then(res => {
        const data = res.data || [];
        setBookingCount(data.length);
        setActiveCount(data.filter(b => b.status === "pending" || b.status === "diterima" || b.status === "dikerjakan").length);
      })
      .catch(() => {});
  }, []);

  const getInitials = (name) => {
    if (!name) return "TK";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const displayName = user?.nama || user?.name || "Pelanggan";
  const profileInitials = getInitials(displayName);

  const stats = [
    { label: "ORDER AKTIF", value: activeCount.toString(), note: "", icon: FiCheckCircle, iconColor: "#026b5e", iconBg: "#e6f4f2" },
    { label: "TOTAL BOOKING", value: bookingCount.toString(), note: "", noteColor: "#026b5e", icon: FiCreditCard, iconColor: "#026b5e", iconBg: "#e6f4f2" },
    { label: "BOOKING DIJADWALKAN", value: "3", note: "", icon: FiCalendar, iconColor: "#f59e0b", iconBg: "#fef3c7" },
    { label: "RATING DIBERIKAN", value: "14", note: "", icon: FiStar, iconColor: "#3b82f6", iconBg: "#dbeafe" },
  ];

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
            <button className="sidebar-link active" type="button" onClick={() => navigate("/user")}><FiGrid /><span>Beranda</span></button>
            <button className="sidebar-link" type="button" onClick={() => navigate("/user/cari-tukang")}><FiSearch /><span>Cari Tukang</span></button>
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
          <div className="welcome-text" style={{ fontSize: "24px" }}>
            <h1 style={{ fontSize: "28px", fontWeight: "800", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
              Halo, {displayName} <span>👋</span>
            </h1>
            <p style={{ fontSize: "14px", color: "var(--muted)", margin: "4px 0 0 0", fontWeight: "500" }}>
              Selamat datang kembali. Apa yang bisa kami bantu hari ini?
            </p>
          </div>
          <div className="topbar-actions" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div className="dashboard-search" style={{ display: "flex", alignItems: "center", background: "white", padding: "10px 16px", borderRadius: "20px", border: "1px solid var(--line)", width: "260px", gap: "10px" }}>
              <FiSearch style={{ color: "var(--muted)" }} />
              <input type="text" placeholder="Cari order, tukang..." style={{ border: "none", outline: "none", width: "100%", fontSize: "14px" }} />
            </div>
            <button className="icon-button" style={{ position: "relative", background: "white", border: "1px solid var(--line)", width: "42px", height: "42px", borderRadius: "50%", display: "grid", placeItems: "center", cursor: "pointer" }}>
              <FiBell style={{ color: "var(--ink)" }} />
              <span style={{ position: "absolute", top: "12px", right: "12px", width: "8px", height: "8px", background: "#ef4444", borderRadius: "50%" }}></span>
            </button>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#e2e8f0", display: "grid", placeItems: "center", fontWeight: "600", fontSize: "14px" }}>
              {profileInitials}
            </div>
            <button className="primary-action" type="button" onClick={() => navigate("/user/cari-tukang")}
              style={{ background: "var(--primary)", color: "white", border: "none", padding: "10px 20px", borderRadius: "20px", fontWeight: "600", cursor: "pointer" }}>
              Cari tukang
            </button>
          </div>
        </header>

        <section className="welcome-hero">
          <div className="hero-copy">
            <span className="hero-badge" style={{ background: "rgba(255,255,255,0.15)", padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", display: "inline-block" }}>
              # Member sejak 2024
            </span>
            <h2 style={{ maxWidth: "550px" }}>Butuh perbaikan rumah? Cari tukang terpercaya dalam hitungan menit.</h2>
            <div style={{ display: "flex", background: "white", padding: "6px 6px 6px 16px", borderRadius: "24px", alignItems: "center", width: "100%", maxWidth: "500px", gap: "10px", margin: "24px 0 16px" }}>
              <FiSearch style={{ color: "var(--muted)" }} />
              <input type="text" placeholder="Mau perbaiki apa hari ini?" style={{ border: "none", outline: "none", flex: 1, fontSize: "14px" }} />
              <button onClick={() => navigate("/user/cari-tukang")} style={{ background: "var(--primary)", color: "white", border: "none", padding: "10px 20px", borderRadius: "20px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                Cari sekarang <FiChevronRight />
              </button>
            </div>
          </div>
          <div className="hero-features-panel" style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "16px", background: "rgba(255,255,255,0.06)", padding: "20px", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <FiCheckCircle style={{ fontSize: "20px", flexShrink: 0 }} />
              <div><strong style={{ display: "block", fontSize: "14px" }}>100% Terverifikasi</strong><small style={{ opacity: 0.8, fontSize: "11px" }}>Semua tukang lulus screening</small></div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <FiClock style={{ fontSize: "20px", flexShrink: 0 }} />
              <div><strong style={{ display: "block", fontSize: "14px" }}>Respon &lt; 15 menit</strong><small style={{ opacity: 0.8, fontSize: "11px" }}>Datang sesuai jadwal Anda</small></div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <FiAward style={{ fontSize: "20px", flexShrink: 0 }} />
              <div><strong style={{ display: "block", fontSize: "14px" }}>Garansi 7 hari</strong><small style={{ opacity: 0.8, fontSize: "11px" }}>Tidak puas, kerjakan ulang gratis</small></div>
            </div>
          </div>
        </section>

        <section className="stats-grid" aria-label="Statistik customer">
          {stats.map((item, index) => {
            const Icon = item.icon;
            return (
              <article className="stat-card" key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontSize: "11px", fontWeight: "700", color: "var(--muted)", margin: "0 0 6px 0", letterSpacing: "0.5px" }}>{item.label}</p>
                  <strong style={{ fontSize: "22px", fontWeight: "800", color: "var(--ink)", display: "block" }}>{item.value}</strong>
                  {item.note && <span style={{ fontSize: "12px", fontWeight: "600", color: item.noteColor, display: "inline-block", marginTop: "4px" }}>{item.note}</span>}
                </div>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: item.iconBg, display: "grid", placeItems: "center", fontSize: "18px" }}>
                  <Icon />
                </div>
              </article>
            );
          })}
        </section>

        {/* REKOMENDASI TUKANG */}
        <section className="dashboard-section" style={{ marginTop: "32px" }}>
          <div className="section-heading" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "16px" }}>
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: "800", margin: "0 0 4px 0" }}>Rekomendasi tukang</h2>
              <p style={{ fontSize: "13px", color: "var(--muted)", margin: 0 }}>Tukang terbaik dengan rating tertinggi.</p>
            </div>
            <button type="button" onClick={() => navigate("/user/cari-tukang")}
              style={{ background: "none", border: "none", color: "var(--primary)", fontWeight: "600", fontSize: "14px", cursor: "pointer" }}>
              Semua tukang
            </button>
          </div>
          <div className="quick-services-grid" style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {rekomendasi.length === 0 ? (
              <p style={{ color: "#94a3b8", fontSize: "14px" }}>Belum ada rekomendasi tukang.</p>
            ) : rekomendasi.slice(0, 4).map(t => (
              <div key={t.id} onClick={() => navigate(`/user/tukang/${t.id}`)}
                style={{ flex: "1 1 200px", background: "white", borderRadius: "16px", padding: "16px", cursor: "pointer", border: "1px solid var(--line)", boxShadow: "var(--shadow-sm)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#e6f4f2", color: "#026b5e", display: "grid", placeItems: "center", fontWeight: "bold", fontSize: "14px" }}>
                    {getInitials(t.nama)}
                  </div>
                  <div>
                    <div style={{ fontWeight: "700", fontSize: "14px" }}>{t.nama}</div>
                    <div style={{ fontSize: "12px", color: "var(--muted)" }}>{t.nama_kategori}</div>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "var(--muted)" }}>
                  <span>⭐ {t.rating || "0.0"}</span>
                  <span>{t.alamat ? t.alamat.split(",")[0] : "-"}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-section" style={{ marginTop: "32px" }}>
          <div className="section-heading" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "16px" }}>
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: "800", margin: "0 0 4px 0" }}>Layanan populer</h2>
              <p style={{ fontSize: "13px", color: "var(--muted)", margin: 0 }}>Pilih kategori untuk lihat tukang tersedia di area Anda.</p>
            </div>
            <button type="button" onClick={() => navigate("/user/cari-tukang")}
              style={{ background: "none", border: "none", color: "var(--primary)", fontWeight: "600", fontSize: "14px", cursor: "pointer" }}>
              Semua kategori
            </button>
          </div>
          <div className="quick-services-grid">
            {popularServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <button className="quick-service-card" type="button" key={index} onClick={() => navigate("/user/cari-tukang")}
                  style={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "var(--canvas)", color: service.color, display: "grid", placeItems: "center", fontSize: "20px" }}>
                    <Icon />
                  </div>
                  <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--ink)" }}>{service.title}</span>
                </button>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

export default UserDashboard;