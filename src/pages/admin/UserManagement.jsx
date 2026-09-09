import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  RefreshCw,
  Search,
  ShieldAlert,
  UserCheck,
  Users,
  UserX,
} from "lucide-react";
import api from "../../services/api";
import { useNavigate } from "react-router";

const UserManagement = () => {

  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

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

  const filteredUsers = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return users.filter((user) => {
      const displayName =
        user.username ||
        user.profile?.displayName ||
        user.profile?.firstName ||
        "";

      const email = user.email || "";
      const role = user.role || "USER";
      const status = user.status || "ACTIVE";

      const matchesSearch =
        !keyword ||
        displayName.toLowerCase().includes(keyword) ||
        email.toLowerCase().includes(keyword);

      const matchesRole =
        roleFilter === "ALL" || role === roleFilter;

      const matchesStatus =
        statusFilter === "ALL" || status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  const activeCount = users.filter(
    (user) => (user.status || "ACTIVE") === "ACTIVE"
  ).length;

  const ownerCount = users.filter(
    (user) => user.role === "OWNER"
  ).length;

  const suspendedCount = users.filter(
    (user) => user.status === "SUSPENDED"
  ).length;

  const bannedCount = users.filter(
    (user) => user.status === "BANNED"
  ).length;

  const getStatusClass = (status) => {
    if (status === "ACTIVE") {
      return "bg-emerald-50 text-emerald-700";
    }

    if (status === "SUSPENDED") {
      return "bg-amber-50 text-amber-700";
    }

    if (status === "BANNED") {
      return "bg-red-50 text-red-700";
    }

    return "bg-slate-100 text-slate-700";
  };

  const getRoleClass = (role) => {
    if (role === "ADMIN") {
      return "bg-violet-50 text-violet-700";
    }

    if (role === "OWNER") {
      return "bg-sky-50 text-sky-700";
    }

    return "bg-[#EEF3EF] text-[#355244]";
  };

  if (loading) {
    return (
      <div className="flex min-h-105 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto size-10 animate-spin rounded-full border-4 border-[#DCE5DF] border-t-forest" />

          <p className="mt-4 text-sm font-medium text-[#7D8981]">
            Loading users...
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-5">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#829087]">
            Administration
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#1E2F27]">
            User management
          </h1>

          <p className="mt-1.5 text-sm text-[#7B8780]">
            View users, roles and manage access across RoomHub.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchUsers}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#DDE4DE] bg-white px-4 text-sm font-semibold text-[#45554C] shadow-sm transition hover:bg-[#F6F8F6]"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Summary */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-[#E4E9E4] bg-white px-4 py-3 shadow-sm">
          <p className="text-xs font-medium text-[#879189]">
            Active users
          </p>

          <p className="mt-1 text-xl font-bold text-emerald-700">
            {activeCount}
          </p>
        </div>

        <div className="rounded-xl border border-[#E4E9E4] bg-white px-4 py-3 shadow-sm">
          <p className="text-xs font-medium text-[#879189]">
            Owners
          </p>

          <p className="mt-1 text-xl font-bold text-sky-700">
            {ownerCount}
          </p>
        </div>

        <div className="rounded-xl border border-[#E4E9E4] bg-white px-4 py-3 shadow-sm">
          <p className="text-xs font-medium text-[#879189]">
            Suspended
          </p>

          <p className="mt-1 text-xl font-bold text-amber-700">
            {suspendedCount}
          </p>
        </div>

        <div className="rounded-xl border border-[#E4E9E4] bg-white px-4 py-3 shadow-sm">
          <p className="text-xs font-medium text-[#879189]">
            Banned
          </p>

          <p className="mt-1 text-xl font-bold text-red-700">
            {bannedCount}
          </p>
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col gap-3 rounded-xl border border-[#E4E9E4] bg-white p-3 shadow-sm lg:flex-row">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9AA39D]"
          />

          <input
            type="text"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            placeholder="Search by username or email..."
            className="h-10 w-full rounded-lg border border-[#E2E8E3] bg-[#F8FAF8] pl-10 pr-4 text-sm text-[#26352D] outline-none transition placeholder:text-[#A0AAA4] focus:border-sage focus:bg-white focus:ring-4 focus:ring-[#A9BBA3]/15"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(event) =>
            setRoleFilter(event.target.value)
          }
          className="h-10 rounded-lg border border-[#E2E8E3] bg-[#F8FAF8] px-3 text-sm font-medium text-[#536159] outline-none transition focus:border-sage focus:bg-white focus:ring-4 focus:ring-[#A9BBA3]/15"
        >
          <option value="ALL">All roles</option>
          <option value="USER">User</option>
          <option value="OWNER">Owner</option>
          <option value="ADMIN">Admin</option>
        </select>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
          className="h-10 rounded-lg border border-[#E2E8E3] bg-[#F8FAF8] px-3 text-sm font-medium text-[#536159] outline-none transition focus:border-sage focus:bg-white focus:ring-4 focus:ring-[#A9BBA3]/15"
        >
          <option value="ALL">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="SUSPENDED">Suspended</option>
          <option value="BANNED">Banned</option>
        </select>
      </div>

      {error && (
        <div
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          role="alert"
        >
          {error}
        </div>
      )}

      {filteredUsers.length === 0 ? (
        <div className="rounded-2xl border border-[#E4E9E4] bg-white px-6 py-14 text-center shadow-sm">
          <div className="mx-auto grid size-12 place-items-center rounded-xl bg-[#EEF3EF] text-forest">
            <Users size={22} />
          </div>

          <h2 className="mt-4 text-base font-semibold text-[#26372E]">
            No users found
          </h2>

          <p className="mt-1 text-sm text-[#879189]">
            No users match the current filters.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#E4E9E4] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-237.5">
              <thead className="bg-[#F7F9F7]">
                <tr className="border-b border-[#E9EDE9]">
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#8B968F]">
                    User
                  </th>

                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#8B968F]">
                    Email
                  </th>

                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#8B968F]">
                    Role
                  </th>

                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#8B968F]">
                    Status
                  </th>

                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#8B968F]">
                    Joined
                  </th>

                  <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-[#8B968F]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#EEF1EE]">
                {filteredUsers.map((user) => {
                  const userId =
                    user.id || user.userId;

                  const displayName =
                    user.username ||
                    user.profile?.displayName ||
                    user.profile?.firstName ||
                    "Unknown user";

                  const role = user.role || "USER";
                  const status = user.status || "ACTIVE";

                  return (
                    <tr
                      key={userId}
                      className="transition hover:bg-[#FBFCFB]"
                    >
                      {/* User */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="grid size-10 shrink-0 place-items-center rounded-full bg-[#EAF0EC] text-sm font-bold text-forest">
                            {displayName
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <p className="max-w-45 truncate text-sm font-semibold text-[#26382F]">
                            {displayName}
                          </p>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-4 py-4">
                        <p className="max-w-60 truncate text-sm text-[#536159]">
                          {user.email || "—"}
                        </p>
                      </td>

                      {/* Role */}
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getRoleClass(
                            role
                          )}`}
                        >
                          {role}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                            status
                          )}`}
                        >
                          {status}
                        </span>
                      </td>

                      {/* Joined */}
                      <td className="px-4 py-4 text-sm text-[#69766E]">
                        {user.createdAt
                          ? new Date(
                            user.createdAt
                          ).toLocaleDateString()
                          : "—"}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          {/* View */}
                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/admin/users/${userId}`)
                            }
                            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[#DDE4DE] bg-white px-3 text-xs font-semibold text-[#536159] transition hover:bg-[#F6F8F6] hover:text-forest"
                          >
                            <Eye size={14} />
                            View
                          </button>

                          {role === "ADMIN" ? (
                            <p className="flex items-center px-2 text-xs font-medium text-[#9AA39D]">
                              Administrator
                            </p>
                          ) : (
                            <>
                              {status !== "ACTIVE" && (
                                <button
                                  type="button"
                                  disabled={updatingId === userId}
                                  onClick={() =>
                                    updateUserStatus(userId, "ACTIVE")
                                  }
                                  className="inline-flex size-9 items-center justify-center rounded-lg bg-forest text-white transition hover:bg-[#214A3D] disabled:cursor-not-allowed disabled:opacity-50"
                                  title="Activate user"
                                >
                                  <UserCheck size={15} />
                                </button>
                              )}

                              {status !== "SUSPENDED" && (
                                <button
                                  type="button"
                                  disabled={updatingId === userId}
                                  onClick={() =>
                                    updateUserStatus(userId, "SUSPENDED")
                                  }
                                  className="inline-flex size-9 items-center justify-center rounded-lg border border-amber-200 bg-white text-amber-700 transition hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-50"
                                  title="Suspend user"
                                >
                                  <ShieldAlert size={15} />
                                </button>
                              )}

                              {status !== "BANNED" && (
                                <button
                                  type="button"
                                  disabled={updatingId === userId}
                                  onClick={() =>
                                    updateUserStatus(userId, "BANNED")
                                  }
                                  className="inline-flex size-9 items-center justify-center rounded-lg border border-red-200 bg-white text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                  title="Ban user"
                                >
                                  <UserX size={15} />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};

export default UserManagement;