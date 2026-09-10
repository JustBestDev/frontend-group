import { Link } from "react-router";
import { ChevronRight, Users, Loader2, MessageCircle } from "lucide-react";

const BookingSidebar = ({
  property,
  propertyId,
  isWholeUnit,
  rooms,
  displayPrice,
  selectedRoom,
  selectedRoomId,
  setSelectedRoomId,
  handleRequestToRent,
  handleShare,
  handleContactOwner,
  isContactingOwner,
}) => {

  return (
    <div className="bg-white border border-[#e1e5dd] rounded-2xl p-6 sm:p-7 shadow-xs space-y-6">
      <div>
        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1c1c16] mb-1">
          Interested in this property?
        </h3>
        <div className="flex items-baseline gap-1.5 mt-2">
          <span className="text-xs text-muted-copy">
            {isWholeUnit ? "Property rate:" : "Selected room rate:"}
          </span>
          <span className="font-serif text-2xl font-bold text-[#4f614d]">
            ฿{Number(displayPrice).toLocaleString()}
          </span>
          <span className="text-xs text-muted-copy">/ month</span>
        </div>
      </div>

      {/* Room Selection Dropdown */}
      {!isWholeUnit && rooms.length > 0 && (
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#1c1c16] uppercase tracking-wider">
            Select Bedroom
          </label>
          <select
            value={selectedRoomId}
            onChange={(e) => setSelectedRoomId(e.target.value)}
            className="w-full bg-[#f7f5ee] border border-[#e1ded5] rounded-xl px-3.5 py-2.5 text-sm text-[#1c1c16] focus:outline-hidden focus:ring-2 focus:ring-[#4f614d] font-medium"
          >
            {rooms.map((r, i) => {
              const id = String(r.id || r.roomId || i + 1);
              const isAvail =
                (r.status || r.roomStatus || "").toUpperCase() ===
                "AVAILABLE" ||
                (!r.status && !r.roomStatus);
              return (
                <option key={id} value={id} disabled={!isAvail}>
                  {r.name || r.roomName || `Bedroom ${i + 1}`} (฿
                  {Number(
                    r.monthlyRent || property.monthlyRent || 0,
                  ).toLocaleString()}
                  /mo) {isAvail ? "• Available" : "• Occupied"}
                </option>
              );
            })}
          </select>
        </div>
      )}

      {/* Lease Breakdown Summary */}
      <div className="bg-[#f7f5ee] p-4 rounded-xl space-y-2.5 text-xs text-[#414753] border border-[#ece8dc]">
        <div className="flex justify-between items-center">
          <span className="text-muted-copy">Security Deposit</span>
          <span className="font-bold text-[#1c1c16]">1 - 2 Months</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-copy">Minimum Lease</span>
          <span className="font-bold text-[#1c1c16]">
            6 - 12 Months
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-copy">
            Utilities (Water / Power)
          </span>
          <span className="font-bold text-[#1c1c16]">
            Billed by meter
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2.5 pt-1">
        {isWholeUnit ? (
          <button
            type="button"
            onClick={handleRequestToRent}
            className="w-full py-3 px-4 rounded-xl bg-[#4f614d] text-white text-sm font-bold hover:bg-[#41513f] transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-98"
          >
            Request to Rent
          </button>
        ) : selectedRoom && (
          <Link
            to={`/properties/${propertyId}/${selectedRoom.id || selectedRoom.roomId || selectedRoomId}`}
            className="w-full py-3 px-4 rounded-xl bg-[#4f614d] text-white text-sm font-bold hover:bg-[#41513f] transition-all flex items-center justify-center gap-2 shadow-xs active:scale-98"
          >
            <span>View Room Details</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}

        {isWholeUnit && (
          <button
            type="button"
            onClick={handleShare}
            className="w-full py-3 px-4 rounded-xl border border-[#4f614d] text-[#4f614d] bg-white hover:bg-sage-light/40 text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Users className="w-4 h-4" />
            Find Roommates / Share
          </button>
        )}

        <button
          type="button"
          onClick={handleContactOwner}
          disabled={isContactingOwner}
          className="w-full py-3 px-4 rounded-xl border border-[#4f614d] text-[#4f614d] bg-white hover:bg-sage-light/40 text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
        >
          {isContactingOwner ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageCircle className="w-4 h-4" />}
          <span>{isContactingOwner ? "Opening conversation..." : "Contact Host"}</span>
        </button>
      </div>
    </div>
  );
};

export default BookingSidebar;
