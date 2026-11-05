
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { ThemeProvider } from "./context/ThemeContext";

import AdminDashboard from "./pages/admin/AdminDashboard";

import AdminComplaints from "./pages/admin/AdminComplaints";

import AdminResidents from "./pages/admin/AdminResidents";

import AdminPayments from "./pages/admin/AdminPayments";

import AdminAnnouncements from "./pages/admin/AdminAnnouncements";

import "./styles/Theme.css";

import AdminSettings from "./pages/admin/AdminSettings";

import ResidentDashboard from "./pages/resident/ResidentDashboard";

import ResidentPayments from "./pages/resident/ResidentPayments";

import ResidentComplaints from "./pages/resident/ResidentComplaints";

import ResidentAnnouncements from "./pages/resident/ResidentAnnouncements";

import ResidentProfile from "./pages/resident/ResidentProfile";

function App() {
    return (
        <ThemeProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="*" element={<Navigate to="/admin" />} />
                    <Route path="/admin/complaints" element={<AdminComplaints />} />
                    <Route path="/admin/residents" element={<AdminResidents />} />
                    <Route path="/admin/payments" element={<AdminPayments />} />
                    <Route path="/admin/announcements" element={<AdminAnnouncements />} />
                    <Route path="/admin/settings" element={<AdminSettings />} />
                    <Route path="/resident" element={<ResidentDashboard />} />
                    <Route path="/resident/payments" element={<ResidentPayments />} />
                    <Route path="/resident/complaints" element={<ResidentComplaints />} />
                    <Route path="/resident/announcements" element={<ResidentAnnouncements />} />
                    <Route path="/resident/profile" element={<ResidentProfile />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
