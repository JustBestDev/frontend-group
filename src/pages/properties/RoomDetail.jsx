import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
  BadgeDollarSign,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  Heart,
  Home,
  Info,
  Share2,
  ShieldCheck,
  Sparkles,
  SquareCheck,
  SquareX,
  UserRound,
} from "lucide-react";
import api from "../../services/api";

export default function RoomDetail() {
  const { propertyId, roomId } = useParams();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isJoinRequested, setIsJoinRequested] = useState(false);
  const [room, setRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRoom();
  }, []);

  const fetchRoom = async () => {
    try {
      const response = await api.get(`/rooms/${roomId}`);
      setRoom(response.data);
      console.log("response.data", response.data);
      setIsLoading(false);
    } catch (error) {}
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage("");
    }, 2800);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("Property link copied to clipboard");
    } catch {
      showToast("Shared property link");
    }
  };

  const handleToggleSave = () => {
    setIsSaved((prev) => {
      const next = !prev;
      showToast(next ? "Saved to your favorites" : "Removed from favorites");
      return next;
    });
  };

  const handleJoinRequest = () => {
    setIsJoinRequested(true);
    showToast("Join request submitted successfully!");
  };

  if (isLoading) {
    return <div className="">Loading ...</div>;
  }

  return (
    <main className="min-h-screen bg-[#f7f5ee] text-[#1c1c16] antialiased py-6 md:py-8 px-4 sm:px-6 lg:px-8">
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
            <span className="text-[#1c1c16] font-medium truncate max-w-[200px] sm:max-w-[320px]">
              {roomId ? `Room #${roomId}` : "Room Detail (ROOM A2)"}
            </span>
          </nav>

          <div className="flex items-center gap-2">
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

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Gallery Image Card */}
            <div className="relative rounded-2xl overflow-hidden bg-[#e5e2d9] border border-[#e1e5dd] shadow-xs group h-[320px] sm:h-[400px]">
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
                  className={`inline-flex items-center gap-2 ${room.status === "AVAILABLE" ? "bg-[#e6ede3] text-[#294c25] border-[#b8deb0]" : "bg-[#f1f0ea] border-[#e1ded5] text-[#6f7a73] opacity-60"} border  px-3.5 py-1 rounded-full text-xs font-bold`}
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
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1c1c16] tracking-tight">
                  {room.roomName}
                </h1>
              </div>
            </div>

            {/* Unit State Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Room Rent */}
              <div className="bg-white p-5 rounded-2xl border border-[#e1e5dd] shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#e6ede3] flex items-center justify-center text-[#4f614d] shrink-0">
                  <BadgeDollarSign className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#6f7a73] uppercase tracking-wider block">
                    Room Rent
                  </span>
                  <strong className="font-serif text-lg sm:text-xl font-bold text-[#1c1c16]">
                    ฿{Number(room.monthlyRent).toLocaleString()}
                  </strong>
                  <span className="text-xs text-[#6f7a73] ml-1">/ Month</span>
                </div>
              </div>

              {/* Capacity */}
              <div className="bg-white p-5 rounded-2xl border border-[#e1e5dd] shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#f7f4ea] flex items-center justify-center text-[#4f614d] shrink-0">
                  <UserRound className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#6f7a73] uppercase tracking-wider block">
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
                  <span className="text-xs font-bold text-[#6f7a73] uppercase tracking-wider block">
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
            <div className="bg-white border border-[#e1e5dd] rounded-2xl p-6 sm:p-7 shadow-xs space-y-6">
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1c1c16] mb-1">
                  Are you interested in this room?
                </h3>
                <div className="flex items-baseline gap-1.5 mt-2">
                  <span className="text-xs text-[#6f7a73]">Rate:</span>
                  <span className="font-serif text-3xl font-bold text-[#4f614d]">
                    ฿ {Number(room.monthlyRent).toLocaleString()}
                  </span>
                  <span className="text-xs text-[#6f7a73]">/ Month</span>
                </div>
              </div>

              {/* Lease Breakdown */}
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
                  <span className="text-[#6f7a73]">Utilities</span>
                  <span className="font-bold text-[#1c1c16]">
                    Billed by meter
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-1">
                <button
                  type="button"
                  onClick={handleJoinRequest}
                  disabled={isJoinRequested}
                  className={`w-full py-3.5 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-98 ${
                    isJoinRequested
                      ? "bg-[#e6ede3] text-[#294c25] border border-[#b8deb0] cursor-default"
                      : "bg-[#4f614d] text-white hover:bg-[#41513f]"
                  }`}
                >
                  {isJoinRequested ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Request Sent</span>
                    </>
                  ) : (
                    <span>Join Request</span>
                  )}
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
              <div className="flex items-center gap-2 text-xs text-[#6f7a73] pt-2 border-t border-[#f1eee4]">
                <ShieldCheck className="w-4 h-4 text-[#4f614d] shrink-0" />
                <span>Verified roommate listing & protected deposit</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
