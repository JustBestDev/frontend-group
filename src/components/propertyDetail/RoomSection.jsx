import RoomCard from "./RoomCard.jsx";

const RoomSection = ({
  property,
  propertyId,
  rooms,
  isWholeUnit,
  wholeUnitStatus,
  availableRooms,
  occupiedRoomsCount,
  galleryImages,
  selectedRoomId,
  setSelectedRoomId,
}) => {
  if (rooms.length === 0) return null;

  return (
    <>
      {/* Room Availability Status Banner */}
      <div className="bg-white p-6 rounded-2xl border border-[#e1e5dd] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#1c1c16]">
              {isWholeUnit ? "Rooms in this property" : "Unit Room Status"}
            </h2>
            <p className="text-xs text-muted-copy mt-0.5">
              {isWholeUnit
                ? `This property has ${rooms.length} ${rooms.length === 1 ? "room" : "rooms"}.`
                : `This unit has ${rooms.length || 1} bedrooms available for individual rental.`}
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {isWholeUnit ? (
              <div
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border ${wholeUnitStatus === "AVAILABLE" ? "bg-sage-light border-[#cbe0c6] text-[#294c25]" : "bg-[#fde8e6] border-[#f4c7c3] text-danger"}`}
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full ${wholeUnitStatus === "AVAILABLE" ? "bg-[#4f614d]" : "bg-danger"}`}
                />
                Unit{" "}
                {wholeUnitStatus === "AVAILABLE"
                  ? "Available"
                  : wholeUnitStatus === "RESERVED"
                    ? "Reserved"
                    : wholeUnitStatus === "RENTED"
                      ? "Rented"
                      : "Unavailable"}
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 bg-sage-light border border-[#cbe0c6] px-3.5 py-1.5 rounded-full text-xs font-bold text-[#294c25]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4f614d]" />
                {availableRooms.length} Available
              </div>
            )}
            {!isWholeUnit && occupiedRoomsCount > 0 && (
              <div className="inline-flex items-center gap-2 bg-[#f1f0ea] border border-[#e1ded5] px-3.5 py-1.5 rounded-full text-xs font-medium text-muted-copy">
                <span className="w-2.5 h-2.5 rounded-full bg-[#a8b0a7]" />
                {occupiedRoomsCount} Occupied
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bedroom Selection Cards (Stitch Style) */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#e1e5dd] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1c1c16]">
              {isWholeUnit ? "Rooms" : "Select a Bedroom"}
            </h2>

            <p className="text-xs sm:text-sm text-muted-copy mt-0.5">
              {isWholeUnit
                ? "View the rooms included in this property."
                : "Choose a room to view pricing, specifications, and amenities."}
            </p>
          </div>
          <span className="text-xs font-semibold text-[#4f614d] bg-sage-light px-3 py-1 rounded-lg">
            {rooms.length} {rooms.length === 1 ? "Room" : "Rooms"} Total
          </span>
        </div>


        <div className="space-y-3.5 pt-2">
          {rooms.map((room, index) => (
            <RoomCard
              key={room.id || room.roomId || index + 1}
              room={room}
              index={index}
              property={property}
              propertyId={propertyId}
              galleryImages={galleryImages}
              selectedRoomId={selectedRoomId}
              setSelectedRoomId={setSelectedRoomId}
              wholeUnitStatus={wholeUnitStatus}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default RoomSection;
