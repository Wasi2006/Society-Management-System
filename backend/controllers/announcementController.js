
const Announcement = require("../models/Announcement");

// 1. CREATE ANNOUNCEMENT (ADMIN)
const createAnnouncement = async (req, res) => {
    try {
        const announcement = new Announcement(req.body);

        await announcement.save();

        res.status(201).json({
            message: "Announcement created successfully!",
            announcement
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error creating announcement",
            error: error.message
        });
    }
};


// 2. GET ALL ANNOUNCEMENTS
const getAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find().sort({
            publishedAt: -1
        });

        res.status(200).json(announcements);
    }
    catch (error) {
        res.status(500).json({
            message: "Error fetching announcements",
            error: error.message
        });
    }
};


// 3. UPDATE ANNOUNCEMENT (ADMIN)
const updateAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!announcement) {
            return res.status(404).json({
                message: "Announcement not found!"
            });
        }

        res.status(200).json({
            message: "Announcement updated successfully!",
            announcement
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error updating announcement",
            error: error.message
        });
    }
};


// 4. DELETE ANNOUNCEMENT (ADMIN)
const deleteAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.findByIdAndDelete(
            req.params.id
        );

        if (!announcement) {
            return res.status(404).json({
                message: "Announcement not found!"
            });
        }

        res.status(200).json({
            message: "Announcement deleted successfully!"
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error deleting announcement",
            error: error.message
        });
    }
};


module.exports = {
    createAnnouncement,
    getAnnouncements,
    updateAnnouncement,
    deleteAnnouncement
};
