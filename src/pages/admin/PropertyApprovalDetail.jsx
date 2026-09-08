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
import { Link, useNavigate, useParams } from "react-router";
import api from "../../services/api";
import RejectReasonModal from "../../components/admin/RejectReasonModal";

const PropertyApprovalDetail = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  const fetchProperty = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get(`/admin/properties/${propertyId}`);

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
        requestError.response?.data?.message || "Unable to retrieve property",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperty();
  }, [propertyId]);

  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (event) => {
      const images = property?.images || [];

      if (images.length === 0) {
        if (event.key === "Escape") {
          setLightboxOpen(false);
        }
        return;
      }

      if (event.key === "ArrowLeft") {
        setSelectedImageIndex((currentIndex) => {
          const newIndex =
            currentIndex === 0 ? images.length - 1 : currentIndex - 1;

          const imageUrl = images[newIndex]?.imageUrl || images[newIndex]?.url;

          setSelectedImage(imageUrl);

          return newIndex;
        });
      }

      if (event.key === "ArrowRight") {
        setSelectedImageIndex((currentIndex) => {
          const newIndex =
            currentIndex === images.length - 1 ? 0 : currentIndex + 1;

          const imageUrl = images[newIndex]?.imageUrl || images[newIndex]?.url;

          setSelectedImage(imageUrl);

          return newIndex;
        });
      }

      if (event.key === "Escape") {
        setLightboxOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxOpen, property]);

  const updatePublishStatus = async (publishStatus, rejectReason) => {
    const action = publishStatus === "APPROVED" ? "approve" : "reject";

    const confirmed =
      publishStatus === "REJECTED" ||
      window.confirm(`Are you sure you want to ${action} this property?`);

    if (!confirmed) return;

    setUpdating(true);
    setError("");

    try {
      await api.patch(
        `/admin/properties/${propertyId}/publish-status`,
        publishStatus === "REJECTED"
          ? { publishStatus, rejectReason }
          : { publishStatus },
      );

      setProperty((currentProperty) => ({
        ...currentProperty,
        publishStatus,
        ...(rejectReason ? { rejectReason } : {}),
      }));

      window.alert(`Property ${publishStatus.toLowerCase()} successfully`);

      if (publishStatus === "REJECTED") {
        setRejectModalOpen(false);
      }
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to update property status",
      );
    } finally {
      setUpdating(false);
    }
  };

  const getStatusClass = (status) => {
    if (status === "APPROVED") {
      return "bg-emerald-50 text-emerald-700";
    }

    if (status === "REJECTED") {
      return "bg-red-50 text-red-700";
    }

    return "bg-amber-50 text-amber-700";
  };

  if (loading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto size-10 animate-spin rounded-full border-4 border-[#DCE5DF] border-t-[#17382E]" />

          <p className="mt-4 text-sm font-medium text-[#7D8981]">
            Loading property details...
          </p>
        </div>
      </div>
    );
  }

  if (error && !property) {
    return (
      <div className="rounded-2xl border border-[#E4E9E4] bg-white px-6 py-14 text-center shadow-sm">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#EEF3EF] text-[#17382E]">
          <Building2 size={26} />
        </div>

        <h1 className="mt-4 text-xl font-bold text-[#26372E]">
          Property unavailable
        </h1>

        <p className="mx-auto mt-2 max-w-md text-sm text-[#7B8780]">{error}</p>

        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={fetchProperty}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#17382E] px-4 text-sm font-semibold text-white transition hover:bg-[#214A3D]"
          >
            <RefreshCw size={16} />
            Try again
          </button>

          <Link
            to="/admin/properties"
            className="inline-flex h-10 items-center rounded-xl border border-[#DDE4DE] bg-white px-4 text-sm font-semibold text-[#536159] transition hover:bg-[#F6F8F6]"
          >
            Back to properties
          </Link>
        </div>
      </div>
    );
  }

  if (!property) return null;

  const owner = property.owner || property.user || {};

  const profile = owner.profile || {};

  const ownerName =
    profile.fullName ||
    [profile.firstName, profile.lastName].filter(Boolean).join(" ") ||
    owner.username ||
    property.ownerName ||
    "Unknown owner";

  const publishStatus = property.publishStatus || "PENDING";

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
    "Address not provided";

  const propertyName = property.title || property.name || "Untitled property";

  const goToPreviousImage = () => {
    if (images.length === 0) return;

    const newIndex =
      selectedImageIndex === 0 ? images.length - 1 : selectedImageIndex - 1;

    const imageUrl = images[newIndex]?.imageUrl || images[newIndex]?.url;

    setSelectedImageIndex(newIndex);
    setSelectedImage(imageUrl);
  };

  const goToNextImage = () => {
    if (images.length === 0) return;

    const newIndex =
      selectedImageIndex === images.length - 1 ? 0 : selectedImageIndex + 1;

    const imageUrl = images[newIndex]?.imageUrl || images[newIndex]?.url;

    setSelectedImageIndex(newIndex);
    setSelectedImage(imageUrl);
  };

  return (
    <section className="space-y-6">
      {/* Back */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#647168] transition hover:text-[#17382E]"
      >
        <ArrowLeft size={17} />
        Back
      </button>

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#829087]">
            Property review
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#1E2F27] sm:text-3xl">
            {propertyName}
          </h1>

          <p className="mt-2 text-sm text-[#7B8780]">
            Review property information, location and images before publishing
            it on RoomHub.
          </p>
        </div>

        <span
          className={`inline-flex w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClass(
            publishStatus,
          )}`}
        >
          {publishStatus}
        </span>
      </div>

      {error && (
        <div
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          role="alert"
        >
          {error}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        {/* Main */}
        <div className="space-y-6">
          {/* Gallery */}
          <section className="rounded-2xl border border-[#E4E9E4] bg-white p-5 shadow-sm">
            <div
              className="group relative cursor-zoom-in overflow-hidden rounded-xl bg-[#EEF2EE]"
              onClick={() => selectedImage && setLightboxOpen(true)}
            >
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={propertyName}
                  className="h-[300px] w-full object-cover transition group-hover:scale-[1.01]"
                />
              ) : (
                <div className="grid h-[300px] place-items-center text-[#9AA59E]">
                  <Building2 size={52} />
                </div>
              )}

              {selectedImage && (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/40 to-transparent px-4 pb-3 pt-10 opacity-0 transition group-hover:opacity-100">
                  <p className="text-sm font-medium text-white">
                    Click to view full image
                  </p>
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                {images.map((image, index) => {
                  const imageUrl = image.imageUrl || image.url;

                  return (
                    <button
                      type="button"
                      key={image.id || index}
                      onClick={() => {
                        setSelectedImage(imageUrl);
                        setSelectedImageIndex(index);
                      }}
                      className={`shrink-0 overflow-hidden rounded-xl border-2 transition ${
                        selectedImage === imageUrl
                          ? "border-[#17382E]"
                          : "border-transparent hover:border-[#A9BBA3]"
                      }`}
                    >
                      <img
                        src={imageUrl}
                        alt={`Property ${index + 1}`}
                        className="size-20 object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          {/* Property info */}
          <section className="rounded-2xl border border-[#E4E9E4] bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-[#EEF1EE] px-6 py-5">
              <div className="grid size-10 place-items-center rounded-xl bg-[#EEF3EF] text-[#17382E]">
                <Building2 size={19} />
              </div>

              <div>
                <h2 className="font-semibold text-[#26382F]">
                  Property information
                </h2>

                <p className="mt-0.5 text-xs text-[#8A958E]">
                  Listing and rental details
                </p>
              </div>
            </div>

            <div className="grid gap-x-8 gap-y-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
              <InfoItem
                label="Property type"
                value={property.propertyType || property.type || "—"}
              />

              <InfoItem
                label="Rent type"
                value={property.rentType?.replaceAll("_", " ") || "—"}
              />

              <InfoItem
                label="Monthly rent"
                value={
                  property.monthlyRent != null
                    ? `฿${Number(property.monthlyRent).toLocaleString()} / month`
                    : "—"
                }
              />

              <InfoItem
                label="Deposit"
                value={
                  property.deposit != null
                    ? `฿${Number(property.deposit).toLocaleString()}`
                    : "—"
                }
              />

              {property.rentType === "WHOLE_UNIT" ? (
                <InfoItem
                  label="Bedrooms"
                  value={property.totalBedrooms ?? "—"}
                  icon={<BedDouble size={15} />}
                />
              ) : (
                <InfoItem
                  label="Rooms"
                  value={property.rooms?.length ?? 0}
                  icon={<BedDouble size={15} />}
                />
              )}

              <InfoItem
                label="Property status"
                value={property.propertyStatus || property.status || "—"}
              />

              <InfoItem
                label="Available from"
                value={
                  property.availableDate
                    ? new Date(property.availableDate).toLocaleDateString()
                    : "—"
                }
              />

              <InfoItem
                label="Submitted"
                value={
                  property.createdAt
                    ? new Date(property.createdAt).toLocaleString()
                    : "—"
                }
              />
            </div>
          </section>

          {/* Location */}
          <section className="rounded-2xl border border-[#E4E9E4] bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-[#EEF1EE] px-6 py-5">
              <div className="grid size-10 place-items-center rounded-xl bg-[#EEF3EF] text-[#17382E]">
                <MapPin size={19} />
              </div>

              <div>
                <h2 className="font-semibold text-[#26382F]">
                  Location and description
                </h2>

                <p className="mt-0.5 text-xs text-[#8A958E]">
                  Address and listing description
                </p>
              </div>
            </div>

            <div className="space-y-5 p-6">
              <DetailBlock label="Address" value={address} />

              <DetailBlock
                label="Description"
                value={property.description || "No description was provided."}
              />
            </div>
          </section>

          {/* Owner */}
          <section className="rounded-2xl border border-[#E4E9E4] bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-[#EEF1EE] px-6 py-5">
              <div className="grid size-10 place-items-center rounded-xl bg-[#EEF3EF] text-[#17382E]">
                <UserRound size={19} />
              </div>

              <div>
                <h2 className="font-semibold text-[#26382F]">
                  Owner information
                </h2>

                <p className="mt-0.5 text-xs text-[#8A958E]">
                  Account responsible for this property
                </p>
              </div>
            </div>

            <div className="grid gap-x-8 gap-y-6 p-6 sm:grid-cols-2">
              <InfoItem label="Owner name" value={ownerName} />

              <InfoItem label="Email" value={owner.email || "—"} />
            </div>
          </section>
        </div>

        {/* Decision */}
        <aside className="h-fit rounded-2xl border border-[#E4E9E4] bg-white p-5 shadow-sm xl:sticky xl:top-28">
          <h2 className="font-semibold text-[#26382F]">Publishing decision</h2>

          <p className="mt-2 text-sm leading-6 text-[#7B8780]">
            Approve the listing only after checking the property information,
            location and images.
          </p>

          <div className="my-5 h-px bg-[#EEF1EE]" />

          {publishStatus === "PENDING" ? (
            <div className="space-y-3">
              <button
                type="button"
                disabled={updating}
                onClick={() => updatePublishStatus("APPROVED")}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#17382E] text-sm font-semibold text-white transition hover:bg-[#214A3D] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Check size={17} />
                {updating ? "Updating..." : "Approve property"}
              </button>

              <button
                type="button"
                disabled={updating}
                onClick={() => {
                  setError("");
                  setRejectModalOpen(true);
                }}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={17} />
                Reject property
              </button>
            </div>
          ) : (
            <div
              className={`rounded-xl px-4 py-4 text-sm font-semibold ${getStatusClass(
                publishStatus,
              )}`}
            >
              This property has been {publishStatus.toLowerCase()}.
            </div>
          )}

          <Link
            to="/admin/properties"
            className="mt-4 inline-flex w-full items-center justify-center text-sm font-semibold text-[#647168] transition hover:text-[#17382E]"
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

      {lightboxOpen && selectedImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-6"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Close */}
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute right-6 top-6 z-10 grid size-11 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25"
            aria-label="Close image"
          >
            <X size={22} />
          </button>

          {/* Previous */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                goToPreviousImage();
              }}
              className="absolute left-50 z-10 grid size-12 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25"
              aria-label="Previous image"
            >
              <ArrowLeft size={24} />
            </button>
          )}

          {/* Full image */}
          <div
            className="flex max-h-[92vh] max-w-[90vw] flex-col items-center"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt={propertyName}
              className="max-h-[82vh] max-w-[90vw] rounded-lg object-contain"
            />

            {images.length > 1 && (
              <div className="mt-4 rounded-full bg-black/30 px-3 py-1 text-sm font-medium text-white">
                {selectedImageIndex + 1} / {images.length}
              </div>
            )}
          </div>

          {/* Next */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                goToNextImage();
              }}
              className="absolute right-50 z-10 grid size-12 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25"
              aria-label="Next image"
            >
              <ArrowLeft size={24} className="rotate-180" />
            </button>
          )}
        </div>
      )}
    </section>
  );
};

const InfoItem = ({ label, value, icon }) => (
  <div>
    <p className="text-xs font-medium text-[#8A958E]">{label}</p>

    <div className="mt-1.5 flex items-center gap-2 text-sm font-semibold text-[#33463C]">
      {icon}
      <span className="break-words">{value}</span>
    </div>
  </div>
);

const DetailBlock = ({ label, value }) => (
  <div>
    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8B968F]">
      {label}
    </p>

    <p className="mt-2 rounded-xl bg-[#F7F9F7] px-4 py-3 text-sm leading-6 text-[#56635B]">
      {value}
    </p>
  </div>
);

export default PropertyApprovalDetail;
