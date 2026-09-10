const FALLBACK_GALLERY = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80",
];

export function getGalleryImages(property) {

  if (!property) return FALLBACK_GALLERY;
  const list = [];
  if (Array.isArray(property.images) && property.images.length > 0) {
    property.images.forEach((img) => {
      const url = typeof img === "string" ? img : img.imageUrl || img.url;
      if (url) list.push(url);
    });
  } else if (property.imageUrl) {
    list.push(property.imageUrl);
  }

  // Fill with pleasant fallbacks if fewer than 5
  if (list.length === 0) return FALLBACK_GALLERY;
  let fallbackIdx = 0;
  while (list.length < 5) {
    list.push(FALLBACK_GALLERY[fallbackIdx % FALLBACK_GALLERY.length]);
    fallbackIdx++;
  }
  return list;

}

export function getPropertyDetails(property, selectedRoomId) {
  // Extracted and computed property data
  const rooms = property.rooms || [];
  const isWholeUnit = property.rentType === "WHOLE_UNIT";
  const availableRooms = rooms.filter(
    (room) =>
      (room.status || room.roomStatus || "").toUpperCase() === "AVAILABLE",
  );
  const occupiedRoomsCount = rooms.length - availableRooms.length;

  const address =
    property.address?.fullAddress ||
    [
      property.address?.addressLine,
      property.address?.subdistrict,
      property.address?.district,
      property.address?.province,
      property.address?.postalCode,
    ]
      .filter(Boolean)
      .join(", ") ||
    property.location ||
    property.city ||
    "Bangkok, Thailand";

  const owner = property.owner || property.user || {};
  const ownerProfile = owner.profile || {};
  const ownerDisplayName =
    ownerProfile.displayName ||
    ownerProfile.fullName ||
    [ownerProfile.firstName, ownerProfile.lastName].filter(Boolean).join(" ") ||
    owner.username ||
    "Property Host";

  const selectedRoom =
    rooms.find((r) => String(r.id || r.roomId) === String(selectedRoomId)) ||
    rooms[0];

  const displayPrice = isWholeUnit
    ? property.monthlyRent || 0
    : selectedRoom?.monthlyRent || property.monthlyRent || 0;

  return {
    rooms,
    isWholeUnit,
    availableRooms,
    occupiedRoomsCount,
    address,
    ownerProfile,
    ownerDisplayName,
    selectedRoom,
    displayPrice,
  };
}
