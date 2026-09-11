import RoomCard from "./RoomCard.jsx";

const STATUS_STYLES = {
  AVAILABLE: "bg-[#dcebd8] text-[#315d38]",
  RESERVED: "bg-[#fff0cf] text-[#8d681e]",
  RENTED: "bg-[#ecebe6] text-muted-copy",
};

const RoomSection = ({
  propertyId,
  rooms,
  isWholeUnit,
  wholeUnitStatus,
  roomStatusCounts,
  galleryImages,
  selectedRoomId,
  setSelectedRoomId,
}) => {
  if (rooms.length === 0) return null;

  const statuses = Object.entries(roomStatusCounts);

  return (
    <section>
      <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="font-serif text-2xl font-bold text-forest sm:text-3xl">{isWholeUnit ? "Rooms in this property" : "Available Rooms"}</h2>
          <p className="mt-1 text-sm text-muted-copy">{isWholeUnit ? "View the rooms included in this property." : "Select a room to keep its details synchronized with the sidebar."}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {isWholeUnit ? (
            <span className={`rounded-full px-3 py-1.5 text-[11px] font-bold ${STATUS_STYLES[wholeUnitStatus] || "bg-[#ecebe6] text-muted-copy"}`}>Unit {wholeUnitStatus.charAt(0) + wholeUnitStatus.slice(1).toLowerCase()}</span>
          ) : statuses.map(([status, count]) => (
            <span key={status} className={`rounded-full px-3 py-1.5 text-[11px] font-bold ${STATUS_STYLES[status] || "bg-[#ecebe6] text-muted-copy"}`}>
              {count} {status.charAt(0) + status.slice(1).toLowerCase()}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {rooms.map((room, index) => (
          <RoomCard
            key={room.id || room.roomId || index + 1}
            room={room}
            index={index}
            propertyId={propertyId}
            galleryImages={galleryImages}
            selectedRoomId={selectedRoomId}
            setSelectedRoomId={setSelectedRoomId}
            wholeUnitStatus={wholeUnitStatus}
          />
        ))}
      </div>
    </section>
  );
};

export default RoomSection;
