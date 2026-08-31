import { useEffect, useState } from "react";
import {
  Building2,
  Check,
  MapPin,
  RefreshCw,
  X,
} from "lucide-react";
import api from "../../services/api";

const PropertyApprovals = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const fetchProperties = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/admin/properties");

      setProperties(response.data.data ?? []);
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
    fetchProperties();
  }, []);

  const updatePublishStatus = async (
    propertyId,
    publishStatus
  ) => {
    const action =
      publishStatus === "APPROVED" ? "approve" : "reject";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} this property?`
    );

    if (!confirmed) return;

    setUpdatingId(propertyId);
    setError("");

    try {
      await api.patch(
        `/admin/properties/${propertyId}/publish-status`,
        { publishStatus }
      );

      setProperties((currentProperties) =>
        currentProperties.map((property) =>
          (property.id || property.propertyId) === propertyId
            ? { ...property, publishStatus }
            : property
        )
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to update property status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="admin-page-message">
        Loading properties...
      </div>
    );
  }

  return (
    <section className="admin-content">
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">Administration</p>
          <h1>Property Approvals</h1>
          <p>
            Review property listings before publishing them.
          </p>
        </div>

        <button
          type="button"
          className="refresh-button"
          onClick={fetchProperties}
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

      {properties.length === 0 ? (
        <div className="admin-table-card empty-state">
          <Building2 size={38} />
          <h2>No properties found</h2>
          <p>There are no property listings to review.</p>
        </div>
      ) : (
        <div className="property-approval-grid">
          {properties.map((property) => {
            const propertyId =
              property.id || property.propertyId;

            const owner = property.owner || property.user || {};

            const address =
              property.address?.fullAddress ||
              property.address?.district ||
              property.location ||
              property.city ||
              "Address not provided";

            const image =
              property.images?.[0]?.imageUrl ||
              property.images?.[0]?.url ||
              property.imageUrl;

            const publishStatus =
              property.publishStatus || "PENDING";

            return (
              <article
                className="property-approval-card"
                key={propertyId}
              >
                <div className="property-image">
                  {image ? (
                    <img
                      src={image}
                      alt={property.title || "Property"}
                    />
                  ) : (
                    <Building2 size={42} />
                  )}

                  <span
                    className={`status-badge status-${publishStatus.toLowerCase()}`}
                  >
                    {publishStatus}
                  </span>
                </div>

                <div className="property-card-content">
                  <div>
                    <p className="property-type">
                      {property.propertyType ||
                        property.type ||
                        "Property"}
                    </p>

                    <h2>
                      {property.title ||
                        property.name ||
                        "Untitled property"}
                    </h2>
                  </div>

                  <p className="property-location">
                    <MapPin size={16} />
                    {address}
                  </p>

                  <div className="property-information">
                    <div>
                      <span>Owner</span>
                      <strong>
                        {owner.username ||
                          owner.email ||
                          property.ownerName ||
                          "Unknown"}
                      </strong>
                    </div>

                    <div>
                      <span>Rent type</span>
                      <strong>
                        {property.rentType || "—"}
                      </strong>
                    </div>

                    <div>
                      <span>Price</span>
                      <strong>
                        {property.price
                          ? `฿${Number(
                              property.price
                            ).toLocaleString()}`
                          : "—"}
                      </strong>
                    </div>
                  </div>

                  {publishStatus === "PENDING" ? (
                    <div className="property-actions">
                      <button
                        type="button"
                        className="property-action approve-property"
                        disabled={updatingId === propertyId}
                        onClick={() =>
                          updatePublishStatus(
                            propertyId,
                            "APPROVED"
                          )
                        }
                      >
                        <Check size={18} />
                        Approve
                      </button>

                      <button
                        type="button"
                        className="property-action reject-property"
                        disabled={updatingId === propertyId}
                        onClick={() =>
                          updatePublishStatus(
                            propertyId,
                            "REJECTED"
                          )
                        }
                      >
                        <X size={18} />
                        Reject
                      </button>
                    </div>
                  ) : (
                    <p className="property-reviewed">
                      This property has been reviewed.
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default PropertyApprovals;