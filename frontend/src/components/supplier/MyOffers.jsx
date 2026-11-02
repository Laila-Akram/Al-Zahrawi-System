import { useEffect, useState } from "react";

const MyOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:5000/api/offers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load offers");
        }

        setOffers(data.offers || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  const getStatusClass = (status) => {
    if (status === "accepted") return "bg-success";
    if (status === "rejected") return "bg-danger";
    return "bg-warning text-dark";
  };

  if (loading) {
    return <p className="text-center mt-4">Loading offers...</p>;
  }

  return (
    <div className="container-fluid">
      <div className="mb-4">
        <h2>My Offers</h2>
        <p className="text-muted">
          View your submitted offers and track their status.
        </p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {offers.length === 0 ? (
        <div className="alert alert-info">
          You haven't submitted any offers yet.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Request</th>
                <th>Price</th>
                <th>Details</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {offers.map((offer) => (
                <tr key={offer._id}>
                  <td>
                    {offer.supplyRequest?.title || "Request unavailable"}
                  </td>

                  <td className="fw-bold">
                    {Number(offer.price).toFixed(2)} JOD
                  </td>

                  <td>{offer.details || "No details provided"}</td>

                  <td>
                    <span
                      className={`badge ${getStatusClass(offer.status)}`}
                    >
                      {offer.status}
                    </span>
                  </td>

                  <td>
                    {new Date(offer.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyOffers;