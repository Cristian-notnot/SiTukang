import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { createPayment, getPaymentByBooking, getPaymentByInvoice } from "../../api/paymentApi";
import { getBookingById } from "../../api/bookingApi";
import {
    FiArrowLeft, FiCreditCard, FiClock, FiCheckCircle,
    FiAlertCircle, FiCopy, FiExternalLink, FiXCircle
} from "react-icons/fi";

const paymentStatusConfig = {
    pending: { label: "Menunggu Pembayaran", color: "#f59e0b", bg: "#fef3c7", icon: FiClock },
    paid: { label: "Lunas", color: "#10b981", bg: "#d1fae5", icon: FiCheckCircle },
    failed: { label: "Gagal", color: "#ef4444", bg: "#fee2e2", icon: FiXCircle },
    expired: { label: "Kadaluarsa", color: "#6b7280", bg: "#f3f4f6", icon: FiAlertCircle },
    refund: { label: "Refund", color: "#8b5cf6", bg: "#ede9fe", icon: FiAlertCircle },
};

function PaymentPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const statusParam = searchParams.get("status");

    const [booking, setBooking] = useState(null);
    const [payment, setPayment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        loadData();
    }, [id]);

    useEffect(() => {
        if (payment && payment.snap_token && payment.payment_status === "pending") {
            const midtransScript = document.createElement("script");
            midtransScript.src = "https://app.sandbox.midtrans.com/snap/snap.js";
            midtransScript.setAttribute("data-client-key", import.meta.env.VITE_MIDTRANS_CLIENT_KEY || "SB-Mid-client-your_client_key_here");
            document.body.appendChild(midtransScript);

            const snapContainer = document.getElementById("snap-container");

            if (window.snap && snapContainer) {
                window.snap.embed(payment.snap_token, {
                    embedId: "snap-container",
                    onSuccess: () => {
                        window.location.href = `/user/payment/finish?invoice=${payment.invoice_number}`;
                    },
                    onPending: () => {
                        window.location.href = `/user/payment/pending?invoice=${payment.invoice_number}`;
                    },
                    onError: () => {
                        window.location.href = `/user/payment/error?invoice=${payment.invoice_number}`;
                    },
                    onClose: () => {
                    }
                });
            }

            return () => {
                const script = document.querySelector(`script[src="${midtransScript.src}"]`);
                if (script) document.body.removeChild(script);
            };
        }
    }, [payment]);

    const loadData = async () => {
        setLoading(true);
        try {
            const bookingRes = await getBookingById(id);
            setBooking(bookingRes.data);

            try {
                const payRes = await getPaymentByBooking(id);
                setPayment(payRes.data);
            } catch (e) {
                setPayment(null);
            }
        } catch (e) {
            setError("Booking tidak ditemukan");
        }
        setLoading(false);
    };

    const handleCreatePayment = async () => {
        setCreating(true);
        setError("");
        try {
            const res = await createPayment(id);
            if (res.success) {
                setPayment(res.data);
                window.snap && window.snap.pay(res.data.snap_token);
            }
        } catch (e) {
            setError(e?.response?.data?.message || "Gagal membuat pembayaran");
        }
        setCreating(false);
    };

    const handlePayNow = () => {
        if (window.snap && payment?.snap_token) {
            window.snap.pay(payment.snap_token);
        } else {
            loadData();
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            alert("Teks berhasil disalin");
        });
    };

    if (loading) {
        return (
            <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f8fafc" }}>
                <p style={{ color: "#667085" }}>Memuat...</p>
            </div>
        );
    }

    if (error && !booking) {
        return (
            <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f8fafc" }}>
                <div style={{ textAlign: "center" }}>
                    <FiAlertCircle style={{ fontSize: 48, color: "#ef4444", marginBottom: 16 }} />
                    <h2>{error}</h2>
                    <button onClick={() => navigate("/user/my-booking")} style={{ marginTop: 16, padding: "10px 24px", background: "#026b5e", color: "white", border: "none", borderRadius: 12, fontWeight: 600, cursor: "pointer" }}>
                        Kembali
                    </button>
                </div>
            </div>
        );
    }

    const payConfig = payment ? paymentStatusConfig[payment.payment_status] || paymentStatusConfig.pending : null;
    const PayIcon = payConfig?.icon || FiClock;

    return (
        <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
            <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 20px" }}>
                <button onClick={() => navigate(`/user/booking/detail/${id}`)} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#026b5e", fontWeight: 600, fontSize: 14, cursor: "pointer", marginBottom: 24 }}>
                    <FiArrowLeft /> Kembali ke Detail Booking
                </button>

                <div style={{ background: "white", borderRadius: 20, border: "1px solid #e4e7ec", overflow: "hidden", marginBottom: 24 }}>
                    <div style={{ padding: "24px 28px", borderBottom: "1px solid #e4e7ec" }}>
                        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Pembayaran</h1>
                        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#667085" }}>
                            Booking #{booking.id} — {booking.nama_tukang}
                        </p>
                    </div>

                    <div style={{ padding: "24px 28px" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
                            <div>
                                <p style={{ margin: "0 0 4px", fontSize: 12, color: "#98a2b3", fontWeight: 600 }}>Layanan</p>
                                <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{booking.nama_kategori}</p>
                            </div>
                            <div>
                                <p style={{ margin: "0 0 4px", fontSize: 12, color: "#98a2b3", fontWeight: 600 }}>Tukang</p>
                                <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{booking.nama_tukang}</p>
                            </div>
                            <div>
                                <p style={{ margin: "0 0 4px", fontSize: 12, color: "#98a2b3", fontWeight: 600 }}>Tanggal Booking</p>
                                <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>
                                    {new Date(booking.tanggal_booking).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                                </p>
                            </div>
                            <div>
                                <p style={{ margin: "0 0 4px", fontSize: 12, color: "#98a2b3", fontWeight: 600 }}>Alamat</p>
                                <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{booking.alamat}</p>
                            </div>
                        </div>

                        <div style={{ borderTop: "1px solid #e4e7ec", paddingTop: 20 }}>
                            {payment && (
                                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, padding: "12px 16px", borderRadius: 12, background: payConfig?.bg || "#f3f4f6" }}>
                                    <PayIcon style={{ fontSize: 20, color: payConfig?.color }} />
                                    <span style={{ fontWeight: 700, fontSize: 14, color: payConfig?.color }}>
                                        {payConfig?.label || payment.payment_status}
                                    </span>
                                    {payment.invoice_number && (
                                        <span style={{ marginLeft: "auto", fontSize: 12, color: "#667085" }}>
                                            {payment.invoice_number}
                                        </span>
                                    )}
                                </div>
                            )}

                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                                <span style={{ fontSize: 14, color: "#344054", fontWeight: 600 }}>Total Pembayaran</span>
                                <span style={{ fontSize: 24, fontWeight: 800, color: "#026b5e" }}>
                                    Rp {(payment?.amount || 150000).toLocaleString()}
                                </span>
                            </div>
                            <p style={{ margin: "0 0 24px", fontSize: 12, color: "#98a2b3" }}>
                                *Harga layanan tukang sudah termasuk biaya jasa
                            </p>

                            {!payment && booking.status === "waiting_payment" && (
                                <button onClick={handleCreatePayment} disabled={creating} style={{
                                    width: "100%", padding: 14, background: creating ? "#94a3b8" : "#026b5e",
                                    color: "white", border: "none", borderRadius: 14, fontWeight: 700, fontSize: 15,
                                    cursor: creating ? "not-allowed" : "pointer", display: "flex", alignItems: "center",
                                    justifyContent: "center", gap: 8
                                }}>
                                    <FiCreditCard size={18} />
                                    {creating ? "Memproses..." : "Bayar Sekarang"}
                                </button>
                            )}

                            {payment && payment.payment_status === "pending" && (
                                <div>
                                    <div id="snap-container" style={{ width: "100%", minHeight: 400, marginBottom: 16 }}></div>
                                    {!payment.snap_token && (
                                        <button onClick={handlePayNow} style={{
                                            width: "100%", padding: 14, background: "#026b5e", color: "white",
                                            border: "none", borderRadius: 14, fontWeight: 700, fontSize: 15, cursor: "pointer"
                                        }}>
                                            Lanjutkan Pembayaran
                                        </button>
                                    )}
                                </div>
                            )}

                            {payment && payment.payment_status === "paid" && (
                                <div style={{ textAlign: "center", padding: 32 }}>
                                    <FiCheckCircle style={{ fontSize: 64, color: "#10b981", marginBottom: 16 }} />
                                    <h2 style={{ margin: "0 0 8px", color: "#10b981" }}>Pembayaran Berhasil!</h2>
                                    <p style={{ color: "#667085", marginBottom: 20 }}>
                                        Invoice: {payment.invoice_number}
                                    </p>
                                    <button onClick={() => navigate(`/user/payment/invoice/${payment.invoice_number}`)} style={{
                                        padding: "12px 24px", background: "#026b5e", color: "white", border: "none",
                                        borderRadius: 12, fontWeight: 600, cursor: "pointer"
                                    }}>
                                        Lihat Invoice
                                    </button>
                                </div>
                            )}

                            {payment && (payment.payment_status === "failed" || payment.payment_status === "expired") && (
                                <div style={{ textAlign: "center", padding: 32 }}>
                                    <FiAlertCircle style={{ fontSize: 64, color: "#ef4444", marginBottom: 16 }} />
                                    <h2 style={{ margin: "0 0 8px", color: "#ef4444" }}>
                                        {payment.payment_status === "expired" ? "Pembayaran Kadaluarsa" : "Pembayaran Gagal"}
                                    </h2>
                                    <p style={{ color: "#667085", marginBottom: 20 }}>
                                        Silakan coba lagi untuk melakukan pembayaran
                                    </p>
                                    <button onClick={handleCreatePayment} style={{
                                        padding: "12px 24px", background: "#026b5e", color: "white", border: "none",
                                        borderRadius: 12, fontWeight: 600, cursor: "pointer"
                                    }}>
                                        Bayar Ulang
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {error && (
                    <div style={{ padding: "12px 16px", background: "#fee2e2", borderRadius: 12, color: "#dc2626", fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}

export default PaymentPage;
