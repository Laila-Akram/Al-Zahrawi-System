
import { useEffect, useState } from "react";

const ReceivedOffers = () => {
  const [offers, setOffers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [offersResponse, requestsResponse] = await Promise.all([
        fetch("https://al-zahrawi-backend.onrender.com/api/offers", { headers }),
        fetch("https://al-zahrawi-backend.onrender.com/api/supply-requests", { headers }),
      ]);

      const offersData = await offersResponse.json();
      const requestsData = await requestsResponse.json();

      if (!offersResponse.ok) {
        throw new Error(offersData.message || "Failed to load offers.");
      }

      if (!requestsResponse.ok) {
        throw new Error(requestsData.message || "Failed to load requests.");
      }

      setOffers(offersData.offers || []);
      setRequests(requestsData.requests || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      await fetchData();
    } catch (err) {
      setError(err.message);
    } finally {
      setAccepting("");
    }
  };

  const getStatusClass = (status) => {
    if (status === "accepted") return "bg-success";
    if (status === "rejected") return "bg-danger";
    return "bg-warning text-dark";
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h2 className="page-title">Received Offers</h2>
          <p className="page-description">
            Compare supplier prices and choose the best offer.
          </p>
        </div>

        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={fetchData}
          disabled={loading}
        >
          Refresh
        </button>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="dashboard-card">
        {loading ? (
          <p className="text-center text-muted py-4">Loading offers...</p>
        ) : offers.length === 0 ? (
          <div className="text-center py-5">
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
                {offers.map((offer) => {
                  const request = requests.find(
                    (item) =>
                      item._id ===
                      (offer.supplyRequest?._id || offer.supplyRequest)
                  );

                  return (
                    <tr key={offer._id}>
                      <td className="fw-semibold">
                        {offer.supplyRequest?.title || "Request"}
                      </td>

                      <td>{offer.supplier?.name || "Supplier"}</td>

                      <td className="fw-semibold">
                        {Number(offer.price).toFixed(2)} JOD
                      </td>

                      <td>{offer.details || "—"}</td>

                      <td>
                        <span className={`badge ${getStatusClass(offer.status)}`}>
                          {offer.status}
                        </span>
                      </td>

                      <td>
                        {offer.status === "pending" &&
                        request?.status === "open" ? (
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
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceivedOffers;
