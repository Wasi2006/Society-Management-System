
const Resident = require("../models/Resident");

// CREATE RESIDENT
const createResident = async (req, res) => {
    try {
        const resident = new Resident(req.body);

        await resident.save();

        res.status(201).json({
            message: "Resident added successfully!",
            resident
        });
    }
    catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Email already exists!"
            });
        }

        res.status(500).json({
            message: "Error adding resident",
            error: error.message
        });
    }
};


// GET ALL RESIDENTS
const getResidents = async (req, res) => {
    try {
        const residents = await Resident.find();

        res.status(200).json(residents);
    }
    catch (error) {
        res.status(500).json({
            message: "Error fetching residents",
            error: error.message
        });
    }
};


// UPDATE RESIDENT
const updateResident = async (req, res) => {
    try {
        const resident = await Resident.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!resident) {
            return res.status(404).json({
                message: "Resident not found!"
            });
        }

        res.status(200).json({
            message: "Resident updated successfully!",
            resident
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error updating resident",
            error: error.message
        });
    }
};


// DELETE RESIDENT
const deleteResident = async (req, res) => {
    try {
        const resident = await Resident.findByIdAndDelete(req.params.id);

        if (!resident) {
            return res.status(404).json({
                message: "Resident not found!"
            });
        }

        res.status(200).json({
            message: "Resident deleted successfully!"
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error deleting resident",
            error: error.message
        });
    }
};


module.exports = {
    createResident,
    getResidents,
    updateResident,
    deleteResident
};
