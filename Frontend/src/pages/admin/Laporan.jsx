import { useEffect, useState, useCallback } from "react";
import { getLaporanPendapatan, getLaporanTukang, getLaporanCustomer, getLaporanPembayaran, getLaporanKategori, getLaporanWilayah } from "../../api/adminApi";
import Modal from "../../components/admin/Modal";
import { TrendingUp, Users, Wrench, CreditCard, Grid3X3, MapPin, Eye, Download } from "lucide-react";

const REPORTS = [
    { key: "pendapatan", icon: <TrendingUp size={22} color="#fff" />, title: "Laporan Pendapatan Bulanan", desc: "Ringkasan pendapatan platform per bulan", color: "#14b8a6", dark: "#0f766c" },
    { key: "tukang", icon: <Wrench size={22} color="#fff" />, title: "Aktivitas Tukang", desc: "Statistik performa dan aktivitas tukang", color: "#3b82f6", dark: "#1d4ed8" },
    { key: "customer", icon: <Users size={22} color="#fff" />, title: "Customer", desc: "Pertumbuhan dan demografi pengguna", color: "#8b5cf6", dark: "#6d28d9" },
    { key: "pembayaran", icon: <CreditCard size={22} color="#fff" />, title: "Pembayaran", desc: "Rekap transaksi dan status pembayaran", color: "#10b981", dark: "#059669" },
    { key: "kategori", icon: <Grid3X3 size={22} color="#fff" />, title: "Kategori", desc: "Distribusi kategori jasa terpopuler", color: "#f59e0b", dark: "#d97706" },
    { key: "wilayah", icon: <MapPin size={22} color="#fff" />, title: "Wilayah", desc: "Sebaran pengguna dan tukang per kota", color: "#ec4899", dark: "#db2777" },
];

const API_MAP = {
    pendapatan: getLaporanPendapatan,
    tukang: getLaporanTukang,
    customer: getLaporanCustomer,
    pembayaran: getLaporanPembayaran,
    kategori: getLaporanKategori,
    wilayah: getLaporanWilayah,
};

function reportRows(key, data) {
    if (!data) return [];
    switch (key) {
        case "pendapatan": {
            const rows = (data.bulanan || []).map(r => ({
                label: r.bulan,
                value: `Rp${Number(r.pemasukan || 0).toLocaleString("id-ID")} (masuk) / Rp${Number(r.pengeluaran || 0).toLocaleString("id-ID")} (keluar)`
            }));
            rows.push({ label: "Total Pemasukan", value: `Rp${Number(data.total?.pemasukan || 0).toLocaleString("id-ID")}`, bold: true });
            rows.push({ label: "Total Pengeluaran", value: `Rp${Number(data.total?.pengeluaran || 0).toLocaleString("id-ID")}`, bold: true });
            return rows;
        }
        case "tukang":
            return [
                { label: "Total Tukang", value: data.total ?? 0 },
                { label: "Tukang Aktif", value: data.aktif ?? 0 },
                { label: "Menunggu Verifikasi", value: data.pending ?? 0 },
                { label: "Rata-rata Rating", value: data.rating_rata ?? "-" },
            ];
        case "customer":
            return [
                { label: "Total Pengguna", value: data.total ?? 0 },
                { label: "Pengguna Biasa", value: data.user ?? 0 },
                { label: "Tukang", value: data.tukang ?? 0 },
                { label: "Mendaftar Minggu Ini", value: data.minggu_ini ?? 0 },
            ];
        case "pembayaran":
            return [
                { label: "Total Transaksi", value: data.total_transaksi ?? 0 },
                { label: "Total Pemasukan", value: `Rp${Number(data.total_pemasukan || 0).toLocaleString("id-ID")}` },
                { label: "Total Pengeluaran", value: `Rp${Number(data.total_pengeluaran || 0).toLocaleString("id-ID")}` },
                { label: "Sukses", value: data.sukses ?? 0 },
                { label: "Pending", value: data.pending ?? 0 },
                { label: "Gagal", value: data.gagal ?? 0 },
            ];
        case "kategori":
            return (data || []).map(r => ({
                label: r.nama_kategori || "-",
                value: `${r.total_tukang || 0} tukang, ${r.total_booking || 0} booking`
            }));
        case "wilayah":
            return (data || []).map(r => ({
                label: r.kota || "-",
                value: `${r.total_tukang || 0} tukang`
            }));
        default:
            return [];
    }
}

