import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import UserDashboard from "./pages/user/UserDashboard.jsx";
import Home from "./pages/user/home.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* Route Login yang sudah kamu buat sebelumnya */}
        <Route path="/login" element={<Login />} />

        {/* 2. Tambahkan Route untuk Dashboard User di sini */}
        <Route path="/user" element={<Home />} />
        
        {/* Kamu juga bisa menjadikannya halaman utama (/) jika mau */}
        <Route path="/" element={<UserDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;