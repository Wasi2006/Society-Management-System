
const express = require("express");

const router = express.Router();

const {
    generateMonthlyBills,
    getPayments,
    getResidentPayments,
    submitPayment,
    verifyPayment
} = require("../controllers/paymentController");

// Admin: Generate monthly bills
router.post("/generate", generateMonthlyBills);

// Admin: Get all payments
router.get("/", getPayments);

// Resident: Get their payment history
router.get("/resident/:residentId", getResidentPayments);

// Resident: Submit payment details
router.patch("/submit/:id", submitPayment);

// Admin: Verify or reject payment
router.patch("/verify/:id", verifyPayment);

module.exports = router;
