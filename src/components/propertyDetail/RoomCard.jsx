import { Link } from "react-router";

const RoomCard = ({
  room,
  index,
  property,
  propertyId,
  galleryImages,
  selectedRoomId,
  setSelectedRoomId,
  wholeUnitStatus,
}) => {
  const roomId = room.id || room.roomId || index + 1;
  const reportedStatus = (
    room.status ||
    room.roomStatus ||
    "AVAILABLE"
  ).toUpperCase();
  const effectiveStatus =
    wholeUnitStatus && wholeUnitStatus !== "AVAILABLE"
      ? wholeUnitStatus
      : reportedStatus;
  const isAvailable = effectiveStatus === "AVAILABLE";
  const statusLabel =
    effectiveStatus === "RESERVED"
      ? "Reserved"
      : effectiveStatus === "RENTED"
        ? "Rented"
        : "Unavailable";
  const roomPrice =
    room.monthlyRent || property.monthlyRent || 0;
  const roomImage =
    room.images?.[0]?.imageUrl ||
    room.images?.[0]?.url ||
    room.imageUrl ||
    galleryImages[index % galleryImages.length];

  const isCardSelected =
    String(selectedRoomId) === String(roomId);
  return (
    <div
      key={roomId}
      onClick={() => setSelectedRoomId(String(roomId))}
      className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-xl border transition-all cursor-pointer gap-4 ${isCardSelected
        ? "border-[#4f614d] bg-[#f8faf7] shadow-sm ring-1 ring-[#4f614d]"
        : isAvailable
          ? "border-[#e1e5dd] bg-white hover:border-sage hover:shadow-xs"
          : "border-[#e1e5dd] bg-[#fcfbf9] opacity-75"
        }`}
    >
      <div className="flex items-center gap-4">
        {/* Room Thumbnail */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-[#e5e2d9] overflow-hidden shrink-0 relative">
          <img
            src={roomImage}
            alt={room.name || `Bedroom ${index + 1}`}
            className={`w-full h-full object-cover ${!isAvailable ? "grayscale" : ""
              }`}
          />
          {!isAvailable && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <span className="text-[10px] font-bold text-white uppercase bg-black/60 px-2 py-0.5 rounded">
                {statusLabel}
              </span>
            </div>
          )}
        </div>

        {/* Room Info */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <h3 className="font-serif text-lg font-bold text-[#1c1c16]">
              {room.name ||
                room.roomName ||
                `Bedroom ${index + 1}`}
            </h3>
            {isAvailable ? (
              <span className="bg-sage-light text-[#294c25] border border-[#b8deb0] px-2.5 py-0.5 rounded-full text-xs font-bold">
                Available
              </span>
            ) : (
              <span className="bg-[#f1f0ea] text-muted-copy border border-[#e1ded5] px-2.5 py-0.5 rounded-full text-xs font-medium">
                {statusLabel}
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-1 text-[#1c1c16]">
            <span className="font-serif text-lg font-bold text-[#4f614d]">
              ฿{Number(roomPrice).toLocaleString()}
            </span>
            <span className="text-xs text-muted-copy">
              / month
            </span>
          </div>

          {/* Features Tags */}
          <div className="flex flex-wrap gap-2 text-xs text-muted-copy">
            <span className="bg-[#f1eee4] px-2 py-0.5 rounded">
              {room.capacity
                ? `Capacity: ${room.capacity}`
                : "Single Bed"}
            </span>
          </div>
        </div>
      </div>

      {/* Action Link */}
      <div className="flex items-center justify-end sm:justify-center">
        {isAvailable ? (
          <Link
            to={`/properties/${propertyId}/${roomId}`}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#4f614d] text-white text-xs font-bold hover:bg-[#41513f] transition-all text-center cursor-pointer shadow-xs active:scale-98"
            onClick={(e) => e.stopPropagation()}
          >
            View Room Details
          </Link>
        ) : (
          <span className="text-xs text-[#889188] bg-[#f1f0ea] px-4 py-2 rounded-xl font-medium cursor-not-allowed">
            Unavailable
          </span>
        )}
      </div>
    </div>
  );
};

export default RoomCard;
