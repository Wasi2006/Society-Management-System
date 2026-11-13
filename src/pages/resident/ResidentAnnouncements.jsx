
import { useState, useEffect } from "react";

import ResidentSidebar from "../../components/resident/ResidentSidebar";
import ResidentNavbar from "../../components/resident/ResidentNavbar";
import "../../styles/ResidentAnnouncements.css";

const API_URL = "http://localhost:5000/api";

function ResidentAnnouncements() {

    const [residents, setResidents] = useState([]);
    const [selectedResident, setSelectedResident] = useState("");

    const [announcements, setAnnouncements] = useState([]);

    const [loadingResidents, setLoadingResidents] = useState(true);
    const [loadingAnnouncements, setLoadingAnnouncements] = useState(false);

    const [error, setError] = useState("");

    // Fetch Residents
    useEffect(() => {

        const fetchResidents = async () => {
            try {
                setError("");

                const response = await fetch(`${API_URL}/residents`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error("Failed to fetch residents");
                }

                const residentsData = Array.isArray(data)
                    ? data
                    : data.residents || [];

                setResidents(residentsData);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoadingResidents(false);
            }
        };

        fetchResidents();

    }, []);

    // Get Selected Resident
    const selectedResidentData = residents.find(
        resident => resident._id === selectedResident
    );

    // Fetch and Filter Announcements
    useEffect(() => {

        if (!selectedResidentData) {
            setAnnouncements([]);
            return;
        }

        const fetchAnnouncements = async () => {
            try {
                setLoadingAnnouncements(true);
                setError("");

                const response = await fetch(`${API_URL}/announcements`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error("Failed to fetch announcements");
                }

                const allAnnouncements = Array.isArray(data)
                    ? data
                    : data.announcements || [];

                // Get Resident Block
                const residentBlock = selectedResidentData.house
                    ? selectedResidentData.house.split("-")[0].toUpperCase()
                    : "";

                // Filter announcements according to audience
                const filteredAnnouncements = allAnnouncements.filter(
                    announcement => {

                        if (announcement.audience === "All Residents") {
                            return true;
                        }

                        return announcement.audience === `Block ${residentBlock}`;
                    }
                );

                setAnnouncements(filteredAnnouncements);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoadingAnnouncements(false);
            }
        };

        fetchAnnouncements();

    }, [selectedResident]);

    // Format Date
    const formatDate = (date) => {
        if (!date) return "";

        return new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    return (
        <div className="resident-layout">

            <ResidentSidebar />

            <main className="resident-main">

                <ResidentNavbar />

                <div className="resident-announcements-content">

                    <div className="resident-announcements-heading">

                        <div>
                            <h1>Announcements</h1>
                            <p>
                                Stay updated with the latest society news and notices.
                            </p>
                        </div>

                        <span className="announcement-count">
                            {announcements.length} Announcements
                        </span>

                    </div>

                    {/* Temporary Resident Selection */}
                    <div className="resident-selection">

                        <label>Select Resident</label>

                        <select
                            value={selectedResident}
                            onChange={e => setSelectedResident(e.target.value)}
                            disabled={loadingResidents}
                        >
                            <option value="">
                                {loadingResidents
                                    ? "Loading residents..."
                                    : "Select your resident account"}
                            </option>

                            {residents.map(resident => (
                                <option
                                    key={resident._id}
                                    value={resident._id}
                                >
                                    {resident.residentName} - {resident.house}
                                </option>
                            ))}

                        </select>

                    </div>

                    {/* Error Message */}
                    {error && (
                        <p className="error-message">{error}</p>
                    )}

                    {/* Announcements */}
                    <div className="announcements-list">

                        {!selectedResident && !loadingResidents && (
                            <p className="empty-message">
                                Please select a resident to view announcements.
                            </p>
                        )}

                        {loadingAnnouncements && (
                            <p>Loading announcements...</p>
                        )}

                        {!loadingAnnouncements &&
                            selectedResident &&
                            announcements.map(announcement => (

                                <article
                                    className={`resident-announcement-card ${
                                        announcement.important
                                            ? "important-announcement"
                                            : ""
                                    }`}
                                    key={announcement._id}
                                >

                                    <div className="announcement-card-top">

                                        <span
                                            className={`announcement-category ${
                                                (announcement.category || "General")
                                                    .toLowerCase()
                                                    .replace(" ", "-")
                                            }`}
                                        >
                                            {announcement.category || "General"}
                                        </span>

                                        {announcement.important && (
                                            <span className="important-label">
                                                Important
                                            </span>
                                        )}

                                    </div>

                                    <h2>{announcement.title}</h2>

                                    <p className="announcement-description">
                                        {announcement.description}
                                    </p>

                                    <div className="announcement-card-footer">

                                        <span>
                                            Published on: {
                                                formatDate(announcement.publishedAt)
                                            }
                                        </span>

                                    </div>

                                </article>

                            ))
                        }

                        {!loadingAnnouncements &&
                            selectedResident &&
                            announcements.length === 0 && (
                                <p className="empty-message">
                                    No announcements available for your block.
                                </p>
                            )}

                    </div>

                </div>

            </main>

        </div>
    );
}

export default ResidentAnnouncements;
