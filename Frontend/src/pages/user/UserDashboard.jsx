import { useContext, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { getRekomendasiTukang, getAllTukang, getSearchTukang, getAllKategori } from "../../api/tukangApi";
import { getMyBooking, cancelBooking } from "../../api/bookingApi";
import { createReview, getReviewByBooking, getMyReviews } from "../../api/reviewApi";
import { getProfile, updateProfile, uploadProfilePhoto } from "../../api/userApi";
import { getWallet, getTransactions, getPaymentMethods, addPaymentMethod, deletePaymentMethod, setDefaultPaymentMethod, payBooking } from "../../api/paymentApi";
import ghostBooking from "../../assets/gambar/ghost.image.png";
import "../../assets/css/UserDashboard.css";
import "../../assets/css/MyBooking.css";
import {
  FiBell, FiCalendar, FiCheckCircle, FiClock, FiCreditCard,
  FiGrid, FiMapPin, FiMenu, FiMessageSquare, FiSearch,
  FiSettings, FiStar, FiTool, FiZap, FiAward, FiChevronRight,
  FiShield, FiHome, FiX, FiSliders, FiUser, FiMail, FiLock,
  FiSave, FiEye, FiEyeOff, FiFilter, FiRefreshCw, FiXCircle,
  FiLogOut, FiCamera, FiInbox
} from "react-icons/fi";

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

const statusConfig = {
  pending: { label: "Menunggu", color: "#f59e0b", bg: "#fef3c7", icon: FiClock },
  diterima: { label: "Diterima", color: "#3b82f6", bg: "#dbeafe", icon: FiCheckCircle },
  dikerjakan: { label: "Dikerjakan", color: "#8b5cf6", bg: "#ede9fe", icon: FiRefreshCw },
  selesai: { label: "Selesai", color: "#10b981", bg: "#d1fae5", icon: FiCheckCircle },
  ditolak: { label: "Ditolak", color: "#ef4444", bg: "#fee2e2", icon: FiXCircle },
  dibatalkan: { label: "Dibatalkan", color: "#6b7280", bg: "#f3f4f6", icon: FiXCircle },
};

const sortOptions = [
  { value: "", label: "Rating Tertinggi" },
  { value: "pengalaman", label: "Pengalaman Terbanyak" },
  { value: "nama", label: "Nama A-Z" },
  { value: "kategori", label: "Spesialis A-Z" },
];

const filterOptions = [
  { value: "", label: "Semua Status" },
  { value: "pending", label: "Menunggu" },
  { value: "diterima", label: "Diterima" },
  { value: "dikerjakan", label: "Dikerjakan" },
  { value: "selesai", label: "Selesai" },
  { value: "ditolak", label: "Ditolak" },
  { value: "dibatalkan", label: "Dibatalkan" },
];

function UserDashboard() {
  const navigate = useNavigate();
  const { user, login, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("beranda");
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const Toast = () => {
    if (!toast) return null;
    const isSuccess = toast.type === "success";
    return (
      <div style={{
        position: "fixed", top: 24, right: 24, zIndex: 9999,
        display: "flex", alignItems: "center", gap: 12,
        padding: "14px 20px", borderRadius: 14,
        background: isSuccess ? "#065f46" : "#991b1b",
        color: "white", boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        fontSize: 14, fontWeight: 600, maxWidth: 400,
        animation: "slideIn 0.3s ease"
      }}>
        {isSuccess ? <FiCheckCircle size={20} /> : <FiXCircle size={20} />}
        <span style={{ flex: 1 }}>{toast.message}</span>
        <button onClick={() => setToast(null)} style={{ background: "none", border: "none", color: "white", cursor: "pointer", padding: 0, opacity: 0.7 }}>
          <FiX size={18} />
        </button>
      </div>
    );
  };

  const getInitials = (name) => {
    if (!name) return "TK";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const displayName = user?.nama || user?.name || "Pelanggan";
  const profileInitials = getInitials(displayName);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  };

  const sidebarItems = {
    menu: [
      { key: "beranda", icon: FiGrid, label: "Beranda" },
      { key: "cari-tukang", icon: FiSearch, label: "Cari Tukang" },
      { key: "booking", icon: FiCalendar, label: "Booking" },
      { key: "order-aktif", icon: FiCheckCircle, label: "Order Aktif" },
      { key: "riwayat", icon: FiClock, label: "Riwayat" },
    ],
    komunikasi: [
      { key: "chat", icon: FiMessageSquare, label: "Chat" },
      { key: "notifikasi", icon: FiBell, label: "Notifikasi" },
    ],
    akun: [
      { key: "pembayaran", icon: FiCreditCard, label: "Pembayaran" },
      { key: "ulasan-saya", icon: FiStar, label: "Ulasan Saya" },
      { key: "pengaturan", icon: FiSettings, label: "Pengaturan" },
    ],
  };

  const sidebar = (
    <aside className="customer-sidebar">
      <button className="sidebar-brand" type="button" style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
        <span className="brand-mark"><FiTool /></span>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ lineHeight: 1 }}>SiTukang</span>
          <small style={{ fontSize: "10px", color: "var(--muted)", letterSpacing: "1px", fontWeight: "bold", marginTop: "4px" }}>CUSTOMER</small>
        </div>
      </button>
      <nav className="sidebar-nav" aria-label="Dashboard customer" style={{ flex: 1 }}>
        <div className="sidebar-section" style={{ marginBottom: "20px" }}>
          <p style={{ fontSize: "11px", fontWeight: "700", color: "var(--soft)", textTransform: "uppercase", paddingLeft: "16px", marginBottom: "8px" }}>Menu</p>
          {sidebarItems.menu.map(item => (
            <button key={item.key} className={`sidebar-link${activeTab === item.key ? " active" : ""}`} type="button" onClick={() => setActiveTab(item.key)}>
              <item.icon /><span>{item.label}</span>
            </button>
          ))}
        </div>
        <div className="sidebar-section" style={{ marginBottom: "20px" }}>
          <p style={{ fontSize: "11px", fontWeight: "700", color: "var(--soft)", textTransform: "uppercase", paddingLeft: "16px", marginBottom: "8px" }}>Komunikasi</p>
          {sidebarItems.komunikasi.map(item => (
            <button key={item.key} className={`sidebar-link${activeTab === item.key ? " active" : ""}`} type="button" onClick={() => setActiveTab(item.key)}>
              <item.icon /><span>{item.label}</span>
            </button>
          ))}
        </div>
        <div className="sidebar-section">
          <p style={{ fontSize: "11px", fontWeight: "700", color: "var(--soft)", textTransform: "uppercase", paddingLeft: "16px", marginBottom: "8px" }}>Akun</p>
          {sidebarItems.akun.map(item => (
            <button key={item.key} className={`sidebar-link${activeTab === item.key ? " active" : ""}`} type="button" onClick={() => setActiveTab(item.key)}>
              <item.icon /><span>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
      <div className="sidebar-profile-card" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "14px", background: "var(--canvas)", marginTop: "auto" }}>
        <div style={{ width: "40px", height: "40px", borderRadius: "50%", overflow: "hidden", flexShrink: 0, background: "#026b5e" }}>
          {user?.foto ? (
            <img src={`http://localhost:5000/${user.foto}`} alt={displayName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", color: "white", fontWeight: "bold", fontSize: "14px" }}>{profileInitials}</div>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--ink)" }}>{displayName}</span>
          <small style={{ fontSize: "12px", color: "#026b5e", fontWeight: "600" }}>Customer</small>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="customer-dashboard">
      <Toast />
      {sidebar}
      <main className="customer-main">
        {activeTab === "beranda" && <BerandaSection />}
        {activeTab === "cari-tukang" && <CariTukangSection />}
        {activeTab === "booking" && <BookingSection />}
        {activeTab === "order-aktif" && <OrderAktifSection />}
        {activeTab === "riwayat" && <RiwayatSection />}
        {activeTab === "chat" && <PlaceholderSection icon={FiMessageSquare} title="Chat" message="Fitur chat akan segera hadir. Anda dapat berkomunikasi langsung dengan tukang melalui fitur ini." />}
        {activeTab === "notifikasi" && <PlaceholderSection icon={FiBell} title="Notifikasi" message="Fitur notifikasi akan segera hadir. Anda akan mendapatkan pemberitahuan mengenai status booking dan promo terbaru." />}
        {activeTab === "pembayaran" && <PembayaranSection />}
        {activeTab === "ulasan-saya" && <UlasanSayaSection />}
        {activeTab === "pengaturan" && <PengaturanSection />}
      </main>
    </div>
  );

  function BerandaSection() {
    const [rekomendasi, setRekomendasi] = useState([]);
    const [bookingCount, setBookingCount] = useState(0);
    const [activeCount, setActiveCount] = useState(0);
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
      getRekomendasiTukang()
        .then(res => setRekomendasi(res.data || []))
        .catch(() => {});
      getMyBooking()
        .then(data => {
          const arr = Array.isArray(data) ? data : (data.data || []);
          setBookings(arr);
          setBookingCount(arr.length);
          setActiveCount(arr.filter(b => b.status === "pending" || b.status === "diterima" || b.status === "dikerjakan").length);
        })
        .catch(() => {});
    }, []);

    const stats = [
      { label: "ORDER AKTIF", value: activeCount.toString(), note: "", icon: FiCheckCircle, iconColor: "#026b5e", iconBg: "#e6f4f2" },
      { label: "TOTAL BOOKING", value: bookingCount.toString(), note: "", noteColor: "#026b5e", icon: FiCreditCard, iconColor: "#026b5e", iconBg: "#e6f4f2" },
      { label: "BOOKING DIJADWALKAN", value: "3", note: "", icon: FiCalendar, iconColor: "#f59e0b", iconBg: "#fef3c7" },
      { label: "RATING DIBERIKAN", value: "14", note: "", icon: FiStar, iconColor: "#3b82f6", iconBg: "#dbeafe" },
    ];

    return (
      <>
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
              <input type="text" placeholder="Cari order, tukang..." style={{ border: "none", outline: "none", width: "100%", fontSize: "14px" }}
                onKeyDown={e => { if (e.key === "Enter" && e.target.value.trim()) { setActiveTab("cari-tukang"); } }} />
            </div>
            <button className="icon-button" style={{ position: "relative", background: "white", border: "1px solid var(--line)", width: "42px", height: "42px", borderRadius: "50%", display: "grid", placeItems: "center", cursor: "pointer" }}>
              <FiBell style={{ color: "var(--ink)" }} />
              <span style={{ position: "absolute", top: "12px", right: "12px", width: "8px", height: "8px", background: "#ef4444", borderRadius: "50%" }}></span>
            </button>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", overflow: "hidden", background: "#e2e8f0", flexShrink: 0 }}>
              {user?.foto ? (
                <img src={`http://localhost:5000/${user.foto}`} alt={displayName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", fontWeight: "600", fontSize: "14px" }}>{profileInitials}</div>
              )}
            </div>
            <button className="primary-action" type="button" onClick={() => setActiveTab("cari-tukang")}
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
              <input type="text" placeholder="Mau perbaiki apa hari ini?" id="hero-search-input" style={{ border: "none", outline: "none", flex: 1, fontSize: "14px" }}
                onKeyDown={e => { if (e.key === "Enter" && e.target.value.trim()) { setActiveTab("cari-tukang"); } }} />
              <button onClick={() => setActiveTab("cari-tukang")} style={{ background: "var(--primary)", color: "white", border: "none", padding: "10px 20px", borderRadius: "20px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
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

        <section className="dashboard-section" style={{ marginTop: "32px" }}>
          <div className="section-heading" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "16px" }}>
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: "800", margin: "0 0 4px 0" }}>Rekomendasi tukang</h2>
              <p style={{ fontSize: "13px", color: "var(--muted)", margin: 0 }}>Tukang terbaik dengan rating tertinggi.</p>
            </div>
            <button type="button" onClick={() => setActiveTab("cari-tukang")}
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
              <h2 style={{ fontSize: "18px", fontWeight: "800", margin: "0 0 4px 0" }}>Status Pengerjaan Aktif</h2>
              <p style={{ fontSize: "13px", color: "var(--muted)", margin: 0 }}>Pantau progress order yang sedang berjalan.</p>
            </div>
            <button type="button" onClick={() => setActiveTab("order-aktif")}
              style={{ background: "none", border: "none", color: "var(--primary)", fontWeight: "600", fontSize: "14px", cursor: "pointer" }}>
              Lihat semua
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
            {bookings.filter(b => ["pending", "diterima", "dikerjakan"].includes(b.status)).length === 0 ? (
              <div style={{ padding: "20px", background: "white", borderRadius: 16, border: "1px solid var(--line)", textAlign: "center" }}>
                <FiCheckCircle style={{ fontSize: 24, color: "#d1d5db", marginBottom: 8 }} />
                <p style={{ color: "#94a3b8", fontSize: 14, margin: 0 }}>Tidak ada order aktif. Yuk booking tukang sekarang!</p>
              </div>
            ) : bookings.filter(b => ["pending", "diterima", "dikerjakan"].includes(b.status)).slice(0, 3).map(item => {
              const config = statusConfig[item.status] || { label: item.status, color: "#6b7280", bg: "#f3f4f6", icon: FiCheckCircle };
              const Icon = config.icon;
              return (
                <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 14, background: "white", borderRadius: 16, border: "1px solid var(--line)", padding: "14px 18px", cursor: "pointer" }}
                  onClick={() => navigate(`/user/booking/detail/${item.id}`)}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#e6f4f2", color: "#026b5e", display: "grid", placeItems: "center", fontWeight: "bold", fontSize: 14, flexShrink: 0 }}>
                    {getInitials(item.nama_tukang)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{item.nama_tukang}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{item.alamat?.split(",")[0] || "-"}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: config.bg, color: config.color }}>
                      <Icon size={14} /> {config.label}
                    </span>
                    <FiChevronRight style={{ color: "#d1d5db", flexShrink: 0 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="dashboard-section" style={{ marginTop: "32px" }}>
          <div className="section-heading" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "16px" }}>
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: "800", margin: "0 0 4px 0" }}>Layanan populer</h2>
              <p style={{ fontSize: "13px", color: "var(--muted)", margin: 0 }}>Pilih kategori untuk lihat tukang tersedia di area Anda.</p>
            </div>
        
          </div>
          <div className="quick-services-grid">
            {popularServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <button className="quick-service-card" type="button" key={index} onClick={() => setActiveTab("cari-tukang")}
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
      </>
    );
  }

  function CariTukangSection() {
    const [tukang, setTukang] = useState([]);
    const [loading, setLoading] = useState(true);
    const [kategoriList, setKategoriList] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [alamat, setAlamat] = useState("");
    const [kategoriFilter, setKategoriFilter] = useState("");
    const [sort, setSort] = useState("");

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
      <>
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
      </>
    );
  }

  function BookingSection() {
    const [booking, setBooking] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reviewForm, setReviewForm] = useState({});

    useEffect(() => {
      loadBooking();
    }, []);

    const loadBooking = async () => {
      setLoading(true);
      try {
        const data = await getMyBooking();
        const arr = Array.isArray(data) ? data : (data.data || []);
        setBooking(arr);
        const revMap = {};
        for (const b of arr) {
          if (b.status === "selesai") {
            try {
              const r = await getReviewByBooking(b.id);
              if (r.data) revMap[b.id] = r.data;
            } catch (e) { }
          }
        }
        setReviewForm(revMap);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    const handleCancel = async (id) => {
      if (!confirm("Yakin ingin membatalkan booking ini?")) return;
      try {
        await cancelBooking(id);
        showToast("Booking berhasil dibatalkan");
        loadBooking();
      } catch (e) {
        showToast("Gagal membatalkan booking", "error");
      }
    };

    const handleReviewChange = (bookingId, field, value) => {
      setReviewForm(prev => ({
        ...prev,
        [bookingId]: { ...prev[bookingId], [field]: value }
      }));
    };

    const handleSubmitReview = async (bookingId) => {
      const data = reviewForm[bookingId];
      if (!data || !data.rating) {
        showToast("Rating wajib diisi", "error");
        return;
      }
      try {
        await createReview({
          booking_id: bookingId,
          rating: data.rating,
          komentar: data.komentar || ""
        });
        showToast("Review berhasil dikirim!");
        loadBooking();
      } catch (e) {
        showToast(e?.response?.data?.message || "Gagal mengirim review", "error");
      }
    };

    if (loading) return <h2>Loading...</h2>;

    return (
      <div className="booking-page" style={{ maxWidth: "100%", padding: "0" }}>
        <div className="booking-header">
          <div>
            <span className="booking-tag">Dashboard Customer</span>
            <h1>Booking Saya</h1>
            <p className="booking-description">
              Kelola semua pemesanan tukang Anda dengan mudah.
            </p>
          </div>
          <button className="booking-top-button" onClick={() => setActiveTab("cari-tukang")}>
            Cari Tukang
          </button>
        </div>

        {booking.length === 0 ? (
          <div className="booking-empty">
            <div className="booking-empty-left">
              <h2>Belum ada booking</h2>
              <p>Anda belum memiliki riwayat pemesanan tukang. Cari tukang terbaik dan lakukan booking pertama Anda.</p>
              <div className="booking-empty-actions">
                <button className="primary-btn" onClick={() => setActiveTab("cari-tukang")}>Cari Tukang</button>
               
              </div>
            </div>
            <div className="booking-empty-center">
              <img src={ghostBooking} alt="No Booking" className="booking-empty-image" />
            </div>
          </div>
        ) : (
          booking.map((item) => {
            const hasReview = reviewForm[item.id] && reviewForm[item.id].id;
            return (
              <div key={item.id} className={`booking-card ${item.status}`}>
                <h3>{item.nama_tukang}</h3>
                <p><strong>Alamat:</strong> {item.alamat}</p>
                <p><strong>Keluhan:</strong> {item.keluhan}</p>
                <p><strong>Status:</strong> <span className={`badge badge-${item.status}`}>{item.status}</span></p>
                <p><strong>Tanggal:</strong> {new Date(item.tanggal_booking).toLocaleString()}</p>
                <div style={{ display: "flex", gap: 16, marginTop: 8, alignItems: "center" }}>
                  
                  
                </div>
                {item.status === "pending" && (
                  <button onClick={() => handleCancel(item.id)} style={{ color: "red", marginTop: 8, marginLeft: 16, background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Batalkan</button>
                )}
                {item.status === "selesai" && !hasReview && (
                  <div className="review-box">
                    <h4>Berikan Review</h4>
                    <select className="review-select" value={reviewForm[item.id]?.rating || ""}
                      onChange={e => handleReviewChange(item.id, "rating", e.target.value)}>
                      <option value="">Pilih Rating</option>
                      {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} ★</option>)}
                    </select>
                    <br />
                    <textarea className="review-textarea" placeholder="Komentar (opsional)"
                      value={reviewForm[item.id]?.komentar || ""}
                      onChange={e => handleReviewChange(item.id, "komentar", e.target.value)} rows={3} />
                    <br />
                    <button className="primary-btn" onClick={() => handleSubmitReview(item.id)}>Kirim Review</button>
                  </div>
                )}
                {item.status === "selesai" && hasReview && (
                  <div style={{ marginTop: 8, color: "green" }}>
                    ✅ Review sudah diberikan (⭐ {reviewForm[item.id]?.rating})
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    );
  }

  function OrderAktifSection() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [payModal, setPayModal] = useState({ open: false, booking: null, jumlah: "" });
    const [paying, setPaying] = useState(false);
    const activeStatuses = ["pending", "diterima", "dikerjakan", "selesai"];

    const loadOrders = () => {
      setLoading(true);
      getMyBooking()
        .then(data => {
          const arr = Array.isArray(data) ? data : (data.data || []);
          setBookings(arr.filter(b => activeStatuses.includes(b.status)));
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    };

    useEffect(() => { loadOrders(); }, []);

    const handleCancel = async (id) => {
      if (!confirm("Yakin ingin membatalkan booking ini?")) return;
      try {
        await cancelBooking(id);
        setBookings(prev => prev.filter(b => b.id !== id));
        showToast("Booking berhasil dibatalkan");
      } catch (e) {
        showToast("Gagal membatalkan booking", "error");
      }
    };

    const handlePay = async () => {
      const amount = parseFloat(payModal.jumlah);
      if (!amount || amount <= 0) {
        showToast("Masukkan jumlah pembayaran", "error");
        return;
      }
      setPaying(true);
      try {
        const res = await payBooking(payModal.booking.id, amount, "qris");
        if (res.success) {
          showToast(`Pembayaran Rp ${amount.toLocaleString()} berhasil!`);
          setPayModal({ open: false, booking: null, jumlah: "" });
          loadOrders();
        }
      } catch (e) {
        showToast(e?.response?.data?.message || "Pembayaran gagal", "error");
      }
      setPaying(false);
    };

    return (
      <div style={{ maxWidth: "100%" }}>
        <header className="customer-topbar">
          <div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>Order Aktif</h1>
            <p style={{ margin: "4px 0 0", fontSize: 14, color: "#667085" }}>
              {loading ? "Memuat..." : `${bookings.length} order`}
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={loadOrders} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", background: "white", color: "#667085", border: "1px solid #e4e7ec", borderRadius: 12, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
              <FiRefreshCw size={14} /> Refresh
            </button>
            <button onClick={() => setActiveTab("cari-tukang")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", background: "#026b5e", color: "white", border: "none", borderRadius: 12, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
              <FiSearch /> Cari Tukang
            </button>
          </div>
        </header>

        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: "#667085" }}>Memuat data...</div>
        ) : bookings.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", background: "white", borderRadius: 20, border: "1px solid #e4e7ec" }}>
            <FiInbox style={{ fontSize: 48, color: "#d1d5db", marginBottom: 16 }} />
            <h3 style={{ margin: "0 0 8px", fontWeight: 700 }}>Tidak ada order aktif</h3>
            <p style={{ margin: "0 0 20px", fontSize: 14, color: "#667085" }}>Belum ada booking yang sedang berjalan.</p>
            <button onClick={() => setActiveTab("cari-tukang")} style={{ padding: "10px 24px", background: "#026b5e", color: "white", border: "none", borderRadius: 12, fontWeight: 600, cursor: "pointer" }}>
              Cari Tukang Sekarang
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {bookings.map(item => {
              const config = statusConfig[item.status] || { label: item.status, color: "#6b7280", bg: "#f3f4f6", icon: FiCheckCircle };
              const Icon = config.icon;
              return (
                <div key={item.id} style={{ background: "white", borderRadius: 18, border: "1px solid #e4e7ec", padding: 20, display: "flex", alignItems: "center", gap: 16, transition: "box-shadow 0.2s" }}>
                  <Link to={`/user/tukang/${item.tukang_id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#e6f4f2", color: "#026b5e", display: "grid", placeItems: "center", fontWeight: "bold", fontSize: 16, flexShrink: 0, cursor: "pointer" }}>
                      {getInitials(item.nama_tukang)}
                    </div>
                  </Link>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link to={`/user/tukang/${item.tukang_id}`} style={{ textDecoration: "none", color: "inherit" }}>
                      <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", cursor: "pointer" }}>{item.nama_tukang}</h3>
                    </Link>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4, fontSize: 13, color: "#667085" }}>
                      <FiCalendar size={14} /> {formatDate(item.tanggal_booking)}
                      <FiMapPin size={14} /> {(item.alamat || "").split(",")[0]}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Link to={`/user/booking/detail/${item.id}`} style={{ textDecoration: "none" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: config.bg, color: config.color, cursor: "pointer" }}>
                        <Icon size={14} /> {config.label}
                      </span>
                    </Link>
                    {item.status === "pending" && (
                      <button onClick={() => handleCancel(item.id)} style={{ padding: "6px 12px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                        Batal
                      </button>
                    )}
                    {item.status === "selesai" && (
                      <button onClick={() => setPayModal({ open: true, booking: item, jumlah: "" })} style={{ padding: "6px 12px", background: "#026b5e", color: "white", border: "none", borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                        Bayar QRIS
                      </button>
                    )}
                    <Link to={`/user/booking/detail/${item.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                      <FiChevronRight style={{ color: "#d1d5db", flexShrink: 0, cursor: "pointer" }} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {payModal.open && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }} onClick={() => setPayModal({ open: false, booking: null, jumlah: "" })}>
            <div style={{ background: "white", borderRadius: 24, padding: 32, maxWidth: 420, width: "90%", position: "relative" }} onClick={e => e.stopPropagation()}>
              <button onClick={() => setPayModal({ open: false, booking: null, jumlah: "" })} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer", color: "#98a2b3" }}><FiX size={20} /></button>
              <h2 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 800 }}>Pembayaran QRIS</h2>
              <p style={{ fontSize: 14, color: "#667085", margin: "0 0 24px" }}>
                Booking #{payModal.booking.id} — {payModal.booking.nama_tukang}
              </p>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#344054", marginBottom: 6 }}>Jumlah Pembayaran (Rp)</label>
                <input type="number" value={payModal.jumlah} onChange={e => setPayModal({ ...payModal, jumlah: e.target.value })} placeholder="Masukkan nominal"
                  style={{ width: "100%", padding: "12px 14px", border: "1px solid #e4e7ec", borderRadius: 12, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
              </div>
              <div style={{ marginBottom: 24, padding: 20, background: "#f8fafc", borderRadius: 16, textAlign: "center" }}>
                <div style={{ width: 180, height: 180, background: "white", margin: "0 auto 12px", borderRadius: 12, display: "grid", placeItems: "center", border: "1px solid #e4e7ec" }}>
                  <div style={{ textAlign: "center", color: "#026b5e" }}>
                    <FiCreditCard size={48} />
                    <p style={{ margin: "8px 0 0", fontSize: 11, color: "#667085" }}>Scan QRIS</p>
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#344054" }}>Bayar dengan QRIS / E-Wallet</p>
                <p style={{ margin: "4px 0 0", fontSize: 12, color: "#667085" }}>Scan menggunakan GoPay, OVO, Dana, atau aplikasi perbankan</p>
              </div>
              <button onClick={handlePay} disabled={paying} style={{
                width: "100%", padding: 14, background: paying ? "#94a3b8" : "#026b5e", color: "white", border: "none",
                borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: paying ? "not-allowed" : "pointer"
              }}>
                <FiCheckCircle size={18} style={{ marginRight: 8 }} /> {paying ? "Memproses..." : "Konfirmasi Pembayaran"}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  function RiwayatSection() {
    const [allBookings, setAllBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("");

    useEffect(() => {
      getMyBooking()
        .then(data => {
          const arr = Array.isArray(data) ? data : (data.data || []);
          setAllBookings(arr);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }, []);

    const filtered = filter ? allBookings.filter(b => b.status === filter) : allBookings;

    return (
      <div style={{ maxWidth: "100%" }}>
        <header className="customer-topbar">
          <div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>Riwayat Booking</h1>
            <p style={{ margin: "4px 0 0", fontSize: 14, color: "#667085" }}>
              {loading ? "Memuat..." : `${filtered.length} dari ${allBookings.length} booking`}
            </p>
          </div>
          <button onClick={() => setActiveTab("cari-tukang")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", background: "#026b5e", color: "white", border: "none", borderRadius: 12, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
            <FiSearch /> Cari Tukang
          </button>
        </header>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, background: "white", padding: "12px 16px", borderRadius: 14, border: "1px solid #e4e7ec" }}>
          <FiFilter style={{ color: "#98a2b3", flexShrink: 0 }} />
          <select value={filter} onChange={e => setFilter(e.target.value)} style={{ border: "none", outline: "none", width: "100%", fontSize: 14, background: "transparent" }}>
            {filterOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: "#667085" }}>Memuat data...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", background: "white", borderRadius: 20, border: "1px solid #e4e7ec" }}>
            <FiClock style={{ fontSize: 48, color: "#d1d5db", marginBottom: 16 }} />
            <h3 style={{ margin: "0 0 8px", fontWeight: 700 }}>Tidak ada riwayat</h3>
            <p style={{ margin: "0 0 20px", fontSize: 14, color: "#667085" }}>Belum ada booking yang tersimpan.</p>
            <button onClick={() => setActiveTab("cari-tukang")} style={{ padding: "10px 24px", background: "#026b5e", color: "white", border: "none", borderRadius: 12, fontWeight: 600, cursor: "pointer" }}>
              Cari Tukang Sekarang
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map(item => {
              const config = statusConfig[item.status] || { label: item.status, color: "#6b7280", bg: "#f3f4f6", icon: FiCheckCircle };
              const Icon = config.icon;
              return (
                <div style={{ background: "white", borderRadius: 16, border: "1px solid #e4e7ec", padding: 16, display: "flex", alignItems: "center", gap: 14 }}>
                  <Link to={`/user/tukang/${item.tukang_id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#e6f4f2", color: "#026b5e", display: "grid", placeItems: "center", fontWeight: "bold", fontSize: 14, flexShrink: 0, cursor: "pointer" }}>
                      {getInitials(item.nama_tukang)}
                    </div>
                  </Link>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link to={`/user/tukang/${item.tukang_id}`} style={{ textDecoration: "none", color: "inherit" }}>
                      <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", cursor: "pointer" }}>{item.nama_tukang}</h3>
                    </Link>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2, fontSize: 12, color: "#98a2b3" }}>
                      <FiCalendar size={12} /> {formatDate(item.tanggal_booking)}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Link to={`/user/booking/detail/${item.id}`} style={{ textDecoration: "none" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 3, padding: "3px 10px", borderRadius: 16, fontSize: 11, fontWeight: 700, background: config.bg, color: config.color, cursor: "pointer" }}>
                        <Icon size={12} /> {config.label}
                      </span>
                    </Link>
                    <Link to={`/user/booking/detail/${item.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                      <FiChevronRight style={{ color: "#d1d5db", flexShrink: 0, cursor: "pointer" }} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  function UlasanSayaSection() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, avg: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } });

    useEffect(() => {
      getMyReviews()
        .then(res => {
          const data = res.data || [];
          setReviews(data);
          const total = data.length;
          const sum = data.reduce((acc, r) => acc + Number(r.rating), 0);
          const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
          data.forEach(r => { if (dist[r.rating] !== undefined) dist[r.rating]++; });
          setStats({ total, avg: total > 0 ? (sum / total).toFixed(1) : 0, distribution: dist });
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }, []);

    const formatDateFull = (dateStr) => {
      if (!dateStr) return "-";
      return new Date(dateStr).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" });
    };

    return (
      <div style={{ maxWidth: "100%" }}>
        <header className="customer-topbar">
          <div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>Ulasan Saya</h1>
            <p style={{ margin: "4px 0 0", fontSize: 14, color: "#667085" }}>Semua ulasan yang telah Anda berikan</p>
          </div>
          <button onClick={() => setActiveTab("cari-tukang")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", background: "#026b5e", color: "white", border: "none", borderRadius: 12, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
            <FiSearch /> Cari Tukang
          </button>
        </header>

        {!loading && reviews.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 24, background: "white", borderRadius: 20, border: "1px solid #e4e7ec", padding: 24, marginBottom: 24 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 48, fontWeight: 800, color: "#f59e0b" }}>{stats.avg}</div>
              <div style={{ display: "flex", justifyContent: "center", gap: 2, margin: "4px 0" }}>
                {[1, 2, 3, 4, 5].map(n => (
                  <FiStar key={n} style={{ color: n <= Math.round(stats.avg) ? "#f59e0b" : "#d1d5db", fontSize: 16 }} fill={n <= Math.round(stats.avg) ? "#f59e0b" : "none"} />
                ))}
              </div>
              <p style={{ margin: 0, fontSize: 13, color: "#667085" }}>{stats.total} ulasan</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[5, 4, 3, 2, 1].map(n => (
                <div key={n} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, minWidth: 20 }}>{n}</span>
                  <FiStar size={14} style={{ color: "#f59e0b", flexShrink: 0 }} />
                  <div style={{ flex: 1, height: 8, background: "#f3f4f6", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${stats.total > 0 ? (stats.distribution[n] / stats.total) * 100 : 0}%`, background: "#f59e0b", borderRadius: 4 }} />
                  </div>
                  <span style={{ fontSize: 12, color: "#98a2b3", minWidth: 24, textAlign: "right" }}>{stats.distribution[n]}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: "#667085" }}>Memuat data...</div>
        ) : reviews.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", background: "white", borderRadius: 20, border: "1px solid #e4e7ec" }}>
            <FiMessageSquare style={{ fontSize: 48, color: "#d1d5db", marginBottom: 16 }} />
            <h3 style={{ margin: "0 0 8px", fontWeight: 700 }}>Belum ada ulasan</h3>
            <p style={{ margin: "0 0 20px", fontSize: 14, color: "#667085" }}>Anda belum memberikan ulasan untuk tukang mana pun.</p>
            <button onClick={() => setActiveTab("booking")} style={{ padding: "10px 24px", background: "#026b5e", color: "white", border: "none", borderRadius: 12, fontWeight: 600, cursor: "pointer" }}>
              Lihat Booking Selesai
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {reviews.map(item => (
              <div key={item.id} style={{ background: "white", borderRadius: 18, border: "1px solid #e4e7ec", padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#e6f4f2", color: "#026b5e", display: "grid", placeItems: "center", fontWeight: "bold", fontSize: 14, flexShrink: 0 }}>
                    {getInitials(item.nama_tukang)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>{item.nama_tukang}</h3>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#98a2b3" }}>
                      <FiCalendar size={12} /> {formatDateFull(item.tanggal_booking)}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                    {[1, 2, 3, 4, 5].map(n => (
                      <FiStar key={n} style={{ color: n <= Number(item.rating) ? "#f59e0b" : "#d1d5db", fontSize: 16 }} fill={n <= Number(item.rating) ? "#f59e0b" : "none"} />
                    ))}
                  </div>
                </div>
                {item.komentar && (
                  <div style={{ padding: "14px 16px", background: "#f8fafc", borderRadius: 12, fontSize: 14, color: "#667085", lineHeight: 1.5 }}>
                    "{item.komentar}"
                  </div>
                )}
                <p style={{ margin: "8px 0 0", fontSize: 11, color: "#d1d5db", textAlign: "right" }}>
                  {formatDateFull(item.created_at)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  function PengaturanSection() {
    const [nama, setNama] = useState("");
    const [email, setEmail] = useState("");
    const [foto, setFoto] = useState("");
    const [fotoFile, setFotoFile] = useState(null);
    const [fotoPreview, setFotoPreview] = useState("");
    const [uploading, setUploading] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    useEffect(() => {
      getProfile()
        .then(res => {
          const data = res.data;
          setNama(data.nama || "");
          setEmail(data.email || "");
          if (data.foto) {
            setFoto(data.foto);
            setFotoPreview(`http://localhost:5000/${data.foto}`);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }, []);

    const handleFotoChange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: "error", text: "Ukuran file maksimal 5MB" });
        return;
      }
      setFotoFile(file);
      setFotoPreview(URL.createObjectURL(file));
    };

    const handleUploadFoto = async () => {
      if (!fotoFile) return;
      setUploading(true);
      setMessage({ type: "", text: "" });
      try {
        const formData = new FormData();
        formData.append("foto", fotoFile);
        const res = await uploadProfilePhoto(formData);
        setFoto(res.data.foto);
        setFotoPreview(`http://localhost:5000/${res.data.foto}`);
        setFotoFile(null);
        const updatedUser = { ...user, foto: res.data.foto, nama, email };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        if (login) login(updatedUser, localStorage.getItem("token"));
        setMessage({ type: "success", text: "Foto profil berhasil diupload!" });
        showToast("Foto profil berhasil diupload");
      } catch (err) {
        setMessage({ type: "error", text: err.response?.data?.message || "Gagal mengupload foto" });
      } finally {
        setUploading(false);
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setMessage({ type: "", text: "" });
      if (newPassword && newPassword !== confirmPassword) {
        setMessage({ type: "error", text: "Konfirmasi password tidak cocok" });
        return;
      }
      if (newPassword && newPassword.length < 6) {
        setMessage({ type: "error", text: "Password baru minimal 6 karakter" });
        return;
      }
      setSaving(true);
      try {
        let fotoBaru = user?.foto;
        if (fotoFile) {
          const formData = new FormData();
          formData.append("foto", fotoFile);
          const uploadRes = await uploadProfilePhoto(formData);
          fotoBaru = uploadRes.data.foto;
          setFoto(fotoBaru);
          setFotoFile(null);
        }

        const payload = {};
        if (nama !== user?.nama) payload.nama = nama;
        if (email !== user?.email) payload.email = email;
        if (newPassword) {
          payload.current_password = currentPassword;
          payload.new_password = newPassword;
        }

        if (Object.keys(payload).length > 0) {
          await updateProfile(payload);
        }

        if (Object.keys(payload).length === 0 && !fotoFile) {
          setMessage({ type: "info", text: "Tidak ada perubahan yang disimpan." });
          setSaving(false);
          return;
        }

        const updatedUser = { ...user, nama, email, foto: fotoBaru };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        if (login) login(updatedUser, localStorage.getItem("token"));
        setMessage({ type: "success", text: "Profil berhasil diperbarui!" });
        showToast("Profil berhasil diperbarui");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } catch (err) {
        setMessage({ type: "error", text: err.response?.data?.message || "Gagal memperbarui profil" });
      } finally {
        setSaving(false);
      }
    };

    const handleLogout = () => {
      if (confirm("Yakin ingin logout?")) {
        logout();
        navigate("/login");
      }
    };

    if (loading) return <div style={{ textAlign: "center", padding: 60, color: "#667085" }}>Memuat...</div>;

    return (
      <div style={{ maxWidth: "100%" }}>
        <header className="customer-topbar">
          <div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>Pengaturan</h1>
            <p style={{ margin: "4px 0 24px", fontSize: 14, color: "#667085" }}>Kelola informasi profil dan keamanan akun Anda.</p>
          </div>
        </header>

        <form onSubmit={handleSubmit} style={{ background: "white", borderRadius: 20, border: "1px solid #e4e7ec", padding: 28, maxWidth: 600 }}>
          {message.text && (
            <div style={{
              padding: "12px 16px", borderRadius: 12, marginBottom: 20, fontSize: 14, fontWeight: 600,
              background: message.type === "success" ? "#d1fae5" : "#fee2e2",
              color: message.type === "success" ? "#065f46" : "#991b1b"
            }}>
              {message.text}
            </div>
          )}

          <h2 style={{ fontSize: 14, fontWeight: 700, color: "#667085", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 16px" }}>
            <FiCamera style={{ marginRight: 8 }} /> Foto Profil
          </h2>

          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#e6f4f2", overflow: "hidden", flexShrink: 0, position: "relative" }}>
              {fotoPreview ? (
                <img src={fotoPreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", fontWeight: "bold", fontSize: 24, color: "#026b5e" }}>
                  {profileInitials}
                </div>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <input type="file" accept="image/*" onChange={handleFotoChange} style={{ fontSize: 13, marginBottom: 8 }} />
              {fotoFile && (
                <button type="button" onClick={handleUploadFoto} disabled={uploading} style={{
                  padding: "8px 16px", background: uploading ? "#94a3b8" : "#026b5e", color: "white", border: "none",
                  borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: uploading ? "not-allowed" : "pointer"
                }}>
                  {uploading ? "Mengupload..." : "Simpan Foto"}
                </button>
              )}
            </div>
          </div>

          <hr style={{ border: "none", borderTop: "1px solid #e4e7ec", margin: "0 0 24px" }} />

          <h2 style={{ fontSize: 14, fontWeight: 700, color: "#667085", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 16px" }}>
            <FiUser style={{ marginRight: 8 }} /> Informasi Profil
          </h2>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#344054", marginBottom: 6 }}>Nama Lengkap</label>
            <input type="text" value={nama} onChange={e => setNama(e.target.value)}
              style={{ width: "100%", padding: "12px 14px", border: "1px solid #e4e7ec", borderRadius: 12, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#344054", marginBottom: 6 }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              style={{ width: "100%", padding: "12px 14px", border: "1px solid #e4e7ec", borderRadius: 12, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
          </div>

          <hr style={{ border: "none", borderTop: "1px solid #e4e7ec", margin: "0 0 24px" }} />

          <h2 style={{ fontSize: 14, fontWeight: 700, color: "#667085", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 16px" }}>
            <FiLock style={{ marginRight: 8 }} /> Ubah Password
          </h2>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#344054", marginBottom: 6 }}>Password Saat Ini</label>
            <div style={{ position: "relative" }}>
              <input type={showPassword ? "text" : "password"} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}
                style={{ width: "100%", padding: "12px 14px", paddingRight: 44, border: "1px solid #e4e7ec", borderRadius: 12, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#98a2b3", padding: 0 }}>
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#344054", marginBottom: 6 }}>Password Baru</label>
            <input type={showPassword ? "text" : "password"} value={newPassword} onChange={e => setNewPassword(e.target.value)}
              placeholder="Kosongkan jika tidak ingin mengubah"
              style={{ width: "100%", padding: "12px 14px", border: "1px solid #e4e7ec", borderRadius: 12, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#344054", marginBottom: 6 }}>Konfirmasi Password Baru</label>
            <input type={showPassword ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Ketik ulang password baru"
              style={{ width: "100%", padding: "12px 14px", border: "1px solid #e4e7ec", borderRadius: 12, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
          </div>

          <button type="submit" disabled={saving} style={{
            width: "100%", padding: 14, background: saving ? "#94a3b8" : "#026b5e", color: "white", border: "none",
            borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: saving ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8
          }}>
            <FiSave /> {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>

          <hr style={{ border: "none", borderTop: "1px solid #e4e7ec", margin: "24px 0" }} />

          <button type="button" onClick={handleLogout} style={{
            width: "100%", padding: 14, background: "white", color: "#dc2626", border: "2px solid #fee2e2",
            borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8
          }}>
            <FiLogOut /> Logout
          </button>
        </form>
      </div>
    );
  }

  function PembayaranSection() {
    const [wallet, setWallet] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddMethod, setShowAddMethod] = useState(false);
    const [newMethod, setNewMethod] = useState({ tipe: "bank_transfer", nama_bank: "", nomor_rekening: "", nama_pemilik: "", is_default: false });

    useEffect(() => {
      loadPaymentData();
    }, []);

    const loadPaymentData = async () => {
      setLoading(true);
      try {
        const [walletRes, txRes, methodsRes] = await Promise.all([
          getWallet(),
          getTransactions({ limit: 10 }),
          getPaymentMethods()
        ]);
        if (walletRes.success) setWallet(walletRes.data);
        if (txRes.success) setTransactions(txRes.data);
        if (methodsRes.success) setPaymentMethods(methodsRes.data);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };

    const handleAddMethod = async () => {
      if (!newMethod.nomor_rekening || !newMethod.nama_pemilik) {
        showToast("Lengkapi data rekening", "error");
        return;
      }
      try {
        const res = await addPaymentMethod(newMethod);
        if (res.success) {
          showToast("Metode pembayaran berhasil ditambahkan");
          setShowAddMethod(false);
          setNewMethod({ tipe: "bank_transfer", nama_bank: "", nomor_rekening: "", nama_pemilik: "", is_default: false });
          loadPaymentData();
        }
      } catch (e) {
        showToast(e?.response?.data?.message || "Gagal menambahkan", "error");
      }
    };

    const handleDeleteMethod = async (id) => {
      if (!confirm("Yakin ingin menghapus metode pembayaran ini?")) return;
      try {
        await deletePaymentMethod(id);
        showToast("Metode pembayaran dihapus");
        loadPaymentData();
      } catch (e) {
        showToast("Gagal menghapus", "error");
      }
    };

    const handleSetDefault = async (id) => {
      try {
        await setDefaultPaymentMethod(id);
        showToast("Metode utama berhasil diubah");
        loadPaymentData();
      } catch (e) {
        showToast("Gagal mengubah", "error");
      }
    };

    const tipeColors = {
      topup: { bg: "#d1fae5", color: "#065f46", label: "Topup" },
      payment: { bg: "#fee2e2", color: "#991b1b", label: "Pembayaran" },
      withdraw: { bg: "#fef3c7", color: "#92400e", label: "Tarik" },
      refund: { bg: "#dbeafe", color: "#1e40af", label: "Refund" },
    };
    const statusColors = {
      success: { bg: "#d1fae5", color: "#065f46", label: "Berhasil" },
      pending: { bg: "#fef3c7", color: "#92400e", label: "Menunggu" },
      failed: { bg: "#fee2e2", color: "#991b1b", label: "Gagal" },
    };

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
    };

    const formatDateFull = (dateStr) => {
      if (!dateStr) return "-";
      return new Date(dateStr).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });
    };

    if (loading) return <div style={{ textAlign: "center", padding: 60, color: "#667085" }}>Memuat data...</div>;

    return (
      <div style={{ maxWidth: "100%" }}>
        <header className="customer-topbar">
          <div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>Pembayaran</h1>
            <p style={{ margin: "4px 0 0", fontSize: 14, color: "#667085" }}>Kelola dompet digital, topup saldo, dan metode pembayaran.</p>
          </div>
        </header>

        {/* Wallet Card */}
        <div style={{ background: "linear-gradient(135deg, #026b5e 0%, #00c9a7 100%)", borderRadius: 24, padding: 28, color: "white", marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p style={{ margin: "0 0 4px", fontSize: 13, opacity: 0.8, fontWeight: 600 }}>Saldo Dompet</p>
              <h2 style={{ margin: 0, fontSize: 36, fontWeight: 800 }}>{wallet ? formatCurrency(wallet.saldo) : "Rp 0"}</h2>
            </div>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "grid", placeItems: "center", fontSize: 24 }}>
              <FiCreditCard />
            </div>
          </div>
        </div>

        {/* Two columns: Transactions + Payment Methods */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {/* Transactions */}
          <div style={{ background: "white", borderRadius: 20, border: "1px solid #e4e7ec", padding: 24 }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700 }}>Riwayat Transaksi</h3>
            {transactions.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: "#98a2b3" }}>
                <FiCreditCard style={{ fontSize: 32, marginBottom: 8 }} />
                <p style={{ margin: 0, fontSize: 14 }}>Belum ada transaksi</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {transactions.map(tx => {
                  const tc = tipeColors[tx.tipe] || { bg: "#f3f4f6", color: "#6b7280", label: tx.tipe };
                  const sc = statusColors[tx.status] || { bg: "#f3f4f6", color: "#6b7280", label: tx.status };
                  return (
                    <div key={tx.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f3f4f6" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <span style={{ padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700, background: tc.bg, color: tc.color }}>{tc.label}</span>
                          <span style={{ padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700, background: sc.bg, color: sc.color }}>{sc.label}</span>
                        </div>
                        <p style={{ margin: 0, fontSize: 13, color: "#667085" }}>{tx.keterangan || tx.referensi || "-"}</p>
                        <p style={{ margin: "2px 0 0", fontSize: 11, color: "#98a2b3" }}>{formatDateFull(tx.created_at)}</p>
                      </div>
                      <span style={{ fontWeight: 700, fontSize: 14, color: tx.tipe === "topup" || tx.tipe === "refund" ? "#065f46" : "#991b1b" }}>
                        {tx.tipe === "topup" || tx.tipe === "refund" ? "+" : "-"}{formatCurrency(tx.jumlah)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Payment Methods */}
          <div style={{ background: "white", borderRadius: 20, border: "1px solid #e4e7ec", padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Metode Pembayaran</h3>
              <button onClick={() => setShowAddMethod(true)} style={{ padding: "6px 14px", background: "#e6f4f2", color: "#026b5e", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 12, cursor: "pointer" }}>
                + Tambah
              </button>
            </div>
            {paymentMethods.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: "#98a2b3" }}>
                <FiCreditCard style={{ fontSize: 32, marginBottom: 8 }} />
                <p style={{ margin: 0, fontSize: 14 }}>Belum ada metode pembayaran</p>
                <button onClick={() => setShowAddMethod(true)} style={{ marginTop: 12, padding: "8px 16px", background: "#026b5e", color: "white", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                  Tambah Rekening
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {paymentMethods.map(m => (
                  <div key={m.id} style={{ padding: 14, borderRadius: 12, border: m.is_default ? "2px solid #026b5e" : "1px solid #e4e7ec", background: m.is_default ? "#e6f4f2" : "white" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                          <span style={{ fontWeight: 700, fontSize: 14 }}>{m.nama_bank || m.tipe}</span>
                          {m.is_default && <span style={{ padding: "1px 6px", borderRadius: 4, background: "#026b5e", color: "white", fontSize: 10, fontWeight: 700 }}>Utama</span>}
                        </div>
                        <p style={{ margin: 0, fontSize: 13, color: "#344054" }}>{m.nomor_rekening}</p>
                        <p style={{ margin: "2px 0 0", fontSize: 12, color: "#667085" }}>{m.nama_pemilik}</p>
                      </div>
                      <div style={{ display: "flex", gap: 6 }}>
                        {!m.is_default && (
                          <button onClick={() => handleSetDefault(m.id)} style={{ padding: "4px 10px", background: "white", border: "1px solid #e4e7ec", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer", color: "#667085" }}>
                            Utamakan
                          </button>
                        )}
                        <button onClick={() => handleDeleteMethod(m.id)} style={{ padding: "4px 10px", background: "#fee2e2", border: "none", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer", color: "#dc2626" }}>
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add Payment Method Modal */}
        {showAddMethod && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }} onClick={() => setShowAddMethod(false)}>
            <div style={{ background: "white", borderRadius: 24, padding: 32, maxWidth: 420, width: "90%", position: "relative" }} onClick={e => e.stopPropagation()}>
              <button onClick={() => setShowAddMethod(false)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer", color: "#98a2b3" }}><FiX size={20} /></button>
              <h2 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 800 }}>Tambah Metode Pembayaran</h2>
              <p style={{ fontSize: 14, color: "#667085", margin: "0 0 24px" }}>Simpan data rekening bank atau e-wallet Anda.</p>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#344054", marginBottom: 6 }}>Tipe</label>
                <select value={newMethod.tipe} onChange={e => setNewMethod({ ...newMethod, tipe: e.target.value })}
                  style={{ width: "100%", padding: "12px 14px", border: "1px solid #e4e7ec", borderRadius: 12, fontSize: 14, outline: "none", background: "white" }}>
                  <option value="e_wallet">E-Wallet / QRIS</option>
                </select>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#344054", marginBottom: 6 }}>Nama Bank / E-Wallet</label>
                <input type="text" value={newMethod.nama_bank} onChange={e => setNewMethod({ ...newMethod, nama_bank: e.target.value })} placeholder="BCA, Mandiri, GoPay, dll"
                  style={{ width: "100%", padding: "12px 14px", border: "1px solid #e4e7ec", borderRadius: 12, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#344054", marginBottom: 6 }}>Nomor Rekening</label>
                <input type="text" value={newMethod.nomor_rekening} onChange={e => setNewMethod({ ...newMethod, nomor_rekening: e.target.value })} placeholder="1234567890"
                  style={{ width: "100%", padding: "12px 14px", border: "1px solid #e4e7ec", borderRadius: 12, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#344054", marginBottom: 6 }}>Nama Pemilik</label>
                <input type="text" value={newMethod.nama_pemilik} onChange={e => setNewMethod({ ...newMethod, nama_pemilik: e.target.value })} placeholder="John Doe"
                  style={{ width: "100%", padding: "12px 14px", border: "1px solid #e4e7ec", borderRadius: 12, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
              </div>
              <div style={{ marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
                <input type="checkbox" id="is_default" checked={newMethod.is_default} onChange={e => setNewMethod({ ...newMethod, is_default: e.target.checked })} />
                <label htmlFor="is_default" style={{ fontSize: 14, fontWeight: 500, color: "#344054" }}>Jadikan metode utama</label>
              </div>
              <button onClick={handleAddMethod} style={{ width: "100%", padding: 14, background: "#026b5e", color: "white", border: "none", borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
                Simpan Metode
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  function PlaceholderSection({ icon: Icon, title, message }) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "100px 20px", textAlign: "center" }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#e6f4f2", color: "#026b5e", display: "grid", placeItems: "center", fontSize: 32, marginBottom: 24 }}>
          <Icon />
        </div>
        <h2 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 800, color: "var(--ink)" }}>{title}</h2>
        <p style={{ margin: 0, fontSize: 14, color: "#667085", maxWidth: 400, lineHeight: 1.6 }}>{message}</p>
      </div>
    );
  }
}

export default UserDashboard;
