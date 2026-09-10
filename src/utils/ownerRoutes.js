export const ownerPropertyPath = (propertyId) =>
  `/owner/properties/${propertyId}`;

export const ownerRoomPath = (propertyId, roomId) =>
  `${ownerPropertyPath(propertyId)}/rooms/${roomId}`;

export const ownerEditRoomPath = (propertyId, roomId) =>
  `${ownerRoomPath(propertyId, roomId)}/edit`;

export const ownerRentalPath = (rentalId) => `/owner/rentals/${rentalId}`;

export const ownerRentalRequestPath = (requestId) =>
  `/owner/rental-requests/${requestId}`;

export const ownerUserProfilePath = (userId) => `/owner/users/${userId}`;

export const ownerRentalRequestRoomPath = (request) =>
  request.room?.id
    ? ownerRoomPath(request.propertyId, request.room.id)
    : null;

export const findOwnerRoom = (properties, propertyId, roomId) =>
  properties
    .find(({ id }) => String(id) === String(propertyId))
    ?.rooms?.find(({ id }) => String(id) === String(roomId));

export const findOwnerRentalRequest = (requests, requestId) =>
  requests.find(({ id }) => String(id) === String(requestId));
