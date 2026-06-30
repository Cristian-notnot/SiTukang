import { BrowserRouter, Routes, Route } from "react-router-dom";
import DetailTukang from "../pages/user/DetailTukang";
import ProtectedRoute from "./ProtectedRoute";
import BookingPage from "../pages/user/BookingPage";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import Home from "../pages/user/Home";
import AdminDashboard from "../pages/admin/Dashboard";
import TukangDashboard from "../pages/tukang/Dashboard";

import MyBooking from "./pages/user/MyBooking";

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

                <Route
                     path="/user/booking/:id"
                     element={
                     <ProtectedRoute>
                     <BookingPage />
                     </ProtectedRoute>
                    }
                />

                <Route
    path="/user/my-booking"
    element={<MyBooking />}
/>

            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;