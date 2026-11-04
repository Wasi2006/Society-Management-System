
import { useState } from "react";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";

import "../../styles/AdminComplaints.css";

function AdminComplaints() {

    const [complaints, setComplaints] = useState([
        {
            id: "CMP-001",
            resident: "Ali Ahmed",
            house: "A-101",
            category: "Water Supply",
            description: "Water supply has been unavailable since yesterday.",
            date: "04 Nov 2026",
            status: "Pending",
            response: ""
        },
        {
            id: "CMP-002",
            resident: "Usman Khan",
            house: "B-204",
            category: "Electricity",
            description: "Street lights near our house are not working.",
            date: "03 Nov 2026",
            status: "In Progress",
            response: "Maintenance team has been informed."
        },
        {
            id: "CMP-003",
            resident: "Hassan Ali",
            house: "C-105",
            category: "Maintenance",
            description: "The road outside our house needs repair.",
            date: "02 Nov 2026",
            status: "Resolved",
            response: "The repair work has been completed."
        },
        {
            id: "CMP-004",
            resident: "Ahmed Raza",
            house: "A-205",
            category: "Security",
            description: "Security arrangements need improvement.",
            date: "01 Nov 2026",
            status: "Pending",
            response: ""
        }
    ]);

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");
    const [selectedId, setSelectedId] = useState(null);

    const filteredComplaints = complaints.filter(item => {

        const matchesSearch =
            item.id.toLowerCase().includes(search.toLowerCase()) ||
            item.resident.toLowerCase().includes(search.toLowerCase()) ||
            item.category.toLowerCase().includes(search.toLowerCase());

        const matchesFilter =
            filter === "All" || item.status === filter;

        return matchesSearch && matchesFilter;
    });

    const updateStatus = (id, newStatus) => {
        setComplaints(previous =>
            previous.map(item =>
                item.id === id
                    ? { ...item, status: newStatus }
                    : item
            )
        );
    };

    const updateResponse = (id, newResponse) => {
        setComplaints(previous =>
            previous.map(item =>
                item.id === id
                    ? { ...item, response: newResponse }
                    : item
            )
        );
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

                    <div className="complaint-summary">

                        <div className="complaint-stat">
                            <span>Total Complaints</span>
                            <h2>{complaints.length}</h2>
                        </div>

                        <div className="complaint-stat">
                            <span>Pending</span>
                            <h2>{complaints.filter(c => c.status === "Pending").length}</h2>
                        </div>

                        <div className="complaint-stat">
                            <span>In Progress</span>
                            <h2>{complaints.filter(c => c.status === "In Progress").length}</h2>
                        </div>

                        <div className="complaint-stat">
                            <span>Resolved</span>
                            <h2>{complaints.filter(c => c.status === "Resolved").length}</h2>
                        </div>

                    </div>

                    <section className="complaints-section">

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

                                    {filteredComplaints.map(item => (
                                        <tr key={item.id}>

                                            <td>{item.id}</td>
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

                                </tbody>

                            </table>

                        </div>

                        {filteredComplaints
                            .filter(item => item.id === selectedId)
                            .map(item => (

                                <div className="complaint-details" key={item.id}>

                                    <h2>Complaint Details — {item.id}</h2>

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

                                    <p className="response-note">
                                        Changes are currently stored in frontend state only.
                                    </p>

                                </div>

                            ))}

                    </section>

                </div>

            </main>

        </div>
    );
}

export default AdminComplaints;
