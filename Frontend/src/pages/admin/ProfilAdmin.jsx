import { useEffect, useState, useContext } from "react";
import { getAdminProfile, updateAdminProfile } from "../../api/adminApi";
import { AuthContext } from "../../context/AuthContext";

function ProfilAdmin() {
    const { user, login } = useContext(AuthContext);
    const [data, setData] = useState({ nama: "", email: "" });
    const [loading, setLoading] = useState(true);

    useEffect(() => { load(); }, []);

    const load = async () => {
        setLoading(true);
        try { const r = await getAdminProfile(); if (r.data) setData({ ...r.data, role: r.data.role }); } catch (e) { console.error(e); }
        setLoading(false);
    };

    const handleSave = async () => {
        try {
            await updateAdminProfile(data);
            login({ ...user, ...data }, localStorage.getItem("token"));
            alert("Profil diupdate!");
        } catch (e) { alert("Gagal"); }
    };

    if (loading) return <div className="page-content"><div className="loading-state"><div className="spinner"></div></div></div>;

    return (
        <div className="page-content">
            <div className="page-header"><h1>Profil Admin</h1></div>
            <div className="profile-card">
                <div className="profile-avatar">{data.nama?.charAt(0).toUpperCase() || "A"}</div>
                <div className="form-card">
                    <div className="form-group">
                        <label>Nama</label>
                        <input type="text" value={data.nama} onChange={e => setData({ ...data, nama: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" value={data.email} onChange={e => setData({ ...data, email: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>Role</label>
                        <input type="text" value={data.role} disabled />
                    </div>
                    <button className="btn btn-primary btn-lg" onClick={handleSave}>Update Profil</button>
                </div>
            </div>
        </div>
    );
}
export default ProfilAdmin;