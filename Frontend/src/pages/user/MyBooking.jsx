import { useEffect, useState } from "react";
import { getMyBooking } from "../../api/bookingApi";

function MyBooking() {

    const [booking, setBooking] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const loadBooking = async () => {

            try {

                const response = await getMyBooking();

                setBooking(response.data);

            } catch (error) {

                console.error(error);

            } finally {

                setLoading(false);

            }

        };

        loadBooking();

    }, []);

    if (loading) {
        return <h2>Loading...</h2>;
    }

    return (

        <div style={{ padding: "20px" }}>

            <h1>Booking Saya</h1>

            {
                booking.length === 0
                    ? (
                        <p>Belum ada booking.</p>
                    )
                    : (
                        booking.map((item) => (

                            <div
                                key={item.id}
                                style={{
                                    border: "1px solid #ddd",
                                    padding: "15px",
                                    marginBottom: "10px",
                                    borderRadius: "10px"
                                }}
                            >

                                <h3>{item.nama_tukang}</h3>

                                <p>
                                    <strong>Alamat:</strong> {item.alamat}
                                </p>

                                <p>
                                    <strong>Keluhan:</strong> {item.keluhan}
                                </p>

                                <p>
                                    <strong>Status:</strong> {item.status}
                                </p>

                                <p>
                                    <strong>Tanggal:</strong> {item.tanggal_booking}
                                </p>

                            </div>

                        ))
                    )
            }

        </div>

    );

}

export default MyBooking;