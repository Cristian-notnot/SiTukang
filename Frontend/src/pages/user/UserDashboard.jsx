import { useNavigate } from "react-router-dom";
import {
  FiBell,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiCreditCard,
  FiGrid,
  FiHome,
  FiMapPin,
  FiMenu,
  FiMessageCircle,
  FiSearch,
  FiSettings,
  FiStar,
  FiTool,
  FiUser,
} from "react-icons/fi";
import "../../assets/css/UserDashboard.css";

const stats = [
  { label: "Booking aktif", value: "3", note: "2 tukang dalam perjalanan", icon: FiCalendar },
  { label: "Selesai", value: "18", note: "Pekerjaan berhasil ditutup", icon: FiCheckCircle },
  { label: "Rating rata-rata", value: "4.8", note: "Dari ulasan terakhir", icon: FiStar },
  { label: "Total hemat", value: "Rp420K", note: "Dari promo dan paket", icon: FiCreditCard },
];

const quickServices = [
  { title: "Listrik", count: "248 tukang", tone: "amber", icon: FiTool },
  { title: "Service AC", count: "184 tukang", tone: "sky", icon: FiHome },
  { title: "Pipa Bocor", count: "162 tukang", tone: "indigo", icon: FiSettings },
  { title: "Cleaning", count: "276 tukang", tone: "emerald", icon: FiCheckCircle },
];

const workers = [
  {
    name: "Budi Santoso",
    role: "Tukang Listrik",
    rating: "4.9",
    jobs: "312 job",
    area: "Jakarta Selatan",
    price: "Rp75.000/jam",
    initials: "BS",
    status: "Tersedia hari ini",
  },
  {
    name: "Andi Wijaya",
    role: "Service AC",
    rating: "4.8",
    jobs: "256 job",
    area: "Jakarta Pusat",
    price: "Rp120.000/jam",
    initials: "AW",
    status: "Respons 10 menit",
  },
  {
    name: "Slamet Riyadi",
    role: "Tukang Pipa",
    rating: "4.7",
    jobs: "189 job",
    area: "Tangerang",
    price: "Rp85.000/jam",
    initials: "SR",
    status: "Garansi 7 hari",
  },
];

const activities = [
  {
    title: "Booking service AC dikonfirmasi",
    description: "Andi Wijaya akan datang pukul 14.00",
    time: "10 menit lalu",
    icon: FiCheckCircle,
  },
  {
    title: "Pembayaran berhasil",
    description: "Invoice ST-2048 sudah lunas",
    time: "Kemarin",
    icon: FiCreditCard,
  },
  {
    title: "Ulasan terkirim",
    description: "Anda memberi rating 5.0 untuk Budi Santoso",
    time: "2 hari lalu",
    icon: FiStar,
  },
];

