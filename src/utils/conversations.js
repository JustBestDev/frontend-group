export const sortMessagesOldestFirst = (messageList) =>
  [...messageList].sort((firstMessage, secondMessage) => {
    const firstTime = new Date(firstMessage.createdAt || 0).getTime();
    const secondTime = new Date(secondMessage.createdAt || 0).getTime();

    if (firstTime !== secondTime) return firstTime - secondTime;
    return (firstMessage.id || 0) - (secondMessage.id || 0);
  });

export const getCreatedMessage = (response) => {
  const data = response.data?.data;

  if (data?.message && typeof data.message === "object") {
    return data.message;
  }

  if (data && typeof data === "object") return data;

  return typeof response.data?.message === "object"
    ? response.data.message
    : null;
};

export const getConversationId = (conversation) =>
  conversation?.id || conversation?.conversationId;

export const getMessagePreview = (message) => {
  const content = message?.content || message?.message;
  if (content?.trim()) return content.trim();
  if (message?.type === "PROPERTY_SHARE") return "Shared a property";
  if (message?.type === "ROOM_SHARE") return "Shared a room";
  return "No messages yet";
};

export const isSharedListingMessage = (message) =>
  message?.type === "PROPERTY_SHARE" || message?.type === "ROOM_SHARE";

export const getSharedListingPath = (message, ownerPortal = false) => {
  const isRoom = message?.type === "ROOM_SHARE";
  const listing = isRoom ? message?.sharedRoom : message?.sharedProperty;
  if (!listing) return null;
  const propertyId = isRoom ? listing.property?.id : listing.id;
  if (!propertyId) return null;
  if (ownerPortal) {
    return isRoom
      ? `/owner/properties/${propertyId}/rooms/${listing.id}`
      : `/owner/properties/${listing.id}`;
  }
  return isRoom
    ? `/properties/${propertyId}/${listing.id}`
    : `/properties/${listing.id}`;
};

export const shareListingWithHost = async (
  api,
  { propertyId, ownerId, roomId },
) => {
  const response = await api.post("/conversations", {
    propertyId: Number(propertyId),
    memberId: Number(ownerId),
  });
  const conversation = response.data.conversation || response.data.data?.conversation;
  const conversationId = getConversationId(conversation);
  if (!conversationId) throw new Error("Conversation was not returned");

  await api.post(`/conversations/${conversationId}/messages`, roomId
    ? { type: "ROOM_SHARE", roomId: Number(roomId) }
    : { type: "PROPERTY_SHARE", propertyId: Number(propertyId) });

  return conversationId;
};

export const getSocketMessage = (payload) => {
  const nestedData = payload?.data;
  const message =
    (typeof nestedData?.message === "object" && nestedData.message) ||
    (typeof nestedData === "object" && nestedData) ||
    (typeof payload?.message === "object" && payload.message) ||
    payload;

  if (!message || typeof message !== "object") return null;

  return {
    conversationId: payload?.conversationId || message.conversationId,
    message,
  };
};
