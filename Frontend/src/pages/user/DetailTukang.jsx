import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import { getDetailTukang } from "../../api/tukangApi";

function DetailTukang() {

    const { id } = useParams();

    const [tukang, setTukang] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const loadData = async () => {

            try {

                const response = await getDetailTukang(id);

                setTukang(response);

            } catch (error) {

                console.error(error);

            } finally {

                setLoading(false);

            }

        };

        loadData();

    }, [id]);

    if (loading) {
        return <h2>Loading...</h2>;
    }

    if (!tukang) {
        return <h2>Data tukang tidak ditemukan</h2>;
    }

    return (

        <div style={{ padding: "20px" }}>

            <h1>{tukang.nama}</h1>

            <hr />

            <p>
                <strong>Kategori :</strong> {tukang.nama_kategori}
            </p>

            <p>
                <strong>Telepon :</strong> {tukang.telepon}
            </p>

            <p>
                <strong>Alamat :</strong> {tukang.alamat}
            </p>

            <p>
                <strong>Rating :</strong> ⭐ {tukang.rating}
            </p>

            <br />

            <Link to={`/user/booking/${tukang.id}`}>
                <button>Booking Sekarang</button>
            </Link>

        </div>

    );

}

export default DetailTukang;