import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  FileEdit,
  Camera,
  Users,
  Bed,
  ArrowRight,
  Clock,
  UserCheck,
  UserX,
  PieChart,
  ShieldCheck,
  Check,
  X,
  Info,
  Lock,
  DoorOpen,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import api, { getApiErrorMessage } from "../services/api.js";

export default function MemberRequestPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [requests, setRequests] = useState([]);
  const [acceptedMembers, setAcceptedMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingRequestId, setProcessingRequestId] = useState(null);

  // Toast
  const [toast, setToast] = useState({ show: false, message: "", isError: false });

  const maxCapacity = Number(post?.requiredMembers) || 0;
  const pendingRequests = requests.filter((r) => r.status === "PENDING");
  const pendingCount = pendingRequests.length;
  const acceptedCount = acceptedMembers.length;
  const rejectedCount = requests.filter((r) => r.status === "REJECTED").length;
  const isFull = acceptedCount >= maxCapacity;
  const spotsRemaining = Math.max(0, maxCapacity - acceptedCount);
  const capacityPercentage = Math.min(100, Math.round((acceptedCount / maxCapacity) * 100));

  const getMemberName = (member) =>
    member?.user?.profile?.firstName || member?.user?.username || "Unknown member";

  const getMemberAvatar = (member) =>
    member?.user?.profile?.profileImageUrl ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80";

  const loadPageData = async () => {
    setLoading(true);
    try {
      const [postResponse, requestResponse, memberResponse] = await Promise.all([
        api.get(`/community-posts/${postId}`),
        api.get(`/community-posts/${postId}/join-requests`),
        api.get(`/community-posts/${postId}/members`),
      ]);

      setPost(postResponse.data);
      setRequests(Array.isArray(requestResponse.data) ? requestResponse.data : []);
      setAcceptedMembers(
        (Array.isArray(memberResponse.data) ? memberResponse.data : []).map(
          (member) => ({
            ...member,
            name: getMemberName(member),
            avatar: getMemberAvatar(member),
            badge: member.memberRole || "MEMBER",
            room: member.room?.roomName || "Not assigned",
          }),
        ),
      );
    } catch (error) {
      triggerToast(getApiErrorMessage(error, "Unable to load community requests"), true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPageData();
  }, [postId]);

  const triggerToast = (message, isError = false) => {
    setToast({ show: true, message, isError });
    setTimeout(() => {
      setToast({ show: false, message: "", isError: false });
    }, 3200);
  };

  const handleRequestAction = async (applicant, action) => {
    if (isFull) {
      triggerToast(`Cannot accept: group is already at maximum ${maxCapacity}/${maxCapacity} capacity`, true);
      return;
    }
    setProcessingRequestId(applicant.id);
    try {
      await api.patch(`/join-requests/${applicant.id}`, { action });
      await loadPageData();
      triggerToast(
        action === "ACCEPT"
          ? `${getMemberName(applicant)} has been approved into the group!`
          : `Request from ${getMemberName(applicant)} was declined.`,
      );
    } catch (error) {
      triggerToast(getApiErrorMessage(error, "Unable to update join request"), true);
    } finally {
      setProcessingRequestId(null);
    }
  };

  if (loading) return <div className="p-8 text-muted-copy">Loading community requests...</div>;
  if (!post) return <div className="p-8 text-danger">Community post not found.</div>;

  return (
    <main className="min-h-screen bg-[#f7f5ee] text-[#465346] pt-6 sm:pt-8 pb-16">
      <div className="w-full max-w-330 mx-auto px-4 sm:px-6">
        {/* Top Breadcrumb & Actions Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex flex-col gap-1.5">
            <Link
              to="/community"
              className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-terracotta hover:underline transition-all w-fit"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Community
            </Link>
            <h1 className="font-serif text-3xl md:text-4xl text-[#1c1c16] font-bold tracking-tight">
              Community Post Management
            </h1>
            <p className="text-sm md:text-base text-muted-copy">
              Review applicant profiles, approve join requests, and balance your room allocation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => triggerToast("Post editing details opened.")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-line bg-white text-sm font-bold text-ink hover:border-sage hover:bg-sage-light/40 transition-all shadow-xs cursor-pointer active:scale-98"
            >
              <FileEdit className="w-4 h-4 text-sage-dark" />
              Edit Post
            </button>
          </div>
        </div>

        {/* Shared Property Post Banner Card */}
        <div className="relative overflow-hidden rounded-2xl bg-white border border-[#e1e5dd] shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row items-stretch">
            {/* Thumbnail & Visual */}
            <div className="lg:w-2/5 min-h-60 relative overflow-hidden bg-[#ebe8de]">
              <img
                className="w-full h-full object-cover min-h-60"
                alt={post.property?.title || post.title}
                src={post.property?.images?.[0]?.imageUrl || "https://placehold.co/1200x800/png?text=Property"}
              />
              <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4f614d] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#4f614d]"></span>
                </span>
                <span className="text-xs font-bold text-[#4f614d]">{post.status}</span>
              </div>
              <div className="absolute bottom-3.5 right-3.5 bg-[#1c1c16]/80 text-white px-2.5 py-1 rounded-lg text-xs font-medium backdrop-blur-sm flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5" />
                {post.property?.images?.length || 0} Photos
              </div>
            </div>

            {/* Main Property Info */}
            <div className="lg:w-3/5 p-6 md:p-8 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
                  <span className="px-3 py-1 rounded-full bg-[#eedcd4] text-[#695c56] text-xs font-semibold">
                    {post.property?.propertyType || "Property"} · {post.property?.address?.province || "Location unavailable"}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#ebe8de] text-[#414753] text-xs font-semibold flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-terracotta" />
                    {post.title}
                  </span>
                  <span className="text-muted-copy text-xs font-medium ml-auto">
                    Shared {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h2 className="font-serif text-2xl md:text-3xl text-[#1c1c16] font-bold tracking-tight mb-2">
                  {post.property?.title || post.title}
                </h2>
                <p className="text-sm md:text-[15px] text-muted-copy line-clamp-2 leading-relaxed mb-4">
                  {post.description || post.property?.description || "No description provided."}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#f1eee4] mt-auto">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-serif text-2xl font-bold text-[#4f614d]">฿{Number(post.property?.monthlyRent || 0).toLocaleString()}</span>
                  <span className="text-muted-copy text-xs sm:text-sm font-medium">/ month</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-[#f7f4ea] px-3.5 py-1.5 rounded-lg border border-line">
                    <Bed className="w-4 h-4 text-[#4f614d]" />
                    <span className="text-xs font-bold text-[#1c1c16]">
                      {isFull ? "Group Full" : `${spotsRemaining} Room Left`}
                    </span>
                    <span className="text-xs text-muted-copy">
                      ({acceptedCount}/{maxCapacity} Occupied)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate(`/properties/${post.propertyId}`)}
                    className="px-4 py-2 rounded-lg bg-[#ebe8de] hover:bg-[#dddad0] text-[#1c1c16] text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span>Inspect Property</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Metric Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {/* Pending */}
          <div className="p-5 rounded-2xl bg-white border border-[#e1e5dd] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-copy uppercase tracking-wider">
                Pending Requests
              </span>
              <span className="p-2 rounded-xl bg-[#ffdcc4] text-[#835024]">
                <Clock className="w-5 h-5" />
              </span>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="font-serif text-3xl font-bold text-[#1c1c16]">{pendingCount}</span>
              <span className="px-2.5 py-1 rounded-md bg-[#eedcd4] text-[#835024] text-[11px] font-bold">
                Action needed
              </span>
            </div>
          </div>

          {/* Accepted */}
          <div className="p-5 rounded-2xl bg-white border border-[#e1e5dd] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-copy uppercase tracking-wider">
                Accepted Members
              </span>
              <span className="p-2 rounded-xl bg-[#d4e8ce] text-[#3a4b38]">
                <UserCheck className="w-5 h-5" />
              </span>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="font-serif text-3xl font-bold text-[#1c1c16]">{acceptedCount}</span>
              <span className="px-2.5 py-1 rounded-md bg-[#d4e8ce] text-[#3a4b38] text-[11px] font-bold">
                Confirmed
              </span>
            </div>
          </div>

          {/* Rejected */}
          <div className="p-5 rounded-2xl bg-white border border-[#e1e5dd] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-copy uppercase tracking-wider">
                Rejected / Declined
              </span>
              <span className="p-2 rounded-xl bg-[#ebe8de] text-[#695c56]">
                <UserX className="w-5 h-5" />
              </span>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="font-serif text-3xl font-bold text-[#1c1c16]">{rejectedCount}</span>
              <span className="text-muted-copy text-xs font-medium">Archived</span>
            </div>
          </div>

          {/* Group Capacity */}
          <div className="p-5 rounded-2xl bg-white border border-[#e1e5dd] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-copy uppercase tracking-wider">
                Group Capacity
              </span>
              <span className="p-2 rounded-xl bg-[#eedcd4] text-[#835024]">
                <PieChart className="w-5 h-5" />
              </span>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="font-serif text-lg font-bold text-[#1c1c16]">
                  {acceptedCount} / {maxCapacity} Members
                </span>
                <span
                  className={`text-xs font-bold ${isFull ? "text-[#4f614d]" : "text-terracotta"
                    }`}
                >
                  {isFull ? "Group Full!" : `${spotsRemaining} spot left!`}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#e5e2d9] overflow-hidden">
                <div
                  className="h-full bg-[#4f614d] rounded-full transition-all duration-500"
                  style={{ width: `${capacityPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Main Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT 68%: Pending Requests Feed & Accepted Roommates */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Pending Requests Header & Controls */}
            <div className="bg-white p-6 rounded-2xl border border-[#e1e5dd] shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#f1eee4]">
                <div className="flex items-center gap-3">
                  <h3 className="font-serif text-xl font-bold text-[#1c1c16]">
                    Pending Requests
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#ffdcc4] text-[#835024] text-xs font-bold">
                    {pendingCount}
                  </span>
                </div>
              </div>

              {/* Applicant Cards Feed */}
              <div className="flex flex-col gap-4 mt-5">
                {pendingRequests.length === 0 ? (
                  <div className="py-12 text-center text-muted-copy">
                    <Clock className="w-10 h-10 mx-auto mb-2 text-sage" />
                    <p className="font-medium">No pending requests at the moment.</p>
                  </div>
                ) : (
                  requests.map((applicant) => (
                    <div
                      key={applicant.id}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 ${applicant.status === "REJECTED"
                          ? "bg-[#faf9f5] border-[#e1e5dd] opacity-60"
                          : applicant.status === "ACCEPTED"
                            ? "bg-[#f4f7f2] border-sage"
                            : "bg-[#f7f4ea] border-[#e1e5dd] hover:shadow-md"
                        }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        {/* Photo & Name */}
                        <div className="flex items-center gap-3.5">
                          <img
                            className="w-12 h-12 rounded-full object-cover shadow-xs border-2 border-white shrink-0"
                            alt={applicant.name}
                            src={getMemberAvatar(applicant)}
                          />
                          <h4 className="font-serif text-base sm:text-lg font-bold text-[#1c1c16]">
                            {getMemberName(applicant)}
                          </h4>
                        </div>

                        {/* Reject & Accept Buttons */}
                        <div className="flex items-center gap-2 self-end sm:self-center">
                          {applicant.status === "ACCEPTED" ? (
                            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#d4e8ce] text-[#3a4b38] text-xs font-bold">
                              <CheckCircle2 className="w-4 h-4" />
                              Accepted
                            </span>
                          ) : applicant.status === "REJECTED" ? (
                            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#ebe8de] text-[#695c56] text-xs font-semibold">
                              <X className="w-4 h-4" />
                              Declined
                            </span>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => handleRequestAction(applicant, "REJECT")}
                                className="px-4 py-2 rounded-xl bg-white hover:bg-red-50 hover:text-red-700 hover:border-red-200 border border-[#cfd7cd] text-xs font-bold text-muted-copy transition-all cursor-pointer"
                              >
                                Reject
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRequestAction(applicant, "ACCEPT")}
                                disabled={isFull || processingRequestId === applicant.id}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-xs cursor-pointer ${isFull
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-[#4f614d] hover:bg-[#687964] text-white"
                                  }`}
                              >
                                <Check className="w-4 h-4" />
                                {processingRequestId === applicant.id ? "Saving..." : "Accept"}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Capacity Lock Notice */}
            <div
              className={`p-4 rounded-2xl border flex items-start gap-3 transition-all ${isFull
                  ? "bg-[#d4e8ce]/50 border-sage"
                  : "bg-[#eedcd4]/50 border-terracotta-light"
                }`}
            >
              {isFull ? (
                <Lock className="w-5 h-5 text-[#4f614d] shrink-0 mt-0.5" />
              ) : (
                <Info className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />
              )}
              <div>
                <h5 className="text-sm font-bold text-[#1c1c16]">
                  {isFull ? "Group Full - Listing Locked" : `${spotsRemaining} Available Spot Remaining`}
                </h5>
                <p className="text-xs md:text-sm text-[#695c56] mt-0.5 leading-relaxed">
                  {isFull
                    ? `All ${maxCapacity} member spots for ${post.property?.title || post.title} are confirmed. New applicants cannot apply unless a spot opens up.`
                    : `When you accept ${spotsRemaining} more roommate${spotsRemaining > 1 ? "s" : ""
                    }, the group capacity reaches ${maxCapacity}/${maxCapacity}. All other pending requests will automatically receive a gentle status update, and your listing will change to 'Group Full'.`}
                </p>
              </div>
            </div>

            {/* Accepted Members Section */}
            <div className="bg-white p-6 rounded-2xl border border-[#e1e5dd] shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#f1eee4]">
                <div className="flex items-center gap-3">
                  <h3 className="font-serif text-xl font-bold text-[#1c1c16]">
                    Accepted Roommates
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#d4e8ce] text-[#3a4b38] text-xs font-bold">
                    {acceptedCount} of {maxCapacity} filled
                  </span>
                </div>
                <span className="text-xs text-muted-copy flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#4f614d]" />
                  Lease agreements in progress
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
                {acceptedMembers.map((member) => (
                  <div
                    key={member.id}
                    className="p-4 rounded-xl bg-[#f7f4ea] border border-line flex flex-col justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        className="w-12 h-12 rounded-full object-cover shadow-xs border border-white shrink-0"
                        alt={member.name}
                        src={member.avatar}
                      />
                      <div className="min-w-0">
                        <h4 className="font-serif text-sm font-bold text-[#1c1c16] truncate">
                          {member.name}
                        </h4>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-[#d4e8ce] text-[#3a4b38] text-[11px] font-bold">
                          {member.badge}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#e8e7dc] flex justify-between items-center text-xs text-muted-copy">
                      <span>Room:</span>
                      <span className="text-[#1c1c16] font-semibold">{member.room}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT 32%: Sticky Sidebar Overview */}
          <div className="lg:col-span-4 flex flex-col gap-6 sticky top-24">
            {/* Group Overview Card */}
            <div className="bg-white p-6 rounded-2xl border border-[#e1e5dd] shadow-sm">
              <h4 className="font-serif text-lg font-bold text-[#1c1c16] mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#4f614d]" />
                Group Overview
              </h4>

              {/* Occupancy Status */}
              <div className="p-4 rounded-xl bg-[#f7f4ea] border border-line mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#1c1c16]">
                    Occupancy Status
                  </span>
                  <span className="text-xs font-bold text-[#4f614d]">
                    {capacityPercentage}%
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-[#e5e2d9] overflow-hidden mb-3">
                  <div
                    className="h-full bg-[#4f614d] rounded-full transition-all duration-500"
                    style={{ width: `${capacityPercentage}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-copy">
                  <span>{acceptedCount} Confirmed Members</span>
                  <span className="text-terracotta font-bold">
                    {isFull ? "0 Rooms Left (Locked)" : `${spotsRemaining} Room Left`}
                  </span>
                </div>
              </div>

              {/* Manage Unit Rooms Button */}
              <div>
                <button
                  type="button"
                  onClick={() => triggerToast("Opening Unit Rooms management...")}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#4f614d] hover:bg-[#687964] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <DoorOpen className="w-4 h-4" />
                  Manage Unit Rooms
                </button>
              </div>
            </div>

            {/* Quick Screening Guidelines */}
            <div className="bg-white p-6 rounded-2xl border border-[#e1e5dd] shadow-sm">
              <h4 className="font-serif text-base font-bold text-[#1c1c16] mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-terracotta" />
                Screening Best Practices
              </h4>
              <ul className="flex flex-col gap-2.5 text-xs text-muted-copy leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#4f614d] shrink-0 mt-0.5" />
                  <span>Check alignment on working hours and morning schedule.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#4f614d] shrink-0 mt-0.5" />
                  <span>Confirm dietary, pet, and guest policies with existing roommates.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#4f614d] shrink-0 mt-0.5" />
                  <span>Schedule a quick 5-min virtual meetup before finalizing lease.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Toast Notification */}
        {toast.show && (
          <div
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-xs font-bold text-white transition-all transform animate-in slide-in-from-bottom duration-300 ${toast.isError ? "bg-[#ba1a1a]" : "bg-[#1c1c16]"
              }`}
          >
            {toast.isError ? (
              <AlertCircle className="w-5 h-5 text-red-200" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-[#d4e8ce]" />
            )}
            <span>{toast.message}</span>
          </div>
        )}
      </div>
    </main>
  );
}

