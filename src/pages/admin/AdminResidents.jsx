
import { useState, useEffect } from "react";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";

import "../../styles/AdminResidents.css";

const API_URL = "http://localhost:5000/api/residents";

function AdminResidents() {

    const [residents, setResidents] = useState([]);

    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    const emptyForm = {
        name: "",
        email: "",
        phone: "",
        house: "",
        status: "Active"
    };

    const [formData, setFormData] = useState(emptyForm);

    // GET ALL RESIDENTS
    const fetchResidents = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error("Failed to fetch residents.");
            }

            const data = await response.json();

            // Map backend fields to frontend fields
            const formattedResidents = data.map(resident => ({
                id: resident._id,
                name: resident.residentName,
                email: resident.email,
                phone: resident.phone,
                house: resident.house,
                status: resident.status
            }));

            setResidents(formattedResidents);
        }
        catch (error) {
            setError(error.message);
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResidents();
    }, []);

    // SEARCH
    const filteredResidents = residents.filter(resident =>
        `${resident.name} ${resident.email} ${resident.house}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    // FORM INPUT HANDLING
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // ADD / UPDATE RESIDENT
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");

            const residentData = {
                residentName: formData.name,
                email: formData.email,
                phone: formData.phone,
                house: formData.house,
                status: formData.status
            };

            const url = editingId
                ? `${API_URL}/${editingId}`
                : API_URL;

            const method = editingId ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(residentData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Operation failed.");
            }

            await fetchResidents();

            closeForm();

        }
        catch (error) {
            setError(error.message);
        }
        finally {
            setSaving(false);
        }
    };

    // EDIT RESIDENT
    const handleEdit = (resident) => {
        setEditingId(resident.id);

        setFormData({
            name: resident.name,
            email: resident.email,
            phone: resident.phone,
            house: resident.house,
            status: resident.status
        });

        setShowForm(true);
    };

    // DELETE RESIDENT
    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this resident?"
        );

        if (!confirmed) return;

        try {
            setError("");

            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE"
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to delete resident.");
            }

            await fetchResidents();

        }
        catch (error) {
            setError(error.message);
        }
    };

    // CLOSE FORM
    const closeForm = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData(emptyForm);
    };

    return (
        <div className="admin-layout">

            <AdminSidebar />

            <main className="admin-main">

                <AdminNavbar />

                <div className="residents-content">

                    <div className="residents-heading">
                        <div>
                            <h1>Residents Management</h1>
                            <p>Manage registered society residents and their details.</p>
                        </div>

                        <button
                            className="primary-btn"
                            onClick={() => {
                                closeForm();
                                setShowForm(true);
                            }}
                        >
                            + Add Resident
                        </button>
                    </div>

                    {error && (
                        <p className="error-message">{error}</p>
                    )}

                    <div className="resident-summary">

                        <div className="resident-stat">
                            <span>Total Residents</span>
                            <h2>{residents.length}</h2>
                        </div>

                        <div className="resident-stat">
                            <span>Active Residents</span>
                            <h2>
                                {residents.filter(r => r.status === "Active").length}
                            </h2>
                        </div>

                        <div className="resident-stat">
                            <span>Inactive Residents</span>
                            <h2>
                                {residents.filter(r => r.status === "Inactive").length}
                            </h2>
                        </div>

                    </div>

                    <section className="residents-section">

                        <div className="residents-toolbar">
                            <input
                                type="text"
                                placeholder="Search by name, email or house..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="table-wrapper">

                            <table className="admin-table">

                                <thead>
                                    <tr>
                                        <th>Resident</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>House No.</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {loading ? (
                                        <tr>
                                            <td colSpan="6" className="empty-message">
                                                Loading residents...
                                            </td>
                                        </tr>
                                    ) : (
                                        <>
                                            {filteredResidents.map(resident => (
                                                <tr key={resident.id}>

                                                    <td>{resident.name}</td>
                                                    <td>{resident.email}</td>
                                                    <td>{resident.phone}</td>
                                                    <td>{resident.house}</td>

                                                    <td>
                                                        <span className={`status-badge ${resident.status.toLowerCase()}`}>
                                                            {resident.status}
                                                        </span>
                                                    </td>

                                                    <td className="resident-actions">

                                                        <button
                                                            className="edit-btn"
                                                            onClick={() => handleEdit(resident)}
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            className="delete-btn"
                                                            onClick={() => handleDelete(resident.id)}
                                                        >
                                                            Delete
                                                        </button>

                                                    </td>

                                                </tr>
                                            ))}

                                            {filteredResidents.length === 0 && (
                                                <tr>
                                                    <td colSpan="6" className="empty-message">
                                                        No residents found.
                                                    </td>
                                                </tr>
                                            )}
                                        </>
                                    )}

                                </tbody>

                            </table>

                        </div>

                    </section>

                    {showForm && (

                        <div className="resident-modal-overlay">

                            <div className="resident-modal">

                                <div className="modal-heading">
                                    <h2>
                                        {editingId
                                            ? "Edit Resident"
                                            : "Add New Resident"}
                                    </h2>

                                    <button
                                        className="modal-close"
                                        onClick={closeForm}
                                    >
                                        ×
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit}>

                                    <label>Full Name</label>
                                    <input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter resident name"
                                        required
                                    />

                                    <label>Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter email"
                                        required
                                    />

                                    <label>Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Enter phone number"
                                        required
                                    />

                                    <label>House Number</label>
                                    <input
                                        name="house"
                                        value={formData.house}
                                        onChange={handleChange}
                                        placeholder="e.g. A-101"
                                        required
                                    />

                                    <label>Resident Status</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>

                                    <div className="modal-actions">

                                        <button
                                            type="button"
                                            className="cancel-btn"
                                            onClick={closeForm}
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="submit"
                                            className="primary-btn"
                                            disabled={saving}
                                        >
                                            {saving
                                                ? "Saving..."
                                                : editingId
                                                    ? "Save Changes"
                                                    : "Add Resident"}
                                        </button>

                                    </div>

                                </form>

                            </div>

                        </div>

                    )}

                </div>

            </main>

        </div>
    );
}

export default AdminResidents;
