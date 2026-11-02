
const DoctorDashboard = () => {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h2 className="page-title">Welcome Back!</h2>
          <p className="page-description">
            Manage your dental supply requests and received offers.
          </p>
        </div>

        <button className="btn btn-primary">
          + Create New Request
        </button>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="dashboard-card">
            <div className="stat-label">My Requests</div>
            <div className="stat-number">0</div>
            <small className="text-muted">Total requests</small>
          </div>
        </div>

        <div className="col-md-4">
          <div className="dashboard-card">
            <div className="stat-label">Received Offers</div>
            <div className="stat-number">0</div>
            <small className="text-muted">Offers from suppliers</small>
          </div>
        </div>

        <div className="col-md-4">
          <div className="dashboard-card">
            <div className="stat-label">Pending Decisions</div>
            <div className="stat-number">0</div>
            <small className="text-muted">Requests waiting for your choice</small>
          </div>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="fw-bold mb-1">Recent Requests</h5>
            <p className="text-muted small mb-0">
              Your latest dental supply requests
            </p>
          </div>

          <button className="btn btn-outline-secondary btn-sm">
            View All
          </button>
        </div>

        <div className="text-center py-5">
          <div className="fs-1 mb-2">▤</div>
          <h6 className="fw-semibold">No requests yet</h6>
          <p className="text-muted small mb-0">
            Your requests will appear here after you create one.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
