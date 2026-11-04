
import { useState } from "react";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";

import "../../styles/AdminPayments.css";

const MONTHLY_FEE = 5000;

const residents = [
    { id: 1, name: "Ali Ahmed", house: "A-101" },
    { id: 2, name: "Usman Khan", house: "B-204" },
    { id: 3, name: "Hassan Ali", house: "C-105" }
];

function AdminPayments() {

    const [selectedMonth, setSelectedMonth] = useState("2026-11");
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");
    const [message, setMessage] = useState("");

    const [payments, setPayments] = useState([
        {
            id: 1,
            residentId: 1,
            resident: "Ali Ahmed",
            house: "A-101",
            month: "2026-11",
            amount: MONTHLY_FEE,
            dueDate: "10 Nov 2026",
            status: "Paid",
            paymentDate: "05 Nov 2026"
        },
        {
            id: 2,
            residentId: 2,
            resident: "Usman Khan",
            house: "B-204",
            month: "2026-11",
            amount: MONTHLY_FEE,
            dueDate: "10 Nov 2026",
            status: "Unpaid",
            paymentDate: "-"
        },
        {
            id: 3,
            residentId: 3,
            resident: "Hassan Ali",
            house: "C-105",
            month: "2026-11",
            amount: MONTHLY_FEE,
            dueDate: "10 Nov 2026",
            status: "Paid",
            paymentDate: "04 Nov 2026"
        }
    ]);

    const monthPayments = payments.filter(
        payment => payment.month === selectedMonth
    );

    const filteredPayments = monthPayments.filter(payment => {

        const matchesSearch =
            payment.resident.toLowerCase().includes(search.toLowerCase()) ||
            payment.house.toLowerCase().includes(search.toLowerCase());

        const matchesStatus =
            filter === "All" || payment.status === filter;

        return matchesSearch && matchesStatus;
    });

    const totalCollection = monthPayments
        .filter(payment => payment.status === "Paid")
        .reduce((total, payment) => total + payment.amount, 0);

    const outstandingAmount = monthPayments
        .filter(payment => payment.status === "Unpaid")
        .reduce((total, payment) => total + payment.amount, 0);

    const markAsPaid = (paymentId) => {

        const today = new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });

        setPayments(previous =>
            previous.map(payment =>
                payment.id === paymentId
                    ? {
                        ...payment,
                        status: "Paid",
                        paymentDate: today
                    }
                    : payment
            )
        );
    };

    const generateMonthlyBills = () => {

        const existingResidentIds = payments
            .filter(payment => payment.month === selectedMonth)
            .map(payment => payment.residentId);

        const newResidents = residents.filter(
            resident => !existingResidentIds.includes(resident.id)
        );

        if (newResidents.length === 0) {
            setMessage("Bills have already been generated for all residents in this month.");
            return;
        }

        const [year, month] = selectedMonth.split("-");

        const dueDate = new Date(
            Number(year),
            Number(month) - 1,
            10
        ).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });

        const newBills = newResidents.map((resident, index) => ({
            id: Date.now() + index,
            residentId: resident.id,
            resident: resident.name,
            house: resident.house,
            month: selectedMonth,
            amount: MONTHLY_FEE,
            dueDate,
            status: "Unpaid",
            paymentDate: "-"
        }));

        setPayments(previous => [...previous, ...newBills]);

        setMessage(
            `${newBills.length} maintenance bill(s) generated successfully.`
        );
    };

    const formatMonth = (monthValue) => {
        if (!monthValue) return "";

        const [year, month] = monthValue.split("-");

        return new Date(
            Number(year),
            Number(month) - 1
        ).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric"
        });
    };

    return (
        <div className="admin-layout">

            <AdminSidebar />

            <main className="admin-main">

                <AdminNavbar />

                <div className="payments-content">

                    <div className="payments-heading">
                        <div>
                            <h1>Maintenance Payments</h1>
                            <p>Manage monthly society maintenance fees.</p>
                        </div>

                        <button
                            className="primary-btn"
                            onClick={generateMonthlyBills}
                        >
                            + Generate Monthly Bills
                        </button>
                    </div>

                    <div className="billing-controls">

                        <div>
                            <label htmlFor="billing-month">Billing Month</label>

                            <input
                                id="billing-month"
                                type="month"
                                value={selectedMonth}
                                onChange={e => {
                                    setSelectedMonth(e.target.value);
                                    setMessage("");
                                }}
                            />
                        </div>

                        <div className="monthly-fee-info">
                            <span>Monthly Maintenance Fee</span>
                            <strong>Rs. {MONTHLY_FEE.toLocaleString("en-PK")}</strong>
                        </div>

                    </div>

                    {message && (
                        <div className="payment-message">
                            {message}
                        </div>
                    )}

                    <div className="payment-summary">

                        <div className="payment-stat">
                            <span>Total Bills</span>
                            <h2>{monthPayments.length}</h2>
                            <p>{formatMonth(selectedMonth)}</p>
                        </div>

                        <div className="payment-stat">
                            <span>Total Collection</span>
                            <h2>Rs. {totalCollection.toLocaleString("en-PK")}</h2>
                            <p>Received maintenance fees</p>
                        </div>

                        <div className="payment-stat">
                            <span>Outstanding Dues</span>
                            <h2>Rs. {outstandingAmount.toLocaleString("en-PK")}</h2>
                            <p>Unpaid maintenance fees</p>
                        </div>

                    </div>

                    <section className="payments-section">

                        <div className="payments-section-heading">
                            <div>
                                <h2>Monthly Payment Records</h2>
                                <p>View and manage resident maintenance bills.</p>
                            </div>
                        </div>

                        <div className="payments-toolbar">

                            <input
                                type="text"
                                placeholder="Search resident or house number..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />

                            <select
                                value={filter}
                                onChange={e => setFilter(e.target.value)}
                            >
                                <option value="All">All Payments</option>
                                <option value="Paid">Paid</option>
                                <option value="Unpaid">Unpaid</option>
                            </select>

                        </div>

                        <div className="table-wrapper">

                            <table className="admin-table">

                                <thead>
                                    <tr>
                                        <th>Resident</th>
                                        <th>House No.</th>
                                        <th>Amount</th>
                                        <th>Due Date</th>
                                        <th>Payment Date</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {filteredPayments.map(payment => (

                                        <tr key={payment.id}>

                                            <td>{payment.resident}</td>
                                            <td>{payment.house}</td>
                                            <td>Rs. {payment.amount.toLocaleString("en-PK")}</td>
                                            <td>{payment.dueDate}</td>
                                            <td>{payment.paymentDate}</td>

                                            <td>
                                                <span className={`status-badge ${payment.status.toLowerCase()}`}>
                                                    {payment.status}
                                                </span>
                                            </td>

                                            <td>
                                                {payment.status === "Unpaid" ? (
                                                    <button
                                                        className="mark-paid-btn"
                                                        onClick={() => markAsPaid(payment.id)}
                                                    >
                                                        Mark Paid
                                                    </button>
                                                ) : (
                                                    <span className="paid-label">
                                                        <span>✓</span> Received
                                                    </span>
                                                )}
                                            </td>

                                        </tr>

                                    ))}

                                    {filteredPayments.length === 0 && (
                                        <tr>
                                            <td colSpan="7" className="empty-message">
                                                No payment records found for this selection.
                                            </td>
                                        </tr>
                                    )}

                                </tbody>

                            </table>

                        </div>

                    </section>

                </div>

            </main>

        </div>
    );
}

export default AdminPayments;
