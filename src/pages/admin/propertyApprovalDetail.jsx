import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BedDouble,
  Building2,
  Check,
  MapPin,
  RefreshCw,
  UserRound,
  X,
} from "lucide-react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import api from "../../services/api";
import RejectReasonModal from "../../components/admin/RejectReasonModal";

const PropertyApprovalDetail = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [selectedImage, setSelectedImage] =
    useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  const fetchProperty = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get(
        `/admin/properties/${propertyId}`
      );

      const propertyData =
        response.data.data?.property ||
        response.data.data ||
        response.data.property;

      setProperty(propertyData || null);

      const firstImage =
        propertyData?.images?.[0]?.imageUrl ||
        propertyData?.images?.[0]?.url ||
        propertyData?.imageUrl ||
        "";

      setSelectedImage(firstImage);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to retrieve property"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperty();
  }, [propertyId]);

  const updatePublishStatus = async (
    publishStatus,
    rejectReason
  ) => {
    const action =
      publishStatus === "APPROVED"
        ? "approve"
        : "reject";
    const confirmed =
      publishStatus === "REJECTED" ||
      window.confirm(
        `Are you sure you want to ${action} this property?`
      );

    if (!confirmed) return;

    setUpdating(true);
    setError("");

    try {
      await api.patch(
        `/admin/properties/${propertyId}/publish-status`,
        publishStatus === "REJECTED"
          ? { publishStatus, rejectReason }
          : { publishStatus }
      );

      setProperty((currentProperty) => ({
        ...currentProperty,
        publishStatus,
        ...(rejectReason ? { rejectReason } : {}),
      }));

      window.alert(
        `Property ${publishStatus.toLowerCase()} successfully`
      );
      if (publishStatus === "REJECTED") {
        setRejectModalOpen(false);
      }
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to update property status"
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page-message">
        Loading property details...
      </div>
    );
  }

  if (error && !property) {
    return (
      <section className="admin-content">
        <div className="admin-detail-error">
          <Building2 size={43} />

          <h1>Property unavailable</h1>

          <p>{error}</p>

          <button
            type="button"
            onClick={fetchProperty}
          >
            <RefreshCw size={17} />
            Try again
          </button>

          <Link to="/admin/properties">
            Back to properties
          </Link>
        </div>
      </section>
    );
  }

  if (!property) return null;

  const owner =
    property.owner || property.user || {};

  const profile = owner.profile || {};

  const ownerName =
    profile.fullName ||
    [profile.firstName, profile.lastName]
      .filter(Boolean)
      .join(" ") ||
    owner.username ||
    property.ownerName ||
    "Unknown owner";

  const publishStatus =
    property.publishStatus || "PENDING";

  const images = property.images || [];
  const rooms = property.rooms || [];

  const address =
    property.address?.fullAddress ||
    [
      property.address?.addressLine,
      property.address?.subdistrict,
      property.address?.district,
      property.address?.province,
      property.address?.postalCode,
    ]
      .filter(Boolean)
      .join(", ") ||
    property.location ||
    property.city ||
    "Address not provided";

  return (
    <section className="admin-content">
      <button
        type="button"
        className="admin-back-button"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="admin-detail-heading">
        <div>
          <p className="admin-eyebrow">
            Property review
          </p>

          <h1>
            {property.title ||
              property.name ||
              "Untitled property"}
          </h1>

          <p>
            Review the property information before
            publishing.
          </p>
        </div>

        <span
          className={`status-badge status-${publishStatus.toLowerCase()}`}
        >
          {publishStatus}
        </span>
      </div>

      {error && (
        <p className="admin-error" role="alert">
          {error}
        </p>
      )}

      <div className="admin-detail-layout">
        <div className="admin-detail-main">
          <section className="admin-property-gallery">
            <div className="admin-property-main-image">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={
                    property.title || "Property"
                  }
                />
              ) : (
                <Building2 size={55} />
              )}
            </div>

            {images.length > 1 && (
              <div className="admin-property-thumbnails">
                {images.map((image, index) => {
                  const imageUrl =
                    image.imageUrl || image.url;

                  return (
                    <button
                      type="button"
                      key={image.id || index}
                      className={
                        selectedImage === imageUrl
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        setSelectedImage(imageUrl)
                      }
                    >
                      <img
                        src={imageUrl}
                        alt={`Property ${index + 1}`}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          <section className="admin-detail-card">
            <div className="admin-detail-card-heading">
              <Building2 size={21} />
              <h2>Property information</h2>
            </div>

            <div className="admin-information-grid">
              <div>
                <span>Property type</span>
                <strong>
                  {property.propertyType ||
                    property.type ||
                    "—"}
                </strong>
              </div>

              <div>
                <span>Rent type</span>
                <strong>
                  {property.rentType
                    ?.replaceAll("_", " ") || "—"}
                </strong>
              </div>

              <div>
                <span>Monthly price</span>
                <strong>
                  {property.price
                    ? `฿${Number(
                        property.price
                      ).toLocaleString()}`
                    : "—"}
                </strong>
              </div>

              <div>
                <span>Property status</span>
                <strong>
                  {property.propertyStatus ||
                    property.status ||
                    "—"}
                </strong>
              </div>

              <div>
                <span>Rooms</span>
                <strong>
                  <BedDouble size={15} />
                  {rooms.length}
                </strong>
              </div>

              <div>
                <span>Submitted</span>
                <strong>
                  {property.createdAt
                    ? new Date(
                        property.createdAt
                      ).toLocaleString()
                    : "—"}
                </strong>
              </div>
            </div>
          </section>

          <section className="admin-detail-card">
            <div className="admin-detail-card-heading">
              <MapPin size={21} />
              <h2>Location and description</h2>
            </div>

            <div className="application-detail-section">
              <div>
                <span>Address</span>
                <p>{address}</p>
              </div>

              <div>
                <span>Description</span>
                <p>
                  {property.description ||
                    "No description was provided."}
                </p>
              </div>
            </div>
          </section>

          <section className="admin-detail-card">
            <div className="admin-detail-card-heading">
              <UserRound size={21} />
              <h2>Owner information</h2>
            </div>

            <div className="admin-information-grid">
              <div>
                <span>Owner name</span>
                <strong>{ownerName}</strong>
              </div>

              <div>
                <span>Email</span>
                <strong>{owner.email || "—"}</strong>
              </div>
            </div>
          </section>
        </div>

        <aside className="admin-decision-card">
          <h2>Publishing decision</h2>

          <p>
            Approve the listing only after checking the
            property information and images.
          </p>

          {publishStatus === "PENDING" ? (
            <div className="admin-decision-actions">
              <button
                type="button"
                className="admin-approve-button"
                disabled={updating}
                onClick={() =>
                  updatePublishStatus("APPROVED")
                }
              >
                <Check size={18} />
                Approve property
              </button>

              <button
                type="button"
                className="admin-reject-button"
                disabled={updating}
                onClick={() => {
                  setError("");
                  setRejectModalOpen(true);
                }}
              >
                <X size={18} />
                Reject property
              </button>
            </div>
          ) : (
            <div
              className={`admin-decision-result result-${publishStatus.toLowerCase()}`}
            >
              This property has been{" "}
              {publishStatus.toLowerCase()}.
            </div>
          )}

          <Link
            className="admin-return-link"
            to="/admin/properties"
          >
            Return to property list
          </Link>
        </aside>
      </div>

      {rejectModalOpen && (
        <RejectReasonModal
          entityLabel="property"
          isSubmitting={updating}
          error={error}
          onCancel={() => {
            if (!updating) {
              setRejectModalOpen(false);
              setError("");
            }
          }}
          onReject={(rejectReason) =>
            updatePublishStatus("REJECTED", rejectReason)
          }
        />
      )}
    </section>
  );
};

export default PropertyApprovalDetail;
