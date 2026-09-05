import { useEffect, useState } from "react";
import {
  Building2,
  Maximize2,
  MoreHorizontal,
  Globe,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  Send,
  Users,
  RefreshCw,
  BedSingle,
} from "lucide-react";
import useAuthStore from "../stores/authStore.js";
import api from "../services/api.js";

const INITIAL_POSTS = [
  {
    id: 1,
    author: {
      name: "Numfon Wongphattarachoti",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      role: "Member",
    },
    rentType: "INDIVIDUAL_ROOM",
    propertyType: "CONDO",
    category: "Roommate Search",
    createdAt: "8m ago",
    content:
      "Brand-new condo in the heart of Sukhumvit. Convenient commute close to BTS Ekkamai and expressway. Fully equipped with premium facilities. Ideal for working professionals seeking quality living. Feel free to inquire!",
    property: {
      title: "XELF by Sansiri",
      location: "Khlong Toei, Bangkok",
      price: "From 3.59M THB / 18,000 THB/mo",
      image:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80",
      floors: "34 Floors",
      area: "23.75–85.5 sq.m.",
    },
  },
  {
    id: 2,
    author: {
      name: "Thanaphol S.",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      role: "Tenant",
    },
    rentType: "INDIVIDUAL_ROOM",
    propertyType: "APARTMENT",
    category: "Room Search",
    createdAt: "45m ago",
    content:
      "Looking for a studio or 1-bedroom condo around Ari - Saphan Khwai. Budget up to 12,000 THB/month, ready to move in by end of this month. Parking space preferred. Please message me if you have an available room or want to co-rent!",
  },
  {
    id: 3,
    author: {
      name: "Supaporn Residence (Owner)",
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
      role: "Property Owner",
    },
    rentType: "WHOLE_UNIT",
    propertyType: "CONDO",
    category: "Owner Listing",
    createdAt: "2h ago",
    content:
      "Corner unit with pool view. Fully furnished with brand-new appliances: washing machine, microwave, 2-door refrigerator. 1-year contract, common fee included. Available for daily viewing!",
    property: {
      title: "Ideo Mobi Sukhumvit 66",
      location: "Bang Na, Bangkok",
      price: "16,500 THB/month",
      image:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80",
      floors: "18th Floor",
      area: "35 sq.m.",
    },
  },
  {
    id: 4,
    author: {
      name: "Kittisak W.",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      role: "Tenant",
    },
    rentType: "WHOLE_UNIT",
    propertyType: "HOUSE",
    category: "Room Search",
    createdAt: "3h ago",
    content:
      "Looking for a whole-unit house or townhouse rental around Phrom Phong - Thong Lo area. 2 bedrooms, pet-friendly. Budget 35,000 - 45,000 THB/month, 1-2 year lease.",
  },
  {
    id: 5,
    author: {
      name: "Prasert Dormitory",
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
      role: "Property Owner",
    },
    rentType: "INDIVIDUAL_ROOM",
    propertyType: "DORMITORY",
    category: "Owner Listing",
    createdAt: "5h ago",
    content:
      "Student dormitory near university campus. Keycard access, 24-hr security guards, high-speed WiFi included. Rent starts at 6,500 THB/month.",
  },
  {
    id: 6,
    author: {
      name: "Siriporn Loft Studio",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
      role: "Property Owner",
    },
    rentType: "WHOLE_UNIT",
    propertyType: "OTHER",
    category: "Owner Listing",
    createdAt: "1d ago",
    content:
      "Creative live-work artist studio space with private entrance and high ceiling. Suitable for freelancers or design studio. Short or long-term lease available.",
  },
];

const PROPERTY_TYPES = ["HOUSE", "CONDO", "APARTMENT", "DORMITORY", "OTHER"];

const FILTER_TABS = [
  { id: "ALL", label: "All" },
  { id: "INDIVIDUAL_ROOM", label: "INDIVIDUAL_ROOM" },
  { id: "WHOLE_UNIT", label: "WHOLE_UNIT" },
  { id: "HOUSE", label: "HOUSE" },
  { id: "CONDO", label: "CONDO" },
  { id: "APARTMENT", label: "APARTMENT" },
  { id: "DORMITORY", label: "DORMITORY" },
  { id: "OTHER", label: "OTHER" },
];

