
const Complaint = require("../models/Complaint");

// Create Complaint
const createComplaint = async (req, res) => {
  try {
    const complaint = new Complaint(req.body);

    await complaint.save();

    res.status(201).json({
      message: "Complaint created successfully!",
      complaint: complaint,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create complaint",
      error: error.message,
    });
  }
};

// Get All Complaints
const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });

    res.status(200).json({
      message: "Complaints fetched successfully!",
      complaints: complaints,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch complaints",
      error: error.message,
    });
  }
};

// Update Complaint Status and Admin Response
const updateComplaintStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { status, response } = req.body;

    const updates = {};

    if (status !== undefined) {
      updates.status = status;
    }

    if (response !== undefined) {
      updates.response = response;
    }

    const complaint = await Complaint.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found!",
      });
    }

    res.status(200).json({
      message: "Complaint updated successfully!",
      complaint: complaint,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update complaint",
      error: error.message,
    });
  }
};

// Delete Complaint
const deleteComplaint = async (req, res) => {
  try {
    const id = req.params.id;

    const complaint = await Complaint.findByIdAndDelete(id);

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found!",
      });
    }

    res.status(200).json({
      message: "Complaint deleted successfully!",
      complaint: complaint,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete complaint",
      error: error.message,
    });
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  updateComplaintStatus,
  deleteComplaint,
};
