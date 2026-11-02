import { useState } from "react";
import { Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    acceptTerms: false,
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    if (!formData.acceptTerms) {
      setMessage("Please accept the Terms and Conditions.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: formData.role,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      setMessage(
        "Account created successfully. Waiting for admin approval."
      );
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 bg-light d-flex align-items-center justify-content-center py-4">
      <div
        className="row bg-white rounded-4 shadow overflow-hidden w-100"
        style={{ maxWidth: "1100px" }}
      >
        <div
          className="col-lg-5 text-white p-5 d-flex flex-column justify-content-center"
          style={{
            background: "linear-gradient(145deg, #172b4d, #176b70)",
          }}
        >
          <div className="mb-4">
            <h2 className="fw-bold">AL-ZAHRAWI</h2>

            <p className="small" style={{ color: "#c5dce0" }}>
              Inspired by history, built for modern dentistry.
            </p>
          </div>

          <h3 className="fw-semibold mb-3">Join AL-ZAHRAWI</h3>

          <p style={{ color: "#d5e4e7", lineHeight: "1.8" }}>
            A platform connecting dental professionals with trusted suppliers
            and making dental supply requests easier.
          </p>
        </div>

        <div className="col-lg-7 p-4 p-md-5">
          <div className="mx-auto" style={{ maxWidth: "500px" }}>
            <div className="mb-4">
              <h3 className="fw-bold">Create Your Account</h3>

              <p className="text-muted">
                Enter your information to get started.
              </p>
            </div>

            {message && (
              <div className="alert alert-info" role="alert">
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Full Name</label>

                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Email Address</label>

                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Password</label>

                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    Confirm Password
                  </label>

                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-control"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Account Type</label>

                <select
                  name="role"
                  className="form-select"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select account type</option>
                  <option value="doctor">Dentist</option>
                  <option value="supplier">Supplier</option>
                </select>
              </div>

              <div className="form-check mb-4">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  id="acceptTerms"
                  className="form-check-input"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                />

                <label className="form-check-label" htmlFor="acceptTerms">
                  I agree to the Terms and Conditions
                </label>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-2"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <div className="text-center my-3 text-muted">OR</div>

            <button
              type="button"
              className="btn btn-outline-secondary w-100 py-2"
              onClick={() =>
                setMessage("Google sign-in will be connected later.")
              }
            >
              Continue with Google
            </button>

            <p className="text-center mt-4 mb-0">
              Already have an account?
              <Link to="/" className="fw-semibold ms-1">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;