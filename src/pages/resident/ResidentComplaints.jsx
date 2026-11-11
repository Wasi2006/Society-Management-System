
import { useState, useEffect } from "react";
import ResidentSidebar from "../../components/resident/ResidentSidebar";
import ResidentNavbar from "../../components/resident/ResidentNavbar";
import "../../styles/ResidentComplaints.css";

function ResidentComplaints() {
    const [category, setCategory] = useState("Maintenance");
    const [description, setDescription] = useState("");
    const [complaints, setComplaints] = useState([]);

    // Fetch complaints from backend
    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/api/complaints"
                );

                const data = await response.json();

                setComplaints(data.complaints);

            } catch (error) {
                console.error("Error fetching complaints:", error);
            }
        };

        fetchComplaints();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!description.trim()) {
            alert("Please enter your complaint description.");
            return;
        }

        const newComplaint = {
            id: Date.now(),
            title: description.trim(),
            category: category,
            date: new Date().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }),
            status: "Pending",
        };

        setComplaints([newComplaint, ...complaints]);
        setDescription("");
        setCategory("Maintenance");
    };

    return (
        <div className="resident-layout">
            <ResidentSidebar />

            <main className="resident-main">
                <ResidentNavbar />

                <div className="resident-complaints-content">
                    <div className="resident-complaints-heading">
                        <h1>My Complaints</h1>
                        <p>Submit complaints and track their progress.</p>
                    </div>

                    <section className="complaint-form-section">
                        <h2>Submit a New Complaint</h2>

                        <form onSubmit={handleSubmit}>
                            <div className="complaint-form-group">
                                <label htmlFor="complaint-category">
                                    Complaint Category
                                </label>

                                <select
                                    id="complaint-category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    <option value="Maintenance">Maintenance</option>
                                    <option value="Electricity">Electricity</option>
                                    <option value="Water Supply">Water Supply</option>
                                    <option value="Security">Security</option>
                                    <option value="Cleanliness">Cleanliness</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="complaint-form-group">
                                <label htmlFor="complaint-description">
                                    Complaint Description
                                </label>

                                <textarea
                                    id="complaint-description"
                                    rows="4"
                                    placeholder="Describe your complaint..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <button type="submit" className="submit-complaint-btn">
                                Submit Complaint
                            </button>
                        </form>
                    </section>

                    <section className="complaint-history-section">
                        <div className="complaint-history-heading">
                            <h2>Complaint History</h2>
                            <span>{complaints.length} Complaints</span>
                        </div>

                        <div className="complaint-list">
                            {complaints.map((complaint) => (
                                <div
                                    className="resident-complaint-card"
                                    key={complaint._id}
                                >
                                    <div className="resident-complaint-details">
                                        <h3>{complaint.title}</h3>
                                        <p>
                                            {complaint.category} ·{" "}
                                            {new Date(
                                                complaint.createdAt
                                            ).toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </p>
                                    </div>

                                    <span
                                        className={`complaint-status ${
                                            complaint.status
                                                .toLowerCase()
                                                .replace(" ", "-")
                                        }`}
                                    >
                                        {complaint.status}
                                    </span>
                                </div>
                            ))}

                            {complaints.length === 0 && (
                                <p className="no-complaints">
                                    You haven't submitted any complaints yet.
                                </p>
                            )}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}

export default ResidentComplaints;
