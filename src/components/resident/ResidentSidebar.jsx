
import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./ResidentSidebar.css";

const menuItems = [
    { name: "Dashboard", icon: "▦", path: "/resident" },
    { name: "My Payments", icon: "₹", path: "/resident/payments" },
    { name: "My Complaints", icon: "▤", path: "/resident/complaints" },
    { name: "Announcements", icon: "◉", path: "/resident/announcements" },
];

function ResidentSidebar() {

    const [isOpen, setIsOpen] = useState(false);

    function closeSidebar() {
        setIsOpen(false);
    }

    return (
        <>
            <button
                className="resident-mobile-menu-btn"
                onClick={() => setIsOpen(!isOpen)}
            >
                ☰
            </button>

            {isOpen && (
                <div
                    className="resident-sidebar-overlay"
                    onClick={closeSidebar}
                />
            )}

            <aside className={`resident-sidebar ${isOpen ? "resident-sidebar-open" : ""}`}>

                <div className="resident-brand">
                    <div className="resident-logo">S</div>

                    <div>
                        <h2>SocietyMS</h2>
                        <span>Resident Portal</span>
                    </div>

                    <button
                        className="resident-sidebar-close"
                        onClick={closeSidebar}
                    >
                        ×
                    </button>
                </div>

                <div className="resident-menu">

                    <p className="resident-menu-label">MY WORKSPACE</p>

                    {menuItems.map(item => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            end={item.path === "/resident"}
                            onClick={closeSidebar}
                            className={({ isActive }) =>
                                `resident-link ${isActive ? "active" : ""}`
                            }
                        >
                            <span className="resident-icon">{item.icon}</span>
                            {item.name}
                        </NavLink>
                    ))}

                    <p className="resident-menu-label">ACCOUNT</p>

                    <NavLink
                        to="/resident/profile"
                        onClick={closeSidebar}
                        className={({ isActive }) =>
                            `resident-link ${isActive ? "active" : ""}`
                        }
                    >
                        <span className="resident-icon">♙</span>
                        My Profile
                    </NavLink>

                </div>

                <div className="resident-sidebar-bottom">
                    <div className="resident-mini-profile">
                        <div className="resident-avatar">R</div>

                        <div>
                            <strong>Resident</strong>
                            <span>Society Member</span>
                        </div>
                    </div>
                </div>

            </aside>
        </>
    );
}

export default ResidentSidebar;
