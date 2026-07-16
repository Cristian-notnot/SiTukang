import ghostBooking from "../../assets/gambar/ghost.image.png";
import "../../assets/css/MyBooking.css";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getMyBooking, cancelBooking } from "../../api/bookingApi";
import { createReview, getReviewByBooking } from "../../api/reviewApi";

function MyBooking() {
    const navigate = useNavigate();
    const [booking, setBooking] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reviewForm, setReviewForm] = useState({});

    useEffect(() => {
        loadBooking();
    }, []);

    const loadBooking = async () => {
        setLoading(true);
        try {
            const response = await getMyBooking();
            setBooking(response.data);
            const revMap = {};
            for (const b of response.data) {
                if (b.status === "selesai") {
                    try {
                        const r = await getReviewByBooking(b.id);
                        if (r.data) revMap[b.id] = r.data;
                    } catch (e) { /* no review yet */ }
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
            loadBooking();
        } catch (e) {
            alert("Gagal membatalkan");
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
            alert("Rating wajib diisi");
            return;
        }
        try {
            await createReview({
                booking_id: bookingId,
                rating: data.rating,
                komentar: data.komentar || ""
            });
            alert("Review berhasil dikirim!");
            loadBooking();
        } catch (e) {
            alert(e?.response?.data?.message || "Gagal mengirim review");
        }
    };

    if (loading) return <h2>Loading...</h2>;

    return (
        <div className="booking-page">
            <div className="booking-header">
                <div>
                    <span className="booking-tag">Dashboard Customer</span>
                    <h1>Booking Saya</h1>
                    <p className="booking-description">
                        Kelola semua pemesanan tukang Anda dengan mudah.
                    </p>
                </div>

                <button
                    className="booking-top-button"
                    onClick={() => navigate("/user")}
                >
                    ← Kembali ke Dashboard
                </button>
            </div>

            {booking.length === 0 ? (
                <div className="booking-empty">
                    <div className="booking-empty-left">
                        <h2>Belum ada booking</h2>

                        <p>
                            Anda belum memiliki riwayat pemesanan tukang.
                            Cari tukang terbaik dan lakukan booking pertama Anda.
                        </p>

                        <div className="booking-empty-actions">
                            <button
                                className="primary-btn"
                                onClick={() => navigate("/user")}
                            >
                                Cari Tukang
                            </button>

                            <button
                                className="secondary-btn"
                                onClick={() => navigate("/layanan")}
                            >
                                Lihat Layanan
                            </button>
                        </div>
                    </div>

                    <div className="booking-empty-center">
                        <img
                            src={ghostBooking}
                            alt="No Booking"
                            className="booking-empty-image"
                        />
                    </div>
                </div>
            ) : (
                booking.map((item) => {
                    const hasReview = reviewForm[item.id] && reviewForm[item.id].id;
                    return (
                        <div
                            key={item.id}
                            className={`booking-card ${item.status}`}
                        >
                            <h3>{item.nama_tukang}</h3>
                            <p><strong>Alamat:</strong> {item.alamat}</p>
                            <p><strong>Keluhan:</strong> {item.keluhan}</p>
                            <p><strong>Status:</strong> <span className={`badge badge-${item.status}`}>
                                {item.status === "pending" ? "Menunggu" :
                                 item.status === "diterima" ? "Diterima" :
                                 item.status === "waiting_payment" ? "Menunggu Pembayaran" :
                                 item.status === "paid" ? "Lunas" :
                                 item.status === "dikerjakan" ? "Dikerjakan" :
                                 item.status === "selesai" ? "Selesai" :
                                 item.status === "ditolak" ? "Ditolak" :
                                 item.status === "dibatalkan" ? "Dibatalkan" : item.status}
                            </span></p>
                            <p><strong>Tanggal:</strong> {new Date(item.tanggal_booking).toLocaleString()}</p>

                            <Link to={`/user/booking/detail/${item.id}`} style={{ display: "inline-block", marginTop: 8, color: "#026b5e", fontWeight: 600, fontSize: 13 }}>
                                Lihat Detail →
                            </Link>

                            {item.status === "pending" && (
                                <button onClick={() => handleCancel(item.id)} style={{ color: "red", marginTop: 8 }}>Batalkan</button>
                            )}

                            {item.status === "selesai" && !hasReview && (
                                <div className="review-box">
                                    <h4>Berikan Review</h4>
                                    <select
                                        className="review-select"
                                        value={reviewForm[item.id]?.rating || ""}
                                        onChange={e => handleReviewChange(item.id, "rating", e.target.value)}
                                    >
                                        <option value="">Pilih Rating</option>
                                        {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} ★</option>)}
                                    </select>
                                    <br />
                                    <textarea
                                        className="review-textarea"
                                        placeholder="Komentar (opsional)"
                                        value={reviewForm[item.id]?.komentar || ""}
                                        onChange={e => handleReviewChange(item.id, "komentar", e.target.value)}
                                        rows={3}
                                    />
                                    <br />
                                    <button
                                        className="primary-btn"
                                        onClick={() => handleSubmitReview(item.id)}
                                    >
                                        Kirim Review
                                    </button>
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

export default MyBooking;