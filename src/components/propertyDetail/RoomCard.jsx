import { ArrowRight, BedDouble, Users } from "lucide-react";
import { Link } from "react-router";

const RoomCard = ({ room, index, propertyId, galleryImages, selectedRoomId, setSelectedRoomId, wholeUnitStatus }) => {
  const roomId = room.id || room.roomId || index + 1;
  const reportedStatus = (room.status || room.roomStatus || "UNKNOWN").toUpperCase();
  const effectiveStatus = wholeUnitStatus && wholeUnitStatus !== "AVAILABLE" ? wholeUnitStatus : reportedStatus;
  const isAvailable = effectiveStatus === "AVAILABLE";
  const isSelected = String(selectedRoomId) === String(roomId);
  const roomImage = room.images?.[0]?.imageUrl || room.images?.[0]?.url || room.imageUrl || galleryImages[0];
  const roomName = room.name || room.roomName || `Room ${index + 1}`;
  const statusLabel = effectiveStatus.charAt(0) + effectiveStatus.slice(1).toLowerCase();

  return (
    <article
      onClick={() => isAvailable && setSelectedRoomId(String(roomId))}
      className={`overflow-hidden rounded-[18px] bg-white shadow-[0_10px_28px_rgba(50,66,54,.07)] transition ${isSelected ? "ring-2 ring-forest" : "hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(50,66,54,.11)]"} ${isAvailable ? "cursor-pointer" : "opacity-75"}`}
    >
      <div className="relative h-47 bg-[#e9e6dc]">
        {roomImage ? <img src={roomImage} alt={roomName} className={`size-full object-cover ${isAvailable ? "" : "grayscale"}`} /> : <div className="grid size-full place-items-center text-sage-dark"><BedDouble className="size-9" /></div>}
        <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold shadow-sm ${isAvailable ? "bg-white text-[#315d38]" : "bg-[#29342d]/85 text-white"}`}>{isSelected && isAvailable ? "Active selection" : statusLabel}</span>
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-serif text-lg font-bold leading-snug text-forest">{roomName}</h3>
          {room.monthlyRent != null && <strong className="shrink-0 font-serif text-lg text-forest">฿{Number(room.monthlyRent).toLocaleString()}</strong>}
        </div>
        {room.monthlyRent != null && <p className="text-right text-[10px] text-muted-copy">/ month</p>}

        {room.capacity != null && <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-copy"><Users className="size-3.5 text-sage-dark" />Capacity: {room.capacity}</p>}
        {room.description && <p className="mt-3 line-clamp-2 text-xs leading-5 text-muted-copy">{room.description}</p>}

        <div className="mt-4 border-t border-line pt-3">
          {isAvailable ? (
            <Link to={`/properties/${propertyId}/${roomId}`} onClick={(event) => event.stopPropagation()} className="inline-flex items-center gap-1 text-xs font-bold text-forest hover:text-sage-dark">View Room Details <ArrowRight className="size-3.5" /></Link>
          ) : (
            <span className="text-xs font-semibold text-muted-copy">{statusLabel}</span>
          )}
        </div>
      </div>
    </article>
  );
};

export default RoomCard;
