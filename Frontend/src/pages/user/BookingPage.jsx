import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createBooking } from "../../api/bookingApi";
import { getDetailTukang } from "../../api/tukangApi";

function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tukang, setTukang] = useState(null);
  const [tanggal, setTanggal] = useState("");
  const [alamat, setAlamat] = useState("");
  const [keluhan, setKeluhan] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

 useEffect(() => {

    console.log("ID dari URL:", id);

    getDetailTukang(id)
        .then((res) => {

            console.log("Response:", res);

            setTukang(res.data);

            setLoading(false);

        })
        .catch((err) => {

            console.log("Error:", err);

            console.log("Status:", err.response?.status);

            console.log("Response Error:", err.response?.data);

        });

}, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tanggal) {
      alert("Pilih tanggal booking");
      return;
    }
    if (!alamat.trim()) {
      alert("Alamat wajib diisi");
      return;
    }

    try {
      setSubmitting(true);
      await createBooking({
        tukang_id: id,
        tanggal_booking: new Date(tanggal).toISOString(),
        alamat,
        keluhan
      });
      alert("Booking berhasil!");
      navigate("/user/my-booking");
    } catch (error) {
      alert(error.response?.data?.message || "Booking gagal");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>Memuat data tukang...</h2>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: "600px", margin: "0 auto", padding: "30px 20px",
      fontFamily: "'Inter', -apple-system, sans-serif"
    }}>
      <button onClick={() => navigate(-1)}
        style={{ background: "none", border: "none", color: "#026b5e", cursor: "pointer", fontSize: "14px", marginBottom: "20px", display: "block" }}>
        ← Kembali
      </button>

      <div style={{
        background: "white", borderRadius: "16px", padding: "28px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0"
      }}>
        <h2 style={{ margin: "0 0 6px 0", fontSize: "22px", fontWeight: "700" }}>Booking Tukang</h2>
        <p style={{ margin: "0 0 20px 0", color: "#64748b", fontSize: "14px" }}>
          Isi detail pemesanan untuk {tukang?.nama || "Tukang"}
        </p>

        {tukang && (
          <div style={{
            display: "flex", alignItems: "center", gap: "14px",
            background: "#f8fafc", padding: "14px 18px", borderRadius: "12px",
            marginBottom: "24px"
          }}>
            <div style={{
              width: "48px", height: "48px", borderRadius: "50%",
              background: "#e6f4f2", color: "#026b5e",
              display: "grid", placeItems: "center", fontWeight: "bold", fontSize: "16px"
            }}>
              {tukang.nama?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "TK"}
            </div>
            <div>
              <div style={{ fontWeight: "700", fontSize: "16px" }}>{tukang.nama}</div>
              <div style={{ fontSize: "13px", color: "#64748b" }}>
                {tukang.nama_kategori} • ⭐ {tukang.rating || "0.0"}
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "18px" }}>
            <label style={{ display: "block", fontWeight: "600", fontSize: "13px", marginBottom: "6px", color: "#334155" }}>
              Tanggal Booking <span style={{ color: "#dc2626" }}>*</span>
            </label>
            <input
              type="datetime-local"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              required
              style={{
                width: "100%", padding: "12px 14px", border: "1px solid #e2e8f0",
                borderRadius: "10px", fontSize: "14px", boxSizing: "border-box",
                outline: "none"
              }}
              onFocus={e => e.target.style.borderColor = "#0d9488"}
              onBlur={e => e.target.style.borderColor = "#e2e8f0"}
            />
          </div>

          <div style={{ marginBottom: "18px" }}>
            <label style={{ display: "block", fontWeight: "600", fontSize: "13px", marginBottom: "6px", color: "#334155" }}>
              Alamat <span style={{ color: "#dc2626" }}>*</span>
            </label>
            <textarea
              rows="3"
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              placeholder="Jl. Contoh No. 123, Kota"
              required
              style={{
                width: "100%", padding: "12px 14px", border: "1px solid #e2e8f0",
                borderRadius: "10px", fontSize: "14px", boxSizing: "border-box",
                outline: "none", resize: "vertical", fontFamily: "inherit"
              }}
              onFocus={e => e.target.style.borderColor = "#0d9488"}
              onBlur={e => e.target.style.borderColor = "#e2e8f0"}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", fontWeight: "600", fontSize: "13px", marginBottom: "6px", color: "#334155" }}>
              Keluhan / Deskripsi
            </label>
            <textarea
              rows="4"
              value={keluhan}
              onChange={(e) => setKeluhan(e.target.value)}
              placeholder="Jelaskan masalah yang ingin diperbaiki..."
              style={{
                width: "100%", padding: "12px 14px", border: "1px solid #e2e8f0",
                borderRadius: "10px", fontSize: "14px", boxSizing: "border-box",
                outline: "none", resize: "vertical", fontFamily: "inherit"
              }}
              onFocus={e => e.target.style.borderColor = "#0d9488"}
              onBlur={e => e.target.style.borderColor = "#e2e8f0"}
            />
          </div>

          <button type="submit" disabled={submitting}
            style={{
              width: "100%", padding: "14px", background: submitting ? "#94a3b8" : "linear-gradient(135deg, #026b5e, #01423a)",
              color: "white", border: "none", borderRadius: "12px", fontWeight: "700", fontSize: "15px",
              cursor: submitting ? "not-allowed" : "pointer", transition: "all 0.25s"
            }}>
            {submitting ? "Memproses..." : "Booking Sekarang"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BookingPage;
