import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
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
} from "lucide-react";
import useAuthStore from "../stores/authStore.js";
import RentalRequestModal from "../components/rentalRequest/RentalRequestModal.jsx";
import api, { getApiErrorMessage } from "../services/api.js";
import { getCommunityReadiness } from "../utils/communityRental.js";

const fallbackImage =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80";

function CommunityPage() {
  const navigate = useNavigate();
  const userId = useAuthStore((state) => state.user?.id);
  const [searchText, setSearchText] = useState("");
  const [propertyTypeFilter, setPropertyTypeFilter] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [groupSizeFilter, setGroupSizeFilter] = useState("ALL");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [sortOrder, setSortOrder] = useState("NEWEST");
  const [posts, setPosts] = useState(null);
  const [requestingPostId, setRequestingPostId] = useState(null);
  const [joinFeedback, setJoinFeedback] = useState(null);
  const [membersByPost, setMembersByPost] = useState({});
  const [rentalRequests, setRentalRequests] = useState([]);
  const [groupDataLoading, setGroupDataLoading] = useState(true);
  const [selectedGroupPost, setSelectedGroupPost] = useState(null);

  const fetchCommunity = useCallback(async () => {
    setGroupDataLoading(true);
    try {
      const response = await api.get("/community-posts");
      const nextPosts = Array.isArray(response.data) ? response.data : [];
      setPosts(nextPosts);

      const creatorPosts = userId
        ? nextPosts.filter(
            (post) =>
              Number(post.creatorId ?? post.creator?.id) === Number(userId) &&
              Boolean(post.propertyId) &&
              post.property?.rentType === "WHOLE_UNIT",
          )
        : [];

      if (creatorPosts.length === 0) {
        setGroupDataLoading(false);
        return;
      }

      try {
        const [memberEntries, requestResponse] = await Promise.all([
          Promise.all(
            creatorPosts.map(async (post) => {
              const membersResponse = await api.get(
                `/community-posts/${post.id}/members`,
              );
              return [
                post.id,
                Array.isArray(membersResponse.data) ? membersResponse.data : [],
              ];
            }),
          ),
          api.get("/rental-requests/me"),
        ]);
        setMembersByPost(Object.fromEntries(memberEntries));
        setRentalRequests(
          Array.isArray(requestResponse.data.data)
            ? requestResponse.data.data
            : [],
        );
      } catch (error) {
        setJoinFeedback({
          message: getApiErrorMessage(
            error,
            "Unable to check group rental readiness",
          ),
          isError: true,
        });
      } finally {
        setGroupDataLoading(false);
      }
    } catch (error) {
      setPosts([]);
      setGroupDataLoading(false);
      setJoinFeedback({
        message: getApiErrorMessage(error, "Unable to load community posts"),
        isError: true,
      });
    }
  }, [userId]);

  useEffect(() => {
    // Loading server state is the purpose of this effect.
    // oxlint-disable-next-line react/set-state-in-effect
    fetchCommunity();
  }, [fetchCommunity]);

  const handleRequestToJoin = async (communityPostId) => {
    setRequestingPostId(communityPostId);
    setJoinFeedback(null);

    try {
      await api.post(`/community-posts/${communityPostId}/join-requests`, {
        message: "",
      });
      setJoinFeedback({
        message: "Join request submitted successfully!",
        isError: false,
      });
    } catch (error) {
      setJoinFeedback({
        message:
          error.response?.data?.message ||
          "Unable to submit your join request. Please try again.",
        isError: true,
      });
    } finally {
      setRequestingPostId(null);
    }
  };

  const filteredPosts = (posts || [])
    .filter((post) => {
      const property = post.property;
      const searchableText = [
        post.title,
        post.description,
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
    setFromDate("");
    setToDate("");
    setGroupSizeFilter("ALL");
    setMinBudget("");
    setMaxBudget("");
    setSortOrder("NEWEST");
  };

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
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column (Main Feed - 68%) */}
          <div className="w-full lg:w-full flex flex-col gap-6">
            {/* Community search and filters */}
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

              <div className="mt-4 grid gap-3 md:grid-cols-4">
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

            {/* Community Feed Posts */}
            <div className="flex flex-col gap-6">
              {filteredPosts.map((post) => {
                const creatorId = post.creatorId ?? post.creator?.id;
                const isCreator = Number(creatorId) === Number(userId);
                const readiness = getCommunityReadiness(
                  post,
                  membersByPost[post.id],
                );
                const existingGroupRequest = rentalRequests.find(
                  (request) =>
                    Number(request.communityPostId) === Number(post.id),
                );
                const supportsGroupRental =
                  Boolean(post.propertyId) &&
                  post.property?.rentType === "WHOLE_UNIT";

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
                          src={post.creator?.profile?.profileImageUrl || fallbackImage}
                        />
                      </div>
                      <div>
                        <div className="text-[15px] font-bold text-[#475547]">
                          {post.creator?.profile?.firstName ||
                            post.creator?.username ||
                            "Community member"}
                        </div>
                        <div className="text-[12px] text-[#889188] flex flex-wrap items-center gap-1.5 mt-0.5 font-medium">
                          <span>{post.createdAt}</span>
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
                          <span>·</span>
                          <Globe className="w-3.5 h-3.5 text-[#889188]" />
                        </div>
                      </div>
                    </div>
                    <button className="text-[#889188] hover:text-[#475547] p-1.5 rounded-full hover:bg-[#eef3eb] transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Property Preview (If Available) */}
                  {post.property && (
                    <div className="flex flex-col md:flex-row gap-5 p-3.5 rounded-xl bg-[#fafbf8] border border-[#e1e5dd]">
                      <div className="relative w-full md:w-70 h-47.5 rounded-lg overflow-hidden shrink-0 bg-[#e8ede5]">
                        <img
                          alt="Property"
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          src={post.property.images?.[0]?.imageUrl || fallbackImage}
                        />
                      </div>

                      <div className="flex flex-col justify-center gap-2 py-1">
                        <div>
                          <h3 className="text-[18px] font-bold text-[#475547] leading-tight font-serif">
                            {post.property.title}
                          </h3>
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
                            <span> {post.property.totalBedrooms} /rooms</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Post Content Description */}
                  <p className="text-[15px] text-[#465346] leading-relaxed">
                    {post.description}
                  </p>

                  {/* Action Area */}
                  <div className="flex items-center justify-end border-t border-[#edf0ea] pt-3.5 mt-1 gap-3">
                    {isCreator && (
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
                    {isCreator ? (
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
