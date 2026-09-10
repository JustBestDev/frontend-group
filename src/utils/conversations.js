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
