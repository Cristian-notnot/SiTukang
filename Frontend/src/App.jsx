import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
<<<<<<< HEAD
import RegisterTukang from "./pages/auth/RegisterTukang";
import Home from "./pages/user/Home";
=======
import UserDashboard from "./pages/user/UserDashboard";
>>>>>>> 6275e766e6164865795de121bc376d3518d68df7
import DashboardUtama from "./pages/user/DashboardUtama";
import DetailTukang from "./pages/user/DetailTukang";
import BookingPage from "./pages/user/BookingPage";
import MyBooking from "./pages/user/MyBooking";
import Layanan from "./pages/user/Layanan";
import Tentang from "./pages/user/Tentang";
import Ulasan from "./pages/user/Ulasan";
import FAQ from "./pages/user/FAQ";
import Kontak from "./pages/user/Kontak";
import ProtectedRoute from "./routes/ProtectedRoute";

import TukangDashboard from "./pages/tukang/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/layanan" element={<Layanan />} />
                <Route path="/kontak" element={<Kontak />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/ulasan" element={<Ulasan />} />
                <Route path="/tentang" element={<Tentang />} />
                <Route path="/" element={<DashboardUtama />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/registertukang" element={<RegisterTukang />} />

                <Route path="/user" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
                <Route path="/user/tukang/:id" element={<ProtectedRoute><DetailTukang /></ProtectedRoute>} />
                <Route path="/user/booking/:id" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
                <Route path="/user/my-booking" element={<ProtectedRoute><MyBooking /></ProtectedRoute>} />

                <Route path="/tukang" element={<ProtectedRoute><TukangDashboard /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            </Routes>
        </Router>
    );
}

export default App;