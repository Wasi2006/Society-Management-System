
import { useState } from "react";
import { NavLink } from "react-router-dom";

const menuItems = [
    { name: "Dashboard", icon: "▦", path: "/admin" },
    { name: "Residents", icon: "♙", path: "/admin/residents" },
    { name: "Payments", icon: "₹", path: "/admin/payments" },
    { name: "Complaints", icon: "▤", path: "/admin/complaints" },
    { name: "Announcements", icon: "◉", path: "/admin/announcements" },
];

function AdminSidebar() {

    const [isOpen, setIsOpen] = useState(false);

    function closeSidebar() {
        setIsOpen(false);
    }

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                className="mobile-menu-btn"
                onClick={() => setIsOpen(!isOpen)}
            >
                ☰
            </button>

            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={closeSidebar}
                />
            )}

            <aside className={`admin-sidebar ${isOpen ? "sidebar-open" : ""}`}>

                <div className="sidebar-brand">

                    <div className="brand-logo">S</div>

                    <div>
                        <h2>SocietyMS</h2>
                        <span>Management Portal</span>
                    </div>

                    <button
                        className="sidebar-close-btn"
                        onClick={closeSidebar}
                    >
                        ×
                    </button>

                </div>

                <div className="sidebar-menu">

                    <p className="menu-label">WORKSPACE</p>

                    {menuItems.map(item => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            end={item.path === "/admin"}
                            onClick={closeSidebar}
                            className={({ isActive }) =>
                                `sidebar-link ${isActive ? "active" : ""}`
                            }
                        >
                            <span className="sidebar-icon">{item.icon}</span>
                            {item.name}
                        </NavLink>
                    ))}

                    <p className="menu-label">PREFERENCES</p>

                    <NavLink
                        to="/admin/settings"
                        onClick={closeSidebar}
                        className="sidebar-link"
                    >
                        <span className="sidebar-icon">⚙</span>
                        Settings
                    </NavLink>

                </div>

                <div className="sidebar-bottom">

                    <div className="admin-mini-profile">
                        <div className="mini-avatar">A</div>

                        <div>
                            <strong>Administrator</strong>
                            <span>System Admin</span>
                        </div>
                    </div>

                </div>

            </aside>
        </>
    );
}

export default AdminSidebar;
