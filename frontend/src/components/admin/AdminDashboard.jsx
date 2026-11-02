import { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/admin/pending-users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load pending users.");
      }

      setUsers(data.users || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const handleUserAction = async (userId, action) => {
    try {
      setMessage("");
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/admin/${action}/${userId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Action failed.");
      }

      setMessage(data.message);
      fetchPendingUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="page-title">Admin Dashboard</h2>
        <p className="page-description">
          Manage registrations and monitor platform activity.
        </p>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="dashboard-card">
            <div className="stat-label">Pending Approvals</div>
            <div className="stat-number">{users.length}</div>
            <small className="text-muted">Accounts waiting for review</small>
          </div>
        </div>
      </div>

      {message && (
        <div className="alert alert-success">
          {message}
        </div>
      )}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <div className="dashboard-card">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
          <div>
            <h5 className="fw-bold mb-1">Pending Registrations</h5>
            <p className="text-muted small mb-0">
              Review and approve doctor and supplier accounts.
            </p>
          </div>

          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={fetchPendingUsers}
            disabled={loading}
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="text-muted text-center py-4">
            Loading registrations...
          </p>
        ) : users.length === 0 ? (
          <div className="text-center py-5">
            <h6 className="fw-semibold">No pending registrations</h6>
            <p className="text-muted small mb-0">
              New registrations waiting for approval will appear here.
            </p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Registration Date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="fw-semibold">{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className="badge bg-light text-dark">
                        {user.role}
                      </span>
                    </td>
                    <td>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() =>
                            handleUserAction(user._id, "approve")
                          }
                        >
                          Approve
                        </button>

                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() =>
                            handleUserAction(user._id, "reject")
                          }
                        >
                          Reject
                        </button>
                      </div>
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

export default AdminDashboard;