import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register"; // 1. DITAMBAHKAN: Import komponen Register kamu
import Home from "./pages/user/Home";
import UserDashboard from "./pages/user/UserDashboard";
import DetailTukang from "./pages/user/DetailTukang";
import BookingPage from "./pages/user/BookingPage";
import MyBooking from "./pages/user/MyBooking";

function App() {

    return (

        <Router>

            <Routes>

                <Route path="/" element={<UserDashboard />} />

                <Route path="/login" element={<Login />} />
                
                {/* 2. DITAMBAHKAN: Rute halaman register */}
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