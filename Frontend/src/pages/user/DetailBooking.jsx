import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getBookingById, cancelBooking } from "../../api/bookingApi";
import { payBooking } from "../../api/paymentApi";
import {
  FiCalendar, FiMapPin, FiPhone, FiStar, FiTool, FiClock,
  FiChevronLeft, FiXCircle, FiCheckCircle, FiAlertCircle,
  FiRefreshCw, FiMessageSquare, FiUser, FiCreditCard
} from "react-icons/fi";

const statusConfig = {
  pending: { label: "Menunggu", color: "#f59e0b", bg: "#fef3c7", icon: FiClock },
  diterima: { label: "Diterima", color: "#3b82f6", bg: "#dbeafe", icon: FiCheckCircle },
  dikerjakan: { label: "Dikerjakan", color: "#8b5cf6", bg: "#ede9fe", icon: FiRefreshCw },
  selesai: { label: "Selesai", color: "#10b981", bg: "#d1fae5", icon: FiCheckCircle },
  ditolak: { label: "Ditolak", color: "#ef4444", bg: "#fee2e2", icon: FiXCircle },
  dibatalkan: { label: "Dibatalkan", color: "#6b7280", bg: "#f3f4f6", icon: FiXCircle },
};

const statusFlow = ["pending", "diterima", "dikerjakan", "selesai"];

