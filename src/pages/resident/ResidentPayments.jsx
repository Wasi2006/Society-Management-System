
import { useState, useEffect } from "react";

import ResidentSidebar from "../../components/resident/ResidentSidebar";
import ResidentNavbar from "../../components/resident/ResidentNavbar";

import "../../styles/ResidentPayments.css";

const RESIDENTS_API = "http://localhost:5000/api/residents";
const PAYMENTS_API = "http://localhost:5000/api/payments";

function ResidentPayments() {

    const [residents, setResidents] = useState([]);
    const [selectedResident, setSelectedResident] = useState("");

    const [payments, setPayments] = useState([]);

    const [paymentMethod, setPaymentMethod] = useState("");
    const [transactionReference, setTransactionReference] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [loadingResidents, setLoadingResidents] = useState(true);
    const [loadingPayments, setLoadingPayments] = useState(false);
    const [submitting, setSubmitting] = useState(false);

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

    const formatMonth = (month) => {

        if (!month) return "-";

        const [year, monthNumber] = month.split("-");

        return new Date(
            Number(year),
            Number(monthNumber) - 1
        ).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric"
        });
    };

    // FETCH RESIDENTS

    const fetchResidents = async () => {

        try {
            setLoadingResidents(true);
            setError("");

            const response = await fetch(RESIDENTS_API);

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch residents.");
            }

            setResidents(data);

            if (data.length > 0) {
                setSelectedResident(data[0]._id);
            } else {
                setError("No residents found. Please add a resident first.");
            }

        } catch (error) {
            setError(error.message);
        } finally {
            setLoadingResidents(false);
        }
    };

    useEffect(() => {
        fetchResidents();
    }, []);

    // FETCH SELECTED RESIDENT'S PAYMENTS

    const fetchPayments = async () => {

        if (!selectedResident) return;

        try {
            setLoadingPayments(true);
            setError("");

            const response = await fetch(
                `${PAYMENTS_API}/resident/${selectedResident}`
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch payments.");
            }

            setPayments(data);

        } catch (error) {
            setError(error.message);
            setPayments([]);
        } finally {
            setLoadingPayments(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, [selectedResident]);

    // SELECTED RESIDENT

    const resident = residents.find(
        item => item._id === selectedResident
    );

    // CURRENT BILL

    const currentPayment =
        payments.find(payment =>
            ["Unpaid", "Rejected", "Pending"].includes(payment.status)
        ) || payments[0];

    // SUMMARY CALCULATIONS

    const totalPaid = payments
        .filter(payment => payment.status === "Paid")
        .reduce((total, payment) => total + payment.amount, 0);

    const outstanding = payments
        .filter(payment => payment.status !== "Paid")
        .reduce((total, payment) => total + payment.amount, 0);

    // SUBMIT PAYMENT

    const handlePaymentSubmit = async (e) => {

        e.preventDefault();

        if (!paymentMethod || !transactionReference.trim()) {
            setMessage("Please complete all payment details.");
            return;
        }

        if (!currentPayment) return;

        try {
            setSubmitting(true);
            setMessage("");
            setError("");

            const response = await fetch(
                `${PAYMENTS_API}/submit/${currentPayment._id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        paymentMethod,
                        transactionReference: transactionReference.trim()
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Payment submission failed.");
            }

            setMessage(data.message);

            setPaymentMethod("");
            setTransactionReference("");

            await fetchPayments();

        } catch (error) {
            setError(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (

        <div className="resident-layout">

            <ResidentSidebar />

            <main className="resident-main">

                <ResidentNavbar />

                <div className="resident-page-content">

                    {/* PAGE HEADING */}

                    <div className="resident-page-heading">

                        <div>
                            <h1>My Payments</h1>
                            <p>View your bills and manage maintenance payments.</p>
                        </div>

                    </div>

                    {/* TEMPORARY RESIDENT SELECTOR */}

                    <section className="resident-payment-section">

                        <div className="payment-form-group">

                            <label htmlFor="resident-selector">
                                Select Resident (Testing)
                            </label>

                            <select
                                id="resident-selector"
                                className="resident-selector"
                                value={selectedResident}
                                onChange={e => {
                                    setSelectedResident(e.target.value);
                                    setMessage("");
                                    setError("");
                                    setPaymentMethod("");
                                    setTransactionReference("");
                                }}
                                disabled={loadingResidents || residents.length === 0}
                            >

                                <option value="">
                                    {loadingResidents
                                        ? "Loading residents..."
                                        : "Select Resident"}
                                </option>

                                {residents.map(item => (

                                    <option key={item._id} value={item._id}>
                                        {item.residentName} - {item.house}
                                    </option>

                                ))}

                            </select>

                        </div>

                        {resident && (
                            <p>
                                Selected Resident: <strong>{resident.residentName}</strong>
                                {" | "}
                                House: <strong>{resident.house}</strong>
                            </p>
                        )}

                    </section>

                    {/* ERROR MESSAGE */}

                    {error && (
                        <div className="payment-rejection-message">
                            {error}
                        </div>
                    )}

                    {/* SUCCESS MESSAGE */}

                    {message && (
                        <div className="payment-message">
                            {message}
                        </div>
                    )}

                    {/* SUMMARY CARDS */}

                    <div className="payment-summary-grid">

                        <div className="payment-summary-card">
                            <p>Total Paid</p>
                            <h2>
                                Rs. {totalPaid.toLocaleString("en-PK")}
                            </h2>
                        </div>

                        <div className="payment-summary-card">
                            <p>Outstanding Balance</p>
                            <h2>
                                Rs. {outstanding.toLocaleString("en-PK")}
                            </h2>
                        </div>

                        <div className="payment-summary-card">
                            <p>Monthly Maintenance Fee</p>
                            <h2>Rs. 5,000</h2>
                        </div>

                    </div>

                    {/* CURRENT BILL */}

                    {loadingPayments ? (

                        <section className="resident-payment-section">
                            <p>Loading payment records...</p>
                        </section>

                    ) : currentPayment ? (

                        <section className="resident-payment-section">

                            <div className="resident-section-heading">

                                <h2>Current Maintenance Bill</h2>

                                <span className={`resident-payment-status payment-${currentPayment.status.toLowerCase()}`}>
                                    {currentPayment.status}
                                </span>

                            </div>

                            <div className="current-bill-details">

                                <div>
                                    <p>Billing Month</p>
                                    <strong>
                                        {formatMonth(currentPayment.month)}
                                    </strong>
                                </div>

                                <div>
                                    <p>Amount Due</p>
                                    <strong>
                                        Rs. {currentPayment.amount.toLocaleString("en-PK")}
                                    </strong>
                                </div>

                                <div>
                                    <p>Due Date</p>
                                    <strong>
                                        {formatDate(currentPayment.dueDate)}
                                    </strong>
                                </div>

                            </div>

                            {/* REJECTION REASON */}

                            {currentPayment.status === "Rejected" && (

                                <div className="payment-rejection-message">

                                    <strong>Payment Rejected</strong>

                                    <p>{currentPayment.rejectionReason}</p>

                                </div>

                            )}

                            {/* PAYMENT FORM */}

                            {(currentPayment.status === "Unpaid" ||
                              currentPayment.status === "Rejected") ? (

                                <form
                                    className="resident-payment-form"
                                    onSubmit={handlePaymentSubmit}
                                >

                                    <h3>Submit Your Payment</h3>

                                    <div className="payment-form-group">

                                        <label htmlFor="payment-method">
                                            Payment Method
                                        </label>

                                        <select
                                            id="payment-method"
                                            value={paymentMethod}
                                            onChange={e => setPaymentMethod(e.target.value)}
                                            required
                                        >

                                            <option value="">
                                                Select Payment Method
                                            </option>

                                            <option value="Bank Transfer">
                                                Bank Transfer
                                            </option>

                                            <option value="Easypaisa">
                                                Easypaisa
                                            </option>

                                            <option value="JazzCash">
                                                JazzCash
                                            </option>

                                        </select>

                                    </div>

                                    <div className="payment-form-group">

                                        <label htmlFor="transaction-reference">
                                            Transaction Reference
                                        </label>

                                        <input
                                            id="transaction-reference"
                                            type="text"
                                            placeholder="Enter transaction ID / reference"
                                            value={transactionReference}
                                            onChange={e => setTransactionReference(e.target.value)}
                                            required
                                        />

                                    </div>

                                    <button
                                        type="submit"
                                        className="submit-payment-btn"
                                        disabled={submitting}
                                    >
                                        {submitting
                                            ? "Submitting..."
                                            : "Submit Payment"}
                                    </button>

                                </form>

                            ) : currentPayment.status === "Pending" ? (

                                <div className="payment-submitted-message">
                                    Your payment has been submitted and is awaiting admin verification.
                                </div>

                            ) : (

                                <div className="payment-submitted-message">
                                    This bill has been paid successfully.
                                </div>

                            )}

                        </section>

                    ) : (

                        <section className="resident-payment-section">
                            <h2>No Payment Records</h2>
                            <p>No maintenance bills have been generated for this resident yet.</p>
                        </section>

                    )}

                    {/* PAYMENT HISTORY */}

                    <section className="resident-payment-section">

                        <div className="resident-section-heading">

                            <h2>Payment History</h2>

                            <span>
                                {payments.length} Records
                            </span>

                        </div>

                        <div className="resident-table-wrapper">

                            <table className="resident-payment-table">

                                <thead>

                                    <tr>
                                        <th>Month</th>
                                        <th>Amount</th>
                                        <th>Payment Method</th>
                                        <th>Transaction Reference</th>
                                        <th>Payment Date</th>
                                        <th>Status</th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {loadingPayments ? (

                                        <tr>
                                            <td colSpan="6">
                                                Loading payment history...
                                            </td>
                                        </tr>

                                    ) : payments.length > 0 ? (

                                        payments.map(payment => (

                                            <tr key={payment._id}>

                                                <td>{formatMonth(payment.month)}</td>

                                                <td>
                                                    Rs. {payment.amount.toLocaleString("en-PK")}
                                                </td>

                                                <td>
                                                    {payment.paymentMethod || "-"}
                                                </td>

                                                <td>
                                                    {payment.transactionReference || "-"}
                                                </td>

                                                <td>
                                                    {formatDate(payment.paymentDate)}
                                                </td>

                                                <td>

                                                    <span className={`resident-payment-status payment-${payment.status.toLowerCase()}`}>
                                                        {payment.status}
                                                    </span>

                                                </td>

                                            </tr>

                                        ))

                                    ) : (

                                        <tr>
                                            <td colSpan="6">
                                                No payment records found.
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

export default ResidentPayments;
