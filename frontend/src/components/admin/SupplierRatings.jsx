import { useEffect, useState } from "react";

const SupplierRatings = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRatings = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://al-zahrawi-backend.onrender.com/api/admin/users?role=supplier",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not load suppliers.");
      }

      const supplierList = data.users || [];

      const suppliersWithRatings = await Promise.all(
        supplierList.map(async (supplier) => {
          const reviewResponse = await fetch(
            `https://al-zahrawi-backend.onrender.com/api/reviews/supplier/${supplier._id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const reviewData = await reviewResponse.json();

          return {
            ...supplier,
            averageRating: reviewData.averageRating || 0,
            totalReviews: reviewData.totalReviews || 0,
            reviews: reviewData.reviews || [],
          };
        })
      );

      setSuppliers(suppliersWithRatings);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, []);

  const mutedStyle = {
    color: "var(--muted-color)",
  };

  const cardStyle = {
    backgroundColor: "var(--card-bg)",
    color: "var(--text-color)",
    border: "1px solid var(--border-color)",
    borderRadius: "12px",
  };

  if (loading) {
    return (
      <p style={{ color: "var(--text-color)" }}>
        Loading supplier ratings...
      </p>
    );
  }

  return (
    <div className="container-fluid">
      <h3 className="fw-bold mb-2" style={{ color: "var(--text-color)" }}>
        Supplier Ratings
      </h3>

      <p className="mb-4" style={mutedStyle}>
        Review supplier ratings and customer feedback.
      </p>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {suppliers.length === 0 ? (
        <div className="p-3" style={cardStyle}>
          No suppliers found.
        </div>
      ) : (
        <div className="row g-3">
          {suppliers.map((supplier) => (
            <div className="col-12 col-lg-6" key={supplier._id}>
              <div className="p-4 h-100" style={cardStyle}>
                <h5
                  className="fw-bold"
                  style={{ color: "var(--text-color)" }}
                >
                  {supplier.name}
                </h5>

                <p className="mb-2" style={mutedStyle}>
                  {supplier.email}
                </p>

                <div className="mb-3">
                  <span style={{ color: "var(--text-color)" }}>
                    Average Rating:{" "}
                  </span>

                  <span className="text-warning fw-bold">
                    {supplier.averageRating} / 5 ★
                  </span>

                  <span className="ms-2" style={mutedStyle}>
                    ({supplier.totalReviews} reviews)
                  </span>
                </div>

                <hr style={{ borderColor: "var(--border-color)" }} />

                {supplier.reviews.length === 0 ? (
                  <p className="mb-0" style={mutedStyle}>
                    No reviews yet.
                  </p>
                ) : (
                  supplier.reviews.map((review) => (
                    <div
                      className="py-2"
                      key={review._id}
                      style={{
                        borderBottom: "1px solid var(--border-color)",
                      }}
                    >
                      <div className="d-flex justify-content-between">
                        <strong style={{ color: "var(--text-color)" }}>
                          {review.doctor?.name || "Doctor"}
                        </strong>

                        <span className="text-warning">
                          {"★".repeat(review.rating)}
                        </span>
                      </div>

                      <p
                        className="mb-1"
                        style={{ color: "var(--text-color)" }}
                      >
                        {review.comment || "No comment"}
                      </p>

                      <small style={mutedStyle}>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SupplierRatings;