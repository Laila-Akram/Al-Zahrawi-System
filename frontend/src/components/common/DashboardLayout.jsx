
import { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

const navigation = {
  doctor: [
    { title: "Dashboard", path: "/doctor/dashboard", icon: "▦" },
    { title: "My Requests", path: "/doctor/requests", icon: "▤" },
    { title: "Received Offers", path: "/doctor/offers", icon: "◇" },
    { title: "Supplier Ratings", path: "/doctor/ratings", icon: "☆" },
  ],

  supplier: [
    { title: "Dashboard", path: "/supplier/dashboard", icon: "▦" },
    { title: "Doctor Requests", path: "/supplier/requests", icon: "▤" },
    { title: "My Offers", path: "/supplier/offers", icon: "➤" },
    { title: "My Profile", path: "/supplier/profile", icon: "♙" },
  ],

  admin: [
    { title: "Dashboard", path: "/admin/dashboard", icon: "▦" },
    { title: "Supplier Approvals", path: "/admin/approvals", icon: "✓" },
    { title: "User Management", path: "/admin/users", icon: "♙" },
    { title: "Products & Categories", path: "/admin/catalog", icon: "▣" },
    { title: "Supplier Ratings", path: "/admin/ratings", icon: "☆" },
  ],
};

const roleNames = {
  doctor: "Dentist",
  supplier: "Supplier",
  admin: "Administrator",
};

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("alzahrawi-theme") === "dark"
  );

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role || "doctor";

  const currentNavigation = navigation[role] || navigation.doctor;

  const currentPage = currentNavigation.find(
    (item) => item.path === location.pathname
  );

  const toggleTheme = () => {
    const newTheme = !darkMode;

    setDarkMode(newTheme);
    localStorage.setItem("alzahrawi-theme", newTheme ? "dark" : "light");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className={`app-layout ${darkMode ? "dark-mode" : ""}`}>
      <aside className={`app-sidebar ${sidebarOpen ? "show" : ""}`}>
        <div className="brand-container">
          <div className="brand-logo">AZ</div>

          <div>
            <div className="brand-name">AL-ZAHRAWI</div>
            <div className="brand-slogan">
              Inspired by history, built for modern dentistry.
            </div>
          </div>
        </div>

        <div className="sidebar-section-title">WORKSPACE</div>

        <nav className="sidebar-navigation">
          {currentNavigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span>{item.title}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-note">
          <strong>Trusted Dental Supplies Platform</strong>
          <p>
            Clear requests, comparable offers, and informed decisions.
          </p>
        </div>
      </aside>

      <main className="app-main">
        <header className="app-topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="mobile-menu-button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              ☰
            </button>

            <div className="breadcrumb">
              AL-ZAHRAWI <span>/</span>
              <strong>{currentPage?.title || "Dashboard"}</strong>
            </div>
          </div>

          <div className="topbar-right">
            <button
              type="button"
              className="theme-button"
              onClick={toggleTheme}
              title="Change theme"
            >
              {darkMode ? "☀" : "☾"}
            </button>

            <div className="user-information">
              <div className="user-avatar">
                {(user.name || "U").charAt(0).toUpperCase()}
              </div>

              <div>
                <strong>{user.name || "User"}</strong>
                <small>{roleNames[role] || "User"}</small>
              </div>
            </div>

            <button
              type="button"
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </header>

        <div className="app-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
