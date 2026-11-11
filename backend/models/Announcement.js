
const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        audience: {
            type: String,
            enum: [
                "All Residents",
                "Block A",
                "Block B",
                "Block C"
            ],
            default: "All Residents"
        },

        category: {
            type: String,
            enum: [
                "General",
                "Maintenance",
                "Security",
                "Payments"
            ],
            default: "General"
        },

        important: {
            type: Boolean,
            default: false
        },

        publishedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

const Announcement = mongoose.model(
    "Announcement",
    announcementSchema
);

module.exports = Announcement;
