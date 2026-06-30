import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { createBooking } from "../../api/bookingApi";

function BookingPage() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [alamat, setAlamat] = useState("");
    const [keluhan, setKeluhan] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await createBooking({

                tukang_id: id,
                alamat,
                keluhan

            });

            alert("Booking berhasil");

            navigate("user/my-booking");

        } catch (error) {

            console.error(error);

            alert("Booking gagal");

        }

    };

    return (

        <div style={{ padding: "20px" }}>

            <h1>Booking Tukang</h1>

            <form onSubmit={handleSubmit}>

                <div>

                    <label>Alamat</label>

                    <br />

                    <textarea
                        rows="3"
                        value={alamat}
                        onChange={(e) =>
                            setAlamat(e.target.value)
                        }
                    />

                </div>

                <br />

                <div>

                    <label>Keluhan</label>

                    <br />

                    <textarea
                        rows="4"
                        value={keluhan}
                        onChange={(e) =>
                            setKeluhan(e.target.value)
                        }
                    />

                </div>

                <br />

                <button type="submit">
                    Booking Sekarang
                </button>

            </form>

        </div>

    );

}

export default BookingPage;