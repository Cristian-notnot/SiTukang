import { BrowserRouter, Routes, Route } from "react-router-dom";
import DetailTukang from "../pages/user/DetailTukang";
import ProtectedRoute from "./ProtectedRoute";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import Home from "../pages/user/Home";
import AdminDashboard from "../pages/admin/Dashboard";
import TukangDashboard from "../pages/tukang/Dashboard";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Public Routes */}
                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                {/* Protected Routes */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/tukang"
                    element={
                        <ProtectedRoute>
                            <TukangDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/user"
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />

                <Route
    path="/user/tukang/:id"
    element={
        <ProtectedRoute>
            <DetailTukang />
        </ProtectedRoute>
    }
/>

            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;