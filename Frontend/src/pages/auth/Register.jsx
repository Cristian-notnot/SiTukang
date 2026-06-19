import { useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../../api/axios";

function Register() {

    const navigate = useNavigate();

    const [nama, setNama] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async (e) => {

        e.preventDefault();

        try {

            const response = await API.post(
                "/auth/register",
                {
                    nama,
                    email,
                    password
                }
            );

            alert(response.data.message);

            navigate("/login");

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Register gagal"
            );

        }

    };

    return (

        <div>

            <h1>Register</h1>

            <form onSubmit={handleRegister}>

                <input
                    type="text"
                    placeholder="Nama"
                    value={nama}
                    onChange={(e) =>
                        setNama(e.target.value)
                    }
                />

                <br /><br />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                />

                <br /><br />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                />

                <br /><br />

                <button type="submit">
                    Register
                </button>

            </form>

        </div>

    );

}

export default Register;