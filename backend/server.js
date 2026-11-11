
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const complaintRoutes = require("./routes/complaintRoutes");
const residentRoutes = require("./routes/residentRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const announcementRoutes = require("./routes/announcementRoutes");

const connectDB = require("./config/db");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/api/complaints", complaintRoutes);
app.use("/api/residents", residentRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/announcements", announcementRoutes);
// Test route
app.get("/", (req, res) => {
    res.send("Society Management System API is running!");
});

// Start server after database connection
const startServer = async () => {
    await connectDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

startServer();
