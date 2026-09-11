import { useEffect, useRef, useState } from "react";
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
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ImageOff,
} from "lucide-react";
import useAuthStore from "../stores/authStore.js";
import RentalRequestModal from "../components/rentalRequest/RentalRequestModal.jsx";
import EditProfileModal from "../components/profile/EditProfileModal.jsx";
import UserProfileModal from "../components/profile/UserProfileModal.jsx";
import useCommunityPosts from "../hooks/useCommunityPosts.js";
import useZodiacMatches from "../hooks/useZodiacMatches.js";
import {
  getCommunityListing,
  getCommunityReadiness,
  parsePostGender,
} from "../utils/communityRental.js";
import { formatZodiacWithSymbol } from "../utils/zodiac.js";

const fallbackImage =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80";

const formatZodiac = (zodiac) =>
  zodiac ? zodiac.charAt(0) + zodiac.slice(1).toLowerCase() : "";

const filterChipClass = (active) =>
  `flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-full px-5 text-sm font-bold transition [&::-webkit-details-marker]:hidden ${
    active
      ? "bg-[#dfe8dc] text-[#25463c]"
      : "bg-[#f0eee7] text-[#526052] hover:bg-[#e5e9df]"
  }`;

function CommunityPage() {
  const navigate = useNavigate();
  const userId = useAuthStore((state) => state.user?.id);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [profileUserId, setProfileUserId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [propertyTypeFilter, setPropertyTypeFilter] = useState("ALL");
  const [genderFilter, setGenderFilter] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [groupSizeFilter, setGroupSizeFilter] = useState("ALL");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [sortOrder, setSortOrder] = useState("NEWEST");
  const [activeFilter, setActiveFilter] = useState(null);
  const activeFilterRef = useRef(null);
  const {
    setRentalRequests,
    posts, requestingPostId, joinFeedback, setJoinFeedback,
    membersByPost, rentalRequests, groupDataLoading,
    myRequestedPostIds, handleRequestToJoin,
  } = useCommunityPosts(userId);
  const {
    zodiacMode,
    setZodiacMode,
    zodiacMatches,
    userZodiac,
    zodiacLoading,
    birthdateRequired,
    setBirthdateRequired,
    expandedMatchId,
    setExpandedMatchId,
    handleFindByZodiac,
  } = useZodiacMatches(setJoinFeedback);
  const [selectedGroupPost, setSelectedGroupPost] = useState(null);

  useEffect(() => {
    if (!activeFilter) return undefined;

    const closeOnOutsideClick = (event) => {
      if (!activeFilterRef.current?.contains(event.target)) {
        setActiveFilter(null);
      }
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setActiveFilter(null);
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [activeFilter]);

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
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-sm font-bold text-white ${joinFeedback.isError ? "bg-[#ba1a1a]" : "bg-[#1c1c16]"
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
        <div className="mb-8 flex shrink-0 items-end justify-between gap-6 max-sm:flex-col max-sm:items-stretch">
          <div>
            <p className="mb-1 text-xs font-extrabold uppercase tracking-[0.18em] text-terracotta">
              Community & Roommates
            </p>
            <h1 className="m-0 max-w-3xl font-serif text-3xl leading-tight text-ink md:text-4xl">
              {zodiacMode
                ? "Find people you'd feel at home with."
                : "Community"}
            </h1>
            <p className="mt-2 text-muted-copy">
              {zodiacMode
                ? "Explore communities ranked by your zodiac compatibility."
                : "Connect with roommates, explore listings, and share your living experience."}
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
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold shadow-xs transition disabled:cursor-not-allowed disabled:opacity-60 ${
              zodiacMode
                ? "bg-[#ebe9e2] text-[#365047] hover:bg-[#dfddd5]"
                : "bg-[#173f34] text-white hover:bg-[#0f3028]"
            }`}
          >
            {zodiacMode ? (
              <ArrowLeft className="h-4 w-4" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {zodiacLoading
              ? "Finding matches..."
              : zodiacMode
                ? "Show all communities"
                : "Find rooms by Zodiac"}
          </button>
        </div>

        {birthdateRequired && (
          <div className="mb-6 rounded-2xl border border-[#dce5d8] bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-[#eef4eb] p-2 text-[#687b67]">
                <Sparkles className="h-5 w-5" />
              </div>

              <div className="flex-1">
                <h2 className="font-bold text-[#465346]">
                  Add your birth date to use Zodiac Matching
                </h2>

                <p className="mt-1 text-sm text-[#7c887c]">
                  We use your birth date to calculate your zodiac sign
                  and find communities with compatible roommates.
                </p>

                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(true)}
                  className="mt-4 rounded-xl bg-[#748a75] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#627863]"
                >
                  Add birth date
                </button>
              </div>
            </div>
          </div>
        )}

        {zodiacMode && (
          <div className="relative mb-8 overflow-hidden rounded-[20px] bg-[#153f34] px-6 py-8 text-white shadow-[0_12px_30px_rgba(21,63,52,0.18)] sm:px-9 sm:py-10">
            <Sparkles
              className="absolute -bottom-8 right-5 h-36 w-36 text-white opacity-[0.06]"
              strokeWidth={1.25}
              aria-hidden="true"
            />
            <div className="relative">
              <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-[#dce9df]">
                Your zodiac: {formatZodiac(userZodiac)}
              </span>
              <h2 className="mt-4 font-serif text-2xl leading-tight sm:text-3xl">
                Communities matched to your vibe
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#b8cbc2]">
                Ranked using the zodiac compatibility available for current
                community members.
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column (Main Feed - 68%) */}
          <div className="w-full lg:w-full flex flex-col gap-6">
            {/* Community search and filters */}
            {!zodiacMode && (
              <div className="space-y-5 rounded-[22px] border border-[#dfded3] bg-[#fbfaf6] p-5 shadow-[0_6px_20px_rgba(47,68,57,0.06)] sm:p-6">
                <div className="flex min-h-16 items-center gap-3 rounded-2xl bg-white px-5 shadow-[0_2px_12px_rgba(47,68,57,0.07)] sm:px-6">
                  <Search className="h-5 w-5 shrink-0 text-[#607861]" />
                  <input
                    type="search"
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                    placeholder="Search communities, areas, or lifestyles..."
                    className="min-w-0 flex-1 bg-transparent text-base text-[#29342d] outline-none placeholder:text-[#879387]"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <div
                    className="relative"
                    ref={activeFilter === "category" ? activeFilterRef : null}
                  >
                    <button
                      type="button"
                      aria-expanded={activeFilter === "category"}
                      onClick={() =>
                        setActiveFilter((current) =>
                          current === "category" ? null : "category",
                        )
                      }
                      className={filterChipClass(propertyTypeFilter !== "ALL")}
                    >
                      {propertyTypeFilter === "ALL"
                        ? "Category"
                        : propertyTypeFilter.charAt(0) + propertyTypeFilter.slice(1).toLowerCase()}
                      <ChevronDown className={`h-4 w-4 transition ${activeFilter === "category" ? "rotate-180" : ""}`} />
                    </button>
                    {activeFilter === "category" && (
                    <div className="absolute left-0 top-12 z-20 w-64 max-w-[calc(100vw-2rem)] rounded-2xl bg-white p-4 shadow-[0_16px_40px_rgba(35,59,48,0.18)]">
                      <label className="grid gap-2 text-xs font-bold text-[#596859]">
                        Property category
                        <select value={propertyTypeFilter} onChange={(event) => setPropertyTypeFilter(event.target.value)} className="h-11 rounded-xl bg-[#f5f3ed] px-3 text-sm font-normal text-[#475547] outline-none focus:ring-2 focus:ring-[#a9bba3]">
                          <option value="ALL">All Categories</option>
                          <option value="HOUSE">House</option>
                          <option value="CONDO">Condo</option>
                          <option value="APARTMENT">Apartment</option>
                          <option value="DORMITORY">Dormitory</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </label>
                    </div>
                    )}
                  </div>

                  <div
                    className="relative"
                    ref={activeFilter === "gender" ? activeFilterRef : null}
                  >
                    <button
                      type="button"
                      aria-expanded={activeFilter === "gender"}
                      onClick={() =>
                        setActiveFilter((current) =>
                          current === "gender" ? null : "gender",
                        )
                      }
                      className={filterChipClass(genderFilter !== "ALL")}
                    >
                      {genderFilter === "ALL"
                        ? "Gender"
                        : genderFilter === "ANY"
                          ? "No restriction"
                          : `${genderFilter.charAt(0)}${genderFilter.slice(1).toLowerCase()} only`}
                      <ChevronDown className={`h-4 w-4 transition ${activeFilter === "gender" ? "rotate-180" : ""}`} />
                    </button>
                    {activeFilter === "gender" && (
                    <div className="absolute left-0 top-12 z-20 w-64 max-w-[calc(100vw-2rem)] rounded-2xl bg-white p-4 shadow-[0_16px_40px_rgba(35,59,48,0.18)]">
                      <label className="grid gap-2 text-xs font-bold text-[#596859]">
                        Roommate gender
                        <select value={genderFilter} onChange={(event) => setGenderFilter(event.target.value)} className="h-11 rounded-xl bg-[#f5f3ed] px-3 text-sm font-normal text-[#475547] outline-none focus:ring-2 focus:ring-[#a9bba3]">
                          <option value="ALL">All Genders</option>
                          <option value="FEMALE">Female Only</option>
                          <option value="MALE">Male Only</option>
                          <option value="ANY">No Restriction</option>
                        </select>
                      </label>
                    </div>
                    )}
                  </div>

                  <div
                    className="relative"
                    ref={activeFilter === "moveIn" ? activeFilterRef : null}
                  >
                    <button
                      type="button"
                      aria-expanded={activeFilter === "moveIn"}
                      onClick={() =>
                        setActiveFilter((current) =>
                          current === "moveIn" ? null : "moveIn",
                        )
                      }
                      className={filterChipClass(Boolean(fromDate || toDate))}
                    >
                      <CalendarDays className="h-4 w-4" />
                      {fromDate || toDate
                        ? `${fromDate || "Any"} – ${toDate || "Any"}`
                        : "Move-in"}
                      <ChevronDown className={`h-4 w-4 transition ${activeFilter === "moveIn" ? "rotate-180" : ""}`} />
                    </button>
                    {activeFilter === "moveIn" && (
                    <div className="absolute left-0 top-12 z-20 grid w-72 max-w-[calc(100vw-2rem)] gap-3 rounded-2xl bg-white p-4 shadow-[0_16px_40px_rgba(35,59,48,0.18)]">
                      <label className="grid gap-2 text-xs font-bold text-[#596859]">
                        From
                        <input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} className="h-11 rounded-xl bg-[#f5f3ed] px-3 text-sm font-normal text-[#475547] outline-none focus:ring-2 focus:ring-[#a9bba3]" />
                      </label>
                      <label className="grid gap-2 text-xs font-bold text-[#596859]">
                        To
                        <input type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} className="h-11 rounded-xl bg-[#f5f3ed] px-3 text-sm font-normal text-[#475547] outline-none focus:ring-2 focus:ring-[#a9bba3]" />
                      </label>
                    </div>
                    )}
                  </div>

                  <div
                    className="relative"
                    ref={activeFilter === "budget" ? activeFilterRef : null}
                  >
                    <button
                      type="button"
                      aria-expanded={activeFilter === "budget"}
                      onClick={() =>
                        setActiveFilter((current) =>
                          current === "budget" ? null : "budget",
                        )
                      }
                      className={filterChipClass(Boolean(minBudget || maxBudget))}
                    >
                      {minBudget || maxBudget
                        ? `฿${minBudget || "0"} – ฿${maxBudget || "Any"}`
                        : "Budget"}
                      <ChevronDown className={`h-4 w-4 transition ${activeFilter === "budget" ? "rotate-180" : ""}`} />
                    </button>
                    {activeFilter === "budget" && (
                    <div className="absolute left-0 top-12 z-20 grid w-72 max-w-[calc(100vw-2rem)] grid-cols-2 gap-3 rounded-2xl bg-white p-4 shadow-[0_16px_40px_rgba(35,59,48,0.18)]">
                      <label className="grid gap-2 text-xs font-bold text-[#596859]">
                        Minimum
                        <input type="number" min="0" value={minBudget} onChange={(event) => setMinBudget(event.target.value)} placeholder="No min" className="h-11 min-w-0 rounded-xl bg-[#f5f3ed] px-3 text-sm font-normal text-[#475547] outline-none placeholder:text-[#879387] focus:ring-2 focus:ring-[#a9bba3]" />
                      </label>
                      <label className="grid gap-2 text-xs font-bold text-[#596859]">
                        Maximum
                        <input type="number" min="0" value={maxBudget} onChange={(event) => setMaxBudget(event.target.value)} placeholder="No max" className="h-11 min-w-0 rounded-xl bg-[#f5f3ed] px-3 text-sm font-normal text-[#475547] outline-none placeholder:text-[#879387] focus:ring-2 focus:ring-[#a9bba3]" />
                      </label>
                    </div>
                    )}
                  </div>

                  <div
                    className="relative"
                    ref={activeFilter === "groupSize" ? activeFilterRef : null}
                  >
                    <button
                      type="button"
                      aria-expanded={activeFilter === "groupSize"}
                      onClick={() =>
                        setActiveFilter((current) =>
                          current === "groupSize" ? null : "groupSize",
                        )
                      }
                      className={filterChipClass(groupSizeFilter !== "ALL")}
                    >
                      {groupSizeFilter === "ALL"
                        ? "Group size"
                        : `${groupSizeFilter} members`}
                      <ChevronDown className={`h-4 w-4 transition ${activeFilter === "groupSize" ? "rotate-180" : ""}`} />
                    </button>
                    {activeFilter === "groupSize" && (
                    <div className="absolute right-0 top-12 z-20 w-64 max-w-[calc(100vw-2rem)] rounded-2xl bg-white p-4 shadow-[0_16px_40px_rgba(35,59,48,0.18)]">
                      <label className="grid gap-2 text-xs font-bold text-[#596859]">
                        Group size
                        <select value={groupSizeFilter} onChange={(event) => setGroupSizeFilter(event.target.value)} className="h-11 rounded-xl bg-[#f5f3ed] px-3 text-sm font-normal text-[#475547] outline-none focus:ring-2 focus:ring-[#a9bba3]">
                          <option value="ALL">Any Group Size</option>
                          <option value="1-2">1-2 members</option>
                          <option value="3-4">3-4 members</option>
                          <option value="5+">5+ members</option>
                        </select>
                      </label>
                    </div>
                    )}
                  </div>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="min-h-11 px-2 text-sm font-bold text-terracotta underline-offset-2 hover:underline"
                    >
                      Clear filters
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e8e5dc] pt-4">
                  <span className="text-sm font-bold text-[#596859]">
                    {filteredPosts.length}{" "}
                    {filteredPosts.length === 1 ? "community" : "communities"}
                  </span>
                  <label className="ml-auto flex items-center gap-1 text-xs font-medium text-[#7c887c]">
                    Sort:
                    <select
                      value={sortOrder}
                      onChange={(event) => setSortOrder(event.target.value)}
                      className="h-9 rounded-full bg-transparent px-2 text-sm font-bold text-[#526052] outline-none hover:bg-[#eeece4] focus:bg-[#eeece4]"
                    >
                      <option value="NEWEST">Newest</option>
                      <option value="LOWEST_RENT">Lowest rent</option>
                      <option value="HIGHEST_RENT">Highest rent</option>
                    </select>
                  </label>
                </div>
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
                const listing = getCommunityListing(post);
                const creatorZodiac = formatZodiacWithSymbol(
                  creator?.profile?.zodiac,
                );
                const isCreator = Number(creatorId) === Number(userId);
                const communityMembers = zodiacMode
                  ? post.members || []
                  : membersByPost[post.id] || [];
                const memberZodiacs = communityMembers
                  .map((member) => member.user?.profile?.zodiac)
                  .filter(Boolean)
                  .map(formatZodiacWithSymbol);
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
                    className={`flex flex-col gap-4 rounded-[18px] border border-[#e1e5dd] bg-white p-5 shadow-[0_8px_25px_rgba(67,81,67,0.07)] transition-all hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(67,81,67,0.13)] sm:p-6 ${zodiacMode ? "lg:p-8" : ""}`}
                  >
                    {/* Post Header */}
                    {zodiacMode ? (
                      <div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#6f7a73]">
                          <span
                            className={`rounded-full px-3 py-1.5 font-extrabold ${post.compatibilityScore == null
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
                          <span className="inline-flex items-center gap-1">
                            Creator:
                            {creatorId != null ? (
                              <button
                                type="button"
                                onClick={() => setProfileUserId(creatorId)}
                                className="rounded-sm font-semibold text-[#52685b] underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#748a75]"
                              >
                                {creator?.profile?.firstName || creator?.username || "Community member"}
                              </button>
                            ) : (
                              creator?.profile?.firstName || creator?.username || "Community member"
                            )}
                          </span>
                          {creatorZodiac && (
                            <span className="rounded-full bg-[#f2f0e9] px-2 py-1 font-semibold text-[#697568]">
                              {creatorZodiac}
                            </span>
                          )}
                          <span
                            className={`ml-auto rounded-full border px-2.5 py-1 font-bold ${post.status === "FULL"
                              ? "border-[#edd7cb] bg-[#f8ede6] text-terracotta"
                              : "border-[#cfd7cd] bg-[#eef3eb] text-[#546b55]"
                              }`}
                          >
                            {post.status}
                          </span>
                        </div>
                        <h2 className="mt-4 font-serif text-xl leading-snug text-[#25463c] sm:text-2xl">
                          {post.title}
                        </h2>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[#687568]">
                          {memberZodiacs.length > 0 && (
                            <>
                              <Users className="h-4 w-4" />
                              <span>Members:</span>
                              {memberZodiacs.map((zodiac, index) => (
                                <span
                                  key={`${post.id}-${zodiac}-${index}`}
                                  className="rounded-full bg-[#f2f0e9] px-2 py-1 font-medium text-[#697568]"
                                >
                                  {zodiac}
                                </span>
                              ))}
                            </>
                          )}
                          <span className="rounded-full bg-[#f2f0e9] px-2 py-1">
                            {post.matchedMembers} of {post.totalMembers} matched
                          </span>
                        </div>
                      </div>
                    ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {creatorId != null ? (
                          <button
                            type="button"
                            onClick={() => setProfileUserId(creatorId)}
                            aria-label={`View ${creator?.profile?.firstName || creator?.username || "creator"} profile`}
                            className="h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-[#e1e7df] shadow-xs transition hover:border-[#748a75] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#748a75]"
                          >
                            <img alt="" className="h-full w-full object-cover" src={creator?.profile?.profileImageUrl || fallbackImage} />
                          </button>
                        ) : (
                          <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-[#e1e7df] shadow-xs">
                            <img alt="" className="h-full w-full object-cover" src={creator?.profile?.profileImageUrl || fallbackImage} />
                          </div>
                        )}
                        <div>
                          {creatorId != null ? (
                            <button
                              type="button"
                              onClick={() => setProfileUserId(creatorId)}
                              className="rounded-sm text-[15px] font-bold text-[#475547] transition hover:text-[#294c3f] hover:underline hover:underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#748a75]"
                            >
                              {creator?.profile?.firstName || creator?.username || "Community member"}
                            </button>
                          ) : (
                            <div className="text-[15px] font-bold text-[#475547]">
                              {creator?.profile?.firstName || creator?.username || "Community member"}
                            </div>
                          )}
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
                                className={`flex items-center gap-0.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${post.status === "FULL"
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
                    )}

                    {/* Listing Preview (If Available) */}
                    {listing && (
                      <Link
                        to={listing.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex flex-col md:flex-row gap-5 p-3.5 rounded-xl bg-[#fafbf8] border border-[#e1e5dd] hover:border-[#748a75] hover:bg-[#f6f8f5] hover:shadow-xs transition-all cursor-pointer text-inherit no-underline"
                      >
                        <div className="relative w-full md:w-70 h-47.5 rounded-lg overflow-hidden shrink-0 bg-[#e8ede5]">
                          {listing.imageUrl ? (
                            <img
                              alt={listing.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              src={listing.imageUrl}
                            />
                          ) : (
                            <div className="grid size-full place-items-center bg-[#edf0ea] text-[#879387]">
                              <ImageOff className="size-8" aria-label="No listing image" />
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col justify-center gap-2 py-1 min-w-0 flex-1">
                          <div>
                            <div className="flex items-center gap-2 justify-between">
                              <h3 className="text-[18px] font-bold text-[#475547] group-hover:text-[#2f3d30] transition-colors leading-tight font-serif truncate">
                                {listing.title}
                              </h3>
                              <ExternalLink className="w-4 h-4 text-[#889188] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                            </div>
                            <div className="text-[13px] text-[#889188] mt-1">
                              {listing.subtitle}
                            </div>
                          </div>

                          <div className="text-[18px] font-bold text-[#607861]">
                            ฿ {Number(listing.monthlyRent).toLocaleString()}
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-[13px] text-[#607060] pt-1">
                            {listing.isRoom ? (
                              <>
                                <span className="font-semibold capitalize">
                                  {String(listing.status || "available").toLowerCase()}
                                </span>
                                {listing.capacity && (
                                  <div className="flex items-center gap-1.5">
                                    <Users className="w-4 h-4 text-[#889188]" />
                                    <span>Up to {listing.capacity} people</span>
                                  </div>
                                )}
                              </>
                            ) : (!zodiacMode || Number.isInteger(listing.roomCount)) && (
                              <div className="flex items-center gap-1.5">
                                <BedSingle className="w-4 h-4 text-[#889188]" />
                                <span>
                                  {listing.roomCount ?? 0} rooms
                                </span>
                              </div>
                            )}
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

                    {zodiacMode && canExplainMatch && (
                      <div className="rounded-xl bg-[#f8f6f0] px-4 py-3">
                        <button
                              type="button"
                              onClick={() =>
                                setExpandedMatchId(
                                  isMatchExpanded ? null : post.id,
                                )
                              }
                              aria-expanded={isMatchExpanded}
                              aria-controls={`zodiac-reasons-${post.id}`}
                              className="flex w-full items-center justify-between gap-1.5 text-xs font-bold text-[#36574b] transition-colors hover:text-[#173f34]"
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
                            className="mt-3 border-t border-[#deddd5] pt-3"
                          >
                            <ul className="list-disc space-y-1 pl-4 text-[13px] leading-relaxed text-[#596859]">
                              {compatibilityReasons.map((reason, index) => (
                                <li key={`${post.id}-${index}-${reason}`}>
                                  {reason}
                                </li>
                              ))}
                            </ul>
                          </div>
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
          {!zodiacMode && (
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
          )}
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
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => {
          setIsEditProfileOpen(false);
          setBirthdateRequired(false);
        }}
      />
      {profileUserId != null && (
        <UserProfileModal
          userId={profileUserId}
          onClose={() => setProfileUserId(null)}
        />
      )}
    </main>
  );
}

export default CommunityPage;
