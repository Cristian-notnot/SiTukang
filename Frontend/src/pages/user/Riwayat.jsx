import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getMyBooking } from "../../api/bookingApi";
import {
  FiCalendar, FiMapPin, FiClock, FiCheckCircle, FiXCircle,
  FiRefreshCw, FiSearch, FiChevronRight, FiFilter
} from "react-icons/fi";

const statusConfig = {
  pending: { label: "Menunggu", color: "#f59e0b", bg: "#fef3c7", icon: FiClock },
  diterima: { label: "Diterima", color: "#3b82f6", bg: "#dbeafe", icon: FiCheckCircle },
  dikerjakan: { label: "Dikerjakan", color: "#8b5cf6", bg: "#ede9fe", icon: FiRefreshCw },
  selesai: { label: "Selesai", color: "#10b981", bg: "#d1fae5", icon: FiCheckCircle },
  ditolak: { label: "Ditolak", color: "#ef4444", bg: "#fee2e2", icon: FiXCircle },
  dibatalkan: { label: "Dibatalkan", color: "#6b7280", bg: "#f3f4f6", icon: FiXCircle },
};

const allStatuses = Object.keys(statusConfig);
const filterOptions = [
  { value: "", label: "Semua Status" },
  { value: "pending", label: "Menunggu" },
  { value: "diterima", label: "Diterima" },
  { value: "dikerjakan", label: "Dikerjakan" },
  { value: "selesai", label: "Selesai" },
  { value: "ditolak", label: "Ditolak" },
  { value: "dibatalkan", label: "Dibatalkan" },
];

function Riwayat() {
  const navigate = useNavigate();
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    getMyBooking()
      .then(res => setAllBookings(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter ? allBookings.filter(b => b.status === filter) : allBookings;

  const getInitials = (name) => {
    if (!name) return "TK";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>Riwayat Booking</h1>
            <p style={{ margin: "4px 0 0", fontSize: 14, color: "#667085" }}>
              {loading ? "Memuat..." : `${filtered.length} dari ${allBookings.length} booking`}
            </p>
          </div>
          <button onClick={() => navigate("/user/cari-tukang")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", background: "#026b5e", color: "white", border: "none", borderRadius: 12, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
            <FiSearch /> Cari Tukang
          </button>
        </div>

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
            <button onClick={() => navigate("/user/cari-tukang")} style={{ padding: "10px 24px", background: "#026b5e", color: "white", border: "none", borderRadius: 12, fontWeight: 600, cursor: "pointer" }}>
              Cari Tukang Sekarang
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map(item => {
              const config = statusConfig[item.status] || { label: item.status, color: "#6b7280", bg: "#f3f4f6", icon: FiCheckCircle };
              const Icon = config.icon;
              return (
                <Link key={item.id} to={`/user/booking/detail/${item.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div style={{ background: "white", borderRadius: 16, border: "1px solid #e4e7ec", padding: 16, display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#e6f4f2", color: "#026b5e", display: "grid", placeItems: "center", fontWeight: "bold", fontSize: 14, flexShrink: 0 }}>
                      {getInitials(item.nama_tukang)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.nama_tukang}</h3>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2, fontSize: 12, color: "#98a2b3" }}>
                        <FiCalendar size={12} /> {formatDate(item.tanggal_booking)}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 3, padding: "3px 10px", borderRadius: 16, fontSize: 11, fontWeight: 700, background: config.bg, color: config.color }}>
                        <Icon size={12} /> {config.label}
                      </span>
                      <FiChevronRight style={{ color: "#d1d5db", flexShrink: 0 }} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Riwayat;
