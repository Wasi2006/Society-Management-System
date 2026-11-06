const express = require("express");

const router = express.Router();

const {
    createComplaint,
    getComplaints,
    updateComplaintStatus,
    deleteComplaint
} = require("../controllers/complaintController");

router.post("/", createComplaint);
router.get("/", getComplaints);
router.patch("/:id", updateComplaintStatus);
router.delete("/:id", deleteComplaint);

module.exports = router;