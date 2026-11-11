
const mongoose = require("mongoose");

const residentSchema = new mongoose.Schema(
    {
        residentName: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        phone: {
            type: String,
            required: true
        },

        house: {
            type: String,
            required: true
        },

        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active"
        }
    },
    {
        timestamps: true
    }
);

const Resident = mongoose.model("Resident", residentSchema);

module.exports = Resident;
