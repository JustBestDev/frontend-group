import { Loader2, MessageCircle, ShieldCheck, UserRound } from "lucide-react";

const OwnerCard = ({ ownerProfile, ownerDisplayName, handleContactOwner, isContactingOwner }) => {
  const ownerAvatar = ownerProfile.profileImageUrl || ownerProfile.avatar;

  return (
    <div className="bg-white border border-[#e1e5dd] rounded-2xl p-6 shadow-xs space-y-4">
      <span className="text-xs font-bold uppercase tracking-wider text-muted-copy">
        Property Host
      </span>

      <div className="flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-full bg-[#eedcd4] border border-[#e0c9bd] flex items-center justify-center font-bold text-lg text-[#835024] shrink-0">
          {ownerAvatar ? (
            <img
              src={ownerAvatar}
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
          {ownerProfile.isVerified ? (
            <div className="flex items-center gap-1 text-xs text-[#4f614d] font-semibold mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Host</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-xs text-muted-copy font-medium mt-0.5">
              <UserRound className="w-3.5 h-3.5" />
              <span>Property Host</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-3 bg-[#f7f5ee] rounded-xl text-xs text-muted-copy space-y-1">
        <p>• Usually responds within an hour</p>
        <p>• Schedule room viewing at least 1 day in advance</p>
      </div>

      {ownerProfile.bio ? (
        <div className="p-3 bg-[#f7f5ee] rounded-xl text-xs text-[#414753] leading-relaxed">
          <p className="line-clamp-3">{ownerProfile.bio}</p>
        </div>
      ) : (
        <div className="p-3 bg-[#f7f5ee] rounded-xl text-xs text-muted-copy space-y-1">
          <p>• Message host directly to check availability</p>
          <p>• Schedule a room viewing before making a deposit</p>
        </div>
      )}

      <button
        type="button"
        onClick={handleContactOwner}
        disabled={isContactingOwner}
        className="w-full py-2.5 rounded-xl bg-[#f1eee4] hover:bg-[#e8e4d8] text-[#1c1c16] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
      >
        {isContactingOwner ? <Loader2 className="w-3.5 h-3.5 animate-spin text-[#4f614d]" /> : <MessageCircle className="w-3.5 h-3.5 text-[#4f614d]" />}
        <span>{isContactingOwner ? "Opening..." : "Send Host a Message"}</span>
      </button>
    </div>
  );
};

export default OwnerCard;
