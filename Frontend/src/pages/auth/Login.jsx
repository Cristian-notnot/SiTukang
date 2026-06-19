import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

import API from "../../api/axios";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useContext(AuthContext);

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            const response = await API.post(
                "/auth/login",
                {
                    email,
                    password
                }
            );

            const token = response.data.token;
            const user = response.data.user;

            login(user, token);

            if (user.role === "admin") {
                navigate("/admin");
            }
            else if (user.role === "tukang") {
                navigate("/tukang");
            }
            else {
                navigate("/user");
            }

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Login gagal"
            );

        }

    };

    return (

        <div>

            <h1>Login</h1>

            <form onSubmit={handleLogin}>

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
                    Login
                </button>

            </form>

        </div>

    );

}

export default Login;