function downloadAsHtml(key, d) {
    const r = REPORTS.find(x => x.key === key);
    const rows = reportRows(key, d);
    const isCurrency = ["pendapatan", "pembayaran"].includes(key);

    const tableRows = rows.map(row =>
        `<tr${row.bold ? ' style="font-weight:700;background:#f0fdf4"' : ""}><td>${row.label}</td><td>${row.value}</td></tr>`
    ).join("");

    const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>${r.title}</title>
<style>
body { font-family: Arial, sans-serif; padding: 40px; color: #333; max-width: 800px; margin: auto; }
h1 { font-size: 24px; margin-bottom: 4px; }
.sub { color: #666; margin-bottom: 24px; }
table { width: 100%; border-collapse: collapse; }
th, td { padding: 10px 14px; text-align: left; border-bottom: 1px solid #ddd; }
th { background: #f5f5f5; font-weight: 600; }
.footer { margin-top: 32px; font-size: 12px; color: #999; text-align: center; border-top: 1px solid #eee; padding-top: 16px; }
</style></head><body>
<h1>${r.title}</h1>
<p class="sub">${r.desc}</p>
<table><thead><tr><th>Metrik</th><th>Nilai</th></tr></thead>
<tbody>${tableRows}</tbody></table>
<p class="footer">Laporan SiTukang — ${new Date().toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}</p>
</body></html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `laporan_${key}_${new Date().toISOString().slice(0, 10)}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function LaporanPage() {
    const [dataMap, setDataMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [preview, setPreview] = useState({ open: false, key: null });

    useEffect(() => { loadAll(); }, []);

    const loadAll = async () => {
        setLoading(true);
        const results = {};
        await Promise.all(REPORTS.map(async (r) => {
            try {
                const fn = API_MAP[r.key];
                const resp = await fn();
                results[r.key] = resp.data;
            } catch (e) { results[r.key] = null; }
        }));
        setDataMap(results);
        setLoading(false);
    };

    const handlePreview = (key) => setPreview({ open: true, key });

    const handleDownload = (key) => {
        const d = dataMap[key];
        if (d) downloadAsHtml(key, d);
    };

    const currentReport = preview.key ? REPORTS.find(r => r.key === preview.key) : null;
    const currentData = preview.key ? dataMap[preview.key] : null;

    return (
        <div className="page-content">
            <div className="page-header"><h1>Laporan</h1><p className="page-subtitle">Unduh laporan dan ringkasan data platform</p></div>

            {loading ? (
                <div className="loading-state"><div className="spinner"></div></div>
            ) : (
                <div className="report-grid">
                    {REPORTS.map((r) => (
                        <div key={r.key} className="report-card">
                            <div className="report-card-header">
                                <div className="report-card-icon" style={{ background: `linear-gradient(135deg, ${r.color}, ${r.dark})`, color: "#fff" }}>
                                    {r.icon}
                                </div>
                                <div className="report-card-title">{r.title}</div>
                            </div>
                            <p className="report-card-desc">{r.desc}</p>
                            <div className="report-card-actions">
                                <button className="btn btn-outline-primary btn-sm" onClick={() => handlePreview(r.key)}><Eye size={15} /> Preview</button>
                                <button className="btn btn-primary btn-sm" onClick={() => handleDownload(r.key)} disabled={!dataMap[r.key]}><Download size={15} /> Download</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal open={preview.open} onClose={() => setPreview({ open: false, key: null })} title={currentReport?.title || "Preview"} size="md">
                {currentData && (
                    <div style={{ padding: "4px 0" }}>
                        <p style={{ color: "#666", marginBottom: 16 }}>{currentReport?.desc}</p>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ background: "#f5f5f5" }}>
                                    <th style={{ padding: "10px 14px", textAlign: "left", borderBottom: "1px solid #ddd", fontWeight: 600 }}>Metrik</th>
                                    <th style={{ padding: "10px 14px", textAlign: "left", borderBottom: "1px solid #ddd", fontWeight: 600 }}>Nilai</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportRows(preview.key, currentData).map((row, j) => (
                                    <tr key={j}>
                                        <td style={{ padding: "10px 14px", borderBottom: "1px solid #eee", ...(row.bold ? { fontWeight: 700 } : {}) }}>{row.label}</td>
                                        <td style={{ padding: "10px 14px", borderBottom: "1px solid #eee", fontWeight: row.bold ? 700 : 600 }}>{row.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="modal-actions" style={{ marginTop: 20 }}>
                            <button className="btn btn-primary" onClick={() => { handleDownload(preview.key); setPreview({ open: false, key: null }); }}><Download size={15} /> Download</button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
export default LaporanPage;