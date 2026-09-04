import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  MessageCircle,
  RefreshCw,
  Send,
} from "lucide-react";
import api from "../../services/api";
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

const ConversationList = () => {
  const isOwnerView = useLocation().pathname.startsWith("/owner");
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] =
    useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [messageLoading, setMessageLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const messagesContainerRef = useRef(null);

  const currentUser = useAuthStore((state) => state.user);

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

      setConversations(
        Array.isArray(conversationData)
          ? conversationData
          : []
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to retrieve conversations"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

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
    const conversationId =
      conversation.id || conversation.conversationId;

    setSelectedConversation(conversation);
    setMessageLoading(true);
    setMessages([]);
    setError("");

    try {
      const response = await api.get(
        `/conversations/${conversationId}/messages`
      );

      const messageData =
        response.data.data?.messages ||
        response.data.data ||
        response.data.messages ||
        [];

      setMessages(
        Array.isArray(messageData)
          ? sortMessagesOldestFirst(messageData)
          : []
      );

      await api.patch(
        `/conversations/${conversationId}/read`
      );

      setConversations((currentConversations) =>
        currentConversations.map((item) => {
          const itemId =
            item.id || item.conversationId;

          return itemId === conversationId
            ? { ...item, unreadCount: 0 }
            : item;
        })
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to retrieve messages"
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
      selectedConversation.id ||
      selectedConversation.conversationId;

    setSending(true);
    setError("");

    try {
      const response = await api.post(
        `/conversations/${conversationId}/messages`,
        { message: content }
      );

      const createdMessage = getCreatedMessage(response);

      if (createdMessage) {
        setMessages((currentMessages) => [
          ...currentMessages,
          createdMessage,
        ]);
      } else {
        await openConversation(selectedConversation);
      }

      setNewMessage("");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to send the message"
      );
    } finally {
      setSending(false);
    }
  };

  const getConversationUser = (conversation) => {
    return (
      conversation.members?.find((member) => member.user?.id !== (currentUser?.id || currentUser?.userId))?.user ||
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
    const senderId =
      message.senderId || message.sender?.id;

    const currentUserId =
      currentUser?.id || currentUser?.userId;

    return Boolean(
      currentUserId && senderId === currentUserId
    );
  };

  if (loading) {
    return (
      <div className={isOwnerView ? "owner-loading" : "admin-page-message"}>
        Loading conversations...
      </div>
    );
  }

  return (
    <section className={isOwnerView ? "owner-resource-page owner-messages-page" : "admin-content"}>
      <div className={isOwnerView ? "owner-resource-header" : "admin-page-header"}>
        <div>
          <p className={isOwnerView ? "owner-eyebrow" : "admin-eyebrow"}>{isOwnerView ? "Inbox" : "Messages"}</p>
          <h1>{isOwnerView ? "Messages" : "Conversations"}</h1>
          <p>View and respond to your conversations.</p>
        </div>

        <button
          type="button"
          className={isOwnerView ? "owner-secondary-button" : "refresh-button"}
          onClick={fetchConversations}
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {error && (
        <p className={isOwnerView ? "owner-alert" : "admin-error"} role="alert">
          {error}
        </p>
      )}

      <div className="conversation-container">
        <aside
          className={`conversation-list-panel ${
            selectedConversation ? "mobile-hidden" : ""
          }`}
        >
          <div className="conversation-list-title">
            <h2>Messages</h2>
            <span>{conversations.length}</span>
          </div>

          {conversations.length === 0 ? (
            <div className="conversation-empty">
              <MessageCircle size={38} />
              <h3>No conversations</h3>
              <p>Your conversations will appear here.</p>
            </div>
          ) : (
            <div className="conversation-items">
              {conversations.map((conversation) => {
                const conversationId =
                  conversation.id ||
                  conversation.conversationId;

                const selectedId =
                  selectedConversation?.id ||
                  selectedConversation?.conversationId;

                const lastMessage =
                  conversation.lastMessage ||
                  conversation.messages?.[0];

                return (
                  <button
                    type="button"
                    key={conversationId}
                    className={`conversation-item ${
                      selectedId === conversationId
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      openConversation(conversation)
                    }
                  >
                    <div className="conversation-avatar">
                      {getUserName(conversation)
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="conversation-summary">
                      <div>
                        <strong>
                          {getUserName(conversation)}
                        </strong>

                        {conversation.unreadCount > 0 && (
                          <span className="unread-badge">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>

                      <p>
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
          className={`conversation-chat-panel ${
            !selectedConversation ? "mobile-hidden" : ""
          }`}
        >
          {!selectedConversation ? (
            <div className="select-conversation">
              <MessageCircle size={48} />
              <h2>Select a conversation</h2>
              <p>
                Choose a conversation to view its messages.
              </p>
            </div>
          ) : (
            <>
              <header className="conversation-chat-header">
                <button
                  type="button"
                  className="conversation-back-button"
                  onClick={() =>
                    setSelectedConversation(null)
                  }
                >
                  <ArrowLeft size={20} />
                </button>

                <div className="conversation-avatar">
                  {getUserName(selectedConversation)
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div>
                  <h2>
                    {getUserName(selectedConversation)}
                  </h2>
                  <span>Conversation</span>
                </div>
              </header>

              <div
                ref={messagesContainerRef}
                className="conversation-messages"
              >
                {messageLoading ? (
                  <div className="conversation-loading">
                    Loading messages...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="conversation-empty">
                    <p>No messages in this conversation.</p>
                  </div>
                ) : (
                  messages.map((message) => {
                    const messageId =
                      message.id || message.messageId;

                    return (
                      <div
                        key={messageId}
                        className={`message-row ${
                          isMyMessage(message)
                            ? "my-message"
                            : "other-message"
                        }`}
                      >
                        <div className="message-bubble">
                          <p>
                            {message.content ||
                              message.message}
                          </p>

                          <span>
                            {message.createdAt
                              ? new Date(
                                  message.createdAt
                                ).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )
                              : ""}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <form
                className="conversation-form"
                onSubmit={handleSendMessage}
              >
                <input
                  type="text"
                  value={newMessage}
                  placeholder="Write a message..."
                  onChange={(event) =>
                    setNewMessage(event.target.value)
                  }
                  disabled={sending}
                />

                <button
                  type="submit"
                  disabled={
                    sending || !newMessage.trim()
                  }
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
