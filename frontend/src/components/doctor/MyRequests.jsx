
import { useEffect, useState } from "react";

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "https://al-zahrawi-backend.onrender.com/api/supply-requests",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load requests.");
      }

      const myRequests = (data.requests || []).filter(
        (request) =>
          String(request.doctor?._id || request.doctor?.id) ===
          String(user.id)
      );

      setRequests(myRequests);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const getStatusClass = (status) => {
    if (status === "open" || status === "accepted") {
      return "bg-success";
    }

    if (status === "completed") {
      return "bg-primary";
    }

    if (status === "rejected") {
      return "bg-danger";
    }

    return "bg-secondary";
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="page-title">My Requests</h2>
          <p className="page-description">
            View and track your dental supply requests.
          </p>
        </div>

        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={fetchRequests}
          disabled={loading}
        >
          Refresh
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="dashboard-card">
        {loading ? (
          <p className="text-center text-muted py-4">
            Loading requests...
          </p>
        ) : requests.length === 0 ? (
          <div className="text-center py-5">
            <div className="fs-1 mb-2">▤</div>
            <h6 className="fw-semibold">No requests yet</h6>
            <p className="text-muted small mb-0">
              Your requests will appear here after you create one.
            </p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Request Title</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {requests.map((request) => (
                  <tr key={request._id}>
                    <td className="fw-semibold">{request.title}</td>
                    <td>{request.description || "—"}</td>
                    <td>
                      <span
                        className={`badge ${getStatusClass(request.status)}`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td>
                      {new Date(request.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRequests;