function DetailBooking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [payAmount, setPayAmount] = useState("");
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    getBookingById(id)
      .then(res => setBooking(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    if (!confirm("Yakin ingin membatalkan booking ini?")) return;
    setCancelling(true);
    try {
      await cancelBooking(id);
      const res = await getBookingById(id);
      setBooking(res.data);
    } catch (e) {
      alert("Gagal membatalkan booking");
    } finally {
      setCancelling(false);
    }
  };

  const handlePayBooking = async () => {
    const amount = parseFloat(payAmount);
    if (!amount || amount <= 0) {
      alert("Masukkan jumlah pembayaran");
      return;
    }
    setPaying(true);
    try {
      const res = await payBooking(id, amount, "qris");
      if (res.success) {
        alert(`Pembayaran Rp ${amount.toLocaleString()} berhasil!`);
        setShowPayModal(false);
        setPayAmount("");
        const bookingRes = await getBookingById(id);
        setBooking(bookingRes.data);
      }
    } catch (e) {
      alert(e?.response?.data?.message || "Pembayaran gagal");
    }
    setPaying(false);
  };

  if (loading) {
    return (
      <div className="customer-dashboard" style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f8fafc" }}>
        <p style={{ color: "#667085" }}>Memuat detail booking...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="customer-dashboard" style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f8fafc" }}>
        <div style={{ textAlign: "center" }}>
          <FiAlertCircle style={{ fontSize: 48, color: "#ef4444", marginBottom: 16 }} />
          <h2>Booking tidak ditemukan</h2>
          <button onClick={() => navigate("/user/my-booking")} style={{ marginTop: 16, padding: "10px 24px", background: "#026b5e", color: "white", border: "none", borderRadius: 12, fontWeight: 600, cursor: "pointer" }}>
            Kembali ke Booking
          </button>
        </div>
      </div>
    );
  }

  const currentStatus = booking.status;
  const StatusIcon = statusConfig[currentStatus]?.icon || FiClock;
  const currentStep = statusFlow.indexOf(currentStatus);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString("id-ID", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}>
        <button onClick={() => navigate("/user/my-booking")} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#026b5e", fontWeight: 600, fontSize: 14, cursor: "pointer", marginBottom: 24, padding: 0 }}>
          <FiChevronLeft /> Kembali ke Booking
        </button>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, alignItems: "start" }}>
          <div>
            <div style={{ background: "white", borderRadius: 20, border: "1px solid #e4e7ec", overflow: "hidden", marginBottom: 24 }}>
              <div style={{ padding: "24px 28px", borderBottom: "1px solid #e4e7ec", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Detail Booking</h1>
                  <p style={{ margin: "4px 0 0", fontSize: 13, color: "#667085" }}>ID Booking: #{booking.id}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 20, background: statusConfig[currentStatus]?.bg || "#f3f4f6" }}>
                  <StatusIcon style={{ color: statusConfig[currentStatus]?.color, fontSize: 16 }} />
                  <span style={{ fontWeight: 700, fontSize: 13, color: statusConfig[currentStatus]?.color }}>{statusConfig[currentStatus]?.label || currentStatus}</span>
                </div>
              </div>

              <div style={{ padding: "24px 28px" }}>
                <h2 style={{ fontSize: 14, fontWeight: 700, color: "#667085", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 16px" }}>Informasi Booking</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <FiCalendar style={{ color: "#026b5e", marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <p style={{ margin: 0, fontSize: 12, color: "#98a2b3", fontWeight: 600 }}>Tanggal Booking</p>
                      <p style={{ margin: "2px 0 0", fontSize: 14, fontWeight: 600 }}>{formatDate(booking.tanggal_booking)}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <FiCalendar style={{ color: "#026b5e", marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <p style={{ margin: 0, fontSize: 12, color: "#98a2b3", fontWeight: 600 }}>Dibuat Pada</p>
                      <p style={{ margin: "2px 0 0", fontSize: 14, fontWeight: 600 }}>{formatDate(booking.created_at)}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start", gridColumn: "1 / -1" }}>
                    <FiMapPin style={{ color: "#026b5e", marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <p style={{ margin: 0, fontSize: 12, color: "#98a2b3", fontWeight: 600 }}>Alamat Pengerjaan</p>
                      <p style={{ margin: "2px 0 0", fontSize: 14, fontWeight: 600 }}>{booking.alamat}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start", gridColumn: "1 / -1" }}>
                    <FiMessageSquare style={{ color: "#026b5e", marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <p style={{ margin: 0, fontSize: 12, color: "#98a2b3", fontWeight: 600 }}>Keluhan / Deskripsi</p>
                      <p style={{ margin: "2px 0 0", fontSize: 14, fontWeight: 600 }}>{booking.keluhan || "Tidak ada keluhan"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: "white", borderRadius: 20, border: "1px solid #e4e7ec", overflow: "hidden", marginBottom: 24 }}>
              <div style={{ padding: "24px 28px" }}>
                <h2 style={{ fontSize: 14, fontWeight: 700, color: "#667085", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 20px" }}>Status Progress</h2>
                <div style={{ position: "relative" }}>
                  {statusFlow.map((step, index) => {
                    const config = statusConfig[step];
                    const StepIcon = config.icon;
                    const isActive = index <= currentStep && currentStep !== -1 && !["ditolak", "dibatalkan"].includes(currentStatus);
                    const isCurrent = step === currentStatus;
                    const isRejected = ["ditolak", "dibatalkan"].includes(currentStatus);

                    return (
                      <div key={step} style={{ display: "flex", gap: 16, marginBottom: index < statusFlow.length - 1 ? 0 : 0, position: "relative" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 32 }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: "50%", display: "grid", placeItems: "center",
                            background: isActive || isCurrent ? config.bg : "#f3f4f6",
                            color: isActive || isCurrent ? config.color : "#d1d5db",
                            border: `2px solid ${isActive || isCurrent ? config.color : "#e5e7eb"}`,
                            fontSize: 14, zIndex: 1
                          }}>
                            <StepIcon />
                          </div>
                          {index < statusFlow.length - 1 && (
                            <div style={{
                              width: 2, flex: 1, minHeight: 24,
                              background: isActive ? config.color : "#e5e7eb"
                            }} />
                          )}
                        </div>
                        <div style={{ paddingBottom: index < statusFlow.length - 1 ? 24 : 0 }}>
                          <p style={{ margin: 0, fontSize: 14, fontWeight: isCurrent ? 700 : 500, color: isCurrent ? config.color : isActive ? "#101828" : "#9ca3af" }}>
                            {config.label}
                          </p>
                          {isCurrent && (
                            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#667085" }}>Status saat ini</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {isRejected && (
                    <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 32 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: "50%", display: "grid", placeItems: "center",
                          background: statusConfig[currentStatus]?.bg, color: statusConfig[currentStatus]?.color,
                          border: `2px solid ${statusConfig[currentStatus]?.color}`, fontSize: 14, zIndex: 1
                        }}>
                          <StatusIcon />
                        </div>
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: statusConfig[currentStatus]?.color }}>
                          {statusConfig[currentStatus]?.label}
                        </p>
                        <p style={{ margin: "2px 0 0", fontSize: 12, color: "#667085" }}>Proses selesai</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {booking.status === "selesai" && (booking.user_rating || booking.user_komentar) && (
              <div style={{ background: "white", borderRadius: 20, border: "1px solid #e4e7ec", overflow: "hidden" }}>
                <div style={{ padding: "24px 28px" }}>
                  <h2 style={{ fontSize: 14, fontWeight: 700, color: "#667085", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 16px" }}>Ulasan Anda</h2>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    {[1, 2, 3, 4, 5].map(n => (
                      <FiStar key={n} style={{ color: n <= (booking.user_rating || 0) ? "#f59e0b" : "#d1d5db", fontSize: 20 }} fill={n <= (booking.user_rating || 0) ? "#f59e0b" : "none"} />
                    ))}
                  </div>
                  {booking.user_komentar && <p style={{ margin: 0, fontSize: 14, color: "#667085" }}>"{booking.user_komentar}"</p>}
                </div>
              </div>
            )}
          </div>

          <div>
            <div style={{ background: "white", borderRadius: 20, border: "1px solid #e4e7ec", overflow: "hidden", marginBottom: 16 }}>
              <div style={{ padding: "24px" }}>
                <h2 style={{ fontSize: 14, fontWeight: 700, color: "#667085", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 16px" }}>Informasi Tukang</h2>
                <Link to={`/user/tukang/${booking.tukang_id}`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: "50%",
                      background: "#e6f4f2", color: "#026b5e",
                      display: "grid", placeItems: "center", fontWeight: "bold", fontSize: 18, flexShrink: 0
                    }}>
                      {booking.nama_tukang?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "TK"}
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{booking.nama_tukang}</h3>
                      <span style={{ fontSize: 13, color: "#026b5e", fontWeight: 600 }}>{booking.nama_kategori}</span>
                    </div>
                  </div>
                </Link>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13, color: "#667085" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <FiStar style={{ color: "#f59e0b", flexShrink: 0 }} /> {booking.rating_tukang || "0.0"} Rating
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <FiTool style={{ flexShrink: 0 }} /> {booking.pengalaman || 0} thn pengalaman
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <FiPhone style={{ flexShrink: 0 }} /> {booking.telepon_tukang || "-"}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <FiMapPin style={{ flexShrink: 0 }} /> {booking.alamat_tukang || "-"}
                  </span>
                </div>
              </div>
            </div>

            {currentStatus === "pending" && (
              <button onClick={handleCancel} disabled={cancelling} style={{
                width: "100%", padding: 14, background: cancelling ? "#f3f4f6" : "#fee2e2",
                color: cancelling ? "#9ca3af" : "#dc2626", border: "none", borderRadius: 14,
                fontWeight: 700, fontSize: 14, cursor: cancelling ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8
              }}>
                <FiXCircle /> {cancelling ? "Membatalkan..." : "Batalkan Booking"}
              </button>
            )}

            {currentStatus === "selesai" && (
              <>
                <button onClick={() => setShowPayModal(true)} style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  width: "100%", padding: 14, background: "#026b5e", color: "white", border: "none",
                  borderRadius: 14, fontWeight: 700, fontSize: 14, cursor: "pointer", marginBottom: 8
                }}>
                  <FiCreditCard /> Bayar Via QRIS
                </button>
                {!booking.user_rating && (
                  <Link to={`/user/my-booking`} style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    width: "100%", padding: 14, background: "#065f46", color: "white", border: "none",
                    borderRadius: 14, fontWeight: 700, fontSize: 14, cursor: "pointer", textDecoration: "none"
                  }}>
                    <FiStar /> Berikan Ulasan
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {showPayModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }} onClick={() => setShowPayModal(false)}>
          <div style={{ background: "white", borderRadius: 24, padding: 32, maxWidth: 420, width: "90%", position: "relative" }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowPayModal(false)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer", color: "#98a2b3" }}><FiXCircle size={20} /></button>
            <h2 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 800 }}>Pembayaran QRIS</h2>
            <p style={{ fontSize: 14, color: "#667085", margin: "0 0 24px" }}>Booking #{id} — {booking.nama_tukang}</p>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#344054", marginBottom: 6 }}>Jumlah Pembayaran (Rp)</label>
              <input type="number" value={payAmount} onChange={e => setPayAmount(e.target.value)} placeholder="Masukkan nominal"
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
            <button onClick={handlePayBooking} disabled={paying} style={{
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

export default DetailBooking;
