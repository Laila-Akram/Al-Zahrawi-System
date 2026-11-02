
import { useEffect, useState } from "react";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const params = new URLSearchParams();

      if (search.trim()) params.append("search", search.trim());
      if (role) params.append("role", role);
      if (status) params.append("status", status);

      const response = await fetch(
        `http://localhost:5000/api/admin/users?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load users.");
      }

      setUsers(data.users || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [role, status]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const toggleUserStatus = async (user) => {
    try {
      setError("");
      setMessage("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/admin/users/${user._id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            isActive: !user.isActive,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update account.");
      }

      setMessage(data.message);
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const getAccountStatus = (user) => {
    if (user.isRejected) return "Rejected";
    if (!user.isApproved) return "Pending";
    return user.isActive ? "Active" : "Inactive";
  };

  const getStatusClass = (user) => {
    const accountStatus = getAccountStatus(user);

    if (accountStatus === "Active") return "bg-success";
    if (accountStatus === "Pending") return "bg-warning text-dark";
    if (accountStatus === "Rejected") return "bg-danger";
    return "bg-secondary";
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="page-title">User Management</h2>
        <p className="page-description">
          Search, review, and manage doctor and supplier accounts.
        </p>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="dashboard-card">
            <div className="stat-label">Total Users</div>
            <div className="stat-number">{users.length}</div>
            <small className="text-muted">Users matching your filters</small>
          </div>
        </div>
      </div>

      {message && (
        <div className="alert alert-success">{message}</div>
      )}

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      <div className="dashboard-card">
        <form
          onSubmit={handleSearch}
          className="row g-3 align-items-end mb-4"
        >
          <div className="col-lg-5">
            <label className="form-label">Search users</label>
            <input
              type="text"
              className="form-control"
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="col-lg-3">
            <label className="form-label">Role</label>
            <select
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">All roles</option>
              <option value="doctor">Doctor</option>
              <option value="supplier">Supplier</option>
            </select>
          </div>

          <div className="col-lg-2">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="col-lg-2">
            <button type="submit" className="btn btn-primary w-100">
              Search
            </button>
          </div>
        </form>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0">All Users</h5>

          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={fetchUsers}
            disabled={loading}
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="text-center text-muted py-4">Loading users...</p>
        ) : users.length === 0 ? (
          <div className="text-center text-muted py-5">
            No users found.
          </div>
        ) : (
          <div className="table-container">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="fw-semibold">{user.name}</td>
                    <td>{user.email}</td>
                    <td className="text-capitalize">{user.role}</td>
                    <td>
                      <span className={`badge ${getStatusClass(user)}`}>
                        {getAccountStatus(user)}
                      </span>
                    </td>
                    <td>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      {user.isApproved && !user.isRejected ? (
                        <button
                          type="button"
                          className={`btn btn-sm ${
                            user.isActive
                              ? "btn-outline-danger"
                              : "btn-outline-success"
                          }`}
                          onClick={() => toggleUserStatus(user)}
                        >
                          {user.isActive ? "Deactivate" : "Activate"}
                        </button>
                      ) : (
                        <span className="text-muted small">No action</span>
                      )}
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

export default UserManagement;
