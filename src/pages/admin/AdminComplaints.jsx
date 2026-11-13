
import { useState, useEffect } from "react";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";

import "../../styles/AdminComplaints.css";

const API_URL = "http://localhost:5000/api/complaints";

function AdminComplaints() {
    const [complaints, setComplaints] = useState([]);

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");
    const [selectedId, setSelectedId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    // Fetch complaints from MongoDB
    const fetchComplaints = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(API_URL);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch complaints");
            }

            const formattedComplaints = data.complaints.map(item => ({
                id: item._id,
                resident: item.residentName,
                house: item.house || "Not provided",
                category: item.category,
                description: item.description,
                date: item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    })
                    : "N/A",
                status: item.status || "Pending",
                response: item.response || ""
            }));

            setComplaints(formattedComplaints);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    // Search and Filter
    const filteredComplaints = complaints.filter(item => {
        const matchesSearch =
            item.id.toLowerCase().includes(search.toLowerCase()) ||
            item.resident.toLowerCase().includes(search.toLowerCase()) ||
            item.category.toLowerCase().includes(search.toLowerCase());

        const matchesFilter =
            filter === "All" || item.status === filter;

        return matchesSearch && matchesFilter;
    });

    // Update status locally
    const updateStatus = (id, newStatus) => {
        setComplaints(previous =>
            previous.map(item =>
                item.id === id
                    ? { ...item, status: newStatus }
                    : item
            )
        );

        setMessage("");
    };

    // Update response locally
    const updateResponse = (id, newResponse) => {
        setComplaints(previous =>
            previous.map(item =>
                item.id === id
                    ? { ...item, response: newResponse }
                    : item
            )
        );

        setMessage("");
    };

    // Save status and response to MongoDB
    const saveChanges = async (id) => {
        try {
            setSaving(true);
            setError("");
            setMessage("");

            const selectedComplaint = complaints.find(
                item => item.id === id
            );

            const response = await fetch(`${API_URL}/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    status: selectedComplaint.status,
                    response: selectedComplaint.response
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to update complaint");
            }

            setMessage("Complaint updated successfully!");

            // Refresh data from backend
            await fetchComplaints();

        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="admin-layout">

            <AdminSidebar />

            <main className="admin-main">

                <AdminNavbar />

                <div className="complaints-content">

                    <div className="complaints-heading">
                        <div>
                            <h1>Complaints Management</h1>
                            <p>Review and manage complaints submitted by residents.</p>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="complaint-summary">

                        <div className="complaint-stat">
                            <span>Total Complaints</span>
                            <h2>{complaints.length}</h2>
                        </div>

                        <div className="complaint-stat">
                            <span>Pending</span>
                            <h2>
                                {complaints.filter(c => c.status === "Pending").length}
                            </h2>
                        </div>

                        <div className="complaint-stat">
                            <span>In Progress</span>
                            <h2>
                                {complaints.filter(c => c.status === "In Progress").length}
                            </h2>
                        </div>

                        <div className="complaint-stat">
                            <span>Resolved</span>
                            <h2>
                                {complaints.filter(c => c.status === "Resolved").length}
                            </h2>
                        </div>

                    </div>

                    <section className="complaints-section">

                        {/* Search and Filter */}
                        <div className="complaints-toolbar">

                            <input
                                type="text"
                                placeholder="Search by ID, resident or category..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />

                            <select
                                value={filter}
                                onChange={e => setFilter(e.target.value)}
                            >
                                <option value="All">All Complaints</option>
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Resolved">Resolved</option>
                            </select>

                        </div>

                        {error && (
                            <p className="response-note">{error}</p>
                        )}

                        {message && (
                            <p className="response-note">{message}</p>
                        )}

                        {/* Complaints Table */}
                        <div className="table-wrapper">

                            <table className="admin-table">

                                <thead>
                                    <tr>
                                        <th>Complaint ID</th>
                                        <th>Resident</th>
                                        <th>Category</th>
                                        <th>Submitted</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {loading ? (
                                        <tr>
                                            <td colSpan="6" className="empty-message">
                                                Loading complaints...
                                            </td>
                                        </tr>
                                    ) : (
                                        <>
                                            {filteredComplaints.map(item => (
                                                <tr key={item.id}>

                                                    <td>{item.id.slice(-6).toUpperCase()}</td>
                                                    <td>{item.resident}</td>
                                                    <td>{item.category}</td>
                                                    <td>{item.date}</td>

                                                    <td>
                                                        <span className={`status-badge ${item.status.toLowerCase().replace(" ", "-")}`}>
                                                            {item.status}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        <button
                                                            className="primary-btn"
                                                            onClick={() =>
                                                                setSelectedId(
                                                                    selectedId === item.id
                                                                        ? null
                                                                        : item.id
                                                                )
                                                            }
                                                        >
                                                            {selectedId === item.id
                                                                ? "Close"
                                                                : "Manage"}
                                                        </button>
                                                    </td>

                                                </tr>
                                            ))}

                                            {filteredComplaints.length === 0 && (
                                                <tr>
                                                    <td colSpan="6" className="empty-message">
                                                        No complaints found.
                                                    </td>
                                                </tr>
                                            )}
                                        </>
                                    )}

                                </tbody>

                            </table>

                        </div>

                        {/* Complaint Details */}
                        {filteredComplaints
                            .filter(item => item.id === selectedId)
                            .map(item => (

                                <div className="complaint-details" key={item.id}>

                                    <h2>
                                        Complaint Details — {item.id.slice(-6).toUpperCase()}
                                    </h2>

                                    <div className="complaint-info">
                                        <p><strong>Resident:</strong> {item.resident}</p>
                                        <p><strong>House:</strong> {item.house}</p>
                                        <p><strong>Category:</strong> {item.category}</p>
                                        <p><strong>Date:</strong> {item.date}</p>
                                    </div>

                                    <div className="complaint-description">
                                        <strong>Description</strong>
                                        <p>{item.description}</p>
                                    </div>

                                    <label>Update Complaint Status</label>

                                    <select
                                        value={item.status}
                                        onChange={e =>
                                            updateStatus(item.id, e.target.value)
                                        }
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Resolved">Resolved</option>
                                    </select>

                                    <label>Admin Response</label>

                                    <textarea
                                        placeholder="Write a response to the resident..."
                                        value={item.response}
                                        onChange={e =>
                                            updateResponse(item.id, e.target.value)
                                        }
                                    />

                                    <button
                                        className="primary-btn"
                                        onClick={() => saveChanges(item.id)}
                                        disabled={saving}
                                    >
                                        {saving ? "Saving..." : "Save Changes"}
                                    </button>

                                </div>

                            ))}

                    </section>

                </div>

            </main>

        </div>
    );
}

export default AdminComplaints;
