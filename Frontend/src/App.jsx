import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import RegisterTukang from "./pages/auth/RegisterTukang";
import Home from "./pages/user/Home";
import UserDashboard from "./pages/user/UserDashboard";
import DashboardUtama from "./pages/user/DashboardUtama";
import DetailTukang from "./pages/user/DetailTukang";
import BookingPage from "./pages/user/BookingPage";
import MyBooking from "./pages/user/MyBooking";
import CariTukang from "./pages/user/CariTukang";
import DetailBooking from "./pages/user/DetailBooking";
import OrderAktif from "./pages/user/OrderAktif";
import Riwayat from "./pages/user/Riwayat";
import UlasanSaya from "./pages/user/UlasanSaya";
import PengaturanUser from "./pages/user/Pengaturan";
import Layanan from "./pages/user/Layanan";
import Tentang from "./pages/user/Tentang";
import Ulasan from "./pages/user/Ulasan";
import FAQ from "./pages/user/FAQ";
import Kontak from "./pages/user/Kontak";
import PaymentPage from "./pages/user/PaymentPage";
import PaymentDetail from "./pages/user/PaymentDetail";
import RiwayatPembayaran from "./pages/user/RiwayatPembayaran";
import ProtectedRoute from "./routes/ProtectedRoute";

import TukangDashboard from "./pages/tukang/Dashboard";
import LoginAdmin from "./pages/admin/LoginAdmin";
import AdminLayout from "./layout/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import UsersPage from "./pages/admin/Users";
import VerifikasiTukang from "./pages/admin/VerifikasiTukang";
import TukangPage from "./pages/admin/Tukang";
import BookingPageAdmin from "./pages/admin/Booking";
import PembayaranPage from "./pages/admin/Pembayaran";
import KomisiPage from "./pages/admin/Komisi";
import KategoriPage from "./pages/admin/Kategori";
import LaporanPage from "./pages/admin/Laporan";
import TicketPage from "./pages/admin/Ticket";
import ModerasiReview from "./pages/admin/ModerasiReview";
import PengaturanPage from "./pages/admin/Pengaturan";
import ProfilAdmin from "./pages/admin/ProfilAdmin";

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
                <Route path="/login-admin" element={<LoginAdmin />} />
                <Route path="/register" element={<Register />} />
                <Route path="/registertukang" element={<RegisterTukang />} />

                <Route path="/user" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
                <Route path="/user/cari-tukang" element={<ProtectedRoute><CariTukang /></ProtectedRoute>} />
                <Route path="/user/tukang/:id" element={<ProtectedRoute><DetailTukang /></ProtectedRoute>} />
                <Route path="/user/booking/:id" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
                <Route path="/user/booking/detail/:id" element={<ProtectedRoute><DetailBooking /></ProtectedRoute>} />
                <Route path="/user/payment/:id" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
                <Route path="/user/payment/invoice/:invoiceNumber" element={<ProtectedRoute><PaymentDetail /></ProtectedRoute>} />
                <Route path="/user/riwayat-pembayaran" element={<ProtectedRoute><RiwayatPembayaran /></ProtectedRoute>} />
                <Route path="/user/my-booking" element={<ProtectedRoute><MyBooking /></ProtectedRoute>} />
                <Route path="/user/order-aktif" element={<ProtectedRoute><OrderAktif /></ProtectedRoute>} />
                <Route path="/user/riwayat" element={<ProtectedRoute><Riwayat /></ProtectedRoute>} />
                <Route path="/user/ulasan-saya" element={<ProtectedRoute><UlasanSaya /></ProtectedRoute>} />
                <Route path="/user/pengaturan" element={<ProtectedRoute><PengaturanUser /></ProtectedRoute>} />

                <Route path="/tukang" element={<ProtectedRoute requiredRole="tukang"><TukangDashboard /></ProtectedRoute>} />

                <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminLayout /></ProtectedRoute>}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="users" element={<UsersPage />} />
                    <Route path="tukang/pending" element={<VerifikasiTukang />} />
                    <Route path="tukang" element={<TukangPage />} />
                    <Route path="booking" element={<BookingPageAdmin />} />
                    <Route path="pembayaran" element={<PembayaranPage />} />
                    <Route path="komisi" element={<KomisiPage />} />
                    <Route path="kategori" element={<KategoriPage />} />
                    <Route path="laporan" element={<LaporanPage />} />
                    <Route path="ticket" element={<TicketPage />} />
                    <Route path="review" element={<ModerasiReview />} />
                    <Route path="pengaturan" element={<PengaturanPage />} />
                    <Route path="profil" element={<ProfilAdmin />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
