import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
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

                <Route path="/user" element={<Home />} />

                <Route path="/user/tukang/:id" element={<DetailTukang />}/>

                <Route path="/user/booking/:id" element={<BookingPage />} />

                <Route path="/user/my-booking"element={<MyBooking />} />

            </Routes>

        </Router>

    );

}

export default App;