import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  BadgeDollarSign,
  Building2,
  Check,
  ChevronRight,
  Home,
  Info,
  Loader2,
  MessageCircle,
  Pencil,
  Share2,
  ShieldCheck,
  Sparkles,
  SquareCheck,
  SquareX,
  UserRound,
} from "lucide-react";
import api, { getApiErrorMessage } from "../../services/api";
import { getMyPropertiesApi } from "../../services/ownerApi.js";
import RentalRequestModal from "../../components/rentalRequest/RentalRequestModal.jsx";
import useAuthStore from "../../stores/authStore.js";
import OwnerCard from "../../components/propertyDetail/OwnerCard.jsx";
import ShareListingToConversation from "../../components/conversations/ShareListingToConversation.jsx";
import { shareListingWithHost } from "../../utils/conversations.js";
import {
  findOwnerRoom,
  ownerEditRoomPath,
} from "../../utils/ownerRoutes.js";

export default function RoomDetail({ owner = false }) {
  const { propertyId, roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { token, user } = useAuthStore();
  const [toastMessage, setToastMessage] = useState("");
  const [isRentalRequestOpen, setIsRentalRequestOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isContactingOwner, setIsContactingOwner] = useState(false);
  const [room, setRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const contactInFlight = useRef(false);

  const fetchRoom = useCallback(async () => {
    try {
      if (owner) {
        const response = await getMyPropertiesApi();
        const ownerRoom = findOwnerRoom(response.data || [], propertyId, roomId);
        if (!ownerRoom) throw new Error("Room not found");
        setRoom(ownerRoom);
        return;
      }

      const response = await api.get(`/rooms/${roomId}`);
      setRoom(response.data);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to load room details"));
    } finally {
      setIsLoading(false);
    }
  }, [owner, propertyId, roomId]);

  useEffect(() => {
    // Loading server state is the purpose of this effect.
    // oxlint-disable-next-line react/set-state-in-effect
    fetchRoom();
  }, [fetchRoom]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage("");
    }, 2800);
  };

  const handleShare = () => setIsShareModalOpen(true);

  const handleRentalRequest = () => {
    if (room?.status !== "AVAILABLE") {
      showToast(
        room?.status === "RESERVED"
          ? "This room is currently reserved"
          : "This room is unavailable for rent",
      );
      return;
    }
    if (!token || !user) {
      navigate("/login");
      return;
    }
    setIsRentalRequestOpen(true);
  };

  const handleContactOwner = async () => {
    if (contactInFlight.current) return;
    if (!token || !user) {
      navigate("/login");
      return;
    }

    const resolvedPropertyId =
      propertyId || room?.propertyId || room?.property?.id;
    let ownerId =
      room?.property?.ownerId ||
      room?.property?.owner?.id ||
      room?.ownerId;

    contactInFlight.current = true;
    setIsContactingOwner(true);
    try {
      if (!ownerId && resolvedPropertyId) {
        const propRes = await api.get(`/properties/${resolvedPropertyId}`);
        const propData =
          propRes.data.data?.property ||
          propRes.data.data ||
          propRes.data.property;
        ownerId =
          propData?.owner?.id || propData?.ownerId || propData?.user?.id;
      }

      if (!ownerId || !resolvedPropertyId) {
        showToast("Unable to find the property host");
        return;
      }

      const conversationId = await shareListingWithHost(api, {
        propertyId: resolvedPropertyId,
        ownerId,
        roomId: room.id || roomId,
      });
      navigate("/Message", { state: { conversationId } });
    } catch (requestError) {
      showToast(
        requestError.response?.data?.message || "Unable to share this room with the host",
      );
    } finally {
      contactInFlight.current = false;
      setIsContactingOwner(false);
    }
  };

  if (isLoading) {
    return owner ? (
      <div className="owner-loading flex items-center justify-center p-8">
        <div className="w-8 h-8 border-3 border-sage-dark border-t-transparent rounded-full animate-spin" />
      </div>
    ) : (
      <main className="min-h-screen bg-[#f7f5ee] flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3 bg-white p-8 rounded-2xl border border-[#e1e5dd] shadow-xs">
          <div className="w-9 h-9 border-3 border-[#4f614d] border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-copy text-sm font-medium">
            Loading room details...
          </p>
        </div>
      </main>
    );
  }

  if (error || !room) {
    if (owner) {
      return (
        <section className="mx-auto w-full max-w-330">
          <Link
            to={location.state?.backTo || `/owner/properties/${propertyId}`}
            className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-sage-dark"
          >
            <ArrowLeft size={17} />
            {location.state?.backLabel || "Back to Property"}
          </Link>
          <p className="owner-alert" role="alert">
            {error || "Room not found"}
          </p>
        </section>
      );
    }

    return (
      <main className="grid min-h-screen place-content-center bg-[#f7f5ee] p-6 text-center">
        <p className="rounded-xl bg-[#fde8e6] px-5 py-4 text-danger" role="alert">
          {error || "Room not found"}
        </p>
      </main>
    );
  }

  const host = room?.property?.owner;
  const hostProfile = host?.profile || {};
  const hostDisplayName =
    hostProfile.displayName ||
    hostProfile.fullName ||
    [hostProfile.firstName, hostProfile.lastName].filter(Boolean).join(" ") ||
    host?.username ||
    "Property Host";
  return (
    <main className={owner ? "owner-resource-page mx-auto w-full max-w-330 text-[#1c1c16] antialiased" : "min-h-screen bg-[#f7f5ee] text-[#1c1c16] antialiased py-6 md:py-8 px-4 sm:px-6 lg:px-8"}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#1c1c16] text-white px-4 py-3 rounded-xl shadow-lg animate-fade-in text-sm font-medium">
          <Check className="w-4 h-4 text-[#d4e8ce]" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Top Breadcrumb & Share Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          {owner ? (
            <Link
              to={location.state?.backTo || `/owner/properties/${propertyId}`}
              className="inline-flex items-center gap-2 text-sm font-bold text-sage-dark transition hover:text-ink"
            >
              <ArrowLeft size={17} />
              {location.state?.backLabel || "Back to Property"}
            </Link>
          ) : (
            <nav className="flex items-center gap-2 text-xs sm:text-sm text-muted-copy overflow-x-auto">
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
            {propertyId && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-[#a8b0a7] shrink-0" />
                <Link
                  to={`/properties/${propertyId}`}
                  className="hover:text-[#4f614d] transition-colors shrink-0"
                >
                  Property #{propertyId}
                </Link>
              </>
            )}
            <ChevronRight className="w-3.5 h-3.5 text-[#a8b0a7] shrink-0" />
            <span className="text-[#1c1c16] font-medium truncate max-w-50 sm:max-w-[320px]">
              {roomId ? `Room #${roomId}` : "Room Detail (ROOM A2)"}
            </span>
            </nav>
          )}

          {owner ? (
            <Link
              to={ownerEditRoomPath(propertyId, roomId)}
              className="inline-flex items-center gap-2 rounded-xl border border-sage-dark bg-white px-4 py-2.5 text-sm font-bold text-sage-dark transition hover:bg-sage-light"
            >
              <Pencil size={16} /> Edit room
            </Link>
          ) : (
            <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="p-2.5 rounded-full bg-white border border-[#e1e5dd] text-muted-copy hover:text-[#4f614d] hover:bg-[#faf7f2] transition-all cursor-pointer shadow-xs flex items-center gap-1.5 text-xs font-semibold"
              title="Share Listing"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>
            </div>
          )}
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Gallery Image Card */}
            <div className="relative rounded-2xl overflow-hidden bg-[#e5e2d9] border border-[#e1e5dd] shadow-xs group h-80 sm:h-100">
              <img
                src={
                  room?.images?.find((image) => image.isCover)?.imageUrl ||
                  room?.images?.[0]?.imageUrl ||
                  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80"
                }
                alt={room?.roomName || "Room"}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
              <div className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#4f614d]" />
                <span className="text-xs font-bold text-[#4f614d]">
                  Active Bedroom
                </span>
              </div>
            </div>

            {/* Room Title & Status Header Card */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#e1e5dd] shadow-xs space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <div
                  className={`inline-flex items-center gap-2 ${room.status === "AVAILABLE" ? "bg-sage-light text-[#294c25] border-[#b8deb0]" : "bg-[#f1f0ea] border-[#e1ded5] text-muted-copy opacity-60"} border  px-3.5 py-1 rounded-full text-xs font-bold`}
                >
                  {room.status === "AVAILABLE" ? (
                    <SquareCheck className="w-4 h-4 text-[#4f614d]" />
                  ) : (
                    <SquareX className="w-4 h-4 text-[#a8b0a7]" />
                  )}
                  <span>{room.status}</span>
                </div>
              </div>

              <div>
                <h1 className="wrap-break-word font-serif text-2xl sm:text-3xl font-bold text-[#1c1c16] tracking-tight">
                  {room.roomName}
                </h1>
              </div>
            </div>

            {/* Unit State Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Room Rent */}
              <div className="bg-white p-5 rounded-2xl border border-[#e1e5dd] shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-sage-light flex items-center justify-center text-[#4f614d] shrink-0">
                  <BadgeDollarSign className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-muted-copy uppercase tracking-wider block">
                    Room Rent
                  </span>
                  <strong className="font-serif text-lg sm:text-xl font-bold text-[#1c1c16]">
                    ฿{Number(room.monthlyRent).toLocaleString()}
                  </strong>
                  <span className="text-xs text-muted-copy ml-1">/ Month</span>
                </div>
              </div>

              {/* Capacity */}
              <div className="bg-white p-5 rounded-2xl border border-[#e1e5dd] shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#f7f4ea] flex items-center justify-center text-[#4f614d] shrink-0">
                  <UserRound className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-muted-copy uppercase tracking-wider block">
                    Capacity
                  </span>
                  <strong className="font-serif text-lg sm:text-xl font-bold text-[#1c1c16]">
                    {room.capacity} Person
                  </strong>
                </div>
              </div>

              {/* Room Status */}
              <div className="bg-white p-5 rounded-2xl border border-[#e1e5dd] shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#d4e8ce]/50 flex items-center justify-center text-[#294c25] shrink-0">
                  <Info className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-muted-copy uppercase tracking-wider block">
                    Room Status
                  </span>
                  <strong className="font-serif text-lg sm:text-xl font-bold text-[#294c25]">
                    {room.status}
                  </strong>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#e1e5dd] shadow-xs space-y-3">
              <h2 className="font-serif text-xl font-bold text-[#1c1c16]">
                Description
              </h2>
              <div className="text-sm leading-relaxed text-[#414753] whitespace-pre-line">
                {room.description}
              </div>
            </div>
          </div>

          {/* Right Column: Booking Card (4 cols) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            {owner ? (
              <div className="rounded-2xl border border-line bg-white p-6 shadow-xs">
                <h3 className="font-serif text-2xl font-bold text-ink">
                  Room management
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-copy">
                  Review this room or update its listing details.
                </p>
                <div className="mt-5 grid gap-3">
                  <Link
                    to={ownerEditRoomPath(propertyId, roomId)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-sage-dark px-4 py-3 text-sm font-bold text-white transition hover:brightness-95"
                  >
                    <Pencil size={16} /> Edit room
                  </Link>
                  <Link
                    to={`/owner/properties/${propertyId}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-line px-4 py-3 text-sm font-bold text-sage-dark transition hover:bg-sage-light"
                  >
                    <Building2 size={16} /> View property
                  </Link>
                </div>
              </div>
            ) : (
            <div className="bg-white border border-[#e1e5dd] rounded-2xl p-6 sm:p-7 shadow-xs space-y-6">
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1c1c16] mb-1">
                  Are you interested in this room?
                </h3>
                <div className="flex items-baseline gap-1.5 mt-2">
                  <span className="text-xs text-muted-copy">Rate:</span>
                  <span className="font-serif text-3xl font-bold text-[#4f614d]">
                    ฿ {Number(room.monthlyRent).toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-copy">/ Month</span>
                </div>
              </div>

              {/* Lease Breakdown */}
              <div className="bg-[#f7f5ee] p-4 rounded-xl space-y-2.5 text-xs text-[#414753] border border-[#ece8dc]">
                <div className="flex justify-between items-center">
                  <span className="text-muted-copy">Security Deposit</span>
                  <span className="font-bold text-[#1c1c16]">1 - 2 Months</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-copy">Minimum Lease</span>
                  <span className="font-bold text-[#1c1c16]">
                    6 - 12 Months
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-copy">Utilities</span>
                  <span className="font-bold text-[#1c1c16]">
                    Billed by meter
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleRentalRequest}
                  disabled={room.status !== "AVAILABLE"}
                  className={`w-full py-3.5 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-98 ${room.status !== "AVAILABLE"
                    ? "bg-[#f1f0ea] text-[#889188] border border-[#e1ded5] cursor-not-allowed"
                    : "bg-[#4f614d] text-white hover:bg-[#41513f]"
                    }`}
                >
                  {room.status === "AVAILABLE"
                    ? "Request to Rent This Room"
                    : room.status === "RESERVED"
                      ? "Room Reserved"
                      : "Room Unavailable"}
                </button>

                <button
                  type="button"
                  onClick={handleContactOwner}
                  disabled={isContactingOwner}
                  className="w-full py-3 px-4 rounded-xl border border-[#4f614d] text-[#4f614d] bg-white hover:bg-sage-light/40 text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  {isContactingOwner ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <MessageCircle className="w-4 h-4" />
                  )}
                  <span>
                    {isContactingOwner
                      ? "Opening conversation..."
                      : "Contact Host"}
                  </span>
                </button>

                {propertyId && (
                  <button
                    type="button"
                    onClick={() => navigate(`/properties/${propertyId}`)}
                    className="w-full py-2.5 px-4 rounded-xl border border-[#e1e5dd] bg-white hover:bg-[#f7f5ee] text-xs font-semibold text-[#414753] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Building2 className="w-3.5 h-3.5 text-[#4f614d]" />
                    <span>View Entire Property Unit</span>
                  </button>
                )}
              </div>

              {/* Safety notice */}
              <div className="flex items-center gap-2 text-xs text-muted-copy pt-2 border-t border-[#f1eee4]">
                <ShieldCheck className="w-4 h-4 text-[#4f614d] shrink-0" />
                <span>Always inspect the property before transferring any deposit</span>
              </div>
            </div>
            )}

            {/* Listed by Owner Card */}
            {!owner && host && (
              <OwnerCard
                ownerProfile={hostProfile}
                ownerDisplayName={hostDisplayName}
                handleContactOwner={handleContactOwner}
                isContactingOwner={isContactingOwner}
              />
            )}
          </div>
        </div>
      </div>

      {!owner && isRentalRequestOpen && (
        <RentalRequestModal
          propertyId={propertyId}
          roomId={room.id || roomId}
          targetName={room.roomName || `Room #${roomId}`}
          onClose={() => setIsRentalRequestOpen(false)}
        />
      )}
      {!owner && isShareModalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-xs" onClick={() => setIsShareModalOpen(false)}>
          <div className="w-full max-w-lg rounded-3xl border border-[#e1e5dd] bg-[#fffefa] p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h3 className="m-0 font-serif text-2xl font-bold text-forest">Share room</h3>
                <p className="mb-0 mt-1 text-sm text-muted-copy">Send this room to an existing property conversation.</p>
              </div>
              <button type="button" onClick={() => setIsShareModalOpen(false)} className="rounded-full px-3 py-2 text-xl text-muted-copy hover:bg-sage-light" aria-label="Close">×</button>
            </div>
            <ShareListingToConversation
              type="ROOM_SHARE"
              listingId={room.id || roomId}
              propertyId={propertyId || room.propertyId || room.property?.id}
              ownerId={room.property?.ownerId || room.property?.owner?.id || room.ownerId}
              onShared={() => setIsShareModalOpen(false)}
            />
          </div>
        </div>
      )}
    </main>
  );
}
