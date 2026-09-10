import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { Building2, Check, RefreshCw } from "lucide-react";
import api from "../services/api.js";
import useAuthStore from "../stores/authStore";
import RentalRequestModal from "../components/rentalRequest/RentalRequestModal.jsx";
import usePropertyDetail from "../hooks/usePropertyDetail.js";
import { getGalleryImages, getPropertyDetails } from "../utils/propertyDetail.js";
import PropertyActions from "../components/propertyDetail/PropertyActions.jsx";
import PropertyGallery from "../components/propertyDetail/PropertyGallery.jsx";
import PropertySummary from "../components/propertyDetail/PropertySummary.jsx";
import RoomSection from "../components/propertyDetail/RoomSection.jsx";
import AmenitiesAndRules from "../components/propertyDetail/AmenitiesAndRules.jsx";
import BookingSidebar from "../components/propertyDetail/BookingSidebar.jsx";
import OwnerCard from "../components/propertyDetail/OwnerCard.jsx";
import SharePropertyModal from "../components/propertyDetail/SharePropertyModal.jsx";

const PropertyDetailPage = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuthStore();

  const {
    property,
    loading,
    error,
    fetchProperty,
    selectedRoomId,
    setSelectedRoomId,
  } = usePropertyDetail(propertyId);

  // Gallery and Modal State
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isRentalRequestOpen, setIsRentalRequestOpen] = useState(false);
  const [isContactingOwner, setIsContactingOwner] = useState(false);
  // Interaction State
  const [isSaved, setIsSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const toastTimer = useRef(null);
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const showToast = (message) => {
    clearTimeout(toastTimer.current);
    setToastMessage(message);
    toastTimer.current = setTimeout(() => {
      setToastMessage("");
    }, 2800);
  };

  const galleryImages = useMemo(() => getGalleryImages(property), [property]);

  const propertyDetails = getPropertyDetails(property || {}, selectedRoomId);
  const {
    rooms,
    isWholeUnit,
    isReserved,
    isRented,
    isWholeUnitUnavailable,
    isUnavailableForCommunity,
    wholeUnitStatus,
    roomStatusCounts,
    roomStartingPrice,
    address,
    ownerProfile,
    ownerDisplayName,
    selectedRoom,
    displayPrice,
  } = propertyDetails;

  const handleShare = () => setIsShareModalOpen(true);

  // Toggle Save
  const handleToggleSave = () => {
    setIsSaved((prev) => {
      const next = !prev;
      showToast(next ? "Saved to your favorites" : "Removed from favorites");
      return next;
    });
  };

  // Contact Owner Handler
  const handleContactOwner = async () => {
    if (!token || !user) {
      navigate("/login");
      return;
    }

    const ownerId = property?.owner?.id || property?.user?.id || property?.ownerId;
    if (!ownerId) {
      showToast("Unable to find the property host");
      return;
    }

    setIsContactingOwner(true);
    try {
      const response = await api.post("/conversations", {
        propertyId: Number(property.id || propertyId),
        memberId: Number(ownerId),
      });
      const conversation = response.data.conversation || response.data.data?.conversation;
      const conversationId = conversation?.id || conversation?.conversationId;

      if (!conversationId) throw new Error("Conversation was not returned");
      navigate("/Message", { state: { conversationId } });
    } catch (requestError) {
      showToast(requestError.response?.data?.message || "Unable to contact the host");
    } finally {
      setIsContactingOwner(false);
    }
  };

  const handleRequestToRent = () => {
    if (isWholeUnitUnavailable) {
      showToast(
        isReserved
          ? "This property is currently reserved"
          : "This property is unavailable for rent",
      );
      return;
    }
    if (!token || !user) {
      navigate("/login");
      return;
    }
    setIsRentalRequestOpen(true);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f5ee] flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3 bg-white p-8 rounded-2xl border border-[#e1e5dd] shadow-xs">
          <div className="w-9 h-9 border-3 border-[#4f614d] border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-copy text-sm font-medium">
            Loading property details...
          </p>
        </div>
      </main>
    );
  }

  if (error || !property) {
    return (
      <main className="min-h-screen bg-[#f7f5ee] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center bg-white p-8 rounded-2xl border border-[#e1e5dd] shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#f1f0ea] flex items-center justify-center mx-auto mb-4 text-[#4f614d]">
            <Building2 className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#1c1c16] mb-2">
            Property Unavailable
          </h1>
          <p className="text-sm text-muted-copy mb-6">
            {error ||
              "This property may have been removed or is currently unavailable."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={fetchProperty}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#4f614d] text-white font-medium text-sm hover:bg-[#435341] transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
            <Link
              to="/properties"
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-[#e1e5dd] bg-white text-sm font-medium text-[#1c1c16] hover:bg-[#f7f5ee] transition-all"
            >
              Back to Properties
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-cream text-ink antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#1c1c16] text-white px-4 py-3 rounded-xl shadow-lg animate-fade-in text-sm font-medium">
          <Check className="w-4 h-4 text-[#d4e8ce]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Layout Container */}
      <main className="mx-auto max-w-350 px-4 py-6 sm:px-6 md:py-8 lg:px-10 lg:pb-20">
        {/* Top Breadcrumb & Share Actions */}
        <PropertyActions
          property={property}
          isSaved={isSaved}
          handleToggleSave={handleToggleSave}
          handleShare={handleShare}
        />
        {/* Modern Image Gallery (4-column Stitch Layout) */}
        <PropertyGallery
          property={property}
          galleryImages={galleryImages}
        />
        {/* Main 2-Column Content Layout */}
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Property Details & Rooms (8 cols) */}
          <div className="space-y-11 lg:col-span-8">
            {/* Title, Address & Price Header */}
            <PropertySummary
              property={property}
              propertyId={propertyId}
              address={address}
              isWholeUnit={isWholeUnit}
              rooms={rooms}
              roomStartingPrice={roomStartingPrice}
              isReserved={isReserved}
              isRented={isRented}
              isWholeUnitUnavailable={isWholeUnitUnavailable}
            />
            <RoomSection
              propertyId={propertyId}
              rooms={rooms}
              isWholeUnit={isWholeUnit}
              wholeUnitStatus={wholeUnitStatus}
              roomStatusCounts={roomStatusCounts}
              galleryImages={galleryImages}
              selectedRoomId={selectedRoomId}
              setSelectedRoomId={setSelectedRoomId}
            />
            {/* Property Description & House Rules */}
            <AmenitiesAndRules property={property} />
          </div>

          {/* Right Column: Sticky Booking & Owner Card (4 cols) */}
          <div className="space-y-6 lg:sticky lg:top-24 lg:col-span-4">
            {/* Quick Booking & Room Selection Card */}
            <BookingSidebar
              property={property}
              propertyId={propertyId}
              isWholeUnit={isWholeUnit}
              isReserved={isReserved}
              isRented={isRented}
              isWholeUnitUnavailable={isWholeUnitUnavailable}
              rooms={rooms}
              displayPrice={displayPrice}
              roomStartingPrice={roomStartingPrice}
              selectedRoom={selectedRoom}
              selectedRoomId={selectedRoomId}
              setSelectedRoomId={setSelectedRoomId}
              handleRequestToRent={handleRequestToRent}
              handleShare={handleShare}
              handleContactOwner={handleContactOwner}
              isContactingOwner={isContactingOwner}
            />
            {/* Listed by Owner Card */}
            <OwnerCard
              ownerProfile={ownerProfile}
              ownerDisplayName={ownerDisplayName}
              handleContactOwner={handleContactOwner}
              isContactingOwner={isContactingOwner}
            />
          </div>
        </div>
      </main>

      {isRentalRequestOpen && (
        <RentalRequestModal
          propertyId={property.id || propertyId}
          targetName={property.title || `Property #${propertyId}`}
          onClose={() => setIsRentalRequestOpen(false)}
        />
      )}

      {/* Share Destination Modal */}
      {isShareModalOpen && (
        <SharePropertyModal
          property={property}
          propertyId={propertyId}
          galleryImages={galleryImages}
          address={address}
          displayPrice={displayPrice}
          isUnavailableForCommunity={isUnavailableForCommunity}
          isReserved={isReserved}
          isRented={isRented}
          showToast={showToast}
          onClose={() => setIsShareModalOpen(false)}
        />
      )}
    </div>
  );
};

export default PropertyDetailPage;
