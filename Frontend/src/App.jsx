import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register"; // 1. DITAMBAHKAN: Import komponen Register kamu
import Home from "./pages/user/Home";
import DashboardUtama from "./pages/user/DashboardUtama";
import DetailTukang from "./pages/user/DetailTukang";
import BookingPage from "./pages/user/BookingPage";
import MyBooking from "./pages/user/MyBooking";
import Layanan from "./pages/user/Layanan";
import Tentang from "./pages/user/Tentang";
import Ulasan from "./pages/user/Ulasan";
import FAQ from "./pages/user/FAQ";
import Kontak from "./pages/user/Kontak";

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

                <Route path="/user" element={<Home />} />

                <Route path="/user/tukang/:id" element={<DetailTukang />}/>

                <Route path="/user/booking/:id" element={<BookingPage />} />

                <Route path="/user/my-booking" element={<MyBooking />} />

            </Routes>
         </Router>

     );

}

export default App;