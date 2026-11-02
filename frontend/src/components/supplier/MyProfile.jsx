
import { useState } from "react";

const MyProfile = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [name, setName] = useState(user?.name || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const cardStyle = {
    backgroundColor: "var(--card-bg)",
    color: "var(--text-color)",
    border: "1px solid var(--border-color)",
    borderRadius: "12px",
  };

  const inputStyle = {
    backgroundColor: "var(--page-bg)",
    color: "var(--text-color)",
    border: "1px solid var(--border-color)",
  };

  if (!user) {
    return <div className="alert alert-danger">Please log in first.</div>;
  }

  const handleSave = async () => {
    try {
      setLoading(true);
      setMessage("");
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: name.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not update profile.");
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      setName(data.user.name);
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="mb-4">
        <h3 className="fw-bold" style={{ color: "var(--text-color)" }}>
          My Profile
        </h3>
        <p style={{ color: "var(--muted-color)" }}>
          View your account information.
        </p>
      </div>

      <div className="p-4 shadow-sm" style={{ ...cardStyle, maxWidth: "650px" }}>
        <div className="mb-4">
          <h5 className="fw-bold" style={{ color: "var(--text-color)" }}>
            Account Information
          </h5>
          <p className="small mb-0" style={{ color: "var(--muted-color)" }}>
            Your supplier account details.
          </p>
        </div>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-3">
          <label className="form-label fw-semibold">Full Name</label>
          <input
            type="text"
            className="form-control"
            style={inputStyle}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Email Address</label>
          <input
            type="email"
            className="form-control"
            style={inputStyle}
            value={user.email || ""}
            disabled
          />
        </div>

        <div className="mb-4">
          <label className="form-label fw-semibold">Account Role</label>
          <input
            type="text"
            className="form-control"
            style={inputStyle}
            value={user.role || ""}
            disabled
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={!name.trim() || loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default MyProfile;
