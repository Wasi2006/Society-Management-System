const Complaint = require("../models/Complaint");

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

const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find();

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
const updateComplaintStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.body.status;

    const complaint = await Complaint.findByIdAndUpdate(
      id,
      { status: status },
      { new: true },
    );

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found!",
      });
    }

    res.status(200).json({
      message: "Complaint status updated successfully!",
      complaint: complaint,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update complaint status",
      error: error.message,
    });
  }
};

const deleteComplaint = async (req, res) => {
    try {
        const id = req.params.id;

        const complaint = await Complaint.findByIdAndDelete(id);

        if (!complaint) {
            return res.status(404).json({
                message: "Complaint not found!"
            });
        }

        res.status(200).json({
            message: "Complaint deleted successfully!",
            complaint: complaint
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete complaint",
            error: error.message
        });
    }
};


module.exports = {
  createComplaint,
  getComplaints,
  updateComplaintStatus,
  deleteComplaint
};
