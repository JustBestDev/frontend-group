import { useState } from "react";
import { Copy, Loader2, MapPin, Users, X } from "lucide-react";
import api from "../../services/api.js";

const SharePropertyModal = ({
  property,
  propertyId,
  galleryImages,
  address,
  displayPrice,
  isUnavailableForCommunity,
  isReserved,
  isRented,
  showToast,
  onClose,
}) => {
  const [isSharingToCommunity, setIsSharingToCommunity] = useState(false);
  const [postTitle, setPostTitle] = useState(property?.title || property?.name || "");
  const [postDescription, setPostDescription] = useState("");
  const [requireMember, setRequireMember] = useState(1);
  const [genderPreference, setGenderPreference] = useState("ANY");

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

  // Share to RoomMate Community
  const handleShareToCommunity = async () => {
    if (isUnavailableForCommunity) {
      showToast("This property is unavailable and cannot be shared");
      return;
    }
    if (!postTitle.trim()) {
      showToast("Please enter a post title");
      return;
    }
    setIsSharingToCommunity(true);
    try {
      let formattedDescription = postDescription.trim();
      if (genderPreference === "FEMALE_ONLY") {
        formattedDescription = `[GENDER:FEMALE] ${formattedDescription}`;
      } else if (genderPreference === "MALE_ONLY") {
        formattedDescription = `[GENDER:MALE] ${formattedDescription}`;
      }

      await saveShareToDatabase(property, {
        title: postTitle.trim(),
        description: formattedDescription,
        requireMember: Number(requireMember) || 1,
      });
      showToast("Shared to Community successfully!");
      onClose();
    } catch (err) {
      console.error("Failed to save community share:", err);
      showToast(
        err.response?.data?.message ||
          "Failed to share to Community. Please try again.",
      );
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

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in"
      onClick={onClose}
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
            <p className="text-xs sm:text-sm text-muted-copy mt-1">
              Choose where you'd like to share this property listing
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-muted-copy hover:text-[#1c1c16] hover:bg-[#f0f2ee] transition-colors cursor-pointer"
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
            <p className="text-xs sm:text-sm text-muted-copy truncate flex items-center gap-1.5 mt-1">
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
        <div className="mb-6 p-5 sm:p-6 rounded-2xl border-2 border-sage-light bg-[#fbfdfa]">
          <div className="flex items-start sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-sage-light text-[#294c25] flex items-center justify-center shrink-0 shadow-xs">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-bold text-[#1c1c16]">
                  Share to RoomMate Community
                </h4>
                <p className="text-xs sm:text-sm text-muted-copy mt-0.5">
                  Save listing to database & publish on the Community
                  roommate feed
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-flex text-xs uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-sage-light text-[#294c25] shrink-0">
              Internal Feed
            </span>
          </div>

          {isUnavailableForCommunity && (
            <div className="mb-5 rounded-xl border border-[#f4c7c3] bg-[#fde8e6] p-4 text-sm font-medium text-danger">
              {isReserved
                ? "This property is reserved and cannot be shared to the community."
                : isRented
                  ? "This property is rented and cannot be shared to the community."
                  : "This property is unavailable and cannot be shared to the community."}
            </div>
          )}

          {/* Form Inputs for Community Post */}
          <div className="space-y-3.5 mb-5">
            {/* Title & Require Member Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#1c1c16] mb-1.5">
                  Post Title / หัวข้อโพสต์{" "}
                  <span className="text-danger">*</span>
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
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted-copy pointer-events-none">
                    person
                  </span>
                </div>
              </div>
            </div>

            {/* Roommate Gender Preference */}
            <div>
              <label className="block text-xs font-bold text-[#1c1c16] mb-1.5">
                Roommate Gender Preference / เพศที่ต้องการ
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "ANY", label: "ไม่จำกัด (Any)" },
                  { value: "FEMALE_ONLY", label: "หญิงเท่านั้น (Female)" },
                  { value: "MALE_ONLY", label: "ชายเท่านั้น (Male)" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setGenderPreference(option.value)}
                    className={`py-2 px-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer text-center ${genderPreference === option.value
                      ? "bg-[#4f614d] text-white border-[#4f614d] shadow-xs"
                      : "bg-white text-[#465346] border-[#e1e5dd] hover:bg-[#f5f7f4]"
                      }`}
                  >
                    {option.label}
                  </button>
                ))}
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
            disabled={isSharingToCommunity || isUnavailableForCommunity}
            className="w-full py-3 sm:py-3.5 px-5 rounded-xl bg-[#4f614d] hover:bg-[#41513f] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs disabled:opacity-60"
          >
            {isUnavailableForCommunity ? (
              <span>Cannot Share Unavailable Property</span>
            ) : isSharingToCommunity ? (
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
          <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-muted-copy mb-2">
            Copy Listing Link
          </label>
          <div className="flex items-center gap-2.5">
            <input
              type="text"
              readOnly
              value={window.location.href}
              className="flex-1 text-xs sm:text-sm px-4 py-2.5 sm:py-3 bg-[#f7f5ee] border border-[#e1e5dd] rounded-xl text-muted-copy select-all truncate focus:outline-none font-mono"
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
  );
};

export default SharePropertyModal;
