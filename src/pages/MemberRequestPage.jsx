import { useState } from "react";
import { Link } from "react-router";
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

const INITIAL_REQUESTS = [
  {
    id: 1,
    name: "Emily Johnson",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCBdGm-zmGTv8Epv1y2t9pFEZdBoUmB7N1IKLzKT_6pEh4oX_uokhi96eQDPSKVbnFIWzQEAtRj5z60Kg0syvtFvTV4rO4uCkzmtgKbJgDAI6yU2SAUsKpL7bdrQhZVKVe7619VukTuV5RHoKLPnxgSI1UZLEgYlY1ZU3BtE0OFJ2Y-Tq2yp-c15W9clzoe6egsw7nR9gh9qNYH-JsY3EcTsSR-9milV3mz3O4VOp7JwFpCvrwxerTf",
    status: "pending", // 'pending' | 'accepted' | 'rejected'
  },
  {
    id: 2,
    name: "Thanawat S.",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCKxtozUZJ1neaVQdBoeEjkaWswTxnXM2ZoOA9jJKBb5LlKC5OxWOZaor6qY8zrKtPQUPnVuV7R7QrkvIHrF5AtuU6lel_XBbDfslqw9_E-3JIciVWh-EWYMX1osY7xtWyApCXrOel0cyjYdTd3RWZEY-Lzm-Cg1BlU1TpSGYyKACKLeJ1xkOm-sP8ACRLMlRnOlO6-vxc8uDr37e-8qws3hXhI0wWq-x9ICErL-WZbHf7K6swGIucU",
    status: "pending",
  },
  {
    id: 3,
    name: "Kittipong M.",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCYwNkWhJ-3icktWa5souxKoTZL8sM8P7ZVeTHWqkhn921H4_d_NBAzfioZguONWVmofwyNtKyeuaO0-y0OGujpWjHiWzRjaidV05RgfNwkMRlKkAt1_51S1i-9Dz3nkVo8xpvq_Y02ZWg0gsBjRlYX8Id1FtamX6xRUJVAzbbQNnRFuCSeaPBI-SayXBBqbEgz08GqL4CR8eTe194kHotqRNf3FzbnINJ8pkCqolhhlAuyv9etxe9H",
    status: "pending",
  },
];

const INITIAL_ACCEPTED = [
  {
    id: "acc-1",
    name: "Numfon W.",
    room: "Master Bedroom 1",
    badge: "Deposit Paid",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD7c79_BWQvrEIwVixvgULYSL0y7tCED4kuWl1-pYFOLlMiaKBpAKnexWgR7kVGIvkBjdHLpRGyj17jKHaRD-7XPIBhUoZ0vF7ZtF95-S7YjRFt-b0IfgOJOLKyvASoaqK75aF2v-lcTsS94b2dn4L5pUsWDcfD9k0BB2_l1dLwuIjlt0crz5ZEdeET4PK23jKJ29z3Drx3ClzjLh8MGgQb0tXcKn1CVLOr4WShASQE7zoPVGCkL7QG",
  },
  {
    id: "acc-2",
    name: "Sarah Jenkins",
    room: "Standard Bedroom 2",
    badge: "Deposit Paid",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCTEtQtPRMGM9vUp7E2QEz0a7PFvgowGAYN8c9ihV7jlzrUaEDOqGndIY41KRU496PSlgh9niVhUrADnMR4RiMFwif5OHCMyMaIj0xEHqnr_QCVHbJCGBBDNuFZ5rxsWXB-HyQNC3KUG9t3ftoeBjU4FTOoHqb6aIeHL9TerSx0vGNyXyQQalsp-dl09HiRhajQ3ln6aoV8fjioqNtAZI8yrD29aVLt0awrugWU3xTmwwDul-hkUvGm",
  },
  {
    id: "acc-3",
    name: "Alex Rivera",
    room: "Standard Bedroom 3",
    badge: "Verified",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCWJfy6Rxw200CWhRdlwl3oL73I3-WXEm04FY6U1fcyrRUHYcXBxmfeUo8pcCRRK0IpJ0TRyXTphgFEXuwlTf7azdldrIa0nZcaX4KlYnlD2sGIpItW8bnSi49suGEFFIVWtRcenQxpAyMea11qTFeCvs28LYeUAWnnglf3xV4zhT6-qsOakB-RQUn0MLesqjrjD2U9M6JT2vyjglGkIyr2UoyeydFvIlU-TnExl9mHwK0NQCyBqTrI",
  },
];

