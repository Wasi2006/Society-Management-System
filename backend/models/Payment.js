
const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        residentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Resident",
            required: true
        },

        resident: {
            type: String,
            required: true
        },

        house: {
            type: String,
            required: true
        },

        month: {
            type: String,
            required: true
        },

        amount: {
            type: Number,
            required: true
        },

        dueDate: {
            type: Date,
            required: true
        },

        status: {
            type: String,
            enum: ["Unpaid", "Pending", "Paid", "Rejected"],
            default: "Unpaid"
        },

        paymentMethod: {
            type: String,
            enum: ["Cash", "Bank Transfer", "Easypaisa", "JazzCash"],
            default: null
        },

        transactionReference: {
            type: String,
            default: ""
        },

        submittedAt: {
            type: Date,
            default: null
        },

        verifiedAt: {
            type: Date,
            default: null
        },

        rejectionReason: {
            type: String,
            default: ""
        },

        paymentDate: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

// Prevent duplicate bills for the same resident and month
paymentSchema.index(
    { residentId: 1, month: 1 },
    { unique: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
