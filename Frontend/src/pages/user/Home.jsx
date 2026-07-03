import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../assets/HomeStyle.css";

import { getAllTukang } from "../../api/tukangApi";

function Home() {

    const [tukang, setTukang] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTukang();
    }, []);

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

    if (loading) {
        return <h2>Loading...</h2>;
    }

    return (

        <div className="home-container">

            <div className="home-header">

                <h1>Daftar Tukang</h1>

                <p>
                    Temukan tukang profesional sesuai kebutuhanmu.
                </p>

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