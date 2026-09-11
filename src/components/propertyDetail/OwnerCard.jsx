import { Loader2, MessageCircle, ShieldCheck } from "lucide-react";

const OwnerCard = ({ ownerProfile, ownerDisplayName, handleContactOwner, isContactingOwner }) => {
  const ownerAvatar = ownerProfile.profileImageUrl || ownerProfile.avatar;

  return (
    <section className="space-y-4 rounded-[20px] bg-white p-6 shadow-[0_12px_30px_rgba(50,66,54,.07)]">
      <span className="text-[10px] font-bold uppercase tracking-[.14em] text-muted-copy">Property Host</span>
      <div className="flex items-center gap-3.5">
        <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#ead8d2] font-serif text-xl font-bold text-[#835024]">
          {ownerAvatar ? <img src={ownerAvatar} alt={ownerDisplayName} className="size-full object-cover" /> : ownerDisplayName.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="font-serif text-lg font-bold text-forest">{ownerDisplayName}</h3>
          {ownerProfile.isVerified === true && <p className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-sage-dark"><ShieldCheck className="size-3.5" />Verified Host</p>}
        </div>
      </div>

      {ownerProfile.bio && <p className="rounded-xl bg-[#f7f5ee] p-3 text-xs leading-5 text-muted-copy">{ownerProfile.bio}</p>}

      <button type="button" onClick={handleContactOwner} disabled={isContactingOwner} className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-[#f1eee4] py-2.5 text-xs font-bold text-forest transition hover:bg-[#e8e4d8] disabled:cursor-wait">
        {isContactingOwner ? <Loader2 className="size-3.5 animate-spin" /> : <MessageCircle className="size-3.5" />}
        {isContactingOwner ? "Opening..." : "Contact Host"}
      </button>
    </section>
  );
};

export default OwnerCard;
