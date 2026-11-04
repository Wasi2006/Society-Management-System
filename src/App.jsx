
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { ThemeProvider } from "./context/ThemeContext";

import AdminDashboard from "./pages/admin/AdminDashboard";

import AdminComplaints from "./pages/admin/AdminComplaints";

import AdminResidents from "./pages/admin/AdminResidents";

import AdminPayments from "./pages/admin/AdminPayments";

import AdminAnnouncements from "./pages/admin/AdminAnnouncements";

import "./styles/Theme.css";

import AdminSettings from "./pages/admin/AdminSettings";



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
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
