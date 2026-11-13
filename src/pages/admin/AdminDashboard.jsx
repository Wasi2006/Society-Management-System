
import { useEffect, useState } from "react";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";
import StatCard from "../../components/admin/StatCard";

import "../../styles/AdminDashboard.css";

const API_URL = "http://localhost:5000/api";

function AdminDashboard() {

    const [residents, setResidents] = useState([]);
    const [payments, setPayments] = useState([]);
    const [complaints, setComplaints] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch Dashboard Data
    useEffect(() => {

        const fetchDashboardData = async () => {

            try {
                setLoading(true);
                setError("");

                const [residentsRes, paymentsRes, complaintsRes] =
                    await Promise.all([
                        fetch(`${API_URL}/residents`),
                        fetch(`${API_URL}/payments`),
                        fetch(`${API_URL}/complaints`)
                    ]);

                if (
                    !residentsRes.ok ||
                    !paymentsRes.ok ||
                    !complaintsRes.ok
                ) {
                    throw new Error("Failed to fetch dashboard data");
                }

                const residentsData = await residentsRes.json();
                const paymentsData = await paymentsRes.json();
                const complaintsData = await complaintsRes.json();

                setResidents(
                    Array.isArray(residentsData)
                        ? residentsData
                        : residentsData.residents || []
                );

                setPayments(
                    Array.isArray(paymentsData)
                        ? paymentsData
                        : paymentsData.payments || []
                );

                setComplaints(
                    Array.isArray(complaintsData)
                        ? complaintsData
                        : complaintsData.complaints || []
                );

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }

        };

        fetchDashboardData();

    }, []);

    // Calculate Dashboard Statistics
    const paidPayments = payments.filter(
        payment => payment.status?.toLowerCase() === "paid"
    );

    const totalCollection = paidPayments.reduce(
        (total, payment) => total + Number(payment.amount || 0),
        0
    );

    const pendingPayments = payments.filter(
        payment => ["unpaid", "pending"].includes(
            payment.status?.toLowerCase()
        )
    );

    const openComplaints = complaints.filter(
        complaint => complaint.status?.toLowerCase() !== "resolved"
    );

    const stats = [
        {
            title: "Total Residents",
            value: residents.length,
            description: "Registered residents",
            icon: "♙",
            color: "blue"
        },
        {
            title: "Total Collection",
            value: `Rs. ${totalCollection.toLocaleString("en-PK")}`,
            description: "Payments received",
            icon: "₹",
            color: "green"
        },
        {
            title: "Pending Payments",
            value: pendingPayments.length,
            description: "Awaiting payment",
            icon: "◷",
            color: "orange"
        },
        {
            title: "Open Complaints",
            value: openComplaints.length,
            description: "Require attention",
            icon: "!",
            color: "red"
        }
    ];

    // Format Date
    const formatDate = (date) => {

        if (!date) return "N/A";

        return new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });

    };

    // Get Resident Name
    const getResidentName = (item) => {

        if (item.residentName) return item.residentName;

        if (item.residentId && typeof item.residentId === "object") {
            return item.residentId.residentName || "Unknown";
        }

        const resident = residents.find(
            resident => resident._id === item.residentId
        );

        return resident?.residentName || "Unknown";

    };

    // Get Recent Complaints
    const recentComplaints = [...complaints]
        .sort(
            (a, b) =>
                new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        )
        .slice(0, 4);

    // Get Recent Payments
    const recentPayments = [...payments]
        .sort(
            (a, b) =>
                new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        )
        .slice(0, 3);

    return (

        <div className="admin-layout">

            <AdminSidebar />

            <main className="admin-main">

                <AdminNavbar />

                <div className="dashboard-content">

                    <div className="dashboard-title">

                        <div>
                            <h1>Dashboard Overview</h1>
                            <p>
                                Here's what's happening in your society today.
                            </p>
                        </div>

                        <span className="dashboard-date">
                            {new Date().toLocaleDateString("en-US", {
                                month: "long",
                                year: "numeric"
                            })}
                        </span>

                    </div>

                    {error && (
                        <p className="error-message">{error}</p>
                    )}

                    {loading ? (

                        <p>Loading dashboard...</p>

                    ) : (

                        <>

                            {/* Statistics */}
                            <div className="stats-grid">

                                {stats.map((stat, index) => (
                                    <StatCard
                                        key={index}
                                        {...stat}
                                    />
                                ))}

                            </div>

                            {/* Recent Complaints */}
                            <section className="dashboard-section">

                                <div className="section-heading">

                                    <div>
                                        <h2>Recent Complaints</h2>
                                        <p>
                                            Monitor and manage resident complaints
                                        </p>
                                    </div>

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
                                            </tr>
                                        </thead>

                                        <tbody>

                                            {recentComplaints.length > 0 ? (

                                                recentComplaints.map(item => (

                                                    <tr key={item._id}>

                                                        <td>
                                                            {item._id?.slice(-6).toUpperCase()}
                                                        </td>

                                                        <td>
                                                            {getResidentName(item)}
                                                        </td>

                                                        <td>
                                                            {item.category || "General"}
                                                        </td>

                                                        <td>
                                                            {formatDate(item.createdAt)}
                                                        </td>

                                                        <td>
                                                            <span
                                                                className={`status-badge ${
                                                                    (item.status || "pending")
                                                                        .toLowerCase()
                                                                        .replace(" ", "-")
                                                                }`}
                                                            >
                                                                {item.status || "Pending"}
                                                            </span>
                                                        </td>

                                                    </tr>

                                                ))

                                            ) : (

                                                <tr>
                                                    <td colSpan="5">
                                                        No complaints found.
                                                    </td>
                                                </tr>

                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            </section>

                            {/* Recent Payments */}
                            <section className="dashboard-section">

                                <div className="section-heading">

                                    <div>
                                        <h2>Recent Payments</h2>
                                        <p>
                                            Latest resident payment records
                                        </p>
                                    </div>

                                </div>

                                <div className="table-wrapper">

                                    <table className="admin-table">

                                        <thead>
                                            <tr>
                                                <th>Resident</th>
                                                <th>House Number</th>
                                                <th>Amount</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>

                                        <tbody>

                                            {recentPayments.length > 0 ? (

                                                recentPayments.map(item => (

                                                    <tr key={item._id}>

                                                        <td>
                                                            {getResidentName(item)}
                                                        </td>

                                                        <td>
                                                            {item.house || "N/A"}
                                                        </td>

                                                        <td>
                                                            Rs. {Number(item.amount || 0).toLocaleString("en-PK")}
                                                        </td>

                                                        <td>
                                                            <span
                                                                className={`status-badge ${
                                                                    (item.status || "pending").toLowerCase()
                                                                }`}
                                                            >
                                                                {item.status || "Pending"}
                                                            </span>
                                                        </td>

                                                    </tr>

                                                ))

                                            ) : (

                                                <tr>
                                                    <td colSpan="4">
                                                        No payment records found.
                                                    </td>
                                                </tr>

                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            </section>

                        </>

                    )}

                </div>

            </main>

        </div>

    );

}

export default AdminDashboard;
