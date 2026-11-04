
import { useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";
import { useTheme } from "../../context/ThemeContext";
import "../../styles/AdminSettings.css";

function AdminSettings() {
    const { theme } = useTheme();

    const [profile, setProfile] = useState({
        name: "Administrator",
        email: "admin@societymanagement.com",
        role: "Society Administrator"
    });

    const [saved, setSaved] = useState(false);

    function handleChange(e) {
        setProfile({
            ...profile,
            [e.target.name]: e.target.value
        });

        setSaved(false);
    }

    function handleSave(e) {
        e.preventDefault();
        setSaved(true);
    }

    return (
        <div className="admin-layout">

            <AdminSidebar />

            <main className="admin-main">

                <AdminNavbar />

                <div className="settings-container">

                    <div className="settings-heading">
                        <h1>Settings</h1>
                        <p>Manage your administrator profile and preferences.</p>
                    </div>

                    {/* Profile Settings */}
                    <section className="settings-card">

                        <h2>Administrator Profile</h2>
                        <p className="settings-description">
                            Update your account information.
                        </p>

                        <form onSubmit={handleSave}>

                            <div className="settings-form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={profile.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="settings-form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={profile.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="settings-form-group">
                                <label>Role</label>
                                <input
                                    type="text"
                                    value={profile.role}
                                    disabled
                                />
                            </div>

                            <button type="submit" className="primary-btn">
                                Save Changes
                            </button>

                            {saved && (
                                <p className="settings-success">
                                    Profile changes saved for this session!
                                </p>
                            )}

                        </form>

                    </section>

                    {/* Appearance */}
                    <section className="settings-card">

                        <h2>Appearance</h2>
                        <p className="settings-description">
                            Manage the appearance of your administration panel.
                        </p>

                        <div className="settings-info-row">
                            <span>Current Theme</span>
                            <strong>
                                {theme === "light" ? "Light Mode" : "Dark Mode"}
                            </strong>
                        </div>

                        <p className="settings-hint">
                            Use the theme toggle in the top navigation bar to
                            switch between light and dark mode.
                        </p>

                    </section>

                    {/* System Information */}
                    <section className="settings-card">

                        <h2>System Information</h2>
                        <p className="settings-description">
                            Basic information about the application.
                        </p>

                        <div className="settings-info-row">
                            <span>Application Name</span>
                            <strong>Society Management System</strong>
                        </div>

                        <div className="settings-info-row">
                            <span>Portal</span>
                            <strong>Administrator Panel</strong>
                        </div>

                        <div className="settings-info-row">
                            <span>Version</span>
                            <strong>1.0.0</strong>
                        </div>

                        <div className="settings-info-row">
                            <span>Frontend</span>
                            <strong>React.js</strong>
                        </div>

                    </section>

                </div>

            </main>

        </div>
    );
}

export default AdminSettings;
