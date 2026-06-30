import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getAllTukang } from "../../api/tukangApi";

function Home() {
  

    const [tukang, setTukang] = useState([]);
    const [loading, setLoading] = useState(true);
      console.log(tukang);

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

        <div style={{ padding: "20px" }}>

            <h1>Daftar Tukang</h1>

            {tukang.map((item) => (

                <div
                    key={item.id}
                    style={{
                        border: "1px solid #ddd",
                        padding: "15px",
                        marginBottom: "10px",
                        borderRadius: "10px"
                    }}
                >

                    <h2>{item.nama}</h2>

                    <p>
                        <strong>Kategori:</strong>
                        {" "}
                        {item.nama_kategori}
                    </p>

                    <p>
                        <strong>Telepon:</strong>
                        {" "}
                        {item.telepon}
                    </p>

                    <p>
                        <strong>Alamat:</strong>
                        {" "}
                        {item.alamat}
                    </p>

                    <p>
                        <strong>Rating:</strong>
                        {" "}
                        ⭐ {item.rating}
                    </p>

                    <Link to={`/user/tukang/${item.id}`}>
                        <button>
                            Lihat Detail
                        </button>
                    </Link>

                </div>

            ))}

        </div>

    );

}

export default Home;