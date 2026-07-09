import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyBooking, cancelBooking } from "../../api/bookingApi";
import { createReview, getReviewByBooking } from "../../api/reviewApi";

function MyBooking() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
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
        <div style={{ padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1>Booking Saya</h1>
                <button onClick={() => navigate("/user")} style={{ padding: "8px 16px" }}>Cari Tukang</button>
            </div>

            {booking.length === 0 ? <p>Belum ada booking.</p> : (
                booking.map((item) => {
                    const hasReview = reviewForm[item.id] && reviewForm[item.id].id;
                    return (
                        <div key={item.id} style={{
                            border: "1px solid #ddd", padding: "15px", marginBottom: "10px", borderRadius: "10px",
                            backgroundColor: item.status === "selesai" ? "#f0fff0" : "#fff"
                        }}>
                            <h3>{item.nama_tukang}</h3>
                            <p><strong>Alamat:</strong> {item.alamat}</p>
                            <p><strong>Keluhan:</strong> {item.keluhan}</p>
                            <p><strong>Status:</strong> <span className={`badge badge-${item.status}`}>{item.status}</span></p>
                            <p><strong>Tanggal:</strong> {new Date(item.tanggal_booking).toLocaleString()}</p>

                            {item.status === "pending" && (
                                <button onClick={() => handleCancel(item.id)} style={{ color: "red", marginTop: 8 }}>Batalkan</button>
                            )}

                            {item.status === "selesai" && !hasReview && (
                                <div style={{ marginTop: 12, padding: 12, backgroundColor: "#f9f9f9", borderRadius: 8 }}>
                                    <h4>Berikan Review</h4>
                                    <select
                                        value={reviewForm[item.id]?.rating || ""}
                                        onChange={e => handleReviewChange(item.id, "rating", e.target.value)}
                                        style={{ marginBottom: 8, padding: 6 }}
                                    >
                                        <option value="">Pilih Rating</option>
                                        {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} ★</option>)}
                                    </select>
                                    <br />
                                    <textarea
                                        placeholder="Komentar (opsional)"
                                        value={reviewForm[item.id]?.komentar || ""}
                                        onChange={e => handleReviewChange(item.id, "komentar", e.target.value)}
                                        rows={3}
                                        style={{ width: "100%", marginBottom: 8 }}
                                    />
                                    <br />
                                    <button onClick={() => handleSubmitReview(item.id)}>Kirim Review</button>
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