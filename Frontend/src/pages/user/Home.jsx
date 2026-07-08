import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../assets/HomeLanding.css";

import { getAllTukang, getSearchTukang } from "../../api/tukangApi";

function Home() {

    const [tukang, setTukang] = useState([]);

    const [loading, setLoading] = useState(true);

    const [keyword, setKeyword] = useState("");

    // pakai input lokasi untuk filter alamat (tanpa geolocation biar aman)
    const [alamat, setAlamat] = useState("");

    const fetchTukang = async () => {

        try {

            const response = await getAllTukang();

            setTukang(response);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {
        const run = async () => {
            try {
                await fetchTukang();
            } catch (e) {
                // swallow
            }
        };
        run();
    }, []);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const response = await getSearchTukang(keyword, alamat);
            setTukang(response);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <h2>Loading...</h2>;
    }

    return (

        <div className="home-container">

            <div className="home-hero">
                <div className="home-hero-left">
                    <div className="home-kicker">✨ Marketplace tukang terpercaya</div>
                    <h1 className="home-hero-title">
                        Cari <span>tukang andal</span> dengan cepat.
                    </h1>
                    <p className="home-hero-sub">
                        Dari listrik, AC, pipa, sampai perbaikan rumah lainnya — semuanya dengan kualitas terverifikasi.
                    </p>

                    {/* SEARCH (dipakai untuk cari situkang sesuai nama/layanan + alamat) */}
                    <div className="home-hero-actions" style={{ alignItems: "center" }}>
                        <div className="home-search-inline" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                            <input
                                type="text"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                placeholder="Cari tukang / layanan (contoh: Listrik)"
                                className="home-search-input"
                                style={{ padding: "12px 14px", borderRadius: 16, border: "1px solid rgba(226,232,240,0.9)", minWidth: 260 }}
                            />
                            <input
                                type="text"
                                value={alamat}
                                onChange={(e) => setAlamat(e.target.value)}
                                placeholder="Lokasi (contoh: Jakarta Selatan)"
                                className="home-search-input"
                                style={{ padding: "12px 14px", borderRadius: 16, border: "1px solid rgba(226,232,240,0.9)", minWidth: 220 }}
                            />
                            <button
                                type="button"
                                className="btn-cta btn-primary"
                                onClick={handleSearch}
                                style={{ padding: "12px 18px", borderRadius: 16 }}
                            >
                                Cari ➔
                            </button>
                        </div>
                    </div>

                    <div className="home-hero-actions">
                        <Link to="/layanan" className="btn-cta btn-primary">Mulai cari layanan</Link>
                        <button type="button" className="btn-cta btn-ghost" onClick={() => window.scrollTo({ top: 900, behavior: "smooth" })}>
                            Lihat daftar tukang
                        </button>
                    </div>

                </div>

                <div className="home-hero-right">
                    <div className="home-card">
                        <div className="home-card-top">
                            <div className="home-avatar">Si</div>
                            <div className="home-online">Online</div>
                        </div>
                        <h3>Rekomendasi tukang sesuai kebutuhanmu</h3>
                        <p>Biasanya job selesai lebih cepat dengan tukang yang tepat.</p>
                        <div className="home-card-stats">
                            <div className="stat-chip">
                                <b>12K+</b>
                                <span>Tukang aktif</span>
                            </div>
                            <div className="stat-chip">
                                <b>4.9★</b>
                                <span>Rating rata-rata</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="home-header">
                <div>
                    <h1 style={{ margin: 0 }}>Daftar Tukang</h1>
                    <p>Temukan tukang profesional sesuai kebutuhanmu.</p>
                </div>
            </div>

            <div className="tukang-grid">


                {tukang.map((item) => (

                    <div
                        key={item.id}
                        className="tukang-card"
                    >

                        <div className="card-top">

                            <img
                                className="tukang-photo"
                                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                                alt="Foto Tukang"
                            />

                            <div>

                                <h2>{item.nama}</h2>

                                <span className="kategori">
                                    {item.nama_kategori}
                                </span>

                            </div>

                        </div>

                        <div className="card-body">

                            <p>
                                📞 {item.telepon}
                            </p>

                            <p>
                                📍 {item.alamat}
                            </p>

                            <p className="rating">
                                ⭐ {item.rating}
                            </p>

                        </div>

                        <Link
                            to={`/user/tukang/${item.id}`}
                            className="detail-btn"
                        >
                            Lihat Detail
                        </Link>

                    </div>

                ))}

            </div>

        </div>

    );

}

export default Home;
