import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, requiredRole }) {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token) {
        return <Navigate to="/login" />;
    }

    if (requiredRole && user?.role !== requiredRole) {
        const redirectMap = {
            admin: "/login-admin",
            tukang: "/login",
            user: "/login",
        };
        return <Navigate to={redirectMap[requiredRole] || "/login"} />;
    }

    return children;
}

export default ProtectedRoute;