export function getGalleryImages(property) {
  if (!property) return [];
  const list = [];
  if (Array.isArray(property.images) && property.images.length > 0) {
    property.images.forEach((img) => {
      const url = typeof img === "string" ? img : img.imageUrl || img.url;
      if (url) list.push(url);
    });
  } else if (property.imageUrl) {
    list.push(property.imageUrl);
  }

  return list;
}

export function getPropertyDetails(property, selectedRoomId) {
  // Extracted and computed property data
  const rooms = Array.isArray(property.rooms) ? property.rooms : [];
  const isWholeUnit = property.rentType === "WHOLE_UNIT";
  const activeRentalStatus = property.activeRental?.status?.toUpperCase();
  const hasActiveRental = Boolean(
    property.hasActiveRental || property.activeRental,
  );
  const isReserved = Boolean(
    property.isReserved || activeRentalStatus === "PENDING",
  );
  const isRented = Boolean(
    property.isRented ||
      property.propertyStatus?.toUpperCase() === "RENTED" ||
      activeRentalStatus === "ACTIVE",
  );
  const isWholeUnitUnavailable = Boolean(
    isWholeUnit &&
      (property.propertyStatus?.toUpperCase() !== "AVAILABLE" ||
        hasActiveRental ||
        isReserved ||
        isRented),
  );
  const wholeUnitStatus = !isWholeUnitUnavailable
    ? "AVAILABLE"
    : isReserved
      ? "RESERVED"
      : isRented
        ? "RENTED"
        : "UNAVAILABLE";
  const availableRooms = isWholeUnitUnavailable
    ? []
    : rooms.filter(
        (room) =>
          (room.status || room.roomStatus || "").toUpperCase() === "AVAILABLE",
      );
  const roomStatusCounts = rooms.reduce((counts, room) => {
    const status = (room.status || room.roomStatus || "UNKNOWN").toUpperCase();
    counts[status] = (counts[status] || 0) + 1;
    return counts;
  }, {});
  const isUnavailableForCommunity = isWholeUnit
    ? isWholeUnitUnavailable
    : rooms.length > 0 && availableRooms.length === 0;

  const address =
    property.address?.fullAddress ||
    [
      property.address?.building,
      property.address?.addressLine,
      property.address?.road,
      property.address?.subDistrict || property.address?.subdistrict,
      property.address?.district,
      property.address?.province,
      property.address?.postcode || property.address?.postalCode,
    ]
      .filter(Boolean)
      .join(", ") ||
    property.location ||
    property.city ||
    "";

  const owner = property.owner || property.user || {};
  const ownerProfile = owner.profile || {};
  const ownerDisplayName =
    ownerProfile.displayName ||
    ownerProfile.fullName ||
    [ownerProfile.firstName, ownerProfile.lastName].filter(Boolean).join(" ") ||
    owner.username ||
    "Property Host";

  const selectedRoom = rooms.find(
    (room) => String(room.id || room.roomId) === String(selectedRoomId),
  ) || availableRooms[0] || rooms[0];

  const roomRents = rooms
    .filter((room) => room.monthlyRent != null)
    .map((room) => Number(room.monthlyRent))
    .filter((rent) => Number.isFinite(rent));
  const roomStartingPrice = roomRents.length ? Math.min(...roomRents) : null;

  const displayPrice = isWholeUnit
    ? property.monthlyRent ?? null
    : selectedRoom?.monthlyRent ?? null;

  return {
    rooms,
    isWholeUnit,
    hasActiveRental,
    isReserved,
    isRented,
    isWholeUnitUnavailable,
    isUnavailableForCommunity,
    wholeUnitStatus,
    availableRooms,
    roomStatusCounts,
    roomStartingPrice,
    address,
    ownerProfile,
    ownerDisplayName,
    selectedRoom,
    displayPrice,
  };
}
