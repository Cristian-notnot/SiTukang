import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getMyBooking, cancelBooking } from "../../api/bookingApi";
import {
  FiCalendar, FiMapPin, FiClock, FiCheckCircle, FiXCircle,
  FiRefreshCw, FiSearch, FiChevronRight
} from "react-icons/fi";

const statusConfig = {
  pending: { label: "Menunggu", color: "#f59e0b", bg: "#fef3c7", icon: FiClock },
  diterima: { label: "Diterima", color: "#3b82f6", bg: "#dbeafe", icon: FiCheckCircle },
  dikerjakan: { label: "Dikerjakan", color: "#8b5cf6", bg: "#ede9fe", icon: FiRefreshCw },
};

const activeStatuses = ["pending", "diterima", "dikerjakan"];

function OrderAktif() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyBooking()
      .then(res => setBookings((res.data || []).filter(b => activeStatuses.includes(b.status))))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    if (!confirm("Yakin ingin membatalkan booking ini?")) return;
    try {
      await cancelBooking(id);
      setBookings(prev => prev.filter(b => b.id !== id));
    } catch (e) {
      alert("Gagal membatalkan");
    }
  };

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
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>Order Aktif</h1>
            <p style={{ margin: "4px 0 0", fontSize: 14, color: "#667085" }}>
              {loading ? "Memuat..." : `${bookings.length} order aktif`}
            </p>
          </div>
          <button onClick={() => navigate("/user/cari-tukang")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", background: "#026b5e", color: "white", border: "none", borderRadius: 12, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
            <FiSearch /> Cari Tukang
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: "#667085" }}>Memuat data...</div>
        ) : bookings.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", background: "white", borderRadius: 20, border: "1px solid #e4e7ec" }}>
            <FiCheckCircle style={{ fontSize: 48, color: "#d1d5db", marginBottom: 16 }} />
            <h3 style={{ margin: "0 0 8px", fontWeight: 700 }}>Tidak ada order aktif</h3>
            <p style={{ margin: 0, fontSize: 14, color: "#667085", marginBottom: 20 }}>Belum ada booking yang sedang berjalan.</p>
            <button onClick={() => navigate("/user/cari-tukang")} style={{ padding: "10px 24px", background: "#026b5e", color: "white", border: "none", borderRadius: 12, fontWeight: 600, cursor: "pointer" }}>
              Cari Tukang Sekarang
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {bookings.map(item => {
              const config = statusConfig[item.status] || { label: item.status, color: "#6b7280", bg: "#f3f4f6", icon: FiCheckCircle };
              const Icon = config.icon;
              return (
                <Link key={item.id} to={`/user/booking/detail/${item.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div style={{ background: "white", borderRadius: 18, border: "1px solid #e4e7ec", padding: 20, display: "flex", alignItems: "center", gap: 16, transition: "box-shadow 0.2s" }}>
                    <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#e6f4f2", color: "#026b5e", display: "grid", placeItems: "center", fontWeight: "bold", fontSize: 16, flexShrink: 0 }}>
                      {getInitials(item.nama_tukang)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.nama_tukang}</h3>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4, fontSize: 13, color: "#667085" }}>
                        <FiCalendar size={14} /> {formatDate(item.tanggal_booking)}
                        <FiMapPin size={14} /> {(item.alamat || "").split(",")[0]}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: config.bg, color: config.color }}>
                        <Icon size={14} /> {config.label}
                      </span>
                      {item.status === "pending" && (
                        <button onClick={e => { e.preventDefault(); handleCancel(item.id); }} style={{ padding: "6px 12px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                          Batal
                        </button>
                      )}
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

export default OrderAktif;
