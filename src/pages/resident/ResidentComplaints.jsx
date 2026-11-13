import { useState, useEffect } from "react";

import ResidentSidebar from "../../components/resident/ResidentSidebar";
import ResidentNavbar from "../../components/resident/ResidentNavbar";

import "../../styles/ResidentComplaints.css";

const API_URL = "http://localhost:5000/api";

function ResidentComplaints() {
  const [residents, setResidents] = useState([]);
  const [selectedResident, setSelectedResident] = useState("");

  const [category, setCategory] = useState("Maintenance");
  const [description, setDescription] = useState("");

  const [complaints, setComplaints] = useState([]);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Fetch Residents
  useEffect(() => {
    const fetchResidents = async () => {
      try {
        const response = await fetch(`${API_URL}/residents`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch residents");
        }

        setResidents(Array.isArray(data) ? data : data.residents || []);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchResidents();
  }, []);

  // Fetch Complaints
  const fetchComplaints = async () => {
    if (!selectedResident) {
      setComplaints([]);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/complaints`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch complaints");
      }

      const selected = residents.find(
        (resident) => resident._id === selectedResident,
      );

      const residentComplaints = (data.complaints || []).filter(
        (complaint) =>
          complaint.residentName === selected.residentName &&
          (!complaint.house || complaint.house === selected.house),
      );

      setComplaints(residentComplaints);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [selectedResident, residents]);

  // Submit Complaint
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedResident) {
      setError("Please select a resident first.");
      return;
    }

    if (!description.trim()) {
      setError("Please enter your complaint description.");
      return;
    }

    const selected = residents.find(
      (resident) => resident._id === selectedResident,
    );

    if (!selected) {
      setError("Selected resident not found.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setMessage("");

      const response = await fetch(`${API_URL}/complaints`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          residentName: selected.residentName,
          house: selected.house || "",
          title: category,
          category: category,
          description: description.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit complaint");
      }

      setMessage("Complaint submitted successfully!");

      setDescription("");
      setCategory("Maintenance");

      await fetchComplaints();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
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

          {/* Resident Selection */}
          <section className="complaint-form-section">
            <h2>Select Resident</h2>

            <div className="complaint-form-group">
              <label htmlFor="resident-select">Resident</label>

              <select
                id="resident-select"
                value={selectedResident}
                onChange={(e) => setSelectedResident(e.target.value)}
              >
                <option value="">Select Resident</option>

                {residents.map((resident) => (
                  <option key={resident._id} value={resident._id}>
                    {resident.residentName} - {resident.house}
                  </option>
                ))}
              </select>
            </div>
          </section>

          {/* Complaint Form */}
          <section className="complaint-form-section">
            <h2>Submit a New Complaint</h2>

            <form onSubmit={handleSubmit}>
              <div className="complaint-form-group">
                <label htmlFor="complaint-category">Complaint Category</label>

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

              <button
                type="submit"
                className="submit-complaint-btn"
                disabled={submitting || !selectedResident}
              >
                {submitting ? "Submitting..." : "Submit Complaint"}
              </button>
            </form>
          </section>

          {error && <p className="no-complaints">{error}</p>}

          {message && <p className="no-complaints">{message}</p>}

          {/* Complaint History */}
          <section className="complaint-history-section">
            <div className="complaint-history-heading">
              <h2>Complaint History</h2>

              <span>{complaints.length} Complaints</span>
            </div>

            <div className="complaint-list">
              {loading ? (
                <p className="no-complaints">Loading complaints...</p>
              ) : (
                <>
                  {complaints.map((complaint) => (
                    <div
                      className="resident-complaint-card"
                      key={complaint._id}
                    >
                      <div className="resident-complaint-details">
                        <h3>{complaint.title}</h3>

                        <p>
                          {complaint.category} ·{" "}
                          {new Date(complaint.createdAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </p>

                        <p>{complaint.description}</p>

                        {complaint.response && (
                          <p>
                            <strong>Admin Response:</strong>{" "}
                            {complaint.response}
                          </p>
                        )}
                      </div>

                      <span
                        className={`complaint-status ${complaint.status
                          .toLowerCase()
                          .replace(" ", "-")}`}
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
                </>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default ResidentComplaints;
