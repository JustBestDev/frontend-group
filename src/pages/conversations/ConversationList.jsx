import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  MessageCircle,
  RefreshCw,
  Send,
  Check,
  CheckCheck,
} from "lucide-react";
import api from "../../services/api";
import { createSocketClient, SOCKET_EVENTS } from "../../services/socket.js";
import useAuthStore from "../../stores/authStore.js";
import { useLocation } from "react-router";

const sortMessagesOldestFirst = (messageList) =>
  [...messageList].sort((firstMessage, secondMessage) => {
    const firstTime = new Date(firstMessage.createdAt || 0).getTime();
    const secondTime = new Date(secondMessage.createdAt || 0).getTime();

    if (firstTime !== secondTime) return firstTime - secondTime;
    return (firstMessage.id || 0) - (secondMessage.id || 0);
  });

const getCreatedMessage = (response) => {
  const data = response.data?.data;

  if (data?.message && typeof data.message === "object") {
    return data.message;
  }

  if (data && typeof data === "object") return data;

  return typeof response.data?.message === "object"
    ? response.data.message
    : null;
};

const getConversationId = (conversation) =>
  conversation?.id || conversation?.conversationId;

const getSocketMessage = (payload) => {
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

const ConversationList = () => {
  const isOwnerView = useLocation().pathname.startsWith("/owner");
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [messageLoading, setMessageLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const messagesContainerRef = useRef(null);
  const socketRef = useRef(null);
  const selectedConversationRef = useRef(null);

  const currentUser = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  const fetchConversations = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/conversations");

      const conversationData =
        response.data.data?.conversations ||
        response.data.data ||
        response.data.conversations ||
        [];

      setConversations(Array.isArray(conversationData) ? conversationData : []);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to retrieve conversations",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    selectedConversationRef.current = selectedConversation;
  }, [selectedConversation]);

  useEffect(() => {
    if (!token) return undefined;

    const socket = createSocketClient(token);
    socketRef.current = socket;

    const handleConnect = () => {
      const conversationId = getConversationId(selectedConversationRef.current);
      if (conversationId) {
        socket.emit(SOCKET_EVENTS.JOIN_CONVERSATION, { conversationId });

        api
          .get(`/conversations/${conversationId}/messages`)
          .then((response) => {
            if (
              String(getConversationId(selectedConversationRef.current)) !==
              String(conversationId)
            ) {
              return;
            }

            const messageData =
              response.data.data?.messages ||
              response.data.data ||
              response.data.messages ||
              [];

            if (Array.isArray(messageData)) {
              setMessages(sortMessagesOldestFirst(messageData));
            }
          })
          .catch(() => {});
      }
    };

    const handleNewMessage = (payload) => {
      const socketMessage = getSocketMessage(payload);
      if (!socketMessage?.conversationId) return;

      const { conversationId, message } = socketMessage;
      const selectedId = getConversationId(selectedConversationRef.current);
      const isSelected = String(selectedId) === String(conversationId);

      if (isSelected) {
        setMessages((currentMessages) => {
          const alreadyExists = currentMessages.some(
            (item) =>
              item.id && message.id && String(item.id) === String(message.id),
          );
          return alreadyExists
            ? currentMessages
            : sortMessagesOldestFirst([...currentMessages, message]);
        });

        api.patch(`/conversations/${conversationId}/read`).catch(() => {});
      }

      setConversations((currentConversations) => {
        const itemIndex = currentConversations.findIndex(
          (item) => String(getConversationId(item)) === String(conversationId),
        );
        if (itemIndex < 0) return currentConversations;

        const conversation = currentConversations[itemIndex];
        const updatedConversation = {
          ...conversation,
          lastMessage: message,
          messages: [message],
          unreadCount: isSelected ? 0 : (conversation.unreadCount || 0) + 1,
        };

        return [
          updatedConversation,
          ...currentConversations.filter((_, index) => index !== itemIndex),
        ];
      });
    };

    const handleMessagesRead = ({ conversationId, readerId }) => {
      const selectedId = getConversationId(selectedConversationRef.current);
      if (String(selectedId) !== String(conversationId)) return;

      setMessages((currentMessages) =>
        currentMessages.map((message) => {
          const senderId = message.senderId || message.sender?.id;
          return String(senderId) !== String(readerId)
            ? { ...message, isRead: true }
            : message;
        }),
      );
    };

    socket.on("connect", handleConnect);
    socket.on(SOCKET_EVENTS.NEW_MESSAGE, handleNewMessage);
    socket.on(SOCKET_EVENTS.MESSAGES_READ, handleMessagesRead);
    socket.connect();

    return () => {
      socket.off("connect", handleConnect);
      socket.off(SOCKET_EVENTS.NEW_MESSAGE, handleNewMessage);
      socket.off(SOCKET_EVENTS.MESSAGES_READ, handleMessagesRead);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token]);

  useEffect(() => {
    const conversationId = getConversationId(selectedConversation);
    const socket = socketRef.current;
    if (!conversationId || !socket) return undefined;

    socket.emit(SOCKET_EVENTS.JOIN_CONVERSATION, { conversationId });

    return () => {
      socket.emit(SOCKET_EVENTS.LEAVE_CONVERSATION, { conversationId });
    };
  }, [selectedConversation]);

  useEffect(() => {
    if (messageLoading || messages.length === 0) return;

    const frameId = requestAnimationFrame(() => {
      const container = messagesContainerRef.current;
      container?.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    });

    return () => cancelAnimationFrame(frameId);
  }, [messageLoading, messages]);

  const openConversation = async (conversation) => {
    const conversationId = conversation.id || conversation.conversationId;

    setSelectedConversation(conversation);
    setMessageLoading(true);
    setMessages([]);
    setError("");

    try {
      const response = await api.get(
        `/conversations/${conversationId}/messages`,
      );

      const messageData =
        response.data.data?.messages ||
        response.data.data ||
        response.data.messages ||
        [];

      setMessages(
        Array.isArray(messageData) ? sortMessagesOldestFirst(messageData) : [],
      );

      await api.patch(`/conversations/${conversationId}/read`);

      setConversations((currentConversations) =>
        currentConversations.map((item) => {
          const itemId = item.id || item.conversationId;

          return itemId === conversationId ? { ...item, unreadCount: 0 } : item;
        }),
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to retrieve messages",
      );
    } finally {
      setMessageLoading(false);
    }
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();

    const content = newMessage.trim();

    if (!content || !selectedConversation) return;

    const conversationId =
      selectedConversation.id || selectedConversation.conversationId;

    setSending(true);
    setError("");

    try {
      const response = await api.post(
        `/conversations/${conversationId}/messages`,
        { message: content },
      );

      const createdMessage = getCreatedMessage(response);

      if (createdMessage) {
        setMessages((currentMessages) => {
          const alreadyExists = currentMessages.some(
            (message) =>
              message.id &&
              createdMessage.id &&
              String(message.id) === String(createdMessage.id),
          );

          return alreadyExists
            ? currentMessages
            : sortMessagesOldestFirst([...currentMessages, createdMessage]);
        });

        setConversations((currentConversations) => {
          const itemIndex = currentConversations.findIndex(
            (item) =>
              String(getConversationId(item)) === String(conversationId),
          );
          if (itemIndex < 0) return currentConversations;

          const updatedConversation = {
            ...currentConversations[itemIndex],
            lastMessage: createdMessage,
            messages: [createdMessage],
          };

          return [
            updatedConversation,
            ...currentConversations.filter((_, index) => index !== itemIndex),
          ];
        });
      } else {
        await openConversation(selectedConversation);
      }

      setNewMessage("");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to send the message",
      );
    } finally {
      setSending(false);
    }
  };

  const getConversationUser = (conversation) => {
    return (
      conversation.members?.find(
        (member) =>
          member.user?.id !== (currentUser?.id || currentUser?.userId),
      )?.user ||
      conversation.otherUser ||
      conversation.participant ||
      conversation.user ||
      conversation.owner ||
      {}
    );
  };

  const getUserName = (conversation) => {
    const user = getConversationUser(conversation);

    return (
      user.username ||
      user.profile?.displayName ||
      user.profile?.firstName ||
      user.email ||
      conversation.title ||
      "Conversation"
    );
  };

  const isMyMessage = (message) => {
    const senderId = message.senderId || message.sender?.id;

    const currentUserId = currentUser?.id || currentUser?.userId;

    return Boolean(currentUserId && senderId === currentUserId);
  };

  if (loading) {
    return (
      <div className="grid min-h-64 place-items-center text-muted-copy">
        Loading conversations...
      </div>
    );
  }

  return (
    <section className="mx-auto flex h-[calc(100dvh-40px)] min-h-0 w-full max-w-[1320px] flex-col overflow-hidden md:h-[calc(100dvh-72px)]">
      <div className="mb-6 flex shrink-0 items-end justify-between gap-6 max-sm:flex-col max-sm:items-stretch">
        <div>
          <p className="mb-1 text-xs font-extrabold uppercase tracking-[0.18em] text-terracotta">
            {isOwnerView ? "Inbox" : "Messages"}
          </p>
          <h1 className="m-0 font-serif text-3xl leading-tight text-ink md:text-4xl">
            {isOwnerView ? "Messages" : "Conversations"}
          </h1>
          <p className="mt-2 text-muted-copy">
            View and respond to your conversations.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-line bg-white px-4 py-3 text-sm font-bold text-ink transition hover:border-sage hover:bg-sage-light/40"
          onClick={fetchConversations}
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {error && (
        <p
          className="mb-4 shrink-0 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-danger"
          role="alert"
        >
          {error}
        </p>
      )}

      <div className="grid min-h-0 flex-1 grid-cols-[330px_minmax(0,1fr)] overflow-hidden rounded-2xl border border-line bg-white shadow-[0_10px_30px_rgba(76,91,75,0.07)] max-[850px]:block">
        <aside
          className={`h-full min-h-0 overflow-y-auto border-r border-line bg-[#fbfcf9] overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-[850px]:w-full max-[850px]:border-r-0 ${selectedConversation ? "max-[850px]:hidden" : ""}`}
        >
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-[#fbfcf9] p-5">
            <h2 className="m-0 text-lg font-bold text-ink">Messages</h2>
            <span className="min-w-7 rounded-full bg-sage-light px-2 py-1 text-center text-xs font-extrabold text-sage-dark">
              {conversations.length}
            </span>
          </div>

          {conversations.length === 0 ? (
            <div className="grid h-full place-content-center justify-items-center p-8 text-center text-muted-copy">
              <MessageCircle size={38} />
              <h3 className="mb-1 mt-3 font-bold text-ink">No conversations</h3>
              <p className="m-0">Your conversations will appear here.</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {conversations.map((conversation) => {
                const conversationId =
                  conversation.id || conversation.conversationId;

                const selectedId =
                  selectedConversation?.id ||
                  selectedConversation?.conversationId;

                const lastMessage =
                  conversation.lastMessage || conversation.messages?.[0];

                return (
                  <button
                    type="button"
                    key={conversationId}
                    className={`flex w-full cursor-pointer items-center gap-3 border-0 border-b border-line px-4.5 py-4 text-left transition hover:bg-sage-light/60 ${selectedId === conversationId ? "bg-sage-light" : "bg-transparent"}`}
                    onClick={() => openConversation(conversation)}
                  >
                    <div className="grid size-11 shrink-0 place-items-center rounded-full bg-sage-dark text-base font-extrabold text-white">
                      {getUserName(conversation).charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <strong className="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-ink">
                          {getUserName(conversation)}
                        </strong>

                        {conversation.unreadCount > 0 && (
                          <span className="min-w-5 rounded-full bg-terracotta px-1.5 py-0.5 text-center text-[10px] text-white">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>

                      <p className="mt-1 overflow-hidden text-ellipsis whitespace-nowrap text-[13px] text-muted-copy">
                        {lastMessage?.content ||
                          lastMessage?.message ||
                          "No messages yet"}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </aside>

        <div
          className={`h-full min-h-0 min-w-0 flex-col overflow-hidden bg-cream ${selectedConversation ? "flex" : "flex max-[850px]:hidden"}`}
        >
          {!selectedConversation ? (
            <div className="grid h-full place-content-center justify-items-center p-8 text-center text-muted-copy">
              <MessageCircle size={48} />
              <h2 className="mb-1 mt-3 text-xl font-bold text-ink">
                Select a conversation
              </h2>
              <p className="m-0">Choose a conversation to view its messages.</p>
            </div>
          ) : (
            <>
              <header className="flex shrink-0 items-center gap-3 border-b border-line bg-white px-5 py-4">
                <button
                  type="button"
                  className="hidden cursor-pointer place-items-center rounded-lg border-0 bg-transparent p-2 text-sage-dark max-[850px]:grid"
                  onClick={() => setSelectedConversation(null)}
                  aria-label="Back to conversations"
                >
                  <ArrowLeft size={20} />
                </button>

                <div className="grid size-11 shrink-0 place-items-center rounded-full bg-sage-dark text-base font-extrabold text-white">
                  {getUserName(selectedConversation).charAt(0).toUpperCase()}
                </div>

                <div>
                  <h2 className="m-0 text-base font-bold text-ink">
                    {getUserName(selectedConversation)}
                  </h2>
                  <span className="text-xs text-muted-copy">Conversation</span>
                </div>
              </header>

              <div
                ref={messagesContainerRef}
                className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:p-6"
              >
                {messageLoading ? (
                  <div className="grid h-full place-content-center text-muted-copy">
                    Loading messages...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="grid h-full place-content-center text-center text-muted-copy">
                    <p className="m-0">No messages in this conversation.</p>
                  </div>
                ) : (
                  messages.map((message) => {
                    const messageId = message.id || message.messageId;
                    const myMessage = isMyMessage(message);

                    return (
                      <div
                        key={messageId}
                        className={`mb-3 flex ${myMessage ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[min(78%,520px)] px-3.5 pb-2 pt-3 shadow-[0_3px_10px_rgba(60,72,59,0.05)] ${myMessage ? "rounded-2xl rounded-br-sm bg-sage-dark text-white" : "rounded-2xl rounded-bl-sm border border-line bg-white text-ink"}`}
                        >
                          <p className="m-0 [overflow-wrap:anywhere] text-sm leading-6">
                            {message.content || message.message}
                          </p>

                          <div
                            className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${myMessage ? "text-white/70" : "text-muted-copy"}`}
                          >
                            {message.createdAt
                              ? new Date(message.createdAt).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )
                              : ""}
                            {myMessage && (
                              <>
                                <span aria-hidden="true">·</span>
                                {message.isRead ? (
                                  <CheckCheck size={15} aria-label="Read" />
                                ) : (
                                  <Check size={15} aria-label="Sent" />
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <form
                className="flex shrink-0 gap-2.5 border-t border-line bg-white p-4"
                onSubmit={handleSendMessage}
              >
                <input
                  type="text"
                  value={newMessage}
                  placeholder="Write a message..."
                  onChange={(event) => setNewMessage(event.target.value)}
                  disabled={sending}
                  className="min-w-0 flex-1 rounded-xl border border-line bg-[#fafbf8] px-4 py-3 text-ink outline-none transition focus:border-sage-dark focus:ring-3 focus:ring-sage-dark/10 disabled:opacity-60"
                />

                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className={`grid size-12 shrink-0 cursor-pointer place-items-center rounded-xl border-0 bg-terracotta px-4 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50 ${isOwnerView ? "sm:w-auto sm:inline-flex sm:gap-2" : ""}`}
                >
                  <Send size={19} />
                  {isOwnerView && <span>Send</span>}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default ConversationList;
