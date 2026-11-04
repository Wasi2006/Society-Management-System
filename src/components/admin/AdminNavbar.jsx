
import { useTheme } from "../../context/ThemeContext";

function AdminNavbar() {

    const { theme, toggleTheme } = useTheme();

    return (
        <header className="admin-navbar">

            <div className="navbar-heading">
                <h2>Administration</h2>
                <p>Manage your society operations</p>
            </div>

            <div className="navbar-actions">

                <button
                    className="theme-toggle"
                    onClick={toggleTheme}
                    title="Toggle theme"
                >
                    {theme === "light" ? "☾ Dark Mode" : "☀ Light Mode"}
                </button>

                <div className="notification-btn">♧</div>

                <div className="navbar-avatar">A</div>

            </div>

        </header>
    );
}

export default AdminNavbar;
