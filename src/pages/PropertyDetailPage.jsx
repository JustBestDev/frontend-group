import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import {
  ArrowLeft,
  BedDouble,
  Building2,
  Home,
  MapPin,
  MessageCircle,
  RefreshCw,
  Users,
} from "lucide-react";
import api from "../services/api";

const PropertyDetailPage = () => {
  const { propertyId } = useParams();

  const [property, setProperty] = useState(null);
  const [selectedImage, setSelectedImage] =
    useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProperty = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get(
        `/properties/${propertyId}`
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
        "Unable to retrieve property details"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperty();
  }, [propertyId]);

  if (loading) {
    return (
      <main className="property-detail-page">
        <div className="property-detail-message">
          Loading property details...
        </div>
      </main>
    );
  }

  if (error || !property) {
    return (
      <main className="property-detail-page">
        <div className="property-detail-message">
          <Building2 size={44} />
          <h1>Property unavailable</h1>
          <p>{error || "Property not found"}</p>

          <button
            type="button"
            onClick={fetchProperty}
          >
            <RefreshCw size={17} />
            Try again
          </button>

          <Link to="/properties">
            Back to properties
          </Link>
        </div>
      </main>
    );
  }

  const images = property.images || [];

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
    "Location not provided";

  const owner =
    property.owner || property.user || {};

  const rooms = property.rooms || [];

  return (
    <main className="property-detail-page">
      <div className="property-detail-container">
        <Link
          to="/properties"
          className="property-back-link"
        >
          <ArrowLeft size={18} />
          Back to properties
        </Link>

        <section className="property-detail-gallery">
          <div className="property-main-image">
            {selectedImage ? (
              <img
                src={selectedImage}
                alt={property.title || "Property"}
              />
            ) : (
              <Building2 size={60} />
            )}
          </div>

          {images.length > 1 && (
            <div className="property-thumbnails">
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

        <div className="property-detail-layout">
          <section className="property-detail-content">
            <div className="property-detail-heading">
              <div>
                <span className="property-detail-type">
                  {property.propertyType ||
                    property.type ||
                    "PROPERTY"}
                </span>

                <h1>
                  {property.title ||
                    property.name ||
                    "Untitled property"}
                </h1>

                <p>
                  <MapPin size={17} />
                  {address}
                </p>
              </div>

              <div className="property-detail-price">
                <strong>
                  {property.price
                    ? `฿${Number(
                      property.price
                    ).toLocaleString()}`
                    : "Contact"}
                </strong>
                <span>per month</span>
              </div>
            </div>

            <div className="property-feature-grid">
              <div>
                <Home size={21} />
                <span>Property type</span>
                <strong>
                  {property.propertyType || "—"}
                </strong>
              </div>

              <div>
                <Users size={21} />
                <span>Rent type</span>
                <strong>
                  {property.rentType
                    ?.replaceAll("_", " ") || "—"}
                </strong>
              </div>

              <div>
                <BedDouble size={21} />
                <span>Rooms</span>
                <strong>{rooms.length}</strong>
              </div>
            </div>

            <div className="property-description">
              <h2>About this property</h2>

              <p>
                {property.description ||
                  "No description has been provided for this property."}
              </p>
            </div>

            {rooms.length > 0 && (
              <div className="property-room-section">
                <h2>Available rooms</h2>

                <div className="property-room-grid">
                  {rooms.map((room) => (
                    <article
                      key={room.id || room.roomId}
                      className="property-room-card"
                    >
                      <BedDouble size={23} />

                      <div>
                        <h3>
                          {room.name ||
                            room.roomName ||
                            `Room ${room.roomNumber || ""}`}
                        </h3>

                        <p>
                          {room.description ||
                            room.roomStatus ||
                            "Room available"}
                        </p>
                      </div>

                      <strong>
                        {room.price
                          ? `฿${Number(
                            room.price
                          ).toLocaleString()}`
                          : ""}
                      </strong>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </section>

          <aside className="property-owner-card">
            <p>Listed by</p>

            <div className="property-owner-profile">
              <div className="property-owner-avatar">
                {(
                  owner.username ||
                  owner.profile?.firstName ||
                  "O"
                )
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div>
                <strong>
                  {owner.username ||
                    owner.profile?.displayName ||
                    owner.profile?.firstName ||
                    "Property owner"}
                </strong>

                <span>Verified owner</span>
              </div>
            </div>

            <Link
              to="/login"
              className="property-contact-button"
            >
              <MessageCircle size={19} />
              Contact owner
            </Link>

            <small>
              Log in to start a conversation with the
              property owner.
            </small>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default PropertyDetailPage;