function CommunityPage() {
  const user = useAuthStore((state) => state.user);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [newPostRentType, setNewPostRentType] = useState("INDIVIDUAL_ROOM");
  const [newPostPropertyType, setNewPostPropertyType] = useState("CONDO");
  const [postText, setPostText] = useState("");
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    fetchCommunity();
  }, []);

  const fetchCommunity = async () => {
    try {

      const response = await api.get("/community-posts");
      setPosts(response.data);
    } catch (error) {
      console.log('error', error)
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setActiveFilter("ALL");
    setTimeout(() => {
      setIsRefreshing(false);
    }, 400);
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!postText.trim()) return;

    const newPost = {
      id: Date.now(),
      author: {
        name: user?.name || "You (RoomMate Member)",
        avatar:
          user?.avatar||
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        role: "Member",
      },
      rentType: newPostRentType,
      propertyType: newPostPropertyType,
      category:
        newPostRentType === "INDIVIDUAL_ROOM"
          ? "Roommate Search"
          : "Owner Listing",
      createdAt: "Just now",
      content: postText,
    };

    setPosts([newPost, ...posts]);
    setPostText("");
  };

  const filteredPosts =
    activeFilter === "ALL"
      ? posts
      : posts.filter(
          (p) => p.rentType === activeFilter || p.propertyType === activeFilter,
        );

        if(posts == null) {
          return <div className="">Loading ...</div>;
        }

  return (
    <main className="property-list-page min-h-screen bg-[#f7f5ee] text-[#465346] pt-6 sm:pt-8 pb-16">
      <section className="w-full max-w-320 mx-auto px-4 sm:px-6">
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
          <div className="w-full lg:w-[100%] flex flex-col gap-6">
            {/* Post Composer Card */}
            <div className="bg-white border border-[#e1e5dd] rounded-[18px] p-6 shadow-[0_15px_45px_rgba(68,83,68,0.12)]">
              <form onSubmit={handleCreatePost} className="flex flex-col gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 border-[#e1e7df] shadow-sm">
                    <img
                      alt="User Avatar"
                      className="w-full h-full object-cover"
                      src={
                        user?.profile.profileImageUrl ||
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                      }
                    />
                  </div>
                  <div className="flex-1 flex items-center gap-2 bg-[#fafbf8] border border-[#cfd8cc] rounded-full px-4 py-1.5 focus-within:border-[#748a75] focus-within:ring-2 focus-within:ring-[#748a75]/20 transition-all">
                    <input
                      className="w-full bg-transparent border-0 outline-none text-[15px] text-[#475547] placeholder:text-[#879387] py-1.5"
                      placeholder="Share something with the community..."
                      type="text"
                      value={postText}
                      onChange={(e) => setPostText(e.target.value)}
                    />
                  </div>
                  {postText.trim() && (
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#748a75] hover:bg-[#627863] text-white rounded-full text-sm font-bold transition-all shadow-sm shrink-0 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      Post
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-[#edf0ea] pt-3.5 mt-1 gap-3">
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                    {/* Post Rent Type Selection */}
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor="post-rent-type"
                        className="text-xs font-bold text-[#596859] uppercase tracking-wider"
                      >
                        Rent type
                      </label>
                      <div className="relative">
                        <select
                          id="post-rent-type"
                          value={newPostRentType}
                          onChange={(e) => setNewPostRentType(e.target.value)}
                          className="appearance-none bg-white hover:bg-[#fafbf8] border border-[#cfd7cd] text-xs font-bold text-[#556555] rounded-full pl-3.5 pr-8 py-1.5 cursor-pointer focus:outline-none focus:border-[#748a75] transition-all"
                        >
                          <option value="INDIVIDUAL_ROOM">
                            INDIVIDUAL_ROOM
                          </option>
                          <option value="WHOLE_UNIT">WHOLE_UNIT</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-[#889188] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* PropertyType Selection */}
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor="post-property-type"
                        className="text-xs font-bold text-[#596859] uppercase tracking-wider"
                      >
                        PropertyType
                      </label>
                      <div className="relative">
                        <select
                          id="post-property-type"
                          value={newPostPropertyType}
                          onChange={(e) =>
                            setNewPostPropertyType(e.target.value)
                          }
                          className="appearance-none bg-white hover:bg-[#fafbf8] border border-[#cfd7cd] text-xs font-bold text-[#556555] rounded-full pl-3.5 pr-8 py-1.5 cursor-pointer focus:outline-none focus:border-[#748a75] transition-all"
                        >
                          {PROPERTY_TYPES.map((pt) => (
                            <option key={pt} value={pt}>
                              {pt}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-[#889188] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="text-[#889188] hover:text-[#475547] p-1.5 rounded-full hover:bg-[#eef3eb] transition-colors self-end sm:self-center"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>

            {/* Filter Tabs Toolbar */}
            <div className="flex justify-between items-center border-b border-[#e1e5dd] pb-3 gap-2">
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {FILTER_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveFilter(tab.id)}
                    className={`px-4 py-1.5 rounded-full text-[13px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                      activeFilter === tab.id
                        ? "bg-[#748a75] text-white shadow-[0_4px_12px_rgba(116,138,117,0.25)]"
                        : "bg-white text-[#5e6d5e] hover:bg-[#eef3eb] border border-[#cfd7cd]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Community Feed Posts */}
            <div className="flex flex-col gap-6">
              {filteredPosts.map((post) => (
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
                          src={post.creator.profile.profileImageUrl}
                        />
                      </div>
                      <div>
                        <div className="text-[15px] font-bold text-[#475547]">
                          {post.creator.profile.firstName}
                        </div>
                        <div className="text-[12px] text-[#889188] flex flex-wrap items-center gap-1.5 mt-0.5 font-medium">
                          <span>{post.createdAt}</span>
                          <span>·</span>
                          <span
                            className={`flex items-center gap-0.5 text-[11px] px-2.5 py-0.5 rounded-full font-bold ${
                              post.property.rentType === "INDIVIDUAL_ROOM"
                                ? "bg-[#eef3eb] text-[#546b55] border border-[#cfd7cd]"
                                : "bg-[#f8ede6] text-[#b9683f] border border-[#edd7cb]"
                            }`}
                          >
                            {post.property.rentType}
                          </span>
                          {post.property.propertyType && (
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
                      <div className="relative w-full md:w-[280px] h-[190px] rounded-lg overflow-hidden shrink-0 bg-[#e8ede5]">
                        <img
                          alt="Property"
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          src={post.property.images[0]?.imageUrl}
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
                    <button className="px-4 py-2 rounded-xl border border-[#cfd7cd] text-[13px] text-[#5e6d5e] hover:bg-[#eef3eb] transition-colors font-bold text-center cursor-pointer">
                      View Details
                    </button>
                    <button className="px-5 py-2 rounded-xl bg-[#748a75] hover:bg-[#627863] text-white text-[13px] transition-all font-bold shadow-xs text-center cursor-pointer">
                      Request to Join
                    </button>
                  </div>
                </article>
              ))}
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
                    1.2k+
                  </div>
                  <div className="text-[12px] text-[#8c958b]">Members</div>
                </div>
                <div>
                  <div className="font-bold text-[18px] text-[#b9683f]">
                    850+
                  </div>
                  <div className="text-[12px] text-[#8c958b]">
                    Rooms Matched
                  </div>
                </div>
              </div>
            </div>

            {/* How to Join / Guidelines Card */}
            <div className="bg-white border border-[#e1e5dd] rounded-[18px] p-6 shadow-[0_8px_25px_rgba(67,81,67,0.07)]">
              <div className="flex items-center gap-2.5 mb-4 text-[#b9683f]">
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
    </main>
  );
}

export default CommunityPage;
