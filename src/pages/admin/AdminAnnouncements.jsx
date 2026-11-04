
import { useState } from "react";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";

import "../../styles/AdminAnnouncements.css";

function AdminAnnouncements() {

    const [announcements, setAnnouncements] = useState([
        {
            id: 1,
            title: "Monthly Maintenance Payment",
            description: "All residents are requested to submit their monthly maintenance fees before the 10th.",
            audience: "All Residents",
            date: "05 Nov 2026"
        },
        {
            id: 2,
            title: "Water Supply Maintenance",
            description: "Water supply will be temporarily interrupted due to maintenance work.",
            audience: "All Residents",
            date: "04 Nov 2026"
        }
    ]);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        audience: "All Residents"
    });

    const [search, setSearch] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handlePublish = (e) => {
        e.preventDefault();

        const today = new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });

        const newAnnouncement = {
            ...formData,
            id: Date.now(),
            date: today
        };

        setAnnouncements(previous => [
            newAnnouncement,
            ...previous
        ]);

        setFormData({
            title: "",
            description: "",
            audience: "All Residents"
        });
    };

    const handleDelete = (id) => {
        if (window.confirm("Delete this announcement?")) {
            setAnnouncements(previous =>
                previous.filter(item => item.id !== id)
            );
        }
    };

    const filteredAnnouncements = announcements.filter(item =>
        `${item.title} ${item.description}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
        <div className="admin-layout">

            <AdminSidebar />

            <main className="admin-main">

                <AdminNavbar />

                <div className="announcements-content">

                    <div className="announcements-heading">
                        <div>
                            <h1>Announcements</h1>
                            <p>Create and manage society announcements.</p>
                        </div>
                    </div>

                    <div className="announcement-layout">

                        <section className="announcement-form-section">

                            <h2>Create Announcement</h2>
                            <p>Share important information with residents.</p>

                            <form onSubmit={handlePublish}>

                                <label>Announcement Title</label>

                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Enter announcement title"
                                    required
                                />

                                <label>Description</label>

                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Write your announcement..."
                                    required
                                />

                                <label>Target Audience</label>

                                <select
                                    name="audience"
                                    value={formData.audience}
                                    onChange={handleChange}
                                >
                                    <option value="All Residents">
                                        All Residents
                                    </option>

                                    <option value="Block A">
                                        Block A
                                    </option>

                                    <option value="Block B">
                                        Block B
                                    </option>

                                    <option value="Block C">
                                        Block C
                                    </option>
                                </select>

                                <button
                                    type="submit"
                                    className="primary-btn"
                                >
                                    Publish Announcement
                                </button>

                            </form>

                        </section>

                        <section className="announcement-list-section">

                            <div className="announcement-list-heading">
                                <div>
                                    <h2>Published Announcements</h2>
                                    <p>
                                        {announcements.length} announcements
                                    </p>
                                </div>
                            </div>

                            <input
                                className="announcement-search"
                                type="text"
                                placeholder="Search announcements..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />

                            <div className="announcement-list">

                                {filteredAnnouncements.map(item => (

                                    <article
                                        className="announcement-card"
                                        key={item.id}
                                    >

                                        <div className="announcement-card-top">
                                            <span className="announcement-tag">
                                                {item.audience}
                                            </span>

                                            <button
                                                className="announcement-delete"
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>

                                        <h3>{item.title}</h3>

                                        <p>{item.description}</p>

                                        <span className="announcement-date">
                                            Published: {item.date}
                                        </span>

                                    </article>

                                ))}

                                {filteredAnnouncements.length === 0 && (
                                    <p className="empty-message">
                                        No announcements found.
                                    </p>
                                )}

                            </div>

                        </section>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default AdminAnnouncements;
