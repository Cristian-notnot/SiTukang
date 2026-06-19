import { createContext, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

function AuthProvider({ children }) {

    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("user"))
    );

    const [token, setToken] = useState(
        localStorage.getItem("token")
    );

    const login = (userData, tokenData) => {

        localStorage.setItem(
            "user",
            JSON.stringify(userData)
        );

        localStorage.setItem(
            "token",
            tokenData
        );

        setUser(userData);
        setToken(tokenData);

    };

    const logout = () => {

        localStorage.removeItem("user");
        localStorage.removeItem("token");

        setUser(null);
        setToken(null);

    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;