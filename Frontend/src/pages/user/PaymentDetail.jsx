import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getPaymentByInvoice } from "../../api/paymentApi";
import {
    FiArrowLeft, FiClock, FiCheckCircle, FiXCircle, FiAlertCircle,
    FiCreditCard, FiCalendar, FiUser, FiTool, FiMapPin, FiCopy, FiPrinter
} from "react-icons/fi";

const paymentStatusConfig = {
    pending: { label: "Menunggu Pembayaran", color: "#f59e0b", bg: "#fef3c7", icon: FiClock },
    paid: { label: "Lunas", color: "#10b981", bg: "#d1fae5", icon: FiCheckCircle },
    failed: { label: "Gagal", color: "#ef4444", bg: "#fee2e2", icon: FiXCircle },
    expired: { label: "Kadaluarsa", color: "#6b7280", bg: "#f3f4f6", icon: FiAlertCircle },
    refund: { label: "Refund", color: "#8b5cf6", bg: "#ede9fe", icon: FiAlertCircle },
};

function PaymentDetail() {
    const { invoiceNumber } = useParams();
    const navigate = useNavigate();
    const [payment, setPayment] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getPaymentByInvoice(invoiceNumber)
            .then(res => setPayment(res.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [invoiceNumber]);

    const handlePrint = () => {
        window.print();
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        return new Date(dateStr).toLocaleDateString("id-ID", {
            weekday: "long", day: "numeric", month: "long", year: "numeric",
            hour: "2-digit", minute: "2-digit"
        });
    };

    if (loading) {
        return (
            <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f8fafc" }}>
                <p style={{ color: "#667085" }}>Memuat data pembayaran...</p>
            </div>
        );
    }

    if (!payment) {
        return (
            <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f8fafc" }}>
                <div style={{ textAlign: "center" }}>
                    <FiAlertCircle style={{ fontSize: 48, color: "#ef4444", marginBottom: 16 }} />
                    <h2>Data tidak ditemukan</h2>
                    <button onClick={() => navigate("/user/riwayat-pembayaran")} style={{ marginTop: 16, padding: "10px 24px", background: "#026b5e", color: "white", border: "none", borderRadius: 12, fontWeight: 600, cursor: "pointer" }}>
                        Kembali
                    </button>
                </div>
            </div>
        );
    }

    const config = paymentStatusConfig[payment.payment_status] || paymentStatusConfig.pending;
    const Icon = config.icon;

    return (
        <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
            <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                    <button onClick={() => navigate("/user/riwayat-pembayaran")} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#026b5e", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
                        <FiArrowLeft /> Kembali
                    </button>
                    <button onClick={handlePrint} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "white", border: "1px solid #e4e7ec", borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: "pointer", color: "#344054" }}>
                        <FiPrinter /> Cetak
                    </button>
                </div>

                <div id="invoice-content" style={{ background: "white", borderRadius: 20, border: "1px solid #e4e7ec", overflow: "hidden" }}>
                    <div style={{ padding: "32px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
                            <div>
                                <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#026b5e" }}>INVOICE</h1>
                                <p style={{ margin: "4px 0 0", fontSize: 13, color: "#667085" }}>
                                    #{payment.invoice_number}
                                </p>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 20, background: config.bg }}>
                                <Icon style={{ color: config.color, fontSize: 16 }} />
                                <span style={{ fontWeight: 700, fontSize: 13, color: config.color }}>{config.label}</span>
                            </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
                            <div>
                                <h3 style={{ fontSize: 12, fontWeight: 700, color: "#98a2b3", textTransform: "uppercase", margin: "0 0 12px" }}>Pelanggan</h3>
                                <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 600 }}>{payment.nama_user}</p>
                            </div>
                            <div>
                                <h3 style={{ fontSize: 12, fontWeight: 700, color: "#98a2b3", textTransform: "uppercase", margin: "0 0 12px" }}>Tukang</h3>
                                <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 600 }}>{payment.nama_tukang}</p>
                                <p style={{ margin: 0, fontSize: 13, color: "#667085" }}>{payment.nama_kategori}</p>
                            </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32, padding: 20, background: "#f8fafc", borderRadius: 12 }}>
                            <div>
                                <p style={{ margin: "0 0 4px", fontSize: 12, color: "#98a2b3", fontWeight: 600 }}>Tanggal Booking</p>
                                <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{formatDate(payment.tanggal_booking)}</p>
                            </div>
                            <div>
                                <p style={{ margin: "0 0 4px", fontSize: 12, color: "#98a2b3", fontWeight: 600 }}>Tanggal Pembayaran</p>
                                <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{formatDate(payment.transaction_time) || formatDate(payment.created_at)}</p>
                            </div>
                            <div style={{ gridColumn: "1 / -1" }}>
                                <p style={{ margin: "0 0 4px", fontSize: 12, color: "#98a2b3", fontWeight: 600 }}>Alamat</p>
                                <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{payment.alamat}</p>
                            </div>
                        </div>

                        <div style={{ marginBottom: 32 }}>
                            <h3 style={{ fontSize: 12, fontWeight: 700, color: "#98a2b3", textTransform: "uppercase", margin: "0 0 12px" }}>Rincian Pembayaran</h3>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr style={{ borderBottom: "1px solid #e4e7ec" }}>
                                        <th style={{ textAlign: "left", padding: "8px 12px", fontSize: 12, fontWeight: 700, color: "#98a2b3", textTransform: "uppercase" }}>Deskripsi</th>
                                        <th style={{ textAlign: "right", padding: "8px 12px", fontSize: 12, fontWeight: 700, color: "#98a2b3", textTransform: "uppercase" }}>Jumlah</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr style={{ borderBottom: "1px solid #e4e7ec" }}>
                                        <td style={{ padding: "12px", fontSize: 14 }}>
                                            Jasa Tukang - {payment.nama_kategori}
                                            <br />
                                            <span style={{ fontSize: 12, color: "#667085" }}>Booking #{payment.booking_id}</span>
                                        </td>
                                        <td style={{ padding: "12px", fontSize: 14, fontWeight: 600, textAlign: "right" }}>
                                            Rp {parseFloat(payment.amount).toLocaleString()}
                                        </td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td style={{ padding: "12px", fontSize: 14, fontWeight: 700 }}>Total</td>
                                        <td style={{ padding: "12px", fontSize: 18, fontWeight: 800, textAlign: "right", color: "#026b5e" }}>
                                            Rp {parseFloat(payment.amount).toLocaleString()}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        {payment.payment_method && (
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, padding: 20, background: "#f8fafc", borderRadius: 12 }}>
                                <div>
                                    <p style={{ margin: "0 0 4px", fontSize: 12, color: "#98a2b3", fontWeight: 600 }}>Metode Pembayaran</p>
                                    <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{payment.payment_method || "-"}</p>
                                </div>
                                {payment.payment_channel && (
                                    <div>
                                        <p style={{ margin: "0 0 4px", fontSize: 12, color: "#98a2b3", fontWeight: 600 }}>Channel</p>
                                        <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{payment.payment_channel}</p>
                                    </div>
                                )}
                                <div>
                                    <p style={{ margin: "0 0 4px", fontSize: 12, color: "#98a2b3", fontWeight: 600 }}>Transaction ID</p>
                                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, wordBreak: "break-all" }}>{payment.transaction_id || "-"}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaymentDetail;
