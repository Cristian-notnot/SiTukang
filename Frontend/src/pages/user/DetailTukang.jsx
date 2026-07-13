import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getDetailTukang } from "../../api/tukangApi";
import { getReviewByTukangId } from "../../api/reviewApi";
import { FiStar, FiPhone, FiMapPin, FiTool, FiClock, FiChevronLeft, FiUser } from "react-icons/fi";

function DetailTukang() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [tukang, setTukang] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            getDetailTukang(id),
            getReviewByTukangId(id)
        ])
        .then(([tukangRes, reviewRes]) => {
            setTukang(tukangRes.data);
            setReviews(reviewRes.data || []);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }, [id]);

    const getInitials = (name) => {
        if (!name) return "TK";
        return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        return new Date(dateStr).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" });
    };

    if (loading) {
        return (
            <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f8fafc", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                <p style={{ color: "#667085" }}>Memuat data tukang...</p>
            </div>
        );
    }

    if (!tukang) {
        return (
            <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f8fafc", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
                <div style={{ textAlign: "center" }}>
                    <h2>Data tukang tidak ditemukan</h2>
                    <button onClick={() => navigate(-1)} style={{ marginTop: 16, padding: "10px 24px", background: "#026b5e", color: "white", border: "none", borderRadius: 12, fontWeight: 600, cursor: "pointer" }}>
                        Kembali
                    </button>
                </div>
            </div>
        );
    }

    const avgRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length).toFixed(1)
        : tukang.rating || "0.0";

    return (
        <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
            <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}>
                <button onClick={() => navigate(-1)} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#026b5e", fontWeight: 600, fontSize: 14, cursor: "pointer", marginBottom: 24, padding: 0 }}>
                    <FiChevronLeft /> Kembali
                </button>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "start" }}>
                    <div>
                        <div style={{ background: "white", borderRadius: 20, border: "1px solid #e4e7ec", overflow: "hidden", marginBottom: 24 }}>
                            <div style={{ padding: "28px", display: "flex", alignItems: "center", gap: 20 }}>
                                <div style={{
                                    width: 72, height: 72, borderRadius: "50%",
                                    background: "#e6f4f2", color: "#026b5e",
                                    display: "grid", placeItems: "center", fontWeight: "bold", fontSize: 24, flexShrink: 0
                                }}>
                                    {getInitials(tukang.nama)}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>{tukang.nama}</h1>
                                    <p style={{ margin: "4px 0 0", fontSize: 14, color: "#026b5e", fontWeight: 600 }}>{tukang.nama_kategori}</p>
                                </div>
                            </div>
                            <div style={{ padding: "0 28px 28px", display: "flex", gap: 24, flexWrap: "wrap" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#667085" }}>
                                    <FiStar style={{ color: "#f59e0b" }} /> <strong style={{ color: "#101828" }}>{avgRating}</strong> ({reviews.length} ulasan)
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#667085" }}>
                                    <FiTool /> <strong style={{ color: "#101828" }}>{tukang.pengalaman || 0}</strong> thn pengalaman
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#667085" }}>
                                    <FiPhone /> {tukang.telepon || "-"}
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#667085" }}>
                                    <FiMapPin /> {tukang.alamat || "-"}
                                </div>
                            </div>
                        </div>

                        <div style={{ background: "white", borderRadius: 20, border: "1px solid #e4e7ec", overflow: "hidden", marginBottom: 24 }}>
                            <div style={{ padding: "24px 28px" }}>
                                <h2 style={{ fontSize: 14, fontWeight: 700, color: "#667085", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 12px" }}>Deskripsi</h2>
                                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: "#344054" }}>
                                    {tukang.deskripsi || "Tidak ada deskripsi"}
                                </p>
                            </div>
                        </div>

                        <div style={{ background: "white", borderRadius: 20, border: "1px solid #e4e7ec", overflow: "hidden" }}>
                            <div style={{ padding: "24px 28px", borderBottom: "1px solid #e4e7ec", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <h2 style={{ fontSize: 14, fontWeight: 700, color: "#667085", textTransform: "uppercase", letterSpacing: "0.5px", margin: 0 }}>Ulasan ({reviews.length})</h2>
                            </div>
                            {reviews.length === 0 ? (
                                <div style={{ padding: "40px 28px", textAlign: "center", color: "#98a2b3", fontSize: 14 }}>
                                    Belum ada ulasan untuk tukang ini.
                                </div>
                            ) : (
                                <div style={{ padding: "16px 28px" }}>
                                    {reviews.map((review) => (
                                        <div key={review.id} style={{ padding: "16px 0", borderBottom: "1px solid #f3f4f6" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                                                <div style={{
                                                    width: 36, height: 36, borderRadius: "50%",
                                                    background: "#e6f4f2", color: "#026b5e",
                                                    display: "grid", placeItems: "center", fontWeight: "bold", fontSize: 13, flexShrink: 0
                                                }}>
                                                    {getInitials(review.nama_user)}
                                                </div>
                                                <div>
                                                    <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{review.nama_user}</p>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                                                        {[1, 2, 3, 4, 5].map(n => (
                                                            <FiStar key={n} style={{ color: n <= Number(review.rating) ? "#f59e0b" : "#d1d5db", fontSize: 13 }} fill={n <= Number(review.rating) ? "#f59e0b" : "none"} />
                                                        ))}
                                                    </div>
                                                </div>
                                                <span style={{ marginLeft: "auto", fontSize: 11, color: "#d1d5db" }}>{formatDate(review.created_at)}</span>
                                            </div>
                                            {review.komentar && <p style={{ margin: 0, fontSize: 14, color: "#667085", lineHeight: 1.5 }}>"{review.komentar}"</p>}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <div style={{ background: "white", borderRadius: 20, border: "1px solid #e4e7ec", overflow: "hidden", position: "sticky", top: 32 }}>
                            <div style={{ padding: "24px" }}>
                                <div style={{ textAlign: "center", marginBottom: 20 }}>
                                    <div style={{ fontSize: 48, fontWeight: 800, color: "#f59e0b" }}>{avgRating}</div>
                                    <div style={{ display: "flex", justifyContent: "center", gap: 2, margin: "4px 0" }}>
                                        {[1, 2, 3, 4, 5].map(n => (
                                            <FiStar key={n} style={{ color: n <= Math.round(Number(avgRating)) ? "#f59e0b" : "#d1d5db", fontSize: 18 }} fill={n <= Math.round(Number(avgRating)) ? "#f59e0b" : "none"} />
                                        ))}
                                    </div>
                                    <p style={{ margin: "4px 0 0", fontSize: 13, color: "#667085" }}>{reviews.length} ulasan</p>
                                </div>

                                <Link to={`/user/booking/${tukang.id}`} style={{
                                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                                    width: "100%", padding: 14, background: "#026b5e", color: "white",
                                    border: "none", borderRadius: 12, fontWeight: 700, fontSize: 15,
                                    cursor: "pointer", textDecoration: "none", marginBottom: 12
                                }}>
                                    Booking Sekarang
                                </Link>

                                <Link to={`/user/booking/${tukang.id}`} style={{
                                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                                    width: "100%", padding: 12, background: "white", color: "#026b5e",
                                    border: "1px solid #026b5e", borderRadius: 12, fontWeight: 600, fontSize: 13,
                                    cursor: "pointer", textDecoration: "none"
                                }}>
                                    Hubungi Tukang
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetailTukang;