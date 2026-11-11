
const Payment = require("../models/Payment");
const Resident = require("../models/Resident");

// 1. GENERATE MONTHLY BILLS (ADMIN)
const generateMonthlyBills = async (req, res) => {
    try {
        const { month, dueDate, amount = 5000 } = req.body;

        if (!month || !dueDate) {
            return res.status(400).json({
                message: "Month and due date are required!"
            });
        }

        const residents = await Resident.find({
            status: "Active"
        });

        const existingPayments = await Payment.find({ month });

        const existingResidentIds = existingPayments.map(
            payment => payment.residentId.toString()
        );

        const newBills = residents
            .filter(resident =>
                !existingResidentIds.includes(resident._id.toString())
            )
            .map(resident => ({
                residentId: resident._id,
                resident: resident.residentName,
                house: resident.house,
                month,
                amount,
                dueDate,
                status: "Unpaid"
            }));

        if (newBills.length === 0) {
            return res.status(200).json({
                message: "Bills have already been generated for all active residents."
            });
        }

        const payments = await Payment.insertMany(newBills);

        res.status(201).json({
            message: "Monthly bills generated successfully!",
            totalBills: payments.length,
            payments
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error generating monthly bills",
            error: error.message
        });
    }
};


// 2. GET ALL PAYMENTS (ADMIN)
const getPayments = async (req, res) => {
    try {
        const payments = await Payment.find().sort({
            createdAt: -1
        });

        res.status(200).json(payments);
    }
    catch (error) {
        res.status(500).json({
            message: "Error fetching payments",
            error: error.message
        });
    }
};


// 3. GET RESIDENT PAYMENTS
const getResidentPayments = async (req, res) => {
    try {
        const payments = await Payment.find({
            residentId: req.params.residentId
        }).sort({
            createdAt: -1
        });

        res.status(200).json(payments);
    }
    catch (error) {
        res.status(500).json({
            message: "Error fetching resident payments",
            error: error.message
        });
    }
};


// 4. SUBMIT PAYMENT (RESIDENT)
const submitPayment = async (req, res) => {
    try {
        const {
            paymentMethod,
            transactionReference
        } = req.body;

        const payment = await Payment.findById(req.params.id);

        if (!payment) {
            return res.status(404).json({
                message: "Payment bill not found!"
            });
        }

        if (!["Unpaid", "Rejected"].includes(payment.status)) {
            return res.status(400).json({
                message: "This bill cannot be submitted in its current status."
            });
        }

        if (!paymentMethod || !transactionReference) {
            return res.status(400).json({
                message: "Payment method and transaction reference are required!"
            });
        }

        payment.paymentMethod = paymentMethod;
        payment.transactionReference = transactionReference;
        payment.status = "Pending";
        payment.submittedAt = new Date();
        payment.verifiedAt = null;
        payment.paymentDate = null;
        payment.rejectionReason = "";

        await payment.save();

        res.status(200).json({
            message: "Payment submitted successfully! Waiting for admin verification.",
            payment
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error submitting payment",
            error: error.message
        });
    }
};


// 5. VERIFY PAYMENT (ADMIN)
const verifyPayment = async (req, res) => {
    try {
        const { status, rejectionReason } = req.body;

        if (!["Paid", "Rejected"].includes(status)) {
            return res.status(400).json({
                message: "Status must be Paid or Rejected!"
            });
        }

        const payment = await Payment.findById(req.params.id);

        if (!payment) {
            return res.status(404).json({
                message: "Payment not found!"
            });
        }

        if (payment.status !== "Pending") {
            return res.status(400).json({
                message: "Only pending payments can be verified."
            });
        }

        if (status === "Rejected" && !rejectionReason) {
            return res.status(400).json({
                message: "Please provide a rejection reason."
            });
        }

        payment.status = status;
        payment.verifiedAt = new Date();

        if (status === "Paid") {
            payment.paymentDate = new Date();
            payment.rejectionReason = "";
        } else {
            payment.paymentDate = null;
            payment.rejectionReason = rejectionReason;
        }

        await payment.save();

        res.status(200).json({
            message: status === "Paid"
                ? "Payment verified successfully!"
                : "Payment rejected.",
            payment
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error verifying payment",
            error: error.message
        });
    }
};


module.exports = {
    generateMonthlyBills,
    getPayments,
    getResidentPayments,
    submitPayment,
    verifyPayment
};