export default function MemberRequestPage() {
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [acceptedMembers, setAcceptedMembers] = useState(INITIAL_ACCEPTED);
  const [rejectedCount, setRejectedCount] = useState(1);

  // Toast
  const [toast, setToast] = useState({ show: false, message: "", isError: false });

  const maxCapacity = 4;
  const pendingRequests = requests.filter((r) => r.status === "pending");
  const pendingCount = pendingRequests.length;
  const acceptedCount = acceptedMembers.length;
  const isFull = acceptedCount >= maxCapacity;
  const spotsRemaining = Math.max(0, maxCapacity - acceptedCount);
  const capacityPercentage = Math.min(100, Math.round((acceptedCount / maxCapacity) * 100));

  const triggerToast = (message, isError = false) => {
    setToast({ show: true, message, isError });
    setTimeout(() => {
      setToast({ show: false, message: "", isError: false });
    }, 3200);
  };

  const handleAccept = (applicant) => {
    if (isFull) {
      triggerToast("Cannot accept: Listing is already at maximum 4/4 capacity", true);
      return;
    }

    const newMember = {
      id: `acc-${Date.now()}`,
      name: applicant.name,
      room: "Bedroom 4",
      badge: "Accepted",
      avatar: applicant.avatar,
    };

    setAcceptedMembers([...acceptedMembers, newMember]);
    setRequests((prev) =>
      prev.map((r) =>
        r.id === applicant.id ? { ...r, status: "accepted" } : r
      )
    );
    triggerToast(`${applicant.name} has been approved into the group!`);
  };

  const handleReject = (applicant) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === applicant.id ? { ...r, status: "rejected" } : r
      )
    );
    setRejectedCount((prev) => prev + 1);
    triggerToast(`Request from ${applicant.name} was declined.`);
  };

  return (
    <main className="min-h-screen bg-[#f7f5ee] text-[#465346] pt-6 sm:pt-8 pb-16">
      <div className="w-full max-w-330 mx-auto px-4 sm:px-6">
        {/* Top Breadcrumb & Actions Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex flex-col gap-1.5">
            <Link
              to="/community"
              className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-[#b9683f] hover:underline transition-all w-fit"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Community
            </Link>
            <h1 className="font-serif text-3xl md:text-4xl text-[#1c1c16] font-bold tracking-tight">
              Community Post Management
            </h1>
            <p className="text-sm md:text-base text-[#6f7a73]">
              Review applicant profiles, approve join requests, and balance your room allocation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => triggerToast("Post editing details opened.")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#e4e4d9] bg-white text-sm font-bold text-[#29342d] hover:border-[#a9bba3] hover:bg-[#e6ede3]/40 transition-all shadow-xs cursor-pointer active:scale-98"
            >
              <FileEdit className="w-4 h-4 text-[#687b67]" />
              Edit Post
            </button>
          </div>
        </div>

        {/* Shared Property Post Banner Card */}
        <div className="relative overflow-hidden rounded-2xl bg-white border border-[#e1e5dd] shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row items-stretch">
            {/* Thumbnail & Visual */}
            <div className="lg:w-2/5 min-h-[240px] relative overflow-hidden bg-[#ebe8de]">
              <img
                className="w-full h-full object-cover min-h-[240px]"
                alt="XELF Sukhumvit Master Bedroom"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCr2lbdMb7OhjXChx3wJbpvN-fJCAKrZY2WL3PQJ5-R9VhQCK5OZ1HwBHWHql6W43Umoky-jQPgHuf41HviGxEcR7yv74B0MVXLuPX-5FgbZUvhjy3IMVbdDnjsy3r_avlFUDNmfxO7ZPRpY5uOX7iRslzqy8QflUdoPOpYq1GQ9M9J5q95fQu_qRKP14KZek3-ukWUSmz0GnTCgq2neGLCk6Fl2fFODHoSwX35jCJVO04PqA5kvy5v"
              />
              <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4f614d] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#4f614d]"></span>
                </span>
                <span className="text-xs font-bold text-[#4f614d]">Active Listing</span>
              </div>
              <div className="absolute bottom-3.5 right-3.5 bg-[#1c1c16]/80 text-white px-2.5 py-1 rounded-lg text-xs font-medium backdrop-blur-sm flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5" />
                8 Photos
              </div>
            </div>

            {/* Main Property Info */}
            <div className="lg:w-3/5 p-6 md:p-8 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
                  <span className="px-3 py-1 rounded-full bg-[#eedcd4] text-[#695c56] text-xs font-semibold">
                    Condo · Sukhumvit, Bangkok
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#ebe8de] text-[#414753] text-xs font-semibold flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-[#b9683f]" />
                    Sukhumvit Roommates Club
                  </span>
                  <span className="text-[#6f7a73] text-xs font-medium ml-auto">
                    Shared Oct 14, 2026
                  </span>
                </div>
                <h2 className="font-serif text-2xl md:text-3xl text-[#1c1c16] font-bold tracking-tight mb-2">
                  Modern Condo near BTS - XELF Sukhumvit
                </h2>
                <p className="text-sm md:text-[15px] text-[#6f7a73] line-clamp-2 leading-relaxed mb-4">
                  Spacious 4-bedroom corner unit with panoramic city vista, smart amenities, high-speed fiber, and serene co-working lounge. 250m walking distance to BTS Thong Lor.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#f1eee4] mt-auto">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-serif text-2xl font-bold text-[#4f614d]">฿12,000</span>
                  <span className="text-[#6f7a73] text-xs sm:text-sm font-medium">/ person / month</span>
                  <span className="text-[#889188] text-xs">(฿48,000 total)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-[#f7f4ea] px-3.5 py-1.5 rounded-lg border border-[#e4e4d9]">
                    <Bed className="w-4 h-4 text-[#4f614d]" />
                    <span className="text-xs font-bold text-[#1c1c16]">
                      {isFull ? "Group Full" : `${spotsRemaining} Room Left`}
                    </span>
                    <span className="text-xs text-[#6f7a73]">
                      ({acceptedCount}/{maxCapacity} Occupied)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => triggerToast("Viewing property details...")}
                    className="px-4 py-2 rounded-lg bg-[#ebe8de] hover:bg-[#dddad0] text-[#1c1c16] text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span>Inspect Unit</span>
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
              <span className="text-xs font-bold text-[#6f7a73] uppercase tracking-wider">
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
              <span className="text-xs font-bold text-[#6f7a73] uppercase tracking-wider">
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
              <span className="text-xs font-bold text-[#6f7a73] uppercase tracking-wider">
                Rejected / Declined
              </span>
              <span className="p-2 rounded-xl bg-[#ebe8de] text-[#695c56]">
                <UserX className="w-5 h-5" />
              </span>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="font-serif text-3xl font-bold text-[#1c1c16]">{rejectedCount}</span>
              <span className="text-[#6f7a73] text-xs font-medium">Archived</span>
            </div>
          </div>

          {/* Group Capacity */}
          <div className="p-5 rounded-2xl bg-white border border-[#e1e5dd] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#6f7a73] uppercase tracking-wider">
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
                  className={`text-xs font-bold ${
                    isFull ? "text-[#4f614d]" : "text-[#b9683f]"
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
                {requests.length === 0 ? (
                  <div className="py-12 text-center text-[#6f7a73]">
                    <Clock className="w-10 h-10 mx-auto mb-2 text-[#a9bba3]" />
                    <p className="font-medium">No pending requests at the moment.</p>
                  </div>
                ) : (
                  requests.map((applicant) => (
                    <div
                      key={applicant.id}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 ${
                        applicant.status === "rejected"
                          ? "bg-[#faf9f5] border-[#e1e5dd] opacity-60"
                          : applicant.status === "accepted"
                            ? "bg-[#f4f7f2] border-[#a9bba3]"
                            : "bg-[#f7f4ea] border-[#e1e5dd] hover:shadow-md"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        {/* Photo & Name */}
                        <div className="flex items-center gap-3.5">
                          <img
                            className="w-12 h-12 rounded-full object-cover shadow-xs border-2 border-white shrink-0"
                            alt={applicant.name}
                            src={applicant.avatar}
                          />
                          <h4 className="font-serif text-base sm:text-lg font-bold text-[#1c1c16]">
                            {applicant.name}
                          </h4>
                        </div>

                        {/* Reject & Accept Buttons */}
                        <div className="flex items-center gap-2 self-end sm:self-center">
                          {applicant.status === "accepted" ? (
                            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#d4e8ce] text-[#3a4b38] text-xs font-bold">
                              <CheckCircle2 className="w-4 h-4" />
                              Accepted
                            </span>
                          ) : applicant.status === "rejected" ? (
                            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#ebe8de] text-[#695c56] text-xs font-semibold">
                              <X className="w-4 h-4" />
                              Declined
                            </span>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => handleReject(applicant)}
                                className="px-4 py-2 rounded-xl bg-white hover:bg-red-50 hover:text-red-700 hover:border-red-200 border border-[#cfd7cd] text-xs font-bold text-[#6f7a73] transition-all cursor-pointer"
                              >
                                Reject
                              </button>
                              <button
                                type="button"
                                onClick={() => handleAccept(applicant)}
                                disabled={isFull}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-xs cursor-pointer ${
                                  isFull
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-[#4f614d] hover:bg-[#687964] text-white"
                                }`}
                              >
                                <Check className="w-4 h-4" />
                                Accept
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
              className={`p-4 rounded-2xl border flex items-start gap-3 transition-all ${
                isFull
                  ? "bg-[#d4e8ce]/50 border-[#a9bba3]"
                  : "bg-[#eedcd4]/50 border-[#f2e2d5]"
              }`}
            >
              {isFull ? (
                <Lock className="w-5 h-5 text-[#4f614d] shrink-0 mt-0.5" />
              ) : (
                <Info className="w-5 h-5 text-[#b9683f] shrink-0 mt-0.5" />
              )}
              <div>
                <h5 className="text-sm font-bold text-[#1c1c16]">
                  {isFull ? "Group Full - Listing Locked" : `${spotsRemaining} Available Spot Remaining`}
                </h5>
                <p className="text-xs md:text-sm text-[#695c56] mt-0.5 leading-relaxed">
                  {isFull
                    ? "All 4 member spots for XELF Sukhumvit are confirmed. New applicants cannot apply unless a spot opens up."
                    : `When you accept ${spotsRemaining} more roommate${
                        spotsRemaining > 1 ? "s" : ""
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
                <span className="text-xs text-[#6f7a73] flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#4f614d]" />
                  Lease agreements in progress
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
                {acceptedMembers.map((member) => (
                  <div
                    key={member.id}
                    className="p-4 rounded-xl bg-[#f7f4ea] border border-[#e4e4d9] flex flex-col justify-between gap-3"
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

                    <div className="pt-2 border-t border-[#e8e7dc] flex justify-between items-center text-xs text-[#6f7a73]">
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
              <div className="p-4 rounded-xl bg-[#f7f4ea] border border-[#e4e4d9] mb-4">
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
                <div className="flex items-center justify-between text-xs text-[#6f7a73]">
                  <span>{acceptedCount} Confirmed Members</span>
                  <span className="text-[#b9683f] font-bold">
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
                <Lightbulb className="w-4 h-4 text-[#b9683f]" />
                Screening Best Practices
              </h4>
              <ul className="flex flex-col gap-2.5 text-xs text-[#6f7a73] leading-relaxed">
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
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-xs font-bold text-white transition-all transform animate-in slide-in-from-bottom duration-300 ${
              toast.isError ? "bg-[#ba1a1a]" : "bg-[#1c1c16]"
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

