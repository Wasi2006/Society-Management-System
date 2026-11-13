
import { useState, useEffect } from "react";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";

import "../../styles/AdminAnnouncements.css";

const API_URL = "http://localhost:5000/api/announcements";

function AdminAnnouncements() {

    const [announcements, setAnnouncements] = useState([]);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        audience: "All Residents"
    });

    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [publishing, setPublishing] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    // Fetch Announcements
    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(API_URL);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to fetch announcements"
                );
            }

            setAnnouncements(Array.isArray(data) ? data : data.announcements || []);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    // Handle Form Changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Publish Announcement
    const handlePublish = async (e) => {
        e.preventDefault();

        try {
            setPublishing(true);
            setError("");
            setMessage("");

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to publish announcement"
                );
            }

            setMessage("Announcement published successfully!");

            setFormData({
                title: "",
                description: "",
                audience: "All Residents"
            });

            await fetchAnnouncements();

        } catch (err) {
            setError(err.message);
        } finally {
            setPublishing(false);
        }
    };

    // Delete Announcement
    const handleDelete = async (id) => {

        if (!window.confirm("Delete this announcement?")) {
            return;
        }

        try {
            setError("");
            setMessage("");

            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE"
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to delete announcement"
                );
            }

            setMessage("Announcement deleted successfully!");

            await fetchAnnouncements();

        } catch (err) {
            setError(err.message);
        }
    };

    // Format Date
    const formatDate = (date) => {
        if (!date) return "";

        return new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    // Search Announcements
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
                                    disabled={publishing}
                                >
                                    {publishing
                                        ? "Publishing..."
                                        : "Publish Announcement"}
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

                            {error && (
                                <p className="error-message">{error}</p>
                            )}

                            {message && (
                                <p className="success-message">{message}</p>
                            )}

                            <div className="announcement-list">

                                {loading ? (
                                    <p>Loading announcements...</p>
                                ) : (
                                    filteredAnnouncements.map(item => (

                                        <article
                                            className="announcement-card"
                                            key={item._id}
                                        >

                                            <div className="announcement-card-top">

                                                <span className="announcement-tag">
                                                    {item.audience}
                                                </span>

                                                <button
                                                    className="announcement-delete"
                                                    onClick={() =>
                                                        handleDelete(item._id)
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                            <h3>{item.title}</h3>

                                            <p>{item.description}</p>

                                            <span className="announcement-date">
                                                Published: {formatDate(
                                                    item.publishedAt
                                                )}
                                            </span>

                                        </article>

                                    ))
                                )}

                                {!loading &&
                                    filteredAnnouncements.length === 0 && (
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
