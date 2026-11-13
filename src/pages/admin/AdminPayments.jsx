
import { useState, useEffect } from "react";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";

import "../../styles/AdminPayments.css";

const API_URL = "http://localhost:5000/api/payments";

const MONTHLY_FEE = 5000;

function AdminPayments() {

    const [selectedMonth, setSelectedMonth] = useState("2026-11");
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");

    const [payments, setPayments] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [rejectingPayment, setRejectingPayment] = useState(null);
    const [rejectionReason, setRejectionReason] = useState("");

    // FETCH ALL PAYMENTS

    const fetchPayments = async () => {

        try {
            setLoading(true);
            setError("");

            const response = await fetch(API_URL);

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch payments.");
            }

            setPayments(data);

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    // FORMAT DATE

    const formatDate = (date) => {

        if (!date) return "-";

        return new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    // FORMAT MONTH

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

    // FILTER PAYMENTS BY MONTH

    const monthPayments = payments.filter(
        payment => payment.month === selectedMonth
    );

    const filteredPayments = monthPayments.filter(payment => {

        const matchesSearch =
            (payment.resident || "").toLowerCase().includes(search.toLowerCase()) ||
            (payment.house || "").toLowerCase().includes(search.toLowerCase());

        const matchesStatus =
            filter === "All" || payment.status === filter;

        return matchesSearch && matchesStatus;
    });

    // SUMMARY CALCULATIONS

    const totalCollection = monthPayments
        .filter(payment => payment.status === "Paid")
        .reduce((total, payment) => total + payment.amount, 0);

    const outstandingAmount = monthPayments
        .filter(payment => payment.status !== "Paid")
        .reduce((total, payment) => total + payment.amount, 0);

    const pendingCount = monthPayments.filter(
        payment => payment.status === "Pending"
    ).length;

    // GENERATE MONTHLY BILLS

    const generateMonthlyBills = async () => {

        try {
            setSaving(true);
            setError("");
            setMessage("");

            const dueDate = `${selectedMonth}-10`;

            const response = await fetch(`${API_URL}/generate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    month: selectedMonth,
                    dueDate,
                    amount: MONTHLY_FEE
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to generate bills.");
            }

            setMessage(data.message);

            await fetchPayments();

        } catch (error) {
            setError(error.message);
        } finally {
            setSaving(false);
        }
    };

    // VERIFY PAYMENT

    const verifyPayment = async (paymentId) => {

        try {
            setSaving(true);
            setError("");
            setMessage("");

            const response = await fetch(
                `${API_URL}/verify/${paymentId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        status: "Paid"
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Payment verification failed.");
            }

            setMessage(data.message);

            await fetchPayments();

        } catch (error) {
            setError(error.message);
        } finally {
            setSaving(false);
        }
    };

    // REJECT PAYMENT

    const rejectPayment = async () => {

        if (!rejectionReason.trim()) {
            setError("Please enter a rejection reason.");
            return;
        }

        try {
            setSaving(true);
            setError("");
            setMessage("");

            const response = await fetch(
                `${API_URL}/verify/${rejectingPayment}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        status: "Rejected",
                        rejectionReason: rejectionReason.trim()
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Payment rejection failed.");
            }

            setMessage(data.message);

            setRejectingPayment(null);
            setRejectionReason("");

            await fetchPayments();

        } catch (error) {
            setError(error.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="admin-layout">

            <AdminSidebar />

            <main className="admin-main">

                <AdminNavbar />

                <div className="payments-content">

                    {/* PAGE HEADING */}

                    <div className="payments-heading">

                        <div>
                            <h1>Maintenance Payments</h1>
                            <p>Manage monthly society maintenance fees.</p>
                        </div>

                        <button
                            className="primary-btn"
                            onClick={generateMonthlyBills}
                            disabled={saving}
                        >
                            {saving ? "Please Wait..." : "+ Generate Monthly Bills"}
                        </button>

                    </div>

                    {/* BILLING CONTROLS */}

                    <div className="billing-controls">

                        <div>
                            <label htmlFor="billing-month">
                                Billing Month
                            </label>

                            <input
                                id="billing-month"
                                type="month"
                                value={selectedMonth}
                                onChange={e => {
                                    setSelectedMonth(e.target.value);
                                    setMessage("");
                                    setError("");
                                }}
                            />
                        </div>

                        <div className="monthly-fee-info">
                            <span>Monthly Maintenance Fee</span>
                            <strong>
                                Rs. {MONTHLY_FEE.toLocaleString("en-PK")}
                            </strong>
                        </div>

                    </div>

                    {/* MESSAGES */}

                    {message && (
                        <div className="payment-message">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="payment-error">
                            {error}
                        </div>
                    )}

                    {/* SUMMARY CARDS */}

                    <div className="payment-summary">

                        <div className="payment-stat">
                            <span>Total Bills</span>
                            <h2>{monthPayments.length}</h2>
                            <p>{formatMonth(selectedMonth)}</p>
                        </div>

                        <div className="payment-stat">
                            <span>Total Collection</span>
                            <h2>
                                Rs. {totalCollection.toLocaleString("en-PK")}
                            </h2>
                            <p>Verified payments</p>
                        </div>

                        <div className="payment-stat">
                            <span>Pending Payments</span>
                            <h2>{pendingCount}</h2>
                            <p>Awaiting verification</p>
                        </div>

                        <div className="payment-stat">
                            <span>Outstanding Dues</span>
                            <h2>
                                Rs. {outstandingAmount.toLocaleString("en-PK")}
                            </h2>
                            <p>Payments not verified</p>
                        </div>

                    </div>

                    {/* PAYMENT RECORDS */}

                    <section className="payments-section">

                        <div className="payments-section-heading">
                            <div>
                                <h2>Monthly Payment Records</h2>
                                <p>View and verify resident payments.</p>
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
                                <option value="Unpaid">Unpaid</option>
                                <option value="Pending">Pending</option>
                                <option value="Paid">Paid</option>
                                <option value="Rejected">Rejected</option>
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
                                        <th>Payment Method</th>
                                        <th>Transaction Reference</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {loading ? (

                                        <tr>
                                            <td colSpan="8" className="empty-message">
                                                Loading payment records...
                                            </td>
                                        </tr>

                                    ) : filteredPayments.length > 0 ? (

                                        filteredPayments.map(payment => (

                                            <tr key={payment._id}>

                                                <td>{payment.resident}</td>

                                                <td>{payment.house}</td>

                                                <td>
                                                    Rs. {payment.amount.toLocaleString("en-PK")}
                                                </td>

                                                <td>{formatDate(payment.dueDate)}</td>

                                                <td>{payment.paymentMethod || "-"}</td>

                                                <td>{payment.transactionReference || "-"}</td>

                                                <td>
                                                    <span className={`status-badge ${payment.status.toLowerCase()}`}>
                                                        {payment.status}
                                                    </span>
                                                </td>

                                                <td>

                                                    {payment.status === "Pending" ? (

                                                        <div className="payment-actions">

                                                            <button
                                                                className="mark-paid-btn"
                                                                onClick={() => verifyPayment(payment._id)}
                                                                disabled={saving}
                                                            >
                                                                Verify
                                                            </button>

                                                            <button
                                                                className="reject-payment-btn"
                                                                onClick={() => {
                                                                    setRejectingPayment(payment._id);
                                                                    setRejectionReason("");
                                                                    setError("");
                                                                }}
                                                                disabled={saving}
                                                            >
                                                                Reject
                                                            </button>

                                                        </div>

                                                    ) : payment.status === "Paid" ? (

                                                        <span className="paid-label">
                                                            ✓ Verified
                                                        </span>

                                                    ) : payment.status === "Rejected" ? (

                                                        <span
                                                            className="rejection-info"
                                                            title={payment.rejectionReason}
                                                        >
                                                            Rejected
                                                        </span>

                                                    ) : (

                                                        <span className="paid-label">
                                                            Awaiting Payment
                                                        </span>

                                                    )}

                                                </td>

                                            </tr>

                                        ))

                                    ) : (

                                        <tr>
                                            <td colSpan="8" className="empty-message">
                                                No payment records found for this selection.
                                            </td>
                                        </tr>

                                    )}

                                </tbody>

                            </table>

                        </div>

                    </section>

                </div>

                {/* REJECTION MODAL */}

                {rejectingPayment && (

                    <div className="payment-modal-overlay">

                        <div className="payment-modal">

                            <h2>Reject Payment</h2>

                            <p>
                                Please provide a reason for rejecting this payment.
                            </p>

                            <textarea
                                value={rejectionReason}
                                onChange={e => setRejectionReason(e.target.value)}
                                placeholder="Enter rejection reason..."
                                rows="4"
                            />

                            <div className="payment-modal-actions">

                                <button
                                    className="cancel-btn"
                                    onClick={() => {
                                        setRejectingPayment(null);
                                        setRejectionReason("");
                                        setError("");
                                    }}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>

                                <button
                                    className="reject-payment-btn"
                                    onClick={rejectPayment}
                                    disabled={saving}
                                >
                                    {saving ? "Processing..." : "Confirm Rejection"}
                                </button>

                            </div>

                        </div>

                    </div>

                )}

            </main>

        </div>
    );
}

export default AdminPayments;
