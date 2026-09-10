import { useEffect, useMemo, useState } from "react";
import api from "../services/api.js";

export default function useOwnerApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const [requestingDocumentsId, setRequestingDocumentsId] =
    useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchApplications = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/admin/owner-applications");

      const applicationData =
        response.data.data?.applications ||
        response.data.data ||
        response.data.applications ||
        [];

      setApplications(
        Array.isArray(applicationData) ? applicationData : []
      );
      await api.patch("/admin/owner-applications/viewed");
      window.dispatchEvent(new Event("notifications:refresh"));
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
        "Unable to retrieve owner applications"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Loading server state is the purpose of this effect.
    // oxlint-disable-next-line react/set-state-in-effect
    fetchApplications();
  }, []);

  const updateApplication = async (
    applicationId,
    status,
    rejectReason
  ) => {
    const action =
      status === "APPROVED" ? "approve" : "update";

    const confirmed =
      ["REJECTED", "NEED_MORE_DOCUMENTS"].includes(status) ||
      window.confirm(
        `Are you sure you want to ${action} this application?`
      );

    if (!confirmed) return;

    setUpdatingId(applicationId);
    setError("");

    try {
      await api.patch(
        `/admin/owner-applications/${applicationId}`,
        ["REJECTED", "NEED_MORE_DOCUMENTS"].includes(status)
          ? { status, rejectReason }
          : { status }
      );

      if (status === "REJECTED") {
        setRejectingId(null);
      }

      if (status === "NEED_MORE_DOCUMENTS") {
        setRequestingDocumentsId(null);
      }

      setApplications((currentApplications) =>
        currentApplications.map((application) => {
          const currentId =
            application.id || application.applicationId;

          return currentId === applicationId
            ? {
              ...application,
              status,
              ...(rejectReason
                ? { rejectReason }
                : {}),
            }
            : application;
        })
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
        "Unable to update the application"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredApplications = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return applications.filter((application) => {
      const user =
        application.user ||
        application.applicant ||
        {};

      const applicantName =
        user.username ||
        user.profile?.displayName ||
        user.profile?.firstName ||
        application.username ||
        "";

      const email =
        user.email ||
        application.email ||
        "";

      const status =
        application.status || "PENDING";

      const matchesSearch =
        !keyword ||
        applicantName.toLowerCase().includes(keyword) ||
        email.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "ALL" ||
        status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applications, searchTerm, statusFilter]);

  const pendingCount = applications.filter(
    (application) =>
      (application.status || "PENDING") === "PENDING"
  ).length;

  const approvedCount = applications.filter(
    (application) =>
      application.status === "APPROVED"
  ).length;

  const rejectedCount = applications.filter(
    (application) =>
      application.status === "REJECTED"
  ).length;

  const documentsCount = applications.filter(
    (application) =>
      application.status === "NEED_MORE_DOCUMENTS"
  ).length;

  return {
    setError,
    applications,
    loading,
    error,
    updatingId,
    rejectingId,
    setRejectingId,
    requestingDocumentsId,
    setRequestingDocumentsId,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    fetchApplications,
    updateApplication,
    filteredApplications,
    pendingCount,
    approvedCount,
    rejectedCount,
    documentsCount,
  };
}
