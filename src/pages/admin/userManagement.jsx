import { useEffect, useState } from "react";
import {
  RefreshCw,
  ShieldAlert,
  UserCheck,
  Users,
  UserX,
} from "lucide-react";
import api from "../../services/api";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/admin/users");

      const userData =
        response.data.data?.users ||
        response.data.data ||
        response.data.users ||
        [];

      setUsers(Array.isArray(userData) ? userData : []);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to retrieve users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateUserStatus = async (userId, status) => {
    const confirmed = window.confirm(
      `Are you sure you want to change this user to ${status}?`
    );

    if (!confirmed) return;

    setUpdatingId(userId);
    setError("");

    try {
      await api.patch(
        `/admin/users/${userId}/status`,
        { status }
      );

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          (user.id || user.userId) === userId
            ? { ...user, status }
            : user
        )
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to update user status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="admin-page-message">
        Loading users...
      </div>
    );
  }

  return (
    <section className="admin-content">
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">
            Administration
          </p>
          <h1>User Management</h1>
          <p>
            View and manage user access to the platform.
          </p>
        </div>

        <button
          type="button"
          className="refresh-button"
          onClick={fetchUsers}
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {error && (
        <p className="admin-error" role="alert">
          {error}
        </p>
      )}

      <div className="admin-table-card">
        {users.length === 0 ? (
          <div className="empty-state">
            <Users size={38} />
            <h2>No users found</h2>
            <p>No users are currently available.</p>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => {
                  const userId =
                    user.id || user.userId;

                  return (
                    <tr key={userId}>
                      <td>
                        <strong>
                          {user.username ||
                            user.profile?.displayName ||
                            user.profile?.firstName ||
                            "Unknown user"}
                        </strong>
                      </td>

                      <td>{user.email || "—"}</td>

                      <td>
                        <span className="role-badge">
                          {user.role || "USER"}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`status-badge status-${(
                            user.status || "ACTIVE"
                          ).toLowerCase()}`}
                        >
                          {user.status || "ACTIVE"}
                        </span>
                      </td>

                      <td>
                        {user.createdAt
                          ? new Date(
                              user.createdAt
                            ).toLocaleDateString()
                          : "—"}
                      </td>

                      <td>
                        {user.role === "ADMIN" ? (
                          <span className="reviewed-text">
                            Administrator
                          </span>
                        ) : (
                          <div className="table-actions">
                            {user.status !== "ACTIVE" && (
                              <button
                                type="button"
                                className="action-button approve-button"
                                disabled={
                                  updatingId === userId
                                }
                                onClick={() =>
                                  updateUserStatus(
                                    userId,
                                    "ACTIVE"
                                  )
                                }
                              >
                                <UserCheck size={15} />
                                Activate
                              </button>
                            )}

                            {user.status !== "SUSPENDED" && (
                              <button
                                type="button"
                                className="action-button suspend-button"
                                disabled={
                                  updatingId === userId
                                }
                                onClick={() =>
                                  updateUserStatus(
                                    userId,
                                    "SUSPENDED"
                                  )
                                }
                              >
                                <ShieldAlert size={15} />
                                Suspend
                              </button>
                            )}

                            {user.status !== "BANNED" && (
                              <button
                                type="button"
                                className="action-button reject-button"
                                disabled={
                                  updatingId === userId
                                }
                                onClick={() =>
                                  updateUserStatus(
                                    userId,
                                    "BANNED"
                                  )
                                }
                              >
                                <UserX size={15} />
                                Ban
                              </button>
                            )}
                          </div>
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
    </section>
  );
};

export default UserManagement;