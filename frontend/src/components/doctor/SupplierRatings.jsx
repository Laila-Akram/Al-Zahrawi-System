import { useEffect, useState } from "react";

const SupplierRatings = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ratings, setRatings] = useState({});
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState("");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchRatings = async (supplierList) => {
    const ratingsData = {};

    await Promise.all(
      supplierList.map(async (supplier) => {
        try {
          const response = await fetch(
            `http://localhost:5000/api/reviews/supplier/${supplier._id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = await response.json();

          if (response.ok) {
            ratingsData[supplier._id] = data;
          }
        } catch (error) {
          console.error("Error fetching supplier reviews:", error);
        }
      })
    );

    setRatings(ratingsData);
  };

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/offers",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load suppliers");
      }

      const offers = data.offers || [];

      const supplierMap = new Map();

      offers.forEach((offer) => {
        const supplier = offer.supplier;

        if (!supplier?._id) return;

        if (!supplierMap.has(supplier._id)) {
          supplierMap.set(supplier._id, {
            ...supplier,
            acceptedOffer: null,
          });
        }

        if (offer.status === "accepted") {
          supplierMap.get(supplier._id).acceptedOffer = offer;
        }
      });

      const supplierList = Array.from(supplierMap.values());

      setSuppliers(supplierList);
      await fetchRatings(supplierList);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleInputChange = (supplierId, field, value) => {
    setFormData((previous) => ({
      ...previous,
      [supplierId]: {
        ...previous[supplierId],
        [field]: value,
      },
    }));
  };

  const handleSubmitReview = async (supplier) => {
    const form = formData[supplier._id] || {};
    const rating = Number(form.rating);
    const offerId = supplier.acceptedOffer?._id;

    if (!offerId) {
      alert("You can only review a supplier after accepting an offer.");
      return;
    }

    if (!rating || rating < 1 || rating > 5) {
      alert("Please select a rating from 1 to 5.");
      return;
    }

    try {
      setSubmitting(supplier._id);

      const response = await fetch(
        "http://localhost:5000/api/reviews",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            offerId,
            rating,
            comment: form.comment || "",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit review");
      }

      alert("Your review was submitted successfully.");

      setFormData((previous) => ({
        ...previous,
        [supplier._id]: {
          rating: "",
          comment: "",
        },
      }));

      await fetchSuppliers();
    } catch (error) {
      alert(error.message);
    } finally {
      setSubmitting("");
    }
  };

  if (loading) {
    return (
      <div className="dashboard-card">
        <p className="mb-0">Loading supplier ratings...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="page-title">Supplier Ratings</h2>
          <p className="page-description">
            View supplier reviews and share your experience.
          </p>
        </div>

        <button
          className="btn btn-outline-primary"
          onClick={fetchSuppliers}
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {!error && suppliers.length === 0 && (
        <div className="dashboard-card text-center py-5">
          <h5>No Suppliers Yet</h5>
          <p className="text-muted mb-0">
            Suppliers will appear here after they submit offers for your requests.
          </p>
        </div>
      )}

      <div className="row g-3">
        {suppliers.map((supplier) => {
          const supplierRatings = ratings[supplier._id] || {};
          const reviews = supplierRatings.reviews || [];

          const alreadyReviewed = reviews.some(
            (review) =>
              review.doctor?._id === user.id ||
              review.doctor?._id === user._id
          );

          const form = formData[supplier._id] || {};

          return (
            <div className="col-12" key={supplier._id}>
              <div className="dashboard-card">
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
                  <div>
                    <h5 className="mb-1">
                      {supplier.name}
                    </h5>

                    <p className="text-muted mb-2">
                      {supplier.email}
                    </p>

                    <div>
                      <strong>
                        {supplierRatings.averageRating || "0.0"}
                      </strong>
                      {" / 5 "}
                      <span className="text-warning">
                        ★★★★★
                      </span>
                      <span className="text-muted ms-2">
                        ({supplierRatings.totalReviews || 0} reviews)
                      </span>
                    </div>
                  </div>

                  {supplier.acceptedOffer && (
                    <span className="badge bg-success">
                      Accepted Offer
                    </span>
                  )}
                </div>

                <hr />

                <h6 className="mb-3">Customer Reviews</h6>

                {reviews.length === 0 ? (
                  <p className="text-muted">
                    No reviews yet.
                  </p>
                ) : (
                  reviews.map((review) => (
                    <div
                      key={review._id}
                      className="border rounded p-3 mb-2"
                    >
                      <div className="d-flex justify-content-between">
                        <strong>
                          {review.doctor?.name || "Doctor"}
                        </strong>

                        <span className="text-warning">
                          {"★".repeat(review.rating)}
                          {"☆".repeat(5 - review.rating)}
                        </span>
                      </div>

                      {review.comment && (
                        <p className="mb-1 mt-2">
                          {review.comment}
                        </p>
                      )}

                      <small className="text-muted">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                  ))
                )}

                {supplier.acceptedOffer && !alreadyReviewed && (
                  <div className="mt-4">
                    <h6>Write a Review</h6>

                    <div className="mb-3">
                      <label className="form-label">
                        Rating
                      </label>

                      <select
                        className="form-select"
                        value={form.rating || ""}
                        onChange={(e) =>
                          handleInputChange(
                            supplier._id,
                            "rating",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select rating</option>
                        <option value="5">5 - Excellent</option>
                        <option value="4">4 - Very Good</option>
                        <option value="3">3 - Good</option>
                        <option value="2">2 - Fair</option>
                        <option value="1">1 - Poor</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        Comment
                      </label>

                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Share your experience..."
                        value={form.comment || ""}
                        onChange={(e) =>
                          handleInputChange(
                            supplier._id,
                            "comment",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <button
                      className="btn btn-primary"
                      onClick={() => handleSubmitReview(supplier)}
                      disabled={submitting === supplier._id}
                    >
                      {submitting === supplier._id
                        ? "Submitting..."
                        : "Submit Review"}
                    </button>
                  </div>
                )}

                {alreadyReviewed && (
                  <div className="alert alert-success mt-3 mb-0">
                    You have already reviewed this supplier.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SupplierRatings;