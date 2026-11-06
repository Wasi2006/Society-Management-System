const mongoos = require("mongoose");

const complaintSchema = new mongoos.Schema(
  {
    residentName: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      default: "Pending",
    },
  },
  {
    timestamps: true,
  },
);

const Complaint = mongoos.model("Complaint", complaintSchema);

module.exports = Complaint;
