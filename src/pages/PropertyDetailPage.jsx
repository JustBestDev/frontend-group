import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
  Bath,
  BedDouble,
  Building2,
  Camera,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Copy,
  DoorOpen,
  Heart,
  Home,
  Loader2,
  MapPin,
  MessageCircle,
  RefreshCw,
  Share2,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import api from "../services/api";
import useAuthStore from "../stores/authStore";

const FALLBACK_GALLERY = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80",
];

const PropertyDetailPage = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Gallery and Modal State
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSharingToCommunity, setIsSharingToCommunity] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postDescription, setPostDescription] = useState("");
  const [requireMember, setRequireMember] = useState(1);

  // Interaction State
  const [isSaved, setIsSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState("");

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage("");
    }, 2800);
  };

  const fetchProperty = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get(`/properties/${propertyId}`);
      const propertyData =
        response.data.data?.property ||
        response.data.data ||
        response.data.property;

      setProperty(propertyData || null);

      if (propertyData?.rooms?.length) {
        const firstAvailable =
          propertyData.rooms.find(
            (r) =>
              (r.status || r.roomStatus || "").toUpperCase() === "AVAILABLE",
          ) || propertyData.rooms[0];
        setSelectedRoomId(String(firstAvailable.id || firstAvailable.roomId));
      }
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to retrieve property details. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  useEffect(() => {
    fetchProperty();
  }, [fetchProperty]);

  // Gallery images preparation
  const galleryImages = useMemo(() => {
    if (!property) return FALLBACK_GALLERY;
    const list = [];
    if (Array.isArray(property.images) && property.images.length > 0) {
      property.images.forEach((img) => {
        const url = typeof img === "string" ? img : img.imageUrl || img.url;
        if (url) list.push(url);
      });
    } else if (property.imageUrl) {
      list.push(property.imageUrl);
    }

    // Fill with pleasant fallbacks if fewer than 5
    if (list.length === 0) return FALLBACK_GALLERY;
    let fallbackIdx = 0;
    while (list.length < 5) {
      list.push(FALLBACK_GALLERY[fallbackIdx % FALLBACK_GALLERY.length]);
      fallbackIdx++;
    }
    return list;
  }, [property]);

  // =========================================================================
  // Share Handlers & Database Integration
  // =========================================================================

  /**
   * Save shared property post to database for Community feed.
   * Prepared placeholder function ready for your custom backend API.
   */
  const saveShareToDatabase = async (propertyData, postData = {}) => {
    const payload = {
      propertyId: propertyData?.id || propertyId,
      title:
        postData.title ||
        propertyData?.title ||
        propertyData?.name ||
        `Listing #${propertyData?.id}`,
      description: postData.description || "",
      requiredMembers: Number(postData.requireMember) || 1,
    };
    const response = await api.post("/community-posts", payload);
    if (response.status === 200) {
      showToast("Shared to community post successfully ✅");
    } else {
      showToast("Shared to community post failed ❌");
    }
  };

  // Open the share destination modal
  const handleShare = () => {
    setPostTitle(property?.title || property?.name || "");
    setPostDescription("");
    setRequireMember(1);
    setIsShareModalOpen(true);
  };

  // Share to RoomMate Community
  const handleShareToCommunity = async () => {
    if (!postTitle.trim()) {
      showToast("Please enter a post title");
      return;
    }
    setIsSharingToCommunity(true);
    try {
      await saveShareToDatabase(property, {
        title: postTitle.trim(),
        description: postDescription.trim(),
        requireMember: Number(requireMember) || 1,
      });
      showToast("Shared to Community successfully!");
      setIsShareModalOpen(false);
    } catch (err) {
      console.error("Failed to save community share:", err);
      showToast("Failed to share to Community. Please try again.");
    } finally {
      setIsSharingToCommunity(false);
    }
  };

  // Direct link copy
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("Property link copied to clipboard!");
    } catch {
      showToast("Failed to copy link");
    }
  };

  // Toggle Save
  const handleToggleSave = () => {
    setIsSaved((prev) => {
      const next = !prev;
      showToast(next ? "Saved to your favorites" : "Removed from favorites");
      return next;
    });
  };

  // Contact Owner Handler
  const handleContactOwner = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate("/Message");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f5ee] flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3 bg-white p-8 rounded-2xl border border-[#e1e5dd] shadow-xs">
          <div className="w-9 h-9 border-3 border-[#4f614d] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#6f7a73] text-sm font-medium">
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
          <p className="text-sm text-[#6f7a73] mb-6">
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

  // Extracted and computed property data
  const rooms = property.rooms || [];
  const availableRooms = rooms.filter(
    (room) =>
      (room.status || room.roomStatus || "").toUpperCase() === "AVAILABLE",
  );
  const occupiedRoomsCount = rooms.length - availableRooms.length;

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
    "Bangkok, Thailand";

  const owner = property.owner || property.user || {};
  const ownerProfile = owner.profile || {};
  const ownerDisplayName =
    ownerProfile.displayName ||
    ownerProfile.fullName ||
    [ownerProfile.firstName, ownerProfile.lastName].filter(Boolean).join(" ") ||
    owner.username ||
    "Property Host";

  const selectedRoom =
    rooms.find((r) => String(r.id || r.roomId) === String(selectedRoomId)) ||
    rooms[0];

  const displayPrice = selectedRoom?.monthlyRent || property.monthlyRent || 0;

  return (
    <div className="min-h-screen bg-[#f7f5ee] text-[#1c1c16] antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#1c1c16] text-white px-4 py-3 rounded-xl shadow-lg animate-fade-in text-sm font-medium">
          <Check className="w-4 h-4 text-[#d4e8ce]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Layout Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Top Breadcrumb & Share Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-[#6f7a73] overflow-x-auto">
            <Link
              to="/"
              className="hover:text-[#4f614d] flex items-center gap-1 transition-colors shrink-0"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#a8b0a7] shrink-0" />
            <Link
              to="/properties"
              className="hover:text-[#4f614d] transition-colors shrink-0"
            >
              All Properties
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#a8b0a7] shrink-0" />
            <span className="text-[#1c1c16] font-medium truncate max-w-[200px] sm:max-w-[320px]">
              {property.title || property.name || "Property Details"}
            </span>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleSave}
              className={`p-2.5 rounded-full border transition-all cursor-pointer shadow-xs flex items-center gap-1.5 text-xs font-semibold ${
                isSaved
                  ? "bg-[#eedcd4] border-[#d8b8a8] text-[#835024]"
                  : "bg-white border-[#e1e5dd] text-[#6f7a73] hover:text-[#835024] hover:bg-[#faf7f2]"
              }`}
              title={isSaved ? "Saved" : "Save Property"}
            >
              <Heart
                className={`w-4 h-4 ${
                  isSaved ? "fill-[#835024] text-[#835024]" : ""
                }`}
              />
              <span className="hidden sm:inline">
                {isSaved ? "Saved" : "Save"}
              </span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="p-2.5 rounded-full bg-white border border-[#e1e5dd] text-[#6f7a73] hover:text-[#4f614d] hover:bg-[#faf7f2] transition-all cursor-pointer shadow-xs flex items-center gap-1.5 text-xs font-semibold"
              title="Share Listing"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>

        {/* Modern Image Gallery (4-column Stitch Layout) */}
        <section className="relative rounded-2xl overflow-hidden bg-[#e5e2d9] border border-[#e1e5dd] shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-2 md:h-[420px] p-2">
            {/* Main Featured Image */}
            <div
              className="md:col-span-2 md:row-span-2 relative h-[280px] md:h-full rounded-xl overflow-hidden cursor-pointer group"
              onClick={() => {
                setActivePhotoIndex(0);
                setIsPhotoModalOpen(true);
              }}
            >
              <img
                src={galleryImages[0]}
                alt={property.title || "Property"}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
              <div className="absolute top-3 left-3 bg-[#1c1c16]/80 text-white text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#d4e8ce]" />
                Featured Photo
              </div>
            </div>

            {/* Secondary 1 */}
            <div
              className="hidden md:block relative h-full rounded-xl overflow-hidden cursor-pointer group"
              onClick={() => {
                setActivePhotoIndex(1);
                setIsPhotoModalOpen(true);
              }}
            >
              <img
                src={galleryImages[1]}
                alt="Property detail 2"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
            </div>

            {/* Secondary 2 */}
            <div
              className="hidden md:block relative h-full rounded-xl overflow-hidden cursor-pointer group"
              onClick={() => {
                setActivePhotoIndex(2);
                setIsPhotoModalOpen(true);
              }}
            >
              <img
                src={galleryImages[2]}
                alt="Property detail 3"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
            </div>

            {/* Secondary 3 */}
            <div
              className="hidden md:block relative h-full rounded-xl overflow-hidden cursor-pointer group"
              onClick={() => {
                setActivePhotoIndex(3);
                setIsPhotoModalOpen(true);
              }}
            >
              <img
                src={galleryImages[3]}
                alt="Property detail 4"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
            </div>

            {/* Secondary 4 with View All Photos Overlay */}
            <div
              className="hidden md:block relative h-full rounded-xl overflow-hidden cursor-pointer group"
              onClick={() => {
                setActivePhotoIndex(4);
                setIsPhotoModalOpen(true);
              }}
            >
              <img
                src={galleryImages[4]}
                alt="Property detail 5"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors" />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePhotoIndex(0);
                  setIsPhotoModalOpen(true);
                }}
                className="absolute bottom-3 right-3 bg-white/95 text-[#1c1c16] hover:bg-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-md backdrop-blur-sm flex items-center gap-1.5 transition-all"
              >
                <Camera className="w-3.5 h-3.5 text-[#4f614d]" />
                View All Photos ({galleryImages.length})
              </button>
            </div>
          </div>

          {/* Mobile view all photos trigger */}
          <div className="md:hidden p-3 bg-white flex justify-end">
            <button
              type="button"
              onClick={() => setIsPhotoModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4f614d] bg-[#e6ede3] px-3.5 py-2 rounded-xl"
            >
              <Camera className="w-3.5 h-3.5" />
              View All Photos ({galleryImages.length})
            </button>
          </div>
        </section>

        {/* Main 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Property Details & Rooms (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Title, Address & Price Header */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#e1e5dd] shadow-xs">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-[#e6ede3] text-[#294c25] text-xs font-bold uppercase tracking-wider">
                  {property.propertyType || "CONDO"}
                </span>
                <span className="px-3 py-1 rounded-full bg-[#f1f0ea] text-[#6f7a73] text-xs font-semibold">
                  {property.rentType
                    ? property.rentType.replaceAll("_", " ")
                    : "ROOM SHARE"}
                </span>
                <span className="text-xs text-[#889188] ml-auto">
                  Listing #{propertyId}
                </span>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1c1c16] tracking-tight mb-3">
                {property.title ||
                  property.name ||
                  "Quality Living Space Ready to Move In"}
              </h1>

              <p className="flex items-center gap-2 text-sm sm:text-[15px] text-[#6f7a73] mb-6">
                <MapPin className="w-4 h-4 text-[#4f614d] shrink-0" />
                <span>{address}</span>
              </p>

              {/* Quick Specs Chips */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-6 pt-5 border-t border-[#f1eee4] text-sm text-[#414753]">
                <div className="flex items-center gap-2 bg-[#f7f4ea] px-3.5 py-1.5 rounded-xl border border-[#e4e4d9]">
                  <Building2 className="w-4 h-4 text-[#4f614d]" />
                  <span className="font-medium">
                    {property.size || property.area
                      ? `${property.size || property.area} sq.m.`
                      : "Spacious Layout"}
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-[#f7f4ea] px-3.5 py-1.5 rounded-xl border border-[#e4e4d9]">
                  <BedDouble className="w-4 h-4 text-[#4f614d]" />
                  <span className="font-medium">
                    {rooms.length > 0
                      ? `${rooms.length} ${rooms.length === 1 ? "Bedroom" : "Bedrooms"}`
                      : "1 Bedroom"}
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-[#f7f4ea] px-3.5 py-1.5 rounded-xl border border-[#e4e4d9]">
                  <Bath className="w-4 h-4 text-[#4f614d]" />
                  <span className="font-medium">
                    {property.bathrooms
                      ? `${property.bathrooms} ${property.bathrooms === 1 ? "Bathroom" : "Bathrooms"}`
                      : "Modern Bathroom"}
                  </span>
                </div>
              </div>

              {/* Total Price Callout */}
              <div className="mt-6 pt-5 border-t border-[#f1eee4] flex items-baseline gap-2">
                <span className="font-serif text-3xl font-bold text-[#4f614d]">
                  ฿
                  {property.monthlyRent
                    ? Number(property.monthlyRent).toLocaleString()
                    : "Contact for Price"}
                </span>
                <span className="text-sm text-[#6f7a73]">
                  / month (entire unit starting price)
                </span>
              </div>
            </div>

            {/* Room Availability Status Banner */}
            <div className="bg-white p-6 rounded-2xl border border-[#e1e5dd] shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="font-serif text-xl font-bold text-[#1c1c16]">
                    Unit Room Status
                  </h2>
                  <p className="text-xs text-[#6f7a73] mt-0.5">
                    This unit has {rooms.length || 1} bedrooms available for
                    individual rental.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  <div className="inline-flex items-center gap-2 bg-[#e6ede3] border border-[#cbe0c6] px-3.5 py-1.5 rounded-full text-xs font-bold text-[#294c25]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#4f614d]" />
                    {availableRooms.length} Available
                  </div>
                  {occupiedRoomsCount > 0 && (
                    <div className="inline-flex items-center gap-2 bg-[#f1f0ea] border border-[#e1ded5] px-3.5 py-1.5 rounded-full text-xs font-medium text-[#6f7a73]">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#a8b0a7]" />
                      {occupiedRoomsCount} Occupied
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bedroom Selection Cards (Stitch Style) */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#e1e5dd] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1c1c16]">
                    Select a Bedroom
                  </h2>
                  <p className="text-xs sm:text-sm text-[#6f7a73] mt-0.5">
                    Choose a room to view pricing, specifications, and
                    amenities.
                  </p>
                </div>
                <span className="text-xs font-semibold text-[#4f614d] bg-[#e6ede3] px-3 py-1 rounded-lg">
                  {rooms.length} {rooms.length === 1 ? "Room" : "Rooms"} Total
                </span>
              </div>

              {rooms.length === 0 ? (
                <div className="p-8 text-center bg-[#f7f5ee] rounded-xl border border-dashed border-[#dcd8cc]">
                  <DoorOpen className="w-8 h-8 text-[#6f7a73] mx-auto mb-2" />
                  <p className="text-sm font-medium text-[#1c1c16]">
                    This property is rented as an entire unit
                  </p>
                  <p className="text-xs text-[#6f7a73] mt-1">
                    Contact the host directly to inquire about lease terms and
                    booking.
                  </p>
                </div>
              ) : (
                <div className="space-y-3.5 pt-2">
                  {rooms.map((room, index) => {
                    const roomId = room.id || room.roomId || index + 1;
                    const isAvailable =
                      (room.status || room.roomStatus || "").toUpperCase() ===
                        "AVAILABLE" ||
                      (!room.status && !room.roomStatus);
                    const roomPrice =
                      room.monthlyRent || property.monthlyRent || 0;
                    const roomImage =
                      room.images?.[0]?.imageUrl ||
                      room.images?.[0]?.url ||
                      room.imageUrl ||
                      galleryImages[index % galleryImages.length];

                    const isCardSelected =
                      String(selectedRoomId) === String(roomId);

                    return (
                      <div
                        key={roomId}
                        onClick={() => setSelectedRoomId(String(roomId))}
                        className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-xl border transition-all cursor-pointer gap-4 ${
                          isCardSelected
                            ? "border-[#4f614d] bg-[#f8faf7] shadow-sm ring-1 ring-[#4f614d]"
                            : isAvailable
                              ? "border-[#e1e5dd] bg-white hover:border-[#a9bba3] hover:shadow-xs"
                              : "border-[#e1e5dd] bg-[#fcfbf9] opacity-75"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          {/* Room Thumbnail */}
                          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-[#e5e2d9] overflow-hidden shrink-0 relative">
                            <img
                              src={roomImage}
                              alt={room.name || `Bedroom ${index + 1}`}
                              className={`w-full h-full object-cover ${
                                !isAvailable ? "grayscale" : ""
                              }`}
                            />
                            {!isAvailable && (
                              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                <span className="text-[10px] font-bold text-white uppercase bg-black/60 px-2 py-0.5 rounded">
                                  Occupied
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Room Info */}
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2.5">
                              <h3 className="font-serif text-lg font-bold text-[#1c1c16]">
                                {room.name ||
                                  room.roomName ||
                                  `Bedroom ${index + 1}`}
                              </h3>
                              {isAvailable ? (
                                <span className="bg-[#e6ede3] text-[#294c25] border border-[#b8deb0] px-2.5 py-0.5 rounded-full text-xs font-bold">
                                  Available
                                </span>
                              ) : (
                                <span className="bg-[#f1f0ea] text-[#6f7a73] border border-[#e1ded5] px-2.5 py-0.5 rounded-full text-xs font-medium">
                                  Occupied
                                </span>
                              )}
                            </div>

                            <div className="flex items-baseline gap-1 text-[#1c1c16]">
                              <span className="font-serif text-lg font-bold text-[#4f614d]">
                                ฿{Number(roomPrice).toLocaleString()}
                              </span>
                              <span className="text-xs text-[#6f7a73]">
                                / month
                              </span>
                            </div>

                            {/* Features Tags */}
                            <div className="flex flex-wrap gap-2 text-xs text-[#6f7a73]">
                              <span className="bg-[#f1eee4] px-2 py-0.5 rounded">
                                {room.capacity
                                  ? `Capacity: ${room.capacity}`
                                  : "Single Bed"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action Link */}
                        <div className="flex items-center justify-end sm:justify-center">
                          {isAvailable ? (
                            <Link
                              to={`/properties/${propertyId}/${roomId}`}
                              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#4f614d] text-white text-xs font-bold hover:bg-[#41513f] transition-all text-center cursor-pointer shadow-xs active:scale-98"
                              onClick={(e) => e.stopPropagation()}
                            >
                              View Room Details
                            </Link>
                          ) : (
                            <span className="text-xs text-[#889188] bg-[#f1f0ea] px-4 py-2 rounded-xl font-medium cursor-not-allowed">
                              Unavailable
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Property Description & House Rules */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#e1e5dd] shadow-xs space-y-6">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1c1c16] mb-3">
                  About This Property
                </h2>
                <div className="text-sm leading-relaxed text-[#414753] whitespace-pre-line space-y-3">
                  {property.description ? (
                    <p>{property.description}</p>
                  ) : (
                    <p className="text-[#6f7a73]">
                      Move-in ready space featuring ample natural light,
                      functional layout, and convenient access to local transit
                      and amenities. Ideal for students and professionals
                      seeking a warm, respectful roommate community.
                    </p>
                  )}
                </div>
              </div>
              {/* House Guidelines / Rules */}
              <div className="pt-6 border-t border-[#f1eee4]">
                <h3 className="font-serif text-lg font-bold text-[#1c1c16] mb-3">
                  House Rules & Guidelines
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#505a54]">
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-[#f7f5ee]">
                    <CheckCircle2 className="w-4 h-4 text-[#4f614d] shrink-0" />
                    <span>Quiet hours after 10:00 PM</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-[#f7f5ee]">
                    <CheckCircle2 className="w-4 h-4 text-[#4f614d] shrink-0" />
                    <span>Strictly no smoking indoors or in common areas</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-[#f7f5ee]">
                    <CheckCircle2 className="w-4 h-4 text-[#4f614d] shrink-0" />
                    <span>Keep common spaces tidy and clean up after use</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-[#f7f5ee]">
                    <CheckCircle2 className="w-4 h-4 text-[#4f614d] shrink-0" />
                    <span>Pets allowed upon prior host approval</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Booking & Owner Card (4 cols) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            {/* Quick Booking & Room Selection Card */}
            <div className="bg-white border border-[#e1e5dd] rounded-2xl p-6 sm:p-7 shadow-xs space-y-6">
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1c1c16] mb-1">
                  Interested in this property?
                </h3>
                <div className="flex items-baseline gap-1.5 mt-2">
                  <span className="text-xs text-[#6f7a73]">
                    Selected room rate:
                  </span>
                  <span className="font-serif text-2xl font-bold text-[#4f614d]">
                    ฿{Number(displayPrice).toLocaleString()}
                  </span>
                  <span className="text-xs text-[#6f7a73]">/ month</span>
                </div>
              </div>

              {/* Room Selection Dropdown */}
              {rooms.length > 0 && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1c1c16] uppercase tracking-wider">
                    Select Bedroom
                  </label>
                  <select
                    value={selectedRoomId}
                    onChange={(e) => setSelectedRoomId(e.target.value)}
                    className="w-full bg-[#f7f5ee] border border-[#e1ded5] rounded-xl px-3.5 py-2.5 text-sm text-[#1c1c16] focus:outline-hidden focus:ring-2 focus:ring-[#4f614d] font-medium"
                  >
                    {rooms.map((r, i) => {
                      const id = String(r.id || r.roomId || i + 1);
                      const isAvail =
                        (r.status || r.roomStatus || "").toUpperCase() ===
                          "AVAILABLE" ||
                        (!r.status && !r.roomStatus);
                      return (
                        <option key={id} value={id}>
                          {r.name || r.roomName || `Bedroom ${i + 1}`} (฿
                          {Number(
                            r.monthlyRent || property.monthlyRent || 0,
                          ).toLocaleString()}
                          /mo) {isAvail ? "• Available" : "• Occupied"}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}

              {/* Lease Breakdown Summary */}
              <div className="bg-[#f7f5ee] p-4 rounded-xl space-y-2.5 text-xs text-[#414753] border border-[#ece8dc]">
                <div className="flex justify-between items-center">
                  <span className="text-[#6f7a73]">Security Deposit</span>
                  <span className="font-bold text-[#1c1c16]">1 - 2 Months</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#6f7a73]">Minimum Lease</span>
                  <span className="font-bold text-[#1c1c16]">
                    6 - 12 Months
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#6f7a73]">
                    Utilities (Water / Power)
                  </span>
                  <span className="font-bold text-[#1c1c16]">
                    Billed by meter
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2.5 pt-1">
                {selectedRoom && (
                  <Link
                    to={`/properties/${propertyId}/${selectedRoom.id || selectedRoom.roomId || selectedRoomId}`}
                    className="w-full py-3 px-4 rounded-xl bg-[#4f614d] text-white text-sm font-bold hover:bg-[#41513f] transition-all flex items-center justify-center gap-2 shadow-xs active:scale-98"
                  >
                    <span>View Room Details</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                )}

                <button
                  type="button"
                  onClick={handleContactOwner}
                  className="w-full py-3 px-4 rounded-xl border border-[#4f614d] text-[#4f614d] bg-white hover:bg-[#e6ede3]/40 text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Contact Host</span>
                </button>
              </div>
            </div>

            {/* Listed by Owner Card */}
            <div className="bg-white border border-[#e1e5dd] rounded-2xl p-6 shadow-xs space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6f7a73]">
                Property Host
              </span>

              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-[#eedcd4] border border-[#e0c9bd] flex items-center justify-center font-bold text-lg text-[#835024] shrink-0">
                  {ownerProfile.avatar ? (
                    <img
                      src={ownerProfile.avatar}
                      alt={ownerDisplayName}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    ownerDisplayName.charAt(0).toUpperCase()
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-sm text-[#1c1c16]">
                    {ownerDisplayName}
                  </h4>
                  <div className="flex items-center gap-1 text-xs text-[#4f614d] font-semibold mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified Host</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-[#f7f5ee] rounded-xl text-xs text-[#6f7a73] space-y-1">
                <p>• Usually responds within an hour</p>
                <p>• Schedule room viewing at least 1 day in advance</p>
              </div>

              <button
                type="button"
                onClick={handleContactOwner}
                className="w-full py-2.5 rounded-xl bg-[#f1eee4] hover:bg-[#e8e4d8] text-[#1c1c16] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#4f614d]" />
                <span>Send Host a Message</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Fullscreen Photo Lightbox Modal */}
      {isPhotoModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col justify-between p-4 sm:p-6"
          onClick={() => setIsPhotoModalOpen(false)}
        >
          {/* Modal Header */}
          <div
            className="flex items-center justify-between text-white max-w-6xl w-full mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-sm font-medium">
              Photo {activePhotoIndex + 1} of {galleryImages.length}
            </span>
            <button
              type="button"
              onClick={() => setIsPhotoModalOpen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white cursor-pointer"
              title="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Active Image with Navigation */}
          <div
            className="relative flex items-center justify-center max-w-5xl w-full mx-auto my-auto max-h-[75vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() =>
                setActivePhotoIndex(
                  (prev) =>
                    (prev - 1 + galleryImages.length) % galleryImages.length,
                )
              }
              className="absolute left-2 sm:-left-12 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-all cursor-pointer z-10"
              title="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <img
              src={galleryImages[activePhotoIndex]}
              alt={`Photo ${activePhotoIndex + 1}`}
              className="max-h-[70vh] max-w-full object-contain rounded-xl shadow-2xl"
            />

            <button
              type="button"
              onClick={() =>
                setActivePhotoIndex((prev) => (prev + 1) % galleryImages.length)
              }
              className="absolute right-2 sm:-right-12 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-all cursor-pointer z-10"
              title="Next photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Thumbnails Strip */}
          <div
            className="flex items-center justify-center gap-2 overflow-x-auto py-2 max-w-4xl w-full mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {galleryImages.map((imgUrl, i) => (
              <button
                type="button"
                key={i}
                onClick={() => setActivePhotoIndex(i)}
                className={`w-14 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                  activePhotoIndex === i
                    ? "border-white scale-105 shadow-md"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={imgUrl}
                  alt={`Thumb ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Share Destination Modal */}
      {isShareModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in"
          onClick={() => setIsShareModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 md:p-9 shadow-2xl border border-[#e1e5dd] relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-5 mb-6 border-b border-[#f0f2ee]">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#1c1c16] font-serif">
                  Share Listing
                </h3>
                <p className="text-xs sm:text-sm text-[#6f7a73] mt-1">
                  Choose where you'd like to share this property listing
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsShareModalOpen(false)}
                className="p-2 rounded-full text-[#6f7a73] hover:text-[#1c1c16] hover:bg-[#f0f2ee] transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Property Preview Card */}
            <div className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-[#f7f5ee] border border-[#e1e5dd] mb-6">
              <img
                src={galleryImages[0]}
                alt={property?.title || property?.name || "Property preview"}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shrink-0 shadow-xs"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-base sm:text-lg font-bold text-[#1c1c16] truncate">
                  {property?.title ||
                    property?.name ||
                    `Property #${propertyId}`}
                </h4>
                <p className="text-xs sm:text-sm text-[#6f7a73] truncate flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#4f614d] shrink-0" />
                  <span>{address}</span>
                </p>
                <p className="text-sm sm:text-base font-bold text-[#4f614d] mt-1.5">
                  {displayPrice
                    ? `฿${Number(displayPrice).toLocaleString()}/month`
                    : "Price on request"}
                </p>
              </div>
            </div>

            {/* Option 1: Share to Community (Saves to database) */}
            <div className="mb-6 p-5 sm:p-6 rounded-2xl border-2 border-[#e6ede3] bg-[#fbfdfa]">
              <div className="flex items-start sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#e6ede3] text-[#294c25] flex items-center justify-center shrink-0 shadow-xs">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-[#1c1c16]">
                      Share to RoomMate Community
                    </h4>
                    <p className="text-xs sm:text-sm text-[#6f7a73] mt-0.5">
                      Save listing to database & publish on the Community
                      roommate feed
                    </p>
                  </div>
                </div>
                <span className="hidden sm:inline-flex text-xs uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-[#e6ede3] text-[#294c25] shrink-0">
                  Internal Feed
                </span>
              </div>

              {/* Form Inputs for Community Post */}
              <div className="space-y-3.5 mb-5">
                {/* Title & Require Member Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[#1c1c16] mb-1.5">
                      Post Title / หัวข้อโพสต์{" "}
                      <span className="text-[#b95858]">*</span>
                    </label>
                    <input
                      type="text"
                      value={postTitle}
                      onChange={(e) => setPostTitle(e.target.value)}
                      placeholder="e.g. Looking for roommates to share this condo unit"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-white border border-[#e1e5dd] rounded-xl text-[#1c1c16] placeholder:text-[#a0aaa2] focus:outline-none focus:ring-1.5 focus:ring-[#4f614d] focus:border-[#4f614d] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1c1c16] mb-1.5">
                      Require Member
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={requireMember}
                        onChange={(e) =>
                          setRequireMember(
                            Math.max(1, parseInt(e.target.value, 10) || 1),
                          )
                        }
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-white border border-[#e1e5dd] rounded-xl text-[#1c1c16] focus:outline-none focus:ring-1.5 focus:ring-[#4f614d] focus:border-[#4f614d] transition-all"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#6f7a73] pointer-events-none">
                        person
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description Textarea */}
                <div>
                  <label className="block text-xs font-bold text-[#1c1c16] mb-1.5">
                    Description / รายละเอียด
                  </label>
                  <textarea
                    rows={3}
                    value={postDescription}
                    onChange={(e) => setPostDescription(e.target.value)}
                    placeholder="Describe roommate preferences, habits, move-in schedule, or rent splitting details..."
                    className="w-full text-xs sm:text-sm p-3.5 bg-white border border-[#e1e5dd] rounded-xl text-[#1c1c16] placeholder:text-[#a0aaa2] focus:outline-none focus:ring-1.5 focus:ring-[#4f614d] focus:border-[#4f614d] transition-all resize-none"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleShareToCommunity}
                disabled={isSharingToCommunity}
                className="w-full py-3 sm:py-3.5 px-5 rounded-xl bg-[#4f614d] hover:bg-[#41513f] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs disabled:opacity-60"
              >
                {isSharingToCommunity ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving to Database & Sharing...</span>
                  </>
                ) : (
                  <>
                    <Users className="w-4 h-4" />
                    <span>Post to Community Feed</span>
                  </>
                )}
              </button>
            </div>

            {/* Copy Direct Link */}
            <div>
              <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-[#6f7a73] mb-2">
                Copy Listing Link
              </label>
              <div className="flex items-center gap-2.5">
                <input
                  type="text"
                  readOnly
                  value={window.location.href}
                  className="flex-1 text-xs sm:text-sm px-4 py-2.5 sm:py-3 bg-[#f7f5ee] border border-[#e1e5dd] rounded-xl text-[#6f7a73] select-all truncate focus:outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white hover:bg-[#f0f2ee] border border-[#e1e5dd] text-[#1c1c16] text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-2 transition-colors cursor-pointer shrink-0 shadow-xs"
                >
                  <Copy className="w-4 h-4 text-[#4f614d]" />
                  <span>Copy</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetailPage;
