import { useEffect, useMemo, useState } from "react";
import api from "../services/api.js";

export default function usePropertyApprovals() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [rejectingId, setRejectingId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchProperties = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/admin/properties");
      setProperties(response.data.data ?? []);
      await api.patch("/admin/properties/viewed");
      window.dispatchEvent(new Event("notifications:refresh"));
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
        "Unable to retrieve properties"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Loading server state is the purpose of this effect.
    // oxlint-disable-next-line react/set-state-in-effect
    fetchProperties();
  }, []);

  const updatePublishStatus = async (
    propertyId,
    publishStatus,
    rejectReason
  ) => {
    const action =
      publishStatus === "APPROVED" ? "approve" : "reject";

    const confirmed =
      publishStatus === "REJECTED" ||
      window.confirm(
        `Are you sure you want to ${action} this property?`
      );

    if (!confirmed) return;

    setUpdatingId(propertyId);
    setError("");

    try {
      await api.patch(
        `/admin/properties/${propertyId}/publish-status`,
        publishStatus === "REJECTED"
          ? { publishStatus, rejectReason }
          : { publishStatus }
      );

      setProperties((currentProperties) =>
        currentProperties.map((property) =>
          (property.id || property.propertyId) === propertyId
            ? {
              ...property,
              publishStatus,
              ...(rejectReason ? { rejectReason } : {}),
            }
            : property
        )
      );

      if (publishStatus === "REJECTED") {
        setRejectingId(null);
      }
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
        "Unable to update property status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredProperties = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return properties.filter((property) => {
      const owner = property.owner || property.user || {};

      const address =
        property.address?.fullAddress ||
        property.address?.district ||
        property.location ||
        property.city ||
        "";

      const propertyName =
        property.title || property.name || "";

      const ownerName =
        owner.username ||
        owner.email ||
        property.ownerName ||
        "";

      const publishStatus =
        property.publishStatus || "PENDING";

      const matchesSearch =
        !keyword ||
        propertyName.toLowerCase().includes(keyword) ||
        ownerName.toLowerCase().includes(keyword) ||
        address.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "ALL" ||
        publishStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [properties, searchTerm, statusFilter]);

  const pendingCount = properties.filter(
    (property) =>
      (property.publishStatus || "PENDING") === "PENDING"
  ).length;

  const approvedCount = properties.filter(
    (property) => property.publishStatus === "APPROVED"
  ).length;

  const rejectedCount = properties.filter(
    (property) => property.publishStatus === "REJECTED"
  ).length;

  return {
    setError,
    properties,
    loading,
    updatingId,
    error,
    rejectingId,
    setRejectingId,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    fetchProperties,
    updatePublishStatus,
    filteredProperties,
    pendingCount,
    approvedCount,
    rejectedCount,
  };
}
