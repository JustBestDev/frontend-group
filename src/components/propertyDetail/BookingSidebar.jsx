import { ChevronRight, Loader2, MessageCircle, Users } from "lucide-react";
import { Link } from "react-router";

const BookingSidebar = ({
  property,
  propertyId,
  isWholeUnit,
  isReserved,
  isRented,
  isWholeUnitUnavailable,
  rooms,
  displayPrice,
  roomStartingPrice,
  selectedRoom,
  selectedRoomId,
  setSelectedRoomId,
  handleRequestToRent,
  handleShare,
  handleContactOwner,
  isContactingOwner,
}) => {
  const selectedStatus = (selectedRoom?.status || selectedRoom?.roomStatus || "UNKNOWN").toUpperCase();
  const selectedIsAvailable = selectedStatus === "AVAILABLE";

  return (
    <aside className="space-y-5 rounded-[20px] bg-white p-6 shadow-[0_16px_38px_rgba(50,66,54,.1)] sm:p-7">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[.16em] text-muted-copy">{isWholeUnit ? "Monthly rent" : "Selected room rate"}</p>
        {displayPrice != null ? (
          <div className="mt-1 flex items-baseline gap-1.5"><strong className="font-serif text-3xl text-forest">฿{Number(displayPrice).toLocaleString()}</strong><span className="text-xs text-muted-copy">/ month</span></div>
        ) : (
          <p className="mt-2 text-sm font-semibold text-muted-copy">Price not provided</p>
        )}
        {!isWholeUnit && roomStartingPrice != null && <p className="mt-1 text-[11px] text-muted-copy">Rooms start at ฿{Number(roomStartingPrice).toLocaleString()} / month</p>}
      </div>

      {!isWholeUnit && rooms.length > 0 && (
        <div>
          <label htmlFor="property-room-selection" className="mb-2 block text-xs font-bold text-forest">Choose Room Option</label>
          <select id="property-room-selection" value={selectedRoomId} onChange={(event) => setSelectedRoomId(event.target.value)} className="w-full rounded-xl bg-[#f3f1e9] px-4 py-3 text-sm font-semibold text-forest outline-none ring-forest focus:ring-2">
            {rooms.map((room, index) => {
              const id = String(room.id || room.roomId || index + 1);
              const status = (room.status || room.roomStatus || "UNKNOWN").toUpperCase();
              const available = status === "AVAILABLE";
              return <option key={id} value={id} disabled={!available}>{room.name || room.roomName || `Room ${index + 1}`}{room.monthlyRent != null ? ` — ฿${Number(room.monthlyRent).toLocaleString()}/mo` : ""} · {status.charAt(0) + status.slice(1).toLowerCase()}</option>;
            })}
          </select>
        </div>
      )}

      <div className="space-y-2.5">
        {isWholeUnit ? (
          <button type="button" onClick={handleRequestToRent} disabled={isWholeUnitUnavailable} className={`flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-bold transition ${isWholeUnitUnavailable ? "cursor-not-allowed bg-[#ecebe6] text-muted-copy" : "cursor-pointer bg-forest text-white hover:bg-[#0f2c24]"}`}>
            {isReserved ? "Currently Reserved" : isRented ? "Currently Rented" : isWholeUnitUnavailable ? "Unavailable" : "Request to Rent"}
          </button>
        ) : selectedRoom && selectedIsAvailable ? (
          <Link to={`/properties/${propertyId}/${selectedRoom.id || selectedRoom.roomId || selectedRoomId}`} className="flex w-full items-center justify-center gap-2 rounded-xl bg-forest px-4 py-3 text-sm font-bold text-white transition hover:bg-[#0f2c24]">View Room Details <ChevronRight className="size-4" /></Link>
        ) : (
          <span className="flex w-full items-center justify-center rounded-xl bg-[#ecebe6] px-4 py-3 text-sm font-bold text-muted-copy">No room available</span>
        )}

        {isWholeUnit && (
          <button type="button" onClick={handleShare} disabled={isWholeUnitUnavailable} className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${isWholeUnitUnavailable ? "cursor-not-allowed bg-[#ecebe6] text-muted-copy" : "cursor-pointer bg-sage-light text-forest hover:bg-[#dbe6d7]"}`}><Users className="size-4" />{isWholeUnitUnavailable ? "Cannot Share Unavailable Property" : "Find Roommates / Share"}</button>
        )}

        <button type="button" onClick={handleContactOwner} disabled={isContactingOwner} className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-forest transition hover:bg-[#f3f1e9] disabled:cursor-wait">
          {isContactingOwner ? <Loader2 className="size-4 animate-spin" /> : <MessageCircle className="size-4" />} {isContactingOwner ? "Opening conversation..." : "Contact Host"}
        </button>
      </div>

      <div className="border-t border-line pt-4">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[.12em] text-muted-copy">Rental information</p>
        {property.deposit != null && <div className="flex justify-between gap-4 text-xs"><span className="text-muted-copy">Security deposit</span><strong className="text-forest">฿{Number(property.deposit).toLocaleString()}</strong></div>}
        <p className="mt-3 text-[11px] leading-5 text-muted-copy">Lease terms and utilities should be confirmed with the host before requesting to rent.</p>
      </div>
    </aside>
  );
};

export default BookingSidebar;