function UserDashboard() {
  const navigate = useNavigate();

  return (
    <div className="customer-dashboard">
      <aside className="customer-sidebar">
        <button className="sidebar-brand" type="button" onClick={() => navigate("/")}>
          <span className="brand-mark">
            <FiTool />
          </span>
          <span>SiTukang</span>
        </button>

        <nav className="sidebar-nav" aria-label="Dashboard customer">
          <button className="sidebar-link active" type="button">
            <FiGrid />
            <span>Dashboard</span>
          </button>
          <button className="sidebar-link" type="button" onClick={() => navigate("/layanan")}>
            <FiTool />
            <span>Layanan</span>
          </button>
          <button className="sidebar-link" type="button" onClick={() => navigate("/user/my-booking")}>
            <FiCalendar />
            <span>Booking Saya</span>
          </button>
          <button className="sidebar-link" type="button">
            <FiMessageCircle />
            <span>Pesan</span>
          </button>
          <button className="sidebar-link" type="button">
            <FiSettings />
            <span>Pengaturan</span>
          </button>
        </nav>

        <div className="sidebar-help">
          <span className="help-icon">
            <FiClock />
          </span>
          <h3>Bantuan cepat</h3>
          <p>Butuh tukang darurat? Tim kami siap bantu memilih layanan.</p>
          <button type="button" onClick={() => navigate("/kontak")}>Hubungi CS</button>
        </div>
      </aside>

      <main className="customer-main">
        <header className="customer-topbar">
          <div>
            <p className="topbar-kicker">Dashboard Customer</p>
            <h1>Selamat datang, Pelanggan</h1>
          </div>

          <div className="topbar-actions">
            <label className="dashboard-search">
              <FiSearch />
              <input type="search" placeholder="Cari layanan atau tukang" />
            </label>
            <button className="icon-button" type="button" aria-label="Notifikasi">
              <FiBell />
            </button>
            <button className="profile-button" type="button">
              <FiUser />
              <span>Customer</span>
            </button>
            <button className="mobile-menu-button" type="button" aria-label="Menu">
              <FiMenu />
            </button>
          </div>
        </header>

        <section className="welcome-hero">
          <div className="hero-copy">
            <span className="hero-badge">Tukang terverifikasi di sekitar Anda</span>
            <h2>Pesan layanan rumah dengan alur yang lebih rapi dan cepat.</h2>
            <p>
              Pantau booking aktif, temukan tukang rekomendasi, dan lanjutkan pekerjaan rumah
              dari satu dashboard yang tenang dan mudah dipindai.
            </p>
            <div className="hero-actions">
              <button className="primary-action" type="button" onClick={() => navigate("/layanan")}>
                Cari Layanan
              </button>
              <button className="secondary-action" type="button" onClick={() => navigate("/user/my-booking")}>
                Lihat Booking
              </button>
            </div>
          </div>

          <div className="hero-panel" aria-label="Ringkasan booking berikutnya">
            <div className="panel-status">Booking berikutnya</div>
            <h3>Service AC ruang tamu</h3>
            <p>Hari ini, 14.00 - Jakarta Selatan</p>
            <div className="panel-worker">
              <span>AW</span>
              <div>
                <strong>Andi Wijaya</strong>
                <small>Dalam perjalanan</small>
              </div>
            </div>
          </div>
        </section>

        <section className="stats-grid" aria-label="Statistik customer">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <article className="stat-card" key={item.label}>
                <div className="stat-icon">
                  <Icon />
                </div>
                <div>
                  <p>{item.label}</p>
                  <strong>{item.value}</strong>
                  <span>{item.note}</span>
                </div>
              </article>
            );
          })}
        </section>

        <div className="dashboard-content-grid">
          <section className="dashboard-section quick-services-section">
            <div className="section-heading">
              <div>
                <span>Quick Services</span>
                <h2>Layanan cepat</h2>
              </div>
              <button type="button" onClick={() => navigate("/layanan")}>Semua</button>
            </div>

            <div className="quick-services-grid">
              {quickServices.map((service) => {
                const Icon = service.icon;
                return (
                  <button className="quick-service-card" type="button" key={service.title}>
                    <span className={`service-icon ${service.tone}`}>
                      <Icon />
                    </span>
                    <strong>{service.title}</strong>
                    <small>{service.count}</small>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="dashboard-section activity-section">
            <div className="section-heading">
              <div>
                <span>Recent Activity</span>
                <h2>Aktivitas terbaru</h2>
              </div>
            </div>

            <div className="activity-list">
              {activities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <article className="activity-item" key={activity.title}>
                    <span className="activity-icon">
                      <Icon />
                    </span>
                    <div>
                      <h3>{activity.title}</h3>
                      <p>{activity.description}</p>
                    </div>
                    <time>{activity.time}</time>
                  </article>
                );
              })}
            </div>
          </section>
        </div>

        <section className="dashboard-section recommended-section">
          <div className="section-heading">
            <div>
              <span>Recommended Workers</span>
              <h2>Rekomendasi tukang</h2>
            </div>
            <button type="button" onClick={() => navigate("/user")}>Lihat daftar</button>
          </div>

          <div className="worker-grid">
            {workers.map((worker) => (
              <article className="worker-card" key={worker.name}>
                <div className="worker-top">
                  <span className="worker-avatar">{worker.initials}</span>
                  <span className="worker-status">{worker.status}</span>
                </div>
                <h3>{worker.name}</h3>
                <p>{worker.role}</p>
                <div className="worker-meta">
                  <span>
                    <FiStar /> {worker.rating} ({worker.jobs})
                  </span>
                  <span>
                    <FiMapPin /> {worker.area}
                  </span>
                </div>
                <div className="worker-footer">
                  <strong>{worker.price}</strong>
                  <button type="button">Booking</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default UserDashboard;
