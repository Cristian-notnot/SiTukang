import { BrowserRouter, Routes, Route } from "react-router-dom";
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
            </Routes>

        </BrowserRouter>

    );

}

export default AppRoutes;