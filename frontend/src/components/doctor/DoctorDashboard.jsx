
import { useEffect, useState } from "react";

const DoctorDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [offers, setOffers] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [accepting, setAccepting] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  const fetchRequests = async () => {
    try {
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
    }
  };

  const fetchOffers = async () => {
    try {
      const response = await fetch(
        "https://al-zahrawi-backend.onrender.com/api/offers",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load offers.");
      }

      setOffers(data.offers || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const refreshDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      await Promise.all([fetchRequests(), fetchOffers()]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshDashboard();
  }, []);

  const handleCreateRequest = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      setMessage("");

      const response = await fetch(
        "https://al-zahrawi-backend.onrender.com/api/supply-requests",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            description,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create request.");
      }

      setTitle("");
      setDescription("");
      setShowForm(false);
      setMessage("Your supply request was created successfully.");

      await refreshDashboard();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAcceptOffer = async (offerId) => {
    const confirmed = window.confirm(
      "Are you sure you want to accept this offer?"
    );

    if (!confirmed) return;

    try {
      setAccepting(offerId);
      setError("");
      setMessage("");

      const response = await fetch(
        `https://al-zahrawi-backend.onrender.com/api/offers/${offerId}/accept`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to accept offer.");
      }

      setMessage("Offer accepted successfully.");

      await refreshDashboard();
    } catch (err) {
      setError(err.message);
    } finally {
      setAccepting("");
    }
  };

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

  const pendingOffers = offers.filter(
    (offer) => offer.status === "pending"
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h2 className="page-title">Welcome Back!</h2>
          <p className="page-description">
            Manage your dental supply requests and received offers.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => {
            setShowForm(!showForm);
            setError("");
            setMessage("");
          }}
        >
          {showForm ? "Cancel" : "+ Create New Request"}
        </button>
      </div>

      {message && (
        <div className="alert alert-success">{message}</div>
      )}

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {showForm && (
        <div className="dashboard-card mb-4">
          <h5 className="fw-bold mb-3">Create Supply Request</h5>

          <form onSubmit={handleCreateRequest}>
            <div className="mb-3">
              <label className="form-label">Request Title</label>
              <input
                type="text"
                className="form-control"
                placeholder="Example: Dental materials needed"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows="4"
                placeholder="Describe the products and quantities you need..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? "Sending..." : "Submit Request"}
            </button>
          </form>
        </div>
      )}

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="dashboard-card">
            <div className="stat-label">My Requests</div>
            <div className="stat-number">{requests.length}</div>
            <small className="text-muted">Total requests</small>
          </div>
        </div>

        <div className="col-md-4">
          <div className="dashboard-card">
            <div className="stat-label">Received Offers</div>
            <div className="stat-number">{offers.length}</div>
            <small className="text-muted">Offers from suppliers</small>
          </div>
        </div>

        <div className="col-md-4">
          <div className="dashboard-card">
            <div className="stat-label">Pending Decisions</div>
            <div className="stat-number">{pendingOffers.length}</div>
            <small className="text-muted">
              Offers waiting for your choice
            </small>
          </div>
        </div>
      </div>

      <div className="dashboard-card mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="fw-bold mb-1">Received Offers</h5>
            <p className="text-muted small mb-0">
              Compare supplier prices and choose an offer.
            </p>
          </div>

          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={refreshDashboard}
            disabled={loading}
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="text-center text-muted py-4">
            Loading offers...
          </p>
        ) : offers.length === 0 ? (
          <div className="text-center py-4">
            <h6 className="fw-semibold">No offers received yet</h6>
            <p className="text-muted small mb-0">
              Supplier offers will appear here.
            </p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Request</th>
                  <th>Supplier</th>
                  <th>Price</th>
                  <th>Details</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {offers.map((offer) => (
                  <tr key={offer._id}>
                    <td className="fw-semibold">
                      {offer.supplyRequest?.title || "Request"}
                    </td>

                    <td>
                      {offer.supplier?.name || "Supplier"}
                    </td>

                    <td className="fw-semibold">
                      {Number(offer.price).toFixed(2)} JOD
                    </td>

                    <td>
                      {offer.details || "—"}
                    </td>

                    <td>
                      <span className={`badge ${getStatusClass(offer.status)}`}>
                        {offer.status}
                      </span>
                    </td>

                    <td>
                      {offer.status === "pending" &&
                      offer.supplyRequest &&
                      requests.some(
                        (request) =>
                          request._id === offer.supplyRequest._id &&
                          request.status === "open"
                      ) ? (
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleAcceptOffer(offer._id)}
                          disabled={accepting === offer._id}
                        >
                          {accepting === offer._id
                            ? "Accepting..."
                            : "Accept Offer"}
                        </button>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="dashboard-card">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="fw-bold mb-1">Recent Requests</h5>
            <p className="text-muted small mb-0">
              Your latest dental supply requests
            </p>
          </div>

          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={refreshDashboard}
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
                      <span className={`badge ${getStatusClass(request.status)}`}>
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

export default DoctorDashboard;
