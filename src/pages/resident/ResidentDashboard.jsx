
import ResidentSidebar from "../../components/resident/ResidentSidebar";
import ResidentNavbar from "../../components/resident/ResidentNavbar";
import "../../styles/ResidentDashboard.css";

function ResidentDashboard() {

    const stats = [
        {
            title: "Monthly Maintenance",
            value: "Rs. 5,000",
            description: "Monthly society fee",
            icon: "₹",
            color: "blue"
        },
        {
            title: "Total Paid",
            value: "Rs. 25,000",
            description: "Payments made this year",
            icon: "✓",
            color: "green"
        },
        {
            title: "Outstanding Balance",
            value: "Rs. 5,000",
            description: "November 2026",
            icon: "!",
            color: "orange"
        },
        {
            title: "My Complaints",
            value: "2",
            description: "1 pending, 1 resolved",
            icon: "▤",
            color: "purple"
        }
    ];

    const payments = [
        {
            month: "October 2026",
            amount: "Rs. 5,000",
            date: "05 Oct 2026",
            status: "Paid"
        },
        {
            month: "September 2026",
            amount: "Rs. 5,000",
            date: "04 Sep 2026",
            status: "Paid"
        },
        {
            month: "August 2026",
            amount: "Rs. 5,000",
            date: "06 Aug 2026",
            status: "Paid"
        }
    ];

    const announcements = [
        {
            title: "Water Supply Maintenance",
            description: "Water supply may be interrupted on Sunday due to maintenance work.",
            date: "04 Nov 2026"
        },
        {
            title: "Monthly Maintenance Fee",
            description: "November maintenance fees are now available. Please check your payment section.",
            date: "01 Nov 2026"
        }
    ];

    return (
        <div className="resident-layout">

            <ResidentSidebar />

            <main className="resident-main">

                <ResidentNavbar />

                <div className="resident-dashboard-content">

                    {/* Welcome Section */}

                    <div className="resident-welcome">
                        <div>
                            <h1>Welcome back, Ali! 👋</h1>
                            <p>Here's an overview of your society account.</p>
                        </div>

                        <div className="resident-house-info">
                            <span>House Number</span>
                            <strong>A-101</strong>
                        </div>
                    </div>

                    {/* Statistics */}

                    <div className="resident-stats-grid">

                        {stats.map((stat, index) => (
                            <div className="resident-stat-card" key={index}>

                                <div className={`resident-stat-icon ${stat.color}`}>
                                    {stat.icon}
                                </div>

                                <div className="resident-stat-details">
                                    <p>{stat.title}</p>
                                    <h2>{stat.value}</h2>
                                    <span>{stat.description}</span>
                                </div>

                            </div>
                        ))}

                    </div>

                    {/* Payment and Complaint Sections */}

                    <div className="resident-dashboard-grid">

                        <section className="resident-dashboard-card">

                            <div className="resident-section-heading">
                                <div>
                                    <h2>Recent Payments</h2>
                                    <p>Your latest maintenance payments</p>
                                </div>
                            </div>

                            <div className="resident-table-wrapper">

                                <table className="resident-table">

                                    <thead>
                                        <tr>
                                            <th>Month</th>
                                            <th>Amount</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {payments.map((payment, index) => (
                                            <tr key={index}>
                                                <td>{payment.month}</td>
                                                <td>{payment.amount}</td>
                                                <td>{payment.date}</td>
                                                <td>
                                                    <span className="resident-status paid">
                                                        {payment.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>

                                </table>

                            </div>

                        </section>

                        <section className="resident-dashboard-card">

                            <div className="resident-section-heading">
                                <div>
                                    <h2>Complaint Overview</h2>
                                    <p>Track your submitted complaints</p>
                                </div>
                            </div>

                            <div className="resident-complaint-item">

                                <div>
                                    <strong>Water Leakage</strong>
                                    <span>Submitted: 02 Nov 2026</span>
                                </div>

                                <span className="resident-status pending">
                                    Pending
                                </span>

                            </div>

                            <div className="resident-complaint-item">

                                <div>
                                    <strong>Street Light Issue</strong>
                                    <span>Submitted: 25 Oct 2026</span>
                                </div>

                                <span className="resident-status resolved">
                                    Resolved
                                </span>

                            </div>

                        </section>

                    </div>

                    {/* Announcements */}

                    <section className="resident-dashboard-card resident-announcements">

                        <div className="resident-section-heading">
                            <div>
                                <h2>Latest Announcements</h2>
                                <p>Updates from society administration</p>
                            </div>
                        </div>

                        {announcements.map((announcement, index) => (
                            <div className="resident-announcement-item" key={index}>

                                <div className="announcement-indicator"></div>

                                <div className="announcement-content">
                                    <h3>{announcement.title}</h3>
                                    <p>{announcement.description}</p>
                                    <span>{announcement.date}</span>
                                </div>

                            </div>
                        ))}

                    </section>

                </div>

            </main>

        </div>
    );
}

export default ResidentDashboard;
