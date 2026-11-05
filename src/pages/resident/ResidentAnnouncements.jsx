
import ResidentSidebar from "../../components/resident/ResidentSidebar";
import ResidentNavbar from "../../components/resident/ResidentNavbar";
import "../../styles/ResidentAnnouncements.css";

function ResidentAnnouncements() {
    const announcements = [
        {
            id: 1,
            title: "Water Supply Maintenance",
            category: "Maintenance",
            date: "04 Nov 2026",
            important: true,
            description:
                "Water supply will remain temporarily unavailable on 6 November from 10 AM to 2 PM due to scheduled maintenance work. Residents are requested to store water in advance.",
        },
        {
            id: 2,
            title: "Monthly Maintenance Fee Reminder",
            category: "Payments",
            date: "01 Nov 2026",
            important: true,
            description:
                "Residents are reminded to pay their monthly maintenance fee of Rs. 5,000. Please ensure your payments are completed before the due date.",
        },
        {
            id: 3,
            title: "Community Cleaning Drive",
            category: "General",
            date: "28 Oct 2026",
            important: false,
            description:
                "A community cleaning drive will be organized this Sunday. Residents are encouraged to participate and help maintain a clean environment.",
        },
        {
            id: 4,
            title: "Security Guidelines Update",
            category: "Security",
            date: "25 Oct 2026",
            important: false,
            description:
                "All residents are requested to cooperate with security staff and ensure that visitors are properly registered at the main entrance.",
        },
    ];

    return (
        <div className="resident-layout">
            <ResidentSidebar />

            <main className="resident-main">
                <ResidentNavbar />

                <div className="resident-announcements-content">
                    <div className="resident-announcements-heading">
                        <div>
                            <h1>Announcements</h1>
                            <p>Stay updated with the latest society news and notices.</p>
                        </div>

                        <span className="announcement-count">
                            {announcements.length} Announcements
                        </span>
                    </div>

                    <div className="announcements-list">
                        {announcements.map((announcement) => (
                            <article
                                className={`resident-announcement-card ${
                                    announcement.important ? "important-announcement" : ""
                                }`}
                                key={announcement.id}
                            >
                                <div className="announcement-card-top">
                                    <span
                                        className={`announcement-category ${announcement.category
                                            .toLowerCase()
                                            .replace(" ", "-")}`}
                                    >
                                        {announcement.category}
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
                                    <span>Published on: {announcement.date}</span>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default ResidentAnnouncements;
