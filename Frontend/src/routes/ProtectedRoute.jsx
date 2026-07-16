import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ children, requiredRole }) {
    const { user, token } = useContext(AuthContext);

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && user?.role !== requiredRole) {
        const redirectMap = {
            admin: "/login-admin",
            tukang: "/login",
            user: "/login",
        };
        return <Navigate to={redirectMap[requiredRole] || "/login"} replace />;
    }

    return children;
}

export default ProtectedRoute;
