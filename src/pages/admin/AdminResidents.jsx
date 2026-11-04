
import { useState } from "react";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";

import "../../styles/AdminResidents.css";

function AdminResidents() {

    const [residents, setResidents] = useState([
        {
            id: 1,
            name: "Ali Ahmed",
            email: "ali@gmail.com",
            phone: "03001234567",
            house: "A-101",
            status: "Active"
        },
        {
            id: 2,
            name: "Usman Khan",
            email: "usman@gmail.com",
            phone: "03011234567",
            house: "B-204",
            status: "Active"
        },
        {
            id: 3,
            name: "Hassan Ali",
            email: "hassan@gmail.com",
            phone: "03021234567",
            house: "C-105",
            status: "Inactive"
        }
    ]);

    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const emptyForm = {
        name: "",
        email: "",
        phone: "",
        house: "",
        status: "Active"
    };

    const [formData, setFormData] = useState(emptyForm);

    const filteredResidents = residents.filter(resident =>
        `${resident.name} ${resident.email} ${resident.house}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingId !== null) {
            setResidents(previous =>
                previous.map(resident =>
                    resident.id === editingId
                        ? { ...resident, ...formData }
                        : resident
                )
            );
        } else {
            setResidents(previous => [
                ...previous,
                {
                    ...formData,
                    id: Date.now()
                }
            ]);
        }

        closeForm();
    };

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

    const handleDelete = (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this resident?"
        );

        if (confirmed) {
            setResidents(previous =>
                previous.filter(resident => resident.id !== id)
            );
        }
    };

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

                    <div className="resident-summary">

                        <div className="resident-stat">
                            <span>Total Residents</span>
                            <h2>{residents.length}</h2>
                        </div>

                        <div className="resident-stat">
                            <span>Active Residents</span>
                            <h2>{residents.filter(r => r.status === "Active").length}</h2>
                        </div>

                        <div className="resident-stat">
                            <span>Inactive Residents</span>
                            <h2>{residents.filter(r => r.status === "Inactive").length}</h2>
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

                                </tbody>

                            </table>

                        </div>

                    </section>

                    {showForm && (

                        <div className="resident-modal-overlay">

                            <div className="resident-modal">

                                <div className="modal-heading">
                                    <h2>
                                        {editingId !== null
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
                                        >
                                            {editingId !== null
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
