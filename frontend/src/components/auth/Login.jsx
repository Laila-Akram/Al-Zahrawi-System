
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const goToDashboard = (user) => {
    if (user.role === "doctor") {
      navigate("/doctor/dashboard");
    } else if (user.role === "admin") {
      navigate("/admin/dashboard");
    } else if (user.role === "supplier") {
      navigate("/supplier/dashboard");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      setLoading(true);

      const response = await fetch("https://al-zahrawi-backend.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      goToDashboard(data.user);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setMessage("");

      const response = await fetch("https://al-zahrawi-backend.onrender.com/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          credential: credentialResponse.credential,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message === "Please select Doctor or Supplier account type"
            ? "New user? Please create your account from the Register page using Google."
            : data.message || "Google login failed."
        );
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        goToDashboard(data.user);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="container-fluid min-vh-100 bg-light d-flex align-items-center justify-content-center py-4">
      <div
        className="row bg-white rounded-4 shadow overflow-hidden w-100"
        style={{ maxWidth: "1000px" }}
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

          <h3 className="fw-semibold mb-3">Welcome Back</h3>
          <p style={{ color: "#d5e4e7", lineHeight: "1.8" }}>
            Connect with trusted dental suppliers and manage your dental
            supply requests easily.
          </p>
        </div>

        <div className="col-lg-7 p-4 p-md-5">
          <div className="mx-auto" style={{ maxWidth: "420px" }}>
            <div className="mb-4">
              <h3 className="fw-bold">Login to Your Account</h3>
              <p className="text-muted">
                Enter your email and password to continue.
              </p>
            </div>

            {message && (
              <div className="alert alert-info" role="alert">
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  className="form-control form-control-lg"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control form-control-lg"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg w-100"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="text-center my-4 text-muted">OR</div>

            <div className="d-flex justify-content-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setMessage("Google login was unsuccessful.")}
                text="continue_with"
                shape="rectangular"
                width="320"
              />
            </div>

            <p className="text-center mt-4 mb-0">
              Don't have an account?
              <Link to="/register" className="fw-semibold ms-1">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
