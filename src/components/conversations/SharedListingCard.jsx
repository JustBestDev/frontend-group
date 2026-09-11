import { Building2, ChevronRight, Home } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { getSharedListingPath } from "../../utils/conversations.js";

const formatRent = (rent) => rent == null
  ? "Price on request"
  : `฿${Number(rent).toLocaleString()}/month`;

export default function SharedListingCard({ message }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isRoom = message.type === "ROOM_SHARE";
  const listing = isRoom ? message.sharedRoom : message.sharedProperty;

  if (!listing) {
    return (
      <div className="rounded-2xl border border-[#d9d9cf] bg-[#f7f4eb] px-4 py-3 text-sm text-muted-copy">
        This shared listing is no longer available.
      </div>
    );
  }

  const imageUrl = listing.images?.[0]?.imageUrl;
  const title = isRoom ? listing.roomName : listing.title;
  const status = isRoom ? listing.status : listing.propertyStatus;
  const isOwnerPortal = location.pathname.startsWith("/owner");
  const destination = getSharedListingPath(message, isOwnerPortal);

  return (
    <button
      type="button"
      onClick={() => navigate(destination)}
      className="group flex w-full min-w-0 overflow-hidden rounded-2xl border border-[#d8dccf] bg-[#fffdf7] text-left text-ink shadow-[0_5px_16px_rgba(50,66,53,0.08)] transition hover:border-sage hover:shadow-[0_8px_22px_rgba(50,66,53,0.13)] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sage-dark"
      aria-label={`View ${title}`}
    >
      <div className="grid size-24 shrink-0 place-items-center overflow-hidden bg-sage-light/70 sm:size-28">
        {imageUrl ? (
          <img src={imageUrl} alt="" className="size-full object-cover" />
        ) : isRoom ? (
          <Home size={28} className="text-sage-dark" />
        ) : (
          <Building2 size={28} className="text-sage-dark" />
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center p-3 sm:p-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-sage-dark">
          {isRoom ? listing.property?.title || "Room" : "Property"}
        </span>
        <strong className="mt-1 line-clamp-2 font-serif text-base leading-5 text-forest">
          {title}
        </strong>
        <span className="mt-1.5 text-sm font-extrabold text-sage-dark">
          {formatRent(listing.monthlyRent)}
        </span>
        <span className="mt-1 flex items-center gap-1 text-[11px] font-semibold capitalize text-muted-copy">
          {String(status || "available").toLowerCase().replaceAll("_", " ")}
          {isRoom && listing.capacity ? ` · ${listing.capacity} people` : ""}
          <ChevronRight size={13} className="ml-auto transition group-hover:translate-x-0.5" />
        </span>
      </div>
    </button>
  );
}
