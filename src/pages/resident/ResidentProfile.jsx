
import { useState } from "react";
import ResidentSidebar from "../../components/resident/ResidentSidebar";
import ResidentNavbar from "../../components/resident/ResidentNavbar";
import "../../styles/ResidentProfile.css";

function ResidentProfile() {
    const [profile, setProfile] = useState({
        fullName: "Ali",
        email: "ali@example.com",
        phone: "03001234567",
        houseNumber: "A-101",
        role: "Resident",
        address: "Block A, Society Management System",
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setProfile({
            ...profile,
            [name]: value,
        });

        setMessage("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage("Profile updated successfully!");
    };

    return (
        <div className="resident-layout">
            <ResidentSidebar />

            <main className="resident-main">
                <ResidentNavbar />

                <div className="resident-profile-content">
                    <div className="resident-profile-heading">
                        <h1>My Profile</h1>
                        <p>View and manage your personal information.</p>
                    </div>

                    <section className="resident-profile-card">
                        <div className="resident-profile-header">
                            <div className="resident-profile-avatar">
                                {profile.fullName.charAt(0).toUpperCase()}
                            </div>

                            <div>
                                <h2>{profile.fullName}</h2>
                                <p>{profile.role} · House {profile.houseNumber}</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <h3>Personal Information</h3>

                            <div className="resident-profile-grid">
                                <div className="resident-profile-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={profile.fullName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="resident-profile-group">
                                    <label>Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={profile.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="resident-profile-group">
                                    <label>Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={profile.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="resident-profile-group">
                                    <label>House Number</label>
                                    <input
                                        type="text"
                                        value={profile.houseNumber}
                                        disabled
                                    />
                                </div>

                                <div className="resident-profile-group full-width">
                                    <label>Residential Address</label>
                                    <input
                                        type="text"
                                        value={profile.address}
                                        disabled
                                    />
                                </div>
                            </div>

                            {message && (
                                <p className="profile-success-message">
                                    {message}
                                </p>
                            )}

                            <button
                                type="submit"
                                className="save-profile-btn"
                            >
                                Save Changes
                            </button>
                        </form>
                    </section>
                </div>
            </main>
        </div>
    );
}

export default ResidentProfile;
