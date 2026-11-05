
import { useTheme } from "../../context/ThemeContext";
import "./ResidentNavbar.css";
function ResidentNavbar() {

    const { theme, toggleTheme } = useTheme();

    return (
        <header className="resident-navbar">

            <div className="resident-navbar-heading">
                <h2>Resident Portal</h2>
                <p>Manage your society account</p>
            </div>

            <div className="resident-navbar-actions">

                <button
                    className="theme-toggle"
                    onClick={toggleTheme}
                    title="Toggle theme"
                >
                    {theme === "light" ? "☾ Dark Mode" : "☀ Light Mode"}
                </button>

                <div className="resident-navbar-avatar">
                    R
                </div>

            </div>

        </header>
    );
}

export default ResidentNavbar;
