import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getMyReviews } from "../../api/reviewApi";
import { FiStar, FiCalendar, FiMessageSquare, FiSearch } from "react-icons/fi";

function UlasanSaya() {
  const navigate = useNavigate();
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

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" });
  };

  const getInitials = (name) => {
    if (!name) return "TK";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>Ulasan Saya</h1>
            <p style={{ margin: "4px 0 0", fontSize: 14, color: "#667085" }}>
              Semua ulasan yang telah Anda berikan
            </p>
          </div>
          <button onClick={() => navigate("/user/cari-tukang")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", background: "#026b5e", color: "white", border: "none", borderRadius: 12, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
            <FiSearch /> Cari Tukang
          </button>
        </div>

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
            <button onClick={() => navigate("/user/my-booking")} style={{ padding: "10px 24px", background: "#026b5e", color: "white", border: "none", borderRadius: 12, fontWeight: 600, cursor: "pointer" }}>
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
                      <FiCalendar size={12} /> {formatDate(item.tanggal_booking)}
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
                  {formatDate(item.created_at)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UlasanSaya;
