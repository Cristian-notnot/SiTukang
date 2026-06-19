import { BrowserRouter, Routes, Route } from "react-router-dom";

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
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/user"
                    element={<Home />}
                />

                <Route
                    path="/admin"
                    element={<AdminDashboard />}
                />

                <Route
                    path="/tukang"
                    element={<TukangDashboard />}
                />

            </Routes>

        </BrowserRouter>

    );

}

export default AppRoutes;