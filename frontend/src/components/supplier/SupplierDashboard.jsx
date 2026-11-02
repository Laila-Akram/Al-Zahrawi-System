
import { useEffect, useState } from "react";

const SupplierDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const [price, setPrice] = useState("");
  const [details, setDetails] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

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

      const openRequests = (data.requests || []).filter(
        (request) => request.status === "open"
      );

      setRequests(openRequests);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleSubmitOffer = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      setMessage("");

      const response = await fetch("https://al-zahrawi-backend.onrender.com/api/offers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          supplyRequest: selectedRequest._id,
          price: Number(price),
          details,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit offer.");
      }

      setMessage("Your offer was submitted successfully.");
      setSelectedRequest(null);
      setPrice("");
      setDetails("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="page-title">Supplier Dashboard</h2>
        <p className="page-description">
          Browse doctors' supply requests and submit your offers.
        </p>
      </div>

      {message && (
        <div className="alert alert-success">{message}</div>
      )}

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {selectedRequest && (
        <div className="dashboard-card mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">Submit Your Offer</h5>

            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => setSelectedRequest(null)}
            >
              Cancel
            </button>
          </div>

          <p className="text-muted">
            Request: <strong>{selectedRequest.title}</strong>
          </p>

          <form onSubmit={handleSubmitOffer}>
            <div className="mb-3">
              <label className="form-label">Your Price (JOD)</label>
              <input
                type="number"
                className="form-control"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Offer Details</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Describe availability, quantities, and delivery details..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Offer"}
            </button>
          </form>
        </div>
      )}

      <div className="dashboard-card">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="fw-bold mb-1">Open Doctor Requests</h5>
            <p className="text-muted small mb-0">
              Requests waiting for supplier offers
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

        {loading ? (
          <p className="text-center text-muted py-4">
            Loading requests...
          </p>
        ) : requests.length === 0 ? (
          <div className="text-center py-5">
            <h6 className="fw-semibold">No open requests</h6>
            <p className="text-muted small mb-0">
              New doctor requests will appear here.
            </p>
          </div>
        ) : (
          <div className="row g-3">
            {requests.map((request) => (
              <div className="col-12 col-lg-6" key={request._id}>
                <div className="border rounded-3 p-3 h-100">
                  <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                    <h6 className="fw-bold mb-0">{request.title}</h6>
                    <span className="badge bg-success">Open</span>
                  </div>

                  <p className="text-muted small mb-2">
                    {request.description || "No additional details provided."}
                  </p>

                  <p className="small mb-2">
                    <strong>Doctor:</strong>{" "}
                    {request.doctor?.name || "Doctor"}
                  </p>

                  <p className="text-muted small">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </p>

                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      setSelectedRequest(request);
                      setPrice("");
                      setDetails("");
                      setError("");
                      setMessage("");
                    }}
                  >
                    Send Offer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierDashboard;

