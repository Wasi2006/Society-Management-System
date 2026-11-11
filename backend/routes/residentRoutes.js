
const express = require("express");

const router = express.Router();

const {
    createResident,
    getResidents,
    updateResident,
    deleteResident
} = require("../controllers/residentController");

// Routes
router.post("/", createResident);
router.get("/", getResidents);
router.put("/:id", updateResident);
router.delete("/:id", deleteResident);

module.exports = router;
