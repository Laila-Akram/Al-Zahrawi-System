import { Link } from "react-router-dom";

const Register = () => {
  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-5">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h2 className="text-center fw-bold mb-2">
                Create Account
              </h2>

              <p className="text-center text-muted mb-4">
                Join AL-ZAHRAWI today
              </p>

              <form>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Create a password"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Confirm your password"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Account Type</label>
                  <select className="form-select" required>
                    <option value="">Select account type</option>
                    <option value="doctor">Doctor</option>
                    <option value="supplier">Supplier</option>
                  </select>
                </div>

                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="acceptTerms"
                    required
                  />

                  <label className="form-check-label" htmlFor="acceptTerms">
                    I agree to the Terms and Conditions
                  </label>
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  Create Account
                </button>
              </form>

              <div className="text-center my-3">
                <span className="text-muted">OR</span>
              </div>

              <button
                type="button"
                className="btn btn-outline-dark w-100"
              >
                <strong className="me-2">G</strong>
                Continue with Google
              </button>

              <p className="text-center text-muted mt-4 mb-0">
                Already have an account?{" "}
                <Link to="/">Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;