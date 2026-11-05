
import ResidentSidebar from "../../components/resident/ResidentSidebar";
import ResidentNavbar from "../../components/resident/ResidentNavbar";
import "../../styles/ResidentPayments.css";

function ResidentPayments() {
    const payments = [
        {
            id: 1,
            month: "November 2026",
            amount: 5000,
            date: "-",
            status: "Pending",
        },
        {
            id: 2,
            month: "October 2026",
            amount: 5000,
            date: "05 Oct 2026",
            status: "Paid",
        },
        {
            id: 3,
            month: "September 2026",
            amount: 5000,
            date: "04 Sep 2026",
            status: "Paid",
        },
        {
            id: 4,
            month: "August 2026",
            amount: 5000,
            date: "06 Aug 2026",
            status: "Paid",
        },
        {
            id: 5,
            month: "July 2026",
            amount: 5000,
            date: "03 Jul 2026",
            status: "Paid",
        },
    ];

    const totalPaid = payments
        .filter((payment) => payment.status === "Paid")
        .reduce((total, payment) => total + payment.amount, 0);

    const outstanding = payments
        .filter((payment) => payment.status === "Pending")
        .reduce((total, payment) => total + payment.amount, 0);

    return (
        <div className="resident-layout">
            <ResidentSidebar />

            <main className="resident-main">
                <ResidentNavbar />

                <div className="resident-page-content">
                    <div className="resident-page-heading">
                        <div>
                            <h1>My Payments</h1>
                            <p>View your monthly maintenance fee records.</p>
                        </div>
                    </div>

                    <div className="payment-summary-grid">
                        <div className="payment-summary-card">
                            <p>Total Paid</p>
                            <h2>Rs. {totalPaid.toLocaleString("en-PK")}</h2>
                        </div>

                        <div className="payment-summary-card">
                            <p>Outstanding Balance</p>
                            <h2>Rs. {outstanding.toLocaleString("en-PK")}</h2>
                        </div>

                        <div className="payment-summary-card">
                            <p>Monthly Maintenance Fee</p>
                            <h2>Rs. 5,000</h2>
                        </div>
                    </div>

                    <section className="resident-payment-section">
                        <div className="resident-section-heading">
                            <h2>Payment History</h2>
                            <span>{payments.length} Records</span>
                        </div>

                        <div className="resident-table-wrapper">
                            <table className="resident-payment-table">
                                <thead>
                                    <tr>
                                        <th>Month</th>
                                        <th>Amount</th>
                                        <th>Payment Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {payments.map((payment) => (
                                        <tr key={payment.id}>
                                            <td>{payment.month}</td>
                                            <td>
                                                Rs. {payment.amount.toLocaleString("en-PK")}
                                            </td>
                                            <td>{payment.date}</td>
                                            <td>
                                                <span
                                                    className={`resident-payment-status ${
                                                        payment.status === "Paid"
                                                            ? "payment-paid"
                                                            : "payment-pending"
                                                    }`}
                                                >
                                                    {payment.status}
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

export default ResidentPayments;
