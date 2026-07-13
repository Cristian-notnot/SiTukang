import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { getProfile, updateProfile } from "../../api/userApi";
import { FiUser, FiMail, FiLock, FiSave, FiEye, FiEyeOff } from "react-icons/fi";

function Pengaturan() {
  const navigate = useNavigate();
  const { user, login } = useContext(AuthContext);

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    getProfile()
      .then(res => {
        const data = res.data;
        setNama(data.nama || "");
        setEmail(data.email || "");
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (newPassword && newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Konfirmasi password tidak cocok" });
      return;
    }
    if (newPassword && newPassword.length < 6) {
      setMessage({ type: "error", text: "Password baru minimal 6 karakter" });
      return;
    }

    setSaving(true);
    try {
      const payload = {};
      if (nama !== user?.nama) payload.nama = nama;
      if (email !== user?.email) payload.email = email;
      if (newPassword) {
        payload.current_password = currentPassword;
        payload.new_password = newPassword;
      }
      await updateProfile(payload);
      setMessage({ type: "success", text: "Profil berhasil diperbarui!" });
      const updatedUser = { ...user, nama, email };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      if (login) login(updatedUser, localStorage.getItem("token"));
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Gagal memperbarui profil" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f8fafc" }}>
        <p style={{ color: "#667085" }}>Memuat...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "32px 20px" }}>
        <h1 style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 800 }}>Pengaturan</h1>
        <p style={{ margin: "0 0 24px", fontSize: 14, color: "#667085" }}>Kelola informasi profil dan keamanan akun Anda.</p>

        <form onSubmit={handleSubmit} style={{ background: "white", borderRadius: 20, border: "1px solid #e4e7ec", padding: 28 }}>
          {message.text && (
            <div style={{
              padding: "12px 16px", borderRadius: 12, marginBottom: 20, fontSize: 14, fontWeight: 600,
              background: message.type === "success" ? "#d1fae5" : "#fee2e2",
              color: message.type === "success" ? "#065f46" : "#991b1b"
            }}>
              {message.text}
            </div>
          )}

          <h2 style={{ fontSize: 14, fontWeight: 700, color: "#667085", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 16px" }}>
            <FiUser style={{ marginRight: 8 }} /> Informasi Profil
          </h2>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#344054", marginBottom: 6 }}>Nama Lengkap</label>
            <input type="text" value={nama} onChange={e => setNama(e.target.value)}
              style={{ width: "100%", padding: "12px 14px", border: "1px solid #e4e7ec", borderRadius: 12, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#344054", marginBottom: 6 }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              style={{ width: "100%", padding: "12px 14px", border: "1px solid #e4e7ec", borderRadius: 12, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
          </div>

          <hr style={{ border: "none", borderTop: "1px solid #e4e7ec", margin: "0 0 24px" }} />

          <h2 style={{ fontSize: 14, fontWeight: 700, color: "#667085", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 16px" }}>
            <FiLock style={{ marginRight: 8 }} /> Ubah Password
          </h2>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#344054", marginBottom: 6 }}>Password Saat Ini</label>
            <div style={{ position: "relative" }}>
              <input type={showPassword ? "text" : "password"} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}
                style={{ width: "100%", padding: "12px 14px", paddingRight: 44, border: "1px solid #e4e7ec", borderRadius: 12, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#98a2b3", padding: 0 }}>
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#344054", marginBottom: 6 }}>Password Baru</label>
            <input type={showPassword ? "text" : "password"} value={newPassword} onChange={e => setNewPassword(e.target.value)}
              placeholder="Kosongkan jika tidak ingin mengubah"
              style={{ width: "100%", padding: "12px 14px", border: "1px solid #e4e7ec", borderRadius: 12, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#344054", marginBottom: 6 }}>Konfirmasi Password Baru</label>
            <input type={showPassword ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Ketik ulang password baru"
              style={{ width: "100%", padding: "12px 14px", border: "1px solid #e4e7ec", borderRadius: 12, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
          </div>

          <button type="submit" disabled={saving} style={{
            width: "100%", padding: 14, background: saving ? "#94a3b8" : "#026b5e", color: "white", border: "none",
            borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: saving ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8
          }}>
            <FiSave /> {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Pengaturan;
