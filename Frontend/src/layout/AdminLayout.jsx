import { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Menu, Bell, Search, User, ChevronDown } from "lucide-react";
import ToastProvider from "../components/admin/Toast";

import "../assets/css/AdminLayout.css";

function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useContext(AuthContext);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        setDrawerOpen(false);
    }, [location]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 640) setDrawerOpen(false);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleSidebar = () => {
        if (window.innerWidth <= 640) {
            setDrawerOpen(prev => !prev);
        } else {
            setSidebarOpen(prev => !prev);
        }
    };

    const closeDrawer = () => setDrawerOpen(false);

    const breadcrumbMap = {
        "/admin": "Dashboard",
        "/admin/users": "Manajemen Pengguna",
        "/admin/tukang/pending": "Verifikasi Tukang",
        "/admin/tukang": "Manajemen Tukang",
        "/admin/booking": "Manajemen Booking",
        "/admin/pembayaran": "Pembayaran",
        "/admin/komisi": "Komisi",
        "/admin/kategori": "Kategori",
        "/admin/laporan": "Laporan",
        "/admin/ticket": "Ticket Support",
        "/admin/review": "Moderasi Review",
        "/admin/pengaturan": "Pengaturan",
        "/admin/profil": "Profil Admin",
    };

    const getBreadcrumb = useCallback(() => {
        const path = location.pathname;
        for (const [key, value] of Object.entries(breadcrumbMap)) {
            if (path === key) return value;
        }
        if (path.startsWith("/admin/tukang/pending")) return "Verifikasi Tukang";
        return "Dashboard";
    }, [location.pathname]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate("/admin");
        }
    };

    return (
        <div className="admin-container">
            <div className={`sidebar-backdrop ${drawerOpen ? "show" : ""}`} onClick={closeDrawer}></div>
            <header className="top-navbar">
                <div className="navbar-left">
                    <button className="menu-toggle" onClick={toggleSidebar}>
                        <Menu size={20} />
                    </button>
                    <div className="breadcrumb">
                        <span className="breadcrumb-root">Admin</span>
                        <span className="breadcrumb-sep">/</span>
                        <span className="breadcrumb-current">{getBreadcrumb()}</span>
                    </div>
                </div>

                <div className="navbar-center">
                    <div className="search-container">
                        <form onSubmit={handleSearch} className="search-form">
                            <button type="submit" className="search-icon-btn">
                                <Search size={18} />
                            </button>
                            <input
                                type="text"
                                placeholder="Cari pengguna, tukang, booking..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </form>
                    </div>
                </div>

                <div className="navbar-right">
                    <button className="notification-btn">
                        <Bell size={20} />
                    </button>

                    <div className="user-menu">
                        <button className="user-avatar">
                            <User size={20} />
                        </button>
                        <span className="user-name">{user?.nama || "Admin"}</span>
                        <ChevronDown size={16} />
                        <div className="dropdown-menu">
                            <button onClick={() => navigate("/admin/profil")}>Profil</button>
                            <button onClick={() => navigate("/admin/pengaturan")}>Pengaturan</button>
                            <hr />
                            <button onClick={() => window.location.href = "/"}>Kembali ke Website</button>
                            <button className="danger" onClick={() => { logout(); navigate("/login"); }}>Logout</button>
                        </div>
                    </div>
                </div>
            </header>

            <aside className={`sidebar ${sidebarOpen ? "open" : "closed"} ${drawerOpen ? "drawer-open" : ""}`}>
                <div className="sidebar-header">
                    <div className="logo">
                        <div className="logo-icon">S</div>
                        <span className="logo-text">SiTukang</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <ul>
                        <li>
                            <button onClick={() => navigate("/admin")} className={location.pathname === "/admin" ? "active" : ""}>
                                <span className="nav-icon">📊</span>
                                <span className="nav-label">Dashboard</span>
                            </button>
                        </li>

                        <li className="nav-section">Manajemen</li>

                        <li>
                            <button onClick={() => navigate("/admin/users")} className={location.pathname.includes("/admin/users") ? "active" : ""}>
                                <span className="nav-icon">👥</span>
                                <span className="nav-label">Users</span>
                            </button>
                        </li>
                        <li>
                            <button onClick={() => navigate("/admin/tukang/pending")} className={location.pathname.includes("/admin/tukang/pending") ? "active" : ""}>
                                <span className="nav-icon">📋</span>
                                <span className="nav-label">Verifikasi Tukang</span>
                            </button>
                        </li>
                        <li>
                            <button onClick={() => navigate("/admin/tukang")} className={location.pathname === "/admin/tukang" ? "active" : ""}>
                                <span className="nav-icon">👨‍🔧</span>
                                <span className="nav-label">Tukang</span>
                            </button>
                        </li>
                        <li>
                            <button onClick={() => navigate("/admin/booking")} className={location.pathname.includes("/admin/booking") ? "active" : ""}>
                                <span className="nav-icon">📅</span>
                                <span className="nav-label">Booking</span>
                            </button>
                        </li>
                        <li>
                            <button onClick={() => navigate("/admin/pembayaran")} className={location.pathname.includes("/admin/pembayaran") ? "active" : ""}>
                                <span className="nav-icon">💰</span>
                                <span className="nav-label">Pembayaran</span>
                            </button>
                        </li>
                        <li>
                            <button onClick={() => navigate("/admin/komisi")} className={location.pathname.includes("/admin/komisi") ? "active" : ""}>
                                <span className="nav-icon">💵</span>
                                <span className="nav-label">Komisi</span>
                            </button>
                        </li>
                        <li>
                            <button onClick={() => navigate("/admin/kategori")} className={location.pathname.includes("/admin/kategori") ? "active" : ""}>
                                <span className="nav-icon">📂</span>
                                <span className="nav-label">Kategori</span>
                            </button>
                        </li>

                        <li className="nav-section">Operasional</li>

                        <li>
                            <button onClick={() => navigate("/admin/laporan")} className={location.pathname.includes("/admin/laporan") ? "active" : ""}>
                                <span className="nav-icon">📈</span>
                                <span className="nav-label">Laporan</span>
                            </button>
                        </li>
                        <li>
                            <button onClick={() => navigate("/admin/ticket")} className={location.pathname.includes("/admin/ticket") ? "active" : ""}>
                                <span className="nav-icon">🎫</span>
                                <span className="nav-label">Ticket Support</span>
                            </button>
                        </li>
                        <li>
                            <button onClick={() => navigate("/admin/review")} className={location.pathname.includes("/admin/review") ? "active" : ""}>
                                <span className="nav-icon">💬</span>
                                <span className="nav-label">Moderasi Review</span>
                            </button>
                        </li>

                        <li className="nav-section">System</li>

                        <li>
                            <button onClick={() => navigate("/admin/pengaturan")} className={location.pathname.includes("/admin/pengaturan") ? "active" : ""}>
                                <span className="nav-icon">⚙️</span>
                                <span className="nav-label">Pengaturan</span>
                            </button>
                        </li>
                        <li>
                            <button onClick={() => navigate("/admin/profil")} className={location.pathname.includes("/admin/profil") ? "active" : ""}>
                                <span className="nav-icon">👤</span>
                                <span className="nav-label">Profil Admin</span>
                            </button>
                        </li>
                    </ul>
                </nav>

                <div className="sidebar-profile">
                    <div className="sidebar-profile-avatar">
                        {user?.nama?.charAt(0).toUpperCase() || "A"}
                    </div>
                    <div className="sidebar-profile-info">
                        <div className="sidebar-profile-name">{user?.nama || "Admin"}</div>
                        <div className="sidebar-profile-role">Administrator</div>
                    </div>
                </div>
            </aside>

            <main className={`main-content ${sidebarOpen && window.innerWidth > 640 ? "sidebar-open" : "sidebar-closed"}`}>
                <ToastProvider>
                    <Outlet />
                </ToastProvider>
            </main>
        </div>
    );
}

export default AdminLayout;