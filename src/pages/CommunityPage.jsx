import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  CalendarDays,
  MoreHorizontal,
  Globe,
  Search,
  Sparkles,
  CheckCircle2,
  Users,
  BedSingle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";
import useAuthStore from "../stores/authStore.js";
import RentalRequestModal from "../components/rentalRequest/RentalRequestModal.jsx";
import useCommunityPosts from "../hooks/useCommunityPosts.js";
import useZodiacMatches from "../hooks/useZodiacMatches.js";
import { getCommunityReadiness, parsePostGender } from "../utils/communityRental.js";

const fallbackImage =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80";

const formatZodiac = (zodiac) =>
  zodiac ? zodiac.charAt(0) + zodiac.slice(1).toLowerCase() : "Unknown";

function CommunityPage() {
  const navigate = useNavigate();
  const userId = useAuthStore((state) => state.user?.id);
  const [searchText, setSearchText] = useState("");
  const [propertyTypeFilter, setPropertyTypeFilter] = useState("ALL");
  const [genderFilter, setGenderFilter] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [groupSizeFilter, setGroupSizeFilter] = useState("ALL");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [sortOrder, setSortOrder] = useState("NEWEST");
  const {
    setRentalRequests,
    posts, requestingPostId, joinFeedback, setJoinFeedback,
    membersByPost, rentalRequests, groupDataLoading,
    myRequestedPostIds, handleRequestToJoin,
  } = useCommunityPosts(userId);
  const {
    zodiacMode, setZodiacMode, zodiacMatches, userZodiac, zodiacLoading,
    expandedMatchId, setExpandedMatchId, handleFindByZodiac,
  } = useZodiacMatches(setJoinFeedback);
  const [selectedGroupPost, setSelectedGroupPost] = useState(null);

  const filteredPosts = (posts || [])
    .filter((post) => {
      const property = post.property;
      const { gender: postGender, cleanDescription } = parsePostGender(
        post.description,
      );
      const searchableText = [
        post.title,
        cleanDescription,
        property?.title,
        property?.address?.province,
        property?.address?.district,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const monthlyRent = Number(property?.monthlyRent);
      const requiredMembers = Number(post.requiredMembers);
      const availableDate = property?.availableDate
        ? new Date(property.availableDate)
        : null;
      const startDate = fromDate ? new Date(`${fromDate}T00:00:00`) : null;
      const endDate = toDate ? new Date(`${toDate}T23:59:59.999`) : null;
      const matchesSearch = searchableText.includes(
        searchText.trim().toLowerCase(),
      );
      const matchesType =
        propertyTypeFilter === "ALL" ||
        property?.propertyType?.toUpperCase() === propertyTypeFilter;
      const matchesFromDate =
        !startDate || (availableDate && availableDate >= startDate);
      const matchesToDate =
        !endDate || (availableDate && availableDate <= endDate);
      const matchesGroupSize =
        groupSizeFilter === "ALL" ||
        (groupSizeFilter === "1-2" && requiredMembers <= 2) ||
        (groupSizeFilter === "3-4" &&
          requiredMembers >= 3 &&
          requiredMembers <= 4) ||
        (groupSizeFilter === "5+" && requiredMembers >= 5);
      const matchesGender =
        genderFilter === "ALL" || postGender === genderFilter;
      const matchesMinBudget =
        !minBudget || (!Number.isNaN(monthlyRent) && monthlyRent >= Number(minBudget));
      const matchesMaxBudget =
        !maxBudget || (!Number.isNaN(monthlyRent) && monthlyRent <= Number(maxBudget));

      return (
        matchesSearch &&
        matchesType &&
        matchesFromDate &&
        matchesToDate &&
        matchesGroupSize &&
        matchesGender &&
        matchesMinBudget &&
        matchesMaxBudget
      );
    })
    .sort((firstPost, secondPost) => {
      if (sortOrder === "LOWEST_RENT") {
        return Number(firstPost.property?.monthlyRent || 0) - Number(secondPost.property?.monthlyRent || 0);
      }
      if (sortOrder === "HIGHEST_RENT") {
        return Number(secondPost.property?.monthlyRent || 0) - Number(firstPost.property?.monthlyRent || 0);
      }
      return new Date(secondPost.createdAt) - new Date(firstPost.createdAt);
    });

  const hasActiveFilters = Boolean(
    searchText ||
      propertyTypeFilter !== "ALL" ||
      genderFilter !== "ALL" ||
      fromDate ||
      toDate ||
      groupSizeFilter !== "ALL" ||
      minBudget ||
      maxBudget ||
      sortOrder !== "NEWEST",
  );

  const clearFilters = () => {
    setSearchText("");
    setPropertyTypeFilter("ALL");
    setGenderFilter("ALL");
    setFromDate("");
    setToDate("");
    setGroupSizeFilter("ALL");
    setMinBudget("");
    setMaxBudget("");
    setSortOrder("NEWEST");
  };

  const displayedPosts = zodiacMode ? zodiacMatches : filteredPosts;

  if (posts == null) {
    return <div className="">Loading ...</div>;
  }

  return (
    <main className="property-list-page min-h-screen bg-[#f7f5ee] text-[#465346] pt-6 sm:pt-8 pb-16">
      {joinFeedback && (
        <div
          role={joinFeedback.isError ? "alert" : "status"}
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-sm font-bold text-white ${
            joinFeedback.isError ? "bg-[#ba1a1a]" : "bg-[#1c1c16]"
          }`}
        >
          {joinFeedback.isError ? (
            <AlertCircle className="w-5 h-5 text-red-200" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-[#d4e8ce]" />
          )}
          <span>{joinFeedback.message}</span>
        </div>
      )}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6">
        {/* Page Header (Consistent with ConversationList) */}
        <div className="mb-6 flex shrink-0 items-end justify-between gap-6 max-sm:flex-col max-sm:items-stretch">
          <div>
            <p className="mb-1 text-xs font-extrabold uppercase tracking-[0.18em] text-terracotta">
              Community & Roommates
            </p>
            <h1 className="m-0 font-serif text-3xl leading-tight text-ink md:text-4xl">
              Community
            </h1>
            <p className="mt-2 text-muted-copy">
              Connect with roommates, explore listings, and share your living
              experience.
            </p>
          </div>
          <button
            type="button"
            onClick={
              zodiacMode
                ? () => {
                    setZodiacMode(false);
                    setExpandedMatchId(null);
                  }
                : handleFindByZodiac
            }
            disabled={zodiacLoading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#748a75] px-5 py-3 text-sm font-bold text-white shadow-xs transition hover:bg-[#627863] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Sparkles className="h-4 w-4" />
            {zodiacLoading
              ? "Finding matches..."
              : zodiacMode
                ? "Show all communities"
                : "Find rooms by Zodiac"}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column (Main Feed - 68%) */}
          <div className="w-full lg:w-full flex flex-col gap-6">
            {/* Community search and filters */}
            {!zodiacMode && (
            <div className="rounded-[18px] border border-[#e1e5dd] bg-white p-4 sm:p-5 shadow-[0_15px_45px_rgba(68,83,68,0.12)]">
              <div className="flex items-center gap-3 rounded-full border border-[#d8ddd6] bg-[#fafbf8] px-4 py-2.5">
                <Search className="h-4 w-4 shrink-0 text-[#879387]" />
                <input
                  type="search"
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  placeholder="Search posts, properties, or destinations..."
                  className="w-full bg-transparent text-sm text-[#475547] outline-none placeholder:text-[#879387]"
                />
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                <label className="grid gap-1.5 text-xs font-bold text-[#596859]">
                  Category
                  <select
                    value={propertyTypeFilter}
                    onChange={(event) => setPropertyTypeFilter(event.target.value)}
                    className="h-10 rounded-full border border-[#d8ddd6] bg-white px-3.5 text-sm font-normal text-[#475547] outline-none focus:border-[#748a75]"
                  >
                    <option value="ALL">All Categories</option>
                    <option value="HOUSE">House</option>
                    <option value="CONDO">Condo</option>
                    <option value="APARTMENT">Apartment</option>
                    <option value="DORMITORY">Dormitory</option>
                    <option value="OTHER">Other</option>
                  </select>
                </label>
                <label className="grid gap-1.5 text-xs font-bold text-[#596859]">
                  Roommate Gender
                  <select
                    value={genderFilter}
                    onChange={(event) => setGenderFilter(event.target.value)}
                    className="h-10 rounded-full border border-[#d8ddd6] bg-white px-3.5 text-sm font-normal text-[#475547] outline-none focus:border-[#748a75]"
                  >
                    <option value="ALL">All Genders</option>
                    <option value="FEMALE">Female Only</option>
                    <option value="MALE">Male Only</option>
                    <option value="ANY">No Restriction</option>
                  </select>
                </label>
                <label className="grid gap-1.5 text-xs font-bold text-[#596859]">
                  From Date
                  <span className="relative">
                    <CalendarDays className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#596859]" />
                    <input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} className="h-10 w-full rounded-full border border-[#d8ddd6] bg-white px-3.5 text-sm font-normal text-[#475547] outline-none focus:border-[#748a75]" />
                  </span>
                </label>
                <label className="grid gap-1.5 text-xs font-bold text-[#596859]">
                  To Date
                  <span className="relative">
                    <CalendarDays className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#596859]" />
                    <input type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} className="h-10 w-full rounded-full border border-[#d8ddd6] bg-white px-3.5 text-sm font-normal text-[#475547] outline-none focus:border-[#748a75]" />
                  </span>
                </label>
                <label className="grid gap-1.5 text-xs font-bold text-[#596859]">
                  Group Size
                  <select value={groupSizeFilter} onChange={(event) => setGroupSizeFilter(event.target.value)} className="h-10 rounded-full border border-[#d8ddd6] bg-white px-3.5 text-sm font-normal text-[#475547] outline-none focus:border-[#748a75]">
                    <option value="ALL">Any Group Size</option>
                    <option value="1-2">1-2 members</option>
                    <option value="3-4">3-4 members</option>
                    <option value="5+">5+ members</option>
                  </select>
                </label>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1.5 text-xs font-bold text-[#596859]">
                  Minimum Budget
                  <input type="number" min="0" value={minBudget} onChange={(event) => setMinBudget(event.target.value)} placeholder="Minimum budget" className="h-10 rounded-full border border-[#d8ddd6] bg-white px-3.5 text-sm font-normal text-[#475547] outline-none placeholder:text-[#879387] focus:border-[#748a75]" />
                </label>
                <label className="grid gap-1.5 text-xs font-bold text-[#596859]">
                  Maximum Budget
                  <input type="number" min="0" value={maxBudget} onChange={(event) => setMaxBudget(event.target.value)} placeholder="Maximum budget" className="h-10 rounded-full border border-[#d8ddd6] bg-white px-3.5 text-sm font-normal text-[#475547] outline-none placeholder:text-[#879387] focus:border-[#748a75]" />
                </label>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#edf0ea] pt-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#879387]">
                    {filteredPosts.length} posts found
                  </span>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="text-xs font-bold text-terracotta underline-offset-2 hover:underline"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
                <label className="flex items-center gap-2 text-xs font-bold text-[#596859]">
                  Sort by
                  <select
                    value={sortOrder}
                    onChange={(event) => setSortOrder(event.target.value)}
                    className="h-9 rounded-full border border-[#d8ddd6] bg-white px-3 text-sm font-normal text-[#475547] outline-none focus:border-[#748a75]"
                  >
                    <option value="NEWEST">Newest</option>
                    <option value="LOWEST_RENT">Lowest rent</option>
                    <option value="HIGHEST_RENT">Highest rent</option>
                  </select>
                </label>
              </div>
            </div>
            )}

            {zodiacMode && (
              <div className="rounded-[18px] border border-[#d8ddd6] bg-white px-5 py-4 shadow-[0_8px_25px_rgba(67,81,67,0.07)]">
                <p className="text-sm font-bold text-[#475547]">
                  Your zodiac: {formatZodiac(userZodiac)}
                </p>
                <p className="mt-1 text-xs text-[#879387]">
                  {zodiacMatches.length} ranked matches found
                </p>
              </div>
            )}

            {/* Community Feed Posts */}
            <div className="flex flex-col gap-6">
              {displayedPosts.map((post) => {
                const creator =
                  post.creator ||
                  post.members?.find(
                    (member) => member.memberRole === "CREATOR",
                  )?.user;
                const creatorId = post.creatorId ?? creator?.id;
                const isCreator = Number(creatorId) === Number(userId);
                const communityMembers = zodiacMode
                  ? post.members || []
                  : membersByPost[post.id] || [];
                const memberIds = new Set(
                  communityMembers
                    .map((member) => member.userId ?? member.user?.id)
                    .filter(
                      (memberId) =>
                        memberId != null &&
                        Number(memberId) !== Number(creatorId),
                    )
                    .map(Number),
                );
                const currentMemberCount = zodiacMode
                  ? Number(post.totalMembers) || communityMembers.length
                  : memberIds.size;
                const requiredMemberCount = Number(post.requiredMembers) || 0;
                const readiness = getCommunityReadiness(
                  post,
                  communityMembers,
                );
                const existingGroupRequest = rentalRequests.find(
                  (request) =>
                    Number(request.communityPostId) === Number(post.id),
                );
                const supportsGroupRental =
                  Boolean(post.propertyId) &&
                  post.property?.rentType === "WHOLE_UNIT";
                const { gender: postGender, cleanDescription } =
                  parsePostGender(post.description);
                const compatibilityReasons = Array.isArray(
                  post.compatibilityReasons,
                )
                  ? post.compatibilityReasons
                  : [];
                const canExplainMatch =
                  zodiacMode &&
                  typeof post.compatibilityScore === "number" &&
                  compatibilityReasons.length > 0;
                const isMatchExpanded = expandedMatchId === post.id;
                const hasRequested = Boolean(
                  userId &&
                    (myRequestedPostIds.has(post.id) ||
                      post.joinRequests?.some(
                        (req) => Number(req.userId) === Number(userId),
                      )),
                );
                const isAlreadyMember = Boolean(
                  userId &&
                    (post.isMember ||
                      communityMembers.some(
                        (member) =>
                          Number(member.userId ?? member.user?.id) ===
                          Number(userId),
                      )),
                );

                return (
                  <article
                    key={post.id}
                    className="bg-white border border-[#e1e5dd] rounded-[18px] p-6 flex flex-col gap-4 shadow-[0_8px_25px_rgba(67,81,67,0.07)] hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(67,81,67,0.13)] transition-all"
                  >
                  {/* Post Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 border-2 border-[#e1e7df] shadow-xs">
                        <img
                          alt="User Avatar"
                          className="w-full h-full object-cover"
                          src={creator?.profile?.profileImageUrl || fallbackImage}
                        />
                      </div>
                      <div>
                        <div className="text-[15px] font-bold text-[#475547]">
                          {creator?.profile?.firstName ||
                            creator?.username ||
                            "Community member"}
                        </div>
                        <div className="text-[12px] text-[#889188] flex flex-wrap items-center gap-1.5 mt-0.5 font-medium">
                          <span>
                            {post.createdAt
                              ? new Date(post.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  },
                                )
                              : ""}
                          </span>
                          <span>·</span>
                          <span
                            className={`flex items-center gap-0.5 text-[11px] px-2.5 py-0.5 rounded-full font-bold ${post.property?.rentType === "INDIVIDUAL_ROOM"
                                ? "bg-[#eef3eb] text-[#546b55] border border-[#cfd7cd]"
                                : "bg-[#f8ede6] text-terracotta border border-[#edd7cb]"
                              }`}
                          >
                            {post.property?.rentType || "COMMUNITY"}
                          </span>
                          {post.property?.propertyType && (
                            <span className="flex items-center gap-0.5 text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-[#fafbf8] text-[#5e6d5e] border border-[#cfd7cd]">
                              {post.property.propertyType}
                            </span>
                          )}
                          {zodiacMode && (
                            <span
                              className={`flex items-center gap-0.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${
                                post.status === "FULL"
                                  ? "border-[#edd7cb] bg-[#f8ede6] text-terracotta"
                                  : "border-[#cfd7cd] bg-[#eef3eb] text-[#546b55]"
                              }`}
                            >
                              {post.status}
                            </span>
                          )}
                          {postGender === "FEMALE" && (
                            <span className="flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-[#fdf2f4] text-[#be185d] border border-[#fbcfe8]">
                              🚺 Female Only
                            </span>
                          )}
                          {postGender === "MALE" && (
                            <span className="flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-[#eff6ff] text-[#1d4ed8] border border-[#bfdbfe]">
                              🚹 Male Only
                            </span>
                          )}
                          <span>·</span>
                          <Globe className="w-3.5 h-3.5 text-[#889188]" />
                        </div>
                      </div>
                    </div>
                    <button type="button" className="text-[#889188] hover:text-[#475547] p-1.5 rounded-full hover:bg-[#eef3eb] transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Property Preview (If Available) */}
                  {post.property && (
                    <Link
                      to={`/properties/${post.propertyId || post.property.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col md:flex-row gap-5 p-3.5 rounded-xl bg-[#fafbf8] border border-[#e1e5dd] hover:border-[#748a75] hover:bg-[#f6f8f5] hover:shadow-xs transition-all cursor-pointer text-inherit no-underline"
                    >
                      <div className="relative w-full md:w-70 h-47.5 rounded-lg overflow-hidden shrink-0 bg-[#e8ede5]">
                        <img
                          alt="Property"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          src={post.property.images?.[0]?.imageUrl || fallbackImage}
                        />
                      </div>

                      <div className="flex flex-col justify-center gap-2 py-1 min-w-0 flex-1">
                        <div>
                          <div className="flex items-center gap-2 justify-between">
                            <h3 className="text-[18px] font-bold text-[#475547] group-hover:text-[#2f3d30] transition-colors leading-tight font-serif truncate">
                              {post.property.title}
                            </h3>
                            <ExternalLink className="w-4 h-4 text-[#889188] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                          </div>
                          <div className="text-[13px] text-[#889188] mt-1">
                            {post.property.address?.province}
                          </div>
                        </div>

                        <div className="text-[18px] font-bold text-[#607861]">
                          ฿ {Number(post.property.monthlyRent).toLocaleString()}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-[13px] text-[#607060] pt-1">
                          <div className="flex items-center gap-1.5">
                            <BedSingle className="w-4 h-4 text-[#889188]" />
                            <span>
                              {post.property.rooms?.length ?? 0} rooms
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-[#889188]" />
                            <span>
                              {currentMemberCount} / {requiredMemberCount} members
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )}

                  {/* Post Content Description */}
                  {cleanDescription && (
                    <p className="text-[15px] text-[#465346] leading-relaxed">
                      {cleanDescription}
                    </p>
                  )}

                  {zodiacMode && (
                    <div className="rounded-xl border border-[#e1e5dd] bg-[#fafbf8] px-4 py-3">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-bold text-[#475547]">
                            {communityMembers
                              .map((member) =>
                                formatZodiac(member.user?.profile?.zodiac),
                              )
                              .join(" · ") || "Unknown"}
                          </div>
                          {Number(post.matchedMembers) <
                            Number(post.totalMembers) && (
                            <div className="mt-1 text-xs text-[#879387]">
                              Zodiac data: {post.matchedMembers} of{" "}
                              {post.totalMembers} members
                            </div>
                          )}
                        </div>
                        <span
                          className={`rounded-full px-3 py-1.5 text-sm font-extrabold ${
                            post.compatibilityScore == null
                              ? "bg-[#edf0ea] text-[#687568]"
                              : post.compatibilityScore >= 85
                                ? "bg-[#dcebd8] text-[#4d684e]"
                                : post.compatibilityScore >= 65
                                  ? "bg-[#f4ead6] text-[#8a682f]"
                                  : "bg-[#f3e3df] text-[#98594b]"
                          }`}
                        >
                          {post.compatibilityScore == null
                            ? "Not enough zodiac data"
                            : `${post.compatibilityScore}% Match`}
                        </span>
                      </div>
                      {canExplainMatch && (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedMatchId(
                                isMatchExpanded ? null : post.id,
                              )
                            }
                            aria-expanded={isMatchExpanded}
                            aria-controls={`zodiac-reasons-${post.id}`}
                            className="mt-3 flex items-center gap-1.5 border-t border-[#e1e5dd] pt-3 text-xs font-bold text-[#607861] transition-colors hover:text-[#475547]"
                          >
                            Why this match?
                            {isMatchExpanded ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </button>
                          {isMatchExpanded && (
                            <div
                              id={`zodiac-reasons-${post.id}`}
                              className="mt-3 rounded-lg border border-[#e1e5dd] bg-white px-4 py-3"
                            >
                              <p className="mb-2 text-xs text-[#879387]">
                                Based on zodiac traits and sign relationships.
                              </p>
                              <ul className="list-disc space-y-1 pl-4 text-[13px] leading-relaxed text-[#596859]">
                                {compatibilityReasons.map((reason, index) => (
                                  <li key={`${post.id}-${index}-${reason}`}>
                                    {reason}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {/* Action Area */}
                  <div className="flex items-center justify-end border-t border-[#edf0ea] pt-3.5 mt-1 gap-3">
                    {!zodiacMode && isCreator && (
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/community/${post.id}/join-requests`)
                        }
                        className="px-4 py-2 rounded-xl border border-[#cfd7cd] text-[13px] text-[#5e6d5e] hover:bg-[#eef3eb] transition-colors font-bold text-center cursor-pointer"
                      >
                        View Details
                      </button>
                    )}
                    {zodiacMode ? (
                      isAlreadyMember ? (
                        <span className="rounded-full bg-[#eef3eb] px-4 py-2 text-[13px] font-bold text-[#546b55]">
                          Already a member
                        </span>
                      ) : post.status === "FULL" ? (
                        <button
                          type="button"
                          disabled
                          className="cursor-not-allowed rounded-xl bg-[#748a75] px-5 py-2 text-[13px] font-bold text-white opacity-60"
                        >
                          Group is full
                        </button>
                      ) : hasRequested ? (
                        <button
                          type="button"
                          disabled
                          className="cursor-not-allowed rounded-xl bg-[#e1e5dd] px-5 py-2 text-center text-[13px] font-bold text-[#879387] shadow-none border border-[#d2d7ce]"
                        >
                          You have already requested to join.
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleRequestToJoin(post.id)}
                          disabled={requestingPostId !== null}
                          className="cursor-pointer rounded-xl bg-[#748a75] px-5 py-2 text-center text-[13px] font-bold text-white shadow-xs transition-all hover:bg-[#627863] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {requestingPostId === post.id
                            ? "Submitting..."
                            : "Request to Join"}
                        </button>
                      )
                    ) : isCreator ? (
                      existingGroupRequest ? (
                        <span className="rounded-full bg-[#eef3eb] px-4 py-2 text-[13px] font-bold text-[#546b55]">
                          Group rental: {existingGroupRequest.status}
                        </span>
                      ) : !supportsGroupRental ? (
                        <div className="text-right text-[12px] text-[#889188]">
                          <strong className="block text-[#5e6d5e]">
                            Group rental unavailable
                          </strong>
                          {post.property
                            ? "Individual-room groups need a room target."
                            : "A linked property is required."}
                        </div>
                      ) : groupDataLoading ? (
                        <button
                          type="button"
                          disabled
                          className="px-5 py-2 rounded-xl bg-[#748a75] text-white text-[13px] font-bold opacity-60 cursor-not-allowed"
                        >
                          Checking group...
                        </button>
                      ) : !readiness.isReady ? (
                        <button
                          type="button"
                          disabled
                          className="px-5 py-2 rounded-xl bg-[#748a75] text-white text-[13px] font-bold opacity-60 cursor-not-allowed"
                        >
                          Need {readiness.remainingMembers} more member
                          {readiness.remainingMembers === 1 ? "" : "s"}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setSelectedGroupPost(post)}
                          className="px-5 py-2 rounded-xl bg-[#748a75] hover:bg-[#627863] text-white text-[13px] transition-all font-bold shadow-xs text-center cursor-pointer"
                        >
                          Request Rental as Group
                        </button>
                      )
                    ) : isAlreadyMember ? (
                      <span className="rounded-full bg-[#eef3eb] px-4 py-2 text-[13px] font-bold text-[#546b55]">
                        Already a member
                      </span>
                    ) : post.status === "FULL" ? (
                      <button
                        type="button"
                        disabled
                        className="cursor-not-allowed rounded-xl bg-[#748a75] px-5 py-2 text-[13px] font-bold text-white opacity-60"
                      >
                        Group is full
                      </button>
                    ) : hasRequested ? (
                      <button
                        type="button"
                        disabled
                        className="cursor-not-allowed rounded-xl bg-[#e1e5dd] px-5 py-2 text-center text-[13px] font-bold text-[#879387] shadow-none border border-[#d2d7ce]"
                      >
                        You have already requested to join.
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleRequestToJoin(post.id)}
                        disabled={requestingPostId !== null}
                        className="px-5 py-2 rounded-xl bg-[#748a75] hover:bg-[#627863] disabled:opacity-60 disabled:cursor-not-allowed text-white text-[13px] transition-all font-bold shadow-xs text-center cursor-pointer"
                      >
                        {requestingPostId === post.id
                          ? "Submitting..."
                          : "Request to Join"}
                      </button>
                    )}
                  </div>
                  </article>
                );
              })}
              {displayedPosts.length === 0 && (
                <div className="rounded-[18px] border border-[#e1e5dd] bg-white p-8 text-center text-sm text-[#879387]">
                  {zodiacMode
                    ? "No zodiac matches found."
                    : "No community posts found."}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar (32%) */}
          <aside className="w-full lg:w-[45%] flex flex-col gap-6">
            {/* About Community Card */}
            <div className="bg-white border border-[#e1e5dd] rounded-[18px] p-6 shadow-[0_8px_25px_rgba(67,81,67,0.07)]">
              <div className="flex items-center gap-2.5 mb-3 text-[#748a75]">
                <Users className="w-5 h-5" />
                <h3 className="font-bold text-[18px] text-[#465546] font-serif">
                  About Community
                </h3>
              </div>
              <p className="text-[14px] text-[#607060] leading-relaxed mb-4">
                A verified safe space for finding roommates, sharing
                accommodations, and exchanging genuine living experiences.
              </p>
              <div className="grid grid-cols-2 gap-3 p-3 bg-[#fafbf8] rounded-xl border border-[#e1e5dd] text-center">
                <div>
                  <div className="font-bold text-[18px] text-[#607861]">
                    {posts.length}
                  </div>
                  <div className="text-[12px] text-[#8c958b]">Posts</div>
                </div>
                <div>
                  <div className="font-bold text-[18px] text-terracotta">
                    {posts.filter((post) => post.status === "OPEN").length}
                  </div>
                  <div className="text-[12px] text-[#8c958b]">
                    Open groups
                  </div>
                </div>
              </div>
            </div>

            {/* How to Join / Guidelines Card */}
            <div className="bg-white border border-[#e1e5dd] rounded-[18px] p-6 shadow-[0_8px_25px_rgba(67,81,67,0.07)]">
              <div className="flex items-center gap-2.5 mb-4 text-terracotta">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-bold text-[18px] text-[#465546] font-serif">
                  Tips for Finding Roommates
                </h3>
              </div>
              <div className="flex flex-col gap-3.5">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#eef3eb] text-[#556b56] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-[#475547]">
                      Be Clear About Your Lifestyle
                    </div>
                    <div className="text-[13px] text-[#889188]">
                      Wake-up schedule, pets, and smoking habits.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#eef3eb] text-[#556b56] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-[#475547]">
                      Discuss Agreement Details
                    </div>
                    <div className="text-[13px] text-[#889188]">
                      Agree on rent split, utilities, and security deposit.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#eef3eb] text-[#556b56] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-[#475547]">
                      Meet in Safe Locations
                    </div>
                    <div className="text-[13px] text-[#889188]">
                      Meet in person to talk and tour the property together.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Community Rules */}
            <div className="bg-white border border-[#e1e5dd] rounded-[18px] p-6 shadow-[0_8px_25px_rgba(67,81,67,0.07)]">
              <h3 className="font-bold text-[18px] text-[#465546] mb-3 font-serif">
                Community Rules
              </h3>
              <ul className="flex flex-col gap-2.5 text-[13px] text-[#607060]">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#607861] shrink-0 mt-0.5" />
                  <span>
                    No false information or fraudulent security deposits.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#607861] shrink-0 mt-0.5" />
                  <span>Be polite and respectful to all members.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#607861] shrink-0 mt-0.5" />
                  <span>
                    Report inappropriate posts to administrators immediately.
                  </span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
      {selectedGroupPost && (
        <RentalRequestModal
          propertyId={selectedGroupPost.propertyId}
          communityPostId={selectedGroupPost.id}
          targetName={
            selectedGroupPost.title || selectedGroupPost.property?.title
          }
          onClose={() => setSelectedGroupPost(null)}
          onSubmitted={() =>
            setRentalRequests((current) => [
              {
                communityPostId: selectedGroupPost.id,
                status: "PENDING",
              },
              ...current,
            ])
          }
        />
      )}
    </main>
  );
}

export default CommunityPage;
