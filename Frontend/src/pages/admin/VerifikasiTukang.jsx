import { useEffect, useState } from "react";
import { getPendingTukang, approveTukang, rejectTukang } from "../../api/adminApi";

function VerifikasiTukang() {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { load(); }, []);

    const load = async () => {
        setLoading(true);
        try { const r = await getPendingTukang(); setList(r.data); } catch (e) { console.error(e); }
        setLoading(false);
    };

    const handleApprove = async (id) => { try { await approveTukang(id); load(); } catch (e) { alert("Gagal"); } };
    const handleReject = async (id) => { try { await rejectTukang(id); load(); } catch (e) { alert("Gagal"); } };

    return (
        <div className="page-content">
            <div className="page-header"><h1>Verifikasi Tukang</h1><p className="page-subtitle">Pengajuan pendaftaran tukang baru</p></div>
            <div className="table-wrap">
                <table>
                    <thead><tr><th>Nama</th><th>Email</th><th>Kategori</th><th>Telepon</th><th>Pengalaman</th><th>Aksi</th></tr></thead>
                    <tbody>
                        {loading ? <tr><td colSpan={6}>Loading...</td></tr> : list.length === 0 ? <tr><td colSpan={6}><p className="empty-message">Tidak ada pengajuan pending</p></td></tr> : list.map(t => (
                            <tr key={t.id}>
                                <td>{t.nama}</td><td>{t.email}</td><td>{t.nama_kategori}</td><td>{t.telepon}</td><td>{t.pengalaman} th</td>
                                <td className="action-cell">
                                    <button className="btn-approve" onClick={() => handleApprove(t.id)}>Setujui</button>
                                    <button className="btn-reject" onClick={() => handleReject(t.id)}>Tolak</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
export default VerifikasiTukang;