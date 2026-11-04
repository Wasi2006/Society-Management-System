
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";
import StatCard from "../../components/admin/StatCard";

import "../../styles/AdminDashboard.css";

function AdminDashboard() {

    const stats = [
        {
            title: "Total Residents",
            value: "120",
            description: "Registered residents",
            icon: "♙",
            color: "blue"
        },
        {
            title: "Total Collection",
            value: "Rs. 240,000",
            description: "Payments received",
            icon: "₹",
            color: "green"
        },
        {
            title: "Pending Payments",
            value: "25",
            description: "Awaiting payment",
            icon: "◷",
            color: "orange"
        },
        {
            title: "Open Complaints",
            value: "12",
            description: "Require attention",
            icon: "!",
            color: "red"
        }
    ];

    const complaints = [
        {
            id: "CMP-001",
            resident: "Ali Ahmed",
            category: "Water Supply",
            date: "04 Nov 2026",
            status: "Pending"
        },
        {
            id: "CMP-002",
            resident: "Usman Khan",
            category: "Electricity",
            date: "03 Nov 2026",
            status: "In Progress"
        },
        {
            id: "CMP-003",
            resident: "Hassan Ali",
            category: "Maintenance",
            date: "02 Nov 2026",
            status: "Resolved"
        },
        {
            id: "CMP-004",
            resident: "Ahmed Raza",
            category: "Security",
            date: "01 Nov 2026",
            status: "Pending"
        }
    ];

    const payments = [
        {
            resident: "Ali Ahmed",
            house: "A-101",
            amount: "Rs. 5,000",
            status: "Paid"
        },
        {
            resident: "Usman Khan",
            house: "B-204",
            amount: "Rs. 5,000",
            status: "Unpaid"
        },
        {
            resident: "Hassan Ali",
            house: "C-105",
            amount: "Rs. 5,000",
            status: "Paid"
        }
    ];

    return (
        <div className="admin-layout">

            <AdminSidebar />

            <main className="admin-main">

                <AdminNavbar />

                <div className="dashboard-content">

                    <div className="dashboard-title">
                        <div>
                            <h1>Dashboard Overview</h1>
                            <p>Here's what's happening in your society today.</p>
                        </div>

                        <span className="dashboard-date">
                            November 2026
                        </span>
                    </div>

                    <div className="stats-grid">

                        {stats.map((stat, index) => (
                            <StatCard key={index} {...stat} />
                        ))}

                    </div>

                    <section className="dashboard-section">

                        <div className="section-heading">
                            <div>
                                <h2>Recent Complaints</h2>
                                <p>Monitor and manage resident complaints</p>
                            </div>

                            <button className="primary-btn">
                                View All Complaints
                            </button>
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

                                    {complaints.map(item => (
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
                                        </tr>
                                    ))}

                                </tbody>

                            </table>

                        </div>

                    </section>

                    <section className="dashboard-section">

                        <div className="section-heading">
                            <div>
                                <h2>Recent Payments</h2>
                                <p>Latest resident payment records</p>
                            </div>

                            <button className="primary-btn">
                                View All Payments
                            </button>
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

                                    {payments.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.resident}</td>
                                            <td>{item.house}</td>
                                            <td>{item.amount}</td>
                                            <td>
                                                <span className={`status-badge ${item.status.toLowerCase()}`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}

                                </tbody>

                            </table>

                        </div>

                    </section>

                </div>

            </main>

        </div>
    );
}

export default AdminDashboard;
