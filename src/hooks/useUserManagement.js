import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../services/api.js";

export default function useUserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchUsers = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    // Synchronize the initial list with the server.
    // oxlint-disable-next-line react/set-state-in-effect
    fetchUsers();
  }, [fetchUsers]);

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

  return {
    users,
    loading,
    updatingId,
    error,
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    fetchUsers,
    updateUserStatus,
    filteredUsers,
    activeCount,
    ownerCount,
    suspendedCount,
    bannedCount,
  };
}
